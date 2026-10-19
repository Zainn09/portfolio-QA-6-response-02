import type { ServicePageContent } from "./types";

import { ecommerceQaTesting } from "./ecommerce-qa-testing";
import { shopifyAccessibilityTesting } from "./shopify-accessibility-testing";
import { shopifyCheckoutTesting } from "./shopify-checkout-testing";
import { shopifyCrossBrowserTesting } from "./shopify-cross-browser-testing";
import { shopifyMobileTesting } from "./shopify-mobile-testing";
import { shopifyPerformanceTesting } from "./shopify-performance-testing";
import { shopifyPlusQa } from "./shopify-plus-qa";
import { shopifyQaAudit } from "./shopify-qa-audit";
import { shopifyQaTesting } from "./shopify-qa-testing";
import { shopifyRegressionTesting } from "./shopify-regression-testing";

/**
 * The 10 service landing pages, ordered broad → specific so the hub pages
 * come first in listings and internal link blocks.
 */
export const servicePages: ServicePageContent[] = [
  ecommerceQaTesting,
  shopifyQaTesting,
  shopifyPlusQa,
  shopifyCheckoutTesting,
  shopifyMobileTesting,
  shopifyAccessibilityTesting,
  shopifyCrossBrowserTesting,
  shopifyPerformanceTesting,
  shopifyRegressionTesting,
  shopifyQaAudit,
];

export const serviceBySlug = new Map(servicePages.map((s) => [s.slug, s]));

/** Paths for the sitemap. */
export const servicePaths = servicePages.map((s) => `/${s.slug}`);

export type { ServicePageContent, ServiceBlock, ServiceFaq } from "./types";
