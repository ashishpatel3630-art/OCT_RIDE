import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { hasValidOrigin, jsonError, requireAdminApi } from "@/lib/api";
import { randomUUID } from "node:crypto";

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
  const { name, busId } = body as Record<string, unknown>;
  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100 ||
      typeof busId !== "string" || !/^[0-9a-f-]{36}$/i.test(busId)) {
    return jsonError("A device name and valid bus ID are required.", 400);
  }

  const bus = await auth.db.collection("buses").findOne({ id: busId });
  if (!bus) return jsonError("Bus not found.", 404);
  const deviceId = randomUUID();
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  const device = {
    id: deviceId,
    name: name.trim(),
    bus_id: busId,
    active: true,
    last_seen_at: null,
    created_at: now,
  };
  await auth.db.collection("tracking_devices").insertOne(device);
  try {
    await auth.db.collection("tracking_credentials").insertOne({
      device_id: deviceId,
      token_hash: createHash("sha256").update(token).digest("hex"),
    });
  } catch (cause) {
    const cleanup = await auth.db.collection("tracking_devices").deleteOne({ id: deviceId });
    if (!cleanup.deletedCount) {
      return jsonError("Credential creation failed and device cleanup needs administrator attention.", 500);
    }
    if (cause && typeof cause === "object" && "code" in cause && cause.code === 11000) {
      return jsonError("A tracking credential already exists for this device.", 409);
    }
    return jsonError("Could not securely register device credentials.", 500);
  }
  await auth.db.collection("audit_logs").insertOne({
    id: randomUUID(),
    actor_id: auth.user.id,
    action: "create",
    entity_type: "tracking_device",
    entity_id: deviceId,
    details: { bus_id: busId },
    created_at: now,
  });
  return NextResponse.json({ device, token }, { status: 201 });
}
