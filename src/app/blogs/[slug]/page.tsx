import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getStaticPost } from "@/data/blogs";

interface Props {
  params: Promise<{ slug: string }>;
}

interface ResolvedPost {
  title: string;
  excerpt: string | null;
  category: string | null;
  tags: string[];
  author: string;
  publishedAt: Date | null;
  updatedAt: Date | null;
  readMinutes: number | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

async function resolvePost(slug: string): Promise<ResolvedPost | null> {
  // 1. Try the database first (admin-published posts win)
  try {
    const [result] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);
    if (result && result.status === "published") {
      return {
        title: result.title,
        excerpt: result.excerpt,
        category: result.category,
        tags: Array.isArray(result.tags) ? (result.tags as string[]) : [],
        author: result.author || "QA Specialist",
        publishedAt: result.publishedAt,
        updatedAt: result.updatedAt,
        readMinutes: null,
        content: result.content,
        seoTitle: result.seoTitle,
        seoDescription: result.seoDescription,
      };
    }
  } catch {
    // Database unavailable — fall through to the static library
  }

  // 2. Fall back to the built-in article library
  const staticPost = getStaticPost(slug);
  if (!staticPost) return null;
  return {
    title: staticPost.title,
    excerpt: staticPost.excerpt,
    category: staticPost.category,
    tags: staticPost.tags,
    author: staticPost.author,
    publishedAt: new Date(staticPost.publishedAt),
    updatedAt: staticPost.updatedAt ? new Date(staticPost.updatedAt) : null,
    readMinutes: staticPost.readMinutes,
    content: staticPost.content,
    seoTitle: staticPost.seoTitle,
    seoDescription: staticPost.seoDescription,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await resolvePost(slug);
  if (!post) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    alternates: { canonical: `/blogs/${slug}` },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await resolvePost(slug);

  if (!post) notFound();

  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      {/* Header */}
      <header
        style={{
          paddingTop: "5rem",
          paddingBottom: "4rem",
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: "2rem" }}>
            <ol
              role="list"
              style={{
                listStyle: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.5625rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
              }}
            >
              <li><Link href="/" style={{ color: "var(--text-tertiary)" }}>Home</Link></li>
              <li aria-hidden="true">→</li>
              <li><Link href="/blogs" style={{ color: "var(--text-tertiary)" }}>Blog</Link></li>
              <li aria-hidden="true">→</li>
              <li aria-current="page" style={{ color: "var(--text-secondary)" }}>{post.title}</li>
            </ol>
          </nav>

          <div style={{ maxWidth: "760px" }}>
            {post.category && (
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    border: "1px solid var(--border)",
                    padding: "0.25rem 0.625rem",
                    borderRadius: "2px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {post.category}
                </span>
                {post.readMinutes && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.5625rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      border: "1px solid var(--border)",
                      padding: "0.25rem 0.625rem",
                      borderRadius: "2px",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {post.readMinutes} min read
                  </span>
                )}
              </div>
            )}

            <h1 style={{ marginBottom: "1.25rem", fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)" }}>
              {post.title}
            </h1>

            {post.excerpt && (
              <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                {post.excerpt}
              </p>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                }}
              >
                By {post.author || "QA Specialist"}
              </span>
              {post.publishedAt && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                  }}
                >
                  {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
              {post.updatedAt && post.publishedAt && post.updatedAt > post.publishedAt && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                  }}
                >
                  Updated {new Date(post.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: "5rem",
            alignItems: "start",
          }}
          className="blog-content-grid"
        >
          <article>
            {post.content ? (
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <p style={{ color: "var(--text-secondary)" }}>No content available.</p>
            )}
          </article>

          <aside
            style={{
              position: "sticky",
              top: "calc(var(--nav-height) + 2rem)",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* Tags */}
            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <div
                style={{
                  padding: "1.5rem",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-surface)",
                }}
              >
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "1rem" }}>
                  Tags
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                  {(post.tags as string[]).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.5rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        border: "1px solid var(--border)",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "2px",
                        color: "var(--text-tertiary)",
                        backgroundColor: "var(--bg-surface-2)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div
              style={{
                padding: "1.5rem",
                border: "1px solid var(--accent)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--accent-muted)",
              }}
            >
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.75rem" }}>
                Free Audit
              </p>
              <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
                Get your store tested.
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                No cost. No commitment. Just a real assessment.
              </p>
              <Link
                href="/audit"
                style={{
                  display: "block",
                  padding: "0.75rem 1rem",
                  backgroundColor: "var(--accent)",
                  color: "#000",
                  borderRadius: "var(--radius-sm)",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  transition: "all var(--transition-fast)",
                }}
              >
                Request Audit →
              </Link>
            </div>
          </aside>
        </div>
      </div>

    </div>
  );
}
