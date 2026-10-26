import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { loadRoutes } from "@/lib/routes";
import { hasValidOrigin, jsonError, requireStudentApi } from "@/lib/api";

type AllocationDoc = {
  id: string;
  student_id: string;
  bus_id: string;
  route_id: string;
  stop_id: string;
  active: boolean;
};
type RequestDoc = {
  id: string;
  student_id: string;
  kind: string;
  status: string;
  created_at: Date;
  note: string | null;
};
type BusDoc = { id: string; bus_number: string; registration_number: string };
type RouteDoc = { id: string; name: string; origin: string; destination: string };
type StopDoc = { id: string; name: string; address: string | null };
type NoticeDoc = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  read_at: Date | null;
  created_at: Date;
};

export async function GET() {
  const auth = await requireStudentApi();
  if ("response" in auth) return auth.response;

  const [routes, allocation, requests, notices, saved] = await Promise.all([
    loadRoutes(auth.db),
    auth.db.collection<AllocationDoc>("allocations").findOne({
      student_id: auth.user.id,
      active: true,
    }),
    auth.db.collection<RequestDoc>("allocation_requests")
      .find({ student_id: auth.user.id })
      .sort({ created_at: -1 }).limit(10).toArray(),
    auth.db.collection<NoticeDoc>("notifications")
      .find({ user_id: auth.user.id })
      .sort({ created_at: -1 }).limit(5).toArray(),
    auth.db.collection<{ user_id: string; route_id: string }>("saved_routes")
      .find({ user_id: auth.user.id }).toArray(),
  ]);

  let allocationView = null;
  if (allocation) {
    const [bus, route, stop] = await Promise.all([
      auth.db.collection<BusDoc>("buses").findOne({ id: allocation.bus_id }),
      auth.db.collection<RouteDoc>("routes").findOne({ id: allocation.route_id }),
      auth.db.collection<StopDoc>("stops").findOne({ id: allocation.stop_id }),
    ]);
    allocationView = {
      id: allocation.id,
      bus_id: allocation.bus_id,
      route_id: allocation.route_id,
      stop_id: allocation.stop_id,
      buses: bus ? { bus_number: bus.bus_number, registration_number: bus.registration_number } : null,
      routes: route ? { name: route.name, origin: route.origin, destination: route.destination } : null,
      stops: stop ? { name: stop.name, address: stop.address } : null,
    };
  }

  return NextResponse.json({
    routes,
    allocation: allocationView,
    requests,
    notices,
    saved: saved.map((item) => item.route_id),
  });
}

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) return jsonError("Invalid request origin.", 403);
  const auth = await requireStudentApi();
  if ("response" in auth) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON.", 400);
  }
  if (!body || typeof body !== "object") return jsonError("Invalid request payload.", 400);
  const payload = body as Record<string, unknown>;
  const action = payload.action;
  const now = new Date();

  if (action === "toggle-saved") {
    if (typeof payload.routeId !== "string") return jsonError("A route ID is required.", 400);
    const route = await auth.db.collection("routes").findOne({ id: payload.routeId, active: true });
    if (!route) return jsonError("Route not found.", 404);
    const savedRoutes = auth.db.collection("saved_routes");
    const filter = { user_id: auth.user.id, route_id: payload.routeId };
    const current = await savedRoutes.findOne(filter);
    if (current) await savedRoutes.deleteOne(filter);
    else await savedRoutes.insertOne({ ...filter, created_at: now });
    return NextResponse.json({ saved: !current });
  }

  if (action === "save-phone") {
    if (typeof payload.phone !== "string" || payload.phone.length > 40) {
      return jsonError("Phone number must be 40 characters or fewer.", 400);
    }
    await auth.db.collection("profiles").updateOne(
      { id: auth.user.id },
      { $set: { phone: payload.phone.trim() || null, updated_at: now } },
    );
    return NextResponse.json({ updated: true });
  }

  if (action === "support-request") {
    if (typeof payload.message !== "string" || payload.message.trim().length < 1 || payload.message.length > 5000) {
      return jsonError("A support message of 1 to 5000 characters is required.", 400);
    }
    await auth.db.collection("support_tickets").insertOne({
      id: randomUUID(),
      student_id: auth.user.id,
      subject: "Transport support request",
      message: payload.message.trim(),
      status: "open",
      created_at: now,
      updated_at: now,
    });
    return NextResponse.json({ created: true }, { status: 201 });
  }

  if (action === "mark-notification-read") {
    if (typeof payload.id !== "string") return jsonError("A notification ID is required.", 400);
    const result = await auth.db.collection("notifications").updateOne(
      { id: payload.id, user_id: auth.user.id },
      { $set: { read_at: now } },
    );
    if (!result.matchedCount) return jsonError("Notification not found.", 404);
    return NextResponse.json({ updated: true });
  }

  return jsonError("Unsupported student action.", 400);
}
