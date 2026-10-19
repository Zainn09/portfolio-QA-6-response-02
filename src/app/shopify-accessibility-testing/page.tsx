import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyAccessibilityTesting } from "@/data/services/shopify-accessibility-testing";
import { socialCardUrl } from "@/lib/site";

const card = socialCardUrl({ title: shopifyAccessibilityTesting.h1, kicker: shopifyAccessibilityTesting.eyebrow });

export const metadata: Metadata = {
  title: { absolute: shopifyAccessibilityTesting.title },
  description: shopifyAccessibilityTesting.metaDescription,
  alternates: { canonical: "/shopify-accessibility-testing" },
  openGraph: {
    title: shopifyAccessibilityTesting.title,
    description: shopifyAccessibilityTesting.metaDescription,
    url: "/shopify-accessibility-testing",
    type: "website",
    images: [{ url: card, width: 1200, height: 630, alt: shopifyAccessibilityTesting.h1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyAccessibilityTesting.title,
    description: shopifyAccessibilityTesting.metaDescription,
    images: [card],
  },
};

export default function Page() {
  return <ServicePage content={shopifyAccessibilityTesting} />;
}
