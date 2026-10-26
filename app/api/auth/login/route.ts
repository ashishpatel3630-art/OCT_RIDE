import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/postgres";
import { verifyPassword } from "@/lib/password";
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
  if (!body || typeof body !== "object") return jsonError("Invalid sign-in details.", 400);
  const payload = body as Record<string, unknown>;
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  if (!email || password.length < 1 || password.length > 128) {
    return jsonError("Enter your email and password.", 400);
  }

  try {
    const profile = await (await getDatabase())
      .collection<AppProfile>("profiles")
      .findOne({ email });
    if (!profile?.password_hash || !await verifyPassword(password, profile.password_hash)) {
      return jsonError("Email or password is incorrect.", 401);
    }
    const token = await createSessionTokenForVersion(profile.id, profile.session_version ?? 0);
    const response = NextResponse.json({ profile: publicProfile(profile) });
    return setSessionCookie(response, token);
  } catch (cause) {
    return jsonError(databaseConnectionErrorMessage(cause), 503);
  }
}
