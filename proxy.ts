import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get("ogi_ride_session")?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret || secret.length < 32) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return typeof payload.sub === "string";
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  if (await hasValidSession(request)) return NextResponse.next({ request });

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
