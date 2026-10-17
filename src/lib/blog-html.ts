import "server-only";
import { desc, eq } from "drizzle-orm";
import { blogPosts } from "@/db/schema";
import type { BlogArticle } from "@/data/articles";

/**
 * Blog posts written in the /admin content editor (stored in Postgres as HTML)
 * and the small shared surface that publishes them.
 *
 * Design rules:
 * - The public site must keep working when the database is unreachable or not
 *   configured: every lookup degrades to "no database posts" and the
 *   git-served articles render exactly as before.
 * - HTML is stored authored-by-admin, but it still goes through a sanitizer
 *   before it is saved (admin API) — pasted rich content from the web can
 *   carry scripts and event handlers, and the public pages render it.
 */

export interface DbBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  author: string | null;
  publishedAt: string | null;
  category: string | null;
  tags: string[];
  content: string | null;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
}

/**
 * Strip anything that can execute code or navigate away from the page:
 * script/style/iframe/object/embed/form/meta/link/base elements, inline event
 * handlers (on*) and javascript: URLs. Plain formatting HTML passes through.
 */
export function sanitizeBlogHtml(html: string): string {
  if (!html) return html;
  return html
    .replace(/<\s*(script|style|iframe|object|embed|form|meta|link|base)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|form|meta|link|base)[^>]*\/?\s*>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(xlink:href)\s*=\s*(["']?)\s*javascript:[^"'>\s]*\2/gi, " $1=$2#")
    .replace(/(href|src)\s*=\s*(["']?)\s*javascript:[^"'>\s]*\2/gi, "$1=$2#");
}

function estimateReadingTime(html: string | null): number {
  if (!html) return 1;
  const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/**
 * Published database posts, newest first. Returns [] when the database is
 * absent, unreachable, or has no published posts — the public blog simply
 * shows its git-served articles in that case.
 */
export async function getPublishedDbPosts(): Promise<DbBlogPost[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    // Imported lazely so pure-helper usage (and deployments without
    // DATABASE_URL) never touches the connection pool.
    const { db } = await import("@/db");
    const rows = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt));
    return (rows as unknown as DbBlogPost[]).filter(
      (r) => r.slug && r.title && r.content && r.publishedAt,
    );
  } catch {
    return [];
  }
}

export async function getPublishedDbPostBySlug(slug: string): Promise<DbBlogPost | null> {
  const all = await getPublishedDbPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

/**
 * Convert a database post into the same shape the git-served articles use,
 * so listings, search and cards treat both sources identically. The body is
 * empty — HTML posts render their (sanitized) content on the slug page.
 */
export function dbPostToArticle(p: DbBlogPost): BlogArticle {
  const excerpt = (p.excerpt ?? "").trim();
  return {
    id: 9000 + p.id,
    title: p.title,
    slug: p.slug,
    excerpt: excerpt || (p.content ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200),
    articleType: "insight",
    category: p.category ?? "Field Notes",
    tags: Array.isArray(p.tags) ? p.tags : [],
    projectSlug: "",
    projectTitle: "",
    primaryKeyword: "",
    searchIntent: "informational",
    metaTitle: p.seoTitle || p.title,
    metaDescription: p.seoDescription || excerpt || "",
    heroImage: p.featuredImage ?? "",
    heroAlt: p.title,
    author: p.author || "QA Specialist",
    authorRole: "QA Specialist",
    publishedAt: p.publishedAt as string,
    readingTime: estimateReadingTime(p.content),
    featured: false,
    body: [],
    faq: [],
  };
}
