"use client";

import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";

export type MapPoint = { latitude: number; longitude: number; name?: string };
export type MapBus = {
  id: string;
  label: string;
  latitude: number | null;
  longitude: number | null;
  recordedAt: string;
  status: "LIVE" | "STALE" | "OFFLINE" | "TRIP ENDED";
};

const tileUrl = process.env.NEXT_PUBLIC_MAP_TILE_URL?.trim() || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tileAttribution = process.env.NEXT_PUBLIC_MAP_ATTRIBUTION?.trim() ||
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function FollowPoint({ point }: { point: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(point, Math.max(map.getZoom(), 13), { duration: 0.7 });
  }, [map, point]);
  return null;
}

export function BusMap({
  bus,
  routePoints = [],
}: {
  bus: MapBus & { latitude: number; longitude: number };
  routePoints?: MapPoint[];
}) {
  const center: [number, number] = [bus.latitude, bus.longitude];
  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom className="h-80 w-full rounded-2xl">
      <TileLayer
        attribution={tileAttribution}
        url={tileUrl}
      />
      <FollowPoint point={center} />
      {routePoints.length > 1 && (
        <Polyline positions={routePoints.map((point) => [point.latitude, point.longitude] as [number, number])} pathOptions={{ color: "#3157D5", weight: 4, opacity: 0.75 }} />
      )}
      <CircleMarker center={center} radius={10} pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#3157D5", fillOpacity: 1 }}>
        <Popup>
          <strong>{bus.label}</strong><br />
          {bus.status} · updated {new Date(bus.recordedAt).toLocaleTimeString()}
        </Popup>
      </CircleMarker>
      {routePoints.map((point, index) => (
        <CircleMarker key={`${point.latitude}:${point.longitude}:${index}`} center={[point.latitude, point.longitude]} radius={5} pathOptions={{ color: "#3157D5", fillColor: "#ffffff", fillOpacity: 1 }}>
          {point.name && <Popup>{point.name}</Popup>}
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export function FleetMap({ buses }: { buses: MapBus[] }) {
  const positions = buses.filter((bus): bus is MapBus & { latitude: number; longitude: number } =>
    (bus.status === "LIVE" || bus.status === "STALE") &&
    typeof bus.latitude === "number" && typeof bus.longitude === "number",
  );
  const first = positions[0];
  if (!first) return null;
  const center: [number, number] = [first.latitude, first.longitude];
  return (
    <MapContainer center={center} zoom={positions.length === 1 ? 13 : 10} scrollWheelZoom className="h-[30rem] w-full rounded-2xl">
      <TileLayer
        attribution={tileAttribution}
        url={tileUrl}
      />
      {positions.map((bus) => (
        <CircleMarker key={bus.id} center={[bus.latitude, bus.longitude]} radius={10} pathOptions={{ color: "#ffffff", weight: 3, fillColor: bus.status === "LIVE" ? "#16a34a" : "#f59e0b", fillOpacity: 1 }}>
          <Popup><strong>{bus.label}</strong><br />{bus.status}<br />Updated {new Date(bus.recordedAt).toLocaleString()}</Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
