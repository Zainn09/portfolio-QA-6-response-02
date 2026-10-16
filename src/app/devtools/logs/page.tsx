import type { Metadata } from "next";
import { ensureAdmin } from "@/lib/devtools/ensure";
import { ActivityLog } from "@/components/devtools/ActivityLog";

export const metadata: Metadata = { title: "Activity log · DevTools" };
export const dynamic = "force-dynamic";

export default async function DevToolsActivityLogPage() {
  await ensureAdmin();
  return <ActivityLog />;
}
