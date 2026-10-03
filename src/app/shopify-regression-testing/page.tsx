import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyRegressionTesting } from "@/data/services/shopify-regression-testing";
import { socialCardUrl } from "@/lib/site";

const card = socialCardUrl({ title: shopifyRegressionTesting.h1, kicker: shopifyRegressionTesting.eyebrow });

export const metadata: Metadata = {
  title: { absolute: shopifyRegressionTesting.title },
  description: shopifyRegressionTesting.metaDescription,
  alternates: { canonical: "/shopify-regression-testing" },
  openGraph: {
    title: shopifyRegressionTesting.title,
    description: shopifyRegressionTesting.metaDescription,
    url: "/shopify-regression-testing",
    type: "website",
    images: [{ url: card, width: 1200, height: 630, alt: shopifyRegressionTesting.h1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyRegressionTesting.title,
    description: shopifyRegressionTesting.metaDescription,
    images: [card],
  },
};

export default function Page() {
  return <ServicePage content={shopifyRegressionTesting} />;
}
