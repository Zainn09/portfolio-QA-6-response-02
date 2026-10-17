/**
 * Lightweight in-memory rate limiter for authentication and sensitive
 * endpoints.
 *
 * Honest limitation: Vercel runs functions across multiple instances, so this
 * limits per-instance, not per-account. It is a meaningful brake against
 * brute force (orders of magnitude fewer attempts get through) while staying
 * dependency-free; it is not a substitute for upstream WAF limits, which
 * should be added if the login page is under sustained attack.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}

// Keep the map from growing unbounded (dev + low-traffic prod is fine either
// way, but this is cheap insurance).
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (now > bucket.resetAt) buckets.delete(key);
    }
  }, 60_000);
  timer.unref?.();
}
