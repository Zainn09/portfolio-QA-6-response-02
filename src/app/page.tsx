import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { ShowreelSection } from "@/components/showreel/ShowreelSection";
import { FeaturedProjects } from "@/components/featured-work/FeaturedProjects";
import { ExpertiseSection } from "@/components/expertise/ExpertiseSection";
import { BugsSection } from "@/components/expertise/BugsSection";
import { ProcessSection } from "@/components/process/ProcessSection";
import { AuditCTA } from "@/components/audit/AuditCTA";
import { ContactSection } from "@/components/contact/ContactSection";
import { getFeaturedProjects } from "@/data/projects";
import { Toaster } from "react-hot-toast";
import { ScrollToTopOnLoad } from "@/components/scroll/ScrollToTopOnLoad";
import { SITE_HOME } from "@/lib/site";

export const metadata: Metadata = {
  title: "QA Specialist — Shopify & Shopify Plus Quality Assurance",
  description:
    "Premium QA for Shopify and Shopify Plus stores. I find what your store gets wrong before your customers do — 100+ stores tested, 20 Shopify Plus projects.",
  // No `alternates.canonical` here on purpose — the canonical for this page is
  // rendered explicitly in the markup below. See the comment on <link> there.
  openGraph: {
    title: "QA Specialist — Shopify & Shopify Plus Quality Assurance",
    description:
      "Premium QA for Shopify and Shopify Plus stores. 100+ stores tested, 20 Shopify Plus projects.",
    url: "/",
    type: "website",
  },
};

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();

  return (
    <>
      {/*
        Explicit homepage canonical.

        This is rendered here rather than set through `metadata.alternates`
        because Next.js normalises a root-path URL down to the bare origin
        (resolve-url.js: `pathname === '/' ? result.origin : result.href`), so
        metadata can only ever emit `https://…vercel.app` — without the slash —
        while sitemap.xml publishes the homepage as `https://…vercel.app/`.
        React 19 hoists this <link> into <head> during server rendering, giving
        one canonical that matches the sitemap exactly.

        If the canonical is ever moved back into `metadata`, delete this — two
        <link rel="canonical"> tags with different values cancel each other out.
      */}
      <link rel="canonical" href={SITE_HOME} />
      <ScrollToTopOnLoad />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--bg-surface)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            fontFamily: "var(--font-sans)",
            fontSize: "0.875rem",
          },
        }}
      />
      <Hero />
      <ShowreelSection />
      <FeaturedProjects projects={featuredProjects} />
      <BugsSection />
      <ExpertiseSection />
      <ProcessSection />
      <AuditCTA />
      <ContactSection />
    </>
  );
}
