import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getAdminSession } from "@/lib/devtools/session";
import { getIp, recordActivity, recordApiRequest, recordError } from "@/lib/devtools/log";

/**
 * Update / delete a single blog post.
 *
 * Only whitelisted fields can be written (no mass-assignment), and every
 * destructive action is confirmation-UI-driven on the client plus audit-logged
 * here on the server.
 */
const updateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  excerpt: z.string().max(2000).nullable().optional(),
  featuredImage: z.string().max(1000).nullable().optional(),
  author: z.string().max(100).optional(),
  publishedAt: z.string().nullable().optional(),
  category: z.string().max(100).nullable().optional(),
  tags: z.array(z.string().max(100)).max(30).optional(),
  content: z.string().nullable().optional(),
  status: z.enum(["draft", "published"]).optional(),
  seoTitle: z.string().max(300).nullable().optional(),
  seoDescription: z.string().max(500).nullable().optional(),
  seoImage: z.string().max(1000).nullable().optional(),
  seoCanonical: z.string().max(1000).nullable().optional(),
});

function parseId(raw: string): number | null {
  const n = Number.parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const started = Date.now();
  const session = await getAdminSession(req);
  if (!session) {
    recordApiRequest("PUT", `/api/admin/blogs/${(await params).id}`, 401, Date.now() - started);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const numId = parseId(id);
  if (!numId) return NextResponse.json({ error: "Invalid post id" }, { status: 400 });

  try {
    const body = await req.json().catch(() => null);
    const data = updateSchema.parse(body);
    const values: Record<string, unknown> = { updatedAt: new Date() };
    for (const [key, value] of Object.entries(data)) {
      if (key === "publishedAt") values[key] = value ? new Date(value as string) : null;
      else values[key] = value;
    }

    const [updated] = await db
      .update(blogPosts)
      .set(values as never)
      .where(eq(blogPosts.id, numId))
      .returning();
    if (!updated) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    recordActivity(session.email, "blog.update", updated.slug, { id: updated.id }, getIp(req));
    recordApiRequest("PUT", `/api/admin/blogs/${id}`, 200, Date.now() - started);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      recordApiRequest("PUT", `/api/admin/blogs/${id}`, 400, Date.now() - started, "validation failed");
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    recordError("api/admin/blogs/[id]", error instanceof Error ? error.message : "Unknown error", undefined, { op: "update", id });
    recordApiRequest("PUT", `/api/admin/blogs/${id}`, 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const started = Date.now();
  const session = await getAdminSession(req);
  if (!session) {
    recordApiRequest("DELETE", `/api/admin/blogs/${(await params).id}`, 401, Date.now() - started);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const numId = parseId(id);
  if (!numId) return NextResponse.json({ error: "Invalid post id" }, { status: 400 });

  try {
    const [deleted] = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, numId))
      .returning({ slug: blogPosts.slug });
    if (!deleted) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    recordActivity(session.email, "blog.delete", deleted.slug, { id: numId }, getIp(req));
    recordApiRequest("DELETE", `/api/admin/blogs/${id}`, 200, Date.now() - started);
    return NextResponse.json({ success: true });
  } catch (error) {
    recordError("api/admin/blogs/[id]", error instanceof Error ? error.message : "Unknown error", undefined, { op: "delete", id });
    recordApiRequest("DELETE", `/api/admin/blogs/${id}`, 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
