import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyQaAudit } from "@/data/services/shopify-qa-audit";
import { socialCardUrl } from "@/lib/site";

const card = socialCardUrl({ title: shopifyQaAudit.h1, kicker: shopifyQaAudit.eyebrow });

export const metadata: Metadata = {
  title: { absolute: shopifyQaAudit.title },
  description: shopifyQaAudit.metaDescription,
  alternates: { canonical: "/shopify-qa-audit" },
  openGraph: {
    title: shopifyQaAudit.title,
    description: shopifyQaAudit.metaDescription,
    url: "/shopify-qa-audit",
    type: "website",
    images: [{ url: card, width: 1200, height: 630, alt: shopifyQaAudit.h1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyQaAudit.title,
    description: shopifyQaAudit.metaDescription,
    images: [card],
  },
};

export default function Page() {
  return <ServicePage content={shopifyQaAudit} />;
}
