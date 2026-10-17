import type { Metadata } from "next";
import { ensureAdmin } from "@/lib/devtools/ensure";
import { ApiMonitor } from "@/components/devtools/ApiMonitor";

export const metadata: Metadata = { title: "API monitor · DevTools" };
export const dynamic = "force-dynamic";

export default async function DevToolsApiMonitorPage() {
  await ensureAdmin();
  return <ApiMonitor />;
}
