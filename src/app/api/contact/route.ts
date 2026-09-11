import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  website: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    await db.insert(contactMessages).values({
      name: data.name,
      email: data.email,
      company: data.company,
      website: data.website,
      projectType: data.projectType,
      message: data.message,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
