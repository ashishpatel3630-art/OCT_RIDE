import { Suspense } from "react";
import { requireProfile } from "@/lib/auth";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function AdminPortalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-[#F6F8FC]" />}>
      <AdminPortalContent />
    </Suspense>
  );
}

async function AdminPortalContent() {
  const { profile } = await requireProfile("admin");
  return <AdminDashboard adminName={profile.full_name} />;
}
