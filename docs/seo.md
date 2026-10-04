# SEO infrastructure

Everything crawlers read is generated from the same data sources the pages
render from, so the published URLs can never drift from the live site.

| Surface | Route | What it does |
| --- | --- | --- |
| Sitemap | `/sitemap.xml` | Every crawlable URL (currently 468) |
| Robots | `/robots.txt` | Opens public pages, blocks `/admin` + `/api/`, points to the sitemap |
| RSS feed | `/feed.xml` | Latest 50 articles — aggregators, feed readers, AI answer engines |
| Social card | `/opengraph-image` | Generated 1200×630 share image for the homepage |
| Social card (per page) | `/og?t=…&k=…` | Generated card carrying a page's own headline — see below |
| Structured data | every page | JSON-LD, see below |

## The canonical origin (`src/lib/site.ts`)

`SITE_URL` is the single source of truth for every absolute URL the site
publishes. **A sitemap pointing at `localhost` is worse than no sitemap** —
Google crawls it, finds nothing, and drops the URLs — so `site.ts` never
falls back to localhost in a production build.

Resolution order:

1. `NEXT_PUBLIC_SITE_URL` (ignored in production if it points at localhost)
2. `VERCEL_PROJECT_PRODUCTION_URL`
3. `VERCEL_URL` (preview deployments)
4. `https://abdulrehman-qa.vercel.app` (hard fallback)

Nothing to configure on Vercel for the current domain. To move to a custom
domain, set `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` and update
`PRODUCTION_FALLBACK` in `src/lib/site.ts`. Every canonical tag, the sitemap,
robots, the feed and the structured data follow automatically.

## What the sitemap contains

| Section | Count | Source |
| --- | --- | --- |
| Core pages | 8 | `/`, `/work`, `/blogs`, `/audit`, `/about`, `/contact`, `/privacy`, `/terms` |
| Service pages | 10 | `src/data/services` — see `docs/service-pages-seo-spec.md` |
| Case studies | 93 | `getAllProjects()` — published projects only |
| Blog articles | 305 | `allBlogArticles()` — 299 generated + 6 legacy posts |
| Blog index pagination | 25 | `/blogs/page/2…26`, derived from `PAGE_SIZE` |
| Topic hubs | 6 | `/blogs/category/[category]` |
| Category pagination | 21 | `/blogs/category/[category]/page/[n]` |
| **Total** | **468** | |

Conventions worth preserving:

- **No `page/1` URLs.** Page one is the canonical index; `/blogs/page/1`
  redirects to `/blogs` and is deliberately absent from the sitemap.
- **`lastmod` is real.** It comes from article publish dates, never the build
  clock — Google discounts lastmod values that change on every deploy.
- **No `noindex` pages.** `/admin` and `/api` are excluded (blocked in
  robots.txt); the 404 route sets `robots: { index: false }`.
- **Filtered views are not listed.** `/blogs?q=…`, `?sort=…` and `?category=…`
  canonicalise to `/blogs` or the matching topic hub. robots.txt does *not*
  block them — a canonical tag only works on pages Google is allowed to crawl.

## Structured data (JSON-LD)

Site-wide, from `src/app/layout.tsx` — an entity graph of `Organization`,
`WebSite`, `Person` and `ProfessionalService`, cross-linked by `@id` so
search engines can resolve the site as an entity rather than a loose page.

Per route:

| Route | Schema |
| --- | --- |
| `/work` | `CollectionPage` + `ItemList` (all case studies) + `BreadcrumbList` |
| `/work/[slug]` | `Article` + `BreadcrumbList` |
| `/blogs` | `Blog` (canonical view only) + `BreadcrumbList` |
| `/blogs/category/[category]` | `CollectionPage` + `ItemList` + `BreadcrumbList` |
| `/blogs/[slug]` | `BlogPosting` + `BreadcrumbList` + `FAQPage` (where FAQs exist) |
| 10 service pages | `Service` + `BreadcrumbList` + `FAQPage` |

`ItemList` markup is intentional: it hands crawlers the full index of case
studies and articles in one hop instead of relying on pagination chains.

Validate changes with the [Rich Results Test](https://search.google.com/test/rich-results)
or `curl -s <url> | grep application/ld+json`.

## Verifying locally

```bash
npm run build && npm start

curl -s localhost:3000/robots.txt
curl -s localhost:3000/sitemap.xml | head -20
curl -s localhost:3000/feed.xml | head -20
curl -sI localhost:3000/opengraph-image
```

To re-run the integrity check after adding content — every sitemap URL must
resolve:

```bash
curl -s localhost:3000/sitemap.xml \
  | grep -o '<loc>[^<]*' | sed 's/<loc>//' | sed 's|https://abdulrehman-qa.vercel.app||' \
  | xargs -P 12 -I{} sh -c 'printf "%s %s\n" "$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000{}")" "{}"' \
  | grep -v '^200 ' || echo "all URLs resolve"
```

## Search Console

Ownership is already verified by three methods — see
`docs/google-site-verification.md`. The sitemap is discovered automatically
from `robots.txt`; to submit it manually:
**Sitemaps → `https://abdulrehman-qa.vercel.app/sitemap.xml`**.

Suggested checks after deploying:

1. **Sitemaps** — status "Success", ~458 discovered URLs.
2. **Pages** — watch for "Discovered – currently not indexed" on the older
   articles; that is a crawl-budget signal, not an error.
3. **Enhancements** — confirm Article / FAQ / Breadcrumb rich results are
   detected without errors.

## Adding content

The sitemap, feed and structured data pick up new content automatically —
no manual URL list to maintain:

- **New article** → add to `src/data/articles.ts` (generated) or
  `src/data/blogs.ts` (hand-written). Pagination counts, category hubs and
  `lastmod` recalculate on the next build.
- **New case study** → add to `src/data/projects.ts` with
  `status: "published"`. Drafts stay out of the sitemap and the `/work`
  archive.

## Social cards (`/og`)

`/opengraph-image` serves the homepage card. Every other page that defines its
own `openGraph` block needs an explicit image — Next.js stops merging the
file-based one as soon as a page sets `openGraph` itself.

Service pages use `/og`, which draws a branded 1200×630 card from the page's own
headline and kicker, so no two pages share a preview image:

```ts
const card = socialCardUrl({ title: shopifyQaTesting.h1, kicker: shopifyQaTesting.eyebrow });
// → https://<domain>/og?t=…&k=…
```

The route clamps text on a word boundary so a long headline cannot overflow the
card. Adding this to another page means adding `images` to both its `openGraph`
and `twitter` metadata.

## Client-bundle rule

The root layout renders the navigation, so a client component in the layout ships
its imports to every page as JavaScript. The mega menu therefore receives the six
records it renders as props from the server (`getMegaMenuData()` in
`src/app/layout.tsx`) rather than importing the projects and articles datasets —
that mistake cost ~5 MB of JavaScript on every page before it was fixed.

If you add content-driven UI to the layout, resolve the data on the server and
pass the minimum fields down. Verify with:

```bash
node -e "const d=require('./.next/diagnostics/route-bundle-stats.json');for(const r of d)if(['/','/work','/shopify-qa-testing'].includes(r.route))console.log(r.route, (r.firstLoadUncompressedJsBytes/1024).toFixed(0)+' KB')"
```

Expect roughly 560 KB per page and ~1 MB on the homepage (the extra is the hero
and showreel animation code).
