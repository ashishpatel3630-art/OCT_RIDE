"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Find Your Bus",
    description:
      "Quickly find your assigned college bus and pickup point without asking around.",
    label: "DISCOVER",
  },
  {
    number: "02",
    title: "Check Your Route",
    description:
      "See your complete route, stops and important timing information in one place.",
    label: "NAVIGATE",
  },
  {
    number: "03",
    title: "Start Your Ride",
    description:
      "Reach your pickup point and travel to campus with complete confidence.",
    label: "TRAVEL",
  },
];

function HowItWork() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const progressRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      /* ---------------- HEADER ---------------- */

      gsap.from(".how-eyebrow", {
        y: 25,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(".how-heading", {
        y: 70,
        opacity: 0,
        duration: 1,
        delay: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(".how-description", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.25,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      /* ---------------- CARDS ---------------- */

      gsap.from(cardsRef.current.filter(Boolean), {
        y: 90,
        opacity: 0,
        duration: 1,
        stagger: 0.18,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".how-cards",
          start: "top 75%",
          once: true,
        },
      });

      /* ---------------- PROGRESS LINE ---------------- */

      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          {
            scaleX: 0,
          },
          {
            scaleX: 1,
            transformOrigin: "left center",
            ease: "none",
            scrollTrigger: {
              trigger: ".how-cards",
              start: "top 70%",
              end: "bottom 65%",
              scrub: 1,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      aria-labelledby="how-it-works-heading"
      className="relative scroll-mt-20 overflow-hidden border-t border-slate-200 bg-white px-5 py-28 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-blue-50 blur-3xl" />

      <div className="pointer-events-none absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-slate-100 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}

        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-end">
          <div>
            <div className="how-eyebrow flex items-center gap-3">
              <span className="h-px w-10 bg-blue-600" />

              <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
                How OCT Ride works
              </span>
            </div>

            <h2 id="how-it-works-heading" className="how-heading mt-7 max-w-4xl text-[clamp(3.4rem,7vw,7rem)] font-black leading-[0.86] tracking-[-0.07em] text-slate-950">
              Your ride.
              <br />
              <span className="text-slate-300">Your route.</span>
              <br />
              <span className="text-blue-600">Simple.</span>
            </h2>
          </div>

          <div className="how-description lg:pb-2">
            <p className="max-w-sm text-sm leading-7 text-slate-500 sm:text-base">
              Everything you need to know about your college bus, from finding
              your assigned bus to reaching your campus.
            </p>

            <div className="mt-7 flex items-center gap-4">
              <span className="h-2 w-2 rounded-full bg-blue-600" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                3 SIMPLE STEPS
              </span>
            </div>
          </div>
        </div>

        {/* ================= JOURNEY LINE ================= */}

        <div className="how-cards relative mt-20 sm:mt-24 lg:mt-32">
          {/* Desktop line */}
          <div className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-slate-200 lg:block">
            <div
              ref={progressRef}
              className="h-full w-full origin-left bg-blue-600"
            />
          </div>

          {/* Mobile line */}
          <div className="absolute bottom-8 left-[20px] top-8 w-px bg-slate-200 lg:hidden">
            <div className="h-1/2 w-full bg-blue-600" />
          </div>

          {/* ================= STEPS ================= */}

          <div className="relative grid gap-10 lg:grid-cols-3 lg:gap-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                ref={(element) => {
                  cardsRef.current[index] = element;
                }}
                className="group relative"
              >
                {/* Step indicator */}
                <div className="relative z-10 mb-8 flex items-center lg:justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all duration-500 group-hover:border-blue-600 group-hover:shadow-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white transition-all duration-500 group-hover:bg-blue-600">
                      {step.number}
                    </div>
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`relative min-h-[380px] overflow-hidden rounded-[2rem] border p-7 transition-all duration-500 sm:p-9 lg:p-10 ${
                    index === 1
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-950"
                  } group-hover:-translate-y-2 group-hover:shadow-2xl`}
                >
                  {/* Huge background number */}
                  <span
                    className={`pointer-events-none absolute -right-5 -top-12 select-none text-[11rem] font-black leading-none tracking-[-0.1em] transition-all duration-700 group-hover:scale-110 ${
                      index === 1
                        ? "text-white/[0.04]"
                        : "text-slate-950/[0.035]"
                    }`}
                  >
                    {step.number}
                  </span>

                  {/* Top */}
                  <div className="relative flex items-start justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-[0.25em] ${
                        index === 1
                          ? "text-blue-400"
                          : "text-blue-600"
                      }`}
                    >
                      {step.label}
                    </span>

                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 group-hover:rotate-45 ${
                        index === 1
                          ? "border-white/10 bg-white/5 text-white/60"
                          : "border-slate-200 bg-white text-slate-400"
                      }`}
                    >
                      ↗
                    </span>
                  </div>

                  {/* Main */}
                  <div className="relative mt-24">
                    <h3
                      className={`max-w-xs text-3xl font-black tracking-[-0.04em] sm:text-4xl ${
                        index === 1
                          ? "text-white"
                          : "text-slate-950"
                      }`}
                    >
                      {step.title}
                    </h3>

                    <p
                      className={`mt-5 max-w-sm text-sm leading-7 ${
                        index === 1
                          ? "text-white/50"
                          : "text-slate-500"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-500 ${
                      index === 1
                        ? "bg-blue-600"
                        : "bg-transparent group-hover:bg-blue-600"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= BOTTOM CTA ================= */}

        <div className="mt-16 border-t border-slate-200 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                OCT RIDE
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Know your bus. Know your route. Get to campus.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">
                READY TO RIDE
              </span>

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition-all duration-300 hover:bg-blue-600">
                →
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWork;