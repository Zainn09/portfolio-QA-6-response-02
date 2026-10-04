import type { ServicePageContent } from "./types";

export const shopifyAccessibilityTesting: ServicePageContent = {
  slug: "shopify-accessibility-testing",

  title: "Shopify Accessibility Testing (WCAG) | QA Specialist",
  metaDescription:
    "Practical accessibility QA for Shopify stores — keyboard navigation, screen readers, focus states, contrast, forms and accessible checkout journeys.",

  eyebrow: "Accessibility • WCAG",
  h1: "Shopify Accessibility Testing That Follows the Customer Journey, Not Just the Checklist",
  lead:
    "Accessibility problems rarely announce themselves. A store can look immaculate and still be unusable to someone navigating by keyboard or listening to a screen reader — particularly at the checkout, where the cost of an inaccessible control is a lost order.",
  heroPoints: [
    "Manual testing with keyboard and screen reader, not an automated scan reported as a result",
    "Mapped against WCAG 2.1 A and AA success criteria, with each finding tied to the criterion it affects",
    "Commerce journeys prioritised: product selection, cart, checkout and form completion",
  ],
  primaryCta: { label: "Request an accessibility review", href: "/audit" },
  secondaryCta: { label: "Read the process", href: "#s-4" },

  schemaName: "Shopify Accessibility Testing",
  schemaDescription:
    "Accessibility testing for Shopify stores covering keyboard navigation, screen reader compatibility, focus management, colour contrast, form labelling, error messaging, semantic structure and accessible checkout journeys, assessed against WCAG 2.1 A and AA.",
  serviceType: [
    "Shopify accessibility testing",
    "WCAG 2.1 audit",
    "E-commerce accessibility QA",
    "Screen reader testing",
  ],
  crumb: "Shopify Accessibility Testing",

  blocks: [
    {
      type: "prose",
      eyebrow: "The problem",
      heading: "An automated scan is a starting point, not an accessibility result",
      paragraphs: [
        "Automated tools are good at the mechanical checks — missing alt attributes, insufficient colour contrast, form fields without labels. They are useful, and they run in seconds. What they cannot do is decide whether a keyboard user can actually reach the pay button, or whether a screen reader announces a variant selector in an order that makes sense to someone who cannot see the page.",
        "The failures that stop a purchase are almost always interaction failures: a focus trap in a mobile menu that will not release, a drawer that opens visually but stays invisible to assistive technology, an error message that appears in colour alone, a quantity stepper built from non-semantic elements that a keyboard never reaches.",
        "This service is manual testing with assistive technology, supported by automated scans rather than replaced by them.",
      ],
    },
    {
      type: "cards",
      eyebrow: "Coverage",
      heading: "What accessibility testing examines",
      columns: 3,
      cards: [
        {
          title: "Keyboard navigation",
          text: "Every interactive element reachable and operable by keyboard alone, in an order that follows the visual layout, with no traps and no unreachable controls.",
        },
        {
          title: "Focus management",
          text: "Visible focus indicators throughout, correct focus placement when drawers, modals and menus open, and focus returned to a sensible place when they close.",
        },
        {
          title: "Screen reader compatibility",
          text: "Announced names, roles and states for navigation, product options, cart controls and form fields — tested with an actual screen reader, not inferred from markup.",
        },
        {
          title: "Semantic structure",
          text: "One H1 per page, a logical heading outline, landmark regions, list semantics for navigation, and buttons that are buttons rather than styled divs.",
        },
        {
          title: "Form accessibility",
          text: "Programmatic labels, required-field indication, input purpose and autocomplete attributes, and errors that are announced rather than only colour-coded.",
        },
        {
          title: "Colour and contrast",
          text: "Text, controls and focus indicators against WCAG contrast thresholds, verified in both the light and dark presentation of the store.",
        },
        {
          title: "Images and media",
          text: "Meaningful alternative text, decorative images correctly excluded, and video or animation that respects a reduced-motion preference.",
        },
        {
          title: "Touch and target size",
          text: "Controls large enough to operate reliably, which serves motor-impaired users and every customer using a phone one-handed.",
        },
        {
          title: "Responsive accessibility",
          text: "Zoom to 200% without loss of content, text scaling, reflow at narrow viewports, and orientation changes that do not break the journey.",
        },
      ],
    },
    {
      type: "checklist",
      eyebrow: "Commerce focus",
      heading: "The journeys that matter most on a store",
      intro:
        "An accessibility problem in a footer link is worth fixing. An accessibility problem in the checkout stops a sale. Testing is weighted accordingly.",
      items: [
        { title: "Choosing a product", text: "variant selectors, swatches, quantity controls and add-to-cart, operable and announced correctly" },
        { title: "Reading product information", text: "heading structure, accordion disclosure, table semantics and gallery controls" },
        { title: "Filtering and searching", text: "filter drawers, result counts, applied-filter removal and no-results messaging" },
        { title: "Managing the cart", text: "line-item controls, quantity edits, discount entry and the path to checkout" },
        { title: "Completing checkout", text: "form labels, error recovery, payment method selection and confirmation" },
        { title: "Recovering from errors", text: "messages that are announced, specific, and associated with the field that caused them" },
      ],
    },
    {
      type: "steps",
      eyebrow: "Process",
      heading: "How the review runs",
      steps: [
        { title: "Scope and criteria", text: "Agree which pages and journeys are in scope and which WCAG 2.1 level is being assessed against — A and AA for most stores." },
        { title: "Automated baseline", text: "Run automated scans across key templates to catch the mechanical issues quickly and cheaply." },
        { title: "Keyboard walkthrough", text: "Complete the buying journey using only the keyboard, recording every point where progress stops or becomes unclear." },
        { title: "Screen reader pass", text: "Repeat the journey with a screen reader, checking what is announced and in what order, on the flows that matter." },
        { title: "Contrast and visual checks", text: "Measure contrast for text, controls and focus states in both light and dark modes where the store offers them." },
        { title: "Findings by criterion", text: "Document each issue with the affected URL, the WCAG criterion, the user impact and a concrete remediation." },
        { title: "Retest after remediation", text: "Verify fixes with the same keyboard and screen reader methods, and confirm nothing new was introduced." },
      ],
    },
    {
      type: "table",
      eyebrow: "Deliverables",
      heading: "What the report contains",
      headers: ["Deliverable", "Detail"],
      rows: [
        ["Accessibility findings log", "Each issue with URL, WCAG criterion, severity, user impact and remediation guidance for a developer."],
        ["Journey assessment", "The shopping and checkout journeys rated on whether they can be completed with keyboard and screen reader."],
        ["Contrast measurements", "Recorded values for the combinations that fall below threshold, with suggested alternatives."],
        ["Prioritised remediation list", "Ordered by the combination of user impact and implementation effort, so the highest-value fixes come first."],
        ["Retest record", "Confirmation of which issues were resolved and which remain, after fixes are applied."],
      ],
    },
    {
      type: "callout",
      heading: "On compliance",
      text:
        "This work helps identify accessibility issues and fix them. It is not a legal certification, and no testing engagement can declare a store compliant — accessibility is an ongoing practice, and a store that changes weekly is never permanently assessed. The report tells you precisely which criteria were tested, how, and what was found. Decisions about legal obligations belong with a qualified advisor.",
    },
    {
      type: "links",
      eyebrow: "Related testing",
      heading: "Where accessibility overlaps other work",
      items: [
        { href: "/shopify-mobile-testing", label: "Mobile testing", text: "Touch target sizing and text scaling serve accessibility and mobile usability at the same time." },
        { href: "/shopify-checkout-testing", label: "Checkout testing", text: "Form semantics and error handling are both an accessibility concern and a conversion concern." },
        { href: "/shopify-performance-testing", label: "Performance testing", text: "A page that takes too long to respond is a barrier for everyone, assistive technology included." },
        { href: "/shopify-qa-testing", label: "Shopify QA testing", text: "The full storefront pass, if accessibility is one part of a wider testing need." },
      ],
    },
  ],

  faq: [
    {
      q: "Is an automated accessibility scan enough?",
      a: "No. Automated tools reliably catch mechanical issues like missing labels or low contrast, and they are worth running. They cannot tell you whether a keyboard user can reach and operate the checkout, or whether a screen reader announces a variant selector in a usable order. Those require manual testing with the actual assistive technology.",
    },
    {
      q: "Which WCAG version and level do you test against?",
      a: "WCAG 2.1 Level A and AA is the default, since that is what most accessibility regulations and procurement requirements reference. Level AAA criteria are not practically achievable for most ecommerce stores and are not claimed. The exact scope is agreed before testing begins.",
    },
    {
      q: "Which screen readers are used?",
      a: "Testing covers the combinations that reflect real usage — VoiceOver with Safari on macOS and iOS, and NVDA with a desktop browser. Which specific pairings were tested is recorded in the report, so the coverage claim is always traceable.",
    },
    {
      q: "Does making a store accessible change how it looks?",
      a: "Rarely in any meaningful way. Most remediation is invisible: better label associations, corrected heading order, proper button semantics, focus indicators that were always meant to be visible. Where a fix is visual — usually a contrast adjustment — it is flagged as such so it can be reviewed before implementation.",
    },
    {
      q: "Can you make our Shopify theme accessible?",
      a: "The deliverable is the finding and the remediation guidance, written for whichever developer or agency implements it. Retesting after remediation is part of the process. Direct theme development is outside this scope.",
    },
    {
      q: "How long does an accessibility review take?",
      a: "It depends on how many templates and journeys are in scope. A focused review of the purchase journey runs considerably faster than a full-store assessment across every template, and the scope is agreed up front rather than discovered along the way.",
    },
    {
      q: "Will accessibility work improve conversion?",
      a: "Accessible stores tend to be more usable for everyone — clear labels, working focus states and readable contrast help all customers. That is a reasonable expectation, not a guarantee, and no specific conversion outcome is promised here.",
    },
  ],

  related: [
    "shopify-qa-testing",
    "shopify-mobile-testing",
    "shopify-checkout-testing",
    "shopify-performance-testing",
    "ecommerce-qa-testing",
    "shopify-qa-audit",
  ],
};
