import { describe, it, expect } from "vitest";
import { sealData, unsealData } from "iron-session";

/**
 * Session sealing round-trip — the exact primitives the devtools session
 * layer uses to sign the admin cookie. A valid seal must unseal to the same
 * payload; a tampered seal or a wrong key must fail.
 */
const SECRET = "test-secret-0123456789-0123456789";
const TTL = 7 * 24 * 3600;

describe("session sealing (iron-session primitives)", () => {
  it("seals and unseals the same payload", async () => {
    const payload = { userId: 1, email: "admin@example.com", signedInAt: "2026-10-16T00:00:00.000Z" };
    const seal = await sealData(payload, { password: SECRET, ttl: TTL });
    expect(typeof seal).toBe("string");
    expect(seal.length).toBeGreaterThan(20);
    const unsealed = await unsealData(seal, { password: SECRET, ttl: TTL });
    expect(unsealed).toEqual(payload);
  });

  it("returns an empty session for a tampered seal (v9 never throws)", async () => {
    const payload = { userId: 1, email: "admin@example.com" };
    const seal = await sealData(payload, { password: SECRET, ttl: TTL });
    const tampered = seal.slice(0, -4) + "abcd";
    const unsealed = await unsealData(tampered, { password: SECRET, ttl: TTL });
    expect(unsealed).toEqual({});
  });

  it("reports tampering via onUnsealError", async () => {
    const payload = { userId: 1, email: "admin@example.com" };
    const seal = await sealData(payload, { password: SECRET, ttl: TTL });
    const tampered = seal.slice(0, -4) + "abcd";
    let reported = null as unknown;
    await unsealData(tampered, {
      password: SECRET,
      ttl: TTL,
      onUnsealError: (reason, error) => {
        reported = { reason, error };
      },
    });
    expect(reported).not.toBeNull();
    expect((reported as { reason: string }).reason).toBeTruthy();
  });

  it("returns an empty session for the wrong secret", async () => {
    const payload = { userId: 1, email: "admin@example.com" };
    const seal = await sealData(payload, { password: SECRET, ttl: TTL });
    const unsealed = await unsealData(seal, { password: "a-different-secret-0123456789-0123456789", ttl: TTL });
    expect(unsealed).toEqual({});
  });

  it("two seals of the same payload differ (fresh signature)", async () => {
    const payload = { userId: 1, email: "admin@example.com" };
    const a = await sealData(payload, { password: SECRET, ttl: TTL });
    const b = await sealData(payload, { password: SECRET, ttl: TTL });
    expect(a).not.toBe(b);
    // both still verify
    expect(await unsealData(a, { password: SECRET, ttl: TTL })).toEqual(payload);
    expect(await unsealData(b, { password: SECRET, ttl: TTL })).toEqual(payload);
  });
});
