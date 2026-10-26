"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Route = {
  id: string;
  name: string;
  origin: string;
  destination: string;
  route_stops: { stop_order: number; scheduled_time: string | null; stops: { id: string; name: string; address: string | null } | null }[];
  buses: { id: string; bus_number: string; registration_number: string; active: boolean }[];
};

export default function Find() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/routes", { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Transport data is unavailable.");
        setRoutes(result.routes as Route[]);
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name !== "AbortError") setError(cause.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return routes;
    return routes.filter((route) => [
      route.name,
      route.origin,
      route.destination,
      ...route.route_stops.flatMap((item) => [item.stops?.name ?? "", item.stops?.address ?? ""]),
      ...route.buses.flatMap((bus) => [bus.bus_number, bus.registration_number]),
    ].some((value) => value.toLowerCase().includes(needle)));
  }, [query, routes]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearched(true);
  }

  return (
    <main className="min-h-screen bg-[#F6F8FC] px-4 pb-16 pt-32 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">OGI RIDE · Transport finder</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <div>
            <h1 className="text-5xl font-bold leading-tight tracking-[-.055em] sm:text-6xl">Find a route<br /><span className="text-slate-400">that gets you there.</span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">Search published college routes by destination, pickup stop or bus registration. Live locations are visible only to students allocated to that bus.</p>
          </div>
          <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label htmlFor="route-query" className="text-sm font-semibold">Search routes, stops or buses</label>
            <div className="mt-2 flex gap-2">
              <input id="route-query" type="search" className="min-h-12 min-w-0 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" placeholder="e.g. Bhopal Railway Station" value={query} onChange={(event) => setQuery(event.target.value)} />
              <button className="min-h-12 rounded-xl bg-[#3157D5] px-5 text-sm font-semibold text-white hover:bg-blue-800">Search</button>
            </div>
            <p className="mt-3 text-xs text-slate-500">Routes, stops, capacity and buses are loaded from college transport records.</p>
          </form>
        </div>

        <section className="mt-10" aria-live="polite">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div><h2 className="text-xl font-bold">{searched ? "Search results" : "Available routes"}</h2><p className="mt-1 text-sm text-slate-500">{loading ? "Loading transport data…" : `${results.length} ${results.length === 1 ? "route" : "routes"}`}</p></div>
            <Link href="/login" className="text-sm font-semibold text-blue-700 hover:underline">Student sign in</Link>
          </div>
          {error && <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"><strong>Transport data unavailable.</strong> {error} An administrator must configure database access and publish routes.</div>}
          {!loading && !error && results.length === 0 && <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm text-slate-500">{routes.length ? "No routes match that search. Try a different stop, route or bus number." : "No active routes have been published yet."}</p>}
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((route) => (
              <article key={route.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div><h3 className="text-lg font-bold">{route.name}</h3><p className="mt-1 text-sm text-slate-600">{route.origin} <span aria-hidden="true">→</span> {route.destination}</p></div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">{route.buses.filter((bus) => bus.active).length} buses</span>
                </div>
                <ol className="mt-5 space-y-2 border-l border-blue-200 pl-4">
                  {route.route_stops.slice().sort((a, b) => a.stop_order - b.stop_order).map((item) => (
                    <li key={item.stops?.id} className="relative text-sm text-slate-700">
                      <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-[#3157D5]" />
                      <span className="font-medium">{item.stops?.name}</span>
                      {item.scheduled_time && <span className="ml-2 text-xs text-slate-500">{item.scheduled_time.slice(0, 5)}</span>}
                      {item.stops?.address && <span className="block text-xs text-slate-500">{item.stops.address}</span>}
                    </li>
                  ))}
                </ol>
                <div className="mt-5 flex flex-wrap gap-2">
                  {route.buses.filter((bus) => bus.active).map((bus) => <span key={bus.id} className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">{bus.bus_number} · {bus.registration_number}</span>)}
                </div>
                <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">A student allocation is required to request a seat or view live tracking.</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
