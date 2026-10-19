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

const SMALL_WORDS = new Set(["of", "in", "the", "a", "an", "to", "and", "for", "on", "vs"]);
const titleCase = (s: string) =>
  s
    .split(" ")
    .map((w, i) => (i > 0 && SMALL_WORDS.has(w.toLowerCase()) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");

/** Typographic featured visual for posts without a hero image: the post's primary keyword, with four distinct treatments keyed to the post id. */
export function KeywordVisual({ a, tall }: { a: ArticleStub; tall?: boolean }) {
  const kw = titleCase(a.primaryKeyword || a.title);
  const v = a.id % 4;
  const base: CSSProperties = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "1.25rem",
    gap: "0.5rem",
    position: "relative",
    overflow: "hidden",
  };
  const kwStyle: CSSProperties = {
    fontSize: tall ? "clamp(1.125rem, 2.6vw, 1.625rem)" : "clamp(0.9375rem, 2.1vw, 1.375rem)",
    fontWeight: 800,
    letterSpacing: "-0.01em",
    lineHeight: 1.25,
    margin: 0,
    maxWidth: "90%",
  };
  if (v === 0)
    return (
      <div aria-hidden="true" style={{ ...base, aspectRatio: "16/9", backgroundColor: "var(--accent-muted)" }}>
        <span style={{ position: "absolute", top: "0.625rem", left: "0.75rem", fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-secondary)" }}>featured · {a.category}</span>
        <p style={{ ...kwStyle, color: "var(--text-primary)" }}>{kw}</p>
        <span style={{ position: "absolute", bottom: "0.625rem", right: "0.75rem", fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-secondary)" }}>{a.readingTime} min read</span>
      </div>
    );
  if (v === 1)
    return (
      <div aria-hidden="true" style={{ ...base, aspectRatio: "16/9", backgroundColor: "var(--bg-surface)", borderLeft: "3px solid var(--accent)" }}>
        <span style={{ position: "absolute", top: "0.375rem", right: "0.75rem", fontFamily: "var(--font-mono)", fontSize: "1.5rem", fontWeight: 800, color: "var(--border)", lineHeight: 1 }}>#{String(a.id).slice(-2)}</span>
        <p style={{ ...kwStyle, color: "var(--text-primary)" }}>{kw}</p>
        <span style={{ position: "absolute", bottom: "0.625rem", left: "0.75rem", fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>{a.category}</span>
      </div>
    );
  if (v === 2) {
    const words = kw.split(" ");
    return (
      <div aria-hidden="true" style={{ ...base, aspectRatio: "16/9", backgroundColor: "var(--text-primary)" }}>
        <span style={{ position: "absolute", top: "0.625rem", left: "0.75rem", fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-secondary)" }}>{a.category}</span>
        <p style={{ ...kwStyle, color: "var(--bg-primary)" }}>
          {words.map((w, i) => (
            <span key={i} style={i === 0 ? { color: "var(--accent)" } : undefined}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
        <span style={{ position: "absolute", bottom: "0.625rem", right: "0.75rem", fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-secondary)" }}>featured</span>
      </div>
    );
  }
  return (
    <div aria-hidden="true" style={{ ...base, aspectRatio: "16/9", backgroundColor: "var(--bg-surface)" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: "0.5rem", border: "1px dashed var(--border)", borderRadius: "var(--radius-sm)" }} />
      <span style={{ position: "absolute", top: "0.625rem", left: "0.75rem", zIndex: 1, fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>featured keyword</span>
      <p style={{ ...kwStyle, color: "var(--accent)" }}>{kw}</p>
      <span style={{ position: "absolute", bottom: "0.625rem", right: "0.75rem", zIndex: 1, fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>{a.readingTime} min</span>
    </div>
  );
}

export function IndexCard({ a }: { a: ArticleStub }) {
  const ts = TYPE_STYLE[a.articleType] ?? TYPE_STYLE.insight;
  return (
    <Link href={`/blogs/${a.slug}`} className="article-card" style={{ display: "flex", flexDirection: "column", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden", backgroundColor: "var(--bg-surface)", transition: "border-color 180ms ease" }}>
      {a.heroImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.heroImage} alt={a.heroAlt} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", objectPosition: "top", display: "block" }} />
      ) : (
        <KeywordVisual a={a} />
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
          <span className="read-btn" style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: "var(--accent)", border: "1px solid var(--accent)", borderRadius: "9999px", padding: "0.3125rem 0.75rem" }}>Read →</span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedCard({ a }: { a: ArticleStub }) {
  const ts = TYPE_STYLE[a.articleType] ?? TYPE_STYLE.insight;
  return (
    <Link href={`/blogs/${a.slug}`} className="article-card" style={{ display: "grid", gridTemplateColumns: "1fr", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", backgroundColor: "var(--bg-surface)" }}>
      {a.heroImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.heroImage} alt={a.heroAlt} decoding="async" style={{ width: "100%", height: "100%", minHeight: "260px", objectFit: "cover", objectPosition: "top", display: "block" }} />
      ) : (
        <KeywordVisual a={a} tall />
      )}
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, backgroundColor: "var(--accent)", color: "#000", padding: "0.25rem 0.625rem", borderRadius: "var(--radius-sm)" }}>Featured</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, backgroundColor: ts.bg, color: ts.color, padding: "0.1875rem 0.5rem", borderRadius: "3px" }}>{typeLabel(a.articleType)}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>{a.category}</span>
        </div>
        <h2 style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.875rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2, color: "var(--text-primary)", margin: 0 }}>{a.title}</h2>
        <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--text-secondary)", margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.excerpt}</p>
        <span className="read-btn" style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: "var(--accent)", border: "1px solid var(--accent)", borderRadius: "9999px", padding: "0.375rem 0.875rem", alignSelf: "flex-start" }}>Read the article →</span>
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
