import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F8FC] px-4 py-12">
      <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-3xl bg-white" />}>
        <AuthForm mode="forgot" />
      </Suspense>
    </main>
  );
}
