import Link from "next/link";
import type { CSSProperties } from "react";
import type { ArticleStub } from "@/data/articles";
import { ARTICLE_CATEGORIES } from "@/data/articles";

export const PAGE_SIZE = 12;

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const TYPE_STYLE: Record<string, { bg: string; color: string }> = {
  insight: { bg: "var(--accent)", color: "#000" },
  guide: { bg: "var(--text-primary)", color: "var(--bg-primary)" },
  "case-study": { bg: "var(--critical)", color: "#fff" },
};
const typeLabel = (t: string) => (t === "insight" ? "Insight" : t === "guide" ? "Practical Guide" : "Case Story");

export function IndexCard({ a }: { a: ArticleStub }) {
  const ts = TYPE_STYLE[a.articleType] ?? TYPE_STYLE.insight;
  return (
    <Link href={`/blogs/${a.slug}`} className="article-card" style={{ display: "flex", flexDirection: "column", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden", backgroundColor: "var(--bg-surface)", transition: "border-color 180ms ease" }}>
      {a.heroImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.heroImage} alt={a.heroAlt} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", objectPosition: "top", display: "block" }} />
      ) : (
        <div aria-hidden="true" style={{ width: "100%", aspectRatio: "16/9", backgroundColor: "var(--accent-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)" }}>QA</div>
      )}
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.625rem", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, backgroundColor: ts.bg, color: ts.color, padding: "0.1875rem 0.5rem", borderRadius: "3px" }}>{typeLabel(a.articleType)}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>{a.category}</span>
        </div>
        <h2 style={{ fontSize: "1.0625rem", fontWeight: 700, lineHeight: 1.4, color: "var(--text-primary)", margin: 0 }}>{a.title}</h2>
        <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--text-secondary)", margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.excerpt}</p>
        <div style={{ marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>{fmtDate(a.publishedAt)} · {a.readingTime} min</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: "var(--accent)" }}>Read →</span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedCard({ a }: { a: ArticleStub }) {
  const ts = TYPE_STYLE[a.articleType] ?? TYPE_STYLE.insight;
  return (
    <Link href={`/blogs/${a.slug}`} className="article-card" style={{ display: "grid", gridTemplateColumns: "1fr", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", backgroundColor: "var(--bg-surface)" }}>
      {a.heroImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.heroImage} alt={a.heroAlt} decoding="async" style={{ width: "100%", height: "100%", minHeight: "260px", objectFit: "cover", objectPosition: "top", display: "block" }} />
      )}
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, backgroundColor: "var(--accent)", color: "#000", padding: "0.25rem 0.625rem", borderRadius: "var(--radius-sm)" }}>Featured</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, backgroundColor: ts.bg, color: ts.color, padding: "0.1875rem 0.5rem", borderRadius: "3px" }}>{typeLabel(a.articleType)}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>{a.category}</span>
        </div>
        <h2 style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.875rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2, color: "var(--text-primary)", margin: 0 }}>{a.title}</h2>
        <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--text-secondary)", margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.excerpt}</p>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: "var(--accent)" }}>Read the article →</span>
      </div>
    </Link>
  );
}

export function CategoryChips({ active, q }: { active?: string; q?: string }) {
  const mkHref = (c?: string) => {
    const p = new URLSearchParams();
    if (c) p.set("category", c);
    if (q) p.set("q", q);
    const qs = p.toString();
    return `/blogs${qs ? `?${qs}` : ""}`;
  };
  return (
    <nav aria-label="Filter by topic" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <Link href={mkHref()} className="article-card" style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, padding: "0.5rem 1rem", borderRadius: "9999px", border: "1px solid", borderColor: !active ? "var(--accent)" : "var(--border)", backgroundColor: !active ? "var(--accent)" : "transparent", color: !active ? "#000" : "var(--text-secondary)" }}>
        All
      </Link>
      {ARTICLE_CATEGORIES.map((c) => {
        const on = active === c;
        return (
          <Link key={c} href={mkHref(c)} className="article-card" style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, padding: "0.5rem 1rem", borderRadius: "9999px", border: "1px solid", borderColor: on ? "var(--accent)" : "var(--border)", backgroundColor: on ? "var(--accent)" : "transparent", color: on ? "#000" : "var(--text-secondary)" }}>
            {c}
          </Link>
        );
      })}
    </nav>
  );
}

export function SearchBox({ q, category }: { q?: string; category?: string }) {
  return (
    <form action="/blogs" method="get" role="search" style={{ display: "flex", gap: "0.5rem", flex: 1, minWidth: "240px", maxWidth: "420px" }}>
      {category && <input type="hidden" name="category" value={category} />}
      <input
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Search articles…"
        aria-label="Search articles"
        style={{ flex: 1, border: "1px solid var(--border)", borderRadius: "9999px", backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", padding: "0.625rem 1.125rem", fontSize: "0.875rem", outline: "none" }}
      />
      <button type="submit" style={{ border: "none", cursor: "pointer", backgroundColor: "var(--accent)", color: "#000", fontWeight: 700, fontSize: "0.8125rem", padding: "0.625rem 1.25rem", borderRadius: "9999px" }}>
        Search
      </button>
    </form>
  );
}

export function Pagination({ page, totalPages, category, q, sort, basePath = "/blogs" }: { page: number; totalPages: number; category?: string; q?: string; sort?: string; basePath?: string }) {
  if (totalPages <= 1) return null;
  const href = (n: number) => {
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (q) p.set("q", q);
    if (sort && sort !== "newest") p.set("sort", sort);
    const qs = p.toString();
    return n === 1 ? `${basePath}${qs ? `?${qs}` : ""}` : `${basePath}/page/${n}${qs ? `?${qs}` : ""}`;
  };
  const nums: (number | "…")[] = [];
  for (let n = 1; n <= totalPages; n++) {
    if (n === 1 || n === totalPages || Math.abs(n - page) <= 1) nums.push(n);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }
  const linkStyle = (on: boolean): CSSProperties => ({
    minWidth: "40px", height: "40px", display: "inline-flex", alignItems: "center", justifyContent: "center",
    borderRadius: "var(--radius-sm)", border: "1px solid", fontSize: "0.875rem", fontWeight: 600,
    borderColor: on ? "var(--accent)" : "var(--border)", backgroundColor: on ? "var(--accent)" : "transparent",
    color: on ? "#000" : "var(--text-secondary)", textDecoration: "none", padding: "0 0.75rem",
  });
  return (
    <nav aria-label="Blog pages" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginTop: "3rem" }}>
      {page > 1 && <Link href={href(page - 1)} aria-label="Previous page" style={linkStyle(false)}>←</Link>}
      {nums.map((n, i) =>
        n === "…" ? (
          <span key={`e${i}`} style={{ color: "var(--text-tertiary)", padding: "0 0.25rem" }}>…</span>
        ) : n === page ? (
          <span key={n} aria-current="page" style={linkStyle(true)}>{n}</span>
        ) : (
          <Link key={n} href={href(n)} style={linkStyle(false)}>{n}</Link>
        )
      )}
      {page < totalPages && <Link href={href(page + 1)} aria-label="Next page" style={linkStyle(false)}>→</Link>}
    </nav>
  );
}
