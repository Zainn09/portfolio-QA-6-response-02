import type { MetadataRoute } from "next";
import { getAllProjects } from "@/data/projects";
import { getAllArticles, ARTICLE_CATEGORIES, type BlogArticle } from "@/data/articles";
import { allBlogArticles } from "@/data/legacy-articles";
import { categorySlug } from "@/components/blog/categories";
import { PAGE_SIZE } from "@/components/blog/BlogIndex";
import { absoluteUrl } from "@/lib/site";

/**
 * Full XML sitemap — every crawlable page on the site:
 *
 *   • 8 core pages            (/, /work, /blogs, /audit, /about, /contact, /privacy, /terms)
 *   • 93 case studies         (/work/[slug], published only — mirrors the /work archive)
 *   • 305 blog articles       (/blogs/[slug] — 299 generated + 6 legacy posts)
 *   • 6 topic hubs            (/blogs/category/[category])
 *   • paginated indexes       (/blogs/page/[n], /blogs/category/[c]/page/[n])
 *
 * Pagination ranges are derived from the exact same data sources the pages
 * themselves use, so the sitemap can never advertise a URL that 404s.
 *
 * `<lastmod>` is taken from real content timestamps (publish dates) rather
 * than the build clock. Google discounts lastmod values that change on every
 * deploy, so an honest date is worth more than a fresh one.
 */

type Entry = MetadataRoute.Sitemap[number];

/** Pages that exist as static routes, with their relative SEO weight. */
const CORE_PAGES: { path: string; changeFrequency: Entry["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/work", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blogs", changeFrequency: "daily", priority: 0.9 },
  { path: "/audit", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

const parseDate = (iso?: string): Date | undefined => {
  if (!iso) return undefined;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? undefined : new Date(t);
};

const newestOf = (dates: (Date | undefined)[]): Date | undefined =>
  dates.reduce<Date | undefined>(
    (acc, d) => (d && (!acc || d > acc) ? d : acc),
    undefined
  );

/**
 * Hero images, where they exist (legacy posts have none).
 * Image sitemaps require absolute URLs, so same-origin paths like
 * `/images/case-studies/...` are resolved against the live domain.
 */
const imagesOf = (heroImage?: string): string[] | undefined => {
  const src = heroImage?.trim();
  if (!src) return undefined;
  return [absoluteUrl(src)];
};

export default function sitemap(): MetadataRoute.Sitemap {
  // Published projects only — the same set the /work archive renders.
  const projects = getAllProjects();

  // Every article shown on /blogs (generated matrix + legacy posts), newest first.
  const posts = allBlogArticles();

  // The generated matrix only — this is what the category hubs and their
  // pagination slice, so category counts must be derived from it.
  const categorySource = getAllArticles();

  const newestPost = posts.length ? parseDate(posts[0].publishedAt) : undefined;

  // Newest article attached to each project → an honest lastmod for case studies.
  const newestByProject = new Map<string, Date>();
  for (const a of categorySource) {
    if (!a.projectSlug || newestByProject.has(a.projectSlug)) continue; // list is date-desc
    const d = parseDate(a.publishedAt);
    if (d) newestByProject.set(a.projectSlug, d);
  }

  /* ── Core pages ───────────────────────────────────────────────────────── */
  const coreRoutes: Entry[] = CORE_PAGES.map((page) => ({
    url: absoluteUrl(page.path),
    // Index pages change whenever new content lands; legal pages don't.
    lastModified:
      page.path === "/" || page.path === "/blogs"
        ? newestPost
        : page.path === "/work"
          ? newestOf([...newestByProject.values()])
          : undefined,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  /* ── Blog index pagination (/blogs/page/2 … n) ─────────────────────────── */
  const blogIndexPages = Math.ceil(posts.length / PAGE_SIZE);
  const blogPaginationRoutes: Entry[] = [];
  for (let page = 2; page <= blogIndexPages; page++) {
    const first = posts[(page - 1) * PAGE_SIZE];
    blogPaginationRoutes.push({
      url: absoluteUrl(`/blogs/page/${page}`),
      lastModified: first ? parseDate(first.publishedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.4,
    });
  }

  /* ── Topic hubs + their pagination ────────────────────────────────────── */
  const categoryRoutes: Entry[] = [];
  for (const category of ARTICLE_CATEGORIES) {
    const slug = categorySlug(category);
    const inCategory = categorySource.filter((a) => a.category === category);
    const newestInCategory = inCategory.length
      ? parseDate(inCategory[0].publishedAt)
      : undefined;

    categoryRoutes.push({
      url: absoluteUrl(`/blogs/category/${slug}`),
      lastModified: newestInCategory,
      changeFrequency: "weekly",
      priority: 0.75,
    });

    const pages = Math.ceil(inCategory.length / PAGE_SIZE);
    for (let page = 2; page <= pages; page++) {
      const first = inCategory[(page - 1) * PAGE_SIZE];
      categoryRoutes.push({
        url: absoluteUrl(`/blogs/category/${slug}/page/${page}`),
        lastModified: first ? parseDate(first.publishedAt) : undefined,
        changeFrequency: "weekly",
        priority: 0.35,
      });
    }
  }

  /* ── Case studies ─────────────────────────────────────────────────────── */
  const projectRoutes: Entry[] = projects.map((p) => ({
    url: absoluteUrl(`/work/${p.slug}`),
    lastModified: newestByProject.get(p.slug),
    changeFrequency: "monthly",
    priority: p.featured ? 0.8 : 0.7,
    images: imagesOf(p.heroImage),
  }));

  /* ── Blog articles ────────────────────────────────────────────────────── */
  const blogRoutes: Entry[] = posts.map((a: BlogArticle) => ({
    url: absoluteUrl(`/blogs/${a.slug}`),
    lastModified: parseDate(a.publishedAt),
    changeFrequency: "monthly",
    priority: a.featured ? 0.8 : 0.7,
    images: imagesOf(a.heroImage),
  }));

  return [
    ...coreRoutes,
    ...blogPaginationRoutes,
    ...categoryRoutes,
    ...projectRoutes,
    ...blogRoutes,
  ];
}
