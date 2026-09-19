import type { BlogArticle } from "@/data/articles";
import { getAllArticles, searchArticles } from "@/data/articles";
import { staticBlogPosts } from "@/data/blogs";

/** The 8 legacy hand-written posts, mapped onto the same article shape. */
export const legacyArticles: BlogArticle[] = staticBlogPosts.map((p, i) => ({
  id: 9000 + i,
  title: p.title,
  slug: p.slug,
  excerpt: p.excerpt ?? p.title,
  articleType: (p.category.includes("AI") ? "insight" : "guide") as BlogArticle["articleType"],
  category: p.category.includes("AI") ? "AI Commerce" : p.category.includes("Checkout") ? "CRO" : "UX & Performance",
  tags: [p.category],
  projectSlug: "",
  projectTitle: "",
  primaryKeyword: p.title,
  searchIntent: "informational",
  metaTitle: p.title,
  metaDescription: p.excerpt ?? p.title,
  heroImage: "",
  heroAlt: p.title,
  author: "Zain",
  authorRole: "Founder & QA Lead",
  publishedAt: p.publishedAt,
  readingTime: p.readMinutes,
  featured: Boolean(p.trending),
  body: [{ type: "html", html: p.content }],
  faq: [],
}));

/** Every article on the site — generated matrix first-class, legacy posts included. */
export const allBlogArticles = (): BlogArticle[] =>
  [...getAllArticles(), ...legacyArticles].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

/** Search across both the generated matrix and the legacy posts. */
export const searchAllArticles = (q: string): BlogArticle[] => {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  const legacyHits = legacyArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(needle) ||
      a.excerpt.toLowerCase().includes(needle) ||
      a.category.toLowerCase().includes(needle) ||
      a.tags.some((t) => t.toLowerCase().includes(needle))
  );
  return [...searchArticles(q), ...legacyHits].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
};
