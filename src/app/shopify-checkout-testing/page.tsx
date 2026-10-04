import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyCheckoutTesting } from "@/data/services/shopify-checkout-testing";
import { socialCardUrl } from "@/lib/site";

const card = socialCardUrl({ title: shopifyCheckoutTesting.h1, kicker: shopifyCheckoutTesting.eyebrow });

export const metadata: Metadata = {
  title: { absolute: shopifyCheckoutTesting.title },
  description: shopifyCheckoutTesting.metaDescription,
  alternates: { canonical: "/shopify-checkout-testing" },
  openGraph: {
    title: shopifyCheckoutTesting.title,
    description: shopifyCheckoutTesting.metaDescription,
    url: "/shopify-checkout-testing",
    type: "website",
    images: [{ url: card, width: 1200, height: 630, alt: shopifyCheckoutTesting.h1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyCheckoutTesting.title,
    description: shopifyCheckoutTesting.metaDescription,
    images: [card],
  },
};

export default function Page() {
  return <ServicePage content={shopifyCheckoutTesting} />;
}
