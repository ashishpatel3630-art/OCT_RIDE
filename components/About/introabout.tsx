
"use client";

import React from "react";

const principles = [
  {
    number: "01",
    title: "Think different.",
    description:
      "We question the usual way of doing things and look for smarter solutions.",
  },
  {
    number: "02",
    title: "Build relentlessly.",
    description:
      "From the first idea to the final product, we learn by creating real things.",
  },
  {
    number: "03",
    title: "Make an impact.",
    description:
      "Technology matters most when it solves problems people actually face.",
  },
];

function IntroAbout() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#f7f7f5] px-5 py-24 text-[#111] sm:px-8 sm:py-32 lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-7xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-black" />
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-500 sm:text-xs">
            Meet the mindset behind OCT RIDE
          </p>
        </div>

        {/* Main statement */}
        <div className="relative mt-12 border-y border-black/10 py-12 sm:py-16 lg:py-20">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-3 hidden select-none text-[clamp(7rem,19vw,18rem)] font-black leading-none tracking-[-0.12em] text-black/[0.035] md:block"
          >
            CSE
          </span>

          <div className="relative z-10">
            <p className="mb-5 text-sm font-medium text-neutral-500 sm:text-base">
              We are OCT CSE students.
            </p>

            <h2 className="max-w-6xl text-[clamp(2.8rem,8.2vw,7.8rem)] font-semibold leading-[0.96] tracking-[-0.075em]">
              If we can
              <br />
              imagine it,
              <br />
              <span className="text-neutral-400">
                we can engineer it.
              </span>
            </h2>

            <div className="mt-9 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-lg text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
                We don&apos;t believe great ideas should stay ideas. We turn
                curiosity into code, challenges into solutions, and
                possibilities into products that make a difference.
              </p>

              <div className="flex shrink-0 items-center gap-3 self-start border border-black/10 bg-white/60 px-4 py-3 sm:self-auto">
                <span className="h-2 w-2 rounded-full bg-black" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-600">
                  Coder&apos;s mindset. Builder&apos;s spirit.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* OCT RIDE story */}
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-400">
              Why we build
            </p>

            <h3 className="mt-5 max-w-md text-3xl font-semibold leading-tight tracking-[-0.055em] sm:text-4xl lg:text-5xl">
              Real problems deserve
              <span className="text-neutral-400">
                {" "}real solutions.
              </span>
            </h3>
          </div>

          <div className="lg:pt-8">
            <p className="text-base leading-8 text-neutral-600 sm:text-lg">
              OCT RIDE started with a simple campus problem: students
              shouldn&apos;t have to depend on asking someone just to find
              their bus, route or pickup information.
            </p>

            <p className="mt-5 text-base leading-8 text-neutral-600 sm:text-lg">
              Our idea is to bring that information together in one
              accessible platform. It&apos;s more than a college project —
              it&apos;s our way of using technology to improve everyday campus
              life.
            </p>

            <a
              href="/find"
              className="group mt-8 inline-flex items-center gap-3 border-b border-black pb-2 text-sm font-semibold transition-colors hover:border-neutral-400 hover:text-neutral-500"
            >
              Explore OCT RIDE
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </a>
          </div>
        </div>

        {/* Principles */}
        <div className="border-t border-black/10 pt-8 sm:pt-10">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">
              The way we think.
            </h3>

            <p className="text-sm text-neutral-500">
              Three principles. One builder mindset.
            </p>
          </div>

          <div className="grid border-l border-t border-black/10 sm:grid-cols-3">
            {principles.map((item) => (
              <article
                key={item.number}
                className="group border-b border-r border-black/10 p-6 transition-colors duration-300 hover:bg-white sm:p-7 lg:p-9"
              >
                <span className="text-xs font-semibold tracking-widest text-neutral-400">
                  / {item.number}
                </span>

                <h4 className="mt-10 text-xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1 sm:mt-14 sm:text-2xl">
                  {item.title}
                </h4>

                <p className="mt-3 max-w-xs text-sm leading-7 text-neutral-500">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Closing statement */}
        <div className="mt-16 flex flex-col justify-between gap-5 border-t border-black/10 pt-6 sm:mt-20 sm:flex-row sm:items-center">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
            OCT CSE · Ideas into reality
          </p>

          <p className="text-sm font-semibold tracking-tight text-neutral-800">
            Built with curiosity. Driven by possibility.
          </p>
        </div>
      </div>
    </section>
  );
}

export default IntroAbout;
