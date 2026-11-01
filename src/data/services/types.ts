/**
 * Content model for the QA service landing pages.
 *
 * Ten pages share this shape so they render through one component and stay
 * visually identical to the rest of the site — but every field is per-page
 * content, so no two pages read alike.
 */

export type ServiceBlock =
  | { type: "prose"; eyebrow?: string; heading: string; paragraphs: string[] }
  | {
      type: "cards";
      eyebrow?: string;
      heading: string;
      intro?: string;
      columns?: 2 | 3;
      cards: { title: string; text: string }[];
    }
  | {
      type: "steps";
      eyebrow?: string;
      heading: string;
      intro?: string;
      steps: { title: string; text: string }[];
    }
  | {
      type: "checklist";
      eyebrow?: string;
      heading: string;
      intro?: string;
      items: { title: string; text?: string }[];
    }
  | {
      type: "table";
      eyebrow?: string;
      heading: string;
      intro?: string;
      headers: string[];
      rows: string[][];
    }
  | { type: "callout"; heading: string; text: string }
  | {
      type: "links";
      eyebrow?: string;
      heading: string;
      intro?: string;
      items: { href: string; label: string; text: string }[];
    };

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServicePageContent {
  /** URL path segment — the page lives at /{slug}. */
  slug: string;

  /* ── Metadata ─────────────────────────────────────────────────────────── */
  /** Absolute <title>. Unique per page; bypasses the layout title template. */
  title: string;
  metaDescription: string;

  /* ── Hero ─────────────────────────────────────────────────────────────── */
  eyebrow: string;
  h1: string;
  lead: string;
  /** Concrete promises shown as a short list under the lead. */
  heroPoints: string[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };

  /* ── Structured data ──────────────────────────────────────────────────── */
  schemaName: string;
  schemaDescription: string;
  serviceType: string[];
  /** Short crumb label, e.g. "Shopify QA Testing". */
  crumb: string;

  /* ── Body ─────────────────────────────────────────────────────────────── */
  blocks: ServiceBlock[];
  faq: ServiceFaq[];

  /** Slugs of related service pages, rendered as a linked card grid. */
  related: string[];
}
