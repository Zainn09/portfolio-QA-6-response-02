import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { requireAdmin } from "@/lib/devtools/session";
import { isDbConnectionError, isMissingTableError, SCHEMA_HINT, errorDetail } from "@/lib/devtools/pg-meta";
import { buildErrorsQuery } from "@/lib/devtools/monitor-queries";
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
  const rawSeverity = params.get("severity");
  const severity: string = rawSeverity === "warn" || rawSeverity === "error" ? rawSeverity : "";

  try {
    const built = buildErrorsQuery({ severity, days, page, pageSize });
    const [countRes, dataRes] = await Promise.all([
      db.execute(built.count),
      db.execute(built.page),
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
    if (isMissingTableError(error)) return NextResponse.json({ error: SCHEMA_HINT }, { status: 503 });
    recordError("devtools/errors", error instanceof Error ? error.message : "Unknown error", undefined, { op: "list" });
    recordApiRequest("GET", "/api/devtools/errors", 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error", detail: errorDetail(error) }, { status: 500 });
  }
}
