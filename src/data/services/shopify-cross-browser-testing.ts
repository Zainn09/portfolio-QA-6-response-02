import type { ServicePageContent } from "./types";

export const shopifyCrossBrowserTesting: ServicePageContent = {
  slug: "shopify-cross-browser-testing",

  title: "Shopify Cross-Browser Testing Services | QA Specialist",
  metaDescription:
    "Verify your Shopify store in Chrome, Safari, Firefox and Edge — rendering, CSS, JavaScript, forms and checkout behaviour across browsers.",

  eyebrow: "Cross-Browser & Rendering",
  h1: "Shopify Cross-Browser Testing for the Browser Your Customers Actually Use",
  lead:
    "A store is verified in whichever browser the person building it happens to have open. That is usually Chrome. It is often not what matters — Safari on iOS behaves differently enough that entire themes work in one and break in the other.",
  heroPoints: [
    "Chrome, Safari, Firefox and Edge on desktop, plus Safari and Chrome on mobile",
    "Rendering, layout, JavaScript behaviour and interactive components verified per browser",
    "Defects reported with the exact browser and version, so a fix can be verified against the same conditions",
  ],
  primaryCta: { label: "Test my store across browsers", href: "/audit" },
  secondaryCta: { label: "See what gets tested", href: "#s-2" },

  schemaName: "Shopify Cross-Browser Testing",
  schemaDescription:
    "Cross-browser and cross-device testing for Shopify stores covering rendering, CSS and JavaScript compatibility, layout behaviour, forms, interactive components, third-party apps and checkout across Chrome, Safari, Firefox and Edge.",
  serviceType: [
    "Shopify cross-browser testing",
    "Browser compatibility testing",
    "Theme rendering validation",
    "E-commerce cross-browser QA",
  ],
  crumb: "Shopify Cross-Browser Testing",

  blocks: [
    {
      type: "prose",
      eyebrow: "The problem",
      heading: "Why the same Shopify store behaves differently in another browser",
      paragraphs: [
        "Shopify serves the same markup to everyone, but the browser decides what to do with it. Themes rely on modern CSS — container queries, aspect-ratio, sticky positioning, backdrop filters — and browser engines implement those with their own timings, quirks and gaps. Safari in particular has a long history of behaving differently on viewport units, scroll behaviour, form control styling and date inputs.",
        "Then there are the apps. Every installed app brings its own scripts and stylesheets, written by a different team, tested against whichever browsers they had to hand. When two apps disagree about a shared element, the result often depends on load order — and load order is not identical across browsers.",
        "The practical upshot: a store can be flawless in Chrome and quietly broken in Safari, which on any mobile-majority storefront means a meaningful share of customers.",
      ],
    },
    {
      type: "cards",
      eyebrow: "Coverage",
      heading: "What gets verified in each browser",
      columns: 2,
      cards: [
        {
          title: "Rendering and layout",
          text: "Grid and flex behaviour, spacing, font rendering and fallbacks, image aspect ratios, and sticky or fixed elements that drift out of place in one engine.",
        },
        {
          title: "CSS compatibility",
          text: "Modern layout features, custom properties, backdrop and filter effects, and the graceful degradation of anything not universally supported.",
        },
        {
          title: "JavaScript behaviour",
          text: "Interactive components that fail silently — drawers, accordions, carousels, variant pickers and quantity steppers that stop responding in one browser.",
        },
        {
          title: "Forms and inputs",
          text: "Native control styling, date and telephone inputs, autocomplete, validation messaging and submission behaviour, which differ most on Safari.",
        },
        {
          title: "Checkout interaction",
          text: "Field completion, shipping and payment selection, express wallet behaviour and error states, tested per browser rather than assumed.",
        },
        {
          title: "Third-party apps",
          text: "Widgets, chat, reviews, upsells and analytics scripts — inside the store's flows, where app conflicts actually surface.",
        },
        {
          title: "Payment elements",
          text: "Wallet buttons, iframe-based card fields and redirect flows, which render through the payment provider and can differ per browser.",
        },
        {
          title: "Scrolling and motion",
          text: "Smooth scrolling, scroll-linked animations and parallax effects that stutter, snap or break entirely in one engine.",
        },
      ],
    },
    {
      type: "table",
      eyebrow: "Browser matrix",
      heading: "The browsers in the test set",
      intro:
        "Coverage is agreed at scoping based on your analytics. This is the default set for a store with a broad audience — where your traffic is concentrated, testing goes deeper.",
      headers: ["Platform", "Browsers", "Why it is included"],
      rows: [
        ["Desktop", "Chrome, Safari, Firefox, Edge", "Safari and Firefox surface rendering differences that Chrome hides; Edge shares an engine with Chrome but not its settings or extensions behaviour."],
        ["iOS", "Safari, Chrome for iOS", "Every browser on iOS uses WebKit, but the surrounding behaviour still differs. A large share of mobile revenue passes through here."],
        ["Android", "Chrome, Samsung Internet", "The second-largest engine family, with its own viewport and font-scaling behaviour."],
      ],
    },
    {
      type: "checklist",
      eyebrow: "High-risk components",
      heading: "What breaks first, in practice",
      intro:
        "Across audits, the same components fail cross-browser before anything else does. These get checked first, in every browser in scope.",
      items: [
        { title: "Cart drawers and modal overlays", text: "sticky and fixed positioning behave differently per engine" },
        { title: "Sticky headers and add-to-cart bars", text: "viewport-relative units and scroll containers differ" },
        { title: "Image galleries and swipe carousels", text: "touch event handling and transform performance" },
        { title: "Variant pickers and swatches", text: "native form control styling and event handling" },
        { title: "Date and address inputs", text: "native control rendering is the least consistent area across browsers" },
        { title: "Backdrop-filter and blur effects", text: "supported differently, and expensive where they are" },
        { title: "Custom range and quantity controls", text: "built from non-native elements and often missing a browser's event model" },
      ],
    },
    {
      type: "steps",
      eyebrow: "Process",
      heading: "How cross-browser testing runs",
      steps: [
        { title: "Define the matrix", text: "Agree browsers, versions and platforms based on your actual traffic rather than an arbitrary list." },
        { title: "Baseline in Chrome", text: "Establish the expected behaviour first, so differences elsewhere are identifiable as deviations rather than guesses." },
        { title: "Systematic comparison", text: "Work the same journeys and components in every browser in scope, recording behaviour question by question." },
        { title: "Isolate the cause", text: "For each difference, determine whether it is theme code, an app script, or the platform, so the fix goes to the right place." },
        { title: "Capture the evidence", text: "Screenshots and screen recordings per browser, since cross-browser defects are hard to describe in words." },
        { title: "Report by browser and version", text: "Each defect names the exact configuration it reproduces in, and the ones where it does not." },
        { title: "Retest in the same configuration", text: "Fixes are verified in the browser that failed, not in whichever one is convenient." },
      ],
    },
    {
      type: "callout",
      heading: "What 'supported' means here",
      text:
        "Testing covers current and recent versions of the browsers above — not every version ever released, and not legacy browsers that represent negligible traffic. The report states exactly which versions were used for each finding, so coverage is verifiable rather than implied.",
    },
    {
      type: "links",
      eyebrow: "Related testing",
      heading: "Where browser differences show up most",
      items: [
        { href: "/shopify-mobile-testing", label: "Mobile testing", text: "Mobile Safari and Chrome for Android are their own browser matrix, with touch behaviour on top." },
        { href: "/shopify-checkout-testing", label: "Checkout testing", text: "Payment elements and wallet buttons render through the provider and can behave differently per browser." },
        { href: "/shopify-performance-testing", label: "Performance testing", text: "Render-blocking resources and heavy effects hit some engines harder than others." },
        { href: "/shopify-regression-testing", label: "Regression testing", text: "Browser coverage belongs in every release check — new code can break one engine only." },
      ],
    },
  ],

  faq: [
    {
      q: "Which browsers do you test Shopify stores in?",
      a: "By default: Chrome, Safari, Firefox and Edge on desktop, plus Safari and Chrome on iOS and Android. The exact matrix is agreed at scoping based on your traffic — if your analytics show a concentration in one browser, testing goes deeper there rather than spreading evenly across an arbitrary list.",
    },
    {
      q: "Why does my Shopify store break in Safari specifically?",
      a: "Safari's engine handles several things differently from Chrome's — viewport units, sticky and fixed positioning, form control styling, date inputs and scroll behaviour among them. Themes and apps are frequently developed and checked primarily in Chrome. The combination means Safari is where rendering and interaction differences most often surface first.",
    },
    {
      q: "Can a Shopify app break my store in only one browser?",
      a: "Yes, and it is common. Apps inject their own scripts and styles, and conflicts with the theme or with other apps frequently resolve differently depending on load order and engine behaviour. That is why apps are tested inside the store's flows in each browser rather than on their own settings page.",
    },
    {
      q: "Do you test on old browsers like Internet Explorer?",
      a: "No. Testing covers current and recent versions of the browsers listed above. Legacy browsers carry negligible ecommerce traffic, and testing them consumes time that is better spent on the configurations your customers actually use.",
    },
    {
      q: "How is cross-browser testing different from responsive testing?",
      a: "Responsive testing changes the viewport size in one engine. Cross-browser testing keeps the viewport and changes the engine. They find different classes of defect, which is why both belong in a complete testing pass.",
    },
    {
      q: "Do you use a cloud testing service or real browsers?",
      a: "Testing runs in real browsers in the configurations listed in the report. Where automation adds value for repetitive comparison it may be used alongside manual testing, but the findings come from observed behaviour, and each one names the browser and version it was reproduced in.",
    },
    {
      q: "Can this be run before a theme launch?",
      a: "Yes, and it is the best time. Pre-launch testing in every browser in scope means differences are found while the theme is still being worked on, rather than after customers have already met them.",
    },
  ],

  related: [
    "shopify-qa-testing",
    "shopify-mobile-testing",
    "shopify-checkout-testing",
    "shopify-regression-testing",
    "shopify-performance-testing",
    "ecommerce-qa-testing",
  ],
};
