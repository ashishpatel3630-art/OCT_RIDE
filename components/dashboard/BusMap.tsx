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

export type MapBus = {
  id?: string;
  label?: string;
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

type PositionedMapBus = MapBus & {
  latitude: number;
  longitude: number;
};

type BusMapProps = {
  bus: PositionedMapBus;
  routePoints: RoutePoint[];
};

type FleetMapProps = {
  buses: MapBus[];
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

export function FleetMap({ buses }: FleetMapProps) {
  const positionedBuses = buses.filter(
    (bus): bus is PositionedMapBus =>
      typeof bus.latitude === "number" &&
      Number.isFinite(bus.latitude) &&
      typeof bus.longitude === "number" &&
      Number.isFinite(bus.longitude),
  );

  const positions = useMemo<LatLngExpression[]>(
    () =>
      positionedBuses.map(
        (bus) => [bus.latitude, bus.longitude] as LatLngExpression,
      ),
    [positionedBuses],
  );

  if (positionedBuses.length === 0) {
    return (
      <div className="grid h-[30rem] place-items-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
        <div>
          <p className="font-semibold">No live bus positions</p>
          <p className="mt-2 text-sm text-neutral-500">
            Bus markers will appear when valid GPS coordinates are available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
      <MapContainer
        center={positions[0]}
        zoom={11}
        scrollWheelZoom
        className="h-[30rem] w-full"
        zoomControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MapViewport points={positions} />

        {positionedBuses.map((bus, index) => (
          <CircleMarker
            key={bus.id ?? `${bus.label ?? "bus"}-${index}`}
            center={[bus.latitude, bus.longitude]}
            radius={9}
            pathOptions={{
              color: "#ffffff",
              weight: 3,
              fillColor: bus.status === "LIVE" ? "#15803d" : "#737373",
              fillOpacity: 1,
            }}
          >
            <Popup>
              <div className="min-w-36 text-sm">
                <p className="font-semibold">{bus.label ?? "Bus"}</p>
                <p className="mt-1 text-neutral-600">
                  Status: {bus.status}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  Updated {new Date(bus.recordedAt).toLocaleTimeString()}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
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