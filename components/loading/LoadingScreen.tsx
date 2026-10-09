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
    let progressTimer: ReturnType<typeof setTimeout>;
    let exitTimer: ReturnType<typeof setTimeout>;
    let completeTimer: ReturnType<typeof setTimeout>;

    const updateProgress = () => {
      current = Math.min(current + Math.ceil(Math.random() * 8) + 2, 100);
      setProgress(current);

      if (current < 100) {
        progressTimer = setTimeout(updateProgress, 70);
        return;
      }

      exitTimer = setTimeout(() => setIsExiting(true), 350);
      completeTimer = setTimeout(() => onComplete?.(), 1000);
    };

    progressTimer = setTimeout(updateProgress, 150);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      aria-label="Loading OCT RIDE"
      aria-busy={!isExiting}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white text-neutral-950 transition-transform duration-700 ease-in-out ${
        isExiting ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {" "}
      <main className="w-full max-w-sm px-7">
        <div className="mb-16 flex items-center justify-center gap-3">
          {" "}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-950 text-sm font-bold tracking-tight text-white">
            OCT{" "}
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">OCT RIDE</p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
              Campus Mobility
            </p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-500">
            {progress === 100 ? "You're all set" : "Getting things ready"}
          </p>

          <p className="mt-3 text-5xl font-semibold tracking-[-0.06em] tabular-nums">
            {String(progress).padStart(2, "0")}
            <span className="ml-1 text-2xl text-neutral-400">%</span>
          </p>
        </div>
        <div
          className="mt-8 h-1 w-full overflow-hidden rounded-full bg-neutral-100"
          role="progressbar"
          aria-label="Loading progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-neutral-950 transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm  mt-15 mx-4 text-center text-gray-400 letter-spacing-[0.2em] tracking-[0.1em]">
          Find Your Bus Easily With 
          <span className="text-sm text-black/90 font-bold   " >
            OCT RIDE
          </span>
        </p>
        <p className="mt-5 text-center text-xs text-neutral-400">
          Oriental College of Technology · Bhopal
        </p>
      </main>
    </div>
  );
}
