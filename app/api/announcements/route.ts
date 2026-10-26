import { connection, NextResponse } from "next/server";
import { getDatabase, isDatabaseConfigured } from "@/lib/postgres";

export async function GET() {
  await connection();
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "PostgreSQL is not configured." }, { status: 503 });
  }

  try {
    const announcements = await (await getDatabase())
      .collection<{ id: string; title: string; body: string; published: boolean; created_at: Date }>("announcements")
      .find({ published: true })
      .sort({ created_at: -1 })
      .limit(5)
      .toArray();
    return NextResponse.json({ announcements });
  } catch {
    return NextResponse.json({ error: "Could not load announcements." }, { status: 503 });
  }
}
