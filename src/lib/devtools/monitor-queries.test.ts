import { describe, expect, it } from "vitest";
import { CasingCache } from "drizzle-orm/casing";
import type { SQL } from "drizzle-orm";
import {
  buildActivityQuery,
  buildApiLogsQuery,
  buildErrorsQuery,
  buildSubmissionsQuery,
} from "./monitor-queries";

/**
 * Regression tests for the monitor query builders.
 *
 * Background: the original routes built SQL strings with `$n` placeholders and
 * passed them to `sql.raw(...)` — which binds NO parameters — so Postgres
 * rejected every request with "bind message supplies 0 parameters, but none
 * were expected" (HTTP 500 on every monitor tab, regardless of filters). The
 * sandbox could not catch this because the local DB is down.
 *
 * The builders now return drizzle `SQL` objects built with the tagged
 * template, so binding is structural. To prove the driver-level contract we
 * render each SQL object exactly the way the node-postgres driver would
 * (`SQL.toQuery`) and assert:
 *   1. every user-supplied filter value lands in `params` (bound), and
 *   2. the rendered text contains only `$n` references, numbered 1..N with
 *      exactly N parameters — the shape pg requires.
 */

interface Rendered {
  sql: string;
  params: unknown[];
}

function render(sqlObj: SQL): Rendered {
  return sqlObj.toQuery({
    casing: new CasingCache(),
    escapeName: (n) => `"${n}"`,
    // Match pg-core/dialect.js exactly: indices start at 0 and are rendered
    // 1-based (Postgres binding contract).
    escapeParam: (num) => `$${num + 1}`,
    escapeString: (s) => `'${s.replace(/'/g, "''")}'`,
  });
}

/** Placeholder indices must be exactly 1..params.length (pg binding contract). */
function assertWellFormed(r: Rendered) {
  const nums = [...r.sql.matchAll(/\$(\d+)/g)].map((m) => Number(m[1]));
  const max = nums.length ? Math.max(...nums) : 0;
  expect(r.params.length, `rendered sql: ${r.sql}`).toBe(max);
  for (let i = 1; i <= max; i++) {
    expect(nums, `missing $${i} in: ${r.sql}`).toContain(i);
  }
  for (const n of nums) {
    expect(n).toBeLessThanOrEqual(r.params.length);
  }
}

describe("buildApiLogsQuery", () => {
  it("renders well-formed placeholders and parameters", () => {
    for (const opts of [
      { days: 7, page: 1, pageSize: 25 },
      { days: 30, page: 2, pageSize: 50, method: "POST" },
      { days: 7, page: 1, pageSize: 10, path: "/api/audit" },
      { days: 30, page: 1, pageSize: 25, status: "5xx" },
      { days: 30, page: 1, pageSize: 25, status: "503" },
      { days: 30, page: 3, pageSize: 100, method: "GET", path: "/api", status: "4xx" },
    ]) {
      const built = buildApiLogsQuery(opts);
      const c = render(built.count);
      const p = render(built.page);
      assertWellFormed(c);
      assertWellFormed(p);
      // page query = count filters + limit + offset
      expect(p.params.length).toBe(c.params.length + 2);
      expect(p.params.slice(-2)).toEqual([opts.pageSize, (opts.page - 1) * opts.pageSize]);
      // the time-window Date is bound, not inlined
      expect(c.params[c.params.length - 1]).toBeInstanceOf(Date);
      expect(c.sql).not.toContain("T00:");
      // status buckets expand to bound ranges
      if (opts.status === "5xx") {
        expect(c.params).toContain(500);
        expect(c.params).toContain(599);
      }
      if (opts.status === "503") {
        expect(c.params).toContain(503);
      }
    }
  });

  it("binds user filters as parameters, never inlines them", () => {
    const probe = "x' or 1=1 --";
    const built = buildApiLogsQuery({ days: 7, page: 1, pageSize: 25, method: "POST", path: probe, status: "5xx" });
    for (const sqlObj of [built.count, built.page]) {
      const r = render(sqlObj);
      assertWellFormed(r);
      expect(r.sql).not.toContain(probe);
      expect(r.params).toContain("POST");
      expect(r.params).toContain(`${probe}%`);
    }
  });

  it("ignores invalid status filters instead of passing them through", () => {
    const built = buildApiLogsQuery({ days: 7, page: 1, pageSize: 25, status: "not-a-status" });
    const r = render(built.count);
    assertWellFormed(r);
    expect(r.sql).not.toContain("not-a-status");
    expect(r.params).toHaveLength(1); // only the time window
  });
});

