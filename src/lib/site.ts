/**
 * Canonical site origin — the single source of truth for sitemap.xml,
 * robots.txt, canonical URLs and structured data.
 *
 * Why this file exists: a sitemap that advertises `http://localhost:3000/...`
 * is worse than no sitemap at all — Google crawls it, finds nothing reachable,
 * and drops the URLs. Every URL the site publishes to crawlers must resolve to
 * the live domain, so the fallback below is the production domain and never
 * localhost.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL            — explicit override (dev / custom domain)
 *   2. VERCEL_PROJECT_PRODUCTION_URL   — stable production domain on Vercel
 *   3. VERCEL_URL                      — the current deployment (preview builds)
 *   4. PRODUCTION_FALLBACK             — the live domain, hard-coded on purpose
 */

const PRODUCTION_FALLBACK = "https://abdulrehman-qa.vercel.app";

const LOCAL_HOST = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/i;

/** Accepts "example.com", "https://example.com/", "http://x.dev/path" → origin. */
function normalizeOrigin(raw: string | undefined | null): string | null {
  if (!raw) return null;
  let value = raw.trim();
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
  try {
    const { protocol, hostname, origin } = new URL(value);
    if (protocol !== "http:" && protocol !== "https:") return null;
    if (!hostname) return null;
    return origin.replace(/\/+$/, "");
  } catch {
    return null;
  }
}

function isLocal(url: string): boolean {
  try {
    return LOCAL_HOST.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

function resolveSiteUrl(): string {
  const explicit = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);

  // In a production build, an accidentally-committed localhost value must not
  // poison the sitemap — ignore it and fall through to the real domain.
  if (explicit && !(process.env.NODE_ENV === "production" && isLocal(explicit))) {
    return explicit;
  }

  // Vercel injects these without a protocol (e.g. "my-store.vercel.app").
  const vercel =
    normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    normalizeOrigin(process.env.VERCEL_URL);
  if (vercel) return vercel;

  // Local development: localhost is the correct, crawlable-off origin.
  if (process.env.NODE_ENV !== "production") {
    return explicit ?? "http://localhost:3000";
  }

  return PRODUCTION_FALLBACK;
}

/** Absolute site origin, no trailing slash. e.g. "https://example.com" */
export const SITE_URL = resolveSiteUrl();

/** Site name used across structured data and metadata. */
export const SITE_NAME = "QA Specialist";

/** Absolute URL for any site-relative path. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Default social share image. Served by the generated `opengraph-image` route,
 * which Next.js also injects into metadata for every page automatically.
 */
export const DEFAULT_OG_IMAGE = absoluteUrl("/opengraph-image");

/**
 * Absolute URL of a generated social share card for a page.
 * Rendered by the /og route from the page's own title and kicker.
 */
export function socialCardUrl({ title, kicker }: { title: string; kicker?: string }): string {
  const params = new URLSearchParams({ t: title });
  if (kicker) params.set("k", kicker);
  return absoluteUrl(`/og?${params.toString()}`);
}
