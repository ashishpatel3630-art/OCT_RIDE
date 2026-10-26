
"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/client-api";
import type { MapBus } from "./BusMap";

const FleetMap = dynamic(
  () => import("./BusMap").then((m) => m.FleetMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[30rem] animate-pulse rounded-2xl bg-neutral-100" />
    ),
  },
);

type Section =
  | "overview"
  | "students"
  | "fleet"
  | "requests"
  | "routes"
  | "announcements"
  | "reports"
  | "settings";

type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "admin";
  student_number: string | null;
  academic_year: number | null;
  department: string | null;
  eligibility_verified: boolean;
};

type Route = {
  id: string;
  name: string;
  origin: string;
  destination: string;
  active: boolean;
};

type Stop = {
  id: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
};

type Bus = {
  id: string;
  bus_number: string;
  registration_number: string;
  route_id: string | null;
  capacity: number;
  active: boolean;
  routes: { name: string } | null;
};

type Request = {
  id: string;
  student_id: string;
  kind: string;
  route_id: string;
  stop_id: string;
  status: string;
  note: string | null;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
    student_number: string | null;
    academic_year: number | null;
  } | null;
  routes: { name: string } | null;
  stops: { name: string } | null;
};

type YearConfig = {
  year: number;
  label: string;
  enrollment_open: boolean;
};

type Trip = {
  id: string;
  bus_id: string;
  status: "active" | "ended";
  started_at: string;
  ended_at: string | null;
};

type TrackingDevice = {
  id: string;
  name: string;
  bus_id: string;
  active: boolean;
  last_seen_at: string | null;
  buses: { bus_number: string } | null;
};

type AuditEntry = {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
};

type Announcement = {
  id: string;
  title: string;
  body: string;
  published: boolean;
  created_at: string;
};

type Ticket = {
  id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    student_number: string | null;
  } | null;
};

const button =
  "inline-flex min-h-10 items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50";

const secondary =
  "inline-flex min-h-10 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100";

const danger =
  "inline-flex min-h-10 items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:border-black hover:bg-neutral-100";

const field =
  "min-h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black focus:ring-4 focus:ring-black/5";

const panel =
  "rounded-2xl border border-neutral-200 bg-white shadow-sm shadow-black/[0.02]";

