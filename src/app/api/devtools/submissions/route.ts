import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { getAdminSession, requireAdmin } from "@/lib/devtools/session";
import { toCsv } from "@/lib/devtools/csv";
import { isDbConnectionError } from "@/lib/devtools/pg-meta";
import { getIp, recordActivity, recordApiRequest, recordError } from "@/lib/devtools/log";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "in_progress", "completed", "archived"] as const;

/**
 * Merged submissions query across audit_requests and contact_messages.
 * All user-supplied values are bound as parameters; table names are fixed.
 */
function baseSelect(params: { form: string; status: string; q: string }) {
  const whereParts: string[] = [];
  const values: unknown[] = [];
  if (params.form === "audit" || params.form === "contact") {
    values.push(params.form);
    whereParts.push(`form = $${values.length}`);
  }
  if (params.status) {
    values.push(params.status);
    whereParts.push(`status = $${values.length}`);
  }
  if (params.q) {
    values.push(`%${params.q.slice(0, 200)}%`);
    const n = values.length;
    whereParts.push(`(name ilike $${n} or email ilike $${n} or store_url ilike $${n} or company ilike $${n} or website ilike $${n} or message ilike $${n})`);
  }
  const where = whereParts.length > 0 ? ` where ${whereParts.join(" and ")}` : "";

  const union = `
    select
      'audit'::text as form,
      ar.id, ar.name, ar.email,
      coalesce(ar.status, 'new')::text as status,
      ar.notes,
      ar.created_at,
      ar.store_url, ar.platform, ar.review_scope, ar.message,
      null::text as company, null::text as website, null::text as project_type
    from audit_requests ar
    union all
    select
      'contact'::text,
      cm.id, cm.name, cm.email,
      coalesce(cm.status, 'new')::text,
      cm.notes,
      cm.created_at,
      null::text, null::text, null::text, cm.message,
      cm.company, cm.website, cm.project_type
    from contact_messages cm
  `;
  return { union, where, values };
}

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
    const { union, where, values } = baseSelect({ form: form, status, q });

    if (params.get("export") === "csv") {
      const exportLimit = Math.min(1000, 1000);
      values.push(exportLimit);
      const res = await db.execute(sql.raw(`select * from (${union}) s${where} order by created_at desc, id desc limit $${values.length}`));
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

    values.push(pageSize, (page - 1) * pageSize);
    const [countRes, dataRes] = await Promise.all([
      db.execute(sql.raw(`select count(*)::int as n from (${union}) s${where}`)),
      db.execute(sql.raw(`select * from (${union}) s${where} order by created_at desc, id desc limit $${values.length - 1} offset $${values.length}`)),
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
