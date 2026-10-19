import type { ServicePageContent } from "./types";

export const shopifyQaAudit: ServicePageContent = {
  slug: "shopify-qa-audit",

  title: "Shopify QA Audit — Full Store Review | QA Specialist",
  metaDescription:
    "A structured Shopify QA audit: captured states, severity-rated findings, reproduction steps and a prioritised fix list, delivered as one report.",

  eyebrow: "One-off assessment",
  h1: "A Shopify QA Audit: One Structured Pass Over Your Entire Store",
  lead:
    "A single, comprehensive assessment of an existing Shopify store — every page type captured, every critical journey walked, and one report that says what is broken, how badly, and what to fix first.",
  heroPoints: [
    "12 captured states covering each page type at desktop and at 390px",
    "Findings severity-rated against their impact on the customer journey, not their novelty",
    "One prioritised fix list you can hand to a developer or agency without a follow-up call",
  ],
  primaryCta: { label: "Request a Shopify QA audit", href: "/audit" },
  secondaryCta: { label: "See an example audit", href: "/work" },

  schemaName: "Shopify QA Audit",
  schemaDescription:
    "A structured QA audit of a Shopify store covering functional behaviour, user experience, checkout, mobile and responsive rendering, browser compatibility, accessibility, performance, apps and integrations, forms, navigation and error states.",
  serviceType: [
    "Shopify QA audit",
    "Shopify store audit",
    "E-commerce quality assessment",
    "Shopify website review",
  ],
  crumb: "Shopify QA Audit",

  blocks: [
    {
      type: "prose",
      eyebrow: "What it is",
      heading: "An audit is a snapshot, and the snapshot is the point",
      paragraphs: [
        "Testing protects a release. An audit describes a store as it stands today. That distinction shapes how the work is done: instead of checking a change against expectations, the audit captures the store systematically — every page type, at desktop width and at 390px, with the cart carrying real selections and the back button in play — and then reads what those captures show.",
        "It is deliberately unglamorous. The value is not in a spectacular finding, but in the fact that nothing on the commercial path was skipped. Stores are usually tested the way they were built: in pieces, by the people who made each piece. An audit walks the whole thing the way a customer does, in one session, and records what happens.",
        "The output is a single report: severity-rated findings, reproduction steps, affected URLs and a prioritised fix list. Everything in it is reproducible.",
      ],
    },
    {
      type: "cards",
      eyebrow: "Scope",
      heading: "What an audit covers",
      intro:
        "The standard audit walks these areas. Where a store has particular complexity — subscriptions, B2B, many markets — the scope is adjusted before the work starts, not during it.",
      columns: 3,
      cards: [
        {
          title: "Functional behaviour",
          text: "Every interactive element on the captured pages exercised: dropdowns, accordions, selectors, steppers, carousels, drawers, modals and forms.",
        },
        {
          title: "The money path",
          text: "Product selection through to order confirmation, done properly with a realistic cart rather than a single test item.",
        },
        {
          title: "Mobile and responsive",
          text: "The same journey at a real mobile viewport, where the majority of defects found in audits actually appear.",
        },
        {
          title: "Browser compatibility",
          text: "Rendering and interaction compared across the browsers the store's audience uses, so engine-specific breakage is identified.",
        },
        {
          title: "Accessibility",
          text: "Keyboard path through the journey, focus behaviour, contrast, labelling and form semantics — enough to identify barriers, not a full certification.",
        },
        {
          title: "Performance",
          text: "What delays the main content, which apps contribute the heaviest scripts, and where the store's page weight comes from.",
        },
        {
          title: "Apps and integrations",
          text: "Installed apps exercised inside the flows they modify, and the integration points that touch orders and inventory.",
        },
        {
          title: "Forms and error states",
          text: "Contact, account, address and discount forms, plus every error state reachable — because that is where customers get stranded.",
        },
        {
          title: "Navigation and search",
          text: "Menus, breadcrumbs, filters, sorting, search results and no-result states, tested as discovery paths rather than as components.",
        },
      ],
    },
    {
      type: "steps",
      eyebrow: "How it runs",
      heading: "From request to report",
      steps: [
        { title: "Initial review", text: "A first look at the store to understand what it sells, how it sells it and where the risk is likely concentrated." },
        { title: "Scope agreement", text: "What is included, what is not, and the delivery date — agreed in writing before any testing starts." },
        { title: "Systematic capture", text: "Each page type captured at desktop and mobile width, with the cart in a realistic state and the back button in play." },
        { title: "Journey testing", text: "The critical journeys walked end to end, including the failure paths most testing skips." },
        { title: "Evidence collection", text: "Screenshots bracketing each defect, environment details and the exact state required to reproduce it." },
        { title: "Severity assessment", text: "Each finding rated by impact on the customer journey — a checkout blocker outranks a cosmetic misalignment every time." },
        { title: "Report delivery", text: "Findings, evidence, affected URLs, a prioritised fix list and an executive summary you can forward onward." },
      ],
    },
    {
      type: "checklist",
      eyebrow: "Deliverables",
      heading: "What lands in your inbox",
      intro:
        "One document, structured so it can be handed to a developer, an agency or a leadership team without rewriting.",
      items: [
        { title: "Executive summary", text: "the state of the store in plain language, with the highest-impact issues named" },
        { title: "Severity-rated findings", text: "each issue rated critical, major or minor by its effect on the customer journey" },
        { title: "Reproduction steps", text: "the exact sequence, device and state needed to see the issue" },
        { title: "Screenshots", text: "visual evidence for every finding where the appearance is part of the defect" },
        { title: "Affected URLs", text: "so a developer can go straight to the page rather than hunting for it" },
        { title: "Prioritised fix list", text: "ordered by impact and effort, so the first fixes are the ones that matter most" },
        { title: "Risk note", text: "patterns that are not defects yet but will cause one at the next change" },
        { title: "Coverage statement", text: "what was tested, on which devices and browsers, and what was deliberately excluded" },
      ],
    },
    {
      type: "table",
      eyebrow: "Severity",
      heading: "How findings are rated",
      intro:
        "Severity is assigned by impact on the customer journey. It exists so that a long list becomes a short, ordered plan.",
      headers: ["Rating", "Meaning", "Typical example"],
      rows: [
        ["Critical", "Blocks a purchase or corrupts an order", "Payment method unavailable on mobile; discount applied but the total not recalculated."],
        ["Major", "Degrades the buying experience or loses customers", "Filters reset on back navigation; sticky bar covering a call to action at 390px."],
        ["Minor", "Noticeable, does not stop a purchase", "Misaligned grid item; inconsistent spacing between sections; unclear empty state."],
      ],
    },
    {
      type: "callout",
      heading: "What an audit does not promise",
      text:
        "An audit describes what is wrong today; it does not guarantee that fixing everything will raise conversion, and no responsible audit claims otherwise. What it gives you is an accurate, prioritised account of the obstacles currently in front of your customers — with evidence for each one — so that the decision about what to fix first is made on facts rather than opinion.",
    },
    {
      type: "prose",
      eyebrow: "Afterwards",
      heading: "Then what?",
      paragraphs: [
        "The findings go to whoever implements the fixes, and the report is written to be used without a follow-up conversation: reproduction steps, affected URLs, screenshots and a clear statement of what correct behaviour would look like.",
        "Fix verification is available as a follow-up pass, and the prioritised fix list doubles as the starting point for a regression pack if the store changes regularly. The audit stands on its own; nothing about it commits you to further work.",
      ],
    },
    {
      type: "links",
      eyebrow: "Related testing",
      heading: "Where an audit usually leads",
      items: [
        { href: "/shopify-qa-testing", label: "Shopify QA testing", text: "Ongoing testing against a release cycle, rather than a single assessment." },
        { href: "/shopify-regression-testing", label: "Regression testing", text: "Turn the audit's critical journeys into a suite that runs after every change." },
        { href: "/shopify-checkout-testing", label: "Checkout testing", text: "A deeper pass on the checkout, if the audit finds the leak is concentrated there." },
        { href: "/shopify-mobile-testing", label: "Mobile testing", text: "A dedicated mobile pass when the store's traffic is phone-heavy." },
        { href: "/shopify-accessibility-testing", label: "Accessibility testing", text: "A full WCAG assessment, if the audit surfaces barrier-level issues." },
        { href: "/shopify-performance-testing", label: "Performance testing", text: "A measured performance review when the audit identifies load problems." },
      ],
    },
  ],

  faq: [
    {
      q: "What is included in a Shopify QA audit?",
      a: "A systematic review of the store: functional behaviour across every page type, the full purchase journey, mobile and responsive rendering, browser compatibility, accessibility barriers, performance, installed apps and integrations, forms and error states. You receive severity-rated findings with reproduction steps, screenshots, affected URLs, a prioritised fix list and an executive summary.",
    },
    {
      q: "How long does an audit take?",
      a: "It depends on the size and complexity of the store — the number of templates, markets, payment methods and integrations. The delivery date is agreed before work starts, after an initial review of the store, rather than estimated blind.",
    },
    {
      q: "How is an audit different from ongoing QA testing?",
      a: "An audit is a snapshot: it describes the store as it is today and delivers a report. Ongoing testing protects a release cycle — checking that changes did not break existing behaviour. The audit's critical journeys often become the foundation of a regression pack if a team moves to regular testing.",
    },
    {
      q: "Do you need access to my Shopify admin?",
      a: "No — the storefront is where the customer experience is tested, and that is reachable without admin access. Admin or staff access is useful for checking settings, theme configuration and order records, and it makes some findings faster to confirm, but it is not a requirement.",
    },
    {
      q: "Can the audit be done on a staging or development store?",
      a: "Yes, with a caveat worth knowing. Staging stores often have fewer apps, less content and different settings, so findings there may not reflect production. An audit of the live storefront is usually the more accurate picture; a staging audit is most valuable before a launch.",
    },
    {
      q: "Will the audit tell me how to fix the issues?",
      a: "Findings include what correct behaviour would look like and where the problem originates, written so a developer can act on it. Remediation guidance is part of the report; implementing the fixes is a separate piece of work and is not covered by the audit itself.",
    },
    {
      q: "Do you offer re-testing after the fixes are made?",
      a: "Yes. A follow-up pass verifies which findings were resolved and confirms that the fixes did not introduce new problems. It is optional, and the audit report is fully usable without it.",
    },
    {
      q: "Is the audit confidential?",
      a: "Yes. Findings are specific to your store and are not published, referenced or reused anywhere. Published case studies exist only where the merchant has agreed to it.",
    },
    {
      q: "Will an audit improve my conversion rate?",
      a: "Fixing real defects removes reasons for customers to leave, which is why audits are worth doing. No audit can promise a conversion outcome — that depends on traffic, pricing, product and market as much as on defects. What the audit provides is accurate evidence about what is currently in the way.",
    },
  ],

  related: [
    "shopify-qa-testing",
    "shopify-regression-testing",
    "shopify-checkout-testing",
    "shopify-mobile-testing",
    "shopify-accessibility-testing",
    "shopify-performance-testing",
    "shopify-plus-qa",
    "ecommerce-qa-testing",
  ],
};