describe("buildErrorsQuery", () => {
  it("renders well-formed placeholders and parameters", () => {
    for (const opts of [
      { days: 7, page: 1, pageSize: 25 },
      { days: 30, page: 3, pageSize: 10, severity: "warn" },
    ]) {
      const built = buildErrorsQuery(opts);
      const c = render(built.count);
      const p = render(built.page);
      assertWellFormed(c);
      assertWellFormed(p);
      expect(p.params.length).toBe(c.params.length + 2);
      expect(c.params[0]).toBeInstanceOf(Date);
    }
  });

  it("binds the severity filter as a parameter", () => {
    const probe = "error' ; drop table app_errors --";
    const built = buildErrorsQuery({ days: 7, page: 1, pageSize: 25, severity: probe });
    for (const sqlObj of [built.count, built.page]) {
      const r = render(sqlObj);
      assertWellFormed(r);
      expect(r.sql).not.toContain(probe);
      expect(r.params).toContain(probe);
    }
  });
});

describe("buildActivityQuery", () => {
  it("renders well-formed placeholders and parameters", () => {
    for (const opts of [{ days: 7, page: 1, pageSize: 25 }, { days: 30, page: 2, pageSize: 100 }]) {
      const built = buildActivityQuery(opts);
      const c = render(built.count);
      const p = render(built.page);
      assertWellFormed(c);
      assertWellFormed(p);
      expect(p.params.length).toBe(c.params.length + 2);
      expect(c.params).toHaveLength(1); // only the time window
      expect(p.params[0]).toBeInstanceOf(Date);
    }
  });
});

describe("buildSubmissionsQuery", () => {
  it("renders well-formed placeholders and parameters for every filter combination", () => {
    for (const opts of [
      { page: 1, pageSize: 25 },
      { page: 1, pageSize: 25, form: "audit" },
      { page: 1, pageSize: 25, form: "contact", status: "completed" },
      { page: 1, pageSize: 10, q: "shopify store" },
      { page: 2, pageSize: 50, form: "contact", status: "new", q: "re: audit" },
    ]) {
      const built = buildSubmissionsQuery(opts);
      const c = render(built.count!);
      const p = render(built.page!);
      assertWellFormed(c);
      assertWellFormed(p);
      expect(p.params.length).toBe(c.params.length + 2);
      expect(p.params.slice(-2)).toEqual([opts.pageSize, (opts.page - 1) * opts.pageSize]);
    }
  });

  it("binds form, status and search filters as parameters", () => {
    const probe = "z' or name like '%'--";
    const built = buildSubmissionsQuery({
      page: 1,
      pageSize: 25,
      form: "audit",
      status: "in_progress",
      q: probe,
    });
    const r = render(built.page!);
    assertWellFormed(r);
    expect(r.sql).not.toContain(probe);
    expect(r.params).toContain("audit");
    expect(r.params).toContain("in_progress");
    expect(r.params).toContain(`%${probe}%`);
  });

  it("builds the capped export query with the same filter values", () => {
    const built = buildSubmissionsQuery({
      page: 1,
      pageSize: 25,
      form: "contact",
      q: "x",
      exportLimit: 1000,
    });
    const r = render(built.export!);
    assertWellFormed(r);
    expect(r.params).toContain("contact");
    expect(r.params).toContain("%x%");
    expect(r.params).toContain(1000);
    expect(r.sql).toMatch(/limit \$\d+$/);
  });
});
