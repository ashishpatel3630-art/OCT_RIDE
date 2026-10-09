"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const buses = [
  {
    id: "01",
    bus: "OCT Bus 01",
    route: "Bhopal → Indore",
    pickup: "Bhopal",
    time: "07:30 AM",
    stops: "08 Stops",
  },
  {
    id: "02",
    bus: "OCT Bus 02",
    route: "Bhopal → Sehore",
    pickup: "Bhopal",
    time: "08:00 AM",
    stops: "06 Stops",
  },
  {
    id: "03",
    bus: "OCT Bus 03",
    route: "Bhopal → Kalapipal",
    pickup: "Bhopal",
    time: "08:30 AM",
    stops: "07 Stops",
  },
  {
    id: "04",
    bus: "OCT Bus 04",
    route: "Bhopal → Dewas",
    pickup: "Bhopal",
    time: "09:00 AM",
    stops: "09 Stops",
  },
];

function Findbus() {
  const sectionRef = useRef(null);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(".findbus-eyebrow", {
        y: 25,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      });

      gsap.from(".findbus-heading", {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      });

      gsap.from(".findbus-panel", {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".findbus-panel",
          start: "top 82%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="find-bus"
      ref={sectionRef}
      aria-labelledby="find-bus-heading"
      className="relative scroll-mt-20 overflow-hidden bg-[#f5f7fa] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 top-20 h-125 w-125 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div className="findbus-eyebrow flex items-center gap-3">
              <span className="h-px w-10 bg-blue-600" />

              <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
                Find Your Bus
              </span>
            </div>

            <h2 id="find-bus-heading" className="findbus-heading mt-7 max-w-5xl text-[clamp(3.5rem,7vw,7rem)] font-black leading-[0.86] tracking-[-0.07em] text-slate-950">
              Find your
              <br />
              <span className="text-slate-300">route.</span>
              <br />
              <span className="text-blue-600">Start riding.</span>
            </h2>
          </div>

          <div>
            <p className="max-w-sm text-sm leading-7 text-slate-500 sm:text-base">
              Select your bus to quickly view its route, pickup point, timing
              and available stops.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-600" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                {buses.length} ACTIVE ROUTES
              </span>
            </div>
          </div>
        </div>

        {/* Main panel */}
        <div className="findbus-panel mt-16 overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)] sm:mt-20 lg:mt-28">
          {/* Top bar */}
          <div className="flex flex-col gap-5 border-b border-slate-200 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                Available Routes
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                Choose your college bus
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700">
                Routes Active
              </span>
            </div>
          </div>

          {/* Bus list */}
          <div className="divide-y divide-slate-100">
            {buses.map((bus) => {
              const active = selectedBus === bus.id;

              return (
                <button
                  key={bus.id}
                  type="button"
                  onClick={() => setSelectedBus(active ? null : bus.id)}
                  className={`group w-full text-left transition-all duration-300 ${
                    active ? "bg-slate-950 text-white" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="grid items-center gap-6 px-6 py-7 sm:grid-cols-[70px_1fr_auto] sm:px-8 lg:grid-cols-[80px_1fr_180px_130px_80px] lg:px-10">
                    {/* Number */}
                    <div
                      className={`text-xs font-black tracking-[0.2em] ${
                        active ? "text-blue-400" : "text-slate-400"
                      }`}
                    >
                      {bus.id}
                    </div>

                    {/* Route */}
                    <div>
                      <p
                        className={`text-lg font-black tracking-tight sm:text-xl ${
                          active ? "text-white" : "text-slate-950"
                        }`}
                      >
                        {bus.route}
                      </p>

                      <p
                        className={`mt-1 text-xs ${
                          active ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {bus.bus} · {bus.pickup}
                      </p>
                    </div>

                    {/* Time */}
                    <div className="hidden lg:block">
                      <p
                        className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                          active ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        Departure
                      </p>

                      <p
                        className={`mt-1 text-sm font-bold ${
                          active ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {bus.time}
                      </p>
                    </div>

                    {/* Stops */}
                    <div className="hidden lg:block">
                      <p
                        className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                          active ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        Stops
                      </p>

                      <p
                        className={`mt-1 text-sm font-bold ${
                          active ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {bus.stops}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-end">
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                          active
                            ? "rotate-0 border-blue-600 bg-blue-600 text-white"
                            : "border-slate-200 bg-white text-slate-400 group-hover:border-slate-950 group-hover:text-slate-950"
                        }`}
                      >
                        →
                      </span>
                    </div>
                  </div>

                  {/* Mobile details */}
                  {active && (
                    <div className="grid grid-cols-2 gap-4 border-t border-white/10 px-6 py-6 sm:hidden">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          Departure
                        </p>

                        <p className="mt-1 text-sm font-bold">
                          {bus.time}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          Stops
                        </p>

                        <p className="mt-1 text-sm font-bold">
                          {bus.stops}
                        </p>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom info */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-6 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  i
                </span>

                <p className="text-xs leading-5 text-slate-500">
                  Bus timings and routes are based on the college transport
                  schedule.
                </p>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                OCT RIDE
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Findbus;