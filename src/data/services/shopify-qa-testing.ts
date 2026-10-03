import type { ServicePageContent } from "./types";

export const shopifyQaTesting: ServicePageContent = {
  slug: "shopify-qa-testing",

  title: "Shopify QA Testing Services | QA Specialist",
  metaDescription:
    "Independent QA for Shopify and Shopify Plus stores: functional, checkout, responsive, accessibility and performance testing, with reproducible bug reports.",

  eyebrow: "Shopify QA",
  h1: "Shopify QA Testing for Stores That Can't Afford Surprises",
  lead:
    "Independent quality assurance for Shopify and Shopify Plus storefronts — the journeys customers actually take, tested the way a real buyer moves through them, not the way a demo does.",
  heroPoints: [
    "Functional, checkout, responsive, accessibility and performance testing in one pass",
    "Every defect documented with reproduction steps, a severity rating and the revenue path it touches",
    "Suited to theme launches, replatforms, app changes and peak-season readiness",
  ],
  primaryCta: { label: "Request a QA assessment", href: "/audit" },
  secondaryCta: { label: "See 93 case studies", href: "/work" },

  schemaName: "Shopify QA Testing",
  schemaDescription:
    "Quality assurance testing for Shopify and Shopify Plus stores covering functional, checkout, theme, app integration, responsive, cross-browser, regression, accessibility and performance testing.",
  serviceType: [
    "Shopify QA testing",
    "Shopify store testing",
    "Shopify quality assurance",
    "E-commerce functional testing",
  ],
  crumb: "Shopify QA Testing",

  blocks: [
    {
      type: "prose",
      eyebrow: "The problem",
      heading: "Shopify makes launching easy. It does not make being correct easy.",
      paragraphs: [
        "A Shopify store is not one system. It is a theme, a checkout, a set of apps that were written by different companies and a catalogue that changes weekly. Each piece works in isolation. The defects that cost money live in the seams between them — the variant selector that resets the price, the discount code that applies without recalculating the total, the app that loads a script that quietly breaks the drawer on one browser.",
        "These are not bugs you find by looking at your store on a laptop the day before a campaign. They surface in the specific sequence a customer takes, on a real device, with a real cart. That is what QA testing is for, and it is why it has to be systematic rather than a glance.",
        "This service exists to find those defects before your customers do. Across 100+ stores tested — 20 of them Shopify Plus — the same handful of failure patterns keep appearing, and they are almost always invisible from the admin.",
      ],
    },
    {
      type: "cards",
      eyebrow: "Coverage",
      heading: "What gets tested on a Shopify store",
      intro:
        "Every engagement is scoped to the store, but these are the surfaces that get walked. Where a store is simple, the depth goes into the money path; where it is complex, the breadth widens into integrations and markets.",
      columns: 3,
      cards: [
        {
          title: "Product pages",
          text: "Variant and option logic, price updates, image gallery behaviour, stock messaging, add-to-cart from every entry point, and the state after a variant becomes unavailable.",
        },
        {
          title: "Collections & filtering",
          text: "Filter combinations, sorting, pagination, URL state on reload, empty results, and whether the grid keeps its place when a shopper navigates back.",
        },
        {
          title: "Search & navigation",
          text: "Predictive search results, typo and edge-case queries, no-result states, mega-menu behaviour on keyboard and touch, and mobile menu reachability.",
        },
        {
          title: "Cart & drawer",
          text: "Add, remove, quantity edits, line-item properties, cart persistence across sessions, free-shipping thresholds, and the drawer sitting over other overlays.",
        },
        {
          title: "Checkout & payments",
          text: "Customer information, shipping rates, tax, discounts, gift cards, wallet payments, failure states and order confirmation — including the awkward paths.",
        },
        {
          title: "Theme & UI",
          text: "Layout integrity at each breakpoint, sticky elements, z-index collisions, overlay stacking, template edge cases, and content that only breaks at a specific width.",
        },
        {
          title: "Apps & integrations",
          text: "Subscription, reviews, loyalty, upsell, search and shipping apps — tested in the flows they modify, not just on their own settings screen.",
        },
        {
          title: "Customer accounts",
          text: "Registration, login, password reset, order history, address books and the difference between guest and account checkout journeys.",
        },
        {
          title: "Responsive & cross-browser",
          text: "Real viewports from 390px upward, and rendering differences between Chrome, Safari, Firefox and Edge that never appear in one browser.",
        },
      ],
    },
    {
      type: "prose",
      eyebrow: "Theme and code",
      heading: "A theme change is a release, and it should be tested like one",
      paragraphs: [
        "Swapping sections, editing Liquid, installing an app or updating a theme version changes behaviour in places nobody looked. Theme code is shared across templates, so a tweak to the product card can move the collection grid, the featured collection and the search results at once.",
        "Testing after a code change means walking the templates that share the component — not just the page you were editing. That is the difference between verifying a change and verifying the store.",
      ],
    },
    {
      type: "checklist",
      eyebrow: "Money path",
      heading: "The paths that get tested hardest",
      intro:
        "If time is short, this is the order of priority. Everything on this list has a direct line to revenue, which is why it is walked on a real device with a real cart rather than in a preview.",
      items: [
        { title: "Guest checkout end to end", text: "from product page to confirmation email, on mobile first" },
        { title: "Discount and automatic discount behaviour", text: "including stacking rules, expiry, and the total after each one applies" },
        { title: "Shipping rate calculation", text: "across the zones the store actually sells to, not just the tester's default address" },
        { title: "Payment methods", text: "every method enabled, including the digital wallets that skip most of the form" },
        { title: "Failed payment and error handling", text: "because a declined card should leave a customer who can retry, not one who leaves" },
        { title: "Tax and currency display", text: "for multi-region stores, checked against what the customer is actually charged" },
        { title: "Order confirmation and notification emails", text: "delivery, content and links, not just the fact that a request was sent" },
      ],
    },
    {
      type: "steps",
      eyebrow: "Process",
      heading: "How the testing runs",
      intro:
        "Seven steps, in this order. The sequence matters more than it looks: understanding the store before testing it is what separates a useful report from a list of cosmetic notes.",
      steps: [
        { title: "Understand", text: "Review the store's purpose, audience, key journeys, recent changes and known issues before touching anything." },
        { title: "Map", text: "Build the test surface — pages, flows, components, integrations and edge cases — and prioritise it by business impact." },
        { title: "Explore", text: "Unscripted exploratory testing first, following intuition and experience to find what a scripted pass would walk past." },
        { title: "Break", text: "Scripted functional, responsive, cross-browser and checkout testing across the matrix, pushing boundary conditions." },
        { title: "Reproduce", text: "Every finding gets an exact reproduction path, severity, environment details and a root-cause hypothesis." },
        { title: "Resolve", text: "Reports written so a theme developer can act on them without a follow-up conversation." },
        { title: "Verify", text: "Re-test each fix, then run regression across the store to confirm nothing else moved." },
      ],
    },
    {
      type: "table",
      eyebrow: "Deliverables",
      heading: "What you receive at the end",
      intro: "A report you can hand to a developer or an agency without translating it first.",
      headers: ["Deliverable", "What it contains"],
      rows: [
        ["Defect report", "Each issue with severity, affected URLs, environment, reproduction steps and screenshots where the visual state matters."],
        ["Coverage summary", "What was tested, on which devices and browsers, and what was deliberately out of scope."],
        ["Prioritised fix list", "Defects ordered by impact on the customer journey, so the highest-value fixes land first."],
        ["Retest results", "Confirmation of which fixes verified, which did not, and any new issues the fix introduced."],
        ["Recommendations", "Structural risks that are not defects yet — patterns that will cause one at the next change."],
      ],
    },
    {
      type: "callout",
      heading: "What this service does not promise",
      text:
        "No QA engagement can guarantee a conversion lift, a particular Lighthouse score or that a store becomes defect-free — a store is a moving system and new code creates new risk. What testing does is make the state of the store knowable: what is broken, how badly, where, and in what order to fix it. Everything in the report is reproducible.",
    },
    {
      type: "links",
      eyebrow: "Go deeper",
      heading: "Specialised testing when the general pass is not enough",
      intro:
        "Most engagements start with the full store pass above. When the risk is concentrated in one area, these are the deeper routes through it.",
      items: [
        { href: "/shopify-checkout-testing", label: "Checkout testing", text: "Cart-to-confirmation testing when the revenue leak is at the end of the funnel." },
        { href: "/shopify-mobile-testing", label: "Mobile testing", text: "When most of your traffic is on a phone and the layouts were only ever checked on a desktop." },
        { href: "/shopify-regression-testing", label: "Regression testing", text: "For teams shipping theme or app changes on a regular cycle." },
        { href: "/shopify-plus-qa", label: "Shopify Plus QA", text: "Enterprise-grade testing for custom checkout, integrations and multi-market builds." },
        { href: "/shopify-qa-audit", label: "QA audit", text: "A one-off structured assessment of an existing store, delivered as a single report." },
        { href: "/ecommerce-qa-testing", label: "Ecommerce QA", text: "The broader picture, including non-Shopify platforms and headless builds." },
      ],
    },
  ],

  faq: [
    {
      q: "What is Shopify QA testing?",
      a: "It is systematic testing of a Shopify store to find defects before customers meet them — functional flows, the checkout, the theme, installed apps, responsive behaviour across devices, browser differences, accessibility and page performance. The output is a documented list of what is broken, how to reproduce it, and how much it matters.",
    },
    {
      q: "How is Shopify QA different from generic website testing?",
      a: "Shopify has its own platform behaviours that generic testers misread as bugs or miss entirely: how variants and inventory interact, how discounts and automatic discounts stack, how the checkout behaves once it leaves the theme, how apps inject scripts and styles, and where theme customisation ends and platform behaviour begins. Knowing which is which stops time being spent chasing things that are not defects.",
    },
    {
      q: "When should a Shopify store be tested?",
      a: "Before a launch or replatform, after a theme change or a version upgrade, after installing or updating apps, before a peak trading period, and on a regular cycle if you ship changes often. The worst time is the week a campaign starts.",
    },
    {
      q: "Do you test on real devices?",
      a: "Yes — mobile testing happens at real viewports on iOS Safari and Chrome on Android, because emulating a phone in a desktop browser hides exactly the problems that matter: the keyboard covering a field, a sticky bar sitting over the pay button, hover states that never fire on touch.",
    },
    {
      q: "Can you test third-party apps and integrations?",
      a: "Yes. Apps are tested inside the flows they modify — the subscription widget inside the product form, the upsell inside the drawer, the loyalty block inside the cart — plus their effect on page weight and script conflicts. An app that works on its own settings page but breaks the add-to-cart flow is a defect.",
    },
    {
      q: "How long does a Shopify QA engagement take?",
      a: "A focused money-path pass on a single store runs in days. A full store audit with integrations, multiple markets and accessibility coverage takes longer, and the scope is agreed after the initial review rather than estimated blind.",
    },
    {
      q: "Do you fix the issues as well as find them?",
      a: "The deliverable is the finding and the fix direction, written so your developer or agency can implement it directly. Fix verification and regression testing afterwards are part of the process — a fix is not counted as resolved until it is re-tested.",
    },
    {
      q: "Will testing guarantee more sales?",
      a: "No. Removing a defect removes a reason to leave, which is not the same as a promise of growth. What a QA report gives you is an accurate picture of what is currently costing you customers, with evidence you can act on.",
    },
  ],

  related: [
    "shopify-plus-qa",
    "shopify-checkout-testing",
    "shopify-mobile-testing",
    "shopify-accessibility-testing",
    "shopify-cross-browser-testing",
    "shopify-performance-testing",
    "shopify-regression-testing",
    "shopify-qa-audit",
    "ecommerce-qa-testing",
  ],
};
