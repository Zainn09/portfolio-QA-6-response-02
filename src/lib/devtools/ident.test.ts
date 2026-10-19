import { describe, it, expect } from "vitest";
import { isSafeIdentifier } from "./ident";

describe("isSafeIdentifier", () => {
  it("accepts ordinary Postgres identifiers", () => {
    expect(isSafeIdentifier("audit_requests")).toBe(true);
    expect(isSafeIdentifier("_private")).toBe(true);
    expect(isSafeIdentifier("Table1")).toBe(true);
  });

  it("rejects empty, long and quoted input", () => {
    expect(isSafeIdentifier("")).toBe(false);
    expect(isSafeIdentifier(null)).toBe(false);
    expect(isSafeIdentifier(undefined)).toBe(false);
    expect(isSafeIdentifier("a".repeat(129))).toBe(false);
    expect(isSafeIdentifier('"audit_requests"')).toBe(false);
  });

  it("rejects injection-shaped input", () => {
    for (const bad of ["audit; drop table x", "audit_requests--", "1abc", "has space", "with.dot", "a'b"]) {
      expect(isSafeIdentifier(bad), bad).toBe(false);
    }
  });
});
