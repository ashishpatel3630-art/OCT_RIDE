import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/postgres";
import { hashPassword } from "@/lib/password";
import { publicProfile, type AppProfile } from "@/lib/profiles";
import { createSessionTokenForVersion, setSessionCookie } from "@/lib/session";
import { hasValidOrigin, jsonError } from "@/lib/api";
import { databaseConnectionErrorMessage } from "@/lib/database-error";
import { authConfigurationError } from "@/lib/configuration";

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) return jsonError("Invalid request origin.", 403);
  const configurationError = authConfigurationError();
  if (configurationError) {
    return jsonError(configurationError, 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON.", 400);
  }
  if (!body || typeof body !== "object") return jsonError("Invalid registration details.", 400);
  const payload = body as Record<string, unknown>;
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const fullName = typeof payload.fullName === "string" ? payload.fullName.trim() : "";
  const studentNumber = typeof payload.studentNumber === "string" ? payload.studentNumber.trim() : "";
  const academicYear = Number(payload.academicYear);
  const department = typeof payload.department === "string" ? payload.department.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return jsonError("Enter a valid email address.", 400);
  }
  if (fullName.length < 2 || fullName.length > 120) return jsonError("Full name must contain 2 to 120 characters.", 400);
  if (studentNumber.length < 1 || studentNumber.length > 50) return jsonError("Student ID must contain 1 to 50 characters.", 400);
  if (!Number.isInteger(academicYear) || academicYear < 1 || academicYear > 4) {
    return jsonError("Choose a valid academic year.", 400);
  }
  if (department.length < 1 || department.length > 120) return jsonError("Department must contain 1 to 120 characters.", 400);
  if (password.length < 10 || password.length > 128) return jsonError("Password must contain 10 to 128 characters.", 400);

  try {
    const db = await getDatabase();
    const profile: AppProfile = {
      id: randomUUID(),
      email,
      password_hash: await hashPassword(password),
      role: "student",
      full_name: fullName,
      student_number: studentNumber,
      student_number_key: studentNumber.toLocaleLowerCase(),
      academic_year: academicYear,
      department,
      phone: null,
      eligibility_verified: false,
      session_version: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };
    await db.collection<AppProfile>("profiles").insertOne(profile);
    const token = await createSessionTokenForVersion(profile.id, profile.session_version ?? 0);
    const response = NextResponse.json({ profile: publicProfile(profile) }, { status: 201 });
    return setSessionCookie(response, token);
  } catch (cause) {
    if (cause && typeof cause === "object" && "code" in cause && cause.code === 11000) {
      return jsonError("An account with this email or student ID already exists.", 409);
    }
    return jsonError(databaseConnectionErrorMessage(cause), 503);
  }
}
