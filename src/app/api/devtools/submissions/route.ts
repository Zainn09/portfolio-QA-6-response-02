import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { getAdminSession, requireAdmin } from "@/lib/devtools/session";
import { toCsv } from "@/lib/devtools/csv";
import { isDbConnectionError, errorDetail } from "@/lib/devtools/pg-meta";
import { buildSubmissionsQuery } from "@/lib/devtools/monitor-queries";
import { getIp, recordActivity, recordApiRequest, recordError } from "@/lib/devtools/log";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "in_progress", "completed", "archived"] as const;

function migrationHint(error: unknown): string | null {
  if (error instanceof Error && /column .* does not exist/i.test(error.message)) {
    return "This database is missing the DevTools columns (status/notes). Open DevTools → Settings and run “Apply schema updates”, or run drizzle/0001_devtools.sql.";
  }
  return null;
}

export async function GET(req: NextRequest) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const session = await getAdminSession(req);
  const actorEmail = session?.email ?? null;

  const params = req.nextUrl.searchParams;
  const formParam = params.get("form");
  const form = formParam === "audit" || formParam === "contact" ? formParam : "all";
  const statusParam = params.get("status");
  const status = (STATUSES as readonly string[]).includes(statusParam ?? "") ? (statusParam as string) : "";
  const q = (params.get("q") ?? "").slice(0, 200);
  const page = Math.max(1, Math.min(100_000, Number(params.get("page") ?? "1") || 1));
  const pageSize = Math.max(1, Math.min(100, Number(params.get("pageSize") ?? "25") || 25));

  try {
    if (params.get("export") === "csv") {
      const exportLimit = 1000;
      const exportQuery = buildSubmissionsQuery({ form, status, q, page, pageSize, exportLimit }).export!;
      const res = await db.execute(exportQuery);
      const rows = res.rows as unknown as Record<string, unknown>[];
      const columns = ["form", "id", "name", "email", "status", "store_url", "company", "website", "platform", "project_type", "review_scope", "message", "notes", "created_at"];
      const csv = toCsv(
        columns,
        rows.map((r) => columns.map((c) => (r[c] === null || r[c] === undefined ? null : String(r[c])))),
      );
      recordActivity(actorEmail, "export.csv", "submissions", { rows: rows.length, ip: getIp(req) }, getIp(req) ?? undefined);
      recordApiRequest("GET", "/api/devtools/submissions", 200, Date.now() - started);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="submissions-${Date.now()}.csv"`,
        },
      });
    }

    const built = buildSubmissionsQuery({ form, status, q, page, pageSize });
    const [countRes, dataRes] = await Promise.all([
      db.execute(built.count),
      db.execute(built.page),
    ]);

    recordApiRequest("GET", "/api/devtools/submissions", 200, Date.now() - started);
    return NextResponse.json({
      submissions: dataRes.rows as unknown[],
      total: Number((countRes.rows as unknown as { n: number }[])[0]?.n ?? 0),
      page,
      pageSize,
      statuses: [...STATUSES],
    });
  } catch (error) {
    const hint = migrationHint(error);
    if (hint) {
      recordApiRequest("GET", "/api/devtools/submissions", 500, Date.now() - started, "schema outdated");
      return NextResponse.json({ error: hint }, { status: 500 });
    }
    if (isDbConnectionError(error)) {
      recordApiRequest("GET", "/api/devtools/submissions", 503, Date.now() - started, "db unreachable");
      return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    }
    recordError("devtools/submissions", error instanceof Error ? error.message : "Unknown error", undefined, { op: "list" });
    recordApiRequest("GET", "/api/devtools/submissions", 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error", detail: errorDetail(error) }, { status: 500 });
  }
}
