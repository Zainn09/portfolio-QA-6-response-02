import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { requireAdmin } from "@/lib/devtools/session";
import { isDbConnectionError } from "@/lib/devtools/pg-meta";
import { recordApiRequest, recordError } from "@/lib/devtools/log";

export const dynamic = "force-dynamic";

/**
 * Overview metrics. Every number is measured live from the database or this
 * server process — nothing is invented. When the database is unreachable the
 * response carries dbStatus:"down" so the UI can show an honest state.
 */
export async function GET(req: NextRequest) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const dbStarted = Date.now();
  try {
    await db.execute(sql`select 1`);
  } catch {
    recordApiRequest("GET", "/api/devtools/overview", 503, Date.now() - started, "db unreachable");
    return NextResponse.json({ dbStatus: "down", dbLatencyMs: Date.now() - dbStarted });
  }
  const dbLatencyMs = Date.now() - dbStarted;

  try {
    const countsRes = await db.execute(sql`
      select
        (select count(*)::int from audit_requests)::int as audit_total,
        (select count(*)::int from audit_requests where coalesce(status, 'new') = 'new')::int as audit_new,
        (select count(*)::int from contact_messages)::int as contact_total,
        (select count(*)::int from contact_messages where coalesce(status, 'new') = 'new')::int as contact_new,
        (select count(*)::int from projects)::int as projects_total,
        (select count(*)::int from projects where status = 'published')::int as projects_published,
        (select count(*)::int from blog_posts)::int as blog_total
    `);

    const activityRes = await db.execute(sql`
      select actor_email, action, target, created_at from admin_activity order by created_at desc limit 8
    `);

    const auditTrendRes = await db.execute(sql`
      select date_trunc('day', created_at)::date as day, count(*)::int as n
      from audit_requests
      where created_at >= now() - interval '30 days'
      group by 1 order by 1
    `);
    const contactTrendRes = await db.execute(sql`
      select date_trunc('day', created_at)::date as day, count(*)::int as n
      from contact_messages
      where created_at >= now() - interval '30 days'
      group by 1 order by 1
    `);

    recordApiRequest("GET", "/api/devtools/overview", 200, Date.now() - started);
    return NextResponse.json({
      dbStatus: "up",
      dbLatencyMs,
      counts: countsRes.rows[0] as Record<string, number>,
      recentActivity: activityRes.rows as unknown[],
      auditTrend: auditTrendRes.rows as unknown[],
      contactTrend: contactTrendRes.rows as unknown[],
      server: {
        nodeVersion: process.version,
        env: process.env.NODE_ENV,
        uptimeSeconds: Math.round(process.uptime()),
      },
    });
  } catch (error) {
    if (isDbConnectionError(error)) {
      recordApiRequest("GET", "/api/devtools/overview", 503, Date.now() - started, "db unreachable");
      return NextResponse.json({ dbStatus: "down", dbLatencyMs: Date.now() - dbStarted });
    }
    recordError("devtools/overview", error instanceof Error ? error.message : "Unknown error", undefined, { op: "overview" });
    recordApiRequest("GET", "/api/devtools/overview", 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
