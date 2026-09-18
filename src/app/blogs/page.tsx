import type { Metadata } from "next";
import Link from "next/link";
import { articles, stubOf, ARTICLE_CATEGORIES } from "@/data/articles";
import { categorySlug } from "@/components/blog/categories";
import { allBlogArticles, searchAllArticles } from "@/data/legacy-articles";
import { CategoryChips, FeaturedCard, IndexCard, Pagination, SearchBox, PAGE_SIZE } from "@/components/blog/BlogIndex";

interface Props {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}

const SORTS = ["newest", "oldest", "az"] as const;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category, q } = await searchParams;
  const suffix = q ? ` — “${q}”` : category ? ` — ${category}` : "";
  // Filtered views canonicalize to their crawlable equivalents (cluster hubs / clean index)
  const canonical = category
    ? `/blogs/category/${categorySlug(category)}`
    : "/blogs";
  return {
    title: `Blog — QA Insights, Guides & Store Case Studies${suffix}`,
    description:
      "Practical Shopify QA: conversion-rate teardowns, AOV and merchandising fixes, AI-assisted testing workflows, and case stories from 93 real storefronts.",
    alternates: { canonical },
    openGraph: {
      title: `Blog — QA Insights, Guides & Store Case Studies${suffix}`,
      description: "Conversion teardowns, AOV plays, AI testing workflows and store case stories from 93 real Shopify audits.",
      type: "website",
    },
  };
}

export default async function BlogsPage({ searchParams }: Props) {
  const { category, q, sort } = await searchParams;
  const validCategory = category && ARTICLE_CATEGORIES.includes(category as (typeof ARTICLE_CATEGORIES)[number]) ? category : undefined;
  const sortKey = SORTS.includes((sort ?? "") as (typeof SORTS)[number]) ? (sort as (typeof SORTS)[number]) : "newest";

  const featured = articles.find((a) => a.featured);
  let list = (q && q.trim() ? searchAllArticles(q) : allBlogArticles());
  if (featured && !q?.trim()) list = list.filter((a) => a.slug !== featured.slug);
  if (validCategory) list = list.filter((a) => a.category === validCategory);
  if (sortKey === "oldest") list = [...list].reverse();
  if (sortKey === "az") list = [...list].sort((x, y) => x.title.localeCompare(y.title));

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const pageItems = list.slice(0, PAGE_SIZE);
  const filtered = Boolean((q && q.trim()) || validCategory);
  const totalCount = (q && q.trim() ? list.length : list.length + (featured && !validCategory ? 1 : 0));

  return (
    <div className="container" style={{ paddingTop: "calc(var(--nav-height) + 3rem)", paddingBottom: "5rem" }}>
      {/* Masthead */}
      <header style={{ marginBottom: "2.5rem" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700, marginBottom: "0.75rem" }}>
          {totalCount} articles · {ARTICLE_CATEGORIES.length} topics · updated weekly
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text-primary)", margin: "0 0 1rem", maxWidth: "52rem" }}>
          The field notes of a store QA specialist
        </h1>
        <p style={{ fontSize: "1.125rem", lineHeight: 1.7, color: "var(--text-secondary)", margin: "0 0 1.75rem", maxWidth: "44rem" }}>
          Conversion teardowns, average-order-value plays, AI-assisted testing workflows and UX fixes — each one drawn from a real Shopify audit with screenshots, defect counts and post-fix numbers.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1.5rem" }}>
          <SearchBox q={q} category={validCategory} />
          <Link href="/work" style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: "var(--text-tertiary)" }}>
            Prefer full case studies? Browse /work →
          </Link>
        </div>
        <CategoryChips active={validCategory} q={q} />
      </header>

      {/* Featured spotlight — only on the unfiltered first page */}
      {!filtered && featured && (
        <section aria-label="Featured article" style={{ marginBottom: "3rem" }}>
          <FeaturedCard a={stubOf(featured)} />
        </section>
      )}

      {/* Result line */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.375rem", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
          {filtered ? `${list.length} result${list.length === 1 ? "" : "s"}` : "Latest articles"}
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {validCategory && <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", margin: 0 }}>Topic: {validCategory}</p>}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>Sort</span>
            {SORTS.map((sk) => {
              const sp = new URLSearchParams();
              if (validCategory) sp.set("category", validCategory);
              if (q) sp.set("q", q);
              if (sk !== "newest") sp.set("sort", sk);
              const qs = sp.toString();
              return (
                <Link key={sk} href={`/blogs${qs ? `?${qs}` : ""}`} style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: sortKey === sk ? 700 : 400, color: sortKey === sk ? "var(--accent)" : "var(--text-tertiary)", borderBottom: sortKey === sk ? "1px solid var(--accent)" : "none", paddingBottom: "1px" }}>
                  {sk === "az" ? "A–Z" : sk === "newest" ? "Newest" : "Oldest"}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      {pageItems.length === 0 ? (
        <div style={{ border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)", padding: "3rem 2rem", textAlign: "center" }}>
          <p style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>No articles match that search.</p>
          <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", margin: 0 }}>
            Try a broader term, or <Link href="/blogs" style={{ color: "var(--accent)", fontWeight: 600 }}>reset the filters</Link>.
          </p>
        </div>
      ) : (
        <div className="blog-grid">
          {pageItems.map((a) => <IndexCard key={a.slug} a={stubOf(a)} />)}
        </div>
      )}

      <Pagination page={1} totalPages={totalPages} category={validCategory} q={q} sort={sortKey} />
    </div>
  );
}
