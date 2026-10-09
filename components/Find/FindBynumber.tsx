
"use client";

import React, { useEffect, useState } from "react";

type BusStop = {
  name: string;
  time: string;
  type: string;
};

type BusRoute = {
  plate: string;
  busNumber: string;
  destination: string;
  departure: string;
  driver: string;
  stops: BusStop[];
};

const buses: BusRoute[] = [
  {
    plate: "MP 04 PA 1234",
    busNumber: "OCT BUS 01",
    destination: "Indore",
    departure: "07:30 AM",
    driver: "College Transport",
    stops: [
      { name: "Bhopal", time: "07:30 AM", type: "Starting Point" },
      { name: "Sehore", time: "08:10 AM", type: "Pickup Stop" },
      { name: "Dewas", time: "09:15 AM", type: "Pickup Stop" },
      { name: "Indore", time: "10:00 AM", type: "Destination" },
    ],
  },
  {
    plate: "MP 04 PA 5678",
    busNumber: "OCT BUS 02",
    destination: "Sehore",
    departure: "08:00 AM",
    driver: "College Transport",
    stops: [
      { name: "Bhopal Railway Station", time: "08:00 AM", type: "Starting Point" },
      { name: "Bairagarh", time: "08:25 AM", type: "Pickup Stop" },
      { name: "Sehore", time: "09:10 AM", type: "Destination" },
    ],
  },
  {
    plate: "MP 04 PA 9012",
    busNumber: "OCT BUS 03",
    destination: "Bhopal",
    departure: "07:15 AM",
    driver: "College Transport",
    stops: [
      { name: "Vidisha", time: "07:15 AM", type: "Starting Point" },
      { name: "Sanchi", time: "07:45 AM", type: "Pickup Stop" },
      { name: "Raisen", time: "08:20 AM", type: "Pickup Stop" },
      { name: "Bhopal", time: "09:10 AM", type: "Destination" },
    ],
  },
];

const normalizeBusNumber = (value: string) =>
  value.trim().replace(/[\s-]/g, "").toUpperCase();

