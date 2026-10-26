import { NextRequest, NextResponse } from "next/server";
import { requireStudentApi } from "@/lib/api";

type TripDoc = {
  id: string;
  bus_id: string;
  status: "active" | "ended";
  started_at: Date;
  ended_at: Date | null;
};
type LocationDoc = {
  id: number;
  bus_id: string;
  trip_id: string;
  latitude: number;
  longitude: number;
  recorded_at: Date;
  received_at: Date;
};

export async function GET(request: NextRequest) {
  const auth = await requireStudentApi();
  if ("response" in auth) return auth.response;
  const busId = request.nextUrl.searchParams.get("busId");
  if (!busId) return NextResponse.json({ error: "Bus ID is required." }, { status: 400 });

  const allocation = await auth.db.collection("allocations").findOne({
    student_id: auth.user.id,
    bus_id: busId,
    active: true,
  });
  if (!allocation) return NextResponse.json({ error: "Tracking access denied." }, { status: 403 });

  const trip = await auth.db.collection<TripDoc>("trips")
    .find({ bus_id: busId }).sort({ started_at: -1 }).limit(1).next();
  if (!trip) return NextResponse.json({ mapBus: null });

  const bus = await auth.db.collection<{ id: string; bus_number: string }>("buses")
    .findOne({ id: busId });
  const label = bus?.bus_number ?? "Assigned bus";
  if (trip.status === "ended") {
    return NextResponse.json({
      mapBus: {
        id: busId,
        label,
        latitude: null,
        longitude: null,
        recordedAt: (trip.ended_at ?? trip.started_at).toISOString(),
        status: "TRIP ENDED",
      },
    });
  }

  const location = await auth.db.collection<LocationDoc>("bus_locations")
    .find({ trip_id: trip.id }).sort({ recorded_at: -1 }).limit(1).next();
  if (!location) {
    return NextResponse.json({
      mapBus: {
        id: busId,
        label,
        latitude: null,
        longitude: null,
        recordedAt: trip.started_at.toISOString(),
        status: "OFFLINE",
      },
    });
  }

  const age = Date.now() - location.recorded_at.getTime();
  return NextResponse.json({
    mapBus: {
      id: busId,
      label,
      latitude: location.latitude,
      longitude: location.longitude,
      recordedAt: location.recorded_at.toISOString(),
      status: age >= 0 && age <= 90_000 ? "LIVE" : "STALE",
    },
  });
}
