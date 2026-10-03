import type { ServicePageContent } from "./types";

export const shopifyCheckoutTesting: ServicePageContent = {
  slug: "shopify-checkout-testing",

  title: "Shopify Checkout & Payment Testing | QA Specialist",
  metaDescription:
    "End-to-end Shopify checkout testing: cart, discounts, shipping, tax, payment methods, error states and order confirmation — across devices and markets.",

  eyebrow: "Checkout & Payments",
  h1: "Shopify Checkout Testing: Finding the Money That Leaks at the Last Step",
  lead:
    "Every other page on a store is negotiable. The checkout is not. It gets tested like the revenue path it is — cart to confirmation, every payment method, every failure state, on a phone first.",
  heroPoints: [
    "Full cart-to-confirmation walk on mobile and desktop, including guest and account paths",
    "Discounts, shipping rates, taxes, gift cards and multi-currency verified against the amount actually charged",
    "Failure states tested deliberately: declined cards, expired codes, unavailable shipping, abandoned sessions",
  ],
  primaryCta: { label: "Review my checkout", href: "/audit" },
  secondaryCta: { label: "Read checkout case studies", href: "/work" },

  schemaName: "Shopify Checkout Testing",
  schemaDescription:
    "End-to-end Shopify checkout QA covering the cart-to-confirmation journey, customer information, shipping rates, taxes, discounts, gift cards, payment methods, failure states, order confirmation and mobile checkout.",
  serviceType: [
    "Shopify checkout testing",
    "Shopify payment testing",
    "Cart and checkout QA",
    "Checkout conversion validation",
  ],
  crumb: "Shopify Checkout Testing",

  blocks: [
    {
      type: "prose",
      eyebrow: "The problem",
      heading: "Where checkout issues actually cost you money",
      paragraphs: [
        "A shopper who reaches the checkout has already decided to buy. That is what makes this stage different from every other part of the store: the intent is there, and each remaining friction point is a chance to lose it. A discount field that clears when the page reloads, a shipping rate that returns nothing for one region, an express wallet button that sits under the sticky header on a phone, an error message that explains a decline in payment-gateway language — none of these look like much individually. Together they are where orders quietly disappear.",
        "The harder problem is that checkout defects hide behind successful-looking states. A discount that applies with a green confirmation banner but calculates on the pre-discount price is a defect that produces no error, no complaint and the wrong total. The only way to catch it is to check the arithmetic rather than the message.",
        "This service tests the checkout as a system: what the shopper sees, what they are charged, what actually reaches the order record and what the confirmation email says.",
      ],
    },
    {
      type: "checklist",
      eyebrow: "Coverage",
      heading: "What the checkout pass walks through",
      intro:
        "Each item is tested in sequence on a real cart, not in isolation — because most checkout defects are state problems, not component problems.",
      items: [
        { title: "Cart to checkout handoff", text: "line items, quantities, line-item properties and applied discounts surviving the transition" },
        { title: "Customer information", text: "field validation, autofill behaviour, address lookup, and whether errors are recoverable without losing entries" },
        { title: "Guest versus account checkout", text: "both paths end to end, including creating an account after a guest purchase" },
        { title: "Shipping methods and rates", text: "every zone and method the store sells to, including free-shipping thresholds and carrier-calculated rates" },
        { title: "Taxes", text: "displayed amounts, inclusive versus exclusive pricing, and regional rules for multi-market stores" },
        { title: "Discount codes and automatic discounts", text: "application, removal, stacking rules, expiry, minimum thresholds and the total after each one" },
        { title: "Gift cards", text: "partial and full redemption, combined with discounts, and behaviour when the balance runs out mid-order" },
        { title: "Payment methods", text: "every enabled method including digital wallets, BNPL and redirect-based gateways" },
        { title: "Failure and error states", text: "declined cards, timeouts, expired sessions, invalid codes and unavailable shipping — with a retry path that works" },
        { title: "Order confirmation", text: "what the customer sees, what the order record contains, and whether the notification email arrives with working links" },
      ],
    },
    {
      type: "cards",
      eyebrow: "Edge cases",
      heading: "The combinations that break real checkouts",
      intro:
        "Single features rarely fail on their own. These combinations are where the defects live, and they are tested deliberately rather than hoped for.",
      columns: 2,
      cards: [
        {
          title: "Discount meets free shipping",
          text: "A code that reduces the subtotal below a free-shipping threshold — does the shipping charge return correctly, or does the store either absorb it silently or charge full rate?",
        },
        {
          title: "Digital wallet skips the form",
          text: "Express payments populate an address that was never validated, which is where shipping and tax calculations go wrong for a subset of customers who never see an error.",
        },
        {
          title: "One product, two variants, one unavailable",
          text: "The cart holds a variant that sells out before checkout completes. Does the flow fail with a clear message, or proceed with a line that cannot be fulfilled?",
        },
        {
          title: "Discount plus gift card plus tax",
          text: "Three adjustments applied in sequence, where the order of operations changes the final total and the tax line.",
        },
        {
          title: "International address",
          text: "Postal code formats, required fields and address structures that the theme assumes are domestic.",
        },
        {
          title: "Back button mid-checkout",
          text: "The shopper returns to the cart and comes back. Which fields survive, and does the discount still apply?",
        },
      ],
    },
    {
      type: "steps",
      eyebrow: "Process",
      heading: "How checkout testing runs",
      steps: [
        { title: "Find the money path", text: "Identify how customers actually buy — the entry points, the payment methods in use and the geographies that matter." },
        { title: "Build the matrix", text: "Device × browser × payment method × discount state × address type, prioritised by traffic and order value." },
        { title: "Walk it as a customer", text: "Complete real orders on real devices, mobile first, with carts that look like genuine ones rather than single test items." },
        { title: "Verify the arithmetic", text: "Check totals, tax, shipping and discounts against what the order should be — not against a success message." },
        { title: "Push the failure states", text: "Trigger declines, timeouts, expired codes and empty shipping results, and confirm the recovery path works." },
        { title: "Follow the order", text: "Confirm the order record, the notification email and what the merchant-side systems received." },
        { title: "Report and retest", text: "Document each defect with its cart state and reproduction path, then re-test after fixes." },
      ],
    },
    {
      type: "table",
      eyebrow: "Deliverables",
      heading: "What you get back",
      headers: ["Deliverable", "Detail"],
      rows: [
        ["Checkout defect report", "Each issue with the exact cart and customer state needed to reproduce it, severity, and the customer segment it affects."],
        ["Payment method matrix", "Which methods were tested, on which devices, and the result — including methods that could not be completed and why."],
        ["Calculation verification", "Recorded totals, tax, shipping and discount behaviour, so the arithmetic is auditable rather than asserted."],
        ["Failure-state log", "How the checkout behaves when things go wrong, and whether a customer can recover without abandoning."],
        ["Mobile checkout notes", "Specific to touch and small viewports, where checkout problems differ most from desktop testing."],
      ],
    },
    {
      type: "callout",
      heading: "On conversion claims",
      text:
        "Checkout defects demonstrably cost orders — that is why they are worth fixing. This page will not quote you a percentage, because the honest number depends on your traffic, your products and your customers, and inventing one would undermine the rest of the report. What you get is a verified list of what is broken and what it would take to fix it.",
    },
    {
      type: "links",
      eyebrow: "Related testing",
      heading: "Checkout rarely fails alone",
      items: [
        { href: "/shopify-mobile-testing", label: "Mobile testing", text: "Most checkout defects first appear on a phone — small viewports and keyboards surface what desktop testing hides." },
        { href: "/shopify-plus-qa", label: "Shopify Plus QA", text: "For custom checkout logic, Scripts, Functions and enterprise payment setups." },
        { href: "/shopify-accessibility-testing", label: "Accessibility testing", text: "An inaccessible checkout is a checkout some customers cannot complete at all." },
        { href: "/shopify-regression-testing", label: "Regression testing", text: "Checkout journeys belong in every regression pack — they break quietly and expensively." },
      ],
    },
  ],

  faq: [
    {
      q: "Can you test a Shopify checkout without placing real orders?",
      a: "Most of the journey can be tested with test payments and test mode, which is where the majority of defects are found. Some behaviour — particularly certain wallet payments, gateway-specific failure responses and the post-purchase experience — needs either a live low-value order or the gateway's own test environment. Whatever cannot be verified is stated plainly in the report.",
    },
    {
      q: "Do you test every payment method?",
      a: "Every method the store has enabled is tested, including digital wallets, BNPL providers and redirect gateways like iDEAL or Klarna where relevant. Some methods depend on region or currency; in those cases the report records what could be reached and what could not.",
    },
    {
      q: "Why do discount codes cause so many problems?",
      a: "Because discounts interact with everything else — subtotal thresholds, free shipping, tax, gift cards other discounts and the order of application. Each combination is a distinct state, and stores typically test one or two of them. The defects surface in the combinations nobody tried.",
    },
    {
      q: "Is mobile checkout testing different from desktop?",
      a: "Materially, yes. The on-screen keyboard covers fields, sticky headers sit over the pay button, autofill behaves differently per platform, and express wallet buttons become the primary path for a large share of mobile buyers. Testing checkout on desktop and assuming mobile works is the single most common gap found in audits.",
    },
    {
      q: "What happens if the checkout is heavily customised?",
      a: "Customised checkouts are tested the same way, with the additional step of establishing which behaviours come from Shopify and which come from the customisation — that distinction determines where the fix belongs and stops time being wasted on code that is not the cause.",
    },
    {
      q: "Can you test a checkout that is not yet live?",
      a: "Yes. Pre-launch checkout testing is one of the highest-value points to test, because defects found before launch cost nothing to fix. Access to a staging or development store with representative settings is enough to run a full pass.",
    },
    {
      q: "Do you verify the order notification emails too?",
      a: "Yes — delivery, subject line, content, totals and links in the confirmation and related emails. An order that completes but never confirms leaves the customer uncertain, which generates support contacts and cancellations.",
    },
  ],

  related: [
    "shopify-qa-testing",
    "shopify-mobile-testing",
    "shopify-plus-qa",
    "shopify-accessibility-testing",
    "shopify-regression-testing",
    "ecommerce-qa-testing",
  ],
};
