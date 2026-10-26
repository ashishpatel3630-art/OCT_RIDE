import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getDatabase } from "@/lib/postgres";
import { jsonError } from "@/lib/api";

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return jsonError("GPS ingestion is not configured.", 503);
  }
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token || token.length < 40 || token.length > 256) return jsonError("Tracking device authorization required.", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON.", 400);
  }
  if (!body || typeof body !== "object") return jsonError("Invalid request payload.", 400);
  const { deviceId, tripId, latitude, longitude, accuracyM, recordedAt } = body as Record<string, unknown>;
  if (typeof deviceId !== "string" || !/^[0-9a-f-]{36}$/i.test(deviceId) ||
      typeof tripId !== "string" || !/^[0-9a-f-]{36}$/i.test(tripId) ||
      typeof latitude !== "number" || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
      typeof longitude !== "number" || !Number.isFinite(longitude) || longitude < -180 || longitude > 180 ||
      (accuracyM !== undefined && (typeof accuracyM !== "number" || !Number.isFinite(accuracyM) || accuracyM < 0 || accuracyM > 10000)) ||
      typeof recordedAt !== "string" || !Number.isFinite(Date.parse(recordedAt))) {
    return jsonError("Invalid GPS update; valid coordinates, trip, device and timestamp are required.", 400);
  }

  const db = await getDatabase();
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const recorded = new Date(recordedAt);
  const now = new Date();
  if (recorded.getTime() < now.getTime() - 15 * 60_000 || recorded.getTime() > now.getTime() + 2 * 60_000) {
    return jsonError("GPS update must be no older than 15 minutes or more than 2 minutes in the future.", 400);
  }
  const credential = await db.collection("tracking_credentials")
    .findOne({ device_id: deviceId, token_hash: tokenHash });
  const device = credential
    ? await db.collection<{ id: string; bus_id: string; active: boolean }>("tracking_devices")
      .findOne({ id: deviceId, active: true })
    : null;
  if (!device) return jsonError("Tracking device is unauthorized.", 403);
  const trip = await db.collection<{ id: string; bus_id: string; status: string }>("trips")
    .findOne({ id: tripId, bus_id: device.bus_id, status: "active" });
  if (!trip) return jsonError("Tracking device or active trip is unauthorized.", 403);

  const locationId = randomUUID();
  try {
    await db.collection("bus_locations").insertOne({
      id: locationId,
      bus_id: device.bus_id,
      trip_id: tripId,
      device_id: deviceId,
      latitude,
      longitude,
      accuracy_m: typeof accuracyM === "number" ? accuracyM : null,
      recorded_at: recorded,
      received_at: now,
    });
  } catch (cause) {
    if (cause && typeof cause === "object" && "code" in cause && cause.code === 11000) {
      return jsonError("A GPS update from this device already exists for that timestamp.", 409);
    }
    throw cause;
  }
  await db.collection("tracking_devices").updateOne(
    { id: deviceId },
    { $set: { last_seen_at: now } },
  );
  return NextResponse.json({ locationId }, { status: 201 });
}
