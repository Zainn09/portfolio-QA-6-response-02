import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { requireAdmin } from "@/lib/devtools/session";
import { isDbConnectionError } from "@/lib/devtools/pg-meta";
import { recordApiRequest, recordError } from "@/lib/devtools/log";

export const dynamic = "force-dynamic";

/** Recent captured application errors (see src/lib/devtools/log.ts). */
export async function GET(req: NextRequest) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const params = req.nextUrl.searchParams;
  const page = Math.max(1, Math.min(10_000, Number(params.get("page") ?? "1") || 1));
  const pageSize = Math.max(1, Math.min(100, Number(params.get("pageSize") ?? "25") || 25));
  const days = Math.max(1, Math.min(90, Number(params.get("days") ?? "30") || 30));
  const severity = params.get("severity") === "warn" || params.get("severity") === "error" ? params.get("severity") : "";

  try {
    const sqlParts: string[] = [];
    const values: unknown[] = [];
    values.push(new Date(Date.now() - days * 86_400_000));
    sqlParts.push(`created_at >= $${values.length}`);
    if (severity) {
      values.push(severity);
      sqlParts.push(`severity = $${values.length}`);
    }
    const where = sqlParts.join(" and ");

    values.push(pageSize, (page - 1) * pageSize);
    const [countRes, dataRes] = await Promise.all([
      db.execute(sql.raw(`select count(*)::int as n from app_errors where ${where}`)),
      db.execute(
        sql.raw(`select id, source, severity, message, stack, context, created_at from app_errors where ${where} order by created_at desc limit $${values.length - 1} offset $${values.length}`),
      ),
    ]);

    recordApiRequest("GET", "/api/devtools/errors", 200, Date.now() - started);
    return NextResponse.json({
      errors: dataRes.rows as unknown[],
      total: Number((countRes.rows as unknown as { n: number }[])[0]?.n ?? 0),
      page,
      pageSize,
    });
  } catch (error) {
    if (isDbConnectionError(error)) return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    recordError("devtools/errors", error instanceof Error ? error.message : "Unknown error", undefined, { op: "list" });
    recordApiRequest("GET", "/api/devtools/errors", 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
