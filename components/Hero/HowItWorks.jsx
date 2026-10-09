"use client";

import React from "react";

const steps = [
{
number: "01",
title: "Find your route",
description:
"Explore the available college bus routes and find the one that matches your area.",
label: "EXPLORE ROUTES",
icon: ( <svg
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="1.6"
     className="h-7 w-7"
     aria-hidden="true"
   > <circle cx="10.5" cy="10.5" r="6.5" /> <path
       d="m15.5 15.5 5 5M8 10.5h5M10.5 8v5"
       strokeLinecap="round"
     /> </svg>
),
},
{
number: "02",
title: "Check your pickup",
description:
"Review route details and identify the pickup point that works best for your commute.",
label: "VIEW DETAILS",
icon: ( <svg
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="1.6"
     className="h-7 w-7"
     aria-hidden="true"
   > <path
       d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"
       strokeLinejoin="round"
     /> <circle cx="12" cy="10" r="2.3" /> </svg>
),
},
{
number: "03",
title: "Get ready to ride",
description:
"Know which bus serves your route and head to your designated pickup location.",
label: "TRAVEL SMARTER",
icon: ( <svg
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="1.6"
     className="h-7 w-7"
     aria-hidden="true"
   > <rect x="3" y="4" width="18" height="14" rx="3" /> <path
       d="M7 18v2m10-2v2M3 12h18M7 8h10"
       strokeLinecap="round"
       strokeLinejoin="round"
     /> <circle cx="7.5" cy="15" r="1" fill="currentColor" /> <circle cx="16.5" cy="15" r="1" fill="currentColor" /> </svg>
),
},
];

export default function HowItWorks() {
return ( <section
   id="how-it-works"
   className="overflow-hidden bg-[#F7F7F5] px-5 py-20 text-neutral-950 sm:px-8 sm:py-28 lg:px-14"
 > <div className="mx-auto max-w-[1400px]">
{/* Heading */} <div className="mx-auto max-w-3xl text-center"> <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
Simple by design </p>


      <h2 className="text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl lg:text-6xl">
        Your bus journey,
        <br />
        <span className="text-neutral-400">made effortless.</span>
      </h2>

      <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-neutral-500 sm:text-base">
        No more confusion about bus numbers or routes. Find the
        information you need in three simple steps.
      </p>
    </div>

    {/* Steps */}
    <div className="relative mt-16 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-3 md:gap-6">
      {/* Connector line */}
      <div className="absolute left-[16.66%] right-[16.66%] top-10 hidden h-px bg-neutral-300 md:block" />

      {steps.map((step) => (
        <article
          key={step.number}
          className="group relative rounded-3xl border border-neutral-200/80 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-400 hover:shadow-[0_20px_55px_rgba(0,0,0,0.06)] sm:p-9"
        >
          {/* Step header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 bg-[#F7F7F5] text-neutral-800 transition-all duration-300 group-hover:bg-neutral-950 group-hover:text-white">
              {step.icon}
            </div>

            <span className="text-4xl font-black tracking-[-0.06em] text-neutral-200 transition-colors duration-300 group-hover:text-neutral-400">
              {step.number}
            </span>
          </div>

          {/* Content */}
          <h3 className="mt-9 text-2xl font-bold tracking-tight text-neutral-950">
            {step.title}
          </h3>

          <p className="mt-4 min-h-[84px] text-sm leading-7 text-neutral-500">
            {step.description}
          </p>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between border-t border-neutral-100 pt-5">
            <span className="text-[10px] font-bold tracking-[0.16em] text-neutral-400">
              {step.label}
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-all duration-300 group-hover:border-neutral-950 group-hover:bg-neutral-950 group-hover:text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </article>
      ))}
    </div>

    {/* Bottom CTA */}
    <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-3xl bg-neutral-950 px-7 py-8 text-white sm:flex-row sm:px-10">
      <div>
        <p className="text-xl font-bold tracking-tight sm:text-2xl">
          Your next ride starts here.
        </p>

        <p className="mt-2 text-sm text-neutral-400">
          Find your route and make your daily commute simpler.
        </p>
      </div>

      <a
        href="/find"
        className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-6 py-3 text-sm font-bold text-neutral-950 transition duration-300 hover:bg-neutral-200"
      >
        Explore routes
        <span aria-hidden="true">↗</span>
      </a>
    </div>
  </div>
</section>


);
}
