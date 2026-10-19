import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/db";
import { getAdminSession, requireAdmin } from "@/lib/devtools/session";
import { isDbConnectionError } from "@/lib/devtools/pg-meta";
import { getIp, recordActivity, recordApiRequest, recordError } from "@/lib/devtools/log";

export const dynamic = "force-dynamic";

/**
 * Apply the DevTools schema additions (drizzle/0001_devtools.sql).
 *
 * The statements below mirror the idempotent script that ships in the repo
 * (drizzle/0001_devtools.sql) — keep them in sync. Every statement uses
 * IF NOT EXISTS, so it is safe to run repeatedly. Kept as a constant (not
 * read from disk) because Vercel serverless functions do not expose the repo
 * root at runtime.
 */
const MIGRATION_STATEMENTS: string[] = [
  `create table if not exists admin_activity (
    id serial primary key,
    actor_email varchar(255),
    action varchar(100) not null,
    target varchar(255),
    detail jsonb,
    ip varchar(64),
    created_at timestamp default now()
  )`,
  `create index if not exists admin_activity_created_at_idx on admin_activity (created_at desc)`,
  `create index if not exists admin_activity_action_idx on admin_activity (action)`,
  `create table if not exists api_requests (
    id serial primary key,
    method varchar(10) not null,
    path varchar(255) not null,
    status integer not null,
    duration_ms integer,
    error text,
    created_at timestamp default now()
  )`,
  `create index if not exists api_requests_created_at_idx on api_requests (created_at desc)`,
  `create index if not exists api_requests_path_idx on api_requests (path)`,
  `create table if not exists app_errors (
    id serial primary key,
    source varchar(100) not null,
    severity varchar(20) default 'error',
    message text not null,
    stack text,
    context jsonb,
    created_at timestamp default now()
  )`,
  `create index if not exists app_errors_created_at_idx on app_errors (created_at desc)`,
  `alter table audit_requests add column if not exists notes text`,
  `alter table contact_messages add column if not exists status varchar(50) default 'new'`,
  `alter table contact_messages add column if not exists notes text`,
];

/** Apply the idempotent DevTools schema additions. Admin sign-in required. */
export async function POST(req: NextRequest) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const session = await getAdminSession(req);
  const email = session?.email ?? null;
  const ip = getIp(req);

  let client;
  try {
    client = await pool.connect();
  } catch (err) {
    if (isDbConnectionError(err)) {
      recordApiRequest("POST", "/api/devtools/migrate", 503, Date.now() - started, "db unreachable");
      return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    }
    recordApiRequest("POST", "/api/devtools/migrate", 500, Date.now() - started, "connect failed");
    return NextResponse.json({ error: "Could not connect to the database." }, { status: 500 });
  }

  try {
    await client.query("begin");
    for (const statement of MIGRATION_STATEMENTS) {
      await client.query(statement);
    }
    await client.query("commit");
    recordActivity(email, "migrate.apply", "devtools-schema", { statements: MIGRATION_STATEMENTS.length, ip }, ip ?? undefined);
    recordApiRequest("POST", "/api/devtools/migrate", 200, Date.now() - started);
    return NextResponse.json({ success: true, applied: MIGRATION_STATEMENTS.length });
  } catch (error) {
    await client.query("rollback").catch(() => undefined);
    recordError("devtools/migrate", error instanceof Error ? error.message : "Migration failed", undefined, { ip });
    recordApiRequest("POST", "/api/devtools/migrate", 500, Date.now() - started, "migration failed");
    return NextResponse.json(
      { error: `Migration failed: ${error instanceof Error ? error.message : "unknown error"}` },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
