import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { staticBlogPosts } from "@/data/blogs";

export const metadata: Metadata = {
  title: "QA Blog — Shopify Testing Insights",
  description:
    "Insights, guides, and perspectives on Quality Assurance for Shopify and Shopify Plus stores.",
  alternates: { canonical: "/blogs" },
};

export const dynamic = "force-dynamic";

interface DisplayPost {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  featuredImage: string | null;
  publishedAt: Date | null;
  readMinutes: number | null;
  trending: boolean;
  series: string | null;
}

export default async function BlogsPage() {
  let dbPosts: typeof blogPosts.$inferSelect[] = [];
  try {
    dbPosts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt));
  } catch {
    dbPosts = [];
  }

  const dbSlugs = new Set(dbPosts.map((p) => p.slug));

  // Merge database posts with the built-in article library (no duplicates)
  const posts: DisplayPost[] = [
    ...dbPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      featuredImage: p.featuredImage,
      publishedAt: p.publishedAt,
      readMinutes: null as number | null,
      trending: false,
      series: null as string | null,
    })),
    ...staticBlogPosts
      .filter((p) => !dbSlugs.has(p.slug))
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        featuredImage: null as string | null,
        publishedAt: new Date(p.publishedAt),
        readMinutes: p.readMinutes,
        trending: !!p.trending,
        series: p.series ?? null,
      })),
  ].sort((a, b) => {
    const at = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bt = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bt - at;
  });

  const trendingPosts = posts.filter((p) => p.trending);

  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <style>{`
        .blog-card-link {
          display: block;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background-color: var(--bg-surface);
          overflow: hidden;
          text-decoration: none;
          transition: all var(--transition-base);
          animation: fade-up 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) both;
        }
        .blog-card-link:hover {
          border-color: var(--border-strong);
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        .series-link {
          transition: all var(--transition-fast);
        }
        .series-link:hover {
          border-color: var(--accent) !important;
          transform: translateX(4px);
        }
      `}</style>

      {/* Header */}
      <div style={{ paddingTop: "5rem", paddingBottom: "4rem", borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>Blog</p>
          <h1 style={{ maxWidth: "640px", marginBottom: "1rem" }}>
            QA Insights for{" "}
            <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>Shopify Stores.</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "500px" }}>
            Perspectives on e-commerce quality assurance, testing strategies, common failure patterns,
            and how to build a more reliable Shopify store.
          </p>
        </div>
      </div>

      {/* Trending series strip */}
      {trendingPosts.length > 0 && (
        <div className="container" style={{ paddingTop: "3rem" }}>
          <div
            style={{
              border: "1px solid var(--accent)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--accent-muted)",
              padding: "clamp(1.5rem, 3vw, 2.25rem)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" }}>
              <span
                aria-hidden="true"
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--accent)",
                  animation: "pulse-dot 2s ease-in-out infinite",
                }}
              />
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-primary)", fontWeight: 700 }}>
                Trending now — AI × QA Series
              </p>
            </div>
            <h2 style={{ fontSize: "clamp(1.25rem, 2.4vw, 1.625rem)", marginBottom: "1.25rem", maxWidth: "640px" }}>
              Can AI test your Shopify store? A 3-part investigation.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {trendingPosts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blogs/${post.slug}`}
                  className="series-link"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.875rem 1rem",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--bg-surface)",
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, color: "var(--accent)", flexShrink: 0 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ flex: 1, fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>
                    {post.title}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", flexShrink: 0 }}>
                    {post.readMinutes ? `${post.readMinutes} min` : "Read →"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      <div className="container" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem", border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-md)" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.75rem" }}>No Posts Yet</p>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Nothing published yet.</h2>
            <p style={{ color: "var(--text-secondary)" }}>Check back soon for QA insights and Shopify testing guides.</p>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "1.5rem" }}>
              {posts.length} article{posts.length !== 1 ? "s" : ""}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {posts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blogs/${post.slug}`}
                  className="blog-card-link"
                  style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
                >
                  {/* Featured image / cover */}
                  <div style={{ height: "180px", backgroundColor: "var(--bg-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
                    {post.featuredImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.featuredImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" width={640} height={180} />
                    ) : (
                      <div style={{ textAlign: "center", padding: "1.5rem" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--border-strong)", display: "block", lineHeight: 1 }}>
                          QA
                        </span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                          {post.category || "Insights"}
                        </span>
                      </div>
                    )}
                    <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", display: "flex", gap: "0.375rem" }}>
                      {post.category && (
                        <div style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)", padding: "0.2rem 0.5rem", borderRadius: "2px", fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
                          {post.category}
                        </div>
                      )}
                      {post.trending && (
                        <div style={{ backgroundColor: "var(--accent)", padding: "0.2rem 0.5rem", borderRadius: "2px", fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#000", fontWeight: 700 }}>
                          Trending
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.625rem" }}>
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "Draft"}
                      {post.readMinutes ? ` · ${post.readMinutes} min read` : ""}
                    </p>
                    <h2 style={{ fontSize: "1.0625rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: "0.625rem", lineHeight: 1.35 }}>
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "1rem" }}>
                        {post.excerpt}
                      </p>
                    )}
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                      Read article →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
