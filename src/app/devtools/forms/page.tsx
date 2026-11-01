import type { Metadata } from "next";
import { ensureAdmin } from "@/lib/devtools/ensure";
import { SubmissionsManager } from "@/components/devtools/SubmissionsManager";

export const metadata: Metadata = { title: "Submissions · DevTools" };
export const dynamic = "force-dynamic";

export default async function DevToolsSubmissionsManagerPage() {
  await ensureAdmin();
  return <SubmissionsManager />;
}
