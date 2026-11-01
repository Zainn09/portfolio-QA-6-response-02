/**
 * Read-only SQL guard for the DevTools query editor.
 *
 * The database connection the explorer uses is a normal connection, so the
 * guard must refuse anything that is not a single read statement before the
 * query ever reaches Postgres. Defense in depth, not a substitute for it:
 * the query route additionally runs the statement with a statement timeout.
 */

const FORBIDDEN_KEYWORDS =
  /\b(insert|update|delete|drop|alter|truncate|create|replace|grant|revoke|copy|vacuum|analyze|refresh|reindex|set|do|call|execute|prepare|deallocate|listen|notify|unlisten|discard|reset|lock|comment|import|cluster|merge|security|background|load)\b/i;

export type SqlGuardResult = { ok: true; sql: string } | { ok: false; reason: string };

export function validateReadOnlySql(input: string | null | undefined): SqlGuardResult {
  const raw = (input ?? "").trim();
  if (!raw) return { ok: false, reason: "Query is empty." };
  if (raw.length > 20_000) return { ok: false, reason: "Query exceeds the 20,000 character limit." };
  if (raw.includes("$")) return { ok: false, reason: "Dollar-quoted strings are not allowed." };
  if (/\0/.test(raw)) return { ok: false, reason: "Query contains invalid characters." };

  // Strip comments so they cannot hide statements or semicolons.
  const stripped = raw.replace(/--[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");
  const statements = stripped
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  if (statements.length === 0) return { ok: false, reason: "Query is empty." };
  if (statements.length > 1) return { ok: false, reason: "Only a single statement is allowed." };

  const stmt = statements[0];
  if (!/^(select|with|explain)\b/i.test(stmt)) {
    return { ok: false, reason: "Only SELECT, WITH (read-only) or EXPLAIN queries are allowed." };
  }
  if (FORBIDDEN_KEYWORDS.test(stmt)) {
    return { ok: false, reason: "Query contains a keyword that can modify data or the database." };
  }
  return { ok: true, sql: stmt };
}
