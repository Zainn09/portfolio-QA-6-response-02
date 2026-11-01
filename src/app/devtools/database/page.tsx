import type { Metadata } from "next";
import { ensureAdmin } from "@/lib/devtools/ensure";
import { DatabaseExplorer } from "@/components/devtools/DatabaseExplorer";

export const metadata: Metadata = { title: "Database explorer · DevTools" };
export const dynamic = "force-dynamic";

export default async function DevToolsDatabaseExplorerPage() {
  await ensureAdmin();
  return <DatabaseExplorer />;
}
