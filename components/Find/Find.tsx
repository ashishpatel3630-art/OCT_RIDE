
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Route = {
  id: string;
  name: string;
  origin: string;
  destination: string;
  route_stops: {
    stop_order: number;
    scheduled_time: string | null;
    stops: {
      id: string;
      name: string;
      address: string | null;
    } | null;
  }[];
  buses: {
    id: string;
    bus_number: string;
    registration_number: string;
    active: boolean;
  }[];
};

type Filter = "all" | "bus" | "location" | "route";

const filters: { label: string; value: Filter }[] = [
  { label: "All transport", value: "all" },
  { label: "Bus number", value: "bus" },
  { label: "Pickup location", value: "location" },
  { label: "Route name", value: "route" },
];

function Icon({
  name,
  className = "size-5",
}: {
  name: "search" | "bus" | "pin" | "arrow" | "clock" | "chevron" | "route" | "close";
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "search":
      return (
        <svg {...common}>
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4 4" />
        </svg>
      );
    case "bus":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="15" rx="3" />
          <path d="M4 10h16M8 18v3m8-3v3M4 14h16" />
          <circle cx="8" cy="15" r="1" />
          <circle cx="16" cy="15" r="1" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...common}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case "route":
      return (
        <svg {...common}>
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <path d="M8.5 18H12a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="m18 6-12 12M6 6l12 12" />
        </svg>
      );
  }
}

