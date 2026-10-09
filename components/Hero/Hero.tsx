
"use client";

import React from "react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[90vh] items-center justify-center overflow-hidden bg-neutral-950 text-white"
    >
  
      <div
        className="absolute inset-0 z-[-02] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/oriental-college.jpg')",
          backgroundPosition: "center center",
        }}
        role="img"
        aria-label="Oriental College of Technology campus"
      />

      <div className="absolute inset-0 z-[-1] bg-black/20" />

      <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-black/35 via-transparent to-black/65" />

      <div className="mx-auto w-full max-w-5xl px-5 pb-20 pt-32 text-center sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/90 sm:text-sm">
          Oriental College of Technology · Bhopal
        </p>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/90 sm:text-base">
          Find your bus. Know your route. Get to campus with ease.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#find-bus"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-white px-7 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 sm:w-auto"
          >
            Find Your Bus ↗
          </a>

          <a
            href="#how-it-works"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-white/60 bg-black/20 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 sm:w-auto"
          >
            How It Works
          </a>
        </div>
      </div>
    </section>
  );
}
