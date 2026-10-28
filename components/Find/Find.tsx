
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type RouteStop = {
  stop_order: number;
  scheduled_time: string | null;
  stops: {
    id: string;
    name: string;
    address: string | null;
  } | null;
};

type Bus = {
  id: string;
  bus_number: string;
  registration_number: string;
  active: boolean;
};

type Route = {
  id: string;
  name: string;
  origin: string;
  destination: string;
  route_stops: RouteStop[];
  buses: Bus[];
};

type Filter = "all" | "bus" | "location" | "route";

const filters: { label: string; value: Filter }[] = [
  { label: "Everything", value: "all" },
  { label: "Bus number", value: "bus" },
  { label: "Pickup point", value: "location" },
  { label: "Route", value: "route" },
];

function Icon({
  name,
  className = "size-5",
}: {
  name:
    | "search"
    | "bus"
    | "pin"
    | "arrow"
    | "clock"
    | "chevron"
    | "route"
    | "close"
    | "check"
    | "refresh";
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
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
    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );
    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 7v5h-5M4 17v-5h5" />
          <path d="M5.6 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.4-3" />
        </svg>
      );
  }
}

export default function Find() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selectedBus, setSelectedBus] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRoutes() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/routes", {
          signal: controller.signal,
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ?? "Unable to load transport routes."
          );
        }

        setRoutes(Array.isArray(data.routes) ? data.routes : []);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadRoutes();

    return () => controller.abort();
  }, [retry]);

  const activeRoutes = useMemo(
    () =>
      routes.filter((route) =>
        route.buses?.some((bus) => bus.active)
      ),
    [routes]
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) return activeRoutes;

    return activeRoutes.filter((route) => {
      const activeBuses = route.buses.filter((bus) => bus.active);

      const busValues = activeBuses.flatMap((bus) => [
        bus.bus_number,
        bus.registration_number,
      ]);

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

  function clearSearch() {
    setQuery("");
    setFilter("all");
  }

  function searchLocation(location: string) {
    setQuery(location);
    setFilter("location");
    document.getElementById("route-query")?.focus();
  }

  function toggleExpanded(routeId: string) {
    setExpanded((current) =>
      current.includes(routeId)
        ? current.filter((id) => id !== routeId)
        : [...current, routeId]
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F5F5] pb-16 text-[#171717]">
      {/* HERO */}
      <section className="relative border-b border-[#E5E5E5] bg-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#171717]" />

        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:grid-cols-[1.05fr_.85fr] lg:items-center lg:gap-16 lg:px-12 lg:pb-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-[#FAFAFA] px-3.5 py-2 text-xs font-semibold uppercase tracking-[.14em] text-[#404040]">
              <span className="size-2 rounded-full bg-[#171717]" />
              OGI RIDE
              <span className="text-[#A3A3A3]">/</span>
              College transport
            </div>

            <h1 className="mt-7 max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-.065em] sm:text-6xl lg:text-[4.8rem]">
              Your route.
              <br />
              Your everyday
              <br />
              <span className="text-[#737373]">journey.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-[#737373] sm:text-lg sm:leading-8">
              Find your college bus, explore pickup points and check
              scheduled timings — all in one simple place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#routes"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#737373] focus-visible:ring-offset-2"
              >
                Explore routes
                <Icon name="arrow" className="size-4" />
              </a>

              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white px-5 text-sm font-semibold text-[#262626] transition hover:border-[#A3A3A3] hover:bg-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#737373] focus-visible:ring-offset-2"
              >
                Student portal
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#737373]">
              <span className="flex items-center gap-2">
                <Icon name="check" className="size-4 text-[#404040]" />
                Published routes
              </span>
              <span className="flex items-center gap-2">
                <Icon name="check" className="size-4 text-[#404040]" />
                Pickup schedules
              </span>
              <span className="flex items-center gap-2">
                <Icon name="check" className="size-4 text-[#404040]" />
                Bus details
              </span>
            </div>
          </div>

          {/* SEARCH PANEL */}
          <div className="rounded-[28px] border border-[#E5E5E5] bg-white p-5 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.25)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#737373]">
                  Find your journey
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-.04em] sm:text-[1.8rem]">
                  Where are you headed?
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#737373]">
                  Search buses, destinations or pickup locations.
                </p>
              </div>

              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#171717] text-white">
                <Icon name="search" className="size-5" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  aria-pressed={filter === item.value}
                  className={`min-h-10 rounded-xl border px-2 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#737373] focus-visible:ring-offset-1 ${
                    filter === item.value
                      ? "border-[#171717] bg-[#171717] text-white"
                      : "border-[#E5E5E5] bg-white text-[#525252] hover:border-[#A3A3A3] hover:bg-[#F5F5F5]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <label
              htmlFor="route-query"
              className="mb-2 mt-5 block text-sm font-semibold text-[#404040]"
            >
              {filter === "bus"
                ? "Bus number or registration"
                : filter === "location"
                  ? "Pickup location"
                  : filter === "route"
                    ? "Route or destination"
                    : "Search transport"}
            </label>

            <div className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] px-4 transition focus-within:border-[#737373] focus-within:bg-white focus-within:ring-4 focus-within:ring-black/5">
              <Icon
                name="search"
                className="size-5 shrink-0 text-[#737373]"
              />

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
                        : "Bus, stop or destination"
                }
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#171717] outline-none placeholder:text-[#A3A3A3]"
                type="search"
                autoComplete="off"
              />

              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="rounded-lg p-1.5 text-[#737373] transition hover:bg-[#E5E5E5] hover:text-black"
                >
                  <Icon name="close" className="size-4" />
                </button>
              )}
            </div>

            <p className="mt-3 text-xs leading-5 text-[#737373]">
              Results update automatically as you type.
            </p>

            <div className="mt-5 border-t border-[#EEEEEE] pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#737373]">
                Popular searches
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "Bhopal",
                  "Railway Station",
                  "Sehore",
                  "Kalapipal",
                ].map((place) => (
                  <button
                    key={place}
                    type="button"
                    onClick={() => searchLocation(place)}
                    className="rounded-full border border-[#E5E5E5] px-3.5 py-2 text-xs font-medium text-[#525252] transition hover:border-[#A3A3A3] hover:bg-[#F5F5F5] hover:text-black"
                  >
                    {place}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROUTE RESULTS */}
      <section
        id="routes"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 pt-12 sm:px-8 sm:pt-16 lg:px-12"
        aria-live="polite"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#737373]">
              Your college transport network
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-[-.05em] sm:text-4xl">
              {query ? "Search results" : "Explore bus routes"}
            </h2>

            <p className="mt-3 text-sm text-[#737373]">
              {loading
                ? "Loading published routes..."
                : error
                  ? "Routes are temporarily unavailable."
                  : `${results.length} ${
                      results.length === 1 ? "route" : "routes"
                    } found`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!loading && !error && (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-3 py-2 text-xs font-medium text-[#525252]">
                <span className="size-1.5 rounded-full bg-[#171717]" />
                Active services
              </span>
            )}

            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-4 text-sm font-semibold text-[#525252] transition hover:border-[#A3A3A3] hover:bg-[#F5F5F5] hover:text-black"
              >
                <Icon name="close" className="size-4" />
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-3xl border border-[#E5E5E5] bg-white p-6"
              >
                <div className="h-5 w-2/3 rounded bg-[#E5E5E5]" />
                <div className="mt-4 h-4 w-1/2 rounded bg-[#EEEEEE]" />
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="h-20 rounded-2xl bg-[#F5F5F5]" />
                  <div className="h-20 rounded-2xl bg-[#F5F5F5]" />
                </div>
                <div className="mt-6 space-y-4">
                  <div className="h-4 rounded bg-[#EEEEEE]" />
                  <div className="h-4 w-3/4 rounded bg-[#EEEEEE]" />
                  <div className="h-4 w-1/2 rounded bg-[#EEEEEE]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div
            role="alert"
            className="mt-8 rounded-3xl border border-[#E5E5E5] bg-white p-8"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#F5F5F5] text-[#171717]">
              <Icon name="refresh" className="size-6" />
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              Could not load transport data
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#737373]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setRetry((value) => value + 1)}
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#171717] px-5 text-sm font-semibold text-white transition hover:bg-[#333333]"
            >
              <Icon name="refresh" className="size-4" />
              Try again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && results.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-[#D4D4D4] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#F5F5F5] text-[#171717]">
              <Icon name="search" className="size-7" />
            </div>

            <h3 className="mt-5 text-xl font-semibold tracking-tight">
              {query ? "No matching routes" : "No active routes yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#737373]">
              {query
                ? "Try a different bus number, pickup point or destination."
                : "Active buses and their published routes will appear here."}
            </p>

            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="mt-5 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333333]"
              >
                View all routes
              </button>
            )}
          </div>
        )}

        {/* ROUTE CARDS */}
        {!loading && !error && results.length > 0 && (
          <div className="mt-8 grid items-start gap-5 lg:grid-cols-2">
            {results.map((route) => {
              const buses = route.buses.filter((bus) => bus.active);

              const stops = [...route.route_stops].sort(
                (a, b) => a.stop_order - b.stop_order
              );

              const isExpanded = expanded.includes(route.id);
              const visibleStops = isExpanded
                ? stops
                : stops.slice(0, 4);

              const chosenBusId = selectedBus[route.id];
              const chosenBus = buses.find(
                (bus) => bus.id === chosenBusId
              );

              return (
                <article
                  key={route.id}
                  className="group overflow-hidden rounded-3xl border border-[#E5E5E5] bg-white shadow-[0_8px_30px_-24px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:border-[#BDBDBD] hover:shadow-[0_22px_50px_-30px_rgba(0,0,0,0.25)]"
                >
                  {/* CARD HEADER */}
                  <div className="border-b border-[#EEEEEE] p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#171717] text-white transition group-hover:bg-[#333333]">
                        <Icon name="bus" className="size-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-lg font-semibold tracking-tight text-[#171717] sm:text-xl">
                          {route.name}
                        </h3>

                        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#737373]">
                          <span>{route.origin}</span>
                          <Icon name="arrow" className="size-4" />
                          <span>{route.destination}</span>
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full border border-[#E5E5E5] bg-[#F7F7F7] px-3 py-1.5 text-xs font-semibold text-[#404040]">
                        {buses.length} {buses.length === 1 ? "bus" : "buses"}
                      </span>
                    </div>

                    {/* ROUTE STATISTICS */}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-[#EEEEEE] bg-[#F7F7F7] p-4">
                        <div className="flex items-center gap-2 text-[#737373]">
                          <Icon name="route" className="size-4" />
                          <span className="text-xs">Pickup stops</span>
                        </div>

                        <p className="mt-3 text-2xl font-semibold tracking-tight text-[#171717]">
                          {stops.length.toString().padStart(2, "0")}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#EEEEEE] bg-[#F7F7F7] p-4">
                        <div className="flex items-center gap-2 text-[#737373]">
                          <Icon name="bus" className="size-4" />
                          <span className="text-xs">Active buses</span>
                        </div>

                        <p className="mt-3 text-2xl font-semibold tracking-tight text-[#171717]">
                          {buses.length.toString().padStart(2, "0")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PICKUP TIMELINE */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-[#262626]">
                          Pickup timeline
                        </h4>
                        <p className="mt-1 text-xs text-[#737373]">
                          Tap a stop to find other routes serving it.
                        </p>
                      </div>

                      <span className="shrink-0 text-xs text-[#737373]">
                        {stops.length} stops
                      </span>
                    </div>

                    {stops.length > 0 ? (
                      <ol className="mt-5">
                        {visibleStops.map((item, index) => {
                          const isLast =
                            index === visibleStops.length - 1;

                          const isEndpoint =
                            index === 0 || isLast;

                          return (
                            <li
                              key={`${route.id}-${item.stop_order}-${item.stops?.id ?? index}`}
                              className="flex gap-3"
                            >
                              <div className="relative flex w-4 shrink-0 justify-center">
                                {!isLast && (
                                  <span className="absolute bottom-[-4px] top-3 w-px bg-[#E5E5E5]" />
                                )}

                                <span
                                  className={`relative z-10 mt-1 size-2.5 rounded-full ring-4 ring-white ${
                                    isEndpoint
                                      ? "bg-[#171717]"
                                      : "bg-[#D4D4D4]"
                                  }`}
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  searchLocation(item.stops?.name ?? "")
                                }
                                disabled={!item.stops?.name}
                                title="Search routes serving this stop"
                                className="mb-4 flex min-w-0 flex-1 items-start justify-between gap-3 rounded-xl px-1 py-0.5 text-left transition hover:bg-[#F7F7F7] disabled:cursor-default"
                              >
                                <span className="min-w-0">
                                  <span className="block text-sm font-medium text-[#262626]">
                                    {item.stops?.name ?? "Unnamed stop"}
                                  </span>

                                  {item.stops?.address && (
                                    <span className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-[#737373]">
                                      <Icon
                                        name="pin"
                                        className="mt-0.5 size-3.5 shrink-0"
                                      />
                                      <span>{item.stops.address}</span>
                                    </span>
                                  )}

                                  {item.stops?.name && (
                                    <span className="mt-1 block text-[11px] text-[#737373] opacity-0 transition group-hover:opacity-100">
                                      Search this pickup point
                                    </span>
                                  )}
                                </span>

                                {item.scheduled_time && (
                                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#EEEEEE] bg-[#F7F7F7] px-2.5 py-1.5 text-xs font-semibold tabular-nums text-[#525252]">
                                    <Icon
                                      name="clock"
                                      className="size-3.5"
                                    />
                                    {item.scheduled_time.slice(0, 5)}
                                  </span>
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    ) : (
                      <p className="mt-4 rounded-xl bg-[#F7F7F7] p-4 text-sm text-[#737373]">
                        Pickup stops have not been published yet.
                      </p>
                    )}

                    {stops.length > 4 && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(route.id)}
                        aria-expanded={isExpanded}
                        className="mt-1 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E5E5E5] text-sm font-semibold text-[#525252] transition hover:border-[#A3A3A3] hover:bg-[#F7F7F7] hover:text-black"
                      >
                        {isExpanded
                          ? "Show fewer stops"
                          : `Show all ${stops.length} stops`}

                        <Icon
                          name="chevron"
                          className={`size-4 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}

                    {/* BUS SELECTION */}
                    <div className="mt-6 border-t border-[#EEEEEE] pt-5">
                      <h4 className="text-sm font-semibold text-[#262626]">
                        Available buses
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-[#737373]">
                        Select a bus to view its registration details.
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
                                className={`min-w-0 rounded-xl border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#737373] focus-visible:ring-offset-2 ${
                                  active
                                    ? "border-[#171717] bg-[#171717] text-white"
                                    : "border-[#E5E5E5] bg-white text-[#525252] hover:border-[#A3A3A3] hover:bg-[#F7F7F7]"
                                }`}
                              >
                                <span className="flex items-center gap-2 text-xs font-semibold">
                                  <Icon name="bus" className="size-4" />
                                  {bus.bus_number}
                                </span>

                                <span
                                  className={`mt-1 block break-all text-[11px] ${
                                    active
                                      ? "text-[#D4D4D4]"
                                      : "text-[#737373]"
                                  }`}
                                >
                                  {bus.registration_number}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-[#737373]">
                          No active buses listed.
                        </p>
                      )}

                      {chosenBus && (
                        <div className="mt-4 rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#737373]">
                            Selected bus
                          </p>

                          <p className="mt-2 font-semibold text-[#171717]">
                            {chosenBus.bus_number}
                          </p>

                          <p className="mt-1 text-sm text-[#525252]">
                            Registration: {chosenBus.registration_number}
                          </p>

                          <p className="mt-3 border-t border-[#E5E5E5] pt-3 text-xs leading-5 text-[#737373]">
                            Driver details and live location can be shown
                            here once connected to authorized APIs.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* STUDENT PORTAL CTA */}
                    <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-[#F5F5F5] p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#262626]">
                          Your transport, in one place
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#737373]">
                          Sign in for your student-specific information.
                        </p>
                      </div>

                      <Link
                        href="/login"
                        className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 text-xs font-semibold text-white transition hover:bg-[#333333] sm:text-sm"
                      >
                        Sign in
                        <Icon name="arrow" className="size-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* BOTTOM HELP SECTION */}
        {!loading && !error && results.length > 0 && (
          <div className="mt-8 flex flex-col gap-5 rounded-3xl border border-[#E5E5E5] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#F5F5F5] text-[#171717]">
                <Icon name="bus" className="size-5" />
              </div>

              <div>
                <h3 className="font-semibold text-[#171717]">
                  Need help with bus allocation?
                </h3>

                <p className="mt-1 max-w-xl text-sm leading-6 text-[#737373]">
                  Access your student account to view transport
                  information available to you.
                </p>
              </div>
            </div>

            <Link
              href="/login"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#E5E5E5] px-4 text-sm font-semibold text-[#262626] transition hover:border-[#A3A3A3] hover:bg-[#F5F5F5]"
            >
              Open student portal
              <Icon name="arrow" className="size-4" />
            </Link>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="mx-auto mt-16 max-w-7xl border-t border-[#E5E5E5] px-5 pt-6 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-3 text-xs text-[#737373] sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 self-start"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#171717] text-white">
              <Icon name="bus" className="size-4" />
            </span>

            <span className="font-bold tracking-[.12em] text-[#171717]">
              OGI RIDE
            </span>
          </Link>

          <p>College transport, made simpler.</p>

          <p>Pickup times are scheduled and may change.</p>
        </div>
      </footer>
    </main>
  );
}