export default function Find() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selectedBus, setSelectedBus] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadRoutes() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/routes", {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to load transport routes.");
        }

        setRoutes(Array.isArray(data.routes) ? data.routes : []);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadRoutes();
    return () => controller.abort();
  }, []);

  const activeRoutes = useMemo(
    () =>
      routes.filter(
        (route) => route.buses?.some((bus) => bus.active) ?? false
      ),
    [routes]
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) return activeRoutes;

    return activeRoutes.filter((route) => {
      const busValues = route.buses
        .filter((bus) => bus.active)
        .flatMap((bus) => [bus.bus_number, bus.registration_number]);

      const locationValues = route.route_stops.flatMap((stop) => [
        stop.stops?.name ?? "",
        stop.stops?.address ?? "",
      ]);

      const routeValues = [
        route.name,
        route.origin,
        route.destination,
      ];

      const values =
        filter === "bus"
          ? busValues
          : filter === "location"
            ? locationValues
            : filter === "route"
              ? routeValues
              : [...busValues, ...locationValues, ...routeValues];

      return values.some((value) =>
        value.toLowerCase().includes(needle)
      );
    });
  }, [activeRoutes, query, filter]);

  function toggleExpanded(routeId: string) {
    setExpanded((current) =>
      current.includes(routeId)
        ? current.filter((id) => id !== routeId)
        : [...current, routeId]
    );
  }

  function searchLocation(location: string) {
    setQuery(location);
    setFilter("location");
  }

  function clearSearch() {
    setQuery("");
    setFilter("all");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F7FC] pb-20 text-[#14213D]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute -right-40 -top-40 size-[480px] rounded-full bg-blue-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-[25%] size-80 rounded-full bg-indigo-50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-14 pt-32 sm:px-8 sm:pb-20 sm:pt-36 lg:grid-cols-[1fr_.85fr] lg:items-center lg:px-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-bold uppercase tracking-[.15em] text-blue-800">
              <span className="size-2 rounded-full bg-blue-600" />
              OGI RIDE / Transport
            </div>

            <h1 className="mt-7 max-w-2xl text-[3.2rem] font-semibold leading-[1.02] tracking-[-.065em] sm:text-6xl lg:text-[4.5rem]">
              Every route.
              <br />
              <span className="text-[#3157D5]">One destination.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Discover college bus routes, find nearby pickup points and
              check scheduled timings with a simpler transport experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#routes"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#3157D5] px-5 text-sm font-semibold text-white shadow-lg shadow-blue-900/10 transition hover:-translate-y-0.5 hover:bg-blue-800"
              >
                Explore routes <Icon name="arrow" />
              </a>
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
              >
                Student portal
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                Published bus routes
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                Pickup schedules
              </span>
            </div>
          </div>

          {/* INTERACTIVE SEARCH PANEL */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_25px_80px_-35px_rgba(31,65,140,.28)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.15em] text-blue-700">
                  Smart route search
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Where do you need to go?
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Choose what you want to search for.
                </p>
              </div>
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Icon name="search" className="size-6" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  aria-pressed={filter === item.value}
                  className={`min-h-10 rounded-xl border px-2 py-2 text-xs font-semibold transition sm:text-[11px] ${
                    filter === item.value
                      ? "border-[#3157D5] bg-[#3157D5] text-white shadow-md shadow-blue-900/10"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <label
              htmlFor="route-query"
              className="mb-2 mt-5 block text-sm font-semibold text-slate-700"
            >
              {filter === "bus"
                ? "Enter bus number or registration"
                : filter === "location"
                  ? "Enter pickup location"
                  : filter === "route"
                    ? "Enter route name or destination"
                    : "Search transport"}
            </label>

            <div className="flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10">
              <Icon name="search" className="shrink-0 text-slate-400" />
              <input
                id="route-query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") clearSearch();
                }}
                placeholder={
                  filter === "bus"
                    ? "e.g. BUS 01"
                    : filter === "location"
                      ? "e.g. Railway Station"
                      : filter === "route"
                        ? "e.g. Bhopal to Sehore"
                        : "Bus number, stop or destination"
                }
                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
                type="search"
              />

              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200"
                >
                  <Icon name="close" className="size-4" />
                </button>
              )}
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              Results update automatically as you type.
            </p>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold tracking-wide text-slate-500">
                QUICK SEARCH
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Bhopal", "Railway Station", "Sehore", "Kalapipal"].map(
                  (place) => (
                    <button
                      key={place}
                      type="button"
                      onClick={() => searchLocation(place)}
                      className="rounded-full border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
                    >
                      {place}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROUTE RESULTS */}
      <section
        id="routes"
        className="mx-auto max-w-7xl px-5 pt-12 sm:px-8 sm:pt-16 lg:px-12"
        aria-live="polite"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-700">
              College transport network
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-.045em] sm:text-4xl">
              {query ? "Matching routes" : "Explore bus routes"}
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              {loading
                ? "Loading published routes..."
                : `${results.length} ${
                    results.length === 1 ? "route" : "routes"
                  } available`}
            </p>
          </div>

          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="inline-flex min-h-10 items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-700 sm:self-auto"
            >
              <Icon name="close" className="size-4" /> Reset filters
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6"
              >
                <div className="h-5 w-2/3 rounded bg-slate-200" />
                <div className="mt-4 h-4 w-1/2 rounded bg-slate-100" />
                <div className="mt-8 space-y-4">
                  <div className="h-4 rounded bg-slate-100" />
                  <div className="h-4 w-3/4 rounded bg-slate-100" />
                  <div className="h-4 w-1/2 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            role="alert"
            className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6"
          >
            <h3 className="font-semibold text-amber-950">
              Could not load transport data
            </h3>
            <p className="mt-2 text-sm leading-6 text-amber-900">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-amber-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-950"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && results.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Icon name="search" className="size-7" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">
              {query ? "No matching routes found" : "No active routes yet"}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {query
                ? "Try another bus number, route name or pickup location."
                : "Published routes with active buses will appear here."}
            </p>
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="mt-5 rounded-xl bg-[#3157D5] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Show all routes
              </button>
            )}
          </div>
        )}

        {/* Cards */}
        {!loading && !error && results.length > 0 && (
          <div className="mt-8 grid items-start gap-5 md:grid-cols-2">
            {results.map((route) => {
              const buses = route.buses.filter((bus) => bus.active);
              const stops = [...route.route_stops].sort(
                (a, b) => a.stop_order - b.stop_order
              );
              const isExpanded = expanded.includes(route.id);
              const visibleStops = isExpanded ? stops : stops.slice(0, 4);
              const chosenBusId = selectedBus[route.id];
              const chosenBus = buses.find((bus) => bus.id === chosenBusId);

              return (
                <article
                  key={route.id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_-24px_rgba(15,23,42,.3)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_50px_-30px_rgba(49,87,213,.35)]"
                >
                  <div className="border-b border-slate-100 p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#3157D5] transition group-hover:bg-[#3157D5] group-hover:text-white">
                        <Icon name="bus" className="size-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                          {route.name}
                        </h3>
                        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                          <span>{route.origin}</span>
                          <Icon name="arrow" className="size-4" />
                          <span>{route.destination}</span>
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                        {buses.length} {buses.length === 1 ? "bus" : "buses"}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-3.5">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Icon name="route" className="size-4" />
                          <span className="text-xs">Route stops</span>
                        </div>
                        <p className="mt-2 text-xl font-semibold text-slate-900">
                          {stops.length}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3.5">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Icon name="bus" className="size-4" />
                          <span className="text-xs">Active buses</span>
                        </div>
                        <p className="mt-2 text-xl font-semibold text-slate-900">
                          {buses.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-sm font-semibold text-slate-800">
                        Pickup timeline
                      </h4>
                      <span className="text-xs text-slate-400">
                        {stops.length} stops
                      </span>
                    </div>

                    {stops.length > 0 ? (
                      <ol className="mt-5">
                        {visibleStops.map((item, index) => (
                          <li
                            key={`${route.id}-${item.stop_order}-${item.stops?.id ?? index}`}
                            className="flex gap-3"
                          >
                            <div className="relative flex w-4 shrink-0 justify-center">
                              {index < visibleStops.length - 1 && (
                                <span className="absolute bottom-[-4px] top-3 w-px bg-slate-200" />
                              )}
                              <span
                                className={`relative z-10 mt-1 size-2.5 rounded-full ring-4 ring-white ${
                                  index === 0 ||
                                  index === visibleStops.length - 1
                                    ? "bg-[#3157D5]"
                                    : "bg-slate-300"
                                }`}
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                searchLocation(item.stops?.name ?? "")
                              }
                              disabled={!item.stops?.name}
                              className="mb-4 flex min-w-0 flex-1 items-start justify-between gap-3 rounded-xl text-left transition hover:bg-blue-50/70 disabled:cursor-default"
                              title="Search routes serving this stop"
                            >
                              <span className="min-w-0 px-1">
                                <span className="block text-sm font-medium text-slate-800">
                                  {item.stops?.name ?? "Unnamed stop"}
                                </span>
                                {item.stops?.address && (
                                  <span className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
                                    <Icon name="pin" className="mt-0.5 size-3.5" />
                                    {item.stops.address}
                                  </span>
                                )}
                                <span className="mt-1 block text-[11px] text-blue-600 opacity-0 transition group-hover:opacity-100">
                                  Search this pickup location
                                </span>
                              </span>

                              {item.scheduled_time && (
                                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-semibold tabular-nums text-slate-600">
                                  <Icon name="clock" className="size-3.5" />
                                  {item.scheduled_time.slice(0, 5)}
                                </span>
                              )}
                            </button>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                        Pickup stops have not been published.
                      </p>
                    )}

                    {stops.length > 4 && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(route.id)}
                        aria-expanded={isExpanded}
                        className="mt-1 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        {isExpanded ? "Show fewer stops" : `Show all ${stops.length} stops`}
                        <Icon
                          name="chevron"
                          className={`size-4 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}

                    {/* Selectable bus details */}
                    <div className="mt-6 border-t border-slate-100 pt-5">
                      <h4 className="text-sm font-semibold text-slate-800">
                        Choose a bus
                      </h4>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Select a bus to highlight its registration details.
                      </p>

                      {buses.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {buses.map((bus) => {
                            const active = chosenBusId === bus.id;

                            return (
                              <button
                                key={bus.id}
                                type="button"
                                onClick={() =>
                                  setSelectedBus((current) => ({
                                    ...current,
                                    [route.id]: bus.id,
                                  }))
                                }
                                aria-pressed={active}
                                className={`rounded-xl border px-3 py-2.5 text-left transition ${
                                  active
                                    ? "border-[#3157D5] bg-blue-50 text-blue-800 ring-2 ring-blue-500/10"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-slate-50"
                                }`}
                              >
                                <span className="flex items-center gap-2 text-xs font-semibold">
                                  <Icon name="bus" className="size-4" />
                                  {bus.bus_number}
                                </span>
                                <span className="mt-1 block text-[11px] text-slate-500">
                                  {bus.registration_number}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-slate-500">
                          No active buses listed.
                        </p>
                      )}

                      {chosenBus && (
                        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                            Selected bus
                          </p>
                          <p className="mt-2 font-semibold text-slate-900">
                            {chosenBus.bus_number}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            Registration: {chosenBus.registration_number}
                          </p>
                          <p className="mt-2 text-xs leading-5 text-slate-500">
                            Driver information and live location will be
                            available here once connected to the relevant
                            authorized APIs.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-[#F6F8FF] p-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800">
                          Your transport, in one place
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Sign in for your student-specific information.
                        </p>
                      </div>
                      <Link
                        href="/login"
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#3157D5] px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-800 sm:text-sm"
                      >
                        Sign in <Icon name="arrow" className="size-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-900">
                Need help with your bus allocation?
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Sign in to view the services available to your student account.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
            >
              Open student portal <Icon name="arrow" />
            </Link>
          </div>
        )}
      </section>

      <footer className="mx-auto mt-16 max-w-7xl border-t border-slate-200 px-5 pt-6 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-bold tracking-wide text-slate-800">
              OGI RIDE
            </span>{" "}
            · College transport made easier.
          </p>
          <p>Pickup times are scheduled and may change.</p>
        </div>
      </footer>
    </main>
  );
}
