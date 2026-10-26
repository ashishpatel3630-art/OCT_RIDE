"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/client-api";

type AuthMode = "login" | "register" | "forgot";

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10";

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");

    try {
      let profile: { role: "student" | "admin" };
      if (mode === "register") {
        if (password.length < 10 || password.length > 128) {
          throw new Error("Use a password with 10 to 128 characters.");
        }
        if (password !== form.get("confirmPassword")) throw new Error("Passwords do not match.");
        const year = Number(form.get("academicYear"));
        if (![1, 2, 3, 4].includes(year)) throw new Error("Choose a valid academic year.");
        const result = await apiRequest<{ profile: typeof profile }>("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
            fullName: String(form.get("fullName") ?? "").trim(),
            studentNumber: String(form.get("studentNumber") ?? "").trim(),
            academicYear: year,
            department: String(form.get("department") ?? "").trim(),
          }),
        });
        profile = result.profile;
      } else {
        const result = await apiRequest<{ profile: typeof profile }>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        profile = result.profile;
      }

      const next = searchParams.get("next");
      const validNext = next?.startsWith("/") && !next.startsWith("//");
      const roleNext = profile.role === "admin" ? "/admin" : "/dashboard";
      const intendedIsAuthorized = profile.role === "admin"
        ? validNext && (next === "/admin" || next?.startsWith("/admin/"))
        : validNext && (next === "/dashboard" || next?.startsWith("/dashboard/"));
      router.replace(intendedIsAuthorized && next ? next : roleNext);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The request could not be completed.");
    } finally {
      setBusy(false);
    }
  }

  const titles: Record<AuthMode, string> = {
    login: "Welcome back",
    register: "Create your student account",
    forgot: "Reset your password",
  };
  const descriptions: Record<AuthMode, string> = {
    login: "Sign in to your OGI RIDE transport portal.",
    register: "Create a student account. Email confirmation is not required.",
    forgot: "Password resets are handled by a transport administrator in this demo.",
  };

  return (
    <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(16,24,40,.08)] sm:p-9">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">OGI RIDE account</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{titles[mode]}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">{descriptions[mode]}</p>
      </div>

      {mode === "forgot" ? (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          Email services are not used. Contact the transport administrator to reset your password.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <label className="block text-sm font-semibold text-slate-700">
                Full name
                <input className={inputClass} name="fullName" autoComplete="name" minLength={2} required />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Student ID
                <input className={inputClass} name="studentNumber" autoComplete="off" required />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Academic year
                  <select className={inputClass} name="academicYear" defaultValue="" required>
                    <option value="" disabled>Select year</option>
                    {[1, 2, 3, 4].map((year) => <option key={year} value={year}>Year {year}</option>)}
                  </select>
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Department
                  <input className={inputClass} name="department" required />
                </label>
              </div>
            </>
          )}
          <label className="block text-sm font-semibold text-slate-700">
            College email
            <input className={inputClass} name="email" type="email" autoComplete="email" required />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <span className="relative block">
              <input
                className={`${inputClass} pr-16`}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={10}
                maxLength={128}
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
          </label>
          {mode === "register" && (
            <label className="block text-sm font-semibold text-slate-700">
              Confirm password
              <input
                className={inputClass}
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={10}
                maxLength={128}
                required
              />
            </label>
          )}
          {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="min-h-12 w-full rounded-xl bg-[#3157D5] px-4 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create student account"}
          </button>
        </form>
      )}

      <div className="mt-6 flex flex-wrap justify-between gap-3 text-sm">
        {mode === "login" && (
          <>
            <Link className="font-semibold text-blue-700 hover:underline" href="/forgot-password">Forgot password?</Link>
            <Link className="font-semibold text-blue-700 hover:underline" href="/register">Create account</Link>
          </>
        )}
        {mode === "register" && <Link className="font-semibold text-blue-700 hover:underline" href="/login">Already have an account? Sign in</Link>}
        {mode === "forgot" && <Link className="font-semibold text-blue-700 hover:underline" href="/login">Back to sign in</Link>}
        {searchParams.get("error") === "configuration" && (
          <p className="w-full rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
            Set `DATABASE_URL` to a valid Supabase Transaction Pooler URL and `AUTH_SECRET` to a random value of at least 32 characters.
          </p>
        )}
      </div>
    </section>
  );
}
