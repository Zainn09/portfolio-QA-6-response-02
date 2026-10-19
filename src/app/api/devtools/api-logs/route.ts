import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { requireAdmin } from "@/lib/devtools/session";
import { isDbConnectionError, isMissingTableError, SCHEMA_HINT, errorDetail } from "@/lib/devtools/pg-meta";
import { buildApiLogsQuery } from "@/lib/devtools/monitor-queries";
import { recordApiRequest, recordError } from "@/lib/devtools/log";

export const dynamic = "force-dynamic";

/**
 * API request log (collected by the instrumented routes: /api/audit,
 * /api/contact, /api/admin/*, /api/devtools/*).
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
    const built = buildApiLogsQuery({ method, path: pathPrefix, status, days, page, pageSize });
    const [countRes, dataRes] = await Promise.all([
      db.execute(built.count),
      db.execute(built.page),
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
    return NextResponse.json({ error: "Internal server error", detail: errorDetail(error) }, { status: 500 });
  }
}
