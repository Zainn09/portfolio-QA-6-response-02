import type { ServicePageContent } from "./types";

export const shopifyMobileTesting: ServicePageContent = {
  slug: "shopify-mobile-testing",

  title: "Shopify Mobile Testing Services | QA Specialist",
  metaDescription:
    "Shopify mobile QA across phones and tablets: navigation, search, product pages, add-to-cart, forms and mobile checkout in real viewports.",

  eyebrow: "Mobile & Responsive",
  h1: "Shopify Mobile Testing on Real Devices, Not a Resized Browser Window",
  lead:
    "Most store traffic is on a phone, and most store testing is done on a desktop. The gap between those two facts is where mobile defects live — the ones that never appear until a customer with one thumb and a slow connection tries to buy.",
  heroPoints: [
    "Tested at real viewports from 390px upward, on iOS Safari and Chrome for Android",
    "Touch interactions, keyboards, sticky elements and gestures — the behaviours emulation does not reproduce",
    "Tablet and landscape layouts included, since they break differently from both phone and desktop",
  ],
  primaryCta: { label: "Test my mobile store", href: "/audit" },
  secondaryCta: { label: "See mobile findings", href: "/work" },

  schemaName: "Shopify Mobile Testing",
  schemaDescription:
    "Mobile and responsive testing for Shopify stores on real devices — mobile navigation, search and filtering, product pages, add-to-cart, forms, touch interactions, mobile checkout and tablet layouts.",
  serviceType: [
    "Shopify mobile testing",
    "Responsive testing",
    "Mobile ecommerce QA",
    "Touch and gesture testing",
  ],
  crumb: "Shopify Mobile Testing",

  blocks: [
    {
      type: "prose",
      eyebrow: "The problem",
      heading: "A resized desktop browser is not a phone",
      paragraphs: [
        "Developer tools in a desktop browser are useful for checking breakpoints. They are not a substitute for a phone, because the things that break mobile commerce are not width-dependent — they are input-dependent. A tap target that is technically clickable but too small for a thumb. A hover state that never fires on touch, hiding a control that only exists on desktop. An on-screen keyboard that covers the field being typed into. A sticky header that sits precisely on top of the checkout button.",
        "None of these reproduce when you narrow your window. All of them are visible within minutes on a real device.",
        "Then there is performance, which is a different problem on mobile: the same page that loads acceptably on a laptop can stall on a mid-range Android phone over a mobile connection. If a third-party script blocks the main thread, mobile customers are the ones who feel it.",
      ],
    },
    {
      type: "cards",
      eyebrow: "Coverage",
      heading: "What mobile testing walks through",
      columns: 3,
      cards: [
        {
          title: "Mobile navigation",
          text: "Menu open and close, nested levels, back behaviour, scroll locking while the menu is open, and whether the floating elements behind it stay put.",
        },
        {
          title: "Home and landing layouts",
          text: "Hero sizing, text wrapping, image crops that lose the subject on a narrow screen, and call-to-action placement above the fold.",
        },
        {
          title: "Collection browsing",
          text: "Filter drawers, sort selectors, pagination or infinite scroll, grid density, and whether the scroll position survives a product visit and return.",
        },
        {
          title: "Search and predictive results",
          text: "Keyboard behaviour, result list scrolling, result tap targets, and what happens when the query returns nothing.",
        },
        {
          title: "Product pages",
          text: "Image galleries and swipe, variant pickers, quantity steppers, add-to-cart placement, sticky add-to-cart bars, and accordion content sections.",
        },
        {
          title: "Cart and drawer",
          text: "Drawer opening behaviour, whether the background scrolls behind it, line-item editing, quantity controls, and the path onward to checkout.",
        },
        {
          title: "Forms",
          text: "Contact, newsletter, address and discount fields — input types, autocomplete attributes, error visibility with the keyboard open, and focus order.",
        },
        {
          title: "Mobile checkout",
          text: "Field-by-field completion, express wallet placement, shipping and payment selection, error recovery and confirmation on a small viewport.",
        },
        {
          title: "Tablet and landscape",
          text: "iPad and Android tablet layouts, orientation changes mid-journey, and the widths where a two-column layout stops making sense.",
        },
      ],
    },
    {
      type: "checklist",
      eyebrow: "Touch behaviour",
      heading: "The interactions that only fail on a touchscreen",
      intro:
        "These are tested by hand because no automated viewport sweep catches them. Each one has a predictable symptom on a phone and no symptom at all on a desktop.",
      items: [
        { title: "Tap target size and spacing" },
        { title: "Hover-only controls", text: "anything that appears on hover is invisible on touch" },
        { title: "Keyboard covering inputs", text: "especially on the lower half of a long form" },
        { title: "Sticky bars over content", text: "add-to-cart and cookie bars competing for the same space" },
        { title: "Swipe gestures on galleries", text: "and whether they conflict with page-level swipe navigation" },
        { title: "Overlay stacking", text: "chat widgets, promo popups, drawers and modals fighting for the top layer" },
        { title: "Double-tap zoom", text: "on controls that respond to a single tap" },
        { title: "Pinch zoom", text: "and whether the layout survives it without horizontal shifts" },
      ],
    },
    {
      type: "prose",
      eyebrow: "Performance",
      heading: "Mobile is where page weight shows up",
      paragraphs: [
        "The same page, downloaded over a mobile connection on a mid-range phone, behaves nothing like it does on a laptop on fibre. Images that are not sized for their slots, scripts from installed apps that run before the main content, and font resources that block the first paint all land hardest on the devices most customers are actually using.",
        "Mobile testing therefore includes a performance read: what loads when, what blocks the first render, and how much of the page weight comes from the theme versus the apps. The findings are specific and actionable rather than a score.",
      ],
    },
    {
      type: "steps",
      eyebrow: "Process",
      heading: "How mobile testing runs",
      steps: [
        { title: "Device selection", text: "Choose viewports based on real traffic patterns — the common phone sizes plus the tablet and landscape cases your analytics show." },
        { title: "Journey walkthrough", text: "Complete the buying journey on each device from entry to confirmation, recording where the experience degrades." },
        { title: "Touch and gesture pass", text: "Work every interactive element by hand to find the controls that only respond to a desktop mouse." },
        { title: "Layout stress", text: "Test the awkward cases — long product titles, out-of-stock badges, large carts, translated content that runs longer." },
        { title: "Performance read", text: "Measure what blocks rendering on a mobile connection and identify the heaviest contributors." },
        { title: "Defect documentation", text: "Record each issue with device, OS version, browser, viewport and the exact steps to reproduce." },
        { title: "Retest after fixes", text: "Confirm fixes on the same device and viewport, then re-check the journeys that share the component." },
      ],
    },
    {
      type: "table",
      eyebrow: "Deliverables",
      heading: "The mobile report",
      headers: ["Deliverable", "Contents"],
      rows: [
        ["Device and viewport matrix", "Exactly which devices, browsers, OS versions and orientations were tested."],
        ["Mobile defect log", "Issues with device-specific reproduction steps and severity based on the impact on buying."],
        ["Touch interaction notes", "Controls that fail on touch, with the desktop behaviour that masks them."],
        ["Layout issue record", "Screenshots at each viewport showing where the layout breaks and at which width."],
        ["Mobile performance notes", "What delays the first render, and which apps or assets contribute most."],
      ],
    },
    {
      type: "callout",
      heading: "Devices in the test set",
      text:
        "Testing runs on current iOS and Android versions across common phone and tablet viewports, with both Safari and Chrome on mobile. Specific device coverage is agreed at scoping and written into the report — so you know exactly which configuration each finding was reproduced on, and which were not covered.",
    },
    {
      type: "links",
      eyebrow: "Related testing",
      heading: "Mobile problems usually lead somewhere",
      items: [
        { href: "/shopify-checkout-testing", label: "Checkout testing", text: "Mobile checkout deserves its own pass — the keyboard, wallets and error recovery all behave differently." },
        { href: "/shopify-performance-testing", label: "Performance testing", text: "Page weight is a mobile-first problem. Core Web Vitals are measured on phones for a reason." },
        { href: "/shopify-accessibility-testing", label: "Accessibility testing", text: "Touch target sizing and dynamic text scaling overlap heavily with accessibility requirements." },
        { href: "/shopify-cross-browser-testing", label: "Cross-browser testing", text: "Mobile Safari against Chrome for Android is a browser matrix in its own right." },
      ],
    },
  ],

  faq: [
    {
      q: "Why can't mobile testing be done in a desktop browser's device mode?",
      a: "Device mode changes the viewport, which is useful for checking breakpoints — but it runs on a desktop engine with a mouse. It cannot reproduce touch input, on-screen keyboards, autofill behaviour, mobile Safari's specific quirks, or the performance of a mid-range phone on a mobile connection. Those are exactly where mobile commerce defects come from.",
    },
    {
      q: "Which devices are tested?",
      a: "Coverage is agreed at scoping and based on your traffic. Testing runs on current iOS with Safari and current Android with Chrome, across common phone viewports and tablet sizes, in both orientations. The report records precisely which device and OS version each defect was reproduced on.",
    },
    {
      q: "Is responsive testing the same as mobile testing?",
      a: "No, and the difference is the reason this service exists. Responsive testing checks that layouts adapt at each breakpoint. Mobile testing checks that a customer can actually complete a purchase with one thumb — which involves touch targets, keyboards, sticky elements, gestures and performance, none of which are covered by resizing a window.",
    },
    {
      q: "How much of mobile QA is performance?",
      a: "Enough that it is always included. Mobile hardware and connections expose page weight that stays invisible on a desktop. Testing identifies what blocks the first render on a mobile connection, which installed apps contribute the heaviest scripts, and which images are not sized for their slots.",
    },
    {
      q: "Can you test on a specific device we care about?",
      a: "If it is a current, supported device, usually yes — tell me the model, OS version and browser, and it can be added to the test set. What is never done is claiming coverage on a device that was not actually used.",
    },
    {
      q: "Do you test mobile app storefronts as well?",
      a: "No. This service covers the mobile web storefront. Native or headless mobile apps are a different testing discipline and are not claimed here.",
    },
    {
      q: "Will mobile testing find things desktop testing missed?",
      a: "Usually, yes — that is the point. In most audits, a meaningful share of the defects that matter are touch-only or small-viewport-only, and they are invisible in a desktop pass no matter how thorough that pass was.",
    },
  ],

  related: [
    "shopify-qa-testing",
    "shopify-checkout-testing",
    "shopify-performance-testing",
    "shopify-accessibility-testing",
    "shopify-cross-browser-testing",
    "ecommerce-qa-testing",
  ],
};
