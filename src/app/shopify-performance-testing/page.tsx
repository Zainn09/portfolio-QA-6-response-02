import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyPerformanceTesting } from "@/data/services/shopify-performance-testing";

export const metadata: Metadata = {
  title: { absolute: shopifyPerformanceTesting.title },
  description: shopifyPerformanceTesting.metaDescription,
  alternates: { canonical: "/shopify-performance-testing" },
  openGraph: {
    title: shopifyPerformanceTesting.title,
    description: shopifyPerformanceTesting.metaDescription,
    url: "/shopify-performance-testing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyPerformanceTesting.title,
    description: shopifyPerformanceTesting.metaDescription,
  },
};

export default function Page() {
  return <ServicePage content={shopifyPerformanceTesting} />;
}
