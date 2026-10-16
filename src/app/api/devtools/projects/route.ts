import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { getAdminSession, requireAdmin } from "@/lib/devtools/session";
import { isDbConnectionError } from "@/lib/devtools/pg-meta";
import { getIp, recordActivity, recordApiRequest, recordError } from "@/lib/devtools/log";

export const dynamic = "force-dynamic";

const stringList = z.array(z.string().max(200)).max(50);
const linkList = z.array(z.object({ label: z.string().max(200), url: z.string().max(1000) })).max(20);
const issueSchema = z.object({
  id: z.string().max(50),
  title: z.string().max(300),
  severity: z.enum(["critical", "major", "minor"]),
  description: z.string(),
  rootCause: z.string(),
  resolution: z.string(),
});
const verificationSchema = z.object({ label: z.string().max(300), status: z.enum(["verified", "failed", "pending"]) });
const faqSchema = z.object({ question: z.string().max(500), answer: z.string() });

const createSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  industry: z.string().max(100).optional(),
  platform: z.enum(["Shopify", "Shopify Plus"]).optional(),
  partnerType: z.string().max(100).optional(),
  thumbnail: z.string().max(1000).optional(),
  heroImage: z.string().max(1000).optional(),
  gallery: stringList.optional(),
  summary: z.string().optional(),
  challenge: z.string().optional(),
  investigation: z.string().optional(),
  rootCause: z.string().optional(),
  resolution: z.string().optional(),
  outcome: z.string().optional(),
  testingScope: stringList.optional(),
  issues: z.array(issueSchema).max(100).optional(),
  beforeImage: z.string().max(1000).optional(),
  afterImage: z.string().max(1000).optional(),
  verification: z.array(verificationSchema).max(50).optional(),
  technologies: stringList.optional(),
  externalLinks: linkList.optional(),
  faqs: z.array(faqSchema).max(30).optional(),
  seoTitle: z.string().max(300).optional(),
  seoDescription: z.string().max(500).optional(),
  seoImage: z.string().max(1000).optional(),
  seoCanonical: z.string().max(1000).optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

const updateSchema = createSchema.partial();

function pick(data: z.infer<typeof createSchema>) {
  return {
    title: data.title,
    slug: data.slug,
    industry: data.industry ?? null,
    platform: data.platform ?? null,
    partnerType: data.partnerType ?? null,
    thumbnail: data.thumbnail ?? null,
    heroImage: data.heroImage ?? null,
    gallery: data.gallery ?? [],
    summary: data.summary ?? null,
    challenge: data.challenge ?? null,
    investigation: data.investigation ?? null,
    rootCause: data.rootCause ?? null,
    resolution: data.resolution ?? null,
    outcome: data.outcome ?? null,
    testingScope: data.testingScope ?? [],
    issues: data.issues ?? [],
    beforeImage: data.beforeImage ?? null,
    afterImage: data.afterImage ?? null,
    verification: data.verification ?? [],
    technologies: data.technologies ?? [],
    externalLinks: data.externalLinks ?? [],
    faqs: data.faqs ?? [],
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
    seoImage: data.seoImage ?? null,
    seoCanonical: data.seoCanonical ?? null,
    status: data.status,
  };
}

function parseId(raw: string): number | null {
  const n = Number.parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function GET(req: NextRequest) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const rows = await db
      .select({
        id: projects.id,
        title: projects.title,
        slug: projects.slug,
        industry: projects.industry,
        platform: projects.platform,
        featured: projects.featured,
        status: projects.status,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .orderBy(desc(projects.updatedAt));
    recordApiRequest("GET", "/api/devtools/projects", 200, Date.now() - started);
    return NextResponse.json({ projects: rows });
  } catch (error) {
    if (isDbConnectionError(error)) return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    recordError("devtools/projects", error instanceof Error ? error.message : "Unknown error", undefined, { op: "list" });
    recordApiRequest("GET", "/api/devtools/projects", 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const session = await getAdminSession(req);
  const email = session?.email ?? null;
  const ip = getIp(req);

  try {
    const body = await req.json().catch(() => null);
    const data = createSchema.parse(body);
    const [created] = await db.insert(projects).values(pick(data)).returning();
    recordActivity(email, "project.create", created.slug, { id: created.id, ip }, ip ?? undefined);
    recordApiRequest("POST", "/api/devtools/projects", 201, Date.now() - started);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      recordApiRequest("POST", "/api/devtools/projects", 400, Date.now() - started, "validation failed");
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("unique")) {
      recordApiRequest("POST", "/api/devtools/projects", 409, Date.now() - started, "slug exists");
      return NextResponse.json({ error: "A project with that slug already exists." }, { status: 409 });
    }
    if (isDbConnectionError(error)) return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    recordError("devtools/projects", error instanceof Error ? error.message : "Unknown error", undefined, { op: "create" });
    recordApiRequest("POST", "/api/devtools/projects", 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