const tabs: { id: Section; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "◫" },
  { id: "students", label: "Students", icon: "♙" },
  { id: "fleet", label: "Fleet & trips", icon: "▣" },
  { id: "requests", label: "Requests", icon: "↗" },
  { id: "routes", label: "Routes & buses", icon: "⌁" },
  { id: "announcements", label: "Announcements", icon: "◉" },
  { id: "reports", label: "Reports", icon: "▤" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

export default function AdminDashboard({
  adminName,
}: {
  adminName: string;
}) {
  const router = useRouter();

  const [section, setSection] = useState<Section>("overview");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [years, setYears] = useState<YearConfig[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [devices, setDevices] = useState<TrackingDevice[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [fleet, setFleet] = useState<MapBus[]>([]);
  const [routeFilter, setRouteFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBus, setSelectedBus] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deviceToken, setDeviceToken] = useState("");

  const reload = useCallback(async () => {
    try {
      const result = await apiRequest<{
        profiles: Profile[];
        routes: Route[];
        stops: Stop[];
        buses: Bus[];
        requests: Request[];
        years: YearConfig[];
        announcements: Announcement[];
        tickets: Ticket[];
        trips: Trip[];
        devices: TrackingDevice[];
        locations: {
          bus_id: string;
          trip_id: string;
          latitude: number;
          longitude: number;
          recorded_at: string;
        }[];
        audit: AuditEntry[];
      }>("/api/admin/data");

      setProfiles(result.profiles);
      setRoutes(result.routes);
      setStops(result.stops);
      setBuses(result.buses);
      setRequests(result.requests);
      setYears(result.years);
      setAnnouncements(result.announcements);
      setTickets(result.tickets);
      setTrips(result.trips);
      setDevices(result.devices);
      setAudit(result.audit);

      const latestByBus = new Map<
        string,
        (typeof result.locations)[number]
      >();

      for (const location of result.locations) {
        const previous = latestByBus.get(location.bus_id);

        if (
          !previous ||
          Date.parse(location.recorded_at) >
            Date.parse(previous.recorded_at)
        ) {
          latestByBus.set(location.bus_id, location);
        }
      }

      const currentTrip = new Map<string, Trip>();

      for (const trip of result.trips) {
        if (
          trip.status === "active" &&
          !currentTrip.has(trip.bus_id)
        ) {
          currentTrip.set(trip.bus_id, trip);
        }
      }

      const now = Date.now();

      setFleet(
        result.buses.map((bus) => {
          const trip = currentTrip.get(bus.id);
          const candidate = latestByBus.get(bus.id);
          const location =
            candidate && candidate.trip_id === trip?.id
              ? candidate
              : undefined;

          const age = location
            ? now - Date.parse(location.recorded_at)
            : Infinity;

          const status: MapBus["status"] =
            !trip
              ? "OFFLINE"
              : !location
                ? "OFFLINE"
                : age >= 0 && age <= 90_000
                  ? "LIVE"
                  : "STALE";

          return {
            id: bus.id,
            label: bus.bus_number,
            latitude: location?.latitude ?? null,
            longitude: location?.longitude ?? null,
            recordedAt:
              location?.recorded_at ??
              trip?.started_at ??
              new Date(0).toISOString(),
            status,
          };
        }),
      );

      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load administration data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();

    const timer = window.setInterval(() => {
      void reload();
    }, 30_000);

    return () => window.clearInterval(timer);
  }, [reload]);

  async function runAction(
    action: string,
    payload: Record<string, unknown>,
    success: string,
  ) {
    setError("");
    setMessage("");

    try {
      await apiRequest("/api/admin/data", {
        method: "POST",
        body: JSON.stringify({ action, ...payload }),
      });

      setMessage(success);
      await reload();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not complete the action.",
      );
    }
  }

  async function submitRequestReview(
    request: Request,
    approve: boolean,
  ) {
    const busId = selectedBus[request.id];

    if (approve && !busId) {
      setError("Choose an assigned bus before approving this request.");
      return;
    }

    await runAction(
      "review-request",
      { id: request.id, approve, busId },
      approve ? "Allocation approved." : "Request rejected.",
    );
  }

  async function signOut() {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
      router.replace("/");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not sign out.",
      );
    }
  }

  const pendingCount = requests.filter(
    (request) => request.status === "pending",
  ).length;

  const filteredFleet = fleet.filter((item) => {
    const bus = buses.find((candidate) => candidate.id === item.id);

    return (
      (!routeFilter || bus?.route_id === routeFilter) &&
      (statusFilter === "all" || item.status === statusFilter)
    );
  });

  return (
    <main className="min-h-screen bg-[#F7F7F7] text-neutral-950">
      <header className="sticky top-0 z-[500] border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-black text-sm font-black tracking-tight text-white">
              OGI
            </span>
            <span>
              <strong className="block text-sm tracking-tight">
                OGI RIDE
              </strong>
              <span className="text-xs text-neutral-500">
                Transport management
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{adminName}</p>
              <p className="text-xs text-neutral-500">Administrator</p>
            </div>

            <span className="grid size-10 place-items-center rounded-full border border-neutral-200 bg-neutral-100 text-sm font-bold">
              {adminName.trim().charAt(0).toUpperCase() || "A"}
            </span>

            <button onClick={() => void signOut()} className={secondary}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-neutral-500">
              Operations / Administration
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
              Command centre<span className="text-neutral-400">.</span>
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Manage students, transport operations and fleet activity.
            </p>
          </div>

          <button
            onClick={() => void reload()}
            className={button}
          >
            <span className="mr-2">↻</span> Refresh data
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-neutral-300 bg-neutral-100 p-4 text-sm"
          >
            <strong className="mr-2">Error</strong>
            {error}
            <button
              className="ml-3 underline"
              onClick={() => setError("")}
            >
              Dismiss
            </button>
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-5 flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 text-sm"
          >
            <span>
              <strong className="mr-2">Success</strong>
              {message}
            </span>
            <button
              className="text-neutral-500 hover:text-black"
              onClick={() => setMessage("")}
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-3 lg:sticky lg:top-24">
            <p className="px-3 pb-3 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Workspace
            </p>

            <nav
              aria-label="Administration sections"
              className="grid grid-cols-2 gap-1 lg:grid-cols-1"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSection(tab.id)}
                  aria-current={section === tab.id ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                    section === tab.id
                      ? "bg-black text-white shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                  }`}
                >
                  <span className="w-5 text-center text-base">
                    {tab.icon}
                  </span>
                  <span className="min-w-0 flex-1">{tab.label}</span>
                  {tab.id === "requests" && pendingCount > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        section === tab.id
                          ? "bg-white text-black"
                          : "bg-neutral-100 text-black"
                      }`}
                    >
                      {pendingCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="mt-5 border-t border-neutral-100 px-3 pt-4">
              <p className="text-xs text-neutral-400">System status</p>
              <div className="mt-2 flex items-center gap-2 text-xs font-medium">
                <span className="size-2 rounded-full bg-black" />
                Auto-refresh every 30 seconds
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            {loading ? (
              <div className={`${panel} p-10`}>
                <div className="mx-auto max-w-sm animate-pulse space-y-4">
                  <div className="h-5 w-40 rounded bg-neutral-200" />
                  <div className="h-3 w-full rounded bg-neutral-100" />
                  <div className="h-3 w-3/4 rounded bg-neutral-100" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 rounded-xl bg-neutral-100" />
                    <div className="h-24 rounded-xl bg-neutral-100" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {section === "overview" && (
                  <Overview
                    profiles={profiles}
                    buses={buses}
                    routes={routes}
                    requests={requests}
                    trips={trips}
                    fleet={fleet}
                    onNavigate={setSection}
                  />
                )}

                {section === "students" && (
                  <Students
                    profiles={profiles}
                    onVerify={(id, verified) =>
                      void runAction(
                        "set-eligibility",
                        { id, verified },
                        "Eligibility updated.",
                      )
                    }
                    onRole={(id, role) =>
                      void runAction(
                        "set-role",
                        { id, role },
                        "Account permissions updated.",
                      )
                    }
                    onYear={(id, academicYear, department) =>
                      void runAction(
                        "update-academic",
                        { id, academicYear, department },
                        "Academic record updated.",
                      )
                    }
                    onResetPassword={async (id) => {
                      const password = window.prompt(
                        "Set a temporary password (at least 10 characters):",
                      );

                      if (password === null) return;

                      if (password.length < 10) {
                        setError("Password must be at least 10 characters.");
                        return;
                      }

                      await runAction(
                        "set-password",
                        { id, password },
                        "Temporary password set. Share it securely.",
                      );
                    }}
                  />
                )}

                {section === "fleet" && (
                  <section className="space-y-5">
                    <div className={`${panel} grid gap-4 p-5 sm:grid-cols-3`}>
                      <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Route
                        <select
                          className={`${field} mt-2 normal-case tracking-normal`}
                          value={routeFilter}
                          onChange={(e) => setRouteFilter(e.target.value)}
                        >
                          <option value="">All routes</option>
                          {routes.map((route) => (
                            <option key={route.id} value={route.id}>
                              {route.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        GPS status
                        <select
                          className={`${field} mt-2 normal-case tracking-normal`}
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="all">All statuses</option>
                          <option value="LIVE">Live</option>
                          <option value="STALE">Stale</option>
                          <option value="OFFLINE">Offline</option>
                        </select>
                      </label>

                      <div className="flex items-end">
                        <button
                          className={secondary}
                          onClick={() => void reload()}
                        >
                          Refresh fleet
                        </button>
                      </div>
                    </div>

                    <div className={`${panel} overflow-hidden`}>
                      <div className="border-b border-neutral-100 p-5">
                        <h2 className="font-semibold tracking-tight">
                          Live fleet map
                        </h2>
                        <p className="mt-1 text-sm text-neutral-500">
                          Authorized tracking devices and latest reported
                          positions.
                        </p>
                      </div>

                      {filteredFleet.some(
                        (bus) =>
                          (bus.status === "LIVE" ||
                            bus.status === "STALE") &&
                          bus.latitude !== null &&
                          bus.longitude !== null,
                      ) ? (
                        <div className="p-3 sm:p-4">
                          <FleetMap buses={filteredFleet} />
                        </div>
                      ) : (
                        <div className="grid min-h-64 place-items-center p-8 text-center">
                          <div>
                            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-neutral-100 text-xl">
                              ⌖
                            </span>
                            <p className="mt-4 font-semibold">
                              No live positions
                            </p>
                            <p className="mt-1 max-w-sm text-sm leading-6 text-neutral-500">
                              GPS markers appear when an authorized device
                              submits coordinates for an active trip.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <FleetTable
                      buses={buses.filter((bus) =>
                        filteredFleet.some((item) => item.id === bus.id),
                      )}
                      fleet={filteredFleet}
                      trips={trips}
                      devices={devices}
                    />

                    <TripHistory trips={trips} buses={buses} />
                  </section>
                )}

                {section === "requests" && (
                  <Requests
                    requests={requests}
                    buses={buses}
                    selectedBus={selectedBus}
                    setSelectedBus={setSelectedBus}
                    onReview={(request, approve) =>
                      void submitRequestReview(request, approve)
                    }
                  />
                )}

                {section === "routes" && (
                  <FleetCrud
                    routes={routes}
                    stops={stops}
                    buses={buses}
                    onAction={runAction}
                  />
                )}

                {section === "announcements" && (
                  <AnnouncementsPanel
                    announcements={announcements}
                    tickets={tickets}
                    onAction={runAction}
                  />
                )}

                {section === "reports" && (
                  <Reports
                    profiles={profiles}
                    buses={buses}
                    routes={routes}
                    requests={requests}
                    trips={trips}
                    audit={audit}
                  />
                )}

                {section === "settings" && (
                  <Settings
                    years={years}
                    buses={buses}
                    devices={devices}
                    deviceToken={deviceToken}
                    onAction={runAction}
                    onProvision={async (event) => {
                      event.preventDefault();

                      const form = new FormData(event.currentTarget);
                      setDeviceToken("");
                      setError("");

                      try {
                        const response = await fetch(
                          "/api/admin/tracking-devices",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              name: String(form.get("name")),
                              busId: String(form.get("busId")),
                            }),
                          },
                        );

                        const result = await response.json();

                        if (!response.ok) {
                          setError(
                            result.error ??
                              "Could not create tracking device.",
                          );
                          return;
                        }

                        setDeviceToken(result.token as string);
                        setMessage(
                          "Device created. Copy its secret now.",
                        );

                        await reload();
                        event.currentTarget.reset();
                      } catch {
                        setError("Could not create tracking device.");
                      }
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>

        <footer className="mt-10 flex flex-col justify-between gap-2 border-t border-neutral-200 py-5 text-xs text-neutral-400 sm:flex-row">
          <span>OGI RIDE · Transport administration</span>
          <span>Operational data refreshes every 30 seconds</span>
        </footer>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  detail,
  onClick,
}: {
  label: string;
  value: number;
  detail: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`${panel} group p-5 text-left transition hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md disabled:cursor-default`}
    >
      <p className="text-sm font-medium text-neutral-500">{label}</p>
      <p className="mt-4 text-4xl font-semibold tracking-[-0.06em]">
        {value.toLocaleString()}
      </p>
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="text-xs text-neutral-400">{detail}</span>
        <span className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-black">
          →
        </span>
      </div>
    </button>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-1 text-sm leading-6 text-neutral-500">
          {description}
        </p>
      )}
    </div>
  );
}

function Overview({
  profiles,
  buses,
  routes,
  requests,
  trips,
  fleet,
  onNavigate,
}: {
  profiles: Profile[];
  buses: Bus[];
  routes: Route[];
  requests: Request[];
  trips: Trip[];
  fleet: MapBus[];
  onNavigate: (section: Section) => void;
}) {
  const students = profiles.filter((p) => p.role === "student").length;
  const pending = requests.filter((r) => r.status === "pending").length;
  const activeTrips = trips.filter((t) => t.status === "active").length;
  const live = fleet.filter((b) => b.status === "LIVE").length;

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionHeading
          eyebrow="Executive overview"
          title="Your operations at a glance"
          description="A consolidated view of your transport network."
        />
        <span className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-600">
          Live operational snapshot
        </span>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Metric
          label="Total students"
          value={students}
          detail="Registered students"
          onClick={() => onNavigate("students")}
        />
        <Metric
          label="Active fleet"
          value={buses.filter((b) => b.active).length}
          detail={`${buses.length} buses registered`}
          onClick={() => onNavigate("fleet")}
        />
        <Metric
          label="Published routes"
          value={routes.filter((r) => r.active).length}
          detail={`${routes.length} routes configured`}
          onClick={() => onNavigate("routes")}
        />
        <Metric
          label="Pending requests"
          value={pending}
          detail="Awaiting review"
          onClick={() => onNavigate("requests")}
        />
        <Metric
          label="Active trips"
          value={activeTrips}
          detail="Currently recorded trips"
          onClick={() => onNavigate("fleet")}
        />
        <Metric
          label="Live GPS feeds"
          value={live}
          detail="Recently reporting devices"
          onClick={() => onNavigate("fleet")}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className={`${panel} overflow-hidden`}>
          <div className="flex items-center justify-between border-b border-neutral-100 p-5">
            <div>
              <h3 className="font-semibold">Fleet operations</h3>
              <p className="mt-1 text-xs text-neutral-500">
                Latest GPS status by bus
              </p>
            </div>
            <button
              className={secondary}
              onClick={() => onNavigate("fleet")}
            >
              View fleet
            </button>
          </div>

          <div className="divide-y divide-neutral-100">
            {fleet.slice(0, 6).map((bus) => (
              <div
                key={bus.id}
                className="flex items-center justify-between gap-3 px-5 py-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-neutral-100 text-sm">
                    ▣
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {bus.label}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {bus.latitude !== null &&
                      bus.longitude !== null
                        ? "GPS coordinates available"
                        : "No current coordinates"}
                    </p>
                  </div>
                </div>
                <Status value={bus.status} />
              </div>
            ))}

            {fleet.length === 0 && (
              <Empty text="No buses have been configured." />
            )}
          </div>
        </article>

        <article className={`${panel} overflow-hidden`}>
          <div className="flex items-center justify-between border-b border-neutral-100 p-5">
            <div>
              <h3 className="font-semibold">Transport requests</h3>
              <p className="mt-1 text-xs text-neutral-500">
                Recent student allocation requests
              </p>
            </div>
            <button
              className={secondary}
              onClick={() => onNavigate("requests")}
            >
              Review requests
            </button>
          </div>

          <div className="divide-y divide-neutral-100">
            {requests.slice(0, 6).map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between gap-3 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {request.profiles?.full_name || "Student"}
                  </p>
                  <p className="mt-1 truncate text-xs text-neutral-500">
                    {request.routes?.name ?? "Route unavailable"} ·{" "}
                    {request.kind.replaceAll("_", " ")}
                  </p>
                </div>
                <Status value={request.status} />
              </div>
            ))}

            {requests.length === 0 && (
              <Empty text="No transport requests have been submitted." />
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

function Status({ value }: { value: string }) {
  const normalized = value.toLowerCase();

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
        normalized === "live" ||
        normalized === "active" ||
        normalized === "approved" ||
        normalized === "verified" ||
        normalized === "published"
          ? "border-neutral-900 bg-neutral-900 text-white"
          : normalized === "pending" ||
              normalized === "stale" ||
              normalized === "open"
            ? "border-neutral-300 bg-neutral-100 text-neutral-700"
            : "border-neutral-200 bg-white text-neutral-500"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          normalized === "live" || normalized === "active"
            ? "bg-white"
            : "bg-current"
        }`}
      />
      {value}
    </span>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="px-5 py-10 text-center">
      <span className="mx-auto grid size-10 place-items-center rounded-xl bg-neutral-100 text-lg">
        —
      </span>
      <p className="mt-3 text-sm text-neutral-500">{text}</p>
    </div>
  );
}

