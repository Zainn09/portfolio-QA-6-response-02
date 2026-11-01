import type { Metadata } from "next";
import { ensureAdmin } from "@/lib/devtools/ensure";
import { ProjectsManager } from "@/components/devtools/ProjectsManager";

export const metadata: Metadata = { title: "Projects · DevTools" };
export const dynamic = "force-dynamic";

export default async function DevToolsProjectsManagerPage() {
  await ensureAdmin();
  return <ProjectsManager />;
}
