import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";

function getSession(req: NextRequest) {
  const cookie = req.cookies.get("admin-session");
  if (!cookie) return null;
  try {
    return JSON.parse(cookie.value);
  } catch {
    return null;
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const [updated] = await db
    .update(blogPosts)
    .set({
      ...body,
      updatedAt: new Date(),
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
    })
    .where(eq(blogPosts.id, parseInt(id)))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(blogPosts).where(eq(blogPosts.id, parseInt(id)));
  return NextResponse.json({ success: true });
}
