import { ARTICLE_CATEGORIES } from "@/data/articles";

export function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function categoryFromSlug(slug: string): string | undefined {
  return ARTICLE_CATEGORIES.find((c) => categorySlug(c) === slug);
}

export const CLUSTER_COPY: Record<string, { deck: string }> = {
  CRO: {
    deck: "Conversion-rate teardowns from real Shopify audits: checkout friction, trust gaps, form noise and the fixes that moved revenue per session.",
  },
  "AOV & Merchandising": {
    deck: "Average-order-value plays: bundles, upsells, cart thresholds and merchandising patterns that make every visit worth more.",
  },
  "AI Commerce": {
    deck: "Where AI actually helps a storefront: personalized search, support automation, AI-assisted QA workflows — separated from the hype.",
  },
  "eCommerce Growth": {
    deck: "Retention, email, analytics and acquisition hygiene — the unglamorous systems that compound a store's growth month over month.",
  },
  "UX & Performance": {
    deck: "Speed, accessibility, responsive behaviour and interaction polish: the user-experience layer that quietly decides whether visitors stay.",
  },
  Shopify: {
    deck: "Platform-specific notes for Shopify merchants: themes, apps, metaobjects, native checkout behaviour and the quirks only QA surfaces.",
  },
};
