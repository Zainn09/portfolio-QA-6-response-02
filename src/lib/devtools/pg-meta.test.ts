import { describe, expect, it } from "vitest";
import { isDbConnectionError } from "./pg-meta";

function withCode(code: string): Error {
  return Object.assign(new Error(""), { code });
}

describe("isDbConnectionError", () => {
  it("recognizes plain socket errors", () => {
    expect(isDbConnectionError(withCode("ECONNREFUSED"))).toBe(true);
    expect(isDbConnectionError(withCode("ECONNRESET"))).toBe(true);
    expect(isDbConnectionError(withCode("ENOTFOUND"))).toBe(true);
    expect(isDbConnectionError(withCode("28P01"))).toBe(true); // invalid password
    expect(isDbConnectionError(withCode("3D000"))).toBe(true); // database does not exist
  });

  it("recognizes errors wrapped one level deep (drizzle cause chain)", () => {
    const wrapped = Object.assign(new Error("Failed query: select 1"), { cause: withCode("ECONNREFUSED") });
    expect(isDbConnectionError(wrapped)).toBe(true);
  });

  it("recognizes errors wrapped two levels deep", () => {
    const inner = withCode("ECONNRESET");
    const middle = Object.assign(new Error("driver failed"), { cause: inner });
    const outer = Object.assign(new Error("query failed"), { cause: middle });
    expect(isDbConnectionError(outer)).toBe(true);
  });

  it("does not treat query failures as connection errors", () => {
    expect(isDbConnectionError(new Error("relation \"nope\" does not exist"))).toBe(false);
    expect(isDbConnectionError(Object.assign(new Error("syntax error at or near"), { code: "42601" }))).toBe(false);
    expect(isDbConnectionError(null)).toBe(false);
    expect(isDbConnectionError(undefined)).toBe(false);
    expect(isDbConnectionError("a string")).toBe(false);
  });
});
