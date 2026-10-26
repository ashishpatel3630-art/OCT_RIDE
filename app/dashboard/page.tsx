import { Suspense } from "react";
import { requireProfile } from "@/lib/auth";
import StudentDashboard from "@/components/dashboard/StudentDashboard";

export default function StudentPortalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-[#F6F8FC]" />}>
      <StudentPortalContent />
    </Suspense>
  );
}

async function StudentPortalContent() {
  const { profile } = await requireProfile("student");
  return <StudentDashboard profile={profile} />;
}
