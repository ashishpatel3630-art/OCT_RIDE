"use client";

import React from "react";

const supportOptions = [
  {
    number: "01",
    category: "ROUTES & PICKUP POINTS",
    title: "Find your bus.",
    description:
      "Search bus numbers, destinations and pickup locations to find the route information you need.",
    action: "Explore bus finder",
    href: "#find-bus",
    primary: true,
  },
  {
    number: "02",
    category: "OFFICIAL COLLEGE SUPPORT",
    title: "Get official information.",
    description:
      "For confirmed transport schedules, bus allocation and official college updates, visit OCT's website.",
    action: "Visit college website",
    href: "https://oriental.ac.in/",
    primary: false,
  },
];

export default function ContactHelp() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#f5f5f2] px-5 pb-20 pt-32 text-neutral-950 sm:px-8 sm:pb-28 sm:pt-40 lg:px-12 lg:pt-44"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-neutral-950" />
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-500 sm:text-xs">
            OCT RIDE / Support
          </p>
        </div>

        <div className="mt-10 grid gap-8 border-b border-neutral-300 pb-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16 lg:pb-16">
          <div>
            <p className="mb-5 text-sm text-neutral-500">
              Questions? Start here.
            </p>

            <h1 className="text-[clamp(3.5rem,8vw,7.5rem)] font-semibold leading-[0.88] tracking-[-0.085em]">
              Need a hand?
              <br />
              <span className="text-neutral-400">We've got you.</span>
            </h1>
          </div>

          <div className="max-w-lg lg:justify-self-end">
            <p className="text-base leading-8 text-neutral-600 sm:text-lg">
              Getting around campus should be simple. Find your bus and pickup
              information in one place. Need an official confirmation? Connect
              with the college through its official website.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-sm">
                ↘
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
                Choose the support you need
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {supportOptions.map((option) => (
            <a
              key={option.number}
              href={option.href}
              target={option.primary ? undefined : "_blank"}
              rel={option.primary ? undefined : "noopener noreferrer"}
              className={`group relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 sm:min-h-[350px] sm:p-10 ${
                option.primary
                  ? "border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800"
                  : "border-neutral-200 bg-white text-neutral-950 hover:border-neutral-400"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute -right-2 top-8 select-none text-[10rem] font-black leading-none tracking-[-0.12em] transition-transform duration-500 group-hover:scale-105 sm:text-[13rem] ${
                  option.primary ? "text-white/[0.04]" : "text-black/[0.035]"
                }`}
              >
                {option.number}
              </span>

              <div className="relative flex items-start justify-between gap-4">
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                    option.primary ? "text-white/50" : "text-neutral-500"
                  }`}
                >
                  {option.category}
                </p>

                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-lg transition-all duration-300 group-hover:rotate-45 ${
                    option.primary
                      ? "border-white/20 text-white"
                      : "border-neutral-200 text-neutral-950"
                  }`}
                >
                  ↗
                </span>
              </div>

              <div className="relative mt-16">
                <h2 className="text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
                  {option.title}
                </h2>

                <p
                  className={`mt-4 max-w-md text-sm leading-7 ${
                    option.primary ? "text-white/60" : "text-neutral-600"
                  }`}
                >
                  {option.description}
                </p>

                <div
                  className={`mt-7 inline-flex items-center gap-3 border-b pb-2 text-xs font-bold uppercase tracking-[0.13em] transition-all duration-300 group-hover:gap-5 ${
                    option.primary
                      ? "border-white/30 text-white"
                      : "border-neutral-300 text-neutral-950"
                  }`}
                >
                  {option.action}
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
<div className="relative mt-12 overflow-hidden rounded-2xl bg-neutral-950 p-7 text-white sm:p-10 lg:p-12">
  {/* Decorative background number */}
  <span
    aria-hidden="true"
    className="pointer-events-none absolute -right-3 -top-8 select-none text-[10rem] font-black leading-none tracking-[-0.12em] text-white/[0.04] sm:text-[15rem]"
  >
    OCT
  </span>

  <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
    <div>
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
          Transport assistance
        </span>
      </div>

      <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.06em] sm:text-5xl lg:text-6xl">
        Need help with
        <br />
        <span className="text-neutral-500">your bus?</span>
      </h2>

      <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
        For bus allocation, route confirmation or pickup-related queries,
        contact your college bus manager directly.
      </p>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
      <a
        href="tel:BUS_MANAGER_NUMBER"
        className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-bold text-neutral-950 transition hover:bg-neutral-200"
      >
        <span aria-hidden="true">☎</span>
        Call bus manager
        <span aria-hidden="true">↗</span>
      </a>

      <a
        href="https://wa.me/BUS_MANAGER_NUMBER"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border border-white/20 px-6 py-4 text-sm font-bold text-white transition hover:border-white/50 hover:bg-white/5"
      >
        <span aria-hidden="true">↗</span>
        WhatsApp enquiry
      </a>
    </div>
  </div>

  <div className="relative z-10 mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
    <p className="text-xs text-white/50">
      OCT RIDE · Student transport support
    </p>
    <p className="text-xs text-white/50">
      Please verify route details with the college.
    </p>
  </div>
</div>


        <div className="mt-10 flex flex-col gap-3 border-t border-neutral-300 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Built by OCT CSE students
          </p>

          <p className="text-sm text-neutral-600">
            Less confusion. Better campus journeys.
          </p>
        </div>
      </div>
    </section>
  );
}
