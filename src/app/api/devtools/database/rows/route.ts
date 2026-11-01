import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/devtools/session";
import { assertKnownTable, queryRows, isDbConnectionError } from "@/lib/devtools/pg-meta";
import { recordApiRequest, recordError } from "@/lib/devtools/log";

export const dynamic = "force-dynamic";

/**
 * Paginated, searchable, sortable grid over one table.
 * Table and sort column are validated against the live catalog; the search
 * term is bound as a parameter.
 */
export async function GET(req: NextRequest) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const params = req.nextUrl.searchParams;
  const table = params.get("table") ?? "";
  const page = Number(params.get("page") ?? "1");
  const pageSize = Number(params.get("pageSize") ?? "25");
  const q = params.get("q") ?? "";
  const sort = params.get("sort");
  const dir = params.get("dir") === "desc" ? "desc" : "asc";

  try {
    const check = await assertKnownTable(table);
    if (check !== true) {
      recordApiRequest("GET", "/api/devtools/database/rows", 400, Date.now() - started, `unknown table: ${table}`);
      return NextResponse.json({ error: check }, { status: 400 });
    }
    const result = await queryRows({ table, page, pageSize, q, sort, dir });
    recordApiRequest("GET", "/api/devtools/database/rows", 200, Date.now() - started);
    return NextResponse.json(result);
  } catch (error) {
    if (isDbConnectionError(error)) {
      recordApiRequest("GET", "/api/devtools/database/rows", 503, Date.now() - started, "db unreachable");
      return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    }
    recordError("devtools/database/rows", error instanceof Error ? error.message : "Unknown error", undefined, { op: "rows", table });
    recordApiRequest("GET", "/api/devtools/database/rows", 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
