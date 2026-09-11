import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "QA Blog — Shopify Testing Insights",
  description:
    "Insights, guides, and perspectives on Quality Assurance for Shopify and Shopify Plus stores.",
  alternates: { canonical: "/blogs" },
};

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  let posts: typeof blogPosts.$inferSelect[] = [];
  try {
    posts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt));
  } catch {
    posts = [];
  }

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
        }
        .blog-card-link:hover {
          border-color: var(--border-strong);
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
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

      {/* Posts */}
      <div className="container" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem", border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-md)" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.75rem" }}>No Posts Yet</p>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Nothing published yet.</h2>
            <p style={{ color: "var(--text-secondary)" }}>Check back soon for QA insights and Shopify testing guides.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {posts.map((post) => (
              <Link key={post.id} href={`/blogs/${post.slug}`} className="blog-card-link">
                {/* Featured image placeholder */}
                <div style={{ height: "180px", backgroundColor: "var(--bg-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid var(--border)", position: "relative" }}>
                  {post.featuredImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.featuredImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" width={640} height={180} />
                  ) : (
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>QA Insights</span>
                  )}
                  {post.category && (
                    <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)", padding: "0.2rem 0.5rem", borderRadius: "2px", fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
                      {post.category}
                    </div>
                  )}
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.625rem" }}>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "Draft"}
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
        )}
      </div>
    </div>
  );
}
