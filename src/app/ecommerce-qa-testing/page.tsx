import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { ecommerceQaTesting } from "@/data/services/ecommerce-qa-testing";
import { socialCardUrl } from "@/lib/site";

const card = socialCardUrl({ title: ecommerceQaTesting.h1, kicker: ecommerceQaTesting.eyebrow });

export const metadata: Metadata = {
  title: { absolute: ecommerceQaTesting.title },
  description: ecommerceQaTesting.metaDescription,
  alternates: { canonical: "/ecommerce-qa-testing" },
  openGraph: {
    title: ecommerceQaTesting.title,
    description: ecommerceQaTesting.metaDescription,
    url: "/ecommerce-qa-testing",
    type: "website",
    images: [{ url: card, width: 1200, height: 630, alt: ecommerceQaTesting.h1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: ecommerceQaTesting.title,
    description: ecommerceQaTesting.metaDescription,
    images: [card],
  },
};

export default function Page() {
  return <ServicePage content={ecommerceQaTesting} />;
}
