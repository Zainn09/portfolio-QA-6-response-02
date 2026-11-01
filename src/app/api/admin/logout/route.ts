import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession, getAdminSession } from "@/lib/devtools/session";
import { getIp, recordActivity } from "@/lib/devtools/log";

export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  const ip = getIp(req);
  const response = NextResponse.json({ success: true });
  clearAdminSession(response);
  if (session) recordActivity(session.email, "logout", undefined, { ip }, ip ?? undefined);
  return response;
}
