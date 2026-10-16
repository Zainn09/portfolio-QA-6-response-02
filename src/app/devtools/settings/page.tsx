import type { Metadata } from "next";
import { ensureAdmin } from "@/lib/devtools/ensure";
import { SettingsPanel } from "@/components/devtools/SettingsPanel";

export const metadata: Metadata = { title: "Settings · DevTools" };
export const dynamic = "force-dynamic";

export default async function DevToolsSettingsPanelPage() {
  await ensureAdmin();
  return <SettingsPanel />;
}
