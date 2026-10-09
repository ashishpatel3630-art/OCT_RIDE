"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;

    if (!footer) return;

    const ctx = gsap.context(() => {
      gsap.from(".footer-reveal", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: {
          trigger: footer,
          start: "top 80%",
          once: true,
        },
      });
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-slate-950 text-white"
    >
      {/* =====================================================
          BIG CTA
      ====================================================== */}

      <div className="relative border-b border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        
        {/* Background typography */}
        <div className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 select-none text-[25vw] font-black leading-none tracking-[-0.08em] text-white/[0.025]">
          RIDE
        </div>

        <div className="relative mx-auto max-w-7xl">
          
          <div className="footer-reveal mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-blue-500" />

            <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
              OCT RIDE
            </span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_350px] lg:items-end">
            
            <div>
              <h2 className="footer-reveal max-w-5xl text-[clamp(3.5rem,8vw,9rem)] font-black leading-[0.82] tracking-[-0.07em]">
                Your campus.
                <br />

                <span className="text-slate-500">
                  Your route.
                </span>

                <br />

                <span className="text-blue-500">
                  Your ride.
                </span>
              </h2>
            </div>

            <div className="footer-reveal lg:pb-2">
              <p className="max-w-sm text-sm leading-7 text-slate-400 sm:text-base">
                Everything you need to know about your college bus, in one
                simple place.
              </p>

              <a href="#find-bus" className="group mt-8 flex w-fit items-center gap-4 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition-all duration-300 hover:bg-blue-500 hover:text-white">
                <span>Explore OCT Ride</span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <div className="border-b border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

          {/* Brand */}
          <div className="footer-reveal">
            <div className="flex items-center gap-3">
              
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950">
                O
              </div>

              <div>
                <p className="text-lg font-black tracking-tight">
                  OCT RIDE
                </p>

                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Campus Mobility
                </p>
              </div>

            </div>

            <p className="mt-6 max-w-xs text-sm leading-6 text-slate-500">
              A simpler way for students to discover their bus, route and
              pickup information.
            </p>
          </div>

          {/* Explore */}
          <div className="footer-reveal">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
              Explore
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="#home"
                className="w-fit text-sm text-slate-300 transition-colors hover:text-white"
              >
                Home
              </a>

              <a
                href="#find-bus"
                className="w-fit text-sm text-slate-300 transition-colors hover:text-white"
              >
                Routes
              </a>

              <a
                href="#how-it-works"
                className="w-fit text-sm text-slate-300 transition-colors hover:text-white"
              >
                How It Works
              </a>

              <a
                href="#find-bus"
                className="w-fit text-sm text-slate-300 transition-colors hover:text-white"
              >
                Bus Information
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="footer-reveal">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
              Support
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="#contact"
                className="w-fit text-sm text-slate-300 transition-colors hover:text-white"
              >
                Contact
              </a>

              <a
                href="#faq"
                className="w-fit text-sm text-slate-300 transition-colors hover:text-white"
              >
                Help
              </a>

              <a
                href="#contact"
                className="w-fit text-sm text-slate-300 transition-colors hover:text-white"
              >
                Report an Issue
              </a>

              <a
                href="#contact"
                className="w-fit text-sm text-slate-300 transition-colors hover:text-white"
              >
                Feedback
              </a>
            </div>
          </div>

          {/* Social */}
          <div className="footer-reveal">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
              Connect
            </p>

            <div className="max-w-xs text-sm leading-6 text-slate-400">
              Official OCT RIDE social links will be added here.
            </div>
          </div>

        </div>
      </div>

      {/* =====================================================
          BOTTOM BAR
      ====================================================== */}

      <div className="px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-slate-600">
            © OCT RIDE. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <span className="text-xs text-slate-600">
              Privacy
            </span>

            <span className="text-xs text-slate-600">
              Terms
            </span>

            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

            <span className="text-xs font-semibold text-slate-500">
              Made for OCT
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;