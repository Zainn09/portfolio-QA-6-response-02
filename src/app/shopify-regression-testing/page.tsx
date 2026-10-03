import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyRegressionTesting } from "@/data/services/shopify-regression-testing";

export const metadata: Metadata = {
  title: { absolute: shopifyRegressionTesting.title },
  description: shopifyRegressionTesting.metaDescription,
  alternates: { canonical: "/shopify-regression-testing" },
  openGraph: {
    title: shopifyRegressionTesting.title,
    description: shopifyRegressionTesting.metaDescription,
    url: "/shopify-regression-testing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyRegressionTesting.title,
    description: shopifyRegressionTesting.metaDescription,
  },
};

export default function Page() {
  return <ServicePage content={shopifyRegressionTesting} />;
}
