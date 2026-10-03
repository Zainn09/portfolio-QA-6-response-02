import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyAccessibilityTesting } from "@/data/services/shopify-accessibility-testing";

export const metadata: Metadata = {
  title: { absolute: shopifyAccessibilityTesting.title },
  description: shopifyAccessibilityTesting.metaDescription,
  alternates: { canonical: "/shopify-accessibility-testing" },
  openGraph: {
    title: shopifyAccessibilityTesting.title,
    description: shopifyAccessibilityTesting.metaDescription,
    url: "/shopify-accessibility-testing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyAccessibilityTesting.title,
    description: shopifyAccessibilityTesting.metaDescription,
  },
};

export default function Page() {
  return <ServicePage content={shopifyAccessibilityTesting} />;
}
