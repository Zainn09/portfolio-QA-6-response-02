import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { articles, getArticleBySlug, getRelatedArticles, PREV_NEXT, stubOf, ARTICLE_TYPE_LABEL, type BlogArticle, type ArticleBlock } from "@/data/articles";
import { legacyArticles } from "@/data/legacy-articles";
import { Toc } from "@/components/blog/Toc";
import type { ReactNode } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function resolveArticle(slug: string): BlogArticle | undefined {
  return getArticleBySlug(slug) ?? legacyArticles.find((a) => a.slug === slug);
}

export function generateStaticParams() {
  return [...articles.map((a) => ({ slug: a.slug })), ...legacyArticles.map((a) => ({ slug: a.slug }))];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = resolveArticle(slug);
  if (!a) return {};
  return {
    title: a.metaTitle,
    description: a.metaDescription,
    alternates: { canonical: `/blogs/${a.slug}` },
    openGraph: {
      title: a.metaTitle,
      description: a.metaDescription,
      type: "article",
      publishedTime: a.publishedAt,
      authors: [a.author],
      images: a.heroImage ? [a.heroImage] : undefined,
    },
  };
}

/* ---------- tiny inline-link parser: [text](/href) ---------- */
function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <Link key={key++} href={m[2]} style={{ color: "var(--text-primary)", fontWeight: 600, textDecoration: "underline", textDecorationColor: "var(--accent)", textUnderlineOffset: "3px" }}>
        {m[1]}
      </Link>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const TYPE_STYLE: Record<string, { kickerBg: string; kickerColor: string }> = {
  insight: { kickerBg: "var(--accent)", kickerColor: "#000" },
  guide: { kickerBg: "var(--text-primary)", kickerColor: "var(--bg-primary)" },
  "case-study": { kickerBg: "var(--critical)", kickerColor: "#fff" },
};

