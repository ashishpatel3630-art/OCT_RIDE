import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type { SqlDatabase, SqlSession } from "@/lib/postgres";
import { getDatabaseClient } from "@/lib/postgres";
import { hashPassword } from "@/lib/password";
import { jsonError, hasValidOrigin, requireAdminApi } from "@/lib/api";

type ProfileDoc = {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "admin";
  student_number: string | null;
  academic_year: number | null;
  department: string | null;
  eligibility_verified: boolean;
};
type RouteDoc = { id: string; name: string; origin: string; destination: string; active: boolean };
type StopDoc = { id: string; name: string; address: string | null; latitude: number | null; longitude: number | null };
type BusDoc = {
  id: string;
  bus_number: string;
  registration_number: string;
  route_id: string | null;
  capacity: number;
  active: boolean;
};
type RequestDoc = {
  id: string;
  student_id: string;
  kind: string;
  route_id: string;
  stop_id: string;
  status: string;
  note: string | null;
  created_at: Date;
};
type TripDoc = { id: string; bus_id: string; status: "active" | "ended"; started_at: Date; ended_at: Date | null };

async function addAudit(
  db: SqlDatabase,
  actorId: string,
  action: string,
  entityType: string,
  entityId: string,
  details: Record<string, unknown> = {},
  session?: SqlSession,
) {
  await db.collection("audit_logs").insertOne({
    id: randomUUID(),
    actor_id: actorId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
    created_at: new Date(),
  }, { session });
}

