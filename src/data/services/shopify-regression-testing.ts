import type { ServicePageContent } from "./types";

export const shopifyRegressionTesting: ServicePageContent = {
  slug: "shopify-regression-testing",

  title: "Shopify Regression Testing Services | QA Specialist",
  metaDescription:
    "Regression QA for Shopify releases: theme updates, app installs, platform changes and campaigns — protect the journeys that drive revenue.",

  eyebrow: "Regression & Release",
  h1: "Shopify Regression Testing That Catches What the Update Broke",
  lead:
    "Every theme edit, app install and platform change is a release — and releases break things elsewhere. Regression testing is how a store proves that what worked yesterday still works today, before customers find out otherwise.",
  heroPoints: [
    "A critical-journey suite built once, then re-run after every change",
    "Smoke testing for fast release checks, full regression for larger ones",
    "Results reported per journey, so a release is judged by what it broke rather than by what it changed",
  ],
  primaryCta: { label: "Build a regression pack", href: "/audit" },
  secondaryCta: { label: "See the coverage", href: "#s-2" },

  schemaName: "Shopify Regression Testing",
  schemaDescription:
    "Regression testing for Shopify stores covering post-change verification of critical customer journeys after theme updates, app installations, platform changes, code releases, integrations and marketing campaigns.",
  serviceType: [
    "Shopify regression testing",
    "Release validation",
    "Shopify smoke testing",
    "Post-deployment testing",
  ],
  crumb: "Shopify Regression Testing",

  blocks: [
    {
      type: "prose",
      eyebrow: "The problem",
      heading: "Nothing on a Shopify store is isolated",
      paragraphs: [
        "A theme's product card is used on the collection grid, the search results, the featured collection, the related products rail and the cart's recommendation block. Change it once and you have changed six places. Add an app and its script executes inside flows it was never tested against. Update a theme version and your customisations merge into a new base — usually fine, occasionally not.",
        "The result is that the person making a change can only verify what they changed. Whether anything else moved is a different question, answered by testing the journeys that share the same components and the ones that matter commercially.",
        "Regression testing is not about relitigating the whole store after every edit. It is about knowing which journeys are worth re-checking, checking those consistently, and being able to say with confidence that a release is safe to ship.",
      ],
    },
    {
      type: "cards",
      eyebrow: "Triggers",
      heading: "When a regression pass is warranted",
      intro:
        "Some changes obviously need testing. Others look harmless and are not. These are the triggers worth treating as releases.",
      columns: 2,
      cards: [
        {
          title: "Theme updates and customisation",
          text: "Section edits, template changes, CSS work and Liquid modifications — especially where a component is shared across multiple templates.",
        },
        {
          title: "App installation and updates",
          text: "New apps inject scripts and styles into your store, and existing apps change behaviour without asking. Both are release events.",
        },
        {
          title: "Platform changes",
          text: "Shopify ships continuously. Checkout, account and API behaviour can shift without a change on your side.",
        },
        {
          title: "Code releases",
          text: "Any deploy touching theme code, custom sections, scripts or functions, no matter how contained it looks.",
        },
        {
          title: "Integrations and data flows",
          text: "Inventory, pricing, product feeds and order exports changing format or timing can break the storefront silently.",
        },
        {
          title: "Campaign and seasonal launches",
          text: "New landing pages, promotional pricing, discount structures and traffic spikes expose states normal traffic never reaches.",
        },
        {
          title: "Catalogue operations",
          text: "Bulk edits, new product types, variant restructures and collection rule changes affect every template that renders them.",
        },
        {
          title: "Redesigns and migrations",
          text: "A new theme, a replatform or a storefront migration needs the broadest regression pass there is.",
        },
      ],
    },
    {
      type: "checklist",
      eyebrow: "Coverage",
      heading: "What belongs in a Shopify regression suite",
      intro:
        "A regression pack is deliberately small. It covers the journeys where a defect stops revenue, plus the components most likely to be disturbed by unrelated work.",
      items: [
        { title: "Homepage renders and key navigation works", text: "the entry point for most traffic" },
        { title: "Collection browsing", text: "filters, sorting, pagination and grid integrity after any shared-component change" },
        { title: "Search returns usable results", text: "including the no-results state" },
        { title: "Product page selection and add-to-cart", text: "variant logic, price updates, stock states and gallery behaviour" },
        { title: "Cart operations", text: "add, edit, remove, quantity change and discount application" },
        { title: "Checkout completion", text: "guest and account paths with at least one real payment method" },
        { title: "Shipping and tax calculation", text: "for the store's primary markets" },
        { title: "Order confirmation and notification email", text: "delivery plus content correctness" },
        { title: "Mobile journey", text: "the same path at a real mobile viewport, because regressions often appear on one platform first" },
        { title: "Third-party integrations", text: "the ones that touch orders, inventory or customer data" },
      ],
    },
    {
      type: "table",
      eyebrow: "Test types",
      heading: "How much testing each release needs",
      intro:
        "Not every change deserves the same effort. Matching depth to risk keeps release velocity without gambling on the outcome.",
      headers: ["Test type", "When it runs", "What it covers"],
      rows: [
        ["Smoke test", "Every deploy, small or large", "The shortest path through the store — home, product, cart, checkout. Confirms the store is not down."],
        ["Critical journey regression", "Any change to theme code, shared components or apps", "The full purchase path plus the components most likely to be disturbed by the change."],
        ["Full regression", "Major releases, redesigns, migrations", "Every journey in the pack, across devices and browsers, with integrations verified."],
        ["Risk-based selection", "Changes with a known blast radius", "The subset of journeys connected to what changed, decided by what the change touches."],
      ],
    },
    {
      type: "prose",
      eyebrow: "Practice",
      heading: "Bugs that regression testing is designed to catch",
      paragraphs: [
        "The defects a regression pass finds are rarely dramatic. They are the quiet ones: a drawer that stopped opening after a CSS refactor, a discount field that clears when the cart re-renders, a sticky add-to-cart bar that now covers the checkout button on a small screen, a price that stopped updating when a variant changes.",
        "None of them would be noticed by the person verifying the change they made, because they verified the thing they were looking at. That is precisely the gap a regression pack fills — it checks the parts of the store that nobody was looking at, in the same order, every time.",
      ],
    },
    {
      type: "steps",
      eyebrow: "Process",
      heading: "How a regression engagement works",
      steps: [
        { title: "Identify critical journeys", text: "Establish which paths carry revenue and which components they depend on." },
        { title: "Build the pack", text: "Document those journeys as a repeatable suite with expected results, sized so it can actually be run each release." },
        { title: "Establish a baseline", text: "Run the pack against the current store to record what correct looks like — without this, there is nothing to compare against." },
        { title: "Run on each release", text: "Smoke test every deploy; run the critical journeys when shared components or apps change." },
        { title: "Report what moved", text: "Results per journey: passed, failed, or newly broken — separate from whatever the release was meant to change." },
        { title: "Verify the fixes", text: "Re-test the regression failures and confirm the fix did not introduce a fresh one." },
        { title: "Maintain the pack", text: "Update the suite as the store evolves, so it keeps testing what currently matters rather than what used to." },
      ],
    },
    {
      type: "callout",
      heading: "Why the baseline matters",
      text:
        "Regression testing only works with a known-good reference. Without a recorded baseline, a failure is a matter of opinion and a fix cannot be verified. Building the pack and capturing that baseline is a real part of the work — and it is what makes every subsequent release check fast.",
    },
    {
      type: "links",
      eyebrow: "Related testing",
      heading: "Regression sits alongside everything else",
      items: [
        { href: "/shopify-qa-testing", label: "Shopify QA testing", text: "The full storefront pass, useful when the test surface needs building from scratch." },
        { href: "/shopify-checkout-testing", label: "Checkout testing", text: "Checkout journeys belong in every regression pack — they break quietly and expensively." },
        { href: "/shopify-plus-qa", label: "Shopify Plus QA", text: "Where release cadence is high and the cost of a bad deploy is measured in orders." },
        { href: "/shopify-performance-testing", label: "Performance testing", text: "A performance baseline answers 'this feels slower since the update'." },
      ],
    },
  ],

  faq: [
    {
      q: "What is Shopify regression testing?",
      a: "It is re-testing the journeys that matter after a change, to confirm that existing behaviour still works. Every theme edit, app install or platform update is a release that can affect parts of the store nobody touched directly. Regression testing checks those parts deliberately instead of assuming they are fine.",
    },
    {
      q: "How is regression testing different from retesting?",
      a: "Retesting confirms that a specific fix works. Regression testing checks whether that fix, or the change it belongs to, broke something else. They are different questions and both are needed — a fix that resolves one defect while silently breaking the cart is not a successful release.",
    },
    {
      q: "How often should a Shopify store run regression tests?",
      a: "At minimum: a smoke test after every deploy, and the critical-journey suite after any change to theme code, shared components or apps. Stores that ship weekly benefit from a standing arrangement. The depth should match the risk of the change rather than being fixed regardless of what shipped.",
    },
    {
      q: "What is the difference between smoke testing and regression testing?",
      a: "A smoke test is short and shallow: home, product, cart, checkout — enough to confirm the store is alive and a customer can buy. Regression testing is broader and deeper, covering the critical journeys plus the components most likely to have been disturbed. Smoke first, regression when the change warrants it.",
    },
    {
      q: "Can our own team run the regression pack?",
      a: "Yes, and that is often the intent. The pack is written as documented steps with expected results so an in-house team or agency can run it after each release. Ongoing independent runs are available where a team would rather have an outside pair of eyes on it.",
    },
    {
      q: "What if the store changes so often that a full pass is impossible?",
      a: "That is the normal situation, and it is why the pack is deliberately small. It covers the journeys that carry revenue and the components that get disturbed most, not everything on the store. Small and actually run every release beats comprehensive and run never.",
    },
    {
      q: "Do app updates really need regression testing?",
      a: "Yes. Apps inject scripts and styles into your storefront, and they change on their own schedule. An app update you did not request can alter behaviour in the flows it touches. When an app is involved in a critical journey, that journey belongs in the pack.",
    },
    {
      q: "How is the regression pack delivered?",
      a: "As a documented suite with steps, expected results and the environment each should be run in, plus the baseline results from the first run. Failures are reported per journey, with the affected URLs and reproduction steps for anything that breaks.",
    },
  ],

  related: [
    "shopify-qa-testing",
    "shopify-checkout-testing",
    "shopify-plus-qa",
    "shopify-performance-testing",
    "shopify-qa-audit",
    "ecommerce-qa-testing",
  ],
};
