import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getIp, recordActivity, recordApiRequest, recordError } from "@/lib/devtools/log";
import { rateLimit } from "@/lib/devtools/ratelimit";
import { setAdminSession, sessionIsConfigured } from "@/lib/devtools/session";
import { isDbConnectionError } from "@/lib/devtools/pg-meta";

export async function POST(req: NextRequest) {
  const started = Date.now();
  const ip = getIp(req);

  const denied = rateLimit(`login:${ip ?? "unknown"}`, 10, 15 * 60 * 1000);
  if (!denied) {
    recordApiRequest("POST", "/api/admin/login", 429, Date.now() - started);
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  if (!sessionIsConfigured()) {
    recordApiRequest("POST", "/api/admin/login", 503, Date.now() - started);
    return NextResponse.json(
      { error: "Admin sign-in is not configured on this deployment. Set ADMIN_SESSION_SECRET." },
      { status: 503 },
    );
  }

  try {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.slice(0, 255) : "";
    const password = typeof body?.password === "string" ? body.password.slice(0, 256) : "";

    if (!email || !password) {
      recordApiRequest("POST", "/api/admin/login", 400, Date.now() - started);
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!user || !valid) {
      recordActivity(null, "login.failed", email, { ip }, ip ?? undefined);
      recordApiRequest("POST", "/api/admin/login", 401, Date.now() - started);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });
    await setAdminSession(response, { userId: user.id, email: user.email, name: user.name ?? undefined });

    recordActivity(user.email, "login.success", undefined, { ip }, ip ?? undefined);
    recordApiRequest("POST", "/api/admin/login", 200, Date.now() - started);
    return response;
  } catch (error) {
    if (isDbConnectionError(error)) {
      recordApiRequest("POST", "/api/admin/login", 503, Date.now() - started, "db unreachable");
      return NextResponse.json(
        { error: "Database unreachable — admin accounts cannot be verified right now. Try again shortly." },
        { status: 503 },
      );
    }
    recordError(
      "api/admin/login",
      error instanceof Error ? error.message : "Unknown login error",
      error instanceof Error ? error.stack : undefined,
    );
    recordApiRequest("POST", "/api/admin/login", 500, Date.now() - started, "internal error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
