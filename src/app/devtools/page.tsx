import type { Metadata } from "next";
import { ensureAdmin } from "@/lib/devtools/ensure";
import { OverviewDashboard } from "@/components/devtools/OverviewDashboard";

export const metadata: Metadata = { title: "Overview · DevTools" };
export const dynamic = "force-dynamic";

export default async function DevToolsOverviewPage() {
  await ensureAdmin();
  return <OverviewDashboard />;
}
