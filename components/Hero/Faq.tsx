"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "How do I find my assigned bus?",
    answer:
      "Open the Find Your Bus section and select your pickup point or route. OCT RIDE will show your assigned bus, route, pickup point and scheduled time.",
  },
  {
    question: "Are the bus routes and timings fixed?",
    answer:
      "Yes. OCT RIDE displays the official bus routes and schedules provided by the college. If there is any change, it can be communicated through the Important Notices section.",
  },
  {
    question: "How do I know my pickup point?",
    answer:
      "Select your assigned route to view the available pickup points along with their scheduled timings.",
  },
  {
    question: "What should I do if I miss my bus?",
    answer:
      "Check the schedule and contact the transport coordinator for assistance. OCT RIDE is designed to help you quickly find the correct route and timing.",
  },
  {
    question: "Can I request a change in my bus?",
    answer:
      "Bus allocation is managed by the college transport administration. If you need a change, contact the transport coordinator through the support section.",
  },
  {
    question: "Who can use OCT RIDE?",
    answer:
      "OCT RIDE is designed for students who use the college transportation system to access bus, route, pickup point and schedule information.",
  },
];

function Faq() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(".faq-eyebrow", {
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

      gsap.from(".faq-heading", {
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

      gsap.from(".faq-item", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".faq-list",
          start: "top 80%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="faq"
      ref={sectionRef}
      aria-labelledby="faq-heading"
      className="relative scroll-mt-20 overflow-hidden border-t border-slate-200 bg-[#f7f9fc] px-5 py-28 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 top-20 h-[450px] w-[450px] rounded-full bg-blue-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div className="faq-eyebrow flex items-center gap-3">
              <span className="h-px w-10 bg-blue-600" />

              <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
                Frequently Asked
              </span>
            </div>

            <h2 id="faq-heading" className="faq-heading mt-7 max-w-4xl text-[clamp(3.4rem,7vw,7rem)] font-black leading-[0.86] tracking-[-0.07em] text-slate-950">
              Questions?
              <br />
              <span className="text-slate-300">We&apos;ve got</span>
              <br />
              <span className="text-blue-600">answers.</span>
            </h2>
          </div>

          <div>
            <p className="max-w-sm text-sm leading-7 text-slate-500 sm:text-base">
              Everything students need to know about buses, routes, pickup
              points and schedules.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-600" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                OCT RIDE SUPPORT
              </span>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-list mt-16 border-t border-slate-200 sm:mt-20 lg:mt-28">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={faq.question}
                className="faq-item border-b border-slate-200"
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(isActive ? -1 : index)
                  }
                  className="group flex w-full items-start justify-between gap-6 py-7 text-left sm:py-9"
                  aria-expanded={isActive}
                >
                  <div className="flex items-start gap-5 sm:gap-8">
                    <span
                      className={`pt-1 text-[10px] font-bold tracking-[0.2em] transition-colors duration-300 ${
                        isActive ? "text-blue-600" : "text-slate-400"
                      }`}
                    >
                      0{index + 1}
                    </span>

                    <span
                      className={`text-xl font-bold tracking-tight transition-colors duration-300 sm:text-2xl ${
                        isActive
                          ? "text-slate-950"
                          : "text-slate-600 group-hover:text-slate-950"
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>

                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:h-12 sm:w-12 ${
                      isActive
                        ? "rotate-45 border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300 bg-white text-slate-500 group-hover:border-slate-950 group-hover:text-slate-950"
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                    isActive
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-8 pl-[2.25rem] pr-14 sm:pb-10 sm:pl-[4.25rem] sm:pr-20">
                      <p className="max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom support card */}
        <div className="mt-12 overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white sm:p-10 lg:mt-16 lg:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400">
                Still need help?
              </p>

              <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                Can&apos;t find what you&apos;re looking for?
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Reach out to the college transport coordinator for assistance
                with bus allocation or route-related questions.
              </p>
            </div>

            <button className="group flex w-fit shrink-0 items-center gap-4 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition-all duration-300 hover:bg-blue-600 hover:text-white">
              <span>Get Help</span>

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Faq;