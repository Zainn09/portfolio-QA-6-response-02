import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getAllArticles, stubOf } from "@/data/articles";
import { categoryFromSlug, categorySlug, CLUSTER_COPY } from "@/components/blog/categories";
import { IndexCard, Pagination, PAGE_SIZE } from "@/components/blog/BlogIndex";

export const dynamicParams = false;

interface Props {
  params: Promise<{ category: string; page: string }>;
}

export function generateStaticParams() {
  const out: { category: string; page: string }[] = [];
  for (const c of ["CRO", "AOV & Merchandising", "AI Commerce", "eCommerce Growth", "UX & Performance", "Shopify"]) {
    const total = Math.ceil(getAllArticles().filter((a) => a.category === c).length / PAGE_SIZE);
    for (let n = 2; n <= total; n++) out.push({ category: categorySlug(c), page: String(n) });
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, page } = await params;
  const name = categoryFromSlug(category);
  if (!name) return {};
  return {
    title: `${name} Articles — Page ${page}`,
    description: CLUSTER_COPY[name]?.deck ?? `All ${name} articles, page ${page}.`,
    alternates: { canonical: `/blogs/category/${category}/page/${page}` },
  };
}

export default async function CategoryPageN({ params }: Props) {
  const { category, page: pageParam } = await params;
  const name = categoryFromSlug(category);
  if (!name) notFound();
  const page = Number(pageParam);
  if (!Number.isInteger(page) || page < 1) notFound();
  if (page === 1) redirect(`/blogs/category/${category}`);

  const list = getAllArticles().filter((a) => a.category === name);
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  if (page > totalPages) notFound();
  const pageItems = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container" style={{ paddingTop: "calc(var(--nav-height) + 3rem)", paddingBottom: "5rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700, marginBottom: "0.75rem" }}>
          {name} · page {page} of {totalPages}
        </p>
        <h1 style={{ fontSize: "clamp(1.625rem, 3.5vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 1.25rem" }}>
          {name} articles — continued
        </h1>
      </header>
      <div className="blog-grid">
        {pageItems.map((a) => <IndexCard key={a.slug} a={stubOf(a)} />)}
      </div>
      <Pagination page={page} totalPages={totalPages} basePath={`/blogs/category/${category}`} />
    </div>
  );
}
