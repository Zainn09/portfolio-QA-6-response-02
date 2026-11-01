import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, requireAdmin } from "@/lib/devtools/session";
import { assertKnownTable, exportRows, isDbConnectionError } from "@/lib/devtools/pg-meta";
import { toCsv } from "@/lib/devtools/csv";
import { getIp, recordActivity, recordApiRequest, recordError } from "@/lib/devtools/log";

export const dynamic = "force-dynamic";

const MAX_EXPORT = 1000;

/**
 * Export one table as CSV or JSON (capped at 1000 rows). Every export is
 * audit-logged with the actor and row count.
 */
export async function GET(req: NextRequest) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const session = await getAdminSession(req);
  const actorEmail = session?.email ?? null;

  const params = req.nextUrl.searchParams;
  const table = params.get("table") ?? "";
  const format = params.get("format") === "json" ? "json" : "csv";
  const limit = Number(params.get("limit") ?? String(MAX_EXPORT));

  try {
    const check = await assertKnownTable(table);
    if (check !== true) {
      recordApiRequest("GET", "/api/devtools/database/export", 400, Date.now() - started, `unknown table: ${table}`);
      return NextResponse.json({ error: check }, { status: 400 });
    }

    const { columns, rows } = await exportRows(table, limit);
    const value = (v: unknown): string | null => {
      if (v === null || v === undefined) return null;
      if (v instanceof Date) return v.toISOString();
      if (typeof v === "object") return JSON.stringify(v);
      return String(v);
    };
    const flatRows = rows.map((r) => r.map(value));

    recordActivity(actorEmail, `export.${format}`, table, { rows: flatRows.length, ip: getIp(req) }, getIp(req) ?? undefined);
    recordApiRequest("GET", "/api/devtools/database/export", 200, Date.now() - started);

    if (format === "json") {
      const json = JSON.stringify(flatRows.map((r) => Object.fromEntries(columns.map((c, i) => [c, r[i]]))), null, 2);
      return new NextResponse(json, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${table}-${Date.now()}.json"`,
        },
      });
    }

    const csv = toCsv(columns, flatRows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${table}-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    if (isDbConnectionError(error)) {
      recordApiRequest("GET", "/api/devtools/database/export", 503, Date.now() - started, "db unreachable");
      return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    }
    recordError("devtools/database/export", error instanceof Error ? error.message : "Unknown error", undefined, { op: "export", table });
    recordApiRequest("GET", "/api/devtools/database/export", 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
