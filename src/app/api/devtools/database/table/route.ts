import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/devtools/session";
import { assertKnownTable, getTableDetail, isDbConnectionError } from "@/lib/devtools/pg-meta";
import { recordApiRequest, recordError } from "@/lib/devtools/log";

export const dynamic = "force-dynamic";

/** Columns, primary keys, foreign keys, indexes and row count for one table. */
export async function GET(req: NextRequest) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const table = req.nextUrl.searchParams.get("table") ?? "";
  try {
    const check = await assertKnownTable(table);
    if (check !== true) {
      recordApiRequest("GET", "/api/devtools/database/table", 400, Date.now() - started, `unknown table: ${table}`);
      return NextResponse.json({ error: check }, { status: 400 });
    }
    const detail = await getTableDetail(table);
    recordApiRequest("GET", "/api/devtools/database/table", 200, Date.now() - started);
    return NextResponse.json({ table, ...detail });
  } catch (error) {
    if (isDbConnectionError(error)) {
      recordApiRequest("GET", "/api/devtools/database/table", 503, Date.now() - started, "db unreachable");
      return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    }
    recordError("devtools/database/table", error instanceof Error ? error.message : "Unknown error", undefined, { op: "detail", table });
    recordApiRequest("GET", "/api/devtools/database/table", 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
