import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyCheckoutTesting } from "@/data/services/shopify-checkout-testing";

export const metadata: Metadata = {
  title: { absolute: shopifyCheckoutTesting.title },
  description: shopifyCheckoutTesting.metaDescription,
  alternates: { canonical: "/shopify-checkout-testing" },
  openGraph: {
    title: shopifyCheckoutTesting.title,
    description: shopifyCheckoutTesting.metaDescription,
    url: "/shopify-checkout-testing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyCheckoutTesting.title,
    description: shopifyCheckoutTesting.metaDescription,
  },
};

export default function Page() {
  return <ServicePage content={shopifyCheckoutTesting} />;
}
