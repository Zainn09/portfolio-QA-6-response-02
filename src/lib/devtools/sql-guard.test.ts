import { describe, it, expect } from "vitest";
import { validateReadOnlySql } from "./sql-guard";

describe("validateReadOnlySql", () => {
  it("accepts a plain SELECT", () => {
    const r = validateReadOnlySql("select * from audit_requests limit 5");
    expect(r.ok).toBe(true);
  });

  it("accepts WITH ... SELECT (read-only CTE)", () => {
    const r = validateReadOnlySql("with x as (select id from audit_requests) select * from x");
    expect(r.ok).toBe(true);
  });

  it("accepts EXPLAIN SELECT", () => {
    const r = validateReadOnlySql("explain select count(*) from projects");
    expect(r.ok).toBe(true);
  });

  it("accepts SELECT written in uppercase", () => {
    const r = validateReadOnlySql("SELECT count(*) FROM admin_activity");
    expect(r.ok).toBe(true);
  });

  it("rejects an empty query", () => {
    expect(validateReadOnlySql("").ok).toBe(false);
    expect(validateReadOnlySql("   ").ok).toBe(false);
    expect(validateReadOnlySql(null).ok).toBe(false);
  });

  it("rejects multiple statements", () => {
    const r = validateReadOnlySql("select 1; select 2");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/single statement/i);
  });

  it("rejects DML/DDL keywords", () => {
    for (const q of [
      "insert into audit_requests (name) values ('x')",
      "update projects set title = 'x'",
      "delete from contact_messages",
      "drop table audit_requests",
      "alter table projects add column x text",
      "truncate admin_activity",
      "create table evil (id int)",
      "copy (select 1) to '/tmp/x'",
      "vacuum",
      "set statement_timeout = '1s'",
    ]) {
      const r = validateReadOnlySql(q);
      expect(r.ok, q).toBe(false);
    }
  });

  it("rejects data-modifying CTEs (WITH ... INSERT)", () => {
    const r = validateReadOnlySql("with x as (insert into audit_requests (name) values ('x') returning 1) select * from x");
    expect(r.ok).toBe(false);
  });

  it("rejects semicolons hidden in comments", () => {
    const r = validateReadOnlySql("select 1; -- trailing\nselect 2");
    expect(r.ok).toBe(false);
  });

  it("rejects block comments hiding statements", () => {
    const r = validateReadOnlySql("select /* */ 1; select 2");
    expect(r.ok).toBe(false);
  });

  it("rejects dollar-quoted strings", () => {
    const r = validateReadOnlySql("select $$select 1$$");
    expect(r.ok).toBe(false);
  });

  it("rejects oversized queries", () => {
    const r = validateReadOnlySql("select " + "x ".repeat(21_000));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/20,000/i);
  });

  it("does not false-positive on column names containing keywords as substrings", () => {
    // "settings" contains "set"; "updated_at" contains "update" — neither
    // should trip the keyword guard because of word boundaries.
    const r = validateReadOnlySql("select settings, updated_at from projects");
    expect(r.ok).toBe(true);
  });
});
