import type { Metadata } from "next";
import { ensureAdmin } from "@/lib/devtools/ensure";
import { AnalyticsPanel } from "@/components/devtools/AnalyticsPanel";

export const metadata: Metadata = { title: "Analytics · DevTools" };
export const dynamic = "force-dynamic";

export default async function DevToolsAnalyticsPanelPage() {
  await ensureAdmin();
  return <AnalyticsPanel />;
}
