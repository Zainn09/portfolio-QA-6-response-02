import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyQaAudit } from "@/data/services/shopify-qa-audit";

export const metadata: Metadata = {
  title: { absolute: shopifyQaAudit.title },
  description: shopifyQaAudit.metaDescription,
  alternates: { canonical: "/shopify-qa-audit" },
  openGraph: {
    title: shopifyQaAudit.title,
    description: shopifyQaAudit.metaDescription,
    url: "/shopify-qa-audit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyQaAudit.title,
    description: shopifyQaAudit.metaDescription,
  },
};

export default function Page() {
  return <ServicePage content={shopifyQaAudit} />;
}
