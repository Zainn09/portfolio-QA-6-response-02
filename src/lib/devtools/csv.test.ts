import { describe, it, expect } from "vitest";
import { toCsv } from "./csv";

describe("toCsv", () => {
  it("writes a header row and data rows", () => {
    const csv = toCsv(["a", "b"], [[1, 2], [3, 4]]);
    expect(csv).toBe("a,b\r\n1,2\r\n3,4");
  });

  it("quotes fields containing commas, quotes or newlines (RFC 4180)", () => {
    const csv = toCsv(["name", "note"], [["Smith, John", 'say "hi"'], ["Jane", "line1\nline2"]]);
    const lines = csv.split("\r\n");
    expect(lines[1]).toBe('"Smith, John","say ""hi"""');
    expect(lines[2]).toBe('Jane,"line1\nline2"');
  });

  it("renders null and undefined as empty fields", () => {
    const csv = toCsv(["a", "b"], [[null, undefined]]);
    expect(csv.split("\r\n")[1]).toBe(",");
  });

  it("stringifies numbers", () => {
    const csv = toCsv(["n"], [[42]]);
    expect(csv.split("\r\n")[1]).toBe("42");
  });
});
