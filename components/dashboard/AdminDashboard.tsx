"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/client-api";
import type { MapBus } from "./BusMap";

const FleetMap = dynamic(
  () => import("./BusMap").then((module) => module.FleetMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[30rem] animate-pulse rounded-2xl bg-slate-100" />
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
type YearConfig = { year: number; label: string; enrollment_open: boolean };
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

const button =
  "inline-flex min-h-10 items-center justify-center rounded-xl bg-[#3157D5] px-4 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-wait disabled:opacity-50";
const field =
  "min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10";
const tabs: { id: Section; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "students", label: "Students" },
  { id: "fleet", label: "Fleet & trips" },
  { id: "requests", label: "Requests" },
  { id: "routes", label: "Routes & buses" },
  { id: "announcements", label: "Announcements" },
  { id: "reports", label: "Reports" },
  { id: "settings", label: "Settings" },
];

export default function AdminDashboard({ adminName }: { adminName: string }) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("overview");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [years, setYears] = useState<YearConfig[]>([]);
  const [announcements, setAnnouncements] = useState<
    {
      id: string;
      title: string;
      body: string;
      published: boolean;
      created_at: string;
    }[]
  >([]);
  const [tickets, setTickets] = useState<
    {
      id: string;
      subject: string;
      message: string;
      status: string;
      created_at: string;
      profiles: { full_name: string; student_number: string | null } | null;
    }[]
  >([]);
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
    setLoading(false);
    try {
      const result = await apiRequest<{
        profiles: Profile[];
        routes: Route[];
        stops: Stop[];
        buses: Bus[];
        requests: Request[];
        years: YearConfig[];
        announcements: typeof announcements;
        tickets: typeof tickets;
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

      const latestByBus = new Map<string, (typeof result.locations)[number]>();
      for (const location of result.locations) {
        if (!latestByBus.has(location.bus_id))
          latestByBus.set(location.bus_id, location);
      }
      const now = Date.now();
      const currentTrip = new Map<string, Trip>();
      for (const trip of result.trips)
        if (!currentTrip.has(trip.bus_id)) currentTrip.set(trip.bus_id, trip);
      setFleet(
        result.buses.map((bus) => {
          const trip = currentTrip.get(bus.id);
          const candidate = latestByBus.get(bus.id);
          const location =
            candidate && candidate.trip_id === trip?.id ? candidate : undefined;
          const age = location
            ? now - Date.parse(location.recorded_at)
            : Number.POSITIVE_INFINITY;
          const status: MapBus["status"] =
            trip?.status === "ended"
              ? "TRIP ENDED"
              : !trip
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
              trip?.ended_at ??
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
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => void reload(), 0);
    const timer = window.setInterval(() => void reload(), 30_000);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(initial);
    };
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
          : "Could not complete the administrator action.",
      );
    }
  }

  async function submitRequestReview(request: Request, approve: boolean) {
    setError("");
    setMessage("");
    const busId = selectedBus[request.id];
    if (approve && !busId) {
      setError("Select a bus assigned to the requested route before approval.");
      return;
    }
    await runAction(
      "review-request",
      { id: request.id, approve, busId },
      approve
        ? "Allocation approved and student notified."
        : "Request rejected and student notified.",
    );
  }

  async function verifyStudent(studentId: string, verified: boolean) {
    await runAction(
      "set-eligibility",
      { id: studentId, verified },
      "Student eligibility status updated and notification sent.",
    );
  }

  async function updateStudentYear(
    studentId: string,
    academicYear: number,
    department: string,
  ) {
    await runAction(
      "update-academic",
      { id: studentId, academicYear, department },
      "Student academic record updated.",
    );
  }

  async function changeRole(studentId: string, role: string) {
    await runAction(
      "set-role",
      { id: studentId, role },
      "Account permission updated.",
    );
  }

  async function resetStudentPassword(studentId: string) {
    const password = window.prompt(
      "Set a temporary password (at least 10 characters):",
    );
    if (password === null) return;
    await runAction(
      "set-password",
      { id: studentId, password },
      "Temporary password set. Share it with the student securely.",
    );
  }

  async function createRoute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    await runAction(
      "create-route",
      {
        name: String(form.get("name")).trim(),
        origin: String(form.get("origin")).trim(),
        destination: String(form.get("destination")).trim(),
      },
      "Route created.",
    );
    formElement.reset();
  }

  async function createStop(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const lat = String(form.get("latitude") ?? "").trim();
    const lng = String(form.get("longitude") ?? "").trim();
    const latitude = lat ? Number(lat) : null;
    const longitude = lng ? Number(lng) : null;
    if (
      (lat && !Number.isFinite(latitude)) ||
      (lng && !Number.isFinite(longitude))
    ) {
      setError("Stop coordinates must be valid numbers.");
      return;
    }
    await runAction(
      "create-stop",
      {
        name: String(form.get("name")).trim(),
        address: String(form.get("address") ?? "").trim() || null,
        latitude,
        longitude,
      },
      "Stop created.",
    );
    formElement.reset();
  }

  async function connectStop(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    await runAction(
      "connect-stop",
      {
        routeId: String(form.get("routeId")),
        stopId: String(form.get("stopId")),
        stopOrder: Number(form.get("stopOrder")),
        time: String(form.get("time") ?? "").trim() || null,
      },
      "Stop linked to route.",
    );
    formElement.reset();
  }

  async function createBus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    await runAction(
      "create-bus",
      {
        busNumber: String(form.get("busNumber")).trim(),
        registration: String(form.get("registration")).trim(),
        routeId: String(form.get("routeId")) || null,
        capacity: Number(form.get("capacity")),
      },
      "Bus created.",
    );
    formElement.reset();
  }

  async function updateBus(bus: Bus, values: Partial<Bus>) {
    await runAction(
      "update-bus",
      { id: bus.id, ...values },
      "Bus details updated.",
    );
  }

  async function createAnnouncement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    await runAction(
      "create-announcement",
      {
        title: String(form.get("title")).trim(),
        body: String(form.get("body")).trim(),
        published: form.get("published") === "on",
      },
      "Announcement saved.",
    );
    formElement.reset();
  }

  async function provisionDevice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setDeviceToken("");
    setError("");
    const form = new FormData(formElement);
    const response = await fetch("/api/admin/tracking-devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name")),
        busId: String(form.get("busId")),
      }),
    });
    const result = await response.json();
    if (!response.ok)
      setError(result.error ?? "Could not create tracking device.");
    else {
      setDeviceToken(result.token as string);
      setMessage(
        "Tracking device created. Copy its secret now; it will not be shown again.",
      );
      await reload();
      formElement.reset();
    }
  }

  async function signOut() {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
      router.replace("/");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign out.");
    }
  }

  const pendingCount = requests.filter(
    (request) => request.status === "pending",
  ).length;
  const routeFleet = fleet.filter(
    (item) =>
      !routeFilter ||
      buses.find((bus) => bus.id === item.id)?.route_id === routeFilter,
  );
  const filteredFleet = routeFleet.filter(
    (item) => statusFilter === "all" || item.status === statusFilter,
  );

  return (
    <main className="min-h-screen bg-[#F6F8FC] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#3157D5] text-xs font-black text-white">
              OGI
            </span>
            <span>
              <strong className="block text-sm">OGI RIDE</strong>
              <span className="text-xs text-slate-500">Administration</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-600 sm:block">
              Signed in as {adminName}
            </span>
            <button
              onClick={() => void signOut()}
              className="min-h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-blue-700">
            Transport operations
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Administration
          </h1>
        </div>
        {error && (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </p>
        )}
        {message && (
          <p
            role="status"
            className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            {message}
          </p>
        )}
        <nav
          aria-label="Admin dashboard"
          className="mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSection(tab.id)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold ${section === tab.id ? "bg-[#3157D5] text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {tab.label}
              {tab.id === "requests" && pendingCount > 0
                ? ` · ${pendingCount}`
                : ""}
            </button>
          ))}
        </nav>
        {loading && (
          <p className="rounded-xl bg-white p-6 text-sm text-slate-500">
            Loading transport records…
          </p>
        )}
        {!loading && section === "overview" && (
          <Overview
            profiles={profiles}
            buses={buses}
            routes={routes}
            requests={requests}
            trips={trips}
            fleet={fleet}
          />
        )}
        {!loading && section === "students" && (
          <Students
            profiles={profiles}
            onVerify={verifyStudent}
            onRole={changeRole}
            onYear={updateStudentYear}
            onResetPassword={resetStudentPassword}
          />
        )}
        {!loading && section === "fleet" && (
          <section className="space-y-5">
            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-3">
              <label className="text-sm font-semibold">
                Route filter
                <select
                  className={`${field} mt-2`}
                  value={routeFilter}
                  onChange={(event) => setRouteFilter(event.target.value)}
                >
                  <option value="">All routes</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                Tracking status
                <select
                  className={`${field} mt-2`}
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="all">All statuses</option>
                  <option value="LIVE">Live</option>
                  <option value="STALE">Stale</option>
                  <option value="OFFLINE">Offline</option>
                  <option value="TRIP ENDED">Trip ended</option>
                </select>
              </label>
              <div className="flex items-end">
                <button
                  className="min-h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold"
                  onClick={() => void reload()}
                >
                  Refresh fleet
                </button>
              </div>
            </div>
            {filteredFleet.some(
              (bus) => bus.status === "LIVE" || bus.status === "STALE",
            ) ? (
              <FleetMap buses={filteredFleet} />
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                No GPS positions have been reported for these filters. Fleet
                markers appear only after an authorized device submits
                coordinates.
              </p>
            )}
            <FleetTable
              buses={buses}
              fleet={filteredFleet}
              trips={trips}
              devices={devices}
            />
            <TripHistory trips={trips} buses={buses} />
          </section>
        )}
        {!loading && section === "requests" && (
          <Requests
            requests={requests}
            buses={buses}
            selectedBus={selectedBus}
            setSelectedBus={setSelectedBus}
            onReview={submitRequestReview}
          />
        )}
        {!loading && section === "routes" && (
          <FleetCrud
            routes={routes}
            stops={stops}
            buses={buses}
            onCreateRoute={createRoute}
            onCreateStop={createStop}
            onConnectStop={connectStop}
            onCreateBus={createBus}
            onUpdateBus={updateBus}
            onDeleteRoute={(id) =>
              void runAction("delete-route", { id }, "Route deleted.")
            }
            onDeleteStop={(id) =>
              void runAction("delete-stop", { id }, "Stop deleted.")
            }
            onDeleteBus={(id) =>
              void runAction("delete-bus", { id }, "Bus deleted.")
            }
          />
        )}
        {!loading && section === "announcements" && (
          <AnnouncementsPanel
            announcements={announcements}
            tickets={tickets}
            onCreate={createAnnouncement}
            onToggle={(item) =>
              void runAction(
                "toggle-announcement",
                { id: item.id, published: !item.published },
                "Announcement visibility updated.",
              )
            }
            onDelete={(id) =>
              void runAction(
                "delete-announcement",
                { id },
                "Announcement deleted.",
              )
            }
            onTicket={(id, status) =>
              void runAction(
                "ticket-status",
                { id, status },
                "Support ticket updated.",
              )
            }
          />
        )}
        {!loading && section === "reports" && (
          <Reports
            profiles={profiles}
            buses={buses}
            routes={routes}
            requests={requests}
            trips={trips}
            audit={audit}
          />
        )}
        {!loading && section === "settings" && (
          <Settings
            years={years}
            buses={buses}
            devices={devices}
            onYearChange={(year, open) =>
              void runAction(
                "year-setting",
                { year, open },
                "Enrollment setting updated.",
              )
            }
            onProvision={provisionDevice}
            deviceToken={deviceToken}
            onDeviceActive={(device, active) =>
              void runAction(
                "device-active",
                { id: device.id, active },
                "Tracking device status updated.",
              )
            }
          />
        )}
      </div>
    </main>
  );
}

