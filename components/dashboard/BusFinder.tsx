
"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { apiRequest } from "@/lib/client-api";
import type { MapBus } from "./BusMap";

type Stop = {
  stop_order: number;
  scheduled_time: string | null;
  stops: {
    id: string;
    name: string;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
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
  route_stops: Stop[];
  buses: Bus[];
};

type DriverInfo = {
  name: string | null;
  phone: string | null;
};

type BusInfoResponse = {
  driver: DriverInfo | null;
  departure_time: string | null;
  bus_name: string | null;
};

const BusMap = dynamic(
  () => import("./BusMap").then((module) => module.BusMap),
  { ssr: false },
);

const inputClass =
  "min-h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10";

const buttonClass =
  "inline-flex min-h-12 items-center justify-center rounded-xl bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50";

export default function BusFinder({ routes }: { routes: Route[] }) {
  const [query, setQuery] = useState("");
  const [selectedBus, setSelectedBus] = useState<{
    bus: Bus;
    route: Route;
  } | null>(null);

  const [driver, setDriver] = useState<DriverInfo | null>(null);
  const [busName, setBusName] = useState<string | null>(null);
  const [departureTime, setDepartureTime] = useState<string | null>(null);
  const [mapBus, setMapBus] = useState<MapBus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return [];

    return routes.flatMap((route) => {
      const matchingStops = route.route_stops.filter((item) =>
        [
          item.stops?.name ?? "",
          item.stops?.address ?? "",
        ].some((text) => text.toLowerCase().includes(value)),
      );

      const routeMatches = [
        route.name,
        route.origin,
        route.destination,
      ].some((text) => text.toLowerCase().includes(value));

      const matchingBuses = route.buses.filter((bus) =>
        [
          bus.bus_number,
          bus.registration_number,
        ].some((text) => text.toLowerCase().includes(value)),
      );

      if (matchingBuses.length > 0) {
        return matchingBuses.map((bus) => ({ bus, route }));
      }

      if (routeMatches || matchingStops.length > 0) {
        return route.buses.map((bus) => ({ bus, route }));
      }

      return [];
    });
  }, [routes, query]);

  async function openBus(bus: Bus, route: Route) {
    setLoading(true);
    setError("");
    setSelectedBus({ bus, route });
    setDriver(null);
    setBusName(null);
    setDepartureTime(null);
    setMapBus(null);

    try {
      const [detailsResult, trackingResult] = await Promise.allSettled([
        apiRequest<BusInfoResponse>(
          `/api/student/bus-info?busId=${encodeURIComponent(bus.id)}`,
        ),
        apiRequest<{ mapBus: MapBus | null }>(
          `/api/student/tracking?busId=${encodeURIComponent(bus.id)}`,
        ),
      ]);

      if (detailsResult.status === "fulfilled") {
        setDriver(detailsResult.value.driver);
        setBusName(detailsResult.value.bus_name);
        setDepartureTime(detailsResult.value.departure_time);
      } else {
        setError(
          "Driver details are currently unavailable. Please check the bus-info API.",
        );
      }

      if (trackingResult.status === "fulfilled") {
        setMapBus(trackingResult.value.mapBus);
      } else {
        setError((current) =>
          current
            ? `${current} Live location could not be loaded.`
            : "Live location could not be loaded.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  const routePoints = (selectedBus?.route.route_stops ?? [])
    .filter(
      (stop) =>
        typeof stop.stops?.latitude === "number" &&
        typeof stop.stops.longitude === "number",
    )
    .sort((a, b) => a.stop_order - b.stop_order)
    .map((stop) => ({
      name: stop.stops?.name ?? "Bus stop",
      latitude: stop.stops!.latitude!,
      longitude: stop.stops!.longitude!,
    }));

  const hasLivePosition =
    mapBus &&
    (mapBus.status === "LIVE" || mapBus.status === "STALE") &&
    typeof mapBus.latitude === "number" &&
    typeof mapBus.longitude === "number";

  return (
    <section
      id="bus-finder"
      className="mt-6 scroll-mt-24 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
          OGI RIDE · Bus intelligence
        </p>

        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Find your college bus
        </h2>

        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Search using a bus number, registration number, destination or pickup
          location.
        </p>
      </div>

      <form
        className="mt-6 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="flex-1">
          <span className="sr-only">Search buses and locations</span>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedBus(null);
              setError("");
            }}
            className={inputClass}
            placeholder="e.g. OGI-01, Bhopal, Sehore..."
          />
        </label>

        <button
          type="button"
          onClick={() => {
            setSelectedBus(null);
            setError("");
          }}
          className={buttonClass}
        >
          Search buses
        </button>
      </form>

      {query.trim() && (
        <div className="mt-5">
          <p className="mb-3 text-xs font-semibold text-neutral-500">
            {results.length} matching bus{results.length === 1 ? "" : "es"}
          </p>

          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-center">
              <p className="font-semibold">No matching buses found</p>
              <p className="mt-1 text-sm text-neutral-500">
                Try a bus number, route name, destination or pickup stop.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {results.map(({ bus, route }) => (
                <article
                  key={`${route.id}-${bus.id}`}
                  className="rounded-xl border border-neutral-200 p-4 transition hover:border-neutral-400"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold">{bus.bus_number}</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {bus.registration_number}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        bus.active
                          ? "bg-neutral-950 text-white"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {bus.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="mt-4 border-t border-neutral-100 pt-3">
                    <p className="text-sm font-semibold">{route.name}</p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {route.origin} → {route.destination}
                    </p>
                    <p className="mt-2 text-xs text-neutral-500">
                      {route.route_stops.length} scheduled stops
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!bus.active || loading}
                    onClick={() => void openBus(bus, route)}
                    className={`${buttonClass} mt-4 w-full`}
                  >
                    View bus details
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <p
          role="status"
          className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700"
        >
          {error}
        </p>
      )}

      {selectedBus && (
        <div className="mt-7 border-t border-neutral-200 pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Selected bus
              </p>
              <h3 className="mt-2 text-2xl font-bold">
                {selectedBus.bus.bus_number}
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                {busName ?? selectedBus.route.name}
              </p>
            </div>

            <span className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold">
              {loading ? "Loading details…" : mapBus?.status ?? "Status unavailable"}
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              label="Driver"
              value={driver?.name ?? "Not available"}
            />
            <InfoCard
              label="Driver contact"
              value={driver?.phone ?? "Not available"}
            />
            <InfoCard
              label="Departure"
              value={departureTime ?? "Not configured"}
            />
            <InfoCard
              label="Registration"
              value={selectedBus.bus.registration_number}
            />
          </div>

          <div className="mt-5 rounded-xl bg-neutral-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Route
            </p>
            <p className="mt-2 font-semibold">
              {selectedBus.route.origin} → {selectedBus.route.destination}
            </p>

            <div className="mt-4 space-y-3">
              {selectedBus.route.route_stops
                .slice()
                .sort((a, b) => a.stop_order - b.stop_order)
                .map((stop, index) => (
                  <div
                    key={`${stop.stops?.id ?? index}-${stop.stop_order}`}
                    className="flex items-start justify-between gap-4 border-l-2 border-neutral-300 pl-4"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {stop.stop_order}. {stop.stops?.name ?? "Bus stop"}
                      </p>
                      {stop.stops?.address && (
                        <p className="mt-1 text-xs text-neutral-500">
                          {stop.stops.address}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-neutral-600">
                      {stop.scheduled_time
                        ? stop.scheduled_time.slice(0, 5)
                        : "Time unavailable"}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h4 className="font-bold">Live location</h4>
              <button
                type="button"
                disabled={loading}
                onClick={() => void openBus(selectedBus.bus, selectedBus.route)}
                className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold hover:bg-neutral-50 disabled:opacity-50"
              >
                Refresh tracking
              </button>
            </div>

            {hasLivePosition ? (
              <BusMap bus={mapBus} routePoints={routePoints} />
            ) : (
              <div className="grid min-h-48 place-items-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
                <div>
                  <p className="font-semibold">
                    {mapBus?.status === "TRIP ENDED"
                      ? "This trip has ended"
                      : "Live GPS location unavailable"}
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
                    The bus location will appear when the connected tracking
                    system provides valid GPS coordinates.
                  </p>
                </div>
              </div>
            )}

            {mapBus?.recordedAt && (
              <p className="mt-3 text-xs text-neutral-500">
                Last GPS update:{" "}
                {mapBus.status === "OFFLINE"
                  ? "No current position"
                  : new Date(mapBus.recordedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <p className="text-xs font-semibold text-neutral-500">{label}</p>
      <p className="mt-2 break-words text-sm font-bold">{value}</p>
    </div>
  );
}
