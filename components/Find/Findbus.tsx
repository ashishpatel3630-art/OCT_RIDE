
"use client";

import React, { useState } from "react";

function Findbus() {
  const [search, setSearch] = useState("");
  const [busType, setBusType] = useState<"destination" | "bus">("destination");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) return;

    window.dispatchEvent(
      new CustomEvent("octride:search", {
        detail: { query, busType },
      })
    );

    document
      .getElementById(
        busType === "destination"
          ? "pickup-search-results"
          : "bus-search-results"
      )
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className="relative overflow-hidden bg-[#080808] text-white"
    >
      {/* Background details */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-white/[0.045] blur-[100px]" />

      {/* Hero content */}
      <div className="relative mx-auto max-w-[1440px] px-5 pb-20 pt-32 sm:px-8 sm:pb-24 sm:pt-40 lg:px-12 lg:pb-28 lg:pt-44">
        {/* Top label */}
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-white/60" />

          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 sm:text-xs">
            OCT RIDE / Campus Transport
          </span>
        </div>

        {/* Main heading */}
        <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.065em] sm:text-6xl md:text-7xl lg:text-[88px]">
              Your bus.
              <br />
              Your route.
              <br />
              <span className="text-white/40">Your campus.</span>
            </h1>

            <p className="mt-7 max-w-lg text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
              Find your college bus, explore its route, and check
              your pickup information — all in one place.
              Less confusion. Easier commutes.
            </p>

            {/* Quick highlights */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {["Bus numbers", "Route information", "Pickup details"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs font-medium text-white/70"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/25">
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        className="h-2.5 w-2.5"
                        aria-hidden="true"
                      >
                        <path
                          d="m2.5 6 2.2 2.2L9.5 3.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {item}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Bus search card */}
          <div className="relative">
            <div className="rounded-2xl border border-white/15 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    Quick search
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                    Find your bus
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/45">
                    Where do you want to go?
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-black">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-6 w-6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="4" y="3" width="16" height="17" rx="3" />
                    <path d="M4 10h16M8 7h2m4 0h2M7 20v1m10-1v1" />
                    <circle cx="8" cy="16" r="1" />
                    <circle cx="16" cy="16" r="1" />
                  </svg>
                </div>
              </div>

              {/* Search type */}
              <div className="mt-7 grid grid-cols-2 rounded-xl border border-white/10 bg-black/40 p-1">
                <button
                  type="button"
                  onClick={() => setBusType("destination")}
                  className={`rounded-lg px-3 py-3 text-xs font-semibold transition-all ${
                    busType === "destination"
                      ? "bg-white text-black"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  By destination
                </button>

                <button
                  type="button"
                  onClick={() => setBusType("bus")}
                  className={`rounded-lg px-3 py-3 text-xs font-semibold transition-all ${
                    busType === "bus"
                      ? "bg-white text-black"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  By bus number
                </button>
              </div>

              {/* Search form */}
              <form onSubmit={handleSearch} className="mt-5">
                <label
                  htmlFor="octride-search"
                  className="mb-2 block text-xs font-semibold text-white/70"
                >
                  {busType === "destination"
                    ? "Enter your destination"
                    : "Enter your bus number"}
                </label>

                <div className="flex min-h-14 items-center gap-3 rounded-xl border border-white/15 bg-black/30 px-4 transition-colors focus-within:border-white/50">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 shrink-0 text-white/40"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {busType === "destination" ? (
                      <>
                        <circle cx="11" cy="11" r="7" />
                        <path d="m16 16 4 4" />
                      </>
                    ) : (
                      <>
                        <rect x="4" y="3" width="16" height="18" rx="3" />
                        <path d="M4 10h16M8 7h2m4 0h2" />
                      </>
                    )}
                  </svg>

                  <input
                    id="octride-search"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={
                      busType === "destination"
                        ? "e.g. Indore, Bhopal..."
                        : "e.g. OCT Bus 01"
                    }
                    className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/30"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-4 text-sm font-bold text-black transition-all hover:bg-neutral-200 active:scale-[0.99]"
                >
                  Search buses
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </button>
              </form>

              <p className="mt-4 text-center text-[10px] leading-5 text-white/35">
                College transport information, made simple.
              </p>
            </div>

            {/* Decorative corner */}
            <div className="pointer-events-none absolute -bottom-2 -right-2 -z-0 h-16 w-16 rounded-br-2xl border-b border-r border-white/20" />
          </div>
        </div>

        {/* Bottom information strip */}
        <div className="mt-16 border-t border-white/15 pt-5 sm:mt-20 sm:pt-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-white/45">
              Designed for Oriental College of Technology, Bhopal.
            </p>

            <a
              href="#find-by-address"
              className="inline-flex w-fit items-center gap-2 text-xs font-bold text-white transition-colors hover:text-white/60"
            >
              Explore all routes
              <span aria-hidden="true">↘</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Findbus;
