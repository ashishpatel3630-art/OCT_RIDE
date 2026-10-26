import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/postgres";
import { getSessionIdentity } from "@/lib/session";
import { publicProfile, type AppProfile } from "@/lib/profiles";
import { authConfigurationError } from "@/lib/configuration";

export async function GET() {
  const configurationError = authConfigurationError();
  if (configurationError) {
    return NextResponse.json({
      error: configurationError,
    }, { status: 503 });
  }
  const identity = await getSessionIdentity();
  if (!identity) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  try {
    const profile = await (await getDatabase())
      .collection<AppProfile>("profiles")
      .findOne({ id: identity.userId });
    if (!profile) return NextResponse.json({ error: "Account profile not found." }, { status: 404 });
    if ((profile.session_version ?? 0) !== identity.sessionVersion) {
      return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });
    }
    return NextResponse.json({ profile: publicProfile(profile) });
  } catch {
    return NextResponse.json({ error: "Could not load your database profile." }, { status: 503 });
  }
}
