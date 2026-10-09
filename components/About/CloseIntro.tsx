"use client";

import React from "react";

function CloseIntro() {
  return (
    <section className="relative overflow-hidden bg-[#f5f5f2] px-5 py-24 text-[#111111] sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-7xl">
        {/* Top label */}
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-black" />
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-500 sm:text-xs">
            This is only the beginning
          </p>
        </div>

        {/* Main statement */}
        <div className="mt-14 sm:mt-20">
          <p className="mb-6 text-sm font-medium text-neutral-500 sm:text-base">
            Built by students. Designed for students.
          </p>

          <h2 className="max-w-6xl text-[clamp(3rem,10vw,9rem)] font-semibold leading-[0.88] tracking-[-0.085em]">
            BACKBENCHERS
            <br />
            <span className="text-neutral-400">DON'T FOLLOW</span>
            <br />
            THEY BUILD.
          </h2>
        </div>

        {/* Bottom content */}
        <div className="mt-14 flex flex-col justify-between gap-8 border-t border-black/15 pt-8 sm:mt-20 sm:flex-row sm:items-end">
          <p className="max-w-xl text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
            OCT RIDE started with a simple question: why should finding your
            college bus be complicated? We are here to make everyday campus
            travel simpler, smarter and easier for everyone.
          </p>

          <a
            href="/find"
            className="group inline-flex w-fit items-center gap-5 border border-black bg-black px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-transparent hover:text-black"
          >
            Find your bus
            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
              ↗
            </span>
          </a>
        </div>

        {/* Final signature */}
        <div className="mt-20 flex flex-col gap-3 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xl font-black tracking-[-0.08em]">
            OCT<span className="text-neutral-400">RIDE.</span>
          </span>

          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
            From OCT CSE, with ambition.
          </p>

          <p className="text-xs text-neutral-500">
            Built to move campus forward.
          </p>
        </div>
      </div>
    </section>
  );
}

export default CloseIntro;
