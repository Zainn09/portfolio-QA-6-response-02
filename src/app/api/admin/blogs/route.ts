import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { getAdminSession } from "@/lib/devtools/session";
import { getIp, recordActivity, recordApiRequest, recordError } from "@/lib/devtools/log";
import { sanitizeBlogHtml } from "@/lib/blog-html";

/**
 * Blog posts stored in the database (used by the /admin content editor).
 * Sessions are signed (iron-session) and every write is audit-logged.
 */
const postSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  excerpt: z.string().max(2000).optional(),
  featuredImage: z.string().max(1000).optional(),
  author: z.string().max(100).optional(),
  publishedAt: z.string().optional(),
  category: z.string().max(100).optional(),
  tags: z.array(z.string().max(100)).max(30).optional(),
  content: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  seoTitle: z.string().max(300).optional(),
  seoDescription: z.string().max(500).optional(),
  seoImage: z.string().max(1000).optional(),
  seoCanonical: z.string().max(1000).optional(),
});

function toValues(data: z.infer<typeof postSchema>) {
  return {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt ?? null,
    featuredImage: data.featuredImage ?? null,
    author: data.author || "QA Specialist",
    publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
    category: data.category ?? null,
    tags: data.tags || [],
    content: data.content ? sanitizeBlogHtml(data.content) : null,
    status: data.status,
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
    seoImage: data.seoImage ?? null,
    seoCanonical: data.seoCanonical ?? null,
  };
}

export async function GET(req: NextRequest) {
  const started = Date.now();
  const denied = await (async () => {
    const session = await getAdminSession(req);
    return session ? null : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  })();
  if (denied) return denied;

  try {
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    recordApiRequest("GET", "/api/admin/blogs", 200, Date.now() - started);
    return NextResponse.json(posts);
  } catch (error) {
    recordError("api/admin/blogs", error instanceof Error ? error.message : "Unknown error", undefined, { op: "list" });
    recordApiRequest("GET", "/api/admin/blogs", 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const started = Date.now();
  const session = await getAdminSession(req);
  if (!session) {
    recordApiRequest("POST", "/api/admin/blogs", 401, Date.now() - started);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    const data = postSchema.parse(body);

    const [post] = await db.insert(blogPosts).values(toValues(data)).returning();
    recordActivity(session.email, "blog.create", post.slug, { id: post.id }, getIp(req));
    recordApiRequest("POST", "/api/admin/blogs", 201, Date.now() - started);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      recordApiRequest("POST", "/api/admin/blogs", 400, Date.now() - started, "validation failed");
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    recordError("api/admin/blogs", error instanceof Error ? error.message : "Unknown error", undefined, { op: "create" });
    recordApiRequest("POST", "/api/admin/blogs", 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
