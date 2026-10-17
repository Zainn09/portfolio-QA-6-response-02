import { redirect } from "next/navigation";
import { getAdminSessionForPage } from "@/lib/devtools/session";

/**
 * Server-side auth gate for DevTools pages. Every page under /devtools
 * (except the login page) must call this at the top. Fail-closed: no valid
 * signed session → redirect to /devtools/login.
 */
export async function ensureAdmin(): Promise<void> {
  const session = await getAdminSessionForPage();
  if (!session) redirect("/devtools/login");
}
