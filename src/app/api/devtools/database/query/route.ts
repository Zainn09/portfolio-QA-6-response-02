import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession, requireAdmin } from "@/lib/devtools/session";
import { validateReadOnlySql } from "@/lib/devtools/sql-guard";
import { runReadOnlyQuery, isDbConnectionError } from "@/lib/devtools/pg-meta";
import { getIp, recordActivity, recordApiRequest, recordError } from "@/lib/devtools/log";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  sql: z.string().min(1).max(20_000),
});

/**
 * Read-only SQL console. The statement is validated by sql-guard (single
 * SELECT / WITH / EXPLAIN, no DML/DDL keywords), then executed inside a
 * transaction with a 10s statement timeout. Results are capped at 500 rows.
 * Every attempt (allowed or rejected) is written to the activity trail.
 */
export async function POST(req: NextRequest) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const session = await getAdminSession(req);
  const email = session?.email ?? null;
  const ip = getIp(req);

  try {
    const body = await req.json().catch(() => null);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      recordApiRequest("POST", "/api/devtools/database/query", 400, Date.now() - started, "validation failed");
      return NextResponse.json({ error: "A non-empty SQL statement is required." }, { status: 400 });
    }

    const guard = validateReadOnlySql(parsed.data.sql);
    if (!guard.ok) {
      recordActivity(email, "query.rejected", undefined, { reason: guard.reason, ip }, ip ?? undefined);
      recordApiRequest("POST", "/api/devtools/database/query", 400, Date.now() - started, guard.reason);
      return NextResponse.json({ error: guard.reason }, { status: 400 });
    }

    const result = await runReadOnlyQuery(guard.sql, 500);
    recordActivity(email, "query.run", undefined, { rows: result.rows.length, ms: result.queryMs, ip }, ip ?? undefined);
    recordApiRequest("POST", "/api/devtools/database/query", 200, Date.now() - started);
    return NextResponse.json(result);
  } catch (error) {
    if (isDbConnectionError(error)) {
      recordApiRequest("POST", "/api/devtools/database/query", 503, Date.now() - started, "db unreachable");
      return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    }
    const message = error instanceof Error ? error.message : "Query failed";
    recordError("devtools/database/query", `Query error: ${message}`, undefined, { ip }, "warn");
    recordApiRequest("POST", "/api/devtools/database/query", 500, Date.now() - started, message.slice(0, 500));
    return NextResponse.json({ error: `Query failed: ${message}` }, { status: 500 });
  }
}
