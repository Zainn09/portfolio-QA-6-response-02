import "server-only";
import { getIronSession, sealData, unsealData } from "iron-session";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin-session";

export interface AdminSessionData {
  userId: number;
  email: string;
  name?: string;
  signedInAt?: string;
}

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Session security model
 * ----------------------
 * Sessions are sealed with iron-session (AES + HMAC), so the cookie can no
 * longer be forged by writing raw JSON — the previous implementation stored
 * the session as plain, unsigned JSON in the cookie.
 *
 * The signing secret comes from ADMIN_SESSION_SECRET.
 *  - Production + secret set   → sealed sessions, normal operation.
 *  - Production + no secret    → FAIL CLOSED: no session can ever verify, and
 *                               login returns 503 with setup instructions.
 *                               (A hardcoded fallback in production would be
 *                               a known secret and defeat the purpose.)
 *  - Development + no secret   → a dev-only fallback secret is used and a
 *                               warning is logged, so local work is possible.
 */
const DEV_FALLBACK_SECRET = "devtools-development-fallback-secret";

function sessionSecret(): { password: string; configured: boolean } {
  const env = process.env.ADMIN_SESSION_SECRET;
  if (env && env.length >= 16) return { password: env, configured: true };
  if (process.env.NODE_ENV === "production") {
    // Fail closed: login itself refuses to run without a configured secret,
    // so no real session can ever be sealed or unsealed with this value.
    return { password: "devtools-fail-closed-no-secret-configured", configured: false };
  }
  console.warn(
    "[devtools] ADMIN_SESSION_SECRET is not set. Using a development fallback secret — set a strong secret for any real deployment.",
  );
  return { password: DEV_FALLBACK_SECRET, configured: false };
}

export function sessionIsConfigured(): boolean {
  return sessionSecret().configured;
}

function toData(session: { userId?: unknown; email?: unknown; name?: unknown; signedInAt?: unknown } | null): AdminSessionData | null {
  if (!session || typeof session.userId !== "number" || typeof session.email !== "string") return null;
  const data: AdminSessionData = { userId: session.userId, email: session.email };
  if (typeof session.name === "string") data.name = session.name;
  if (typeof session.signedInAt === "string") data.signedInAt = session.signedInAt;
  return data;
}

/** Read the admin session from a route-handler request (or null). */
export async function getAdminSession(req: NextRequest): Promise<AdminSessionData | null> {
  const raw = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!raw) return null;
  try {
    const unsealed = await unsealData<AdminSessionData>(raw, { password: sessionSecret().password, ttl: SESSION_TTL_SECONDS });
    return toData(unsealed);
  } catch {
    return null; // unsealable (forged, expired, or wrong secret) → treated as anonymous
  }
}

/**
 * Authorization gate for /api/devtools/* routes.
 * Returns a 401/503 NextResponse when access must be denied, or null when the
 * request is authenticated and the handler may proceed.
 */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  if (!sessionIsConfigured()) {
    return NextResponse.json(
      {
        error: "Admin sessions are not configured on this deployment. Set the ADMIN_SESSION_SECRET environment variable and redeploy.",
      },
      { status: 503 },
    );
  }
  const session = await getAdminSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

/**
 * Seal a fresh session onto a NextResponse (used by the login route after
 * credentials are verified).
 */
export async function setAdminSession(res: NextResponse, data: AdminSessionData): Promise<void> {
  const sealed = await sealData({ ...data, signedInAt: new Date().toISOString() }, { password: sessionSecret().password, ttl: SESSION_TTL_SECONDS });
  res.cookies.set(ADMIN_COOKIE, sealed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
}

/** Destroy the session on a response (logout). */
export function clearAdminSession(res: NextResponse): void {
  res.cookies.delete(ADMIN_COOKIE);
}

/**
 * Read the admin session inside a server component (layout/page auth gate).
 * Returns null when unauthenticated — callers must redirect to login.
 */
export async function getAdminSessionForPage(): Promise<AdminSessionData | null> {
  const store = await cookies();
  const session = await getIronSession<AdminSessionData>(store, {
    password: sessionSecret().password,
    cookieName: ADMIN_COOKIE,
  });
  return toData(session as unknown as AdminSessionData | null);
}
