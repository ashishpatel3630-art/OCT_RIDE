import { connection, NextRequest, NextResponse } from "next/server";
import { jsonError, requireAdminApi } from "@/lib/api";

function csvField(value: unknown) {
  let stringValue = value === null || value === undefined ? "" : String(value);
  if (/^[\u0000-\u0020]*[=+\-@]/.test(stringValue)) stringValue = `'${stringValue}`;
  return `"${stringValue.replaceAll('"', '""')}"`;
}

export async function GET(request: NextRequest) {
  await connection();
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  const type = request.nextUrl.searchParams.get("type");
  if (type !== "allocations" && type !== "requests" && type !== "trips" && type !== "audit") {
    return jsonError("Report type must be allocations, requests, trips or audit.", 400);
  }
  const collection = type === "allocations"
    ? "allocations"
    : type === "requests"
      ? "allocation_requests"
      : type === "trips"
        ? "trips"
        : "audit_logs";
  const sortField = type === "trips" ? "started_at" : "created_at";
  const rows = await auth.db.collection(collection)
    .find()
    .sort({ [sortField]: -1 })
    .limit(10_000)
    .toArray() as Record<string, unknown>[];
  const headers = rows.length ? Object.keys(rows[0]) : [];
  const csv = [headers.map(csvField).join(","), ...rows.map((row) => headers.map((key) => csvField(row[key])).join(","))].join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ogi-ride-${type}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
