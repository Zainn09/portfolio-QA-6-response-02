import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { auditRequests, contactMessages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getAdminSession, requireAdmin } from "@/lib/devtools/session";
import { isDbConnectionError } from "@/lib/devtools/pg-meta";
import { getIp, recordActivity, recordApiRequest, recordError } from "@/lib/devtools/log";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "in_progress", "completed", "archived"] as const;

function parseId(raw: string): number | null {
  const n = Number.parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

type Form = "audit" | "contact";

/** Inspect one submission (either form). */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const id = parseId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid submission id" }, { status: 400 });

  try {
    const [audit, contact] = await Promise.all([
      db.select().from(auditRequests).where(eq(auditRequests.id, id)).limit(1),
      db.select().from(contactMessages).where(eq(contactMessages.id, id)).limit(1),
    ]);
    const form: Form = audit.length > 0 ? "audit" : contact.length > 0 ? "contact" : ("none" as never);
    const record = audit[0] ?? contact[0];
    if (!record) {
      recordApiRequest("GET", `/api/devtools/submissions/${id}`, 404, Date.now() - started);
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }
    recordApiRequest("GET", `/api/devtools/submissions/${id}`, 200, Date.now() - started);
    return NextResponse.json({ form, record });
  } catch (error) {
    if (isDbConnectionError(error)) {
      return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    }
    recordError("devtools/submissions/[id]", error instanceof Error ? error.message : "Unknown error", undefined, { op: "get", id });
    recordApiRequest("GET", `/api/devtools/submissions/${id}`, 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const patchSchema = z.object({
  form: z.enum(["audit", "contact"]),
  status: z.enum(STATUSES).optional(),
  notes: z.string().max(5000).nullable().optional(),
});

/** Update status / internal notes. Every change is audit-logged with before → after. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const session = await getAdminSession(req);
  const email = session?.email ?? null;
  const ip = getIp(req);
  const id = parseId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid submission id" }, { status: 400 });

  try {
    const body = await req.json().catch(() => null);
    const data = patchSchema.parse(body);
    const table = data.form === "audit" ? auditRequests : contactMessages;
    const before = (await db.select().from(table).where(eq(table.id, id)).limit(1))[0];
    if (!before) return NextResponse.json({ error: "Submission not found" }, { status: 404 });

    const values: Record<string, unknown> = {};
    if (data.status !== undefined) values.status = data.status;
    if (data.notes !== undefined) values.notes = data.notes;
    if (Object.keys(values).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const [updated] = await db.update(table).set(values).where(eq(table.id, id)).returning();
    recordActivity(
      email,
      "submission.update",
      `${data.form}#${id}`,
      {
        changes: {
          ...(values.status !== undefined ? { status: { from: before.status ?? null, to: data.status } } : {}),
          ...(values.notes !== undefined ? { notes: { from: before.notes ?? null, to: data.notes } } : {}),
        },
        ip,
      },
      ip ?? undefined,
    );
    recordApiRequest("PATCH", `/api/devtools/submissions/${id}`, 200, Date.now() - started);
    return NextResponse.json({ form: data.form, record: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      recordApiRequest("PATCH", `/api/devtools/submissions/${id}`, 400, Date.now() - started, "validation failed");
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    if (isDbConnectionError(error)) return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    recordError("devtools/submissions/[id]", error instanceof Error ? error.message : "Unknown error", undefined, { op: "patch", id });
    recordApiRequest("PATCH", `/api/devtools/submissions/${id}`, 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Hard delete (client requires explicit confirmation). The deleted content is
 * preserved in the activity log so the trail is not the only memory of it.
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const started = Date.now();
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const session = await getAdminSession(req);
  const email = session?.email ?? null;
  const ip = getIp(req);
  const id = parseId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid submission id" }, { status: 400 });

  try {
    const body = await req.json().catch(() => ({}));
    const form = body?.form === "contact" ? ("contact" as const) : ("audit" as const);
    const table = form === "audit" ? auditRequests : contactMessages;
    const before = (await db.select().from(table).where(eq(table.id, id)).limit(1))[0];
    if (!before) return NextResponse.json({ error: "Submission not found" }, { status: 404 });

    await db.delete(table).where(eq(table.id, id));
    recordActivity(
      email,
      "submission.delete",
      `${form}#${id}`,
      {
        snapshot: { name: before.name, email: before.email, status: before.status ?? null },
        ip,
      },
      ip ?? undefined,
    );
    recordApiRequest("DELETE", `/api/devtools/submissions/${id}`, 200, Date.now() - started);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (isDbConnectionError(error)) return NextResponse.json({ error: "Database unreachable." }, { status: 503 });
    recordError("devtools/submissions/[id]", error instanceof Error ? error.message : "Unknown error", undefined, { op: "delete", id });
    recordApiRequest("DELETE", `/api/devtools/submissions/${id}`, 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