export async function GET() {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const db = auth.db;
  const [
    profiles, routes, stops, buses, requests, years, announcements, tickets,
    trips, devices, locations, audit,
  ] = await Promise.all([
    db.collection<ProfileDoc>("profiles").find().sort({ full_name: 1 }).toArray(),
    db.collection<RouteDoc>("routes").find().sort({ name: 1 }).toArray(),
    db.collection<StopDoc>("stops").find().sort({ name: 1 }).toArray(),
    db.collection<BusDoc>("buses").find().sort({ bus_number: 1 }).toArray(),
    db.collection<RequestDoc>("allocation_requests").find().sort({ created_at: -1 }).limit(200).toArray(),
    db.collection("academic_years").find().sort({ year: 1 }).toArray(),
    db.collection("announcements").find().sort({ created_at: -1 }).toArray(),
    db.collection("support_tickets").find().sort({ created_at: -1 }).limit(100).toArray(),
    db.collection<TripDoc>("trips").find().sort({ started_at: -1 }).limit(500).toArray(),
    db.collection("tracking_devices").find().sort({ created_at: -1 }).toArray(),
    db.collection("bus_locations").find().sort({ recorded_at: -1 }).limit(1000).toArray(),
    db.collection("audit_logs").find().sort({ created_at: -1 }).limit(100).toArray(),
  ]);

  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
  const routeById = new Map(routes.map((route) => [route.id, route]));
  const stopById = new Map(stops.map((stop) => [stop.id, stop]));
  const busById = new Map(buses.map((bus) => [bus.id, bus]));
  const requestsWithRelations = requests.map((item) => {
    const profile = profileById.get(item.student_id);
    const route = routeById.get(item.route_id);
    return {
      ...item,
      profiles: profile ? {
        full_name: profile.full_name,
        email: profile.email,
        student_number: profile.student_number,
        academic_year: profile.academic_year,
      } : null,
      routes: route ? { name: route.name } : null,
      stops: stopById.get(item.stop_id) ? { name: stopById.get(item.stop_id)?.name } : null,
    };
  });
  const ticketsWithProfiles = tickets.map((ticket) => {
    const profile = profileById.get(String(ticket.student_id));
    return {
      ...ticket,
      profiles: profile ? {
        full_name: profile.full_name,
        student_number: profile.student_number,
      } : null,
    };
  });
  const devicesWithBus = devices.map((device) => ({
    ...device,
    buses: busById.get(String(device.bus_id))
      ? { bus_number: busById.get(String(device.bus_id))?.bus_number }
      : null,
  }));
  const latestByBus = new Map<string, typeof locations[number]>();
  for (const location of locations) {
    const busId = String(location.bus_id);
    if (!latestByBus.has(busId)) latestByBus.set(busId, location);
  }

  return NextResponse.json({
    profiles,
    routes,
    stops,
    buses: buses.map((bus) => ({
      ...bus,
      routes: bus.route_id && routeById.get(bus.route_id)
        ? { name: routeById.get(bus.route_id)?.name }
        : null,
    })),
    requests: requestsWithRelations,
    years,
    announcements,
    tickets: ticketsWithProfiles,
    trips,
    devices: devicesWithBus,
    locations: [...latestByBus.values()],
    audit,
  });
}

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) return jsonError("Invalid request origin.", 403);
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON.", 400);
  }
  if (!body || typeof body !== "object") return jsonError("Invalid request payload.", 400);
  const data = body as Record<string, unknown>;
  const db = auth.db;
  const now = new Date();
  const id = typeof data.id === "string" ? data.id : "";
  const requiredText = (value: unknown, label: string, min = 1, max = 120) => {
    if (typeof value !== "string" || value.trim().length < min || value.trim().length > max) {
      throw new Error(`${label} must contain ${min} to ${max} characters.`);
    }
    return value.trim();
  };

  try {
    switch (data.action) {
      case "set-eligibility": {
        if (!id || typeof data.verified !== "boolean") return jsonError("Student and eligibility status are required.", 400);
        const result = await db.collection("profiles").updateOne(
          { id, role: "student" },
          { $set: { eligibility_verified: data.verified, updated_at: now } },
        );
        if (!result.matchedCount) return jsonError("Student profile not found.", 404);
        await db.collection("notifications").insertOne({
          id: randomUUID(),
          user_id: id,
          title: "Eligibility status updated",
          body: data.verified
            ? "Your student eligibility is verified. You can now submit transport requests."
            : "Your student eligibility is pending review. Contact Student Services if you need assistance.",
          read_at: null,
          created_at: now,
        });
        await addAudit(db, auth.user.id, "eligibility_update", "profile", id, { verified: data.verified });
        break;
      }
      case "update-academic": {
        if (!id || !Number.isInteger(data.academicYear) || Number(data.academicYear) < 1 || Number(data.academicYear) > 4) {
          return jsonError("A student and academic year from 1 to 4 are required.", 400);
        }
        const department = requiredText(data.department, "Department", 1, 120);
        const result = await db.collection("profiles").updateOne(
          { id, role: "student" },
          { $set: { academic_year: data.academicYear, department, updated_at: now } },
        );
        if (!result.matchedCount) return jsonError("Student profile not found.", 404);
        await addAudit(db, auth.user.id, "academic_record_update", "profile", id, {
          academic_year: data.academicYear,
          department,
        });
        break;
      }
      case "set-role": {
        if (!id || (data.role !== "student" && data.role !== "admin")) {
          return jsonError("A user ID and valid role are required.", 400);
        }
        const target = await db.collection<ProfileDoc>("profiles").findOne({ id });
        if (!target) return jsonError("Profile not found.", 404);
        if (target.role === "admin" && data.role === "student" &&
            await db.collection("profiles").countDocuments({ role: "admin" }) <= 1) {
          return jsonError("At least one administrator account must remain active.", 409);
        }
        await db.collection("profiles").updateOne({ id }, { $set: { role: data.role, updated_at: now } });
        await addAudit(db, auth.user.id, "role_update", "profile", id, { role: data.role });
        break;
      }
      case "set-password": {
        const password = typeof data.password === "string" ? data.password : "";
        if (!id || password.length < 10 || password.length > 128) {
          return jsonError("Choose a temporary password with 10 to 128 characters.", 400);
        }
        const updated = await db.collection("profiles").updateOne(
          { id, role: "student" },
          {
            $set: { password_hash: await hashPassword(password), updated_at: now },
            $inc: { session_version: 1 },
          },
        );
        if (!updated.matchedCount) return jsonError("Student profile not found.", 404);
        await addAudit(db, auth.user.id, "password_reset", "profile", id);
        break;
      }
      case "review-request": {
        const busId = typeof data.busId === "string" ? data.busId : "";
        const approve = data.approve === true;
        const client = await getDatabaseClient();
        const session = await client.startSession();
        try {
          await session.withTransaction(async () => {
            const req = await db.collection<RequestDoc>("allocation_requests")
              .findOne({ id, status: "pending" }, { session });
            if (!req) throw new Error("Pending allocation request not found.");
            if (approve) {
              const busLock = await db.collection<BusDoc>("buses").updateOne(
                { id: busId, active: true, route_id: req.route_id },
                { $set: { allocation_lock: randomUUID() } },
                { session },
              );
              if (!busLock.matchedCount) throw new Error("Selected bus is inactive or serves another route.");
              const bus = await db.collection<BusDoc>("buses").findOne({ id: busId }, { session });
              if (!bus) throw new Error("Selected bus is unavailable.");
              const used = await db.collection("allocations").countDocuments(
                { bus_id: busId, active: true },
                { session },
              );
              if (used >= bus.capacity) throw new Error("Bus has no remaining capacity.");
              await db.collection("allocations").updateMany(
                { student_id: req.student_id, active: true },
                { $set: { active: false } },
                { session },
              );
              await db.collection("allocations").insertOne({
                id: randomUUID(),
                student_id: req.student_id,
                bus_id: busId,
                route_id: req.route_id,
                stop_id: req.stop_id,
                request_id: req.id,
                active: true,
                created_at: now,
              }, { session });
              await db.collection("allocation_requests").updateOne(
                { id: req.id, status: "pending" },
                { $set: { status: "approved", reviewed_by: auth.user.id, reviewed_at: now } },
                { session },
              );
              await db.collection("notifications").insertOne({
                id: randomUUID(),
                user_id: req.student_id,
                title: "Transport request approved",
                body: "Your bus allocation has been confirmed.",
                read_at: null,
                created_at: now,
              }, { session });
              await addAudit(db, auth.user.id, "approve", "allocation_request", req.id, {}, session);
            } else {
              await db.collection("allocation_requests").updateOne(
                { id: req.id, status: "pending" },
                { $set: { status: "rejected", reviewed_by: auth.user.id, reviewed_at: now } },
                { session },
              );
              await db.collection("notifications").insertOne({
                id: randomUUID(),
                user_id: req.student_id,
                title: "Transport request update",
                body: "Please contact transport administration for details.",
                read_at: null,
                created_at: now,
              }, { session });
              await addAudit(db, auth.user.id, "reject", "allocation_request", req.id, {
                reason: "Please contact transport administration for details.",
              }, session);
            }
          });
        } finally {
          await session.endSession();
        }
        break;
      }
      case "create-route": {
        await db.collection("routes").insertOne({
          id: randomUUID(),
          name: requiredText(data.name, "Route name", 2, 120),
          origin: requiredText(data.origin, "Origin", 2, 120),
          destination: requiredText(data.destination, "Destination", 2, 120),
          active: true,
          created_at: now,
        });
        break;
      }
      case "create-stop": {
        const latitude = data.latitude === null ? null : Number(data.latitude);
        const longitude = data.longitude === null ? null : Number(data.longitude);
        if ((latitude === null) !== (longitude === null) ||
            (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) ||
            (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180))) {
          return jsonError("Stop coordinates must be valid latitude and longitude values.", 400);
        }
        await db.collection("stops").insertOne({
          id: randomUUID(),
          name: requiredText(data.name, "Stop name", 1, 120),
          address: typeof data.address === "string" ? data.address.trim() || null : null,
          latitude,
          longitude,
          created_at: now,
        });
        break;
      }
      case "connect-stop": {
        if (typeof data.routeId !== "string" || typeof data.stopId !== "string" ||
            !Number.isInteger(data.stopOrder) || Number(data.stopOrder) < 1) {
          return jsonError("Route, stop and a positive stop order are required.", 400);
        }
        const [route, stop] = await Promise.all([
          db.collection("routes").findOne({ id: data.routeId }),
          db.collection("stops").findOne({ id: data.stopId }),
        ]);
        if (!route || !stop) return jsonError("Route or stop not found.", 404);
        await db.collection("route_stops").insertOne({
          route_id: data.routeId,
          stop_id: data.stopId,
          stop_order: data.stopOrder,
          scheduled_time: typeof data.time === "string" ? data.time || null : null,
        });
        break;
      }
      case "create-bus": {
        const capacity = Number(data.capacity);
        if (!Number.isInteger(capacity) || capacity < 1) return jsonError("Bus capacity must be a positive integer.", 400);
        const routeId = typeof data.routeId === "string" && data.routeId ? data.routeId : null;
        if (routeId && !await db.collection("routes").findOne({ id: routeId })) {
          return jsonError("Route not found.", 404);
        }
        await db.collection("buses").insertOne({
          id: randomUUID(),
          bus_number: requiredText(data.busNumber, "Bus number", 2, 40),
          registration_number: requiredText(data.registration, "Registration number", 2, 40),
          route_id: routeId,
          capacity,
          active: true,
          created_at: now,
        });
        break;
      }
      case "update-bus": {
        if (!id) return jsonError("Bus ID is required.", 400);
        const changes: Record<string, unknown> = {};
        if (Object.hasOwn(data, "active")) {
          if (typeof data.active !== "boolean") return jsonError("Invalid active state.", 400);
          changes.active = data.active;
        }
        if (Object.hasOwn(data, "capacity")) {
          const capacity = Number(data.capacity);
          if (!Number.isInteger(capacity) || capacity < 1) return jsonError("Capacity must be a positive integer.", 400);
          if (await db.collection("allocations").countDocuments({ bus_id: id, active: true }) > capacity) {
            return jsonError("Capacity cannot be lower than active allocations.", 409);
          }
          changes.capacity = capacity;
        }
        if (Object.hasOwn(data, "route_id")) {
          if (data.route_id !== null && typeof data.route_id !== "string") return jsonError("Invalid route ID.", 400);
          if (typeof data.route_id === "string" && !await db.collection("routes").findOne({ id: data.route_id })) {
            return jsonError("Route not found.", 404);
          }
          changes.route_id = data.route_id;
          if (await db.collection("allocations").countDocuments({ bus_id: id, active: true }) > 0) {
            return jsonError("Cannot change the route while the bus has active allocations.", 409);
          }
        }
        if (!Object.keys(changes).length) return jsonError("No bus changes provided.", 400);
        await db.collection("buses").updateOne({ id }, { $set: changes });
        break;
      }
      case "delete-route": {
        if (!id) return jsonError("Route ID is required.", 400);
        if (await db.collection("allocation_requests").countDocuments({ route_id: id }) ||
            await db.collection("allocations").countDocuments({ route_id: id })) {
          return jsonError("Cannot delete a route referenced by allocation records.", 409);
        }
        await db.collection("route_stops").deleteMany({ route_id: id });
        await db.collection("buses").updateMany({ route_id: id }, { $set: { route_id: null } });
        const deleted = await db.collection("routes").deleteOne({ id });
        if (!deleted.deletedCount) return jsonError("Route not found.", 404);
        break;
      }
      case "delete-stop": {
        if (!id) return jsonError("Stop ID is required.", 400);
        if (await db.collection("route_stops").countDocuments({ stop_id: id })) {
          return jsonError("Remove this stop from its routes before deleting it.", 409);
        }
        const deleted = await db.collection("stops").deleteOne({ id });
        if (!deleted.deletedCount) return jsonError("Stop not found.", 404);
        break;
      }
      case "delete-bus": {
        if (!id) return jsonError("Bus ID is required.", 400);
        if (await db.collection("allocations").countDocuments({ bus_id: id }) ||
            await db.collection("trips").countDocuments({ bus_id: id })) {
          return jsonError("Cannot delete a bus with allocation or trip history.", 409);
        }
        await db.collection("tracking_credentials").deleteMany({ device_id: id });
        await db.collection("tracking_devices").deleteMany({ bus_id: id });
        const deleted = await db.collection("buses").deleteOne({ id });
        if (!deleted.deletedCount) return jsonError("Bus not found.", 404);
        break;
      }
      case "create-announcement": {
        const title = requiredText(data.title, "Title", 1, 160);
        const text = requiredText(data.body, "Announcement", 1, 5000);
        await db.collection("announcements").insertOne({
          id: randomUUID(),
          title,
          body: text,
          published: data.published === true,
          created_by: auth.user.id,
          created_at: now,
        });
        break;
      }
      case "toggle-announcement": {
        if (!id || typeof data.published !== "boolean") return jsonError("Announcement and visibility are required.", 400);
        const updated = await db.collection("announcements").updateOne({ id }, { $set: { published: data.published } });
        if (!updated.matchedCount) return jsonError("Announcement not found.", 404);
        break;
      }
      case "delete-announcement": {
        if (!id) return jsonError("Announcement ID is required.", 400);
        const deleted = await db.collection("announcements").deleteOne({ id });
        if (!deleted.deletedCount) return jsonError("Announcement not found.", 404);
        break;
      }
      case "ticket-status": {
        if (!id || !["open", "in_progress", "closed"].includes(String(data.status))) {
          return jsonError("Ticket and valid status are required.", 400);
        }
        const updated = await db.collection("support_tickets").updateOne(
          { id },
          { $set: { status: data.status, updated_at: now } },
        );
        if (!updated.matchedCount) return jsonError("Support ticket not found.", 404);
        break;
      }
      case "year-setting": {
        const year = Number(data.year);
        if (!Number.isInteger(year) || year < 1 || year > 4 || typeof data.open !== "boolean") {
          return jsonError("Academic year and enrollment state are required.", 400);
        }
        await db.collection("academic_years").updateOne(
          { year },
          { $set: { enrollment_open: data.open, updated_at: now } },
          { upsert: true },
        );
        break;
      }
      case "device-active": {
        if (!id || typeof data.active !== "boolean") return jsonError("Device and active state are required.", 400);
        const updated = await db.collection("tracking_devices").updateOne({ id }, { $set: { active: data.active } });
        if (!updated.matchedCount) return jsonError("Tracking device not found.", 404);
        break;
      }
      default:
        return jsonError("Unsupported administrator action.", 400);
    }
  } catch (cause) {
    if (cause && typeof cause === "object" && "code" in cause && cause.code === 11000) {
      return jsonError("A record with the same unique value already exists.", 409);
    }
    return jsonError(cause instanceof Error ? cause.message : "Could not complete administrator action.", 400);
  }

  return NextResponse.json({ updated: true });
}
