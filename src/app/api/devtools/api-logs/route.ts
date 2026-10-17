import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { requireAdmin } from "@/lib/devtools/session";
import { isDbConnectionError, isMissingTableError, SCHEMA_HINT } from "@/lib/devtools/pg-meta";
import { recordApiRequest, recordError } from "@/lib/devtools/log";

export const dynamic = "force-dynamic";

/**
 * API request log (collected by the instrumented routes: /api/audit,
 * /api/contact, /api/health, /api/admin/*, /api/devtools/*).
 * Filter by method, path prefix, status bucket and date window.
 */
export async function GET(req: NextRequest) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const params = req.nextUrl.searchParams;
  const page = Math.max(1, Math.min(10_000, Number(params.get("page") ?? "1") || 1));
  const pageSize = Math.max(1, Math.min(100, Number(params.get("pageSize") ?? "25") || 25));
  const method = (params.get("method") ?? "").toUpperCase().slice(0, 10);
  const pathPrefix = (params.get("path") ?? "").slice(0, 200);
  const status = params.get("status") ?? ""; // "2xx" | "4xx" | "5xx" | exact number
  const days = Math.max(1, Math.min(90, Number(params.get("days") ?? "7") || 7));

  try {
    const sqlParts: string[] = [];
    const values: unknown[] = [];
    if (method) {
      values.push(method);
      sqlParts.push(`method = $${values.length}`);
    }
    if (pathPrefix) {
      values.push(`${pathPrefix}%`);
      sqlParts.push(`path like $${values.length}`);
    }
    if (status === "2xx" || status === "4xx" || status === "5xx") {
      const [lo, hi] = status === "2xx" ? [200, 299] : status === "4xx" ? [400, 499] : [500, 599];
      values.push(lo, hi);
      sqlParts.push(`status between $${values.length - 1} and $${values.length}`);
    } else if (/^\d{3}$/.test(status)) {
      values.push(Number(status));
      sqlParts.push(`status = $${values.length}`);
    }
    values.push(new Date(Date.now() - days * 86_400_000));
    sqlParts.push(`created_at >= $${values.length}`);
    const where = sqlParts.length > 0 ? ` where ${sqlParts.join(" and ")}` : "";

    values.push(pageSize, (page - 1) * pageSize);
    const [countRes, dataRes] = await Promise.all([
      db.execute(sql.raw(`select count(*)::int as n from api_requests${where}`)),
      db.execute(
        sql.raw(`select * from api_requests${where} order by created_at desc limit $${values.length - 1} offset $${values.length}`),
      ),
    ]);

    recordApiRequest("GET", "/api/devtools/api-logs", 200, Date.now() - started);
    return NextResponse.json({
      requests: dataRes.rows as unknown[],
      total: Number((countRes.rows as unknown as { n: number }[])[0]?.n ?? 0),
      page,
      pageSize,
    });
  } catch (error) {
    if (isDbConnectionError(error)) return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    if (isMissingTableError(error)) return NextResponse.json({ error: SCHEMA_HINT }, { status: 503 });
    recordError("devtools/api-logs", error instanceof Error ? error.message : "Unknown error", undefined, { op: "list" });
    recordApiRequest("GET", "/api/devtools/api-logs", 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
