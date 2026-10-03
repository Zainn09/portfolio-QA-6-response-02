import type { Metadata } from "next";
import { ServicePage } from "@/components/services/ServicePage";
import { ecommerceQaTesting } from "@/data/services/ecommerce-qa-testing";

export const metadata: Metadata = {
  title: { absolute: ecommerceQaTesting.title },
  description: ecommerceQaTesting.metaDescription,
  alternates: { canonical: "/ecommerce-qa-testing" },
  openGraph: {
    title: ecommerceQaTesting.title,
    description: ecommerceQaTesting.metaDescription,
    url: "/ecommerce-qa-testing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: ecommerceQaTesting.title,
    description: ecommerceQaTesting.metaDescription,
  },
};

export default function Page() {
  return <ServicePage content={ecommerceQaTesting} />;
}
