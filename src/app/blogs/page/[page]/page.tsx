import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { stubOf, ARTICLE_CATEGORIES } from "@/data/articles";
import { allBlogArticles, searchAllArticles } from "@/data/legacy-articles";
import { CategoryChips, IndexCard, Pagination, SearchBox, PAGE_SIZE } from "@/components/blog/BlogIndex";

interface Props {
  params: Promise<{ page: string }>;
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}

export function generateStaticParams() {
  const total = Math.ceil(allBlogArticles().length / PAGE_SIZE);
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `Blog — Page ${page} | QA Insights, Guides & Store Case Studies`,
    description: "All Shopify QA articles, continuation pages: conversion teardowns, AOV plays, AI testing workflows and store case stories.",
    alternates: { canonical: `/blogs/page/${page}` },
  };
}

export default async function BlogPageN({ params, searchParams }: Props) {
  const { page: pageParam } = await params;
  const { category, q, sort } = await searchParams;
  const page = Number(pageParam);
  if (!Number.isInteger(page) || page < 1) notFound();
  if (page === 1) redirect("/blogs");

  const validCategory = category && ARTICLE_CATEGORIES.includes(category as (typeof ARTICLE_CATEGORIES)[number]) ? category : undefined;
  const sortKey = ["newest", "oldest", "az"].includes(sort ?? "") ? sort! : "newest";
  let list = (q && q.trim() ? searchAllArticles(q) : allBlogArticles());
  if (validCategory) list = list.filter((a) => a.category === validCategory);
  if (sortKey === "oldest") list = [...list].reverse();
  if (sortKey === "az") list = [...list].sort((x, y) => x.title.localeCompare(y.title));

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  if (page > totalPages) notFound();
  const pageItems = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filtered = Boolean((q && q.trim()) || validCategory);

  return (
    <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700, marginBottom: "0.75rem" }}>
          Page {page} of {totalPages} · {list.length} articles
        </p>
        <h1 style={{ fontSize: "clamp(1.625rem, 3.5vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--text-primary)", margin: "0 0 1rem" }}>
          {filtered ? "Filtered articles" : "All articles"} — continued
        </h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1.25rem" }}>
          <SearchBox q={q} category={validCategory} />
          <Link href="/blogs" style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: "var(--text-tertiary)" }}>
            ← Back to latest
          </Link>
        </div>
        <CategoryChips active={validCategory} q={q} />
      </header>

      <div className="blog-grid">
        {pageItems.map((a) => <IndexCard key={a.slug} a={stubOf(a)} />)}
      </div>

      <Pagination page={page} totalPages={totalPages} category={validCategory} q={q} sort={sortKey} />
    </div>
  );
}
