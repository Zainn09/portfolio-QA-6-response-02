import type { ServicePageContent } from "./types";

export const shopifyPlusQa: ServicePageContent = {
  slug: "shopify-plus-qa",

  title: "Shopify Plus QA & Enterprise Testing | QA Specialist",
  metaDescription:
    "QA for complex Shopify Plus builds — custom checkout, ERP/CRM/PIM integrations, multi-market and B2B storefronts, plus launch and release validation.",

  eyebrow: "Shopify Plus • Enterprise",
  h1: "Shopify Plus QA for Builds Where a Small Defect Has a Large Blast Radius",
  lead:
    "Shopify Plus stores carry custom checkout logic, connected business systems and multiple storefronts. Testing them properly means testing the connections, not just the pages — because that is where Plus implementations fail.",
  heroPoints: [
    "Custom checkout, Scripts and Functions behaviour tested as part of the commercial flow",
    "Integration testing across ERP, CRM, PIM, OMS, payment and shipping connections",
    "Multi-market, multi-currency and B2B/wholesale journeys included, not treated as an afterthought",
  ],
  primaryCta: { label: "Discuss a Plus QA scope", href: "/audit" },
  secondaryCta: { label: "See Plus case studies", href: "/work" },

  schemaName: "Shopify Plus QA Testing",
  schemaDescription:
    "Enterprise quality assurance for Shopify Plus stores covering custom checkout logic, ERP, CRM, PIM and OMS integrations, multi-market and multi-currency storefronts, B2B and wholesale journeys, launch QA and release validation.",
  serviceType: [
    "Shopify Plus QA",
    "Enterprise ecommerce testing",
    "Shopify Plus launch QA",
    "E-commerce integration testing",
  ],
  crumb: "Shopify Plus QA",

  blocks: [
    {
      type: "prose",
      eyebrow: "Why Plus is different",
      heading: "On Shopify Plus, the storefront is the easy part",
      paragraphs: [
        "A standard Shopify store is one storefront, one catalogue and a checkout that behaves predictably. A Shopify Plus implementation is usually several of each: multiple markets with their own currencies, pricing and legal content; a B2B channel with company accounts, price lists and net terms; a checkout that has been modified with custom scripts or functions; and a stack of business systems — ERP, CRM, PIM, OMS, 3PL — expected to agree with Shopify about inventory, orders and customers.",
        "Each of those connections is a place where data can arrive wrong, arrive late, or arrive twice. None of them are visible from the admin. A price list that fails to apply for one company location, an inventory sync that lags by an hour, an order that reaches the warehouse without a tax line — these are Plus-scale defects, and they are almost always found by testing the flow rather than reading the configuration.",
        "Twenty of the stores tested so far have been Plus builds. The pattern is consistent: the storefront looks immaculate, and the risk is in the seams.",
      ],
    },
    {
      type: "cards",
      eyebrow: "Coverage",
      heading: "What enterprise QA covers on Plus",
      columns: 3,
      cards: [
        {
          title: "Custom checkout",
          text: "Scripts, Functions and checkout extensions tested against real carts — discount logic, payment method filtering, shipping rules and the states that only occur with specific combinations.",
        },
        {
          title: "ERP integration",
          text: "Inventory availability, order export, fulfilment status and the reconciliation question: does the warehouse see what the storefront promised?",
        },
        {
          title: "CRM integration",
          text: "Customer creation, merge behaviour, consent and marketing attributes, and what happens when a guest later creates an account.",
        },
        {
          title: "PIM & catalogue sync",
          text: "Product data, variants, metafields and imagery arriving complete and correct — including how the store behaves during a partial sync.",
        },
        {
          title: "OMS & fulfilment",
          text: "Order routing, split fulfilment, partial shipments, cancellations and refunds as the customer sees them versus what operations sees.",
        },
        {
          title: "Payments at scale",
          text: "Multiple gateways, regional payment methods, vaulted cards, manual capture flows and the failure paths that only large order values trigger.",
        },
        {
          title: "Multi-market storefronts",
          text: "Domains, currencies, localised pricing, translated content, market-specific shipping and tax — verified per market, not from the primary domain.",
        },
        {
          title: "B2B & wholesale",
          text: "Company accounts, locations, catalogues, price lists, quantity rules, payment terms and the B2B checkout journey end to end.",
        },
        {
          title: "Launch & release validation",
          text: "A structured pass before go-live or a major release: critical journeys first, integrations second, with a go/no-go summary.",
        },
      ],
    },
    {
      type: "prose",
      eyebrow: "Integration risk",
      heading: "The failure mode that does not show up in the browser",
      paragraphs: [
        "Most integration defects are invisible to the customer and expensive to the business. An order that confirms on screen but arrives in the ERP without its discount line. A stock level that is correct in Shopify and stale in the warehouse system. A customer record duplicated because the CRM matched on a field the storefront never sends.",
        "Testing these means following the data rather than clicking through pages: place the order, then check what each downstream system received. That last step is the one that gets skipped, and it is the one that finds the problem.",
      ],
    },
    {
      type: "steps",
      eyebrow: "Approach",
      heading: "How a Plus engagement is structured",
      intro:
        "Plus builds are rarely tested in one sweep. The work is staged so the highest-risk integrations are examined while there is still time to change them.",
      steps: [
        { title: "Architecture review", text: "Map the storefronts, markets, apps and connected systems, and identify which journeys carry the most commercial risk." },
        { title: "Test plan by risk", text: "Prioritise by blast radius — a checkout defect affects every order; a content defect affects one page." },
        { title: "Storefront and checkout pass", text: "Walk the commercial journeys on the markets and channels that matter, at real viewports, with realistic carts." },
        { title: "Integration verification", text: "Place test orders and follow them into each downstream system, checking what arrived, when, and whether it matched." },
        { title: "B2B and market-specific testing", text: "Company accounts, price lists, terms and localised storefronts tested as their own journeys rather than as variations." },
        { title: "Defect reporting", text: "Findings rated by business impact — orders at risk, revenue affected, systems out of sync — with reproduction steps for each." },
        { title: "Release validation", text: "A final regression pass before go-live, with a clear statement of what is safe to ship and what is not." },
      ],
    },
    {
      type: "table",
      eyebrow: "Deliverables",
      heading: "What a Plus engagement produces",
      headers: ["Deliverable", "Why it matters at this scale"],
      rows: [
        ["Risk-assessed defect log", "Issues ranked by how much of the business they touch, so engineering effort goes where it counts."],
        ["Integration verification record", "Evidence of what each connected system received for a test order, per system."],
        ["Market & channel matrix", "Which journeys were verified on which storefronts, currencies and channels — and which were not."],
        ["Release readiness summary", "A plain statement of what is safe to launch and what should be held back."],
        ["Regression pack", "The critical journeys to re-run after every future change, reusable by your own team."],
      ],
    },
    {
      type: "callout",
      heading: "What is not claimed here",
      text:
        "No engagement certifies a Shopify Plus implementation as defect-free, and none of this is a substitute for your own release process. The value is independent verification of the journeys that carry revenue, plus an honest account of what was not tested.",
    },
    {
      type: "links",
      eyebrow: "Related testing",
      heading: "Where Plus work usually goes deeper",
      items: [
        { href: "/shopify-checkout-testing", label: "Checkout testing", text: "The checkout is where Plus customisation concentrates — and where it is hardest to reason about from configuration alone." },
        { href: "/shopify-regression-testing", label: "Regression testing", text: "Plus stores change constantly. A reusable regression pack is what keeps releases from breaking silently." },
        { href: "/shopify-performance-testing", label: "Performance testing", text: "Enterprise builds accumulate apps and scripts. Page weight is a conversion issue at this scale." },
        { href: "/shopify-qa-testing", label: "Shopify QA testing", text: "The core service, if you are looking for a broader storefront pass rather than an enterprise scoped one." },
      ],
    },
  ],

  faq: [
    {
      q: "Why does Shopify Plus need more QA than a standard Shopify store?",
      a: "Because there is more to break and more consequence when it does. Plus stores typically run custom checkout logic, several storefronts or markets, B2B channels and connections into ERP, CRM, PIM and OMS systems. A defect in any one of those affects orders, stock or customer records rather than a single page — and several of them cannot be seen from the browser at all.",
    },
    {
      q: "Can you test custom checkout scripts and functions?",
      a: "Yes. Checkout customisations are tested against real carts and realistic combinations — discount logic, shipping rules, payment method availability and the edge cases that only appear for particular customer or cart states. What cannot be tested through the storefront is stated clearly rather than assumed to work.",
    },
    {
      q: "Do you test B2B and wholesale journeys?",
      a: "Yes. Company accounts, locations, catalogues, price lists, quantity rules, payment terms and the B2B checkout are tested as their own journeys, because a B2B bug rarely reproduces on a consumer account and vice versa.",
    },
    {
      q: "How do you verify integrations without access to our systems?",
      a: "The storefront side is always testable. For downstream verification, useful evidence comes from whatever access you can provide — a read-only ERP view, an order record, an exported file — or from your operations team confirming what arrived. Where verification is not possible, that is recorded rather than glossed over.",
    },
    {
      q: "Can testing fit around a launch deadline?",
      a: "Yes, by scoping to risk. If the date is fixed, the critical journeys and highest-risk integrations are tested first and everything else is documented as not covered. A short, honest coverage statement is more useful than a rushed claim of comprehensive testing.",
    },
    {
      q: "Do you work alongside our in-house QA or agency?",
      a: "Often. Independent testing is most valuable where a team is close to its own work and can no longer see the store as a customer would. The regression pack is written to be handed over, so your team can re-run the critical journeys after changes.",
    },
    {
      q: "How is a Plus engagement priced?",
      a: "By scope, agreed after the architecture review — number of storefronts, markets, systems and channels determines the work. Ranges are given before any testing starts, so there is no open-ended hour count.",
    },
  ],

  related: [
    "shopify-qa-testing",
    "shopify-checkout-testing",
    "shopify-regression-testing",
    "shopify-performance-testing",
    "ecommerce-qa-testing",
    "shopify-qa-audit",
  ],
};
