import type { Metadata } from "next";
import { getAdminSessionForPage, sessionIsConfigured } from "@/lib/devtools/session";
import { Shell } from "@/components/devtools/Shell";
import "./devtools.css";

/**
 * Private DevTools console.
 * - noindex: this area must never be crawled or indexed.
 * - Every page under /devtools (except /devtools/login) starts with
 *   `await ensureAdmin()`, which redirects anonymous visitors to the login
 *   page. The gate is server-side, per page, and fail-closed.
 */
export const metadata: Metadata = {
  title: "DevTools",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function DevToolsLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSessionForPage();
  return (
    <Shell userEmail={session?.email ?? null} userName={session?.name ?? null} configured={sessionIsConfigured()}>
      {children}
    </Shell>
  );
}