function Students({
  profiles,
  onVerify,
  onRole,
  onYear,
  onResetPassword,
}: {
  profiles: Profile[];
  onVerify: (id: string, verified: boolean) => void;
  onRole: (id: string, role: string) => void;
  onYear: (id: string, year: number, department: string) => void;
  onResetPassword: (id: string) => void;
}) {
  const [search, setSearch] = useState("");

  const students = profiles.filter((student) => {
    if (student.role !== "student") return false;

    const term = search.toLowerCase();

    return (
      student.full_name.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term) ||
      (student.student_number ?? "").toLowerCase().includes(term)
    );
  });

  return (
    <section className={`${panel} overflow-hidden`}>
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-100 p-5 sm:flex-row sm:items-center">
        <SectionHeading
          eyebrow="People management"
          title="Student directory"
          description="Manage eligibility, academic records and account permissions."
        />

        <label className="w-full sm:max-w-xs">
          <span className="sr-only">Search students</span>
          <input
            className={field}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="bg-neutral-50 text-[10px] uppercase tracking-[0.12em] text-neutral-500">
            <tr>
              {[
                "Student",
                "Student ID",
                "Academic year",
                "Eligibility",
                "Role",
                "Actions",
              ].map((label) => (
                <th key={label} className="px-5 py-4 font-semibold">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {students.map((student) => (
              <tr key={student.id} className="transition hover:bg-neutral-50">
                <td className="px-5 py-4">
                  <p className="font-semibold">
                    {student.full_name || "Name missing"}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {student.email}
                  </p>
                </td>
                <td className="px-5 py-4 text-neutral-600">
                  {student.student_number || "—"}
                </td>
                <td className="px-5 py-4">
                  <select
                    aria-label={`Academic year for ${student.full_name}`}
                    className={`${field} w-32`}
                    value={student.academic_year ?? ""}
                    onChange={(e) => {
                      const year = Number(e.target.value);
                      if (year) {
                        onYear(student.id, year, student.department ?? "");
                      }
                    }}
                  >
                    <option value="" disabled>
                      Set year
                    </option>
                    {[1, 2, 3, 4].map((year) => (
                      <option key={year} value={year}>
                        Year {year}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-neutral-500">
                    {student.department ?? "Department missing"}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <Status
                    value={
                      student.eligibility_verified ? "Verified" : "Pending"
                    }
                  />
                </td>
                <td className="px-5 py-4">
                  <select
                    aria-label={`Role for ${student.full_name}`}
                    className={field}
                    value={student.role}
                    onChange={(e) => onRole(student.id, e.target.value)}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      className={secondary}
                      onClick={() =>
                        onVerify(
                          student.id,
                          !student.eligibility_verified,
                        )
                      }
                    >
                      {student.eligibility_verified ? "Revoke" : "Verify"}
                    </button>
                    <button
                      className={danger}
                      onClick={() => onResetPassword(student.id)}
                    >
                      Password
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-neutral-500">
                  No matching students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-neutral-100 px-5 py-3 text-xs text-neutral-400">
        Showing {students.length} student records
      </div>
    </section>
  );
}

function Requests({
  requests,
  buses,
  selectedBus,
  setSelectedBus,
  onReview,
}: {
  requests: Request[];
  buses: Bus[];
  selectedBus: Record<string, string>;
  setSelectedBus: (value: Record<string, string>) => void;
  onReview: (request: Request, approve: boolean) => void;
}) {
  const [filter, setFilter] = useState("all");

  const filtered = requests.filter(
    (request) => filter === "all" || request.status === filter,
  );

  return (
    <section className="space-y-5">
      <div className={`${panel} flex flex-wrap items-center justify-between gap-4 p-5`}>
        <SectionHeading
          eyebrow="Student services"
          title="Allocation requests"
          description="Review route and pickup requests."
        />
        <select
          className={`${field} max-w-48`}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All requests</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filtered.length === 0 && (
        <div className={panel}>
          <Empty text="No requests match this filter." />
        </div>
      )}

      {filtered.map((request) => (
        <article key={request.id} className={`${panel} p-5 sm:p-6`}>
          <div className="flex flex-col justify-between gap-5 xl:flex-row">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Status value={request.status} />
                <span className="text-xs text-neutral-400">
                  {request.kind.replaceAll("_", " ")}
                </span>
              </div>

              <h3 className="mt-3 text-lg font-semibold tracking-tight">
                {request.profiles?.full_name ?? "Student"}
              </h3>

              <p className="mt-1 text-sm text-neutral-500">
                {request.profiles?.email}
                {request.profiles?.student_number
                  ? ` · ${request.profiles.student_number}`
                  : ""}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Detail
                  label="Requested route"
                  value={request.routes?.name ?? "Unavailable"}
                />
                <Detail
                  label="Pickup stop"
                  value={request.stops?.name ?? "Unavailable"}
                />
                <Detail
                  label="Academic year"
                  value={`Year ${request.profiles?.academic_year ?? "unknown"}`}
                />
                <Detail
                  label="Submitted"
                  value={new Date(request.created_at).toLocaleString()}
                />
              </div>

              {request.note && (
                <p className="mt-4 rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-600">
                  {request.note}
                </p>
              )}
            </div>

            {request.status === "pending" && (
              <div className="flex h-fit flex-wrap items-center gap-2 xl:max-w-xs">
                <select
                  aria-label="Choose an assigned bus"
                  className={field}
                  value={selectedBus[request.id] ?? ""}
                  onChange={(e) =>
                    setSelectedBus({
                      ...selectedBus,
                      [request.id]: e.target.value,
                    })
                  }
                >
                  <option value="">Choose bus</option>
                  {buses
                    .filter(
                      (bus) =>
                        bus.active && bus.route_id === request.route_id,
                    )
                    .map((bus) => (
                      <option key={bus.id} value={bus.id}>
                        {bus.bus_number} · {bus.capacity} seats
                      </option>
                    ))}
                </select>
                <button
                  className={button}
                  onClick={() => onReview(request, true)}
                >
                  Approve
                </button>
                <button
                  className={secondary}
                  onClick={() => onReview(request, false)}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-neutral-800">{value}</p>
    </div>
  );
}

function FleetTable({
  buses,
  fleet,
  trips,
  devices,
}: {
  buses: Bus[];
  fleet: MapBus[];
  trips: Trip[];
  devices: TrackingDevice[];
}) {
  return (
    <section className={`${panel} overflow-hidden`}>
      <div className="border-b border-neutral-100 p-5">
        <h3 className="font-semibold">Fleet inventory</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Bus registration, GPS and device status.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-neutral-50 text-[10px] uppercase tracking-wider text-neutral-500">
            <tr>
              {["Bus / route", "GPS status", "Last report", "Trip", "Device"].map(
                (label) => (
                  <th key={label} className="p-4 font-semibold">
                    {label}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {buses.map((bus) => {
              const location = fleet.find((item) => item.id === bus.id);
              const trip = trips.find(
                (item) => item.bus_id === bus.id && item.status === "active",
              );
              const device = devices.find(
                (item) => item.bus_id === bus.id,
              );

              return (
                <tr key={bus.id} className="hover:bg-neutral-50">
                  <td className="p-4">
                    <p className="font-semibold">{bus.bus_number}</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {bus.routes?.name ?? "No route assigned"}
                    </p>
                  </td>
                  <td className="p-4">
                    <Status value={location?.status ?? "OFFLINE"} />
                  </td>
                  <td className="p-4 text-neutral-600">
                    {location &&
                    location.status !== "OFFLINE" &&
                    location.status !== "TRIP ENDED"
                      ? new Date(location.recordedAt).toLocaleString()
                      : "No current location"}
                  </td>
                  <td className="p-4 text-neutral-600">
                    {trip
                      ? `Active · ${new Date(trip.started_at).toLocaleString()}`
                      : "No active trip"}
                  </td>
                  <td className="p-4 text-neutral-600">
                    {device
                      ? `${device.name} · ${device.active ? "Enabled" : "Disabled"}`
                      : "No device"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TripHistory({
  trips,
  buses,
}: {
  trips: Trip[];
  buses: Bus[];
}) {
  return (
    <section className={`${panel} overflow-hidden`}>
      <div className="border-b border-neutral-100 p-5">
        <h3 className="font-semibold">Trip history</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Start and end events recorded by authorized tracking devices.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-neutral-50 text-[10px] uppercase tracking-wider text-neutral-500">
            <tr>
              {["Bus", "Started", "Ended", "Status"].map((label) => (
                <th key={label} className="p-4 font-semibold">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {trips.map((trip) => (
              <tr key={trip.id} className="hover:bg-neutral-50">
                <td className="p-4 font-semibold">
                  {buses.find((b) => b.id === trip.bus_id)?.bus_number ??
                    "Unavailable"}
                </td>
                <td className="p-4">
                  {new Date(trip.started_at).toLocaleString()}
                </td>
                <td className="p-4">
                  {trip.ended_at
                    ? new Date(trip.ended_at).toLocaleString()
                    : "—"}
                </td>
                <td className="p-4">
                  <Status value={trip.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {trips.length === 0 && (
          <Empty text="No trips have been recorded." />
        )}
      </div>
    </section>
  );
}

function FleetCrud({
  routes,
  stops,
  buses,
  onAction,
}: {
  routes: Route[];
  stops: Stop[];
  buses: Bus[];
  onAction: (
    action: string,
    payload: Record<string, unknown>,
    success: string,
  ) => Promise<void>;
}) {
  async function submit(
    event: FormEvent<HTMLFormElement>,
    action: string,
    success: string,
    read: (form: FormData) => Record<string, unknown>,
  ) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    await onAction(action, read(form), success);
    formElement.reset();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <FormCard
        title="Create route"
        description="Add a transport route to the network."
      >
        <form
          onSubmit={(e) =>
            void submit(e, "create-route", "Route created.", (f) => ({
              name: String(f.get("name")).trim(),
              origin: String(f.get("origin")).trim(),
              destination: String(f.get("destination")).trim(),
            }))
          }
          className="space-y-3"
        >
          <input className={field} name="name" placeholder="Route name" required />
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={field} name="origin" placeholder="Origin" required />
            <input className={field} name="destination" placeholder="Destination" required />
          </div>
          <button className={button}>Create route</button>
        </form>
      </FormCard>

      <FormCard
        title="Register bus"
        description="Add a bus and assign its route."
      >
        <form
          onSubmit={(e) =>
            void submit(e, "create-bus", "Bus created.", (f) => ({
              busNumber: String(f.get("busNumber")).trim(),
              registration: String(f.get("registration")).trim(),
              routeId: String(f.get("routeId")) || null,
              capacity: Number(f.get("capacity")),
            }))
          }
          className="space-y-3"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={field} name="busNumber" placeholder="Bus number" required />
            <input className={field} name="registration" placeholder="Registration" required />
          </div>
          <select className={field} name="routeId">
            <option value="">No route assigned</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>{route.name}</option>
            ))}
          </select>
          <input className={field} name="capacity" type="number" min="1" placeholder="Seat capacity" required />
          <button className={button}>Register bus</button>
        </form>
      </FormCard>

      <FormCard
        title="Create stop"
        description="Register a pickup point or landmark."
      >
        <form
          onSubmit={(e) =>
            void submit(e, "create-stop", "Stop created.", (f) => {
              const lat = String(f.get("latitude") ?? "").trim();
              const lng = String(f.get("longitude") ?? "").trim();

              return {
                name: String(f.get("name")).trim(),
                address: String(f.get("address") ?? "").trim() || null,
                latitude: lat ? Number(lat) : null,
                longitude: lng ? Number(lng) : null,
              };
            })
          }
          className="space-y-3"
        >
          <input className={field} name="name" placeholder="Stop name" required />
          <input className={field} name="address" placeholder="Address / landmark" />
          <div className="grid grid-cols-2 gap-3">
            <input className={field} name="latitude" type="number" step="any" placeholder="Latitude" />
            <input className={field} name="longitude" type="number" step="any" placeholder="Longitude" />
          </div>
          <button className={button}>Create stop</button>
        </form>
      </FormCard>

      <FormCard
        title="Connect stop to route"
        description="Define the stop order and scheduled time."
      >
        <form
          onSubmit={(e) =>
            void submit(e, "connect-stop", "Stop linked to route.", (f) => ({
              routeId: String(f.get("routeId")),
              stopId: String(f.get("stopId")),
              stopOrder: Number(f.get("stopOrder")),
              time: String(f.get("time") ?? "").trim() || null,
            }))
          }
          className="space-y-3"
        >
          <select className={field} name="routeId" required>
            <option value="">Select route</option>
            {routes.map((route) => <option key={route.id} value={route.id}>{route.name}</option>)}
          </select>
          <select className={field} name="stopId" required>
            <option value="">Select stop</option>
            {stops.map((stop) => <option key={stop.id} value={stop.id}>{stop.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input className={field} name="stopOrder" type="number" min="1" placeholder="Stop order" required />
            <input className={field} name="time" type="time" />
          </div>
          <button className={button}>Connect stop</button>
        </form>
      </FormCard>

      <FormCard title="Manage buses">
        <div className="space-y-3">
          {buses.map((bus) => (
            <div key={bus.id} className="rounded-xl border border-neutral-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{bus.bus_number}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {bus.registration_number} · {bus.routes?.name ?? "No route"}
                  </p>
                </div>
                <Status value={bus.active ? "Active" : "Inactive"} />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <select
                  className={field}
                  aria-label={`Route for ${bus.bus_number}`}
                  value={bus.route_id ?? ""}
                  onChange={(e) =>
                    void onAction("update-bus", {
                      id: bus.id,
                      route_id: e.target.value || null,
                    }, "Bus route updated.")
                  }
                >
                  <option value="">No route</option>
                  {routes.map((route) => <option key={route.id} value={route.id}>{route.name}</option>)}
                </select>
                <input
                  className={field}
                  type="number"
                  min="1"
                  aria-label={`Capacity for ${bus.bus_number}`}
                  defaultValue={bus.capacity}
                  onBlur={(e) => {
                    const capacity = Number(e.target.value);
                    if (capacity > 0 && capacity !== bus.capacity) {
                      void onAction("update-bus", { id: bus.id, capacity }, "Bus capacity updated.");
                    }
                  }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  className={secondary}
                  onClick={() => void onAction("update-bus", { id: bus.id, active: !bus.active }, "Bus status updated.")}
                >
                  {bus.active ? "Deactivate" : "Activate"}
                </button>
                <button
                  className={danger}
                  onClick={() => {
                    if (window.confirm(`Delete ${bus.bus_number}?`)) {
                      void onAction("delete-bus", { id: bus.id }, "Bus deleted.");
                    }
                  }}
                >
                  Delete bus
                </button>
              </div>
            </div>
          ))}
          {buses.length === 0 && <Empty text="No buses configured." />}
        </div>
      </FormCard>

      <FormCard title="Manage routes and stops">
        <div className="space-y-3">
          {routes.map((route) => (
            <div key={route.id} className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 p-3">
              <div>
                <p className="text-sm font-semibold">{route.name}</p>
                <p className="mt-1 text-xs text-neutral-500">{route.origin} → {route.destination}</p>
              </div>
              <button
                className={danger}
                onClick={() => {
                  if (window.confirm(`Delete route ${route.name}?`)) {
                    void onAction("delete-route", { id: route.id }, "Route deleted.");
                  }
                }}
              >
                Delete
              </button>
            </div>
          ))}
          {stops.map((stop) => (
            <div key={stop.id} className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 p-3">
              <div>
                <p className="text-sm font-semibold">{stop.name}</p>
                <p className="mt-1 text-xs text-neutral-500">{stop.address ?? "No address"}</p>
              </div>
              <button
                className={danger}
                onClick={() => {
                  if (window.confirm(`Delete stop ${stop.name}?`)) {
                    void onAction("delete-stop", { id: stop.id }, "Stop deleted.");
                  }
                }}
              >
                Delete
              </button>
            </div>
          ))}
          {routes.length === 0 && stops.length === 0 && (
            <Empty text="No routes or stops configured." />
          )}
        </div>
      </FormCard>
    </div>
  );
}

function AnnouncementsPanel({
  announcements,
  tickets,
  onAction,
}: {
  announcements: Announcement[];
  tickets: Ticket[];
  onAction: (
    action: string,
    payload: Record<string, unknown>,
    success: string,
  ) => Promise<void>;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <FormCard
        title="Publish announcement"
        description="Send transport updates to students."
      >
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const formElement = e.currentTarget;
            const form = new FormData(formElement);

            await onAction("create-announcement", {
              title: String(form.get("title")).trim(),
              body: String(form.get("body")).trim(),
              published: form.get("published") === "on",
            }, "Announcement saved.");

            formElement.reset();
          }}
        >
          <input className={field} name="title" placeholder="Announcement title" required />
          <textarea className={`${field} min-h-32 py-3`} name="body" placeholder="Message for students" required />
          <label className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3 text-sm">
            <input className="size-4 accent-black" type="checkbox" name="published" />
            Publish immediately
          </label>
          <button className={button}>Save announcement</button>
        </form>
      </FormCard>

      <FormCard title="Announcements">
        <div className="space-y-3">
          {announcements.map((item) => (
            <article key={item.id} className="rounded-xl border border-neutral-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-600">{item.body}</p>
                </div>
                <Status value={item.published ? "Published" : "Draft"} />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className={secondary}
                  onClick={() => void onAction("toggle-announcement", { id: item.id, published: !item.published }, "Announcement visibility updated.")}
                >
                  {item.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  className={danger}
                  onClick={() => {
                    if (window.confirm("Delete this announcement?")) {
                      void onAction("delete-announcement", { id: item.id }, "Announcement deleted.");
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
          {announcements.length === 0 && <Empty text="No announcements yet." />}
        </div>
      </FormCard>

      <div className="xl:col-span-2">
        <FormCard
          title="Student support"
          description="Track and update support ticket status."
        >
          <div className="grid gap-3 lg:grid-cols-2">
            {tickets.map((ticket) => (
              <article key={ticket.id} className="rounded-xl border border-neutral-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{ticket.subject}</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {ticket.profiles?.full_name ?? "Student"} · {ticket.profiles?.student_number ?? "No student ID"}
                    </p>
                  </div>
                  <Status value={ticket.status} />
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{ticket.message}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["open", "in_progress", "closed"].map((status) => (
                    <button
                      key={status}
                      className={secondary}
                      onClick={() => void onAction("ticket-status", { id: ticket.id, status }, "Support ticket updated.")}
                    >
                      {status.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
          {tickets.length === 0 && <Empty text="No support tickets." />}
        </FormCard>
      </div>
    </div>
  );
}

function Reports({
  profiles,
  buses,
  routes,
  requests,
  trips,
  audit,
}: {
  profiles: Profile[];
  buses: Bus[];
  routes: Route[];
  requests: Request[];
  trips: Trip[];
  audit: AuditEntry[];
}) {
  const metrics = [
    ["Students", profiles.length],
    ["Buses", buses.length],
    ["Routes", routes.length],
    ["Requests", requests.length],
    ["Trips recorded", trips.length],
    ["Audit events", audit.length],
  ] as const;

  return (
    <div className="space-y-5">
      <SectionHeading
        eyebrow="Analytics & exports"
        title="Reports and audit history"
        description="Review operational totals and export administrative records."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map(([label, value]) => (
          <div key={label} className={`${panel} p-5`}>
            <p className="text-sm text-neutral-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <section className={`${panel} p-5`}>
        <h3 className="font-semibold">Download reports</h3>
        <p className="mt-2 text-sm text-neutral-500">
          Export records visible to administrators in CSV format.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {["allocations", "requests", "trips", "audit"].map((type) => (
            <a
              key={type}
              className={button}
              href={`/api/admin/reports?type=${type}`}
            >
              ↓ Export {type}
            </a>
          ))}
        </div>
      </section>

      <section className={`${panel} overflow-hidden`}>
        <div className="border-b border-neutral-100 p-5">
          <h3 className="font-semibold">Recent audit events</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Administrative actions recorded by the system.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-neutral-50 text-[10px] uppercase tracking-wider text-neutral-500">
              <tr>
                {["Time", "Action", "Entity", "Actor"].map((label) => (
                  <th key={label} className="p-4 font-semibold">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {audit.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50">
                  <td className="p-4">{new Date(item.created_at).toLocaleString()}</td>
                  <td className="p-4 font-medium">{item.action}</td>
                  <td className="p-4">{item.entity_type} · {item.entity_id ?? "—"}</td>
                  <td className="p-4 text-neutral-500">{item.actor_id ?? "System/device"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {audit.length === 0 && <Empty text="No audit events recorded." />}
        </div>
      </section>
    </div>
  );
}

function Settings({
  years,
  buses,
  devices,
  deviceToken,
  onAction,
  onProvision,
}: {
  years: YearConfig[];
  buses: Bus[];
  devices: TrackingDevice[];
  deviceToken: string;
  onAction: (
    action: string,
    payload: Record<string, unknown>,
    success: string,
  ) => Promise<void>;
  onProvision: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <FormCard
        title="Academic enrollment"
        description="Control which academic years may submit transport requests."
      >
        <div className="space-y-3">
          {years.map((year) => (
            <div key={year.year} className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 p-4">
              <div>
                <p className="font-semibold">{year.label}</p>
                <p className="mt-1 text-xs text-neutral-500">Academic year {year.year}</p>
              </div>
              <button
                className={year.enrollment_open ? button : secondary}
                onClick={() => void onAction("year-setting", { year: year.year, open: !year.enrollment_open }, "Enrollment setting updated.")}
              >
                {year.enrollment_open ? "Close enrollment" : "Open enrollment"}
              </button>
            </div>
          ))}
          {years.length === 0 && <Empty text="No academic year settings found." />}
        </div>
      </FormCard>

      <FormCard
        title="GPS tracking devices"
        description="Provision a device credential for one bus. The raw secret is displayed only once."
      >
        <form onSubmit={(e) => void onProvision(e)} className="space-y-3">
          <input className={field} name="name" placeholder="Device / driver name" minLength={2} required />
          <select className={field} name="busId" required>
            <option value="">Choose bus</option>
            {buses.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.bus_number} · {bus.registration_number}
              </option>
            ))}
          </select>
          <button className={button}>Create tracking device</button>
        </form>

        {deviceToken && (
          <div className="mt-4 rounded-xl border border-neutral-300 bg-neutral-50 p-4">
            <p className="text-sm font-semibold">Copy and store this secret securely.</p>
            <code className="mt-3 block break-all text-xs leading-6">{deviceToken}</code>
            <button
              className={`${secondary} mt-3`}
              onClick={() => void navigator.clipboard.writeText(deviceToken)}
            >
              Copy secret
            </button>
          </div>
        )}

        <div className="mt-5 space-y-3">
          {devices.map((device) => (
            <div key={device.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 p-4">
              <div>
                <p className="font-semibold">{device.name}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {device.buses?.bus_number ?? "Bus unavailable"} ·{" "}
                  {device.last_seen_at
                    ? `Last seen ${new Date(device.last_seen_at).toLocaleString()}`
                    : "Not yet connected"}
                </p>
              </div>
              <button
                className={secondary}
                onClick={() => void onAction("device-active", { id: device.id, active: !device.active }, "Device status updated.")}
              >
                {device.active ? "Disable" : "Enable"}
              </button>
            </div>
          ))}
          {devices.length === 0 && <Empty text="No tracking devices configured." />}
        </div>
      </FormCard>
    </div>
  );
}

function FormCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`${panel} p-5 sm:p-6`}>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="mb-5 mt-1 text-sm leading-6 text-neutral-500">
          {description}
        </p>
      )}
      {!description && <div className="mb-5" />}
      {children}
    </section>
  );
}
