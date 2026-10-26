import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export const sessionCookieName = "ogi_ride_session";
const sessionDurationSeconds = 60 * 60 * 24 * 7;

function sessionSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionTokenForVersion(userId: string, sessionVersion: number) {
  return new SignJWT({ sessionVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${sessionDurationSeconds}s`)
    .sign(sessionSecret());
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionDurationSeconds,
  });
  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, sessionSecret(), {
      algorithms: ["HS256"],
    });
    const sessionVersion = payload.sessionVersion;
    return typeof payload.sub === "string" &&
      (sessionVersion === undefined || typeof sessionVersion === "number")
      ? { userId: payload.sub, sessionVersion: sessionVersion ?? 0 }
      : null;
  } catch {
    return null;
  }
}

export async function getSessionIdentity() {
  const token = (await cookies()).get(sessionCookieName)?.value;
  return token ? verifySessionToken(token) : null;
}
