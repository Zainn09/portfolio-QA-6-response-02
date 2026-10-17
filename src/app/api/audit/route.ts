import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { auditRequests } from "@/db/schema";
import { z } from "zod";
import { recordApiRequest, recordError } from "@/lib/devtools/log";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  storeUrl: z.string().min(3),
  platform: z.string().min(1),
  reviewScope: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const started = Date.now();
  try {
    const body = await req.json();
    const data = schema.parse(body);

    await db.insert(auditRequests).values({
      name: data.name,
      email: data.email,
      storeUrl: data.storeUrl,
      platform: data.platform,
      reviewScope: data.reviewScope,
      message: data.message,
      status: "new",
    });

    recordApiRequest("POST", "/api/audit", 200, Date.now() - started);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      recordApiRequest("POST", "/api/audit", 400, Date.now() - started, "validation failed");
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }
    recordError("api/audit", error instanceof Error ? error.message : "Unknown error", error instanceof Error ? error.stack : undefined);
    recordApiRequest("POST", "/api/audit", 500, Date.now() - started, "insert failed");
    console.error("Audit request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
