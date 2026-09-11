import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const { email, password, name } = await req.json();
    const emailToUse = email || "admin@qaspecialist.com";
    const passwordToUse = password || "admin123";
    const nameToUse = name || "QA Admin";

    // Check if user exists
    const [existing] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, emailToUse))
      .limit(1);

    if (existing) {
      return NextResponse.json({ message: "Admin user already exists" });
    }

    const hash = await bcrypt.hash(passwordToUse, 12);
    const [user] = await db
      .insert(adminUsers)
      .values({ email: emailToUse, passwordHash: hash, name: nameToUse })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Admin user created",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed" }, { status: 500 });
  }
}
