"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(".about-reveal", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      });

      gsap.from(".about-number", {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="relative scroll-mt-20 overflow-hidden border-t border-slate-200 bg-white px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
    >
      {/* Background */}
      <div className="pointer-events-none absolute -right-48 top-1/2 h-150 w-150 -translate-y-1/2 rounded-full bg-blue-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Top label */}
        <div className="about-reveal flex items-center gap-3">
          <span className="h-px w-10 bg-blue-600" />

          <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
            About OCT Ride
          </span>
        </div>

        {/* Main heading */}
        <div className="mt-7 grid gap-12 lg:grid-cols-[1fr_380px] lg:items-end">
          <div>
            <h2 id="about-heading" className="about-reveal max-w-5xl text-[clamp(3.5rem,7vw,7rem)] font-black leading-[0.84] tracking-[-0.07em] text-slate-950">
              Getting to
              <br />
              <span className="text-slate-300">campus should</span>
              <br />
              <span className="text-blue-600">be simple.</span>
            </h2>
          </div>

          <div className="about-reveal">
            <p className="max-w-sm text-sm leading-7 text-slate-500 sm:text-base">
              OCT RIDE is a college transportation platform designed to make
              bus information easier to find, understand and access.
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-20 grid gap-6 lg:mt-32 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Story card */}
          <div className="about-reveal relative min-h-120 overflow-hidden rounded-4xl bg-slate-950 p-8 text-white sm:p-10 lg:p-14">
            <span className="pointer-events-none absolute -right-8 -top-16 text-[18rem] font-black leading-none -tracking-widest text-white/2.5">
              O
            </span>

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400">
                  The idea
                </p>

                <h3 className="mt-6 max-w-2xl text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                  One place for everything about your college ride.
                </h3>
              </div>

              <div className="mt-16">
                <p className="max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                  Students shouldn&apos;t have to depend on manually asking for
                  their bus number, route or pickup information. OCT RIDE brings
                  that information into one clear and accessible experience.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="rounded-full border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                    Bus Routes
                  </span>

                  <span className="rounded-full border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                    Pickup Points
                  </span>

                  <span className="rounded-full border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                    Schedules
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Side stats */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {/* 01 */}
            <div className="about-reveal group rounded-4xl border border-slate-200 bg-slate-50 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 sm:p-9">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold tracking-[0.2em] text-blue-600">
                  01
                </span>

                <span className="text-2xl text-slate-300 transition-colors group-hover:text-blue-600">
                  →
                </span>
              </div>

              <h3 className="mt-16 text-2xl font-black tracking-tight text-slate-950">
                Less confusion
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Find your bus and route information without having to ask
                around.
              </p>
            </div>

            {/* 02 */}
            <div className="about-reveal group rounded-4xl border border-slate-200 bg-slate-50 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 sm:p-9">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold tracking-[0.2em] text-blue-600">
                  02
                </span>

                <span className="text-2xl text-slate-300 transition-colors group-hover:text-blue-600">
                  →
                </span>
              </div>

              <h3 className="mt-16 text-2xl font-black tracking-tight text-slate-950">
                Better access
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Important transport information stays available whenever
                students need it.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom statement */}
        <div className="about-reveal mt-6 overflow-hidden rounded-4xl border border-slate-200 bg-white p-7 sm:p-10 lg:mt-8 lg:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                Our approach
              </p>

              <h3 className="mt-3 max-w-3xl text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Simple technology for a better everyday commute.
              </h3>
            </div>

            <div className="about-number text-[5rem] font-black leading-none tracking-[-0.08em] text-blue-600 sm:text-[7rem]">
              01
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;