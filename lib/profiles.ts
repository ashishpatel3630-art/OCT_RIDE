import "server-only";
export type AppProfile = {
  id: string;
  email: string;
  password_hash: string;
  role: "student" | "admin";
  full_name: string;
  student_number: string | null;
  student_number_key?: string;
  academic_year: number | null;
  department: string | null;
  phone: string | null;
  eligibility_verified: boolean;
  session_version?: number;
  created_at: Date;
  updated_at: Date;
};

export type PublicProfile = Omit<AppProfile, "password_hash" | "student_number_key">;

export function publicProfile(profile: AppProfile & { _id?: unknown }): PublicProfile {
  const { _id, password_hash: _passwordHash, student_number_key: _studentNumberKey, ...safeProfile } = profile;
  void _id;
  void _passwordHash;
  void _studentNumberKey;
  return safeProfile;
}
