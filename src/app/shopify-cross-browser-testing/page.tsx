import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyCrossBrowserTesting } from "@/data/services/shopify-cross-browser-testing";
import { socialCardUrl } from "@/lib/site";

const card = socialCardUrl({ title: shopifyCrossBrowserTesting.h1, kicker: shopifyCrossBrowserTesting.eyebrow });

export const metadata: Metadata = {
  title: { absolute: shopifyCrossBrowserTesting.title },
  description: shopifyCrossBrowserTesting.metaDescription,
  alternates: { canonical: "/shopify-cross-browser-testing" },
  openGraph: {
    title: shopifyCrossBrowserTesting.title,
    description: shopifyCrossBrowserTesting.metaDescription,
    url: "/shopify-cross-browser-testing",
    type: "website",
    images: [{ url: card, width: 1200, height: 630, alt: shopifyCrossBrowserTesting.h1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyCrossBrowserTesting.title,
    description: shopifyCrossBrowserTesting.metaDescription,
    images: [card],
  },
};

export default function Page() {
  return <ServicePage content={shopifyCrossBrowserTesting} />;
}
