import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyQaTesting } from "@/data/services/shopify-qa-testing";

export const metadata: Metadata = {
  title: { absolute: shopifyQaTesting.title },
  description: shopifyQaTesting.metaDescription,
  alternates: { canonical: "/shopify-qa-testing" },
  openGraph: {
    title: shopifyQaTesting.title,
    description: shopifyQaTesting.metaDescription,
    url: "/shopify-qa-testing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyQaTesting.title,
    description: shopifyQaTesting.metaDescription,
  },
};

export default function Page() {
  return <ServicePage content={shopifyQaTesting} />;
}
