/**
 * SQL builders for the DevTools monitor endpoints (API logs, errors, activity,
 * submissions).
 *
 * WHY THIS MODULE EXISTS
 * ----------------------
 * The previous inline versions built raw strings with `$n` placeholders and
 * passed them to `db.execute(sql.raw(str))`. `sql.raw` binds NO parameters —
 * the placeholders reached Postgres with zero values, so every request failed
 * with "bind message supplies 0 parameters, but none were expected" (HTTP 500
 * on every call, for every filter combination). The sandbox never caught this
 * because the local database is down, so the connection error masked the
 * binding error.
 *
 * These builders return drizzle `SQL` objects built with the tagged template.
 * Every interpolated value is bound as a driver parameter by drizzle itself,
 * so the placeholder count and the parameter list can never diverge.
 *
 * All table and column names below are fixed literals (validated at schema
 * level in drizzle/0001_devtools.sql); user input only ever appears as bound
 * values.
 */
import { sql, type SQL } from "drizzle-orm";

export interface BuiltQuery {
  /** `select count(*)::int as n ...` for the current filter set. */
  count: SQL;
  /** Page query: ordered, with `limit`/`offset` already bound. */
  page: SQL;
  /** Submissions only: uncapped list with a bound export cap (CSV export). */
  export?: SQL;
}

/** `where <conds joined by "and">`, or an empty chunk with no filters. */
function whereChunk(conds: SQL[]): SQL {
  return conds.length === 0 ? sql.raw("") : sql`where ${sql.join(conds, sql` and `)}`;
}

export interface ApiLogsOptions {
  method?: string;
  /** Path prefix filter (`path like 'prefix%'`). */
  path?: string;
  /** "2xx" | "4xx" | "5xx" | an exact 3-digit status code. */
  status?: string;
  days: number;
  page: number;
  pageSize: number;
}

export function buildApiLogsQuery(opts: ApiLogsOptions): BuiltQuery {
  const conds: SQL[] = [];
  if (opts.method) conds.push(sql`method = ${opts.method}`);
  if (opts.path) conds.push(sql`path like ${`${opts.path.slice(0, 200)}%`}`);
  if (opts.status === "2xx" || opts.status === "4xx" || opts.status === "5xx") {
    const [lo, hi] = opts.status === "2xx" ? [200, 299] : opts.status === "4xx" ? [400, 499] : [500, 599];
    conds.push(sql`status between ${lo} and ${hi}`);
  } else if (/^\d{3}$/.test(opts.status ?? "")) {
    conds.push(sql`status = ${Number(opts.status)}`);
  }
  conds.push(sql`created_at >= ${new Date(Date.now() - opts.days * 86_400_000)}`);
  const where = whereChunk(conds);
  const page = sql`select * from api_requests ${where} order by created_at desc nulls last limit ${opts.pageSize} offset ${(opts.page - 1) * opts.pageSize}`;
  return { count: sql`select count(*)::int as n from api_requests ${where}`, page };
}

export interface ErrorsOptions {
  severity?: string;
  days: number;
  page: number;
  pageSize: number;
}

export function buildErrorsQuery(opts: ErrorsOptions): BuiltQuery {
  const conds: SQL[] = [sql`created_at >= ${new Date(Date.now() - opts.days * 86_400_000)}`];
  if (opts.severity) conds.push(sql`severity = ${opts.severity}`);
  const where = whereChunk(conds);
  const page = sql`select id, source, severity, message, stack, context, created_at
    from app_errors ${where}
    order by created_at desc nulls last limit ${opts.pageSize} offset ${(opts.page - 1) * opts.pageSize}`;
  return { count: sql`select count(*)::int as n from app_errors ${where}`, page };
}

export interface ActivityOptions {
  days: number;
  page: number;
  pageSize: number;
}

export function buildActivityQuery(opts: ActivityOptions): BuiltQuery {
  const conds: SQL[] = [sql`created_at >= ${new Date(Date.now() - opts.days * 86_400_000)}`];
  const where = whereChunk(conds);
  const page = sql`select id, actor_email, action, target, detail, ip, created_at
    from admin_activity ${where}
    order by created_at desc nulls last limit ${opts.pageSize} offset ${(opts.page - 1) * opts.pageSize}`;
  return { count: sql`select count(*)::int as n from admin_activity ${where}`, page };
}

/**
 * Merged submissions query across audit_requests and contact_messages.
 * The UNION subquery is a fixed literal; all filters are bound values.
 */
// Column set matches drizzle/0001_devtools.sql exactly: audit_requests has
// no company/website/project_type (null-filled); both tables' status/notes
// are coalesced so the status filter works uniformly across the union.
const SUBMISSIONS_UNION = `select
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
    from contact_messages cm`;

const subChunk = sql.raw(`(${SUBMISSIONS_UNION}) s`);

export interface SubmissionsOptions {
  form?: string;
  status?: string;
  q?: string;
  page: number;
  pageSize: number;
  /** When set, `export` is produced instead of `page`. */
  exportLimit?: number;
}

export function buildSubmissionsQuery(opts: SubmissionsOptions): BuiltQuery {
  const conds: SQL[] = [];
  if (opts.form === "audit" || opts.form === "contact") conds.push(sql`form = ${opts.form}`);
  if (opts.status) conds.push(sql`status = ${opts.status}`);
  if (opts.q) {
    const like = `%${opts.q.slice(0, 200)}%`;
    conds.push(
      sql`(name ilike ${like} or email ilike ${like} or store_url ilike ${like} or company ilike ${like} or website ilike ${like} or message ilike ${like})`,
    );
  }
  const where = whereChunk(conds);

  if (opts.exportLimit !== undefined) {
    return {
      count: sql`select count(*)::int as n from ${subChunk} ${where}`,
      page: sql`select * from ${subChunk} ${where} order by created_at desc, id desc limit ${opts.exportLimit}`,
      export: sql`select * from ${subChunk} ${where} order by created_at desc, id desc limit ${opts.exportLimit}`,
    };
  }

  const page = sql`select * from ${subChunk} ${where} order by created_at desc, id desc limit ${opts.pageSize} offset ${(opts.page - 1) * opts.pageSize}`;
  return { count: sql`select count(*)::int as n from ${subChunk} ${where}`, page };
}
