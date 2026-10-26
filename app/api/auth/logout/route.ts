import { NextRequest, NextResponse } from "next/server";
import { hasValidOrigin, jsonError } from "@/lib/api";
import { clearSessionCookie } from "@/lib/session";

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) return jsonError("Invalid request origin.", 403);
  return clearSessionCookie(NextResponse.json({ signedOut: true }));
}
