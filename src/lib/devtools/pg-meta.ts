import "server-only";
import { db, pool } from "@/db";
import { sql } from "drizzle-orm";
import { isSafeIdentifier } from "@/lib/devtools/ident";

/**
 * Database introspection for the DevTools explorer.
 *
 * Identifier safety: table and column names from the URL are validated
 * against this strict pattern AND against the set of real objects discovered
 * from information_schema before they are ever placed in a query. All *values*
 * (search terms, limits, offsets) are bound as parameters.
 */

export interface TableMeta {
  name: string;
  kind: string; // BASE TABLE | VIEW
  rowEstimate: number;
  columnCount: number;
}

export interface ColumnMeta {
  name: string;
  type: string;
  nullable: boolean;
  default: string | null;
  isPk: boolean;
}

export interface ForeignKeyMeta {
  column: string;
  refTable: string;
  refColumn: string;
  name: string;
}

export interface IndexMeta {
  name: string;
  def: string;
}

type Row = Record<string, unknown>;

/** Discover all tables and views in the public schema. */
export async function listTables(): Promise<TableMeta[]> {
  const result = await db.execute(sql`
    select
      c.table_name as name,
      c.table_type as kind,
      coalesce(s.n_live_tup, 0)::bigint as row_estimate,
      (
        select count(*) from information_schema.columns cc
        where cc.table_schema = 'public' and cc.table_name = c.table_name
      )::int as column_count
    from information_schema.tables c
    left join pg_stat_user_tables s on s.relname = c.table_name
    where c.table_schema = 'public'
    order by c.table_name
  `);
  return (result.rows as unknown as Row[]).map((r) => ({
    name: String(r.name),
    kind: String(r.kind),
    rowEstimate: Number(r.row_estimate),
    columnCount: Number(r.column_count),
  }));
}

/**
 * Return the set of real table names (BASE TABLE and VIEW) in public.
 * Used as the allowlist for every explorer query.
 */
export async function knownTableNames(): Promise<Set<string>> {
  const result = await db.execute(sql`
    select table_name from information_schema.tables
    where table_schema = 'public' and table_type in ('BASE TABLE', 'VIEW')
  `);
  return new Set((result.rows as unknown as { table_name: string }[]).map((r) => r.table_name));
}

/** Validate a requested table name against the live catalog. */
export async function assertKnownTable(table: string): Promise<true | string> {
  if (!isSafeIdentifier(table)) return "Invalid table name.";
  const known = await knownTableNames();
  if (!known.has(table)) {
    return `Table "${table}" was not found in the public schema. Known tables: ${[...known].sort().join(", ") || "none"}.`;
  }
  return true;
}

/** Discover the real column names of a table (already allowlisted). */
async function columnNames(table: string): Promise<string[]> {
  const result = await db.execute(sql`
    select column_name from information_schema.columns
    where table_schema = 'public' and table_name = ${table}
    order by ordinal_position
  `);
  return (result.rows as unknown as { column_name: string }[]).map((r) => r.column_name);
}

export async function getTableDetail(table: string): Promise<{
  columns: ColumnMeta[];
  foreignKeys: ForeignKeyMeta[];
  indexes: IndexMeta[];
  rowCount: number;
}> {
  const [colsRes, fksRes, idxRes, countRes] = await Promise.all([
    db.execute(sql`
      select
        column_name as name,
        data_type as type,
        is_nullable as nullable,
        column_default as default
      from information_schema.columns
      where table_schema = 'public' and table_name = ${table}
      order by ordinal_position
    `),
    db.execute(sql`
      select
        kcu.column_name as column,
        ccu.table_name as ref_table,
        ccu.column_name as ref_column,
        tc.constraint_name as name
      from information_schema.table_constraints tc
      join information_schema.key_column_usage kcu
        on kcu.constraint_name = tc.constraint_name and kcu.table_schema = tc.table_schema
      join information_schema.constraint_column_usage ccu
        on ccu.constraint_name = tc.constraint_name and ccu.table_schema = tc.table_schema
      where tc.constraint_type = 'FOREIGN KEY'
        and tc.table_schema = 'public' and tc.table_name = ${table}
      order by kcu.ordinal_position
    `),
    db.execute(sql`select indexname as name, indexdef as def from pg_indexes where schemaname = 'public' and tablename = ${table} order by indexname`),
    db.execute(sql`select count(*)::int as n from ${sql.raw(table)}`),
  ]);

  const columnRows = colsRes.rows as unknown as Row[];
  const pkRes = await db.execute(sql`
    select kcu.column_name
    from information_schema.table_constraints tc
    join information_schema.key_column_usage kcu
      on kcu.constraint_name = tc.constraint_name and kcu.table_schema = tc.table_schema
    where tc.constraint_type = 'PRIMARY KEY'
      and tc.table_schema = 'public' and tc.table_name = ${table}
  `);
  const pkColumns = new Set((pkRes.rows as unknown as { column_name: string }[]).map((r) => r.column_name));

  return {
    columns: columnRows.map((c) => ({
      name: String(c.name),
      type: String(c.type),
      nullable: String(c.nullable) === "YES",
      default: c.default === null ? null : String(c.default),
      isPk: pkColumns.has(String(c.name)),
    })),
    foreignKeys: (fksRes.rows as unknown as Row[]).map((f) => ({
      column: String(f.column),
      refTable: String(f.ref_table),
      refColumn: String(f.ref_column),
      name: String(f.name),
    })),
    indexes: (idxRes.rows as unknown as Row[]).map((i) => ({
      name: String(i.name),
      def: String(i.def),
    })),
    rowCount: Number((countRes.rows as unknown as { n: number }[])[0]?.n ?? 0),
  };
}

