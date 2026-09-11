import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

function getSession(req: NextRequest) {
  const cookie = req.cookies.get("admin-session");
  if (!cookie) return null;
  try {
    return JSON.parse(cookie.value);
  } catch {
    return null;
  }
}

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  author: z.string().optional(),
  publishedAt: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  content: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoImage: z.string().optional(),
  seoCanonical: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = postSchema.parse(body);

    const [post] = await db
      .insert(blogPosts)
      .values({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        featuredImage: data.featuredImage,
        author: data.author || "QA Specialist",
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
        category: data.category,
        tags: data.tags || [],
        content: data.content,
        status: data.status,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoImage: data.seoImage,
        seoCanonical: data.seoCanonical,
      })
      .returning();

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Blog create error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
