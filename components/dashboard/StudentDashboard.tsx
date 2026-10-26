"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/client-api";
import type { MapBus } from "./BusMap";

const BusMap = dynamic(
  () => import("./BusMap").then((module) => module.BusMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 animate-pulse rounded-2xl bg-slate-100" />
    ),
  },
);

type Profile = {
  id: string;
  full_name: string;
  student_number: string | null;
  academic_year: number | null;
  department: string | null;
  phone: string | null;
  eligibility_verified: boolean;
};

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
      latitude: number | null;
      longitude: number | null;
    } | null;
  }[];
  buses: {
    id: string;
    bus_number: string;
    registration_number: string;
    active: boolean;
  }[];
};

type Allocation = {
  id: string;
  bus_id: string;
  route_id: string;
  stop_id: string;
  buses: { bus_number: string; registration_number: string } | null;
  routes: { name: string; origin: string; destination: string } | null;
  stops: { name: string; address: string | null } | null;
};

type Notice = {
  id: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
};
type Request = {
  id: string;
  kind: string;
  status: string;
  created_at: string;
  note: string | null;
};

const button =
  "inline-flex min-h-10 items-center justify-center rounded-xl bg-[#3157D5] px-4 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50";
const input =
  "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10";

export default function StudentDashboard({
  profile: initialProfile,
}: {
  profile: Profile;
}) {
  const router = useRouter();
  const profile = initialProfile;
  const [routes, setRoutes] = useState<Route[]>([]);
  const [allocation, setAllocation] = useState<Allocation | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [mapBus, setMapBus] = useState<MapBus | null>(null);
  const [routeId, setRouteId] = useState("");
  const [stopId, setStopId] = useState("");
  const [requestKind, setRequestKind] = useState<
    "new_allocation" | "renewal" | "route_change"
  >("new_allocation");
  const [phone, setPhone] = useState(initialProfile.phone ?? "");
  const [supportMessage, setSupportMessage] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [routeSearch, setRouteSearch] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [expandedRoutes, setExpandedRoutes] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const reload = useCallback(async () => {
    try {
      const result = await apiRequest<{
        routes: Route[];
        allocation: Allocation | null;
        requests: Request[];
        notices: Notice[];
        saved: string[];
      }>("/api/student/data");
      setRoutes(result.routes);
      setAllocation(result.allocation);
      setRequests(result.requests);
      setNotices(result.notices);
      setSaved(result.saved);
      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load transport data.",
      );
    }
  }, []);

  const refreshBus = useCallback(async (busId: string) => {
    try {
      const result = await apiRequest<{ mapBus: MapBus | null }>(
        `/api/student/tracking?busId=${encodeURIComponent(busId)}`,
      );
      setMapBus(result.mapBus);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load bus location.",
      );
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void reload(), 0);
    return () => window.clearTimeout(timer);
  }, [reload]);

  useEffect(() => {
    const initial = window.setTimeout(() => {
      if (allocation) void refreshBus(allocation.bus_id);
      else setMapBus(null);
    }, 0);
    const timer = allocation
      ? window.setInterval(() => void refreshBus(allocation.bus_id), 30_000)
      : undefined;
    return () => {
      if (timer) window.clearInterval(timer);
      window.clearTimeout(initial);
    };
  }, [allocation, refreshBus]);

  const routePoints = useMemo(() => {
    const route = routes.find((item) => item.id === allocation?.route_id);
    return (route?.route_stops ?? [])
      .filter(
        (item) =>
          typeof item.stops?.latitude === "number" &&
          typeof item.stops.longitude === "number",
      )
      .sort((a, b) => a.stop_order - b.stop_order)
      .map((item) => ({
        name: item.stops?.name,
        latitude: item.stops!.latitude!,
        longitude: item.stops!.longitude!,
      }));
  }, [allocation?.route_id, routes]);

  const filteredRoutes = useMemo(() => {
    const query = routeSearch.trim().toLowerCase();
    return routes.filter((route) => {
      const matchesQuery =
        !query ||
        [
          route.name,
          route.origin,
          route.destination,
          ...route.route_stops.map((stop) => stop.stops?.name ?? ""),
        ].some((value) => value.toLowerCase().includes(query));
      return matchesQuery && (!savedOnly || saved.includes(route.id));
    });
  }, [routes, routeSearch, savedOnly, saved]);

  const selectedRoute = routes.find((item) => item.id === routeId);
  const eligibleStops =
    selectedRoute?.route_stops
      .slice()
      .sort((a, b) => a.stop_order - b.stop_order) ?? [];
  const firstYear = profile.academic_year === 1;

  async function refreshDashboard() {
    setRefreshing(true);
    try {
      await reload();
      if (allocation?.bus_id) await refreshBus(allocation.bus_id);
    } finally {
      setRefreshing(false);
    }
  }

  async function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/allocation-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routeId, stopId, kind: requestKind }),
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error ?? "Could not submit request.");
      setNotice("Your transport request has been submitted for admin review.");
      await reload();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not submit the request.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function toggleSaved(route: Route) {
    setError("");
    const isSaved = saved.includes(route.id);
    try {
      await apiRequest("/api/student/data", {
        method: "POST",
        body: JSON.stringify({ action: "toggle-saved", routeId: route.id }),
      });
      setSaved((current) =>
        isSaved
          ? current.filter((id) => id !== route.id)
          : [...current, route.id],
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not update saved routes.",
      );
    }
  }

  async function savePhone(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      await apiRequest("/api/student/data", {
        method: "POST",
        body: JSON.stringify({ action: "save-phone", phone }),
      });
      setNotice("Profile contact details saved.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not save profile details.",
      );
    }
  }

  async function sendSupport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      await apiRequest("/api/student/data", {
        method: "POST",
        body: JSON.stringify({
          action: "support-request",
          message: supportMessage,
        }),
      });
      setSupportMessage("");
      setNotice("Support request submitted.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not submit support request.",
      );
    }
  }

  async function markRead(id: string) {
    try {
      const readAt = new Date().toISOString();
      await apiRequest("/api/student/data", {
        method: "POST",
        body: JSON.stringify({ action: "mark-notification-read", id }),
      });
      setNotices((items) =>
        items.map((item) =>
          item.id === id ? { ...item, read_at: readAt } : item,
        ),
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not update notification.",
      );
    }
  }

  async function logout() {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
      router.replace("/");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign out.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F6F8FC] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#3157D5] text-xs font-black text-white">
              OGI
            </span>
            <span>
              <strong className="block text-sm">OGI RIDE</strong>
              <span className="text-xs text-slate-500">Student transport</span>
            </span>
          </Link>
          <nav
            aria-label="Student navigation"
            className="hidden items-center gap-5 text-sm font-medium md:flex"
          >
            <a
              href="#overview"
              className="rounded-lg px-2 py-2 transition hover:bg-blue-50 hover:text-blue-700"
            >
              Overview
            </a>
            <a
              href="#tracking"
              className="rounded-lg px-2 py-2 transition hover:bg-blue-50 hover:text-blue-700"
            >
              Live bus
            </a>
            <a
              href="#routes"
              className="rounded-lg px-2 py-2 transition hover:bg-blue-50 hover:text-blue-700"
            >
              Routes
            </a>
            <a
              href="#requests"
              className="rounded-lg px-2 py-2 transition hover:bg-blue-50 hover:text-blue-700"
            >
              Requests
            </a>
            <a
              href="#profile"
              className="rounded-lg px-2 py-2 transition hover:bg-blue-50 hover:text-blue-700"
            >
              Profile
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => void refreshDashboard()}
              disabled={refreshing}
              aria-label="Refresh dashboard"
              className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <span className={refreshing ? "animate-spin" : ""}>↻</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation"
              className="grid size-10 place-items-center rounded-xl border border-slate-200 text-lg md:hidden"
            >
              ☰
            </button>
            <button
              onClick={() => void logout()}
              className="min-h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold transition hover:bg-slate-50 sm:px-4"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="sticky top-[65px] z-20 grid grid-cols-2 gap-2 border-b border-slate-200 bg-white p-4 md:hidden"
        >
          {[
            ["Overview", "#overview"],
            ["Live bus", "#tracking"],
            ["Routes", "#routes"],
            ["Requests", "#requests"],
            ["Profile", "#profile"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold transition hover:bg-blue-50 hover:text-blue-700"
            >
              {label}
            </a>
          ))}
        </nav>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-blue-700">
              {firstYear
                ? "New student onboarding"
                : "Student transport portal"}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Hi, {profile.full_name || "student"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {profile.department ?? "Department pending"} · Year{" "}
              {profile.academic_year ?? "not set"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
              {requests.length} request{requests.length === 1 ? "" : "s"}{" "}
              submitted
            </span>
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${profile.eligibility_verified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
            >
              {profile.eligibility_verified
                ? "ELIGIBILITY VERIFIED"
                : "VERIFICATION PENDING"}
            </span>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </p>
        )}
        {notice && (
          <p
            role="status"
            className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            {notice}
          </p>
        )}

        <section
          aria-label="Transport summary"
          className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          {[
            {
              label: "Transport",
              value: allocation ? "Allocated" : "Not allocated",
              detail: allocation
                ? (allocation.buses?.bus_number ?? "Bus assigned")
                : "Choose a route",
              tone: allocation ? "text-emerald-700" : "text-amber-700",
            },
            {
              label: "Available routes",
              value: String(routes.length),
              detail: "College transport routes",
              tone: "text-blue-700",
            },
            {
              label: "Saved routes",
              value: String(saved.length),
              detail: "Your shortlist",
              tone: "text-violet-700",
            },
            {
              label: "Unread updates",
              value: String(notices.filter((item) => !item.read_at).length),
              detail: "Campus notifications",
              tone: "text-sky-700",
            },
          ].map((stat) => (
            <article
              key={stat.label}
              className="group rounded-2xl border border-slate-200 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-5"
            >
              <p className="text-xs font-semibold text-slate-500">
                {stat.label}
              </p>
              <p
                className={`mt-2 text-xl font-bold tracking-tight sm:text-2xl ${stat.tone}`}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
            </article>
          ))}
        </section>

        <section id="overview" className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-slate-500">
              Your transport status
            </p>
            {allocation ? (
              <div className="mt-4">
                <p className="text-2xl font-bold">
                  {allocation.buses?.bus_number ?? "Bus assigned"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {allocation.routes?.origin} → {allocation.routes?.destination}
                </p>
                <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm">
                  Pickup:{" "}
                  <strong>
                    {allocation.stops?.name ?? "Stop unavailable"}
                  </strong>
                  {allocation.stops?.address
                    ? ` · ${allocation.stops.address}`
                    : ""}
                </p>
              </div>
            ) : (
              <p className="mt-4 rounded-xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                {firstYear
                  ? "Choose your route and pickup stop below. Allocation becomes available after college eligibility is verified."
                  : "No active allocation is linked to your profile. Request a route change or contact transport support."}
              </p>
            )}
            <div className="mt-5 flex gap-3">
              <a href="#routes" className={button}>
                {allocation ? "Request a change" : "Find a route"}
              </a>
              {allocation && (
                <a
                  href="#tracking"
                  className="inline-flex min-h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold hover:bg-slate-50"
                >
                  Track bus
                </a>
              )}
            </div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Notifications
                </p>
                <h2 className="mt-1 text-xl font-bold">Latest updates</h2>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
                {notices.filter((item) => !item.read_at).length} unread
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {notices.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  No notifications yet.
                </p>
              ) : (
                notices.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{item.body}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!item.read_at && (
                      <button
                        onClick={() => void markRead(item.id)}
                        className="shrink-0 text-xs font-semibold text-blue-700 hover:underline"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </article>
        </section>

        {allocation && (
          <section
            id="tracking"
            className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
          >
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-700">
                  Bus tracking
                </p>
                <h2 className="mt-1 text-xl font-bold">Live location</h2>
              </div>
              <div className="flex items-center gap-2">
                <TrackingStatus bus={mapBus} />
                <button
                  onClick={() =>
                    allocation && void refreshBus(allocation.bus_id)
                  }
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  Refresh location
                </button>
              </div>
            </div>
            {hasPosition(mapBus) ? (
              <BusMap bus={mapBus} routePoints={routePoints} />
            ) : (
              <div className="grid min-h-48 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
                <div>
                  <p className="font-semibold">
                    {mapBus?.status === "TRIP ENDED"
                      ? "Trip ended"
                      : "No GPS position received"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    The map will show actual device coordinates when an
                    authorized trip reports them. No ETA is available.
                  </p>
                </div>
              </div>
            )}
            {mapBus && (
              <p className="mt-3 text-xs text-slate-500">
                Last device update:{" "}
                {mapBus.status === "OFFLINE"
                  ? "No position received for this trip"
                  : new Date(mapBus.recordedAt).toLocaleString()}
              </p>
            )}
          </section>
        )}

        <section
          id="routes"
          className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_.9fr]"
        >
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-700">
                  {firstYear ? "Step 1 · Find transport" : "Route discovery"}
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  {firstYear ? "Choose a route and pickup" : "Available routes"}
                </h2>
              </div>
              {!profile.eligibility_verified && (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                  Requesting unlocks after verification
                </span>
              )}
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <label className="relative block flex-1">
                <span className="sr-only">Search routes and stops</span>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  ⌕
                </span>
                <input
                  value={routeSearch}
                  onChange={(event) => setRouteSearch(event.target.value)}
                  className={`${input} pl-9`}
                  placeholder="Search route, destination or pickup stop…"
                />
              </label>
              <button
                type="button"
                onClick={() => setSavedOnly((value) => !value)}
                aria-pressed={savedOnly}
                className={`min-h-11 rounded-xl border px-4 text-sm font-semibold transition ${savedOnly ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                {savedOnly ? "★ Saved only" : "☆ Saved routes"}
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {routes.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  No active routes have been configured by transport
                  administration.
                </p>
              ) : filteredRoutes.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                  No routes match your search. Try another destination or pickup
                  stop.
                </p>
              ) : (
                filteredRoutes.map((route) => (
                  <div
                    key={route.id}
                    className="rounded-xl border border-slate-200 p-4 transition duration-200 hover:border-blue-200 hover:shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{route.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {route.origin} → {route.destination}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          {route.route_stops.length} stops ·{" "}
                          {route.buses.filter((bus) => bus.active).length}{" "}
                          active buses
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => void toggleSaved(route)}
                          aria-pressed={saved.includes(route.id)}
                          className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${saved.includes(route.id) ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 hover:bg-slate-50"}`}
                        >
                          {saved.includes(route.id)
                            ? "★ Saved"
                            : "☆ Save route"}
                        </button>
                        <button
                          onClick={() =>
                            setExpandedRoutes((current) =>
                              current.includes(route.id)
                                ? current.filter((id) => id !== route.id)
                                : [...current, route.id],
                            )
                          }
                          aria-expanded={expandedRoutes.includes(route.id)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold transition hover:bg-slate-50"
                        >
                          {expandedRoutes.includes(route.id)
                            ? "Hide stops −"
                            : "View stops +"}
                        </button>
                        <button
                          onClick={() => {
                            setRouteId(route.id);
                            setStopId("");
                            document
                              .getElementById("requests")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="rounded-lg bg-[#3157D5] px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
                        >
                          Choose route
                        </button>
                      </div>
                    </div>
                    {expandedRoutes.includes(route.id) ? (
                      <ol className="mt-4 space-y-0 border-l-2 border-blue-100 pl-4">
                        {route.route_stops
                          .slice()
                          .sort((a, b) => a.stop_order - b.stop_order)
                          .map((stop, index) => (
                            <li
                              key={`${route.id}-${stop.stops?.id ?? index}`}
                              className="relative pb-4 last:pb-0"
                            >
                              <span className="absolute -left-[21px] top-1.5 size-3 rounded-full border-2 border-white bg-blue-600 ring-2 ring-blue-100" />
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold">
                                    {stop.stop_order}.{" "}
                                    {stop.stops?.name ??
                                      "Stop details unavailable"}
                                  </p>
                                  {stop.stops?.address && (
                                    <p className="mt-0.5 text-xs text-slate-500">
                                      {stop.stops.address}
                                    </p>
                                  )}
                                </div>
                                <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                  {stop.scheduled_time
                                    ? stop.scheduled_time.slice(0, 5)
                                    : "Time not set"}
                                </span>
                              </div>
                            </li>
                          ))}
                      </ol>
                    ) : (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {route.route_stops
                          .slice()
                          .sort((a, b) => a.stop_order - b.stop_order)
                          .slice(0, 4)
                          .map((stop, index) => (
                            <span
                              key={`${route.id}-${stop.stops?.id ?? index}`}
                              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600"
                            >
                              {stop.stops?.name}
                              {stop.scheduled_time
                                ? ` · ${stop.scheduled_time.slice(0, 5)}`
                                : ""}
                            </span>
                          ))}
                        {route.route_stops.length > 4 && (
                          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                            +{route.route_stops.length - 4} more stops
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-700">
              {firstYear
                ? "Step 2 · Request allocation"
                : "Renewal and route changes"}
            </p>
            <h2 className="mt-1 text-xl font-bold">Transport request</h2>
            <form onSubmit={submitRequest} className="mt-5 space-y-4">
              {!firstYear && (
                <label className="block text-sm font-semibold">
                  Request type
                  <select
                    className={`${input} mt-2`}
                    value={requestKind}
                    onChange={(event) =>
                      setRequestKind(event.target.value as typeof requestKind)
                    }
                  >
                    <option value="renewal">Renew current allocation</option>
                    <option value="route_change">Change route or pickup</option>
                    <option value="new_allocation">New allocation</option>
                  </select>
                </label>
              )}
              <label className="block text-sm font-semibold">
                Route
                <select
                  className={`${input} mt-2`}
                  value={routeId}
                  onChange={(event) => {
                    setRouteId(event.target.value);
                    setStopId("");
                  }}
                  required
                >
                  <option value="">Select a route</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.name} · {route.origin} to {route.destination}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold">
                Pickup stop
                <select
                  className={`${input} mt-2`}
                  value={stopId}
                  onChange={(event) => setStopId(event.target.value)}
                  required
                  disabled={!routeId}
                >
                  <option value="">Select a stop</option>
                  {eligibleStops.map((stop) => (
                    <option key={stop.stops?.id} value={stop.stops?.id}>
                      {stop.stop_order}. {stop.stops?.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className={button}
                disabled={
                  busy || !profile.eligibility_verified || !routeId || !stopId
                }
              >
                {busy ? "Submitting…" : "Submit for approval"}
              </button>
              {!profile.eligibility_verified && (
                <p className="text-xs leading-5 text-slate-500">
                  Student Services must verify your student record before the
                  database will accept an allocation request.
                </p>
              )}
            </form>
          </article>
        </section>

        <section id="requests" className="mt-6 grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold">Request history</h2>
            <div className="mt-4 divide-y divide-slate-100">
              {requests.length === 0 ? (
                <p className="py-4 text-sm text-slate-500">
                  No requests submitted.
                </p>
              ) : (
                requests.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {item.kind.replaceAll("_", " ")}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase">
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </article>
          <article
            id="profile"
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-xl font-bold">Profile and support</h2>
            <p className="mt-1 text-sm text-slate-500">
              {profile.student_number ?? "Student ID pending"} ·{" "}
              {profile.department ?? "Department pending"}
            </p>
            <form onSubmit={savePhone} className="mt-4 flex gap-3">
              <label className="sr-only" htmlFor="student-phone">
                Contact phone
              </label>
              <input
                id="student-phone"
                className={input}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Contact phone"
                type="tel"
              />
              <button className="rounded-xl border border-slate-200 px-4 text-sm font-semibold hover:bg-slate-50">
                Save
              </button>
            </form>
            <form onSubmit={sendSupport} className="mt-5 space-y-3">
              <label
                htmlFor="support-message"
                className="block text-sm font-semibold"
              >
                Contact transport support
              </label>
              <textarea
                id="support-message"
                className={`${input} min-h-24 py-3`}
                value={supportMessage}
                onChange={(event) => setSupportMessage(event.target.value)}
                maxLength={2000}
                required
                placeholder="Describe the issue you need help with"
              />
              <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50">
                Submit support request
              </button>
            </form>
          </article>
        </section>
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold">Campus announcements</h2>
          <Announcements />
        </section>
      </div>
    </main>
  );
}

function TrackingStatus({ bus }: { bus: MapBus | null }) {
  const status = bus?.status ?? "OFFLINE";
  const styles: Record<string, string> = {
    LIVE: "bg-emerald-100 text-emerald-800",
    STALE: "bg-amber-100 text-amber-800",
    OFFLINE: "bg-slate-100 text-slate-600",
    "TRIP ENDED": "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function hasPosition(
  bus: MapBus | null,
): bus is MapBus & { latitude: number; longitude: number } {
  return Boolean(
    bus &&
    (bus.status === "LIVE" || bus.status === "STALE") &&
    typeof bus.latitude === "number" &&
    typeof bus.longitude === "number",
  );
}

function Announcements() {
  const [items, setItems] = useState<
    { id: string; title: string; body: string; created_at: string }[]
  >([]);
  const [error, setError] = useState("");
  useEffect(() => {
    void apiRequest<{ announcements: typeof items }>("/api/announcements")
      .then((result) => setItems(result.announcements))
      .catch((cause: unknown) =>
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not load announcements.",
        ),
      );
  }, []);
  if (error)
    return (
      <p role="alert" className="mt-3 text-sm text-red-700">
        {error}
      </p>
    );
  if (items.length === 0)
    return (
      <p className="mt-3 text-sm text-slate-500">No current announcements.</p>
    );
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition duration-200 hover:border-blue-200 hover:bg-white hover:shadow-sm"
        >
          <h3 className="font-semibold">{item.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{item.body}</p>
          <p className="mt-2 text-xs text-slate-400">
            {new Date(item.created_at).toLocaleDateString()}
          </p>
        </article>
      ))}
    </div>
  );
}
