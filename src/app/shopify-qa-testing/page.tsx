import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyQaTesting } from "@/data/services/shopify-qa-testing";
import { socialCardUrl } from "@/lib/site";

const card = socialCardUrl({ title: shopifyQaTesting.h1, kicker: shopifyQaTesting.eyebrow });

export const metadata: Metadata = {
  title: { absolute: shopifyQaTesting.title },
  description: shopifyQaTesting.metaDescription,
  alternates: { canonical: "/shopify-qa-testing" },
  openGraph: {
    title: shopifyQaTesting.title,
    description: shopifyQaTesting.metaDescription,
    url: "/shopify-qa-testing",
    type: "website",
    images: [{ url: card, width: 1200, height: 630, alt: shopifyQaTesting.h1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyQaTesting.title,
    description: shopifyQaTesting.metaDescription,
    images: [card],
  },
};

export default function Page() {
  return <ServicePage content={shopifyQaTesting} />;
}
