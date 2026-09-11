import type { Metadata } from "next";
import { WorkArchive } from "@/components/archive/WorkArchive";
import { getAllProjects, getUniqueIndustries, getUniquePlatforms } from "@/data/projects";

export const metadata: Metadata = {
  title: "All Work — 50+ Shopify QA Case Studies",
  description:
    "Browse all 50+ QA case studies across Shopify and Shopify Plus stores. Filter by industry, platform, and testing scope.",
  alternates: { canonical: "/work" },
};

export const dynamic = "force-dynamic";

export default function WorkPage() {
  const projects = getAllProjects();
  const industries = getUniqueIndustries();
  const platforms = getUniquePlatforms();

  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <WorkArchive projects={projects} industries={industries} platforms={platforms} />
    </div>
  );
}
