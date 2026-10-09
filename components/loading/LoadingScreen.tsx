"use client";

import React, { useEffect, useState } from "react";

type LoadingScreenProps = {
onComplete?: () => void;
};

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
const [progress, setProgress] = useState(0);
const [isExiting, setIsExiting] = useState(false);

useEffect(() => {
let current = 0;
let exitTimer: ReturnType<typeof setTimeout>;
let completeTimer: ReturnType<typeof setTimeout>;


const progressTimer = window.setInterval(() => {
  current = Math.min(current + Math.ceil(Math.random() * 12), 100);
  setProgress(current);

  if (current >= 100) {
    window.clearInterval(progressTimer);

    exitTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, 300);

    completeTimer = window.setTimeout(() => {
      onComplete?.();
    }, 850);
  }
}, 100);

return () => {
  window.clearInterval(progressTimer);
  window.clearTimeout(exitTimer);
  window.clearTimeout(completeTimer);
};


}, [onComplete]);

return (
<div
aria-label="Loading OCT RIDE"
aria-busy="true"
className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-white transition-all duration-700 ease-in-out ${
        isExiting
          ? "-translate-y-full opacity-0"
          : "translate-y-0 opacity-100"
      }`}
>
{/* Background decoration */} <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" /> <div className="pointer-events-none absolute -bottom-40 -right-28 h-96 w-96 rounded-full bg-sky-100/70 blur-3xl" />


  {/* Top branding */}
  <div className="absolute left-6 top-6 flex items-center gap-3 sm:left-10 sm:top-10">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-black tracking-tight text-white shadow-lg shadow-blue-600/20">
      OCT
    </div>
    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
      Campus Mobility
    </span>
  </div>

  {/* Main content */}
  <div className="relative flex flex-col items-center px-6 text-center">
    <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-[28px] bg-blue-600 shadow-2xl shadow-blue-600/25 sm:h-28 sm:w-28">
      <div className="absolute inset-2 rounded-[22px] border border-white/25" />

      <span className="relative text-2xl font-black tracking-tighter text-white sm:text-3xl">
        OCT
      </span>

      <span className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-4 border-white bg-sky-400 text-white shadow-md">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="M3 13h2l2-5h10l2 5h2v5h-2m-14 0H3v-5m2 5h2m10 0h2M7 13h10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7" cy="18" r="1.5" fill="currentColor" />
          <circle cx="17" cy="18" r="1.5" fill="currentColor" />
        </svg>
      </span>
    </div>

    <h1 className="text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-6xl">
      OCT <span className="text-blue-600">RIDE</span>
    </h1>

    <p className="mt-4 text-sm font-medium tracking-wide text-slate-500 sm:text-base">
      Your journey starts here.
    </p>

    {/* Progress */}
    <div className="mt-12 w-64 max-w-[75vw] sm:w-72">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Preparing your ride
        </span>
        <span className="text-xs font-bold tabular-nums text-blue-600">
          {progress}%
        </span>
      </div>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  </div>

  {/* Footer */}
  <div className="absolute bottom-7 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 sm:bottom-10">
    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
    Built for your campus
  </div>
</div>

);
}
