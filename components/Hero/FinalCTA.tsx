"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BusFront,
  Check,
  MapPin,
  MoveUpRight,
} from "lucide-react";
import Link from "next/link";

const benefits = [
  "Find your assigned bus",
  "Check your route and stops",
  "Access your student dashboard",
];

export default function FinalCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="get-started"
      aria-labelledby="final-cta-heading"
      className="bg-white px-5 pb-8 pt-12 text-neutral-950 sm:px-8 sm:pb-10 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: reduceMotion ? 0 : 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative isolate overflow-hidden rounded-[2rem] bg-neutral-950 px-6 py-12 text-white sm:rounded-[2.5rem] sm:px-10 sm:py-16 lg:px-16 lg:py-20"
        >
          {/* Subtle decorative geometry */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-28 -z-10 h-80 w-80 rounded-full border border-white/10 sm:-right-16 sm:-top-36 sm:h-[28rem] sm:w-[28rem]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 -z-10 h-60 w-60 rounded-full border border-white/10 sm:h-80 sm:w-80"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 -z-10 h-40 w-40 rounded-full bg-white/[0.035] blur-3xl sm:h-64 sm:w-64"
          />

          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            {/* Main CTA */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-xs font-medium uppercase tracking-[0.15em] text-neutral-300">
                <BusFront size={15} />
                Your journey starts here
              </div>

              <h2
                id="final-cta-heading"
                className="mt-7 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.06em] sm:text-5xl lg:text-7xl"
              >
                Make every
                <br />
                <span className="text-neutral-400">ride simpler.</span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-neutral-300 sm:text-base sm:leading-8">
                Know your route. Find your assigned bus. Get the information
                you need for your college commute, all in one place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                >
                  Student sign in
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/#routes"
                  className="inline-flex min-h-13 items-center justify-center gap-3 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Explore routes
                  <ArrowUpRight size={17} />
                </Link>
              </div>

              <p className="mt-5 text-xs leading-6 text-neutral-500">
                Bus assignments and tracking availability depend on your
                college's configured transport services.
              </p>
            </div>

            {/* Quick-access panel */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: reduceMotion ? 0 : 0.6,
                delay: reduceMotion ? 0 : 0.12,
              }}
              className="rounded-3xl border border-white/15 bg-white/[0.055] p-5 backdrop-blur-sm sm:p-7"
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-400">
                    Get started
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">
                    Your commute, organized.
                  </h3>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-neutral-950">
                  <MapPin size={22} />
                </div>
              </div>

              <div className="space-y-5 py-6">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                      <Check size={15} />
                    </span>
                    <span className="text-sm text-neutral-200">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/login"
                className="group flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl bg-white/[0.08] px-4 py-3 text-sm font-medium transition-colors hover:bg-white/[0.13]"
              >
                Open student portal
                <MoveUpRight
                  size={17}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
