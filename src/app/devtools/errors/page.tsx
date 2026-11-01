import type { Metadata } from "next";
import { ensureAdmin } from "@/lib/devtools/ensure";
import { ErrorsList } from "@/components/devtools/ErrorsList";

export const metadata: Metadata = { title: "Application errors · DevTools" };
export const dynamic = "force-dynamic";

export default async function DevToolsErrorsListPage() {
  await ensureAdmin();
  return <ErrorsList />;
}
