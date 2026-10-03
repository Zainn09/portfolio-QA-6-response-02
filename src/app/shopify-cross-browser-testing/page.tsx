import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyCrossBrowserTesting } from "@/data/services/shopify-cross-browser-testing";

export const metadata: Metadata = {
  title: { absolute: shopifyCrossBrowserTesting.title },
  description: shopifyCrossBrowserTesting.metaDescription,
  alternates: { canonical: "/shopify-cross-browser-testing" },
  openGraph: {
    title: shopifyCrossBrowserTesting.title,
    description: shopifyCrossBrowserTesting.metaDescription,
    url: "/shopify-cross-browser-testing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyCrossBrowserTesting.title,
    description: shopifyCrossBrowserTesting.metaDescription,
  },
};

export default function Page() {
  return <ServicePage content={shopifyCrossBrowserTesting} />;
}
