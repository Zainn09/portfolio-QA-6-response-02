import type { Metadata } from "next";
import { WorkArchive } from "@/components/archive/WorkArchive";
import { getAllProjects, getUniqueIndustries, getUniquePlatforms } from "@/data/projects";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Work — 100+ Shopify QA Case Studies",
  description:
    "Browse all 100+ QA case studies across Shopify and Shopify Plus stores. Filter by industry, platform, and testing scope.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "All Work — 100+ Shopify QA Case Studies",
    description:
      "Browse all 100+ QA case studies across Shopify and Shopify Plus stores. Filter by industry, platform, and testing scope.",
    url: absoluteUrl("/work"),
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default function WorkPage() {
  const projects = getAllProjects();
  const industries = getUniqueIndustries();
  const platforms = getUniquePlatforms();

  // An ItemList of the archive gives crawlers the full case-study index in a
  // single, machine-readable hop from /work.
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shopify QA Case Studies",
    description:
      "Every published Shopify and Shopify Plus QA case study, with defects found and outcomes verified.",
    url: absoluteUrl("/work"),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        url: absoluteUrl(`/work/${p.slug}`),
      })),
    },
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Work", item: absoluteUrl("/work") },
    ],
  };

  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <JsonLd data={[collectionLd, breadcrumbsLd]} />
      <WorkArchive projects={projects} industries={industries} platforms={platforms} />
    </div>
  );
}
