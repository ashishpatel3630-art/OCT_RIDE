import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { hasValidOrigin, jsonError, requireStudentApi } from "@/lib/api";
import { getDatabaseClient } from "@/lib/postgres";

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
  const { routeId, stopId, kind, note } = body as Record<string, unknown>;
  if (
    typeof routeId !== "string" ||
    typeof stopId !== "string" ||
    !["new_allocation", "renewal", "route_change"].includes(String(kind)) ||
    (note !== undefined && typeof note !== "string")
  ) return jsonError("Route, stop and request type are required.", 400);

  if (typeof note === "string" && note.length > 1000) {
    return jsonError("Request note must be 1000 characters or fewer.", 400);
  }
  const session = await (await getDatabaseClient()).startSession();
  const requestId = randomUUID();
  try {
    await session.withTransaction(async () => {
      const { db, user, profile } = auth;
      if (!profile.eligibility_verified) {
        throw new Error("Student eligibility must be verified before requesting an allocation.");
      }
      const year = profile.academic_year
        ? await db.collection<{ enrollment_open: boolean }>("academic_years")
          .findOne({ year: profile.academic_year }, { session })
        : null;
      if (!year?.enrollment_open) throw new Error("Allocation requests are closed for your academic year.");
      const routeStop = await db.collection("route_stops").findOne(
        { route_id: routeId, stop_id: stopId },
        { session },
      );
      const route = await db.collection("routes").findOne(
        { id: routeId, active: true },
        { session },
      );
      if (!route || !routeStop) throw new Error("Selected route and stop are not available.");
      const activeAllocation = await db.collection("allocations").findOne(
        { student_id: user.id, active: true },
        { session },
      );
      if (activeAllocation && kind === "new_allocation") {
        throw new Error("An active allocation already exists.");
      }
      if (!activeAllocation && (kind === "renewal" || kind === "route_change")) {
        throw new Error("A current allocation is required for renewal or route change.");
      }
      await db.collection("allocation_requests").insertOne({
        id: requestId,
        student_id: user.id,
        kind,
        route_id: routeId,
        stop_id: stopId,
        status: "pending",
        note: typeof note === "string" ? note.trim() || null : null,
        reviewed_by: null,
        reviewed_at: null,
        created_at: new Date(),
      }, { session });
    });
  } catch (cause) {
    return jsonError(cause instanceof Error ? cause.message : "Could not submit the allocation request.", 400);
  } finally {
    await session.endSession();
  }
  return NextResponse.json({ requestId }, { status: 201 });
}