export interface RowsResult {
  columns: string[];
  rows: unknown[][];
  total: number;
  page: number;
  pageSize: number;
  queryMs: number;
}

/**
 * Paginated, searchable grid over one table.
 * `q` is an ILIKE match across every column (value-bound, never concatenated).
 */
export async function queryRows(opts: {
  table: string;
  page: number;
  pageSize: number;
  q: string;
  sort: string | null;
  dir: "asc" | "desc";
}): Promise<RowsResult> {
  const started = Date.now();
  const page = Math.max(1, Math.min(100_000, Math.trunc(opts.page) || 1));
  const pageSize = Math.max(1, Math.min(100, Math.trunc(opts.pageSize) || 25));
  const q = opts.q.slice(0, 200);

  const columns = await columnNames(opts.table);
  if (columns.length === 0) {
    throw new Error(`Table "${opts.table}" has no discoverable columns.`);
  }

  // Search predicate: ILIKE over every column, cast to text. Values are bound.
  let where = "";
  const params: unknown[] = [];
  if (q) {
    const parts = columns.map((c) => {
      params.push(`%${q}%`);
      return `"${c}"::text ilike $${params.length}`;
    });
    where = ` where (${parts.join(" or ")})`;
  }

  // Sort column must be a real column; default to the first one.
  const sortCol = opts.sort && columns.includes(opts.sort) ? opts.sort : columns[0];
  const dir = opts.dir === "desc" ? "DESC" : "ASC";

  const [countRes, dataRes] = await Promise.all([
    db.execute(sql`select count(*)::int as n from ${sql.raw(opts.table)}${where ? sql.raw(where) : sql``}`),
    db.execute(
      sql`select * from ${sql.raw(opts.table)}${where ? sql.raw(where) : sql``} order by ${sql.raw(sortCol)} ${sql.raw(dir)} limit ${pageSize} offset ${(page - 1) * pageSize}`,
    ),
  ]);

  return {
    columns,
    rows: (dataRes.rows as unknown as Record<string, unknown>[]).map((r) => columns.map((c) => r[c])),
    total: Number((countRes.rows as unknown as { n: number }[])[0]?.n ?? 0),
    page,
    pageSize,
    queryMs: Date.now() - started,
  };
}

/**
 * Run a validated read-only query (see sql-guard) inside a transaction with a
 * 10-second statement timeout. Returns up to `maxRows` rows.
 */
export async function runReadOnlyQuery(sqlText: string, maxRows: number): Promise<{ rows: unknown[][]; columns: string[]; queryMs: number }> {
  const client = await pool.connect();
  const started = Date.now();
  try {
    await client.query("begin");
    await client.query("set local statement_timeout = '10000'");
    const res = await client.query(sqlText, [Math.max(1, Math.min(500, maxRows))]);
    await client.query("commit");
    const columns = (res.fields ?? []).map((f) => String(f.name));
    const cap = Math.max(1, Math.min(500, maxRows));
    const rows = (res.rows as Record<string, unknown>[])
      .slice(0, cap)
      .map((r) => columns.map((c) => r[c]));
    return { rows, columns, queryMs: Date.now() - started };
  } catch (err) {
    await client
      .query("rollback")
      .catch(() => undefined);
    throw err;
  } finally {
    client.release();
  }
}

/** Full-table export (capped) for CSV/JSON downloads. */
export async function exportRows(table: string, limit: number): Promise<{ columns: string[]; rows: unknown[][] }> {
  const columns = await columnNames(table);
  const capped = Math.max(1, Math.min(1000, Math.trunc(limit) || 500));
  const result = await db.execute(sql`select * from ${sql.raw(table)} limit ${capped}`);
  const rows = (result.rows as unknown as Record<string, unknown>[]).map((r) => columns.map((c) => r[c]));
  return { columns, rows };
}

/** True when the failure is a connectivity problem rather than a SQL problem. */
/**
 * True when a query failed because a table does not exist (Postgres 42P01).
 * The DevTools tables are created by migration 0001 (Settings → "Apply schema
 * updates"); until it runs, the monitors must explain themselves instead of
 * returning a bare "Internal server error".
 */
export function isMissingTableError(err: unknown): boolean {
  let current: unknown = err;
  for (let depth = 0; depth < 4 && current; depth++) {
    const e = current as { code?: string; message?: string; cause?: unknown };
    if (typeof e.code === "string" && e.code === "42P01") return true;
    if (typeof e.message === "string" && /does not exist/i.test(e.message) && /relation|table/i.test(e.message)) return true;
    current = e.cause;
  }
  return false;
}

export const SCHEMA_HINT = 'DevTools tables not found yet — open Settings and click "Apply schema updates" (or run drizzle/0001_devtools.sql), then retry.';

export function isDbConnectionError(err: unknown): boolean {
  // Drizzle wraps driver errors in DrizzleQueryError (original in .cause) and
  // pg reports dead sockets as AggregateError — walk the cause chain.
  let current: unknown = err;
  for (let depth = 0; depth < 4 && current; depth++) {
    const e = current as { code?: string; message?: string; cause?: unknown };
    const code = typeof e.code === "string" ? e.code : "";
    if (
      code === "ECONNREFUSED" ||
      code === "ECONNRESET" ||
      code === "ETIMEDOUT" ||
      code === "ENOTFOUND" ||
      code === "EAI_AGAIN" ||
      code === "28P01" ||
      code === "3D000"
    ) {
      return true;
    }
    if (typeof e.message === "string" && /ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|getaddrinfo/i.test(e.message)) {
      return true;
    }
    current = e.cause;
  }
  return false;
}
