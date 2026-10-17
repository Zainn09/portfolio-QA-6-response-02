import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db, pool } from "@/db";
import { requireAdmin } from "@/lib/devtools/session";
import { isDbConnectionError, isMissingTableError, SCHEMA_HINT } from "@/lib/devtools/pg-meta";
import { recordApiRequest, recordError } from "@/lib/devtools/log";

export const dynamic = "force-dynamic";

const SENSITIVE_ENV_PREFIXES = ["PASSWORD", "SECRET", "TOKEN", "KEY", "CREDENTIAL"];

/**
 * System health: measured, not assumed.
 * - DATABASE_URL presence + a live `select 1` with measured latency.
 * - Environment name and Node version.
 * - Build/deployment identifiers when the hosting platform provides them.
 * - A list of which configured env vars exist (names only, values are never
 *   returned; anything that looks credential-shaped is not even listed by
 *   name).
 */
export async function GET(req: NextRequest) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    return await handle(req, started);
  } catch (error) {
    if (isDbConnectionError(error)) return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    if (isMissingTableError(error)) return NextResponse.json({ error: SCHEMA_HINT }, { status: 503 });
    recordError("devtools/health", error instanceof Error ? error.message : "Unknown error", error instanceof Error ? error.stack : undefined);
    recordApiRequest("GET", "/api/devtools/health", 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handle(req: NextRequest, started: number): Promise<NextResponse> {
  let dbStatus: "up" | "down" = "down";
  let dbLatencyMs: number | null = null;
  let dbError: string | null = null;
  if (process.env.DATABASE_URL) {
    const dbStarted = Date.now();
    try {
      await db.execute(sql`select 1`);
      dbStatus = "up";
      dbLatencyMs = Date.now() - dbStarted;
    } catch (error) {
      dbError = isDbConnectionError(error) ? "Connection failed (check DATABASE_URL and network)" : "Query failed";
    }
  }

  const envNames = Object.keys(process.env)
    .filter((name) => !SENSITIVE_ENV_PREFIXES.some((p) => name.includes(p)))
    .sort();

  const poolStats = pool.totalCount;

  recordApiRequest("GET", "/api/devtools/health", 200, Date.now() - started);
  return NextResponse.json({
    app: {
      status: "up",
      nodeVersion: process.version,
      env: process.env.NODE_ENV,
      uptimeSeconds: Math.round(process.uptime()),
      buildId: process.env.NEXT_BUILD_ID ?? null,
      gitCommit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      gitBranch: process.env.VERCEL_GIT_BRANCH ?? null,
      vercelUrl: process.env.VERCEL_URL ?? null,
    },
    database: {
      configured: Boolean(process.env.DATABASE_URL),
      status: process.env.DATABASE_URL ? dbStatus : "not-configured",
      latencyMs: dbLatencyMs,
      error: dbError,
      poolTotalConnections: poolStats,
    },
    envVarsPresent: envNames,
    security: {
      adminSessionSecretConfigured: Boolean(process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 16),
    },
  });
}
