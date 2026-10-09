
"use client";

import React, { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "What is OCT RIDE?",
    answer:
      "OCT RIDE is a college-focused bus information platform designed to help Oriental College of Technology students find their bus routes, pickup points, and relevant travel information in one place.",
  },
  {
    question: "How can I find my college bus route?",
    answer:
      "Visit the bus routes section and explore the available buses. Check the route details and pickup locations to identify the bus that matches your journey.",
  },
  {
    question: "Can I check the bus pickup points?",
    answer:
      "Yes. OCT RIDE is designed to make pickup point information easier to access, so students can understand where their assigned bus travels and where they need to board.",
  },
  {
    question: "Are the bus timings available on OCT RIDE?",
    answer:
      "Bus timings can be displayed when the college's confirmed schedule is added to the platform. Always follow the latest schedule shared by the college administration.",
  },
  {
    question: "What if I cannot find my bus or route?",
    answer:
      "If your route is not listed or the information looks incorrect, contact the college's bus coordinator for confirmation. Do not assume a bus assignment without verifying it.",
  },
  {
    question: "Can I use OCT RIDE on my phone?",
    answer:
      "Yes. The interface is designed to work across mobile phones, tablets, laptops, and desktop screens, making bus information accessible while you're on the go.",
  },
];

function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-white px-5 py-24 text-neutral-950 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="grid gap-8 border-b border-neutral-200 pb-12 md:grid-cols-2 md:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-neutral-500">
              <span className="h-2 w-2 rounded-full bg-neutral-950" />
              Got questions?
            </span>

            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              Everything you need
              <br />
              <span className="text-neutral-400">to know.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-neutral-600 md:ml-auto md:text-base">
            From finding your bus route to checking pickup points, here are
            answers to the questions OCT students ask most.
          </p>
        </div>

        {/* FAQ content */}
        <div className="grid gap-12 py-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          {/* Left info panel */}
          <div className="flex flex-col items-start justify-between gap-8">
            <div>
              <p className="text-sm font-semibold text-neutral-500">
                Still need help?
              </p>

              <h3 className="mt-3 max-w-sm text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Let’s make your daily commute simpler.
              </h3>

              <p className="mt-4 max-w-sm text-sm leading-7 text-neutral-600">
                If something about your bus route is unclear, confirm the
                details with your college bus coordinator.
              </p>
            </div>

            <a
              href="/find"
              className="group inline-flex items-center gap-3 rounded-full bg-neutral-950 px-6 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-neutral-800"
            >
              Explore bus routes
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          {/* Accordion */}
          <div className="border-t border-neutral-200">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const answerId = `faq-answer-${index}`;

              return (
                <div
                  key={faq.question}
                  className="border-b border-neutral-200"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() =>
                      setOpenIndex(isOpen ? -1 : index)
                    }
                    className="group flex w-full items-center gap-4 py-6 text-left sm:py-7"
                  >
                    <span className="w-8 shrink-0 text-xs font-semibold tabular-nums text-neutral-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={`flex-1 text-base font-semibold tracking-tight transition-colors sm:text-lg ${
                        isOpen
                          ? "text-neutral-950"
                          : "text-neutral-600 group-hover:text-neutral-950"
                      }`}
                    >
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition duration-300 ${
                        isOpen
                          ? "rotate-180 border-neutral-950 bg-neutral-950 text-white"
                          : "border-neutral-200 text-neutral-600 group-hover:border-neutral-950"
                      }`}
                    >
                      <svg
                        className="h-4 w-4"
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
                    </span>
                  </button>

                  <div
                    id={answerId}
                    aria-hidden={!isOpen}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] pb-6 opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden pl-12 pr-3 sm:pl-12 sm:pr-14">
                      <p className="max-w-2xl text-sm leading-7 text-neutral-600 sm:text-[15px]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom note */}
        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium tracking-wide text-neutral-500">
            OCT RIDE · ORIENTAL COLLEGE OF TECHNOLOGY
          </p>
          <Link
            href="/#home"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-700 transition hover:text-neutral-950"
          >
            Back to top
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path
                d="M12 19V5m-6 6 6-6 6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Faq;
