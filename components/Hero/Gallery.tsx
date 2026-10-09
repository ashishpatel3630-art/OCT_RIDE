"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const rides = [
  {
    id: "01",
    title: "Bhopal",
    destination: "Indore",
    subtitle: "Daily Campus Route",
    image: "/images/oriental-college.jpg",
    bus: "OCT Bus 01",
    time: "07:30 AM",
  },
  {
    id: "02",
    title: "Bhopal",
    destination: "Sehore",
    subtitle: "Morning Route",
    image: "/images/oriental-college.jpg",
    bus: "OCT Bus 02",
    time: "08:00 AM",
  },
  {
    id: "03",
    title: "Bhopal",
    destination: "Kalapipal",
    subtitle: "Student Route",
    image: "/images/oriental-college.jpg",
    bus: "OCT Bus 03",
    time: "08:30 AM",
  },
  {
    id: "04",
    title: "Bhopal",
    destination: "Dewas",
    subtitle: "Campus Route",
    image: "/images/oriental-college.jpg",
    bus: "OCT Bus 04",
    time: "09:00 AM",
  },
];

function Gallery() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [activeRide, setActiveRide] = useState(0);

  const ride = rides[activeRide];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".gallery-eyebrow", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".gallery-heading", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        delay: 0.1,
        ease: "power4.out",
      });

      gsap.from(".gallery-image", {
        scale: 1.15,
        opacity: 0,
        duration: 1.5,
        delay: 0.15,
        ease: "power3.out",
      });

      gsap.from(".gallery-content", {
        x: 80,
        opacity: 0,
        duration: 1.2,
        delay: 0.25,
        ease: "power3.out",
      });

      gsap.from(".gallery-index", {
        x: -30,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.to(".gallery-parallax", {
        y: -35,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const changeRide = (index: number) => {
    if (index === activeRide) return;

    const tl = gsap.timeline();

    tl.to(imageRef.current, {
      scale: 0.94,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    })
      .to(
        contentRef.current,
        {
          x: 30,
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
        },
        "<"
      )
      .call(() => {
        setActiveRide(index);
      })
      .to(imageRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.65,
        ease: "power3.out",
      })
      .to(
        contentRef.current,
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "<0.1"
      );
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f5f7fa] py-24 sm:py-32 lg:py-40"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute right-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-14 grid items-end gap-8 lg:mb-20 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="gallery-eyebrow mb-5 flex items-center gap-3">
              <span className="h-[1px] w-10 bg-blue-600" />

              <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
                OCT RIDE / ROUTES
              </span>
            </div>

            <h2 className="gallery-heading max-w-4xl text-[clamp(3rem,8vw,8rem)] font-semibold leading-[0.86] tracking-[-0.06em] text-slate-950">
              Move
              <br />
              <span className="text-slate-300">without</span>
              <br />
              limits.
            </h2>
          </div>

          <div className="max-w-sm lg:pb-2">
            <p className="text-sm leading-7 text-slate-500 sm:text-base">
              Explore the routes that connect students with their campus.
              Simple transportation, predictable schedules and a smoother
              everyday journey.
            </p>
          </div>
        </div>

        {/* Main Showcase */}
        <div className="grid min-h-[680px] gap-6 lg:grid-cols-[72px_minmax(0,1fr)_380px]">
          {/* Route Index */}
          <div className="gallery-index hidden flex-col justify-center gap-5 lg:flex">
            {rides.map((item, index) => (
              <button
                key={item.id}
                onClick={() => changeRide(index)}
                className={`group flex items-center gap-3 text-left transition-all duration-500 ${
                  activeRide === index
                    ? "text-slate-950"
                    : "text-slate-300 hover:text-slate-600"
                }`}
                aria-label={`View ${item.title} to ${item.destination}`}
              >
                <span
                  className={`h-[2px] transition-all duration-500 ${
                    activeRide === index
                      ? "w-7 bg-blue-600"
                      : "w-0 bg-slate-400"
                  }`}
                />

                <span className="text-xs font-bold tracking-[0.15em]">
                  {item.id}
                </span>
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div
            ref={imageRef}
            className="gallery-image relative min-h-[520px] overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl sm:min-h-[620px] lg:min-h-[680px]"
          >
            <div className="gallery-parallax absolute inset-[-8%]">
              <img
                src={ride.image}
                alt={`${ride.title} to ${ride.destination}`}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Image overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/5" />

            <div className="absolute left-6 top-6 sm:left-8 sm:top-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/10 text-sm font-semibold text-white backdrop-blur-xl">
                {ride.id}
              </div>
            </div>

            {/* Bottom image label */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between sm:bottom-8 sm:left-8 sm:right-8">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
                  Current Route
                </p>

                <p className="text-xl font-semibold text-white sm:text-2xl">
                  {ride.subtitle}
                </p>
              </div>

              <div className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md sm:flex">
                <span className="text-white">↗</span>
              </div>
            </div>
          </div>

          {/* Information Panel */}
          <div
            ref={contentRef}
            className="gallery-content flex flex-col justify-between rounded-[2rem] bg-white p-7 shadow-sm sm:p-10 lg:p-10"
          >
            <div>
              <div className="mb-10 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                  Selected Route
                </span>

                <span className="text-xs font-semibold text-blue-600">
                  {ride.id} / 04
                </span>
              </div>

              {/* Route */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  From
                </p>

                <h3 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                  {ride.title}
                </h3>

                <div className="my-5 flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />

                  <span className="h-px w-16 bg-slate-200" />

                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Route
                  </span>
                </div>

                <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  To
                </p>

                <h3 className="text-4xl font-semibold tracking-[-0.04em] text-blue-600 sm:text-5xl">
                  {ride.destination}
                </h3>
              </div>
            </div>

            {/* Details */}
            <div>
              <div className="mb-6 grid grid-cols-2 border-y border-slate-100 py-6">
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Bus
                  </p>

                  <p className="text-sm font-semibold text-slate-900">
                    {ride.bus}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Departure
                  </p>

                  <p className="text-sm font-semibold text-slate-900">
                    {ride.time}
                  </p>
                </div>
              </div>

              {/* Mobile route navigation */}
              <div className="mb-6 flex gap-2 lg:hidden">
                {rides.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => changeRide(index)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                      activeRide === index
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {item.id}
                  </button>
                ))}
              </div>

              <button className="group flex w-full items-center justify-between rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-600">
                <span>Explore this route</span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom route strip */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {rides.map((item, index) => (
            <button
              key={item.id}
              onClick={() => changeRide(index)}
              className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-500 ${
                activeRide === index
                  ? "bg-slate-950 text-white"
                  : "bg-white text-slate-950 hover:bg-slate-100"
              }`}
            >
              <div className="mb-8 flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${
                    activeRide === index
                      ? "text-blue-400"
                      : "text-slate-400"
                  }`}
                >
                  {item.id}
                </span>

                <span
                  className={`transition-transform duration-300 group-hover:translate-x-1 ${
                    activeRide === index
                      ? "text-white"
                      : "text-slate-400"
                  }`}
                >
                  ↗
                </span>
              </div>

              <p
                className={`text-sm font-semibold ${
                  activeRide === index
                    ? "text-white"
                    : "text-slate-950"
                }`}
              >
                {item.title} → {item.destination}
              </p>

              <p
                className={`mt-2 text-xs ${
                  activeRide === index
                    ? "text-white/50"
                    : "text-slate-400"
                }`}
              >
                {item.time} · {item.bus}
              </p>

              {activeRide === index && (
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;