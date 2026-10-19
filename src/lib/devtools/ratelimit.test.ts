import { describe, it, expect } from "vitest";
import { rateLimit } from "./ratelimit";

describe("rateLimit", () => {
  it("allows up to the limit within the window", () => {
    const key = `test:${Date.now()}:${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(key, 3, 60_000)).toBe(true);
    }
    expect(rateLimit(key, 3, 60_000)).toBe(false);
    expect(rateLimit(key, 3, 60_000)).toBe(false);
  });

  it("tracks keys independently", () => {
    const a = `a:${Date.now()}:${Math.random()}`;
    const b = `b:${Date.now()}:${Math.random()}`;
    rateLimit(a, 1, 60_000);
    expect(rateLimit(a, 1, 60_000)).toBe(false);
    expect(rateLimit(b, 1, 60_000)).toBe(true);
  });

  it("resets after the window elapses", async () => {
    const key = `win:${Date.now()}:${Math.random()}`;
    expect(rateLimit(key, 1, 40)).toBe(true);
    expect(rateLimit(key, 1, 40)).toBe(false);
    await new Promise((r) => setTimeout(r, 60));
    expect(rateLimit(key, 1, 40)).toBe(true);
  });
});
