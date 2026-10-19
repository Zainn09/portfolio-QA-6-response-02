import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * robots.txt — opens every public page to crawlers and keeps private
 * surfaces (admin, API, auth) out of the index.
 *
 * Deliberate choices:
 *   • `/api/` is disallowed with a trailing slash so it can't accidentally
 *     block unrelated paths that merely start with "api".
 *   • Filtered blog URLs (`/blogs?q=…`, `?sort=…`) are NOT blocked. They
 *     canonicalise to /blogs, and blocking them would hide that canonical
 *     signal from Google — the tag only works on pages it can crawl.
 *   • AI crawlers are intentionally allowed: answer engines and AI search
 *     surface this content, and being quoted there is a distribution channel.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/_next/webpack-hmr",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
