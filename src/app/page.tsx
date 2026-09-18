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

export const metadata: Metadata = {
  title: "QA Specialist — Shopify & Shopify Plus Quality Assurance",
  description:
    "Premium Quality Assurance for Shopify and Shopify Plus stores. I find what your store gets wrong before your customers do. 50+ stores tested.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();

  return (
    <>
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
