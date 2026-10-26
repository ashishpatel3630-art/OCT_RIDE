import { isDatabaseConfigured } from "@/lib/postgres";

export function authConfigurationError() {
  if (!isDatabaseConfigured()) {
    return "Set a valid Supabase PostgreSQL URL in DATABASE_URL.";
  }
  if ((process.env.AUTH_SECRET ?? "").length < 32) {
    return "Set AUTH_SECRET to a random value containing at least 32 characters.";
  }
  return null;
}
