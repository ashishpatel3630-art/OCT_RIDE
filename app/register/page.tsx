import { Suspense } from "react";
import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F8FC] px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 inline-flex items-center gap-3 text-slate-950">
          <span className="grid size-11 place-items-center rounded-xl bg-[#3157D5] text-sm font-black text-white">OGI</span>
          <span className="font-bold tracking-tight">OGI RIDE</span>
        </Link>
        <Suspense fallback={<div className="h-[40rem] animate-pulse rounded-3xl bg-white" />}>
          <AuthForm mode="register" />
        </Suspense>
      </div>
    </main>
  );
}