function FindBynumber() {
  const [plate, setPlate] = useState("");
  const [selectedBus, setSelectedBus] = useState<BusRoute | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const handleQuickSearch = (event: Event) => {
      const { query, busType } = (
        event as CustomEvent<{ query: string; busType: string }>
      ).detail;

      if (busType !== "bus") return;

      const normalizedQuery = normalizeBusNumber(query);
      const result = buses.find(
        (bus) =>
          normalizeBusNumber(bus.plate) === normalizedQuery ||
          normalizeBusNumber(bus.busNumber) === normalizedQuery
      );

      setPlate(query);
      setSelectedBus(result ?? null);
      setSearched(true);
    };

    window.addEventListener("octride:search", handleQuickSearch);
    return () =>
      window.removeEventListener("octride:search", handleQuickSearch);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedPlate = normalizeBusNumber(plate);

    const result = buses.find(
      (bus) =>
        normalizeBusNumber(bus.plate) === normalizedPlate ||
        normalizeBusNumber(bus.busNumber) === normalizedPlate
    );

    setSelectedBus(result || null);
    setSearched(true);
  };

  const resetSearch = () => {
    setPlate("");
    setSelectedBus(null);
    setSearched(false);
  };

  return (
    <section
      id="bus-number-search"
      className="relative overflow-hidden bg-white px-5 py-20 text-neutral-950 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-neutral-400">
            OCT RIDE / Bus identification
          </p>

          <h2 className="mt-5 text-4xl font-black leading-[1.05] tracking-[-0.06em] sm:text-6xl">
            One number.
            <br />
            <span className="text-neutral-400">Every stop.</span>
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-500 sm:text-base">
            Enter the bus registration number or OCT bus number
            to discover its destination and complete route.
          </p>
        </div>

        {/* Search card */}
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="rounded-2xl bg-[#090909] p-6 text-white sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/10">
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
                <rect x="3" y="4" width="18" height="16" rx="3" />
                <path d="M3 10h18M7 7h2m6 0h2M7 16h.01M17 16h.01" />
              </svg>
            </div>

            <h3 className="mt-6 text-2xl font-bold tracking-tight">
              Identify your bus
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/50">
              Find the route linked to a vehicle registration
              number or its college bus number.
            </p>

            <form onSubmit={handleSearch} className="mt-7">
              <label
                htmlFor="bus-plate"
                className="mb-2 block text-xs font-semibold text-white/70"
              >
                Registration / Bus Number
              </label>

              <input
                id="bus-plate"
                type="text"
                value={plate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPlate(e.target.value)
                }
                placeholder="e.g. MP 04 PA 1234"
                autoComplete="off"
                required
                className="h-14 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/50"
              />

              <button
                type="submit"
                className="mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-white px-5 text-sm font-bold text-black transition hover:bg-neutral-200 active:scale-[0.99]"
              >
                Find bus route
                <span aria-hidden="true">↗</span>
              </button>
            </form>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                Demo registration numbers
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {buses.map((bus) => (
                  <button
                    key={bus.plate}
                    type="button"
                    onClick={() => {
                      setPlate(bus.plate);
                      setSelectedBus(null);
                      setSearched(false);
                    }}
                    className="rounded-lg border border-white/15 px-3 py-2 text-[11px] font-medium text-white/70 transition hover:border-white/40 hover:text-white"
                  >
                    {bus.plate}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div
            id="bus-search-results"
            aria-live="polite"
            className="min-w-0"
          >
            {!searched && !selectedBus && (
              <div className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center sm:min-h-[390px]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-7 w-7 text-neutral-500"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m16 16 4 4" />
                  </svg>
                </div>

                <h3 className="mt-5 text-xl font-bold tracking-tight">
                  Your route will appear here
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-500">
                  Enter a registration number or select a demo
                  number to view the bus route and stops.
                </p>
              </div>
            )}

            {searched && !selectedBus && (
              <div className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-neutral-200 px-6 py-12 text-center sm:min-h-[390px]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-2xl">
                  !
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  No matching bus found
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
                  Check the registration number and try again.
                  Only buses present in the current route data
                  can be found.
                </p>

                <button
                  type="button"
                  onClick={resetSearch}
                  className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
                >
                  Try another number
                </button>
              </div>
            )}

            {selectedBus && (
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                {/* Result header */}
                <div className="border-b border-neutral-200 p-5 sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                        Bus identified
                      </p>

                      <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                        {selectedBus.busNumber}
                      </h3>

                      <p className="mt-2 font-mono text-xs text-neutral-500">
                        {selectedBus.plate}
                      </p>
                    </div>

                    <span className="rounded-lg bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-600">
                      Route found
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-neutral-50 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                        Destination
                      </p>
                      <p className="mt-2 text-lg font-bold">
                        {selectedBus.destination}
                      </p>
                    </div>

                    <div className="rounded-xl bg-neutral-50 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                        Departure
                      </p>
                      <p className="mt-2 text-lg font-bold">
                        {selectedBus.departure}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Route timeline */}
                <div className="p-5 sm:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-lg font-bold">
                      Complete bus route
                    </h4>

                    <span className="text-xs text-neutral-400">
                      {selectedBus.stops.length} stops
                    </span>
                  </div>

                  <div className="mt-6">
                    {selectedBus.stops.map((stop, index) => (
                      <div
                        key={`${selectedBus.plate}-${stop.name}`}
                        className="relative flex gap-4 pb-7 last:pb-0"
                      >
                        {index !== selectedBus.stops.length - 1 && (
                          <div className="absolute bottom-0 left-[11px] top-6 w-px bg-neutral-200" />
                        )}

                        <div
                          className={`relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                            index === 0 ||
                            index === selectedBus.stops.length - 1
                              ? "border-black bg-black text-white"
                              : "border-neutral-300 bg-white text-neutral-500"
                          }`}
                        >
                          {index === 0 ||
                          index === selectedBus.stops.length - 1 ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                          )}
                        </div>

                        <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-neutral-900">
                              {stop.name}
                            </p>

                            <p className="mt-1 text-xs text-neutral-400">
                              {stop.type}
                            </p>
                          </div>

                          <span className="shrink-0 pt-0.5 text-xs font-semibold tabular-nums text-neutral-600">
                            {stop.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={resetSearch}
                    className="mt-7 w-full rounded-xl border border-neutral-200 px-5 py-3.5 text-sm font-semibold transition hover:bg-neutral-50"
                  >
                    Search another bus
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom note */}
        <p className="mt-8 text-xs leading-6 text-neutral-400">
          Note: Registration numbers, destinations and timings above
          are sample data. Replace them with verified OCT college
          transport details before publishing.
        </p>
      </div>
    </section>
  );
}

export default FindBynumber;
