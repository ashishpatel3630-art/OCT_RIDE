import { connection, NextResponse } from "next/server";
import { getDatabase, isDatabaseConfigured } from "@/lib/postgres";
import { loadRoutes } from "@/lib/routes";

export async function GET() {
  await connection();
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Transport data is not configured." }, { status: 503 });
  }
  try {
    const routes = await loadRoutes(await getDatabase());
    return NextResponse.json({ routes });
  } catch {
    return NextResponse.json({ error: "Could not load routes." }, { status: 503 });
  }
}