/* ---------- block renderer — variant-aware (three editorial voices) ---------- */
function Blocks({ body, variant }: { body: ArticleBlock[]; variant: "insight" | "guide" | "case-study" }) {
  let stepNo = 0;
  let exNo = 0;
  return (
    <>
      {body.map((b, i) => {
        switch (b.type) {
          case "h2": {
            if (variant === "guide") {
              stepNo += 1;
              const clean = b.text.replace(/^Step\s+\d+\s*[—-]\s*/, "");
              return (
                <div key={i} id={`s-${i}`} className="step-anchor">
                  <span className="step-badge">Step {stepNo}</span>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 1rem", color: "var(--text-primary)" }}>{clean}</h2>
                </div>
              );
            }
            if (variant === "case-study") {
              exNo += 1;
              return (
                <div key={i}>
                  <p className="exhibit-no">Exhibit {String(exNo).padStart(2, "0")}</p>
                  <h2 id={`s-${i}`} style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 1rem", color: "var(--text-primary)" }}>{b.text}</h2>
                </div>
              );
            }
            return <h2 key={i} id={`s-${i}`} className="insight-h2" style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", margin: "3rem 0 1rem", color: "var(--text-primary)" }}>{b.text}</h2>;
          }
          case "h3":
            return <h3 key={i} style={{ fontSize: "1.125rem", fontWeight: 700, margin: "2rem 0 0.75rem", color: "var(--text-primary)" }}>{b.text}</h3>;
          case "p":
            return <p key={i} style={{ fontSize: "1.0625rem", lineHeight: 1.85, color: "var(--text-secondary)", margin: "0 0 1.25rem" }}><Inline text={b.text} /></p>;
          case "list":
            return (
              <ul key={i} style={{ listStyle: "none", margin: "0 0 1.5rem", padding: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {(b.items as string[]).map((it, j) => (
                  <li key={j} style={{ display: "flex", gap: "0.625rem", fontSize: "1.0625rem", lineHeight: 1.75, color: "var(--text-secondary)" }}>
                    <span aria-hidden="true" style={{ color: "var(--accent)", fontWeight: 700 }}>{b.ordered ? `${j + 1}.` : "▸"}</span>
                    <span><Inline text={it} /></span>
                  </li>
                ))}
              </ul>
            );
          case "checklist":
            return (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1.5rem", margin: "0 0 1.75rem", backgroundColor: "var(--bg-surface)" }}>
                {b.title && <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700, marginBottom: "1rem" }}>{b.title}</p>}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {b.items.map((it, j) => (
                    <label key={j} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontSize: "1rem", lineHeight: 1.6, color: "var(--text-secondary)", cursor: "pointer" }}>
                      <input type="checkbox" style={{ marginTop: "0.3rem", accentColor: "var(--accent)", width: "16px", height: "16px", flexShrink: 0 }} />
                      <span>{it}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          case "quote":
            return (
              <blockquote key={i} className={variant === "insight" ? "pull-quote serif" : ""} style={{ margin: "2.5rem 0", padding: variant === "insight" ? "0 2rem" : "0 0 0 1.5rem", borderLeft: variant === "insight" ? "none" : "3px solid var(--accent)", textAlign: variant === "insight" ? "center" : "left" }}>
                <p style={{ fontSize: variant === "insight" ? "1.625rem" : "1.375rem", lineHeight: 1.45, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em", fontStyle: variant === "insight" ? "italic" : "normal" }}>“{b.text}”</p>
                {b.cite && <cite style={{ display: "block", marginTop: "0.75rem", fontFamily: "var(--font-mono)", fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", fontStyle: "normal" }}>— {b.cite}</cite>}
              </blockquote>
            );
          case "callout":
            return (
              <aside key={i} style={{ margin: "2rem 0", border: "1px solid var(--accent)", borderLeftWidth: "4px", borderRadius: "var(--radius-md)", padding: "1.25rem 1.5rem", backgroundColor: "var(--accent-muted)" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>{variant === "guide" ? `Tip · ${b.title}` : b.title}</p>
                <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--text-secondary)", margin: 0 }}><Inline text={b.text} /></p>
              </aside>
            );
          case "image":
            return (
              <figure key={i} style={{ margin: "2.25rem 0", ...(b.narrow ? { maxWidth: "340px", marginLeft: "auto", marginRight: "auto" } : {}) }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.src} alt={b.alt} loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }} />
                {(b.caption || b.alt) && (
                  <figcaption style={{ marginTop: "0.625rem", fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", textAlign: "center" }}>{b.caption ?? b.alt}</figcaption>
                )}
              </figure>
            );
          case "imagePair":
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.75rem", margin: "2.25rem 0" }}>
                {b.items.map((it, j) => (
                  <figure key={j} style={{ margin: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.src} alt={it.alt} loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }} />
                    <figcaption style={{ marginTop: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", textAlign: "center" }}>{it.alt}</figcaption>
                  </figure>
                ))}
              </div>
            );
          case "links":
            return (
              <div key={i} style={{ margin: "2.5rem 0", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1.5rem", backgroundColor: "var(--bg-surface)" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "1rem" }}>{b.title}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {b.items.map((it, j) => (
                    <Link key={j} href={it.href} style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.5 }}>
                      <span aria-hidden="true" style={{ color: "var(--accent)", marginRight: "0.5rem" }}>→</span>{it.text}
                    </Link>
                  ))}
                </div>
              </div>
            );
          case "metrics":
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", margin: "2.25rem 0" }}>
                {b.items.map((it, j) => (
                  <div key={j} style={{ border: "1px solid var(--border)", borderTop: "3px solid var(--accent)", borderRadius: "var(--radius-md)", padding: "1.25rem", backgroundColor: "var(--bg-surface)", textAlign: "center" }}>
                    <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.02em", margin: 0 }}>{it.value}</p>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginTop: "0.375rem" }}>{it.label}</p>
                  </div>
                ))}
              </div>
            );
          case "html":
            return <div key={i} className="legacy-post-content" dangerouslySetInnerHTML={{ __html: b.html }} />;
          case "cta":
            return (
              <aside key={i} style={{ margin: "3rem 0", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", borderLeft: "4px solid var(--accent)", background: "linear-gradient(135deg, var(--accent-muted), transparent 60%), var(--bg-surface)", padding: "2rem" }}>
                <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>{b.title}</p>
                <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--text-secondary)", margin: "0 0 1.25rem" }}>{b.text}</p>
                <Link href={b.href} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "var(--accent)", color: "#000", fontWeight: 700, fontSize: "0.875rem", padding: "0.75rem 1.5rem", borderRadius: "9999px" }}>
                  {b.label} →
                </Link>
              </aside>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

/* ---------- shared atoms ---------- */
function ArticleCard({ stub }: { stub: ReturnType<typeof stubOf> }) {
  const ts = TYPE_STYLE[stub.articleType] ?? TYPE_STYLE.insight;
  return (
    <Link href={`/blogs/${stub.slug}`} className="article-card" style={{ display: "flex", flexDirection: "column", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden", backgroundColor: "var(--bg-surface)", transition: "border-color 180ms ease" }}>
      {stub.heroImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={stub.heroImage} alt={stub.heroAlt} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", objectPosition: "top", display: "block" }} />
      ) : (
        <div style={{ width: "100%", aspectRatio: "16/9", backgroundColor: "var(--accent-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)" }}>QA</div>
      )}
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.625rem", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, backgroundColor: ts.kickerBg, color: ts.kickerColor, padding: "0.1875rem 0.5rem", borderRadius: "3px" }}>{ARTICLE_TYPE_LABEL[stub.articleType]}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>{stub.category}</span>
        </div>
        <p style={{ fontSize: "1.0625rem", fontWeight: 700, lineHeight: 1.4, color: "var(--text-primary)", margin: 0 }}>{stub.title}</p>
        <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--text-secondary)", margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{stub.excerpt}</p>
        <div style={{ marginTop: "auto", paddingTop: "0.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>{fmtDate(stub.publishedAt)} · {stub.readingTime} min</span>
          <span className="read-btn" style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: "var(--accent)", border: "1px solid var(--accent)", borderRadius: "9999px", padding: "0.3125rem 0.75rem" }}>Read Article →</span>
        </div>
      </div>
    </Link>
  );
}

function ShareRow({ a, centered }: { a: BlogArticle; centered?: boolean }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", ...(centered ? { justifyContent: "center" } : { marginLeft: "auto" }) }}>
      {[
        { label: "Share on X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(a.title)}&url=${SITE}/blogs/${a.slug}`, txt: "𝕏" },
        { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${SITE}/blogs/${a.slug}`, txt: "in" },
      ].map((s) => (
        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} style={{ width: "34px", height: "34px", border: "1px solid var(--border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)" }}>{s.txt}</a>
      ))}
    </div>
  );
}

function Breadcrumbs({ a }: { a: BlogArticle }) {
  return (
    <nav aria-label="Breadcrumb" className="container" style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
      <Link href="/" style={{ color: "inherit" }}>Home</Link><span aria-hidden="true"> / </span>
      <Link href="/blogs" style={{ color: "inherit" }}>Blog</Link><span aria-hidden="true"> / </span>
      <span style={{ color: "var(--text-secondary)" }}>{a.category}</span>
    </nav>
  );
}

function Kicker({ a }: { a: BlogArticle }) {
  const ts = TYPE_STYLE[a.articleType] ?? TYPE_STYLE.insight;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, backgroundColor: ts.kickerBg, color: ts.kickerColor, padding: "0.25rem 0.625rem", borderRadius: "var(--radius-sm)" }}>{ARTICLE_TYPE_LABEL[a.articleType]}</span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>{a.category}</span>
    </div>
  );
}

function AuthorRow({ a }: { a: BlogArticle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
      <div aria-hidden="true" style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "var(--accent)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.875rem" }}>Z</div>
      <div>
        <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{a.author} <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>· {a.authorRole}</span></p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", margin: 0 }}>{fmtDate(a.publishedAt)} · {a.readingTime} min read</p>
      </div>
    </div>
  );
}

function HeroImg({ a, ratio, bleed }: { a: BlogArticle; ratio: string; bleed?: boolean }) {
  if (!a.heroImage) return null;
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={a.heroImage} alt={a.heroAlt} decoding="async" style={{ width: "100%", aspectRatio: ratio, objectFit: "cover", objectPosition: "top", display: "block", ...(bleep(bleed)) }} />
  );
  return bleed ? (
    <figure className="full-bleed" style={{ margin: "2.5rem 0 3rem" }}>{img}</figure>
  ) : (
    <figure className="container" style={{ margin: "0 0 3rem" }}>{img}</figure>
  );
}
const bleep = (b?: boolean) => (b ? {} : { borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" });

/* ---------- shared tail: FAQ · sources · related · prev/next ---------- */
function ArticleTail({ a, related, prev, next }: { a: BlogArticle; related: ReturnType<typeof stubOf>[]; prev?: ReturnType<typeof stubOf>; next?: ReturnType<typeof stubOf> }) {
  return (
    <>
      {a.faq.length > 0 && (
        <section aria-label="Frequently asked questions" className="container" style={{ maxWidth: "56rem", marginTop: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 1.25rem" }}>FAQ</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {a.faq.map((f, i) => (
              <details key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface)", padding: "1rem 1.25rem" }}>
                <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>{f.question}</summary>
                <p style={{ marginTop: "0.75rem", fontSize: "1rem", lineHeight: 1.75, color: "var(--text-secondary)" }}>{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {a.sources && a.sources.length > 0 && (
        <section aria-label="Sources" className="container" style={{ maxWidth: "56rem", marginTop: "2.5rem" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.75rem" }}>Sources & further reading</p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {a.sources.map((s) => (
              <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textDecoration: "underline", textUnderlineOffset: "3px" }}>{s.label} ↗</a></li>
            ))}
          </ul>
        </section>
      )}

      <section aria-label="Related articles" className="container" style={{ marginTop: "4.5rem", paddingTop: "3rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
          <h2 style={{ fontSize: "1.625rem", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>Related Articles</h2>
          <Link href="/blogs" style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: "var(--accent)" }}>Browse all →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {related.map((r) => <ArticleCard key={r.slug} stub={r} />)}
        </div>
      </section>

      <nav aria-label="More articles" className="container" style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {prev ? (
          <Link href={`/blogs/${prev.slug}`} className="pn-card" style={{ display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--accent)", borderRadius: "var(--radius-md)", padding: "1.125rem", backgroundColor: "var(--bg-surface)" }}>
            {prev.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={prev.heroImage} alt="" loading="lazy" decoding="async" style={{ width: "76px", height: "76px", aspectRatio: "1 / 1", objectFit: "cover", objectPosition: "top", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", flexShrink: 0 }} />
            ) : (
              <span aria-hidden="true" style={{ width: "76px", height: "76px", aspectRatio: "1 / 1", borderRadius: "var(--radius-sm)", backgroundColor: "var(--accent-muted)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>QA</span>
            )}
            <span style={{ minWidth: 0 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700 }}>← Newer</span>
              <span className="pn-title" style={{ display: "block", fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "0.375rem", lineHeight: 1.4 }}>{prev.title}</span>
            </span>
          </Link>
        ) : <span />}
        {next && (
          <Link href={`/blogs/${next.slug}`} className="pn-card" style={{ display: "flex", flexDirection: "row-reverse", gap: "1rem", alignItems: "center", textAlign: "right", border: "1px solid var(--accent)", borderRadius: "var(--radius-md)", padding: "1.125rem", backgroundColor: "var(--bg-surface)" }}>
            {next.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={next.heroImage} alt="" loading="lazy" decoding="async" style={{ width: "76px", height: "76px", aspectRatio: "1 / 1", objectFit: "cover", objectPosition: "top", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", flexShrink: 0 }} />
            ) : (
              <span aria-hidden="true" style={{ width: "76px", height: "76px", aspectRatio: "1 / 1", borderRadius: "var(--radius-sm)", backgroundColor: "var(--accent-muted)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>QA</span>
            )}
            <span style={{ minWidth: 0 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700 }}>Older →</span>
              <span className="pn-title" style={{ display: "block", fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "0.375rem", lineHeight: 1.4 }}>{next.title}</span>
            </span>
          </Link>
        )}
      </nav>
    </>
  );
}

/* ---------- LAYOUT 1 · INSIGHT — editorial magazine ---------- */
function InsightLayout({ a }: { a: BlogArticle }) {
  return (
    <article>
      <div style={{ paddingTop: "calc(var(--nav-height) + 2rem)" }}>
        <Breadcrumbs a={a} />
        <header className="container" style={{ maxWidth: "52rem", textAlign: "center", marginTop: "2rem", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <span className="kicker-rule" aria-hidden="true" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: "var(--accent)" }}>{ARTICLE_TYPE_LABEL[a.articleType]} · {a.category}</span>
            <span className="kicker-rule" aria-hidden="true" />
          </div>
          <h1 className="serif" style={{ fontSize: "clamp(2.25rem, 5.5vw, 3.5rem)", fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.01em", color: "var(--text-primary)", margin: "0 0 1.25rem" }}>{a.title}</h1>
          <p className="serif" style={{ fontSize: "1.25rem", lineHeight: 1.65, fontStyle: "italic", color: "var(--text-secondary)", margin: "0 auto 2rem", maxWidth: "40rem" }}>{a.excerpt}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <AuthorRow a={a} />
            <ShareRow a={a} centered />
          </div>
        </header>
        <HeroImg a={a} ratio="21/9" bleed />
        <div className="container insight-prose" style={{ maxWidth: "42rem" }}>
          <Blocks body={a.body} variant="insight" />
        </div>
        <aside className="container" style={{ maxWidth: "42rem", marginTop: "3.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", backgroundColor: "var(--bg-surface)", padding: "1.75rem", display: "flex", gap: "1.25rem", alignItems: "center" }}>
          <div aria-hidden="true" style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "var(--accent)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.125rem", flexShrink: 0 }}>Z</div>
          <div>
            <p className="serif" style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Written by Zain</p>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.6, color: "var(--text-secondary)", margin: "0.25rem 0 0" }}>Founder & QA Lead. He has audited 100+ Shopify storefronts and rebuilt the ones worth rebuilding — these pieces are his working notes.</p>
          </div>
        </aside>
      </div>
    </article>
  );
}

/* ---------- LAYOUT 2 · GUIDE — practical workbook ---------- */
function GuideLayout({ a }: { a: BlogArticle }) {
  const toc = a.body.map((b, i) => ({ text: b.type === "h2" && "text" in b ? b.text.replace(/^Step\s+\d+\s*[—-]\s*/, "") : "", i })).filter((x) => x.text);
  const showToc = toc.length >= 3;
  return (
    <article>
      <div className="guide-band">
        <div style={{ paddingTop: "calc(var(--nav-height) + 2rem)" }}>
          <Breadcrumbs a={a} />
          <header className="container" style={{ maxWidth: "56rem", marginTop: "1.75rem", paddingBottom: "2.25rem" }}>
            <Kicker a={a} />
            <h1 style={{ fontSize: "clamp(1.875rem, 4.5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--text-primary)", margin: "1.1rem 0 1rem" }}>{a.title}</h1>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.7, color: "var(--text-secondary)", margin: "0 0 1.5rem", maxWidth: "46rem" }}>{a.excerpt}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
              <AuthorRow a={a} />
              <ShareRow a={a} />
            </div>
            {showToc && (
              <div style={{ marginTop: "1.75rem", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-surface)", padding: "1.25rem 1.5rem" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "var(--accent)", margin: "0 0 0.875rem" }}>In this guide</p>
                <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.5rem 1.5rem" }}>
                  {toc.map((t) => (
                    <li key={t.i} style={{ fontSize: "0.875rem", lineHeight: 1.5, color: "var(--text-secondary)" }}>
                      <a href={`#s-${t.i}`} style={{ color: "inherit", textDecoration: "none" }}>
                        <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: 700, marginRight: "0.5rem" }}>{String(toc.findIndex((x) => x.i === t.i) + 1).padStart(2, "0")}</span>
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </header>
        </div>
      </div>
      <div style={{ paddingTop: "2.5rem" }}>
        <HeroImg a={a} ratio="16/7" />
        <div className={`container ${showToc ? "with-toc" : ""}`} style={showToc ? undefined : { maxWidth: "56rem" }}>
          {showToc && (
            <nav aria-label="On this page" className="article-toc" style={{ position: "sticky", top: "calc(var(--nav-height) + 2rem)", flexDirection: "column", gap: "0.625rem" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-tertiary)", margin: 0 }}>Steps</p>
              <Toc items={toc.map((t) => ({ id: `s-${t.i}`, text: t.text }))} />
            </nav>
          )}
          <div style={{ minWidth: 0 }}>
            <Blocks body={a.body} variant="guide" />
          </div>
        </div>
      </div>
    </article>
  );
}

/* ---------- LAYOUT 3 · CASE STORY — evidence dossier ---------- */
function CaseLayout({ a }: { a: BlogArticle }) {
  return (
    <article>
      <div style={{ paddingTop: "calc(var(--nav-height) + 2rem)" }}>
        <Breadcrumbs a={a} />
        <header className="container dossier-head" style={{ marginTop: "1.75rem", marginBottom: "2.25rem", display: "grid", gridTemplateColumns: "1fr", gap: "1.75rem", alignItems: "start" }}>
          <div>
            <Kicker a={a} />
            <h1 style={{ fontSize: "clamp(1.875rem, 4.5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--text-primary)", margin: "1.1rem 0 1rem" }}>{a.title}</h1>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.7, color: "var(--text-secondary)", margin: "0 0 1.5rem", maxWidth: "44rem" }}>{a.excerpt}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              <AuthorRow a={a} />
              <ShareRow a={a} />
            </div>
            <div aria-label="How this story is structured" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
              {["Audit", "Redesign", "Build", "30-day readout"].map((step, i) => (
                <span key={step} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="process-chip">{step}</span>
                  {i < 3 && <span aria-hidden="true" style={{ color: "var(--text-tertiary)", fontSize: "0.75rem" }}>→</span>}
                </span>
              ))}
            </div>
          </div>
          <aside className="fact-card" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-surface)", padding: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--critical)", fontWeight: 700, margin: "0 0 1rem" }}>Case file</p>
            <dl style={{ margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                ["Project", a.projectTitle],
                ["Topic", a.category],
                ["Read", `${a.readingTime} min`],
                ["Published", fmtDate(a.publishedAt)],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", borderBottom: "1px dashed var(--border)", paddingBottom: "0.625rem" }}>
                  <dt className="fact-label" style={{ margin: 0 }}>{k}</dt>
                  <dd style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", textAlign: "right" }}>{v}</dd>
                </div>
              ))}
            </dl>
            {a.projectSlug && (
              <Link href={`/work/${a.projectSlug}`} style={{ display: "block", textAlign: "center", marginTop: "1.25rem", backgroundColor: "var(--accent)", color: "#000", fontWeight: 700, fontSize: "0.8125rem", padding: "0.625rem 1rem", borderRadius: "9999px" }}>
                Open the case study →
              </Link>
            )}
          </aside>
        </header>
        <HeroImg a={a} ratio="16/8" />
      </div>
      <div className="container" style={{ maxWidth: "56rem", minWidth: 0 }}>
        <Blocks body={a.body} variant="case-study" />
      </div>
    </article>
  );
}

/* ---------- the page ---------- */
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = resolveArticle(slug);
  if (!a) notFound();

  const related = getRelatedArticles(a, 4);
  const { prev, next } = PREV_NEXT(a.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.metaDescription,
    image: a.heroImage ? [a.heroImage] : undefined,
    datePublished: a.publishedAt,
    author: { "@type": "Person", name: a.author, jobTitle: a.authorRole },
    publisher: { "@type": "Organization", name: "QA Specialist" },
    mainEntityOfPage: `${SITE}/blogs/${a.slug}`,
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blogs` },
      { "@type": "ListItem", position: 3, name: a.title, item: `${SITE}/blogs/${a.slug}` },
    ],
  };
  const faqLd = a.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: a.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      {a.articleType === "insight" && <InsightLayout a={a} />}
      {a.articleType === "guide" && <GuideLayout a={a} />}
      {a.articleType === "case-study" && <CaseLayout a={a} />}

      <div style={{ height: "1px" }} />
      <ArticleTail a={a} related={related} prev={prev} next={next} />
    </>
  );
}
