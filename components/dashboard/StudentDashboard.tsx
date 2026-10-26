
"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/client-api";
import type { MapBus } from "./BusMap";
import BusFinder from "./BusFinder";
const BusMap = dynamic(
  () => import("./BusMap").then((module) => module.BusMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-80 animate-pulse place-items-center rounded-2xl bg-neutral-100">
        <span className="text-sm text-neutral-500">Loading live map…</span>
      </div>
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
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900/10 disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButton =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-50";

const input =
  "min-h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10 disabled:cursor-not-allowed disabled:bg-neutral-100";

const card =
  "rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm sm:p-6";

const eyebrow =
  "text-xs font-bold uppercase tracking-[0.18em] text-neutral-500";

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
  const [routeSearch, setRouteSearch] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [expandedRoutes, setExpandedRoutes] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const firstYear = profile.academic_year === 1;

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
        name: item.stops?.name ?? "Bus stop",
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

  const unreadCount = notices.filter((item) => !item.read_at).length;

  async function refreshDashboard() {
    setRefreshing(true);
    try {
      await reload();
      if (allocation?.bus_id) await refreshBus(allocation.bus_id);
    } finally {
      setRefreshing(false);
    }
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
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

      if (!response.ok) {
        throw new Error(body.error ?? "Could not submit request.");
      }

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

  async function savePhone(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

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

  async function sendSupport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

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

  const navigation = [
    ["Overview", "#overview"],
    ["Live bus", "#tracking"],
    ["Routes", "#routes"],
    ["Requests", "#requests"],
    ["Profile", "#profile"],
  ];

  return (
    <main className="min-h-screen bg-[#F5F5F4] text-neutral-950">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-neutral-950 text-xs font-black tracking-wider text-white">
              OGI
            </span>
            <span>
              <strong className="block text-sm tracking-tight">OGI RIDE</strong>
              <span className="block text-xs text-neutral-500">
                Student transport
              </span>
            </span>
          </Link>

          <nav
            aria-label="Student navigation"
            className="hidden items-center gap-1 lg:flex"
          >
            {navigation.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => void refreshDashboard()}
              disabled={refreshing}
              aria-label="Refresh dashboard"
              className="grid size-10 place-items-center rounded-xl border border-neutral-200 text-lg transition hover:bg-neutral-100 disabled:opacity-50"
            >
              <span className={refreshing ? "animate-spin" : ""}>↻</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation"
              className="grid size-10 place-items-center rounded-xl border border-neutral-200 text-lg lg:hidden"
            >
              ☰
            </button>

            <button onClick={() => void logout()} className={secondaryButton}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="sticky top-[65px] z-20 grid grid-cols-2 gap-2 border-b border-neutral-200 bg-white p-4 lg:hidden"
        >
          {navigation.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl bg-neutral-50 px-4 py-3 text-sm font-semibold transition hover:bg-neutral-100"
            >
              {label}
            </a>
          ))}
        </nav>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
        <section
          id="overview"
          className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <p className={eyebrow}>
              {firstYear ? "New student onboarding" : "Student transport portal"}
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome, {profile.full_name || "Student"}
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              {profile.department ?? "Department pending"} <span className="px-1">·</span>
              Year {profile.academic_year ?? "not set"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700">
              {requests.length} request{requests.length === 1 ? "" : "s"} submitted
            </span>

            <span
              className={`rounded-full px-3.5 py-2 text-xs font-bold ${
                profile.eligibility_verified
                  ? "bg-neutral-950 text-white"
                  : "border border-neutral-300 bg-neutral-100 text-neutral-700"
              }`}
            >
              {profile.eligibility_verified
                ? "VERIFIED"
                : "VERIFICATION PENDING"}
            </span>
          </div>
        </section>

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
            className="mb-5 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-800"
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
              label: "Transport status",
              value: allocation ? "Allocated" : "Not allocated",
              detail: allocation
                ? allocation.buses?.bus_number ?? "Bus assigned"
                : "Choose a route",
            },
            {
              label: "Available routes",
              value: String(routes.length),
              detail: "College transport routes",
            },
            {
              label: "Saved routes",
              value: String(saved.length),
              detail: "Your shortlist",
            },
            {
              label: "Unread updates",
              value: String(unreadCount),
              detail: "Campus notifications",
            },
          ].map((stat) => (
            <article
              key={stat.label}
              className="group rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md sm:p-5"
            >
              <p className="text-xs font-semibold text-neutral-500">
                {stat.label}
              </p>
              <p className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-neutral-500">{stat.detail}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className={card}>
            <p className={eyebrow}>Your transport</p>
            <h2 className="mt-2 text-xl font-bold">Current allocation</h2>

            {allocation ? (
              <div className="mt-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-xl bg-neutral-950 text-white">
                    <svg viewBox="0 0 24 24" fill="none" className="size-6" stroke="currentColor" strokeWidth="1.7">
                      <path d="M5 16V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10" />
                      <path d="M5 11h14M7 16h10M7 20h2m6 0h2" />
                      <circle cx="7" cy="16" r="1" />
                      <circle cx="17" cy="16" r="1" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-2xl font-bold">
                      {allocation.buses?.bus_number ?? "Bus assigned"}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {allocation.buses?.registration_number ?? "Registration unavailable"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-neutral-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Your route
                  </p>
                  <p className="mt-2 font-semibold">
                    {allocation.routes?.origin} → {allocation.routes?.destination}
                  </p>
                  <div className="mt-4 border-t border-neutral-200 pt-4">
                    <p className="text-xs text-neutral-500">Pickup point</p>
                    <p className="mt-1 font-semibold">
                      {allocation.stops?.name ?? "Stop unavailable"}
                    </p>
                    {allocation.stops?.address && (
                      <p className="mt-1 text-sm text-neutral-500">
                        {allocation.stops.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-600">
                {firstYear
                  ? "Choose your route and pickup stop below. Allocation becomes available after your college eligibility is verified."
                  : "No active allocation is linked to your profile. You can request a new allocation or contact transport support."}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#routes" className={button}>
                {allocation ? "Request a change" : "Explore routes"}
              </a>

              {allocation && (
                <a href="#tracking" className={secondaryButton}>
                  Track bus
                </a>
              )}
            </div>
          </article>

          <article className={card}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={eyebrow}>Stay informed</p>
                <h2 className="mt-2 text-xl font-bold">Latest updates</h2>
              </div>
              <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-bold text-neutral-700">
                {unreadCount} unread
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {notices.length === 0 ? (
                <p className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-500">
                  No notifications yet.
                </p>
              ) : (
                notices.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 rounded-xl border border-neutral-100 bg-neutral-50/70 p-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-neutral-600">
                        {item.body}
                      </p>
                      <p className="mt-2 text-xs text-neutral-400">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>

                    {!item.read_at && (
                      <button
                        onClick={() => void markRead(item.id)}
                        className="shrink-0 text-xs font-bold text-neutral-900 underline underline-offset-4"
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
          <section id="tracking" className={`mt-6 ${card}`}>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className={eyebrow}>Live tracking</p>
                <h2 className="mt-2 text-xl font-bold">Bus location</h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Location updates automatically every 30 seconds.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <TrackingStatus bus={mapBus} />
                <button
                  onClick={() => void refreshBus(allocation.bus_id)}
                  className={secondaryButton}
                >
                  Refresh location
                </button>
              </div>
            </div>

            {hasPosition(mapBus) ? (
              <BusMap bus={mapBus} routePoints={routePoints} />
            ) : (
              <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 text-center">
                <div>
                  <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-neutral-800 shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" className="size-6" stroke="currentColor" strokeWidth="1.7">
                      <path d="M12 21s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12Z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                  </span>
                  <p className="mt-4 font-semibold">
                    {mapBus?.status === "TRIP ENDED"
                      ? "Trip ended"
                      : "Waiting for GPS location"}
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
                    The map will display the bus once an authorized trip sends
                    valid GPS coordinates. An ETA is not available yet.
                  </p>
                </div>
              </div>
            )}

            {mapBus && (
              <p className="mt-3 text-xs text-neutral-500">
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
          className="mt-6 grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <article className={card}>
            <p className={eyebrow}>
              {firstYear ? "Step 1 · Find transport" : "Route discovery"}
            </p>
            <h2 className="mt-2 text-xl font-bold">
              {firstYear ? "Choose your route" : "Available routes"}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Explore destinations, pickup points, and active buses.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <label className="relative block flex-1">
                <span className="sr-only">Search routes and stops</span>
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-neutral-400">
                  ⌕
                </span>
                <input
                  value={routeSearch}
                  onChange={(event) => setRouteSearch(event.target.value)}
                  className={`${input} pl-10`}
                  placeholder="Search route, destination or stop…"
                />
              </label>

              <button
                type="button"
                onClick={() => setSavedOnly((value) => !value)}
                aria-pressed={savedOnly}
                className={`min-h-11 rounded-xl border px-4 text-sm font-semibold transition ${
                  savedOnly
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {savedOnly ? "★ Saved only" : "☆ Saved routes"}
              </button>
            </div>
<BusFinder routes={routes} />
            <div className="mt-5 space-y-3">
              {routes.length === 0 ? (
                <p className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-500">
                  No active routes have been configured by transport
                  administration.
                </p>
              ) : filteredRoutes.length === 0 ? (
                <p className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
                  No routes match your search. Try another destination or stop.
                </p>
              ) : (
                filteredRoutes.map((route) => {
                  const isExpanded = expandedRoutes.includes(route.id);
                  const isSaved = saved.includes(route.id);

                  return (
                    <article
                      key={route.id}
                      className="rounded-xl border border-neutral-200 p-4 transition hover:border-neutral-300 hover:shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold">{route.name}</h3>
                          <p className="mt-1 text-sm text-neutral-500">
                            {route.origin} → {route.destination}
                          </p>
                          <p className="mt-2 text-xs text-neutral-500">
                            {route.route_stops.length} stops ·{" "}
                            {route.buses.filter((bus) => bus.active).length} active buses
                          </p>
                        </div>

                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
                          {route.buses.some((bus) => bus.active)
                            ? "Active route"
                            : "No active bus"}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => void toggleSaved(route)}
                          aria-pressed={isSaved}
                          className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                            isSaved
                              ? "border-neutral-950 bg-neutral-950 text-white"
                              : "border-neutral-200 hover:bg-neutral-50"
                          }`}
                        >
                          {isSaved ? "★ Saved" : "☆ Save route"}
                        </button>

                        <button
                          onClick={() =>
                            setExpandedRoutes((current) =>
                              current.includes(route.id)
                                ? current.filter((id) => id !== route.id)
                                : [...current, route.id],
                            )
                          }
                          aria-expanded={isExpanded}
                          className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold transition hover:bg-neutral-50"
                        >
                          {isExpanded ? "Hide stops −" : "View stops +"}
                        </button>

                        <button
                          onClick={() => {
                            setRouteId(route.id);
                            setStopId("");
                            document
                              .getElementById("requests")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="rounded-lg bg-neutral-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
                        >
                          Choose route
                        </button>
                      </div>

                      {isExpanded ? (
                        <ol className="mt-5 space-y-0 border-l border-neutral-300 pl-4">
                          {route.route_stops
                            .slice()
                            .sort((a, b) => a.stop_order - b.stop_order)
                            .map((stop, index) => (
                              <li
                                key={`${route.id}-${stop.stops?.id ?? index}`}
                                className="relative pb-4 last:pb-0"
                              >
                                <span className="absolute -left-[21px] top-1.5 size-3 rounded-full border-2 border-white bg-neutral-950 ring-1 ring-neutral-300" />
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                  <div>
                                    <p className="text-sm font-semibold">
                                      {stop.stop_order}.{" "}
                                      {stop.stops?.name ?? "Stop details unavailable"}
                                    </p>
                                    {stop.stops?.address && (
                                      <p className="mt-1 text-xs text-neutral-500">
                                        {stop.stops.address}
                                      </p>
                                    )}
                                  </div>
                                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600">
                                    {stop.scheduled_time
                                      ? stop.scheduled_time.slice(0, 5)
                                      : "Time not set"}
                                  </span>
                                </div>
                              </li>
                            ))}
                        </ol>
                      ) : (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {route.route_stops
                            .slice()
                            .sort((a, b) => a.stop_order - b.stop_order)
                            .slice(0, 4)
                            .map((stop, index) => (
                              <span
                                key={`${route.id}-${stop.stops?.id ?? index}`}
                                className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600"
                              >
                                {stop.stops?.name ?? "Bus stop"}
                                {stop.scheduled_time
                                  ? ` · ${stop.scheduled_time.slice(0, 5)}`
                                  : ""}
                              </span>
                            ))}

                          {route.route_stops.length > 4 && (
                            <span className="rounded-full bg-neutral-950 px-3 py-1.5 text-xs font-semibold text-white">
                              +{route.route_stops.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </article>

          <article id="requests" className={card}>
            <p className={eyebrow}>
              {firstYear ? "Step 2 · Request allocation" : "Renewal and changes"}
            </p>
            <h2 className="mt-2 text-xl font-bold">Transport request</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Submit a request for the transport team to review.
            </p>

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
                  {eligibleStops.map((stop, index) => (
                    <option
                      key={stop.stops?.id ?? `${routeId}-${index}`}
                      value={stop.stops?.id ?? ""}
                      disabled={!stop.stops?.id}
                    >
                      {stop.stop_order}. {stop.stops?.name ?? "Stop unavailable"}
                    </option>
                  ))}
                </select>
              </label>

              <button
                className={`${button} w-full`}
                disabled={
                  busy ||
                  !profile.eligibility_verified ||
                  !routeId ||
                  !stopId
                }
              >
                {busy ? "Submitting request…" : "Submit for approval"}
              </button>

              {!profile.eligibility_verified && (
                <p className="rounded-xl bg-neutral-50 p-3 text-xs leading-5 text-neutral-500">
                  Student Services must verify your student record before the
                  database will accept an allocation request.
                </p>
              )}
            </form>
          </article>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          <article className={card}>
            <p className={eyebrow}>Your activity</p>
            <h2 className="mt-2 text-xl font-bold">Request history</h2>

            <div className="mt-4 divide-y divide-neutral-100">
              {requests.length === 0 ? (
                <p className="py-5 text-sm text-neutral-500">
                  No requests submitted yet.
                </p>
              ) : (
                requests.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold capitalize">
                        {item.kind.replaceAll("_", " ")}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-bold uppercase text-neutral-700">
                      {item.status.replaceAll("_", " ")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </article>

          <article id="profile" className={card}>
            <p className={eyebrow}>Account settings</p>
            <h2 className="mt-2 text-xl font-bold">Profile and support</h2>
            <p className="mt-1 text-sm text-neutral-500">
              {profile.student_number ?? "Student ID pending"} ·{" "}
              {profile.department ?? "Department pending"}
            </p>

            <form onSubmit={savePhone} className="mt-5 space-y-3">
              <label
                htmlFor="student-phone"
                className="block text-sm font-semibold"
              >
                Contact phone
              </label>
              <div className="flex gap-2">
                <input
                  id="student-phone"
                  className={input}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter contact phone"
                  type="tel"
                />
                <button className={secondaryButton}>Save</button>
              </div>
            </form>

            <div className="my-5 border-t border-neutral-100" />

            <form onSubmit={sendSupport} className="space-y-3">
              <label
                htmlFor="support-message"
                className="block text-sm font-semibold"
              >
                Contact transport support
              </label>

              <textarea
                id="support-message"
                className={`${input} min-h-28 resize-y py-3`}
                value={supportMessage}
                onChange={(event) => setSupportMessage(event.target.value)}
                maxLength={2000}
                required
                placeholder="Describe the issue you need help with"
              />

              <button className={button}>Submit support request</button>
            </form>
          </article>
        </section>

        <section className={`mt-6 ${card}`}>
          <p className={eyebrow}>Campus information</p>
          <h2 className="mt-2 text-xl font-bold">Announcements</h2>
          <Announcements />
        </section>

        <footer className="mt-8 flex flex-col gap-2 border-t border-neutral-200 py-5 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} OGI RIDE</span>
          <span>College transport · Student portal</span>
        </footer>
      </div>
    </main>
  );
}

function TrackingStatus({ bus }: { bus: MapBus | null }) {
  const status = bus?.status ?? "OFFLINE";

  const styles: Record<string, string> = {
    LIVE: "bg-neutral-950 text-white",
    STALE: "border border-neutral-300 bg-neutral-100 text-neutral-700",
    OFFLINE: "border border-neutral-200 bg-white text-neutral-500",
    "TRIP ENDED": "border border-neutral-200 bg-white text-neutral-500",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-bold ${styles[status] ?? styles.OFFLINE}`}
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
    void apiRequest<{
      announcements: {
        id: string;
        title: string;
        body: string;
        created_at: string;
      }[];
    }>("/api/announcements")
      .then((result) => setItems(result.announcements))
      .catch((cause: unknown) =>
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not load announcements.",
        ),
      );
  }, []);

  if (error) {
    return (
      <p role="alert" className="mt-3 text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="mt-3 text-sm text-neutral-500">
        No current announcements.
      </p>
    );
  }

  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition hover:border-neutral-300 hover:bg-white hover:shadow-sm"
        >
          <h3 className="font-semibold">{item.title}</h3>
          <p className="mt-1 text-sm leading-6 text-neutral-600">{item.body}</p>
          <p className="mt-3 text-xs text-neutral-400">
            {new Date(item.created_at).toLocaleDateString()}
          </p>
        </article>
      ))}
    </div>
  );
}
