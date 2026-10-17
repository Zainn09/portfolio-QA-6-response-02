import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { requireAdmin } from "@/lib/devtools/session";
import { isDbConnectionError, isMissingTableError, SCHEMA_HINT } from "@/lib/devtools/pg-meta";
import { recordApiRequest, recordError } from "@/lib/devtools/log";

export const dynamic = "force-dynamic";

/** Administrative activity trail (logins, edits, deletions, queries, exports). */
export async function GET(req: NextRequest) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const params = req.nextUrl.searchParams;
  const page = Math.max(1, Math.min(10_000, Number(params.get("page") ?? "1") || 1));
  const pageSize = Math.max(1, Math.min(100, Number(params.get("pageSize") ?? "25") || 25));
  const days = Math.max(1, Math.min(365, Number(params.get("days") ?? "30") || 30));

  try {
    const values: unknown[] = [];
    values.push(new Date(Date.now() - days * 86_400_000));
    const where = `where created_at >= $${values.length}`;

    values.push(pageSize, (page - 1) * pageSize);
    const [countRes, dataRes] = await Promise.all([
      db.execute(sql.raw(`select count(*)::int as n from admin_activity ${where}`)),
      db.execute(
        sql.raw(
          `select id, actor_email, action, target, detail, ip, created_at from admin_activity ${where} order by created_at desc limit $${values.length - 1} offset $${values.length}`,
        ),
      ),
    ]);

    recordApiRequest("GET", "/api/devtools/activity", 200, Date.now() - started);
    return NextResponse.json({
      entries: dataRes.rows as unknown[],
      total: Number((countRes.rows as unknown as { n: number }[])[0]?.n ?? 0),
      page,
      pageSize,
    });
  } catch (error) {
    if (isDbConnectionError(error)) return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    if (isMissingTableError(error)) return NextResponse.json({ error: SCHEMA_HINT }, { status: 503 });
    recordError("devtools/activity", error instanceof Error ? error.message : "Unknown error", undefined, { op: "list" });
    recordApiRequest("GET", "/api/devtools/activity", 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
