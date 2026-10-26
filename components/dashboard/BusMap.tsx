
"use client";

import { useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import BusFinder from "./BusFinder";
export type MapBus = {
  status: "LIVE" | "STALE" | "OFFLINE" | "TRIP ENDED" | string;
  latitude: number | null;
  longitude: number | null;
  recordedAt: string;
};

export type RoutePoint = {
  name: string;
  latitude: number;
  longitude: number;
};

type BusMapProps = {
  bus: MapBus & { latitude: number; longitude: number };
  routePoints: RoutePoint[];
};

export function BusMap({ bus, routePoints }: BusMapProps) {
  const busPosition: LatLngExpression = [
    bus.latitude,
    bus.longitude,
  ];

  const routePositions = useMemo<LatLngExpression[]>(
    () =>
      routePoints.map(
        (point) => [point.latitude, point.longitude] as LatLngExpression,
      ),
    [routePoints],
  );

  const boundsPoints = useMemo<LatLngExpression[]>(
    () => [...routePositions, busPosition],
    [routePositions, busPosition],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
      <MapContainer
        center={busPosition}
        zoom={13}
        scrollWheelZoom
        className="h-[360px] w-full sm:h-[440px]"
        zoomControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MapViewport points={boundsPoints} />

        {routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            pathOptions={{
              color: "#171717",
              weight: 4,
              opacity: 0.8,
            }}
          />
        )}

        {routePoints.map((point, index) => (
          <CircleMarker
            key={`${point.name}-${index}`}
            center={[point.latitude, point.longitude]}
            radius={6}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: "#737373",
              fillOpacity: 1,
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{point.name}</p>
                <p className="mt-1 text-neutral-500">Route stop</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        <CircleMarker
          center={busPosition}
          radius={10}
          pathOptions={{
            color: "#ffffff",
            weight: 3,
            fillColor: "#171717",
            fillOpacity: 1,
          }}
        >
          <Popup>
            <div className="min-w-36 text-sm">
              <p className="font-semibold">Your bus</p>
              <p className="mt-1 text-neutral-600">
                Status: {bus.status}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Updated {new Date(bus.recordedAt).toLocaleTimeString()}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}

function MapViewport({ points }: { points: LatLngExpression[] }) {
  const map = useMap();

  useMemo(() => {
    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView(points[0], 14, { animate: true });
      return;
    }

    map.fitBounds(points as [number, number][], {
      padding: [36, 36],
      maxZoom: 15,
      animate: true,
    });
  }, [map, points]);

  return null;
}
