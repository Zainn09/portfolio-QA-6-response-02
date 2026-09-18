import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllArticles, stubOf, ARTICLE_CATEGORIES } from "@/data/articles";
import { categoryFromSlug, categorySlug, CLUSTER_COPY } from "@/components/blog/categories";
import { IndexCard, Pagination, PAGE_SIZE } from "@/components/blog/BlogIndex";

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return ARTICLE_CATEGORIES.map((c) => ({ category: categorySlug(c) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const name = categoryFromSlug(category);
  if (!name) return {};
  const deck = CLUSTER_COPY[name]?.deck ?? `All ${name} articles from the QA blog.`;
  return {
    title: `${name} Articles — Shopify QA Insights, Guides & Case Stories`,
    description: deck,
    alternates: { canonical: `/blogs/category/${category}` },
    openGraph: {
      title: `${name} Articles — Shopify QA Insights, Guides & Case Stories`,
      description: deck,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const name = categoryFromSlug(category);
  if (!name) notFound();

  const list = getAllArticles().filter((a) => a.category === name);
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const pageItems = list.slice(0, PAGE_SIZE);
  const others = ARTICLE_CATEGORIES.filter((c) => c !== name);
  const copy = CLUSTER_COPY[name]?.deck ?? `All ${name} articles.`;

  return (
    <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700, marginBottom: "0.75rem" }}>
          Topic cluster · {list.length} articles
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text-primary)", margin: "0 0 1rem" }}>
          {name}
        </h1>
        <p style={{ fontSize: "1.125rem", lineHeight: 1.7, color: "var(--text-secondary)", margin: "0 0 1.5rem", maxWidth: "44rem" }}>{copy}</p>
        <nav aria-label="Other topics" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Link href="/blogs" style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, padding: "0.5rem 1rem", borderRadius: "9999px", border: "1px solid var(--accent)", backgroundColor: "var(--accent)", color: "#000" }}>
            All articles
          </Link>
          {others.map((c) => (
            <Link key={c} href={`/blogs/category/${categorySlug(c)}`} className="article-card" style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, padding: "0.5rem 1rem", borderRadius: "9999px", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              {c}
            </Link>
          ))}
        </nav>
      </header>

      <div className="blog-grid">
        {pageItems.map((a) => <IndexCard key={a.slug} a={stubOf(a)} />)}
      </div>

      <Pagination page={1} totalPages={totalPages} basePath={`/blogs/category/${category}`} />
    </div>
  );
}
