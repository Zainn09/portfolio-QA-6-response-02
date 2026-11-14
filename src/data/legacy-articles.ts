import type { BlogArticle } from "@/data/articles";
import { getAllArticles, searchArticles } from "@/data/articles";
import { techOutlookArticles } from "@/data/tech-outlook-articles";
import { staticBlogPosts } from "@/data/blogs";
import { editorialArticles } from "@/data/editorial-articles";

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
  // These static posts carry their own SEO title/description (the "| …"
  // brand-suffix era); use them instead of the display title — and emit
  // them verbatim (absolute) since they are complete titles already.
  metaTitle: p.seoTitle,
  titleAbsolute: true,
  metaDescription: p.seoDescription,
  heroImage: "",
  heroAlt: p.title,
  author: "ABDULREHMAN",
  authorRole: "Founder & QA Lead",
  publishedAt: p.publishedAt,
  readingTime: p.readMinutes,
  featured: Boolean(p.trending),
  body: [{ type: "html", html: p.content }],
  faq: [],
}));

/** Every article on the site — generated matrix first-class, legacy posts included. */
export const allBlogArticles = (): BlogArticle[] =>
  [...getAllArticles(), ...legacyArticles, ...editorialArticles, ...techOutlookArticles].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );

/**
 * The articles a /blogs/category/<slug> hub lists.
 * Established hubs (categories present in the generated matrix) keep slicing
 * the matrix, exactly as before. Hand-written clusters introduce new
 * categories that do not exist in the matrix; their hub aggregates every
 * git-served source for that category instead.
 */
export const getCategoryArticles = (name: string): BlogArticle[] => {
  const matrix = getAllArticles().filter((a) => a.category === name);
  if (matrix.length > 0) return matrix;
  return allBlogArticles().filter((a) => a.category === name);
};

/** Search across the generated matrix, the legacy posts, the editorial series and the technology cluster. */
export const searchAllArticles = (q: string): BlogArticle[] => {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  const otherHits = [...legacyArticles, ...editorialArticles, ...techOutlookArticles].filter(
    (a) =>
      a.title.toLowerCase().includes(needle) ||
      a.excerpt.toLowerCase().includes(needle) ||
      a.category.toLowerCase().includes(needle) ||
      a.tags.some((t) => t.toLowerCase().includes(needle))
  );
  return [...searchArticles(q), ...otherHits].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
};
