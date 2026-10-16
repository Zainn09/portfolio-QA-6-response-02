import type { Metadata } from "next";
import { ensureAdmin } from "@/lib/devtools/ensure";
import { HealthPanel } from "@/components/devtools/HealthPanel";

export const metadata: Metadata = { title: "System health · DevTools" };
export const dynamic = "force-dynamic";

export default async function DevToolsHealthPanelPage() {
  await ensureAdmin();
  return <HealthPanel />;
}
