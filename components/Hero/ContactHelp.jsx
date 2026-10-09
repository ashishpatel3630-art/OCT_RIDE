"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Contact() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(".contact-reveal", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative scroll-mt-20 overflow-hidden bg-white px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-36"
    >
      {/* Background */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-blue-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="contact-reveal flex items-center gap-3">
          <span className="h-px w-10 bg-blue-600" />

          <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
            Need Assistance?
          </span>
        </div>

        <div className="mt-7 grid gap-12 lg:grid-cols-[1fr_400px] lg:items-end">
          <div>
            <h2 className="contact-reveal max-w-5xl text-[clamp(3.5rem,7vw,7rem)] font-black leading-[0.86] tracking-[-0.07em] text-slate-950">
              Need
              <br />
              <span className="text-slate-300">some</span>{" "}
              <span className="text-blue-600">help?</span>
            </h2>
          </div>

          <p className="contact-reveal max-w-sm text-sm leading-7 text-slate-500 sm:text-base">
            Having trouble finding your bus, route or pickup point? Get in
            touch with the college transport team.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {/* Transport Office */}
          <div className="contact-reveal group rounded-[2rem] border border-slate-200 bg-slate-50 p-7 transition-all duration-500 hover:-translate-y-2 hover:bg-slate-950 hover:text-white hover:shadow-2xl sm:p-9">
            <div className="flex items-start justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-lg text-slate-950 shadow-sm transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                ↗
              </span>

              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 group-hover:text-slate-500">
                01
              </span>
            </div>

            <div className="mt-16">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600">
                Transport Office
              </p>

              <h3 className="mt-3 text-2xl font-black tracking-tight">
                Bus Assistance
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500 transition-colors group-hover:text-slate-400">
                For bus allocation, route information and transport-related
                questions.
              </p>
            </div>

            <button className="mt-8 text-sm font-bold text-slate-950 underline underline-offset-4 transition-colors group-hover:text-white">
              Contact Transport →
            </button>
          </div>

          {/* Report Issue */}
          <div className="contact-reveal group rounded-[2rem] border border-slate-200 bg-slate-50 p-7 transition-all duration-500 hover:-translate-y-2 hover:bg-slate-950 hover:text-white hover:shadow-2xl sm:p-9">
            <div className="flex items-start justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-lg text-slate-950 shadow-sm transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                !
              </span>

              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 group-hover:text-slate-500">
                02
              </span>
            </div>

            <div className="mt-16">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600">
                Report an Issue
              </p>

              <h3 className="mt-3 text-2xl font-black tracking-tight">
                Something Wrong?
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500 transition-colors group-hover:text-slate-400">
                Report incorrect route, timing, pickup point or other bus
                information.
              </p>
            </div>

            <button className="mt-8 text-sm font-bold text-slate-950 underline underline-offset-4 transition-colors group-hover:text-white">
              Report Issue →
            </button>
          </div>

          {/* Feedback */}
          <div className="contact-reveal group rounded-[2rem] border border-slate-200 bg-slate-50 p-7 transition-all duration-500 hover:-translate-y-2 hover:bg-slate-950 hover:text-white hover:shadow-2xl sm:p-9">
            <div className="flex items-start justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-lg text-slate-950 shadow-sm transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                ♡
              </span>

              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 group-hover:text-slate-500">
                03
              </span>
            </div>

            <div className="mt-16">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600">
                Student Feedback
              </p>

              <h3 className="mt-3 text-2xl font-black tracking-tight">
                Help Us Improve
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500 transition-colors group-hover:text-slate-400">
                Share your experience and help make college transportation
                better for everyone.
              </p>
            </div>

            <button className="mt-8 text-sm font-bold text-slate-950 underline underline-offset-4 transition-colors group-hover:text-white">
              Send Feedback →
            </button>
          </div>
        </div>

        {/* Emergency / Important strip */}
        <div className="contact-reveal mt-6 rounded-[2rem] bg-slate-950 p-7 text-white sm:p-9 lg:mt-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold">
                i
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                  Important
                </p>

                <h3 className="mt-1 text-lg font-bold">
                  For urgent transport issues
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Please contact the college transport coordinator directly.
                </p>
              </div>
            </div>

            <button className="flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition-all duration-300 hover:bg-blue-600 hover:text-white">
              Contact Coordinator
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;