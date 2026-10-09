"use client";

import React from "react";

export default function Hero() {
return ( <section
   id="home"
   className="relative isolate flex min-h-[90vh] items-center justify-center overflow-hidden bg-neutral-950 text-white"
 >
{/* Background Campus Image */}
<div
className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
style={{
backgroundImage:
"url('/images/oriental-college.jpg')",
}}
role="img"
aria-label="College campus background"
/>


  {/* Neutral Dark Overlay — No Blue Gradient */}
  <div className="absolute inset-0 -z-10 bg-black/60" />

  {/* Subtle Bottom Contrast */}
  <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-black/25" />

  {/* Centered Content */}
  <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-32 text-center sm:px-10 lg:pt-36">
    {/* Eyebrow */}
    <div className="mb-8 inline-flex items-center justify-center gap-3 rounded-full border border-white/25 bg-black/20 px-5 py-2.5 backdrop-blur-sm">
      <span className="h-2 w-2 rounded-full bg-white" />

      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white sm:text-xs">
        Oriental College of Technology · Bhopal
      </span>
    </div>

    {/* Main Heading */}
    <h1 className="mx-auto max-w-5xl text-5xl font-black leading-[1.08] tracking-[-0.055em] text-white sm:text-6xl md:text-7xl lg:text-[88px]">
      Your college.
      <br />
      Your journey.
      <br />
      <span className="text-white">One smarter ride.</span>
    </h1>

    {/* Description */}
    <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/85 sm:text-lg md:text-xl">
      Your daily college commute, made simple. Explore bus routes,
      discover pickup points, and find the right bus for your journey
      with OCT RIDE.
    </p>

    {/* CTA Buttons */}
    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <a
        href="#routes"
        className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-white px-7 py-4 text-sm font-bold text-neutral-950 transition duration-300 hover:-translate-y-1 hover:bg-neutral-200 sm:w-auto"
      >
        Explore bus routes

        <svg
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            d="M5 12h14m-6-6 6 6-6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>

      <a
        href="#how-it-works"
        className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl border border-white/50 bg-black/20 px-7 py-4 text-sm font-bold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/10 sm:w-auto"
      >
        How it works

        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path
            d="m10 8 5 4-5 4z"
            fill="currentColor"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>

    {/* Bottom Information */}
    <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-7 border-t border-white/25 pt-8 sm:grid-cols-3 sm:gap-5">
      <div>
        <p className="text-sm font-bold text-white">
          Campus-focused
        </p>
        <p className="mt-2 text-xs text-white/70">
          Designed for OCT students
        </p>
      </div>

      <div className="border-t border-white/20 pt-6 sm:border-l sm:border-t-0 sm:pt-0">
        <p className="text-sm font-bold text-white">
          Clear bus information
        </p>
        <p className="mt-2 text-xs text-white/70">
          Routes and pickup locations
        </p>
      </div>

      <div className="border-t border-white/20 pt-6 sm:border-l sm:border-t-0 sm:pt-0">
        <p className="text-sm font-bold text-white">
          OCT RIDE
        </p>
        <p className="mt-2 text-xs text-white/70">
          Your campus, connected
        </p>
      </div>
    </div>
  </div>

  {/* Scroll Indicator */}
  <a
    href="#routes"
    aria-label="Scroll to bus routes"
    className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/75 transition hover:text-white md:flex"
  >
    Scroll to explore

    <svg
      className="h-5 w-5 animate-bounce"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        d="m7 10 5 5 5-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </a>
</section>

);
}
