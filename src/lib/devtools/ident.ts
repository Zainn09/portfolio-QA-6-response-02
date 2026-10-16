/**
 * Identifier validation for the database explorer.
 *
 * Table and column names coming from the URL are never interpolated into SQL
 * as raw input. They must match this strict pattern AND exist in the set of
 * real objects discovered from information_schema for the current connection.
 */

const IDENT_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;

export function isSafeIdentifier(value: string | null | undefined): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 128 && IDENT_RE.test(value);
}

/**
 * Discover real table names in the public schema. Returns the set used to
 * allowlist every explorer query, plus a friendly error for unknown names.
 */
export function tableNotAllowedReason(table: string, known: ReadonlySet<string>): string {
  return `Table "${table}" was not found in the public schema. Known tables: ${[...known].sort().join(", ") || "none"}.`;
}
