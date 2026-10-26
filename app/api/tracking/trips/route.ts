import { createHash, randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
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
  const { deviceId, action, tripId } = body as Record<string, unknown>;
  if (typeof deviceId !== "string" || !/^[0-9a-f-]{36}$/i.test(deviceId)) return jsonError("Invalid device ID.", 400);
  if (action !== "start" && action !== "end") return jsonError("Action must be start or end.", 400);
  if (action === "end" && (typeof tripId !== "string" || !/^[0-9a-f-]{36}$/i.test(tripId))) return jsonError("Trip ID is required to end a trip.", 400);

  const db = await getDatabase();
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const credential = await db.collection<{ device_id: string; token_hash: string }>("tracking_credentials")
    .findOne({ device_id: deviceId, token_hash: tokenHash });
  const device = credential
    ? await db.collection<{ id: string; bus_id: string; active: boolean }>("tracking_devices")
      .findOne({ id: deviceId, active: true })
    : null;
  if (!device) return jsonError("Tracking device is unauthorized.", 403);
  const bus = await db.collection<{ id: string; active: boolean }>("buses")
    .findOne({ id: device.bus_id, active: true });
  if (!bus) return jsonError("Tracking device bus is inactive or unavailable.", 403);

  if (action === "start") {
    const now = new Date();
    const newTripId = randomUUID();
    try {
      await db.collection("trips").insertOne({
        id: newTripId,
        bus_id: device.bus_id,
        status: "active",
        started_at: now,
        ended_at: null,
      });
    } catch (cause) {
      if (cause && typeof cause === "object" && "code" in cause && cause.code === 11000) {
        return jsonError("This bus already has an active trip.", 409);
      }
      throw cause;
    }
    await db.collection("tracking_devices").updateOne(
      { id: deviceId },
      { $set: { last_seen_at: now } },
    );
    return NextResponse.json({ tripId: newTripId });
  }

  const endedAt = new Date();
  const result = await db.collection("trips").updateOne(
    { id: tripId, bus_id: device.bus_id, status: "active" },
    { $set: { status: "ended", ended_at: endedAt } },
  );
  if (!result.matchedCount) return jsonError("Tracking device or active trip is unauthorized.", 403);
  await db.collection("tracking_devices").updateOne(
    { id: deviceId },
    { $set: { last_seen_at: endedAt } },
  );
  return NextResponse.json({ ended: true });
}
