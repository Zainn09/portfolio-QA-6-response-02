import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyMobileTesting } from "@/data/services/shopify-mobile-testing";

export const metadata: Metadata = {
  title: { absolute: shopifyMobileTesting.title },
  description: shopifyMobileTesting.metaDescription,
  alternates: { canonical: "/shopify-mobile-testing" },
  openGraph: {
    title: shopifyMobileTesting.title,
    description: shopifyMobileTesting.metaDescription,
    url: "/shopify-mobile-testing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyMobileTesting.title,
    description: shopifyMobileTesting.metaDescription,
  },
};

export default function Page() {
  return <ServicePage content={shopifyMobileTesting} />;
}
