import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { shopifyPlusQa } from "@/data/services/shopify-plus-qa";

export const metadata: Metadata = {
  title: { absolute: shopifyPlusQa.title },
  description: shopifyPlusQa.metaDescription,
  alternates: { canonical: "/shopify-plus-qa" },
  openGraph: {
    title: shopifyPlusQa.title,
    description: shopifyPlusQa.metaDescription,
    url: "/shopify-plus-qa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: shopifyPlusQa.title,
    description: shopifyPlusQa.metaDescription,
  },
};

export default function Page() {
  return <ServicePage content={shopifyPlusQa} />;
}
