import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyPlusQa } from "@/data/services/shopify-plus-qa";
import { socialCardUrl } from "@/lib/site";

const card = socialCardUrl({ title: shopifyPlusQa.h1, kicker: shopifyPlusQa.eyebrow });

export const metadata: Metadata = {
  title: { absolute: shopifyPlusQa.title },
  description: shopifyPlusQa.metaDescription,
  alternates: { canonical: "/shopify-plus-qa" },
  openGraph: {
    title: shopifyPlusQa.title,
    description: shopifyPlusQa.metaDescription,
    url: "/shopify-plus-qa",
    type: "website",
    images: [{ url: card, width: 1200, height: 630, alt: shopifyPlusQa.h1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyPlusQa.title,
    description: shopifyPlusQa.metaDescription,
    images: [card],
  },
};

export default function Page() {
  return <ServicePage content={shopifyPlusQa} />;
}
