
"use client";

import React from "react";

const team = [
  {
    number: "01",
    name: "Ashish Mewada",
    role: "Product & AI",
    initials: "AM",
    description: "Turning ambitious ideas into intelligent experiences.",
  },
  {
    number: "02",
    name: "Deepansh Patel",
    role: "Development",
    initials: "DP",
    description: "Building the systems that bring ideas to life.",
  },
  {
    number: "03",
    name: "Harsh Jain",
    role: "Design & Engineering",
    initials: "HJ",
    description: "Making technology feel simple and purposeful.",
  },
  {
    number: "04",
    name: "Ishant Khushwaha",
    role: "Engineering",
    initials: "IK",
    description: "Solving real problems, one build at a time.",
  },
];

function Teamsection() {
  return (
    <section
      id="team"
      className="relative overflow-hidden bg-[#090909] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section label */}
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-white" />
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-500 sm:text-xs">
            The people behind the possibilities
          </p>
        </div>

        {/* Main headline */}
        <div className="relative mt-12 border-y border-white/10 py-12 sm:py-16 lg:py-20">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-2 hidden select-none text-[clamp(8rem,22vw,20rem)] font-black leading-none tracking-[-0.12em] text-white/[0.035] md:block"
          >
            CSE
          </span>

          <div className="relative z-10">
            <p className="mb-5 text-sm font-medium text-neutral-500 sm:text-base">
              Not your regular college team.
            </p>

            <h2 className="max-w-6xl text-[clamp(2.8rem,8vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.075em]">
              Not here to
              <br />
              fit the mould.
              <br />
              <span className="text-neutral-500">
                Here to build what&apos;s next.
              </span>
            </h2>

            <div className="mt-9 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-xl text-sm leading-7 text-neutral-400 sm:text-base sm:leading-8">
                We&apos;re OCT CSE students who believe learning goes beyond
                classrooms. We experiment, create, break things, solve
                problems and turn ideas into projects that mean something.
              </p>

              <span className="self-start border border-white/15 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-300 sm:self-auto">
                Student mindset. Builder energy.
              </span>
            </div>
          </div>
        </div>

        {/* Team intro */}
        <div className="flex flex-col justify-between gap-5 py-12 sm:flex-row sm:items-end sm:py-16">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-500">
              Meet the team
            </p>

            <h3 className="mt-4 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
              Different minds.
              <br className="sm:hidden" /> One ambition.
            </h3>
          </div>

          <p className="max-w-sm text-sm leading-7 text-neutral-400">
            Four teammates, shared curiosity and a commitment to building
            technology that solves real-world problems.
          </p>
        </div>

        {/* Team cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <article
              key={member.number}
              className="group overflow-hidden border border-white/10 bg-white/[0.025] transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.05]"
            >
              {/* Photo placeholder */}
              <div className="relative flex aspect-[4/4.2] items-center justify-center overflow-hidden bg-[#151515]">
                <span
                  aria-hidden="true"
                  className="absolute select-none text-[7rem] font-black tracking-[-0.1em] text-white/[0.035] transition-transform duration-500 group-hover:scale-110 sm:text-[8rem]"
                >
                  {member.number}
                </span>

                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15 text-3xl font-semibold tracking-[-0.07em] text-neutral-300 transition-all duration-300 group-hover:border-white/40 group-hover:bg-white group-hover:text-black">
                  {member.initials}
                </div>

                <span className="absolute left-5 top-5 text-[10px] font-semibold tracking-[0.2em] text-neutral-500">
                  / {member.number}
                </span>

                <span className="absolute bottom-5 right-5 text-xs text-neutral-500 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                  ↗
                </span>
              </div>

              {/* Member details */}
              <div className="p-5 sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                  {member.role}
                </p>

                <h4 className="mt-3 text-xl font-semibold tracking-[-0.04em]">
                  {member.name}
                </h4>

                <p className="mt-3 text-sm leading-6 text-neutral-400">
                  {member.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Closing statement */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.17em] text-neutral-500">
            OCT CSE · The next generation of builders
          </p>

          <p className="text-sm font-semibold tracking-tight text-white">
            We don&apos;t wait for the future. We build towards it.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Teamsection;
