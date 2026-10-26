import "server-only";
import type { SqlDatabase } from "@/lib/postgres";

type RouteDoc = {
  id: string;
  name: string;
  origin: string;
  destination: string;
  active: boolean;
};
type RouteStopDoc = {
  route_id: string;
  stop_id: string;
  stop_order: number;
  scheduled_time: string | null;
};
type StopDoc = {
  id: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
};
type BusDoc = {
  id: string;
  bus_number: string;
  registration_number: string;
  route_id: string | null;
  active: boolean;
};

export async function loadRoutes(db: SqlDatabase, activeOnly = true) {
  const routes = await db.collection<RouteDoc>("routes")
    .find(activeOnly ? { active: true } : {})
    .sort({ name: 1 })
    .toArray();
  const routeIds = routes.map((route) => route.id);
  if (!routeIds.length) return [];

  const [routeStops, buses] = await Promise.all([
    db.collection<RouteStopDoc>("route_stops").find({ route_id: { $in: routeIds } })
      .sort({ stop_order: 1 }).toArray(),
    db.collection<BusDoc>("buses").find({
      route_id: { $in: routeIds },
      ...(activeOnly ? { active: true } : {}),
    }).sort({ bus_number: 1 }).toArray(),
  ]);
  const stopIds = [...new Set(routeStops.map((routeStop) => routeStop.stop_id))];
  const stops = stopIds.length
    ? await db.collection<StopDoc>("stops").find({ id: { $in: stopIds } }).toArray()
    : [];
  const stopsById = new Map(stops.map((stop) => [stop.id, stop]));
  const routeStopsByRoute = new Map<string, typeof routeStops>();
  const busesByRoute = new Map<string, typeof buses>();

  for (const routeStop of routeStops) {
    const list = routeStopsByRoute.get(routeStop.route_id) ?? [];
    list.push(routeStop);
    routeStopsByRoute.set(routeStop.route_id, list);
  }
  for (const bus of buses) {
    if (!bus.route_id) continue;
    const list = busesByRoute.get(bus.route_id) ?? [];
    list.push(bus);
    busesByRoute.set(bus.route_id, list);
  }

  return routes.map((route) => ({
    ...route,
    route_stops: (routeStopsByRoute.get(route.id) ?? []).map((routeStop) => ({
      stop_order: routeStop.stop_order,
      scheduled_time: routeStop.scheduled_time,
      stops: stopsById.get(routeStop.stop_id) ?? null,
    })),
    buses: (busesByRoute.get(route.id) ?? []).map((bus) => ({
      id: bus.id,
      bus_number: bus.bus_number,
      registration_number: bus.registration_number,
      active: bus.active,
    })),
  }));
}
