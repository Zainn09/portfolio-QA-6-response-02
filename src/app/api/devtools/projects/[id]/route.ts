import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getAdminSession, requireAdmin } from "@/lib/devtools/session";
import { isDbConnectionError } from "@/lib/devtools/pg-meta";
import { getIp, recordActivity, recordApiRequest, recordError } from "@/lib/devtools/log";

export const dynamic = "force-dynamic";

const STATUSES = ["draft", "published"] as const;

function parseId(raw: string): number | null {
  const n = Number.parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

const updateSchema = z
  .object({
    title: z.string().min(1).max(255).optional(),
    slug: z.string().min(1).max(255).optional(),
    industry: z.string().max(100).nullable().optional(),
    platform: z.enum(["Shopify", "Shopify Plus"]).nullable().optional(),
    partnerType: z.string().max(100).nullable().optional(),
    featured: z.boolean().optional(),
    featuredOrder: z.number().int().min(0).max(1000).optional(),
    thumbnail: z.string().max(1000).nullable().optional(),
    heroImage: z.string().max(1000).nullable().optional(),
    gallery: z.array(z.string().max(1000)).max(50).optional(),
    summary: z.string().nullable().optional(),
    challenge: z.string().nullable().optional(),
    investigation: z.string().nullable().optional(),
    rootCause: z.string().nullable().optional(),
    resolution: z.string().nullable().optional(),
    outcome: z.string().nullable().optional(),
    testingScope: z.array(z.string().max(200)).max(50).optional(),
    issues: z
      .array(
        z.object({
          id: z.string().max(50),
          title: z.string().max(300),
          severity: z.enum(["critical", "major", "minor"]),
          description: z.string(),
          rootCause: z.string(),
          resolution: z.string(),
        }),
      )
      .max(100)
      .optional(),
    beforeImage: z.string().max(1000).nullable().optional(),
    afterImage: z.string().max(1000).nullable().optional(),
    verification: z.array(z.object({ label: z.string().max(300), status: z.enum(["verified", "failed", "pending"]) })).max(50).optional(),
    technologies: z.array(z.string().max(200)).max(50).optional(),
    externalLinks: z.array(z.object({ label: z.string().max(200), url: z.string().max(1000) })).max(20).optional(),
    faqs: z.array(z.object({ question: z.string().max(500), answer: z.string() })).max(30).optional(),
    seoTitle: z.string().max(300).nullable().optional(),
    seoDescription: z.string().max(500).nullable().optional(),
    seoImage: z.string().max(1000).nullable().optional(),
    seoCanonical: z.string().max(1000).nullable().optional(),
    status: z.enum(STATUSES).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: "No fields to update" });

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const id = parseId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid project id" }, { status: 400 });

  try {
    const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    const project = rows[0];
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    recordApiRequest("GET", `/api/devtools/projects/${id}`, 200, Date.now() - started);
    return NextResponse.json(project);
  } catch (error) {
    if (isDbConnectionError(error)) return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    recordError("devtools/projects/[id]", error instanceof Error ? error.message : "Unknown error", undefined, { op: "get", id });
    recordApiRequest("GET", `/api/devtools/projects/${id}`, 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const session = await getAdminSession(req);
  const email = session?.email ?? null;
  const ip = getIp(req);
  const id = parseId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid project id" }, { status: 400 });

  try {
    const body = await req.json().catch(() => null);
    const data = updateSchema.parse(body);
    const before = (await db.select().from(projects).where(eq(projects.id, id)).limit(1))[0];
    if (!before) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const values: Record<string, unknown> = { ...data, updatedAt: new Date() };
    const [updated] = await db.update(projects).set(values as never).where(eq(projects.id, id)).returning();

    const changed = Object.keys(data).filter((k) => JSON.stringify(before[k as keyof typeof before]) !== JSON.stringify(data[k as keyof typeof data]));
    recordActivity(email, "project.update", updated.slug, { id, fields: changed, ip }, ip ?? undefined);
    recordApiRequest("PATCH", `/api/devtools/projects/${id}`, 200, Date.now() - started);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      recordApiRequest("PATCH", `/api/devtools/projects/${id}`, 400, Date.now() - started, "validation failed");
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    if (isDbConnectionError(error)) return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    recordError("devtools/projects/[id]", error instanceof Error ? error.message : "Unknown error", undefined, { op: "patch", id });
    recordApiRequest("PATCH", `/api/devtools/projects/${id}`, 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const session = await getAdminSession(req);
  const email = session?.email ?? null;
  const ip = getIp(req);
  const id = parseId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid project id" }, { status: 400 });

  try {
    const before = (await db.select().from(projects).where(eq(projects.id, id)).limit(1))[0];
    if (!before) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    await db.delete(projects).where(eq(projects.id, id));
    recordActivity(email, "project.delete", before.slug, { id, title: before.title, ip }, ip ?? undefined);
    recordApiRequest("DELETE", `/api/devtools/projects/${id}`, 200, Date.now() - started);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (isDbConnectionError(error)) return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    recordError("devtools/projects/[id]", error instanceof Error ? error.message : "Unknown error", undefined, { op: "delete", id });
    recordApiRequest("DELETE", `/api/devtools/projects/${id}`, 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
