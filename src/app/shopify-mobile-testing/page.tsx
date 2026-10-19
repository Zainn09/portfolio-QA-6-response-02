import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyMobileTesting } from "@/data/services/shopify-mobile-testing";
import { socialCardUrl } from "@/lib/site";

const card = socialCardUrl({ title: shopifyMobileTesting.h1, kicker: shopifyMobileTesting.eyebrow });

export const metadata: Metadata = {
  title: { absolute: shopifyMobileTesting.title },
  description: shopifyMobileTesting.metaDescription,
  alternates: { canonical: "/shopify-mobile-testing" },
  openGraph: {
    title: shopifyMobileTesting.title,
    description: shopifyMobileTesting.metaDescription,
    url: "/shopify-mobile-testing",
    type: "website",
    images: [{ url: card, width: 1200, height: 630, alt: shopifyMobileTesting.h1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyMobileTesting.title,
    description: shopifyMobileTesting.metaDescription,
    images: [card],
  },
};

export default function Page() {
  return <ServicePage content={shopifyMobileTesting} />;
}