function Overview({
  profiles,
  buses,
  routes,
  requests,
  trips,
  fleet,
}: {
  profiles: Profile[];
  buses: Bus[];
  routes: Route[];
  requests: Request[];
  trips: Trip[];
  fleet: MapBus[];
}) {
  const cards = [
    [
      "Students",
      profiles.filter((profile) => profile.role === "student").length,
    ],
    ["Active buses", buses.filter((bus) => bus.active).length],
    ["Published routes", routes.filter((route) => route.active).length],
    [
      "Pending requests",
      requests.filter((request) => request.status === "pending").length,
    ],
    ["Active trips", trips.filter((trip) => trip.status === "active").length],
    ["Live GPS feeds", fleet.filter((bus) => bus.status === "LIVE").length],
  ];
  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value]) => (
          <article
            key={String(label)}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </article>
        ))}
      </section>
      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold">Operations snapshot</h2>
          <div className="mt-4 space-y-3">
            {fleet.slice(0, 6).map((bus) => (
              <div
                key={bus.id}
                className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm"
              >
                <span>{bus.label}</span>
                <span className="font-semibold">{bus.status}</span>
              </div>
            ))}
            {fleet.length === 0 && (
              <p className="text-sm text-slate-500">No buses are configured.</p>
            )}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold">Latest transport requests</h2>
          <div className="mt-4 space-y-3">
            {requests.slice(0, 5).map((request) => (
              <div
                key={request.id}
                className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm"
              >
                <span>
                  {request.profiles?.full_name || request.profiles?.email} ·{" "}
                  {request.kind.replaceAll("_", " ")}
                </span>
                <span className="font-semibold">{request.status}</span>
              </div>
            ))}
            {requests.length === 0 && (
              <p className="text-sm text-slate-500">
                No requests have been submitted.
              </p>
            )}
          </div>
        </article>
      </section>
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
  const students = profiles.filter((profile) => profile.role === "student");
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <h2 className="text-lg font-bold">Student records and eligibility</h2>
        <p className="mt-1 text-sm text-slate-500">
          Verify the student’s eligibility before allocation requests can be
          submitted.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Student ID</th>
              <th className="p-4">Year / department</th>
              <th className="p-4">Eligibility</th>
              <th className="p-4">Permission</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="p-4">
                  <strong>{student.full_name || "Name missing"}</strong>
                  <span className="block text-xs text-slate-500">
                    {student.email}
                  </span>
                </td>
                <td className="p-4">{student.student_number || "—"}</td>
                <td className="p-4">
                  <select
                    aria-label={`Set academic year for ${student.full_name}`}
                    value={student.academic_year ?? ""}
                    onChange={(event) => {
                      const year = Number(event.target.value);
                      if (year)
                        void onYear(student.id, year, student.department ?? "");
                    }}
                    className={`${field} min-w-28`}
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
                  <span className="mt-1 block text-xs text-slate-500">
                    {student.department ?? "Department missing"}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${student.eligibility_verified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}
                  >
                    {student.eligibility_verified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    aria-label={`Set permission for ${student.full_name}`}
                    value={student.role}
                    onChange={(event) => onRole(student.id, event.target.value)}
                    className={field}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        onVerify(student.id, !student.eligibility_verified)
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"
                    >
                      {student.eligibility_verified ? "Revoke" : "Verify"}
                    </button>
                    <button
                      onClick={() => onResetPassword(student.id)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"
                    >
                      Set password
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  return (
    <section className="space-y-4">
      {requests.length === 0 && (
        <p className="rounded-2xl bg-white p-6 text-sm text-slate-500">
          No transport requests have been submitted.
        </p>
      )}
      {requests.map((request) => (
        <article
          key={request.id}
          className="rounded-2xl border border-slate-200 bg-white p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                {request.kind.replaceAll("_", " ")} · {request.status}
              </p>
              <h2 className="mt-1 text-lg font-bold">
                {request.profiles?.full_name ?? "Student"} ·{" "}
                {request.profiles?.student_number ?? request.profiles?.email}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {request.routes?.name} · pickup {request.stops?.name}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Year {request.profiles?.academic_year ?? "unknown"} ·{" "}
                {new Date(request.created_at).toLocaleString()}
              </p>
              {request.note && (
                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
                  {request.note}
                </p>
              )}
            </div>
            {request.status === "pending" && (
              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label="Choose a bus for approval"
                  className={`${field} min-w-48`}
                  value={selectedBus[request.id] ?? ""}
                  onChange={(event) =>
                    setSelectedBus({
                      ...selectedBus,
                      [request.id]: event.target.value,
                    })
                  }
                >
                  <option value="">Choose bus</option>
                  {buses
                    .filter(
                      (bus) => bus.active && bus.route_id === request.route_id,
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
                  className="min-h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold hover:bg-slate-50"
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
    <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="p-4">Bus / route</th>
            <th className="p-4">Tracking status</th>
            <th className="p-4">Last GPS report</th>
            <th className="p-4">Trip</th>
            <th className="p-4">Device</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {buses.map((bus) => {
            const location = fleet.find((item) => item.id === bus.id);
            const trip = trips.find((item) => item.bus_id === bus.id);
            const device = devices.find((item) => item.bus_id === bus.id);
            return (
              <tr key={bus.id}>
                <td className="p-4">
                  <strong>{bus.bus_number}</strong>
                  <span className="block text-xs text-slate-500">
                    {bus.routes?.name ?? "Route not assigned"}
                  </span>
                </td>
                <td className="p-4 font-semibold">
                  {location?.status ?? "OFFLINE"}
                </td>
                <td className="p-4">
                  {location &&
                  location.status !== "OFFLINE" &&
                  location.status !== "TRIP ENDED"
                    ? new Date(location.recordedAt).toLocaleString()
                    : "No current location"}
                </td>
                <td className="p-4">
                  {trip
                    ? `${trip.status} · ${new Date(trip.started_at).toLocaleString()}`
                    : "No trip"}
                </td>
                <td className="p-4">
                  {device
                    ? `${device.name} · ${device.active ? "active" : "disabled"}`
                    : "No device"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function TripHistory({ trips, buses }: { trips: Trip[]; buses: Bus[] }) {
  return (
    <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <h2 className="font-bold">Trip history</h2>
        <p className="mt-1 text-sm text-slate-500">
          Recorded trip start and end events from authorized tracking devices.
        </p>
      </div>
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="p-4">Bus</th>
            <th className="p-4">Started</th>
            <th className="p-4">Ended</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {trips.map((trip) => (
            <tr key={trip.id}>
              <td className="p-4">
                {buses.find((bus) => bus.id === trip.bus_id)?.bus_number ??
                  "Bus unavailable"}
              </td>
              <td className="p-4">
                {new Date(trip.started_at).toLocaleString()}
              </td>
              <td className="p-4">
                {trip.ended_at ? new Date(trip.ended_at).toLocaleString() : "—"}
              </td>
              <td className="p-4 font-semibold">{trip.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {trips.length === 0 && (
        <p className="p-5 text-sm text-slate-500">
          No trips have been reported.
        </p>
      )}
    </section>
  );
}

function FleetCrud({
  routes,
  stops,
  buses,
  onCreateRoute,
  onCreateStop,
  onConnectStop,
  onCreateBus,
  onUpdateBus,
  onDeleteRoute,
  onDeleteStop,
  onDeleteBus,
}: {
  routes: Route[];
  stops: Stop[];
  buses: Bus[];
  onCreateRoute: (event: FormEvent<HTMLFormElement>) => void;
  onCreateStop: (event: FormEvent<HTMLFormElement>) => void;
  onConnectStop: (event: FormEvent<HTMLFormElement>) => void;
  onCreateBus: (event: FormEvent<HTMLFormElement>) => void;
  onUpdateBus: (bus: Bus, values: Partial<Bus>) => void;
  onDeleteRoute: (id: string) => void;
  onDeleteStop: (id: string) => void;
  onDeleteBus: (id: string) => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <FormCard title="Create route">
        <form onSubmit={onCreateRoute} className="grid gap-3 sm:grid-cols-3">
          <input
            className={field}
            name="name"
            placeholder="Route name"
            required
          />
          <input
            className={field}
            name="origin"
            placeholder="Origin"
            required
          />
          <input
            className={field}
            name="destination"
            placeholder="Destination"
            required
          />
          <button className={`${button} sm:col-span-3`}>Create route</button>
        </form>
      </FormCard>
      <FormCard title="Create bus">
        <form onSubmit={onCreateBus} className="grid gap-3 sm:grid-cols-2">
          <input
            className={field}
            name="busNumber"
            placeholder="Bus number"
            required
          />
          <input
            className={field}
            name="registration"
            placeholder="Registration"
            required
          />
          <select className={field} name="routeId">
            <option value="">No route yet</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.name}
              </option>
            ))}
          </select>
          <input
            className={field}
            name="capacity"
            type="number"
            min="1"
            placeholder="Seat capacity"
            required
          />
          <button className={`${button} sm:col-span-2`}>Create bus</button>
        </form>
      </FormCard>
      <FormCard title="Create stop">
        <form onSubmit={onCreateStop} className="grid gap-3 sm:grid-cols-2">
          <input
            className={field}
            name="name"
            placeholder="Stop name"
            required
          />
          <input
            className={field}
            name="address"
            placeholder="Address / landmark"
          />
          <input
            className={field}
            name="latitude"
            type="number"
            step="any"
            min="-90"
            max="90"
            placeholder="Latitude (optional)"
          />
          <input
            className={field}
            name="longitude"
            type="number"
            step="any"
            min="-180"
            max="180"
            placeholder="Longitude (optional)"
          />
          <button className={`${button} sm:col-span-2`}>Create stop</button>
        </form>
      </FormCard>
      <FormCard title="Add stop to route">
        <form onSubmit={onConnectStop} className="grid gap-3 sm:grid-cols-2">
          <select className={field} name="routeId" required>
            <option value="">Select route</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.name}
              </option>
            ))}
          </select>
          <select className={field} name="stopId" required>
            <option value="">Select stop</option>
            {stops.map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stop.name}
              </option>
            ))}
          </select>
          <input
            className={field}
            name="stopOrder"
            type="number"
            min="1"
            placeholder="Stop order"
            required
          />
          <input className={field} name="time" type="time" />
          <button className={`${button} sm:col-span-2`}>Add route stop</button>
        </form>
      </FormCard>
      <FormCard title="Manage buses">
        <div className="space-y-3">
          {buses.map((bus) => (
            <div
              key={bus.id}
              className="grid gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center"
            >
              <div>
                <strong className="text-sm">{bus.bus_number}</strong>
                <span className="block text-xs text-slate-500">
                  {bus.registration_number} · {bus.routes?.name ?? "No route"}
                </span>
              </div>
              <div className="flex gap-2">
                <select
                  aria-label={`Route for ${bus.bus_number}`}
                  className={field}
                  value={bus.route_id ?? ""}
                  onChange={(event) =>
                    onUpdateBus(bus, { route_id: event.target.value || null })
                  }
                >
                  <option value="">No route</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.name}
                    </option>
                  ))}
                </select>
                <input
                  aria-label={`Capacity for ${bus.bus_number}`}
                  className={`${field} max-w-24`}
                  type="number"
                  min="1"
                  value={bus.capacity}
                  onChange={(event) => {
                    const capacity = Number(event.target.value);
                    if (capacity > 0) onUpdateBus(bus, { capacity });
                  }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdateBus(bus, { active: !bus.active })}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"
                >
                  {bus.active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => onDeleteBus(bus.id)}
                  className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700"
                >
                  Delete
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
            <div
              key={route.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
            >
              <p className="text-sm">
                <strong>{route.name}</strong>
                <span className="block text-xs text-slate-500">
                  {route.origin} → {route.destination}
                </span>
              </p>
              <button
                onClick={() => onDeleteRoute(route.id)}
                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700"
              >
                Delete route
              </button>
            </div>
          ))}
          {stops.map((stop) => (
            <div
              key={stop.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
            >
              <p className="text-sm">
                <strong>{stop.name}</strong>
                <span className="block text-xs text-slate-500">
                  {stop.address ?? "No address"}
                </span>
              </p>
              <button
                onClick={() => onDeleteStop(stop.id)}
                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700"
              >
                Delete stop
              </button>
            </div>
          ))}
        </div>
      </FormCard>
    </div>
  );
}

function AnnouncementsPanel({
  announcements,
  tickets,
  onCreate,
  onToggle,
  onDelete,
  onTicket,
}: {
  announcements: {
    id: string;
    title: string;
    body: string;
    published: boolean;
    created_at: string;
  }[];
  tickets: {
    id: string;
    subject: string;
    message: string;
    status: string;
    created_at: string;
    profiles: { full_name: string; student_number: string | null } | null;
  }[];
  onCreate: (event: FormEvent<HTMLFormElement>) => void;
  onToggle: (item: { id: string; published: boolean }) => void;
  onDelete: (id: string) => void;
  onTicket: (id: string, status: string) => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <FormCard title="Publish announcement">
        <form onSubmit={onCreate} className="space-y-3">
          <input
            className={field}
            name="title"
            placeholder="Announcement title"
            required
          />
          <textarea
            className={`${field} min-h-32 py-3`}
            name="body"
            placeholder="Message for students"
            required
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" /> Publish immediately
          </label>
          <button className={button}>Save announcement</button>
        </form>
      </FormCard>
      <FormCard title="Announcements">
        <div className="space-y-3">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.body}</p>
                </div>
                <span className="text-xs font-bold">
                  {item.published ? "PUBLISHED" : "DRAFT"}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => onToggle(item)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"
                >
                  {item.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </FormCard>
      <FormCard title="Student support tickets">
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <article
              key={ticket.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <p className="text-sm font-semibold">
                {ticket.subject} · {ticket.profiles?.full_name} ·{" "}
                {ticket.status}
              </p>
              <p className="mt-2 text-sm text-slate-600">{ticket.message}</p>
              <div className="mt-3 flex gap-2">
                {["open", "in_progress", "closed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => onTicket(ticket.id, status)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"
                  >
                    {status.replace("_", " ")}
                  </button>
                ))}
              </div>
            </article>
          ))}
          {tickets.length === 0 && <Empty text="No support tickets." />}
        </div>
      </FormCard>
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
  const links = ["allocations", "requests", "trips", "audit"];
  return (
    <section className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Students", profiles.length],
          ["Buses", buses.length],
          ["Routes", routes.length],
          ["Requests", requests.length],
          ["Trips recorded", trips.length],
          ["Recent audit events", audit.length],
        ].map(([label, value]) => (
          <article
            key={String(label)}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </article>
        ))}
      </div>
      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-bold">Download reports</h2>
        <p className="mt-1 text-sm text-slate-500">
          CSV export contains database records visible to administrators, up to
          10,000 rows.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {links.map((type) => (
            <a
              key={type}
              className={button}
              href={`/api/admin/reports?type=${type}`}
            >
              Export {type}
            </a>
          ))}
        </div>
      </article>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <h2 className="p-5 font-bold">Recent audit events</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4">Time</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity</th>
                <th className="p-4">Actor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {audit.map((item) => (
                <tr key={item.id}>
                  <td className="p-4">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="p-4">{item.action}</td>
                  <td className="p-4">
                    {item.entity_type} · {item.entity_id ?? "—"}
                  </td>
                  <td className="p-4">{item.actor_id ?? "System/device"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {audit.length === 0 && (
          <p className="p-5 text-sm text-slate-500">
            No audit events have been recorded.
          </p>
        )}
      </article>
    </section>
  );
}

function Settings({
  years,
  buses,
  devices,
  onYearChange,
  onProvision,
  deviceToken,
  onDeviceActive,
}: {
  years: YearConfig[];
  buses: Bus[];
  devices: TrackingDevice[];
  onYearChange: (year: number, open: boolean) => void;
  onProvision: (event: FormEvent<HTMLFormElement>) => void;
  deviceToken: string;
  onDeviceActive: (device: TrackingDevice, active: boolean) => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <FormCard title="Academic year enrollment">
        <p className="mb-4 text-sm text-slate-500">
          The database checks these settings before accepting new, renewal or
          route-change requests.
        </p>
        <div className="space-y-3">
          {years.map((year) => (
            <div
              key={year.year}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"
            >
              <div>
                <strong>{year.label}</strong>
                <p className="text-xs text-slate-500">Year {year.year}</p>
              </div>
              <button
                onClick={() => onYearChange(year.year, !year.enrollment_open)}
                className={`rounded-lg px-3 py-2 text-xs font-bold ${year.enrollment_open ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}
              >
                {year.enrollment_open ? "Enrollment open" : "Enrollment closed"}
              </button>
            </div>
          ))}
        </div>
      </FormCard>
      <FormCard title="Provision GPS tracking device">
        <p className="mb-4 text-sm leading-6 text-slate-500">
          Creates a device credential tied to a single bus. The raw token is
          displayed once only; store it securely on the authorized tracker.
        </p>
        <form onSubmit={onProvision} className="space-y-3">
          <input
            className={field}
            name="name"
            placeholder="Device / driver name"
            required
            minLength={2}
          />
          <select className={field} name="busId" required>
            <option value="">Choose bus</option>
            {buses.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.bus_number} · {bus.registration_number}
              </option>
            ))}
          </select>
          <button className={button}>Create device and secret</button>
        </form>
        {deviceToken && (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">
              Copy this credential now; it cannot be retrieved again.
            </p>
            <code className="mt-2 block break-all text-xs">{deviceToken}</code>
          </div>
        )}
        <div className="mt-5 space-y-2">
          {devices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 text-sm"
            >
              <span>
                {device.name} · {device.buses?.bus_number} ·{" "}
                {device.last_seen_at
                  ? `seen ${new Date(device.last_seen_at).toLocaleString()}`
                  : "not yet connected"}
              </span>
              <button
                onClick={() => onDeviceActive(device, !device.active)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"
              >
                {device.active ? "Disable" : "Enable"}
              </button>
            </div>
          ))}
        </div>
      </FormCard>
    </div>
  );
}

function FormCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">{text}</p>
  );
}
