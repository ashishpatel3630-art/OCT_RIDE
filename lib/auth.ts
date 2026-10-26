import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/postgres";
import { getSessionIdentity } from "@/lib/session";
import { publicProfile, type AppProfile } from "@/lib/profiles";
import { authConfigurationError } from "@/lib/configuration";

export type AppRole = "student" | "admin";

export async function requireProfile(role?: AppRole) {
  if (authConfigurationError()) {
    redirect("/login?error=configuration");
  }

  const identity = await getSessionIdentity();
  if (!identity) redirect("/login");

  let profile;
  try {
    profile = await (await getDatabase())
      .collection<AppProfile>("profiles")
      .findOne({ id: identity.userId });
  } catch {
    redirect("/login?error=configuration");
  }
  if (!profile) redirect("/login?error=profile");
  if ((profile.session_version ?? 0) !== identity.sessionVersion) redirect("/login");

  if (role && profile.role !== role) {
    redirect(profile.role === "admin" ? "/admin" : "/dashboard");
  }

  return { user: { id: profile.id, email: profile.email }, profile: publicProfile(profile) };
}
