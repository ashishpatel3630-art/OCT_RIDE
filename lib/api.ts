import { NextResponse, type NextRequest } from "next/server";
import { getDatabase } from "@/lib/postgres";
import { getSessionIdentity } from "@/lib/session";
import { publicProfile, type AppProfile } from "@/lib/profiles";
import { authConfigurationError } from "@/lib/configuration";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function hasValidOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

async function requireApiRole(role: "admin" | "student") {
  const configurationError = authConfigurationError();
  if (configurationError) {
    return { response: jsonError(configurationError, 503) };
  }
  const identity = await getSessionIdentity();
  if (!identity) return { response: jsonError("Authentication required.", 401) };

  let profile;
  let db;
  try {
    db = await getDatabase();
    profile = await db.collection<AppProfile>("profiles").findOne({ id: identity.userId });
  } catch {
    return { response: jsonError("Could not verify account permissions.", 503) };
  }
  if (!profile) return { response: jsonError("Account profile not found.", 401) };
  if ((profile.session_version ?? 0) !== identity.sessionVersion) {
    return { response: jsonError("Session expired. Sign in again.", 401) };
  }
  if (profile.role !== role) {
    return { response: jsonError(role === "admin" ? "Administrator access required." : "Student access required.", 403) };
  }
  return {
    db,
    profile: publicProfile(profile),
    user: { id: profile.id, email: profile.email },
  };
}

export async function requireAdminApi() {
  return requireApiRole("admin");
}

export async function requireStudentApi() {
  return requireApiRole("student");
}
