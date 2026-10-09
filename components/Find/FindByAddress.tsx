
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Search,
  Clock3,
  ArrowUpRight,
  Navigation,
  BusFront,
  MapPinned,
  LocateFixed,
  RotateCcw,
} from "lucide-react";

const pickupData = [
  {
    id: 1,
    bus: "OCT BUS 01",
    busNumber: "MP 04 PA 1234",
    destination: "Indore",
    departure: "07:30 AM",
    pickupPoint: "Bhopal Railway Station",
    pickupTime: "07:15 AM",
    address: "Railway Station, Bhopal",
    distance: "Main pickup point",
    stops: ["Bhopal", "Sehore", "Dewas", "Indore"],
  },
  {
    id: 2,
    bus: "OCT BUS 02",
    busNumber: "MP 04 PA 5678",
    destination: "Sehore",
    departure: "08:00 AM",
    pickupPoint: "Bairagarh",
    pickupTime: "07:35 AM",
    address: "Bairagarh, Bhopal",
    distance: "Local pickup point",
    stops: ["Bhopal", "Bairagarh", "Sehore"],
  },
  {
    id: 3,
    bus: "OCT BUS 03",
    busNumber: "MP 04 PA 9012",
    destination: "Bhopal",
    departure: "07:15 AM",
    pickupPoint: "Vidisha Bus Stand",
    pickupTime: "07:15 AM",
    address: "Vidisha, Madhya Pradesh",
    distance: "Route pickup point",
    stops: ["Vidisha", "Sanchi", "Raisen", "Bhopal"],
  },
];

