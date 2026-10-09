"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const team = [
  {
    number: "01",
    name: "Ashish Mewada",
    role: "Product & AI",
    description:
      "Building the technology, product experience and intelligent systems behind OCT RIDE.",
    initials: "AM",
  },
  {
    number: "02",
    name: "Deepansh Patel",
    role: "Development",
    description:
      "Focused on building reliable features and turning ideas into working product experiences.",
    initials: "DP",
  },
  {
    number: "03",
    name: "Harsh Jain",
    role: "Development",
    description:
      "Working on the technical implementation and making the platform practical for students.",
    initials: "HJ",
  },
  {
    number: "04",
    name: "Ishant Khushwaha",
    role: "Product & Research",
    description:
      "Helping understand student needs and shape OCT RIDE around real campus problems.",
    initials: "IK",
  },
];

function Teamsection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(".team-eyebrow", {
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

      gsap.from(".team-heading", {
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

      gsap.from(".team-card", {
        y: 70,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".team-grid",
          start: "top 80%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-slate-200 bg-[#f5f7fa] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
    >
      {/* Background */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-blue-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-end">
          <div>
            <div className="team-eyebrow flex items-center gap-3">
              <span className="h-px w-10 bg-blue-600" />

              <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
                The Team
              </span>
            </div>

            <h2 className="team-heading mt-7 max-w-5xl text-[clamp(3.5rem,7vw,7rem)] font-black leading-[0.84] tracking-[-0.07em] text-slate-950">
              Built by
              <br />
              <span className="text-slate-300">students.</span>
              <br />
              <span className="text-blue-600">For students.</span>
            </h2>
          </div>

          <div>
            <p className="max-w-sm text-sm leading-7 text-slate-500 sm:text-base">
              OCT RIDE started with a simple idea: solve a real problem on
              campus and make everyday transportation easier.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-600" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                OCT RIDE TEAM
              </span>
            </div>
          </div>
        </div>

        {/* Team grid */}
        <div className="team-grid mt-16 grid gap-5 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {team.map((member) => (
            <article
              key={member.number}
              className="team-card group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:border-slate-950 hover:bg-slate-950 hover:text-white hover:shadow-2xl sm:p-8"
            >
              {/* Number */}
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold tracking-[0.2em] text-blue-600">
                  {member.number}
                </span>

                <span className="text-[10px] font-bold tracking-[0.2em] text-slate-300 transition-colors group-hover:text-slate-600">
                  OCT
                </span>
              </div>

              {/* Avatar */}
              <div className="mt-14 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-950 text-xl font-black text-white transition-all duration-500 group-hover:bg-blue-600 group-hover:rotate-3">
                {member.initials}
              </div>

              {/* Content */}
              <div className="mt-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                  {member.role}
                </p>

                <h3 className="mt-2 text-2xl font-black tracking-tight">
                  {member.name}
                </h3>

                <p className="mt-4 text-sm leading-6 text-slate-500 transition-colors group-hover:text-slate-400">
                  {member.description}
                </p>
              </div>

              {/* Bottom */}
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5 transition-colors group-hover:border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  OCT RIDE
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all duration-300 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                  ↗
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom statement */}
        <div className="mt-8 overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white sm:p-10 lg:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400">
                Our mission
              </p>

              <h3 className="mt-3 max-w-3xl text-2xl font-black tracking-tight sm:text-3xl">
                Turn a daily campus problem into a better digital experience.
              </h3>
            </div>

            <div className="text-[5rem] font-black leading-none tracking-[-0.08em] text-white/[0.08] sm:text-[7rem]">
              TEAM
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Teamsection;