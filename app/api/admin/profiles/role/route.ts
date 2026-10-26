import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { hasValidOrigin, jsonError, requireAdminApi } from "@/lib/api";

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
  const { userId, role } = body as Record<string, unknown>;
  if (typeof userId !== "string" || !/^[0-9a-f-]{36}$/i.test(userId) || !["student", "admin"].includes(String(role))) {
    return jsonError("A valid user ID and role are required.", 400);
  }
  const target = await auth.db.collection<{ role: "student" | "admin" }>("profiles")
    .findOne({ id: userId });
  if (!target) return jsonError("Profile not found.", 404);
  if (target.role === "admin" && role === "student" &&
      await auth.db.collection("profiles").countDocuments({ role: "admin" }) <= 1) {
    return jsonError("At least one administrator account must remain active.", 409);
  }
  await auth.db.collection("profiles").updateOne(
    { id: userId },
    { $set: { role, updated_at: new Date() } },
  );
  await auth.db.collection("audit_logs").insertOne({
    id: randomUUID(),
    actor_id: auth.user.id,
    action: "role_update",
    entity_type: "profile",
    entity_id: userId,
    details: { role },
    created_at: new Date(),
  });
  return NextResponse.json({ updated: true });
}
