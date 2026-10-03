import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyPerformanceTesting } from "@/data/services/shopify-performance-testing";
import { socialCardUrl } from "@/lib/site";

const card = socialCardUrl({ title: shopifyPerformanceTesting.h1, kicker: shopifyPerformanceTesting.eyebrow });

export const metadata: Metadata = {
  title: { absolute: shopifyPerformanceTesting.title },
  description: shopifyPerformanceTesting.metaDescription,
  alternates: { canonical: "/shopify-performance-testing" },
  openGraph: {
    title: shopifyPerformanceTesting.title,
    description: shopifyPerformanceTesting.metaDescription,
    url: "/shopify-performance-testing",
    type: "website",
    images: [{ url: card, width: 1200, height: 630, alt: shopifyPerformanceTesting.h1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyPerformanceTesting.title,
    description: shopifyPerformanceTesting.metaDescription,
    images: [card],
  },
};

export default function Page() {
  return <ServicePage content={shopifyPerformanceTesting} />;
}
