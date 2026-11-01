import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/devtools/session";
import { listTables, isDbConnectionError } from "@/lib/devtools/pg-meta";
import { recordApiRequest, recordError } from "@/lib/devtools/log";

export const dynamic = "force-dynamic";

/** List all tables and views in the public schema. */
export async function GET(req: NextRequest) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const tables = await listTables();
    recordApiRequest("GET", "/api/devtools/database", 200, Date.now() - started);
    return NextResponse.json({ tables });
  } catch (error) {
    if (isDbConnectionError(error)) {
      recordError("devtools/database", "Database unreachable", undefined, { op: "listTables" }, "warn");
      recordApiRequest("GET", "/api/devtools/database", 503, Date.now() - started, "db unreachable");
      return NextResponse.json(
        { error: "Database unreachable. Check DATABASE_URL and connectivity, then retry." },
        { status: 503 },
      );
    }
    recordError("devtools/database", error instanceof Error ? error.message : "Unknown error", undefined, { op: "listTables" });
    recordApiRequest("GET", "/api/devtools/database", 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