function FindByAddress() {
  const [address, setAddress] = useState("");
  const [searchedAddress, setSearchedAddress] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const handleQuickSearch = (event: Event) => {
      const { query, busType } = (
        event as CustomEvent<{ query: string; busType: string }>
      ).detail;

      if (busType !== "destination") return;

      setAddress(query);
      setSearchedAddress(query);
      setSearched(true);
    };

    window.addEventListener("octride:search", handleQuickSearch);
    return () =>
      window.removeEventListener("octride:search", handleQuickSearch);
  }, []);

  const filteredBuses = useMemo(() => {
    const query = searchedAddress.trim().toLowerCase();

    if (!query) return [];

    return pickupData.filter((bus) => {
      const searchableText = [
        bus.bus,
        bus.busNumber,
        bus.destination,
        bus.pickupPoint,
        bus.address,
        ...bus.stops,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [searchedAddress]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!address.trim()) return;

    setSearchedAddress(address.trim());
    setSearched(true);
  };

  const resetSearch = () => {
    setAddress("");
    setSearchedAddress("");
    setSearched(false);
  };

  const handleSuggestion = (value: string) => {
    setAddress(value);
    setSearchedAddress(value);
    setSearched(true);
  };

  return (
    <section
      id="find-by-address"
      className="relative overflow-hidden bg-[#f7f7f5] px-4 py-20 text-[#111111] sm:px-6 lg:px-10 lg:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full border border-black/[0.05]" />
      <div className="pointer-events-none absolute -right-20 top-20 h-56 w-56 rounded-full border border-black/[0.05]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-12 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
            <MapPin size={14} />
            Find your pickup point
          </div>

          <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-5xl lg:text-7xl">
            Your location.
            <br />
            <span className="text-neutral-400">Your bus route.</span>
          </h2>

          <p className="mt-6 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg">
            Enter your area, street, landmark or pickup point to check
            matching OCT RIDE bus routes and pickup timings.
          </p>
        </div>

        {/* Search panel */}
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-black/[0.07] bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-500">
                  LOCATION SEARCH
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  Where do you board?
                </h3>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black text-white">
                <MapPinned size={22} />
              </div>
            </div>

            <form onSubmit={handleSearch}>
              <label
                htmlFor="pickup-address"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Enter your area or landmark
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#f8f8f7] px-4 transition focus-within:border-black">
                <MapPin size={19} className="shrink-0 text-neutral-500" />

                <input
                  id="pickup-address"
                  type="text"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="e.g. Bairagarh, Bhopal"
                  className="min-w-0 flex-1 bg-transparent py-4 text-sm text-black outline-none placeholder:text-neutral-400 sm:text-base"
                  autoComplete="street-address"
                />

                {address && (
                  <button
                    type="button"
                    onClick={resetSearch}
                    aria-label="Clear address"
                    className="text-neutral-400 transition hover:text-black"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={!address.trim()}
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Search size={18} />
                Find buses near me
                <ArrowUpRight size={18} />
              </button>
            </form>

            <div className="my-7 h-px bg-black/[0.07]" />

            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-600">
              <Navigation size={15} />
              Try a sample location
            </div>

            <div className="flex flex-wrap gap-2">
              {["Bhopal", "Bairagarh", "Sehore", "Vidisha"].map(
                (location) => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => handleSuggestion(location)}
                    className="rounded-full border border-black/10 px-4 py-2 text-sm text-neutral-600 transition hover:border-black hover:bg-black hover:text-white"
                  >
                    {location}
                  </button>
                )
              )}
            </div>

            <div className="mt-7 flex gap-3 rounded-2xl bg-[#f5f5f3] p-4">
              <LocateFixed
                size={19}
                className="mt-0.5 shrink-0 text-neutral-600"
              />
              <p className="text-xs leading-5 text-neutral-500">
                Search by a known area or pickup-point name. Automatic GPS
                location and live distance calculations are not enabled in
                this demo.
              </p>
            </div>
          </div>

          {/* Results panel */}
          <div
            id="pickup-search-results"
            className="min-h-[430px] rounded-[28px] bg-[#111111] p-5 text-white sm:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-neutral-500">
                  Route explorer
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  {searched ? "Search results" : "Pickup information"}
                </h3>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                <BusFront size={23} />
              </div>
            </div>

            {!searched && (
              <div className="flex min-h-[310px] flex-col items-center justify-center text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                  <MapPin size={32} className="text-neutral-400" />
                </div>

                <h4 className="text-xl font-medium">
                  Find the right pickup point
                </h4>

                <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                  Search for your area to see matching sample bus routes,
                  destinations and pickup timings here.
                </p>
              </div>
            )}

            {searched && filteredBuses.length > 0 && (
              <div className="mt-7 space-y-4">
                <p className="text-sm text-neutral-400">
                  {filteredBuses.length} matching{" "}
                  {filteredBuses.length === 1 ? "route" : "routes"} for{" "}
                  <span className="font-medium text-white">
                    “{searchedAddress}”
                  </span>
                </p>

                {filteredBuses.map((bus) => (
                  <article
                    key={bus.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 transition hover:border-white/25"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.13em] text-neutral-500">
                          {bus.bus}
                        </p>
                        <h4 className="mt-2 text-xl font-semibold">
                          {bus.destination}
                        </h4>
                        <p className="mt-1 text-xs text-neutral-500">
                          Plate: {bus.busNumber}
                        </p>
                      </div>

                      <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-neutral-300">
                        {bus.departure}
                      </span>
                    </div>

                    <div className="my-5 h-px bg-white/10" />

                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black">
                        <MapPin size={19} />
                      </div>

                      <div>
                        <p className="text-xs text-neutral-500">
                          Matching pickup point
                        </p>
                        <p className="mt-1 font-medium">{bus.pickupPoint}</p>
                        <p className="mt-1 text-sm text-neutral-400">
                          {bus.address}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10">
                        <Clock3 size={18} className="text-neutral-300" />
                      </div>

                      <div>
                        <p className="text-xs text-neutral-500">
                          Pickup time
                        </p>
                        <p className="mt-1 font-medium">{bus.pickupTime}</p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                        Route stops
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        {bus.stops.map((stop, index) => (
                          <React.Fragment key={stop}>
                            <span
                              className={`rounded-lg px-3 py-2 text-xs ${
                                stop.toLowerCase() ===
                                searchedAddress.toLowerCase()
                                  ? "bg-white font-semibold text-black"
                                  : "bg-white/[0.07] text-neutral-300"
                              }`}
                            >
                              {stop}
                            </span>

                            {index < bus.stops.length - 1 && (
                              <span className="text-neutral-600">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {searched && filteredBuses.length === 0 && (
              <div className="flex min-h-[310px] flex-col items-center justify-center text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                  <Search size={30} className="text-neutral-400" />
                </div>

                <h4 className="text-xl font-medium">No matching route yet</h4>

                <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                  We couldn&apos;t match “{searchedAddress}” with the sample
                  route data. Try a nearby landmark or pickup-point name.
                </p>

                <button
                  type="button"
                  onClick={resetSearch}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-medium transition hover:bg-white hover:text-black"
                >
                  <RotateCcw size={15} />
                  Search another location
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-8 flex flex-col gap-3 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-neutral-500">
            OCT RIDE helps students discover bus routes and pickup
            information without having to ask around manually.
          </p>

          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            <span className="h-2 w-2 rounded-full bg-neutral-400" />
            Route information demo
          </span>
        </div>

        <p className="mt-4 text-xs leading-5 text-neutral-400">
          Demo only: the bus numbers, routes, pickup points and timings above
          are sample data. Replace them with verified OCT bus information
          before students rely on this section.
        </p>
      </div>
    </section>
  );
}

export default FindByAddress;
