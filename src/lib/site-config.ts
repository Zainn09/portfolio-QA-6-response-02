/**
 * Single source of truth for the site's absolute base URL.
 *
 * Used by `metadataBase` (canonical / Open Graph URLs), `sitemap.ts` and
 * `robots.ts`. Previously each of those fell back to `http://localhost:3000`,
 * which meant the *deployed* site published a sitemap and a `Sitemap:`
 * directive full of localhost URLs — Google cannot crawl those, so indexing
 * (and Search Console verification by sitemap) silently fails.
 *
 * Resolution order:
 *   1. `NEXT_PUBLIC_SITE_URL` — explicit override, always wins.
 *   2. Vercel production deployment — derived from the project's production
 *      domain (`https://<project>.vercel.app`, or the custom domain once one
 *      is attached). Only used for real production builds, never for preview
 *      deployments, so preview URLs don't leak into the sitemap.
 *   3. `http://localhost:3000` — local development.
 */
const LOCAL_FALLBACK = "http://localhost:3000";

/** Vercel exposes these on every build; they are empty/undefined locally. */
const vercelEnv = process.env.VERCEL_ENV;
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  if (vercelEnv === "production" && vercelUrl) {
    return `https://${vercelUrl}`.replace(/\/$/, "");
  }

  return LOCAL_FALLBACK;
}

export const SITE_URL = resolveSiteUrl();

/** `abdulrehman-qa.vercel.app` — host only, for logging/verification checks. */
export const SITE_HOST = new URL(SITE_URL).host;
