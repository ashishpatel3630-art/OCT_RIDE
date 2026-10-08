"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const timer = window.setTimeout(() => {
      gsap.to(root, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => setVisible(false),
      });
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const skipIntro = () => {
    const root = rootRef.current;

    if (!root) {
      setVisible(false);
      return;
    }

    gsap.to(root, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.inOut",
      onComplete: () => setVisible(false),
    });
  };

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-white"
      role="status"
      aria-label="Loading OCT RIDE"
    >
      {/* Main content */}
      <div className="flex w-full max-w-md flex-col items-center px-6 text-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-4xl font-black tracking-[-0.07em] text-slate-950 sm:text-5xl">
            OCT
          </span>

          <span className="text-4xl font-black tracking-[-0.07em] text-blue-600 sm:text-5xl">
            RIDE
          </span>
        </div>

        {/* Tagline */}
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
          Your Campus · Your Ride
        </p>

        {/* Loading line */}
        <div className="mt-12 h-px w-48 overflow-hidden bg-slate-200">
          <div className="h-full w-1/2 animate-[loading_1.3s_ease-in-out_infinite] bg-blue-600" />
        </div>

        {/* Status */}
        <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.25em] text-slate-400">
          Preparing your ride
        </p>
      </div>

      {/* Skip */}
      <button
        type="button"
        onClick={skipIntro}
        className="absolute bottom-7 right-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 transition-colors duration-200 hover:text-slate-950"
      >
        Skip
      </button>

      {/* Bottom branding */}
      <div className="absolute bottom-7 left-7 text-[9px] font-medium uppercase tracking-[0.2em] text-slate-300">
        OCT · Bhopal
      </div>
    </div>
  );
}
