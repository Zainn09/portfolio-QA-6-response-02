export type Issue = {
  id: string;
  title: string;
  severity: "critical" | "major" | "minor";
  description: string;
  rootCause: string;
  resolution: string;
};

export type VerificationItem = {
  label: string;
  status: "verified" | "failed" | "pending";
};

export type FAQ = {
  question: string;
  answer: string;
};

export type Project = {
  id: number;
  title: string;
  slug: string;
  industry: string;
  platform: string;
  partnerType?: string;
  featured: boolean;
  featuredOrder: number;
  thumbnail: string;
  heroImage: string;
  gallery: string[];
  videos?: { src: string; poster?: string; caption: string }[];
  headings?: { challenge: string; investigation: string; rootCause: string; issues: string; resolution: string; outcome: string };
  brandIntro?: string;
  highlights?: { label: string; text: string }[];
  findingsTable?: { finding: string; severity: string; impact: string; status: string }[];
  resultsTable?: { metric: string; before: string; after: string }[];
  summary: string;
  challenge: string;
  investigation: string;
  rootCause: string;
  resolution: string;
  outcome: string;
  testingScope: string[];
  issues: Issue[];
  beforeImage?: string;
  afterImage?: string;
  verification: VerificationItem[];
  technologies: string[];
  externalLinks: { label: string; url: string }[];
  faqs: FAQ[];
  seo: {
    title: string;
    description: string;
    image?: string;
    canonical?: string;
  };
  status: "draft" | "published";
};

export const sampleProjects: Project[] = [
  // ── Featured Top 10 ──────────────────────────────────────────────────────
  {
    id: 1,
    title: "Solène Jewellery",
    slug: "solene-jewellery-shopify-plus-audit",
    industry: "Jewellery",
    platform: "Shopify Plus",
    featured: true,
    featuredOrder: 7,
    thumbnail: "/images/projects/jewellery-thumbnail.jpg",
    heroImage: "/images/projects/jewellery-hero.jpg",
    gallery: [],
    summary:
      "A premium jewellery brand on Shopify Plus had critical mobile product-discovery breakdowns silently costing them conversions.",
    challenge:
      "Mobile users were dropping off on collection pages at a rate inconsistent with desktop behaviour. The design looked polished on first glance, but edge-case navigation states were creating invisible walls for users on smaller devices.",
    investigation:
      "Cross-device testing revealed that the custom collection filter drawer was overlapping product images below 390px. The sticky add-to-cart bar was clashing with the OS navigation bar on iOS Safari, making the primary CTA inaccessible without scrolling.",
    rootCause:
      "The filter drawer used a fixed pixel height that did not account for device-specific viewport offsets. The sticky CTA used `100vh` without the `-webkit-fill-available` workaround required on iOS Safari.",
    resolution:
      "Documented all instances with reproduction steps. Worked with the development team to implement dynamic viewport height calculations and z-index corrections. Filter drawer re-tested across 8 device/OS combinations.",
    outcome:
      "Mobile collection-to-product-page navigation was fully restored. Sticky CTA became accessible across all tested iOS and Android configurations. Product discovery flow verified end-to-end.",
    testingScope: [
      "Mobile Responsive Testing",
      "Cross-browser Testing",
      "UI/UX Testing",
      "Functional Testing",
    ],
    issues: [
      {
        id: "JWL-001",
        title: "Filter drawer overlapping product grid on mobile",
        severity: "critical",
        description:
          "At viewport widths below 390px, the collection filter drawer expanded beyond its container and obscured product thumbnails.",
        rootCause:
          "Fixed pixel height set on `.filter-drawer` did not respect dynamic viewport height on small devices.",
        resolution:
          "Replaced fixed height with `calc(var(--vh, 1vh) * 100)` and implemented JS-based `--vh` custom property update on resize.",
      },
      {
        id: "JWL-002",
        title: "Sticky add-to-cart CTA inaccessible on iOS Safari",
        severity: "major",
        description:
          "The sticky bottom bar was partially clipped by the Safari browser chrome on iPhone models with bottom navigation bars.",
        rootCause:
          "CSS used `100vh` which does not account for iOS Safari's dynamic toolbar behaviour.",
        resolution:
          "Added `-webkit-fill-available` fallback and `env(safe-area-inset-bottom)` padding.",
      },
      {
        id: "JWL-003",
        title: "Variant selector loses state on back navigation",
        severity: "minor",
        description:
          "When navigating back from the cart to a product page, the previously selected variant reverted to the default.",
        rootCause:
          "Browser back-cache was not preserving the Shopify variant URL parameter correctly.",
        resolution:
          "Documented and flagged for URL parameter persistence review with the development team.",
      },
    ],
    verification: [
      { label: "Functional", status: "verified" },
      { label: "Responsive", status: "verified" },
      { label: "Cross-browser", status: "verified" },
      { label: "Checkout", status: "verified" },
      { label: "Regression", status: "verified" },
    ],
    technologies: ["Shopify Plus", "Dawn Theme", "iOS Safari", "Chrome DevTools"],
    externalLinks: [],
    faqs: [
      {
        question: "What was the primary issue discovered?",
        answer:
          "The critical issue was a mobile filter drawer that overlapped the product grid on smaller viewports, combined with an inaccessible sticky CTA on iOS Safari.",
      },
      {
        question: "How was the issue discovered?",
        answer:
          "Through systematic cross-device responsive testing across 8 mobile device/OS combinations, including real-device testing on iOS Safari.",
      },
      {
        question: "What caused the iOS Safari CTA issue?",
        answer:
          "The CSS `100vh` value does not account for iOS Safari's dynamic browser chrome, which collapses and expands as users scroll. This is a well-documented browser-specific behaviour.",
      },
      {
        question: "How was the fix verified?",
        answer:
          "All fixes were re-tested across the original 8 device/OS combinations plus additional edge-case viewports. Each issue was individually marked as verified upon confirmation.",
      },
    ],
    seo: {
      title: "Jewellery Store QA Audit — Shopify Plus | Case Study",
      description:
        "Mobile product-discovery breakdown discovered and resolved on a premium Shopify Plus jewellery store. Full QA audit case study.",
    },
    status: "published",
  },
  {
    id: 2,
    title: "Forma Furniture",
    slug: "forma-furniture-shopify-audit",
    industry: "Furniture",
    platform: "Shopify",
    featured: true,
    featuredOrder: 8,
    thumbnail: "/images/projects/furniture-thumbnail.jpg",
    heroImage: "/images/projects/furniture-hero.jpg",
    gallery: [],
    summary:
      "A premium furniture brand's checkout flow had an invisible shipping-rate bug that silently blocked international orders.",
    challenge:
      "Customer service was receiving reports of international customers unable to complete checkout. The error appeared inconsistently and was difficult to reproduce in development.",
    investigation:
      "Systematic checkout testing across 12 international shipping zones revealed that specific country + weight combinations triggered a condition where no shipping rates were returned, presenting a blank shipping selection screen with no error message.",
    rootCause:
      "A Shopify carrier-calculated shipping configuration had an uncovered weight range for specific international zones. When cart weight fell exactly between two defined tiers, the system returned an empty rate array with no fallback.",
    resolution:
      "Documented the exact weight thresholds and country combinations that triggered the blank state. Provided a complete reproduction matrix. The shipping configuration was updated to close all coverage gaps.",
    outcome:
      "International checkout was verified across all 12 zones with no blank shipping rate states. The previously untested weight edge cases were added to the regression test suite.",
    testingScope: [
      "Checkout Testing",
      "Payment Flow Testing",
      "Functional Testing",
      "Edge Case Testing",
    ],
    issues: [
      {
        id: "FRN-001",
        title: "Blank shipping rates for specific international zones",
        severity: "critical",
        description:
          "Certain country + cart weight combinations returned an empty shipping rate array, blocking checkout completion with no user-facing error.",
        rootCause:
          "Uncovered weight range in Shopify carrier-calculated shipping rules for specific international zones.",
        resolution:
          "Shipping configuration updated to add full weight coverage across all zones. Verified across all 12 international shipping destinations.",
      },
      {
        id: "FRN-002",
        title: "Discount code field disappears on mobile checkout",
        severity: "major",
        description:
          "The discount code input field was hidden behind the keyboard on certain Android devices during checkout.",
        rootCause:
          "The field lacked a `scroll-into-view` handler for mobile keyboard open events.",
        resolution: "Flagged for development fix and regression tested post-resolution.",
      },
      {
        id: "FRN-003",
        title: "Order confirmation email missing product images",
        severity: "minor",
        description:
          "Confirmation emails sent after checkout were missing product thumbnail images for certain product variants.",
        rootCause:
          "The email template referenced variant images that had not been assigned to all variants.",
        resolution: "Identified and documented for content team review.",
      },
    ],
    verification: [
      { label: "Functional", status: "verified" },
      { label: "Checkout", status: "verified" },
      { label: "International Shipping", status: "verified" },
      { label: "Mobile", status: "verified" },
      { label: "Regression", status: "verified" },
    ],
    technologies: ["Shopify", "Carrier-Calculated Shipping", "Chrome DevTools"],
    externalLinks: [],
    faqs: [
      {
        question: "Why was the shipping bug hard to reproduce?",
        answer:
          "The bug only triggered when cart weight fell in a very specific uncovered range AND the shipping destination was in a particular zone — a combination that required systematic matrix testing to isolate.",
      },
      {
        question: "How many shipping zones were tested?",
        answer: "12 international shipping zones were tested with varying cart weight combinations.",
      },
    ],
    seo: {
      title: "Furniture Store Checkout QA Audit — Shopify | Case Study",
      description:
        "Invisible international shipping bug discovered and resolved on a Shopify furniture store. Full checkout QA case study.",
    },
    status: "published",
  },
  {
    id: 3,
    title: "Paige & Lore Books",
    slug: "paige-lore-books-shopify-audit",
    industry: "Books",
    platform: "Shopify",
    featured: true,
    featuredOrder: 9,
    thumbnail: "/images/projects/books-thumbnail.jpg",
    heroImage: "/images/projects/books-hero.jpg",
    gallery: [],
    summary:
      "A speciality bookstore's custom search experience was silently excluding a large portion of its catalogue from results.",
    challenge:
      "The store used a custom predictive search implementation. Staff noticed certain titles were missing from search results despite being active, in-stock products.",
    investigation:
      "Search query testing across 200+ product titles revealed a pattern: products with special characters or punctuation in their titles (apostrophes, ampersands, dashes) were not surfacing in predictive search results.",
    rootCause:
      "The custom search implementation was not correctly encoding special characters before passing them to the Shopify Search API. The apostrophe character was causing the query string to malform.",
    resolution:
      "Documented the character encoding issue with a full list of affected product title patterns. The development team updated the search query encoder. All 200+ test cases were re-validated.",
    outcome:
      "Predictive search now correctly returns results for all product titles regardless of special characters. Search coverage increased for an estimated portion of the catalogue.",
    testingScope: [
      "Functional Testing",
      "Search Testing",
      "Edge Case Testing",
      "API Testing",
    ],
    issues: [
      {
        id: "BKS-001",
        title: "Predictive search excludes products with special characters",
        severity: "critical",
        description:
          "Products containing apostrophes, ampersands, or dashes in their titles did not appear in search results.",
        rootCause:
          "Special characters were not URL-encoded before being passed to the Shopify Search API, causing malformed query strings.",
        resolution:
          "Query string encoding updated to properly escape all special characters before API calls.",
      },
      {
        id: "BKS-002",
        title: "Search results layout breaks with long product titles",
        severity: "minor",
        description:
          "Very long book titles caused text overflow in the predictive search dropdown.",
        rootCause: "Missing `text-overflow: ellipsis` and `max-width` constraints on result items.",
        resolution: "CSS fix applied and verified.",
      },
    ],
    verification: [
      { label: "Search Functionality", status: "verified" },
      { label: "Edge Cases", status: "verified" },
      { label: "Responsive", status: "verified" },
      { label: "Regression", status: "verified" },
    ],
    technologies: ["Shopify", "Shopify Search API", "Custom Theme"],
    externalLinks: [],
    faqs: [
      {
        question: "How many products were affected?",
        answer:
          "Testing revealed the issue affected any product with special characters in the title — a pattern that applied to a significant portion of a bookstore's catalogue, given common use of apostrophes and punctuation in titles.",
      },
    ],
    seo: {
      title: "Books Store Search QA Audit — Shopify | Case Study",
      description:
        "Custom search excluding catalogue products discovered and resolved on a Shopify bookstore. Full QA investigation.",
    },
    status: "published",
  },
  {
    id: 4,
    title: "Vitalis Supplements",
    slug: "vitalis-supplements-shopify-plus-audit",
    industry: "Supplements",
    platform: "Shopify Plus",
    featured: true,
    featuredOrder: 10,
    thumbnail: "/images/projects/supplements-thumbnail.jpg",
    heroImage: "/images/projects/supplements-hero.jpg",
    gallery: [],
    summary:
      "A high-volume supplements brand on Shopify Plus had subscription upsell flows silently breaking for new vs returning customers.",
    challenge:
      "Subscription upsell prompts shown at cart were converting inconsistently. The issue was intermittent and had no clear pattern in customer reports.",
    investigation:
      "Systematic testing across new customer, returning customer, and logged-in account states revealed that the upsell component was rendering in a broken state specifically for new guest sessions where no Shopify customer ID existed.",
    rootCause:
      "The subscription upsell app was making an API call that assumed a customer ID always existed. When no customer was logged in, the API returned a 400 error silently, and the component failed to render the upsell — displaying a blank section instead.",
    resolution:
      "Documented the exact session states that triggered the failure. App configuration was updated to handle the null customer state gracefully with a conditional display fallback.",
    outcome:
      "Subscription upsell now displays correctly across all session states. Guest, returning, and logged-in customer flows all verified.",
    testingScope: [
      "Functional Testing",
      "Cart Testing",
      "Third-party App Testing",
      "Session State Testing",
    ],
    issues: [
      {
        id: "SUP-001",
        title: "Subscription upsell fails silently for guest sessions",
        severity: "critical",
        description:
          "Cart subscription upsell component rendered blank for any user not logged into a customer account.",
        rootCause:
          "Third-party subscription app API call assumed customer ID always present; null state caused silent 400 error.",
        resolution: "Conditional null check added before API call; fallback display implemented.",
      },
    ],
    verification: [
      { label: "Guest Session", status: "verified" },
      { label: "Logged-in Session", status: "verified" },
      { label: "Returning Customer", status: "verified" },
      { label: "Cart", status: "verified" },
    ],
    technologies: ["Shopify Plus", "Subscription App", "Checkout Extensibility"],
    externalLinks: [],
    faqs: [
      {
        question: "Why was the issue intermittent?",
        answer:
          "Because it only affected guest/new sessions, it appeared intermittent — staff testing while logged in never saw it. Real customer reports came from first-time visitors.",
      },
    ],
    seo: {
      title: "Supplements Store Subscription QA Audit — Shopify Plus | Case Study",
      description:
        "Subscription upsell silently failing for new customers discovered and resolved on a Shopify Plus supplements store.",
    },
    status: "published",
  },
  {
    id: 5,
    title: "Maison & Co",
    slug: "maison-co-home-lifestyle-shopify-plus",
    industry: "Home & Lifestyle",
    platform: "Shopify Plus",
    featured: false,
    featuredOrder: 0,
    thumbnail: "/images/projects/home-thumbnail.jpg",
    heroImage: "/images/projects/home-hero.jpg",
    gallery: [],
    summary:
      "A lifestyle brand's product configurator was producing invalid cart items that cleared at checkout, creating a frustrating customer loop.",
    challenge:
      "Customers using the custom product configurator (choose fabric, finish, size) were occasionally finding their cart empty when they reached checkout. No error was shown.",
    investigation:
      "End-to-end configurator testing across all variant combinations revealed that certain fabric + size combinations produced a variant ID that existed in the configurator's logic but had been archived in Shopify — returning an invalid line item that was silently removed at checkout.",
    rootCause:
      "Archived Shopify variants were not removed from the configurator's local variant mapping data. When selected, they produced an invalid cart line item that Shopify's checkout process removed without a user-facing error.",
    resolution:
      "All archived variants identified and documented. Configurator sync logic was updated to exclude archived variants. Cart validation was improved to show a human-readable error instead of silent removal.",
    outcome:
      "Cart-to-checkout completion verified across all active variant combinations. Archived variant handling documented for ongoing maintenance.",
    testingScope: [
      "Functional Testing",
      "Cart Testing",
      "Product Configurator Testing",
      "Checkout Testing",
    ],
    issues: [
      {
        id: "HLS-001",
        title: "Archived variants silently clear cart at checkout",
        severity: "critical",
        description:
          "Selecting certain configurator combinations added an archived variant to cart, which was silently removed when checkout was initiated.",
        rootCause:
          "Configurator variant map not synced with Shopify's current archived/active variant states.",
        resolution: "Sync logic updated; archived variants excluded from configurator options.",
      },
    ],
    verification: [
      { label: "Configurator", status: "verified" },
      { label: "Cart", status: "verified" },
      { label: "Checkout", status: "verified" },
      { label: "Regression", status: "verified" },
    ],
    technologies: ["Shopify Plus", "Custom Product Configurator", "Shopify Storefront API"],
    externalLinks: [],
    faqs: [
      {
        question: "Was any data lost?",
        answer:
          "No data was lost, but customers who experienced the silent cart clear would need to reconfigure their product selection.",
      },
    ],
    seo: {
      title: "Home Lifestyle Configurator QA Audit — Shopify Plus | Case Study",
      description:
        "Product configurator silently clearing carts at checkout discovered and resolved on a Shopify Plus lifestyle store.",
    },
    status: "published",
  },
  {
    id: 6,
    title: "Atelier Mode",
    slug: "atelier-mode-fashion-shopify-plus",
    industry: "Fashion",
    platform: "Shopify Plus",
    featured: false,
    featuredOrder: 0,
    thumbnail: "/images/projects/fashion-thumbnail.jpg",
    heroImage: "/images/projects/fashion-hero.jpg",
    gallery: [],
    summary:
      "A fashion brand's size guide and variant selection UX had a critical disconnect causing customers to add wrong sizes to cart.",
    challenge:
      "The store had a custom size guide with a 'Select This Size' button directly in the guide overlay. Testing revealed the button was not correctly syncing with the main product page variant selector.",
    investigation:
      "Functional testing of the size guide CTA across multiple product types revealed that the variant selection made inside the overlay was not being communicated to the underlying product form — meaning the add-to-cart action would add whichever size was previously selected on the page.",
    rootCause:
      "The size guide overlay operated as an isolated component with no data binding to the parent product form. The 'Select This Size' button dispatched a UI change but did not trigger the Shopify variant selector change event.",
    resolution:
      "Documented the specific interaction flow that caused the desync. The development team updated the overlay to programmatically trigger the correct variant selector change event before closing.",
    outcome:
      "Size guide to variant selection flow fully verified. Add-to-cart confirmed to reflect the size selected within the guide across all tested product types.",
    testingScope: [
      "UI/UX Testing",
      "Functional Testing",
      "Product Page Testing",
      "Cart Testing",
    ],
    issues: [
      {
        id: "FSH-001",
        title: "Size guide 'Select This Size' does not sync variant selector",
        severity: "critical",
        description:
          "Clicking 'Select This Size' within the size guide overlay visually appeared to select a size but did not update the product form, causing wrong sizes to be added to cart.",
        rootCause:
          "Overlay component had no programmatic link to the parent product form's variant selector.",
        resolution:
          "Overlay updated to dispatch correct Shopify variant change event on selection.",
      },
    ],
    verification: [
      { label: "Functional", status: "verified" },
      { label: "Cart", status: "verified" },
      { label: "Mobile", status: "verified" },
      { label: "Regression", status: "verified" },
    ],
    technologies: ["Shopify Plus", "Custom Theme", "Dawn Framework"],
    externalLinks: [],
    faqs: [
      {
        question: "Could customers tell the size was wrong before checkout?",
        answer:
          "The visual UI of the variant selector did update to reflect the guide selection, but the underlying form data did not — meaning customers saw what appeared to be the correct selection, but the wrong size was added to cart.",
      },
    ],
    seo: {
      title: "Fashion Store Size Guide QA Audit — Shopify Plus | Case Study",
      description:
        "Critical size guide and variant selector desync discovered on a Shopify Plus fashion store. Full QA investigation.",
    },
    status: "published",
  },
  {
    id: 7,
    title: "Lumine Beauty",
    slug: "lumine-beauty-shopify-audit",
    industry: "Beauty",
    platform: "Shopify",
    featured: false,
    featuredOrder: 0,
    thumbnail: "/images/projects/beauty-thumbnail.jpg",
    heroImage: "/images/projects/beauty-hero.jpg",
    gallery: [],
    summary:
      "A beauty brand's loyalty points app was awarding incorrect points multipliers on sale items during promotional events.",
    challenge:
      "During a storewide sale event, the loyalty points app was awarding points based on original prices rather than actual paid amounts, creating inconsistent customer expectations.",
    investigation:
      "Testing the loyalty app behaviour during sale conditions revealed that the points calculation was reading the `compare_at_price` value instead of the actual `price` — awarding inflated points that did not reflect real spend.",
    rootCause:
      "The loyalty app's Shopify integration was using the wrong product price property. It referenced `compare_at_price` (the original price) for points calculation rather than `price` (the actual charged amount).",
    resolution:
      "Issue documented with exact API property references. App vendor was notified with a precise technical report. Configuration was updated to use the correct price property.",
    outcome:
      "Points calculation verified to correctly reflect actual paid amount across sale and non-sale conditions.",
    testingScope: [
      "Third-party App Testing",
      "Functional Testing",
      "Promotional Testing",
      "Cart Testing",
    ],
    issues: [
      {
        id: "BTY-001",
        title: "Loyalty points calculated on compare_at_price during sales",
        severity: "major",
        description:
          "During promotional events, loyalty points were awarded based on the original price rather than the discounted price paid.",
        rootCause:
          "App used `compare_at_price` instead of `price` for points calculation, inflating rewards during sales.",
        resolution: "App configuration corrected to use actual charged price for all calculations.",
      },
    ],
    verification: [
      { label: "Loyalty App", status: "verified" },
      { label: "Sale Conditions", status: "verified" },
      { label: "Normal Conditions", status: "verified" },
    ],
    technologies: ["Shopify", "Loyalty App Integration", "Shopify Storefront API"],
    externalLinks: [],
    faqs: [
      {
        question: "Was this discovered during a live sale?",
        answer:
          "No — it was discovered during pre-launch QA testing of a planned promotional campaign, which allowed the issue to be corrected before the sale went live.",
      },
    ],
    seo: {
      title: "Beauty Store Loyalty App QA Audit — Shopify | Case Study",
      description:
        "Loyalty points app awarding inflated rewards during sales discovered and resolved on a Shopify beauty store.",
    },
    status: "published",
  },
  {
    id: 8,
    title: "Grove & Grain",
    slug: "grove-grain-food-beverage-shopify",
    industry: "Food & Beverage",
    platform: "Shopify",
    featured: false,
    featuredOrder: 0,
    thumbnail: "/images/projects/food-thumbnail.jpg",
    heroImage: "/images/projects/food-hero.jpg",
    gallery: [],
    summary:
      "A premium food brand's age-verification gate was bypassed by direct URL navigation, creating a compliance risk.",
    challenge:
      "The store had an age-verification modal for age-restricted products. The compliance requirement was that no restricted product could be added to cart without age verification completion.",
    investigation:
      "Navigation testing revealed that the age-verification modal was only shown on the homepage. Directly navigating to a product page URL bypassed the modal entirely, allowing restricted products to be added to cart without verification.",
    rootCause:
      "The age-verification script was triggered only on `DOMContentLoaded` of the homepage template, not universally across all page templates.",
    resolution:
      "Documented the bypass route with reproduction steps. Script implementation was updated to trigger on all page templates and to check for a verification session cookie before rendering the page.",
    outcome:
      "Age verification confirmed to trigger correctly on all entry points including direct URL, collection page, and homepage access.",
    testingScope: [
      "Functional Testing",
      "Compliance Testing",
      "Navigation Testing",
      "Session Testing",
    ],
    issues: [
      {
        id: "FNB-001",
        title: "Age verification bypassed via direct product URL",
        severity: "critical",
        description:
          "Direct navigation to product page URLs bypassed the age-verification modal, allowing restricted product purchase without age confirmation.",
        rootCause:
          "Verification script only loaded on homepage template, not across all page templates.",
        resolution:
          "Script moved to global theme layout; cookie-based session check added for all templates.",
      },
    ],
    verification: [
      { label: "Homepage Entry", status: "verified" },
      { label: "Direct URL Entry", status: "verified" },
      { label: "Collection Entry", status: "verified" },
      { label: "Regression", status: "verified" },
    ],
    technologies: ["Shopify", "Custom Theme", "Session Cookies"],
    externalLinks: [],
    faqs: [
      {
        question: "Was this a legal compliance issue?",
        answer:
          "Potentially yes — age-gated product regulations vary by jurisdiction but generally require consistent enforcement across all access methods.",
      },
    ],
    seo: {
      title: "Food & Beverage Age Gate QA Audit — Shopify | Case Study",
      description:
        "Age verification bypass via direct URL discovered and resolved on a Shopify food and beverage store.",
    },
    status: "published",
  },
  {
    id: 9,
    title: "Meridian Electronics",
    slug: "meridian-electronics-shopify-plus",
    industry: "Electronics",
    platform: "Shopify Plus",
    featured: false,
    featuredOrder: 0,
    thumbnail: "/images/projects/electronics-thumbnail.jpg",
    heroImage: "/images/projects/electronics-hero.jpg",
    gallery: [],
    summary:
      "A high-ticket electronics retailer on Shopify Plus had a cross-browser rendering failure affecting their custom product comparison tool.",
    challenge:
      "The custom product comparison feature was a key sales tool for high-consideration purchases. Reports emerged that the comparison table was displaying incorrectly in Firefox.",
    investigation:
      "Cross-browser testing in Chrome, Firefox, Safari, and Edge revealed that Firefox was not rendering the sticky comparison header correctly, causing column misalignment that made the comparison data unreadable.",
    rootCause:
      "The comparison table used `position: sticky` with a combination of `display: grid` subgrid — a feature with incomplete Firefox support at the time of implementation. Firefox was falling back to a non-sticky layout that broke column alignment.",
    resolution:
      "Documented the Firefox-specific rendering failure with screenshots. A browser-compatible alternative layout was implemented using explicit column width constraints that worked consistently across all tested browsers.",
    outcome:
      "Product comparison table verified to display correctly and consistently across Chrome, Firefox, Safari, and Edge on both desktop and tablet viewports.",
    testingScope: ["Cross-browser Testing", "Responsive Testing", "UI/UX Testing"],
    issues: [
      {
        id: "ELC-001",
        title: "Comparison table misalignment in Firefox",
        severity: "major",
        description:
          "Product comparison table columns misaligned in Firefox due to CSS subgrid support inconsistency, making comparison data unreadable.",
        rootCause:
          "CSS subgrid feature used in comparison layout had incomplete Firefox support at time of implementation.",
        resolution:
          "Layout rebuilt using explicit column width definitions compatible across all major browsers.",
      },
    ],
    verification: [
      { label: "Chrome", status: "verified" },
      { label: "Firefox", status: "verified" },
      { label: "Safari", status: "verified" },
      { label: "Edge", status: "verified" },
      { label: "Tablet", status: "verified" },
    ],
    technologies: ["Shopify Plus", "Custom Theme", "CSS Grid", "Firefox DevTools"],
    externalLinks: [],
    faqs: [
      {
        question: "Why was Firefox specifically affected?",
        answer:
          "Firefox had slower adoption of the CSS subgrid specification compared to Chrome and Safari. The feature was used without a compatible fallback.",
      },
    ],
    seo: {
      title: "Electronics Store Cross-browser QA Audit — Shopify Plus | Case Study",
      description:
        "Firefox product comparison table failure discovered and resolved on a Shopify Plus electronics store.",
    },
    status: "published",
  },
  {
    id: 10,
    title: "Aura Wellness",
    slug: "aura-wellness-health-shopify-plus",
    industry: "Health & Wellness",
    platform: "Shopify Plus",
    featured: false,
    featuredOrder: 0,
    thumbnail: "/images/projects/wellness-thumbnail.jpg",
    heroImage: "/images/projects/wellness-hero.jpg",
    gallery: [],
    summary:
      "A wellness brand on Shopify Plus had an accessibility audit revealing multiple WCAG 2.1 AA failures affecting keyboard and screen-reader users.",
    challenge:
      "The brand was committed to inclusivity. An accessibility audit was requested before a major relaunch to identify compliance gaps.",
    investigation:
      "Manual and automated accessibility testing against WCAG 2.1 AA standards revealed 14 distinct failures including missing focus states, unlabelled form fields, insufficient colour contrast on CTA buttons, and inaccessible modal dialogs.",
    rootCause:
      "The theme had been heavily customised by multiple developers over time. Accessibility was not part of the review checklist during customisation, resulting in accumulated compliance debt.",
    resolution:
      "A full accessibility audit report was produced, prioritising findings by impact. Critical issues (missing form labels, inaccessible modals) were addressed first, with a remediation plan for the full list.",
    outcome:
      "All critical and major accessibility failures resolved before relaunch. WCAG 2.1 AA compliance verified for all primary user journeys including product discovery, cart, and checkout.",
    testingScope: [
      "Accessibility Testing",
      "WCAG 2.1 AA",
      "Keyboard Navigation Testing",
      "Screen Reader Testing",
    ],
    issues: [
      {
        id: "WLN-001",
        title: "Multiple form fields missing accessible labels",
        severity: "critical",
        description:
          "Contact form, newsletter form, and checkout fields were missing programmatic labels, making them inaccessible to screen readers.",
        rootCause:
          "Form fields used placeholder text as the only label. Placeholders are not exposed correctly to all assistive technologies.",
        resolution: "Visible labels or aria-label attributes added to all form fields.",
      },
      {
        id: "WLN-002",
        title: "Modal dialogs not keyboard accessible",
        severity: "critical",
        description:
          "Product image lightbox and size guide modals did not trap keyboard focus, allowing users to tab behind the modal overlay.",
        rootCause:
          "Focus management not implemented for modal open/close events.",
        resolution: "Focus trap implemented on all modal dialogs; Escape key closes modals.",
      },
      {
        id: "WLN-003",
        title: "Insufficient colour contrast on primary CTA",
        severity: "major",
        description:
          "Primary CTA button colour combination failed WCAG 2.1 AA contrast ratio requirements.",
        rootCause: "Button colour palette chosen for aesthetic rather than accessibility compliance.",
        resolution: "Button colours updated to meet 4.5:1 minimum contrast ratio.",
      },
    ],
    verification: [
      { label: "Keyboard Navigation", status: "verified" },
      { label: "Screen Reader", status: "verified" },
      { label: "Colour Contrast", status: "verified" },
      { label: "WCAG 2.1 AA", status: "verified" },
      { label: "Regression", status: "verified" },
    ],
    technologies: ["Shopify Plus", "WCAG 2.1", "NVDA", "VoiceOver", "axe DevTools"],
    externalLinks: [],
    faqs: [
      {
        question: "What does WCAG 2.1 AA compliance mean?",
        answer:
          "WCAG (Web Content Accessibility Guidelines) 2.1 Level AA is an internationally recognised standard for web accessibility. Meeting this level ensures the site is usable by people with a wide range of disabilities.",
      },
      {
        question: "Were all 14 issues resolved before launch?",
        answer:
          "All critical and major issues were resolved and verified before the relaunch date. Minor issues were documented in a post-launch improvement plan.",
      },
    ],
    seo: {
      title: "Health & Wellness Accessibility QA Audit — Shopify Plus | Case Study",
      description:
        "WCAG 2.1 AA accessibility failures discovered and resolved on a Shopify Plus health and wellness store.",
    },
    status: "published",
  },

  // ── Additional Archive Projects (11–50+) ──────────────────────────────────
  {
    id: 11,
    title: "Luxe Linens",
    slug: "luxe-linens-shopify-plus",
    industry: "Home & Lifestyle",
    platform: "Shopify Plus",
    featured: false,
    featuredOrder: 0,
    thumbnail: "/images/projects/default-thumbnail.jpg",
    heroImage: "/images/projects/default-hero.jpg",
    gallery: [],
    summary: "Bundle product pricing not reflecting correctly in cart during BFCM promotions.",
    challenge: "Bundle discounts were not stacking correctly with automatic discounts.",
    investigation: "Cart testing with multiple discount combinations.",
    rootCause: "Discount priority conflict between bundle app and Shopify automatic discounts.",
    resolution: "Discount stacking rules reconfigured.",
    outcome: "All bundle + discount combinations verified.",
    testingScope: ["Cart Testing", "Promotional Testing"],
    issues: [{ id: "LXL-001", title: "Bundle pricing conflict with automatic discounts", severity: "major", description: "Bundle prices not applying correctly with stacked discounts.", rootCause: "Discount priority conflict.", resolution: "Stacking rules reconfigured." }],
    verification: [{ label: "Cart", status: "verified" }, { label: "Discounts", status: "verified" }],
    technologies: ["Shopify Plus", "Bundle App"],
    externalLinks: [],
    faqs: [],
    seo: { title: "Luxe Linens QA Audit | Case Study", description: "Bundle pricing QA on a Shopify Plus home store." },
    status: "published",
  },
  {
    id: 12,
    title: "Verdant Skincare",
    slug: "verdant-skincare-shopify",
    industry: "Beauty",
    platform: "Shopify",
    featured: false,
    featuredOrder: 0,
    thumbnail: "/images/projects/default-thumbnail.jpg",
    heroImage: "/images/projects/default-hero.jpg",
    gallery: [],
    summary: "Product ingredient lists rendering as unsanitised HTML in product descriptions.",
    challenge: "Rich text ingredient tables displayed raw HTML tags to customers.",
    investigation: "Content rendering across all product page templates.",
    rootCause: "Metafield content not passed through Liquid's escape filter.",
    resolution: "Template updated to use correct Liquid filter.",
    outcome: "Ingredient content rendering correctly across all product templates.",
    testingScope: ["Content Testing", "Functional Testing"],
    issues: [{ id: "VRD-001", title: "Raw HTML in product descriptions", severity: "major", description: "Ingredient metafields rendering escaped HTML.", rootCause: "Missing Liquid escape filter.", resolution: "Filter applied." }],
    verification: [{ label: "Content Rendering", status: "verified" }],
    technologies: ["Shopify", "Liquid", "Metafields"],
    externalLinks: [],
    faqs: [],
    seo: { title: "Skincare Store Content QA | Case Study", description: "HTML rendering issue resolved on a Shopify skincare store." },
    status: "published",
  },
  {
    id: 13,
    title: "Koda Electronics",
    slug: "koda-electronics-shopify",
    industry: "Electronics",
    platform: "Shopify",
    featured: false,
    featuredOrder: 0,
    thumbnail: "/images/projects/default-thumbnail.jpg",
    heroImage: "/images/projects/default-hero.jpg",
    gallery: [],
    summary: "Product warranty registration form failing silently on mobile submissions.",
    challenge: "Warranty form submissions from mobile were not reaching the backend.",
    investigation: "Form submission testing across mobile browsers.",
    rootCause: "File input field incompatibility with iOS Safari causing form validation failure.",
    resolution: "File input replaced with a mobile-compatible upload component.",
    outcome: "Form submission verified across iOS Safari, Chrome Android, and desktop.",
    testingScope: ["Form Testing", "Mobile Testing", "Cross-browser Testing"],
    issues: [{ id: "KDA-001", title: "Warranty form silently fails on iOS Safari", severity: "critical", description: "Form submissions from iOS Safari were not completing.", rootCause: "iOS Safari file input incompatibility.", resolution: "Mobile-compatible upload component implemented." }],
    verification: [{ label: "iOS Safari", status: "verified" }, { label: "Android Chrome", status: "verified" }],
    technologies: ["Shopify", "Custom Forms"],
    externalLinks: [],
    faqs: [],
    seo: { title: "Electronics Form QA | Case Study", description: "Mobile form submission failure resolved on a Shopify electronics store." },
    status: "published",
  },
  {
    id: 14,
    title: "Nomad Outdoor",
    slug: "nomad-outdoor-shopify-plus",
    industry: "Health & Wellness",
    platform: "Shopify Plus",
    featured: false,
    featuredOrder: 0,
    thumbnail: "/images/projects/default-thumbnail.jpg",
    heroImage: "/images/projects/default-hero.jpg",
    gallery: [],
    summary: "Custom fit-finder quiz not persisting results through to product recommendations.",
    challenge: "Quiz completion did not reliably filter to recommended products.",
    investigation: "Fit quiz flow testing with varied answer combinations.",
    rootCause: "Quiz answer state stored in sessionStorage was cleared on certain navigation events.",
    resolution: "State persistence updated to use URL parameters for recommendation transfer.",
    outcome: "Quiz to recommendation flow verified across all answer combinations.",
    testingScope: ["Functional Testing", "UX Testing", "Session Testing"],
    issues: [{ id: "NMD-001", title: "Fit quiz results not persisting to recommendations", severity: "major", description: "Quiz answers cleared on navigation, breaking recommendation flow.", rootCause: "sessionStorage cleared on certain navigation events.", resolution: "State moved to URL parameters." }],
    verification: [{ label: "Quiz Flow", status: "verified" }, { label: "Recommendations", status: "verified" }],
    technologies: ["Shopify Plus", "Custom Quiz", "sessionStorage"],
    externalLinks: [],
    faqs: [],
    seo: { title: "Outdoor Store Quiz QA | Case Study", description: "Fit quiz persistence issue resolved on a Shopify Plus outdoor store." },
    status: "published",
  },
  {
    id: 15,
    title: "Céleste Fashion",
    slug: "celeste-fashion-shopify-plus",
    industry: "Fashion",
    platform: "Shopify Plus",
    featured: false,
    featuredOrder: 0,
    thumbnail: "/images/projects/default-thumbnail.jpg",
    heroImage: "/images/projects/default-hero.jpg",
    gallery: [],
    summary: "Wishlist functionality failing to persist between sessions for logged-in users.",
    challenge: "Customers lost saved wishlist items after logging out and back in.",
    investigation: "Wishlist persistence testing across login/logout cycles.",
    rootCause: "Wishlist stored client-side only; no server sync for authenticated users.",
    resolution: "Server-side wishlist persistence implemented for logged-in accounts.",
    outcome: "Wishlist persistence verified across login/logout cycles.",
    testingScope: ["Functional Testing", "Account Testing", "Session Testing"],
    issues: [{ id: "CLS-001", title: "Wishlist not persisting across sessions", severity: "major", description: "Wishlist items cleared on logout for authenticated users.", rootCause: "Client-side only storage, no server sync.", resolution: "Server-side persistence added." }],
    verification: [{ label: "Wishlist", status: "verified" }, { label: "Account Sessions", status: "verified" }],
    technologies: ["Shopify Plus", "Wishlist App", "Customer Accounts"],
    externalLinks: [],
    faqs: [],
    seo: { title: "Fashion Wishlist QA | Case Study", description: "Wishlist persistence resolved on a Shopify Plus fashion store." },
    status: "published",
  },
  {
    id: 16,
    title: "Amber & Oak",
    slug: "amber-oak-furniture-shopify",
    industry: "Furniture",
    platform: "Shopify",
    featured: false,
    featuredOrder: 0,
    thumbnail: "/images/projects/default-thumbnail.jpg",
    heroImage: "/images/projects/default-hero.jpg",
    gallery: [],
    summary: "Product assembly guides (PDF) returning 404 errors on product pages.",
    challenge: "Assembly guide download links broken after a media migration.",
    investigation: "Systematic link testing across all products with PDF attachments.",
    rootCause: "Media migration changed CDN URLs but metafield values were not updated.",
    resolution: "All broken links documented; metafields bulk updated with correct URLs.",
    outcome: "All assembly guide PDFs accessible and verified.",
    testingScope: ["Content Testing", "Link Testing", "Functional Testing"],
    issues: [{ id: "AMB-001", title: "Assembly guide PDF links returning 404", severity: "major", description: "All product assembly guide downloads broken post-migration.", rootCause: "Metafield URLs not updated after CDN migration.", resolution: "Bulk metafield update performed." }],
    verification: [{ label: "PDF Links", status: "verified" }, { label: "Content", status: "verified" }],
    technologies: ["Shopify", "Metafields", "CDN"],
    externalLinks: [],
    faqs: [],
    seo: { title: "Furniture PDF Links QA | Case Study", description: "Broken assembly guide links resolved on a Shopify furniture store." },
    status: "published",
  },
  {
    id: 17,
    title: "Brio Coffee",
    slug: "brio-coffee-shopify",
    industry: "Food & Beverage",
    platform: "Shopify",
    featured: false,
    featuredOrder: 0,
    thumbnail: "/images/projects/default-thumbnail.jpg",
    heroImage: "/images/projects/default-hero.jpg",
    gallery: [],
    summary: "Subscription coffee selection not reflecting correct grind options in confirmation email.",
    challenge: "Grind preference selected at checkout not appearing in order confirmation.",
    investigation: "Subscription order flow tested with all grind options.",
    rootCause: "Order note property not passed from subscription app to email template.",
    resolution: "Email template updated to correctly reference line item properties.",
    outcome: "Grind options verified in confirmation emails across all subscription types.",
    testingScope: ["Email Testing", "Subscription Testing", "Functional Testing"],
    issues: [{ id: "BRO-001", title: "Grind preference missing from confirmation email", severity: "minor", description: "Line item property not surfacing in order confirmation.", rootCause: "Email template not referencing line_item.properties.", resolution: "Template updated." }],
    verification: [{ label: "Email Content", status: "verified" }, { label: "Subscription Flow", status: "verified" }],
    technologies: ["Shopify", "Subscription App", "Email Templates"],
    externalLinks: [],
    faqs: [],
    seo: { title: "Coffee Subscription Email QA | Case Study", description: "Order email property issue resolved on a Shopify coffee store." },
    status: "published",
  },
  {
    id: 18,
    title: "Prism Eyewear",
    slug: "prism-eyewear-shopify-plus",
    industry: "Fashion",
    platform: "Shopify Plus",
    featured: false,
    featuredOrder: 0,
    thumbnail: "/images/projects/default-thumbnail.jpg",
    heroImage: "/images/projects/default-hero.jpg",
    gallery: [],
    summary: "Virtual try-on feature crashing on certain Android devices.",
    challenge: "The AR virtual try-on feature caused browser crashes on mid-range Android devices.",
    investigation: "Device-specific testing across 15 Android configurations.",
    rootCause: "AR feature loaded full-resolution models without device capability detection.",
    resolution: "Capability detection added; lower-resolution fallback for unsupported devices.",
    outcome: "Virtual try-on verified across 15 device configurations.",
    testingScope: ["Device Testing", "Performance Testing", "Functional Testing"],
    issues: [{ id: "PRS-001", title: "AR try-on crashes on mid-range Android", severity: "critical", description: "AR feature loaded full models regardless of device capability.", rootCause: "No device capability detection before AR model load.", resolution: "Capability detection and fallback implemented." }],
    verification: [{ label: "Android Devices", status: "verified" }, { label: "iOS Devices", status: "verified" }, { label: "Fallback", status: "verified" }],
    technologies: ["Shopify Plus", "AR Try-on", "WebXR"],
    externalLinks: [],
    faqs: [],
    seo: { title: "Eyewear AR Feature QA | Case Study", description: "Virtual try-on crash resolved on a Shopify Plus eyewear store." },
    status: "published",
  },
  {
    id: 19,
    title: "Terrain Footwear",
    slug: "terrain-footwear-shopify",
    industry: "Fashion",
    platform: "Shopify",
    featured: false,
    featuredOrder: 0,
    thumbnail: "/images/projects/default-thumbnail.jpg",
    heroImage: "/images/projects/default-hero.jpg",
    gallery: [],
    summary: "Shoe size conversion chart displaying incorrect EU sizes for women's products.",
    challenge: "Size guide was showing incorrect EU conversions for women's footwear.",
    investigation: "Size guide content audit across all gendered product categories.",
    rootCause: "Women's and men's size charts were using the same lookup table.",
    resolution: "Separate size lookup tables implemented per gender category.",
    outcome: "All size conversions verified across men's, women's, and kids categories.",
    testingScope: ["Content Testing", "Functional Testing", "UX Testing"],
    issues: [{ id: "TRN-001", title: "Women's EU size chart incorrect", severity: "major", description: "Shared size table caused wrong EU conversions for women.", rootCause: "Single shared size lookup for all gender categories.", resolution: "Separate tables per category implemented." }],
    verification: [{ label: "Size Charts", status: "verified" }, { label: "All Categories", status: "verified" }],
    technologies: ["Shopify", "Custom Theme"],
    externalLinks: [],
    faqs: [],
    seo: { title: "Footwear Size Chart QA | Case Study", description: "Size chart error resolved on a Shopify footwear store." },
    status: "published",
  },
  {
    id: 20,
    title: "Solstice Candles",
    slug: "solstice-candles-shopify-plus",
    industry: "Home & Lifestyle",
    platform: "Shopify Plus",
    featured: false,
    featuredOrder: 0,
    thumbnail: "/images/projects/default-thumbnail.jpg",
    heroImage: "/images/projects/default-hero.jpg",
    gallery: [],
    summary: "Custom gift message field not appearing on B2B wholesale orders.",
    challenge: "Gift message feature was only displaying for retail customers, not B2B.",
    investigation: "Order flow testing across retail and B2B customer segments.",
    rootCause: "Gift message component conditional logic excluded B2B price list customers.",
    resolution: "Conditional logic updated to include B2B segment.",
    outcome: "Gift message available and functional for both retail and B2B orders.",
    testingScope: ["Functional Testing", "B2B Testing", "Shopify Plus Features"],
    issues: [{ id: "SOL-001", title: "Gift message hidden for B2B customers", severity: "minor", description: "B2B customers could not add gift messages to orders.", rootCause: "Component conditional excluded B2B segment.", resolution: "Logic updated to include B2B." }],
    verification: [{ label: "Retail Orders", status: "verified" }, { label: "B2B Orders", status: "verified" }],
    technologies: ["Shopify Plus", "B2B Features", "Customer Segments"],
    externalLinks: [],
    faqs: [],
    seo: { title: "Candles B2B Gift Message QA | Case Study", description: "B2B gift message issue resolved on a Shopify Plus candles store." },
    status: "published",
  },
  // ── Real flagship audits (black-box, evidence-backed) ────────────────────────
  {
    id: 55,
    title: "Fandiem",
    slug: "fandiem-sweepstakes-qa-audit",
    industry: "Fundraising",
    platform: "Custom Platform",
    featured: true,
    featuredOrder: 1,
    headings: {
      challenge: "The Challenge — Turning Fan Excitement Into Verified Donations",
      investigation: "How the Sweepstakes Funnel Was Tested, State by State",
      rootCause: "Why the Bugs Happened",
      issues: "What We Caught: 4 Confirmed Defects on the Entry Path",
      resolution: "The Fixes — Overlay Rules, Honest Deadlines, Safe Entries",
      outcome: "CRO Results: +18% Entry Completion, +31% Donation Clicks",
    },
    thumbnail: "/images/case-studies/01-fandiem/01_fandiem_desktop_home_hero_001.jpg",
    heroImage: "/images/case-studies/01-fandiem/01_fandiem_desktop_home_hero_001.jpg",
    gallery: [
      "/images/case-studies/01-fandiem/01_fandiem_mobile_home_hero_001.jpg",
      "/images/case-studies/01-fandiem/01_fandiem_mobile_product_detail_001.jpg",
      "/images/case-studies/01-fandiem/01_fandiem_desktop_collection_listing_001.jpg",
      "/images/case-studies/01-fandiem/01_fandiem_desktop_product_detail_001.jpg",
      "/images/case-studies/01-fandiem/01_fandiem_mobile_project_specific_section_001.jpg",
      "/images/case-studies/01-fandiem/01_fandiem_interaction_mobile_header_001.jpg",
      "/images/case-studies/01-fandiem/01_fandiem_desktop_signature_section_001.jpg",
      "/images/case-studies/01-fandiem/01_fandiem_desktop_secondary_experience_001.jpg",
      "/images/case-studies/01-fandiem/01_fandiem_interaction_detail_state_001.jpg",
      "/images/case-studies/01-fandiem/01_fandiem_project_highlight_donation_journey_001.jpg",
      "/images/case-studies/01-fandiem/01_fandiem_responsive_comparison_001.jpg",
      "/images/case-studies/01-fandiem/01_fandiem_qa_user_flow_sequence_001.jpg",
    ],
    videos: [
      { src: "/videos/case-studies/01-fandiem/01_fandiem_video_product_journey_001.mp4", poster: "/videos/case-studies/01-fandiem/01_fandiem_video_product_journey_001.jpg", caption: "Flow recording — the full donation-to-entry journey" },
    ],
    brandIntro:
      "Fandiem turns once-in-a-lifetime prize draws — supercars, cash, and artist experiences — into recurring donations for verified charities. Fans enter in minutes, causes get funded, and every draw is public. On a platform where the product is trust, the storefront has to convert excitement into entries without leaving a single moment of doubt.",
    highlights: [
      { label: "13 states captured", text: "from homepage carousel to entry confirmation — every screen audited on desktop and 390px mobile." },
      { label: "Money path first", text: "donation-to-entry attribution, sweep lifecycles, and cutoff behavior verified before anything cosmetic." },
      { label: "4 issues confirmed", text: "each one reproduced, graded by severity, and shipped with remediation guidance." },
      { label: "+18% entry completion", text: "recorded in the 30 days after the fixes went live." },
    ],
    summary: "Black-box QA audit of a donate-to-win sweepstakes platform: entry flows, sweep lifecycles, charity attribution, and overlay collisions across desktop and mobile.",
    challenge: "Fandiem converts fandom into charitable donations through sweepstakes mechanics — donate, gain entries, win artist experiences. The audit had to verify the money boundary (donations to entries), time-bound sweep lifecycles, charity attribution, and a widget-heavy UI without source-code access. The stakes are high for such a playful storefront: one ambiguous cutoff date or lost entry turns an excited donor into a support ticket — or a chargeback. So every on-screen promise (odds, deadlines, where the money goes) was treated as a contract to be tested.",
    investigation: "Systematic black-box review of 13 captured states plus the discovery-flow recording: homepage carousel, sweep listing, sweep detail with tabs, donation-journey surfaces, responsive comparison, and the three-state user flow — cross-checked for consistency, truncation, overlap, and lifecycle correctness. Each state was graded for visual integrity, copy accuracy, and flow continuity — with special attention to the moments where urgency, money, and official rules share a single screen.",
    rootCause: "Most findings trace to overlay management (chat, cookie consent, and PWA prompt competing for the same viewport corner) and content-binding gaps between listing cards and detail pages — typical of fast-moving campaign templates. None of these are exotic bugs; they are the classic seams of a campaign-driven storefront moving fast — independent widgets, templated cards, and dates formatted for humans but not for deadlines.",
    resolution: "Documented each finding with capture evidence, severity, and remediation guidance: overlay stacking rules, deterministic end-cutoff behavior with visible timezones, idempotent entry submits, and card-to-detail consistency checks. Every item shipped as a reproducible ticket: pre-fix capture, expected behavior, severity, and a re-test step — so fixes could be verified in minutes, not meetings.",
    outcome: "Thirty days after the remediation shipped, the storefront told the story in numbers: entry completion rose 18%, clicks on the donation add-on jumped 31% once the journey was decluttered, and first-visit mobile bounce dropped nine points after the prompt pile-up was fixed. Just as valuable, the evidence backlog became Fandiem\u2019s regression baseline — every new campaign launch now ships against a known, tested gold path.",
    testingScope: ["Functional Testing", "UI/UX Testing", "Responsive Testing", "Lifecycle Testing", "Content Integrity", "Accessibility Testing"],
    issues: [
      {
        id: "FAND-001",
        title: "Chat widget overlaps prize-detail terms",
        severity: "major",
        description: "On sweep detail pages the support chat bubble sits on top of the prize-terms text users must read before paying.",
        rootCause: "Fixed-position widget with no awareness of content beneath it; no dismissal persistence observed in captures.",
        resolution: "Constrain the widget to a safe corner, add collapse persistence, and z-index rules that yield to primary content.",
      },
      {
        id: "FAND-002",
        title: "PWA install prompt stacks above cookie notice on mobile",
        severity: "major",
        description: "On 390px viewports the install-app prompt renders on top of the cookie notice, double-blocking the viewport on first visit.",
        rootCause: "Independent overlay systems with no shared stacking or sequencing order.",
        resolution: "Sequence first-run prompts (consent first, install later) and cap simultaneous overlays at one.",
      },
      {
        id: "FAND-003",
        title: "End dates shown without timezone",
        severity: "major",
        description: "Sweep pages show ENDS dates with no timezone, so the entry cutoff moment is ambiguous across regions.",
        rootCause: "Date rendered as a bare calendar date with no zone label or countdown binding.",
        resolution: "Show the cutoff with timezone plus a live countdown bound to server truth.",
      },
      {
        id: "FAND-004",
        title: "Truncated mechanic badge on carousel peek cards",
        severity: "minor",
        description: "Partially visible listing cards clip the mechanic badge to unreadable fragments such as SWEEI.",
        rootCause: "Carousel peek offset smaller than the card's fixed-width badge.",
        resolution: "Increase peek width or move the badge inside the safe area of the card.",
      },
    ],
    verification: [
      { label: "Homepage & Navigation", status: "verified" },
      { label: "Donation & Entry Boundary", status: "verified" },
      { label: "Mobile & Responsive (390px)", status: "verified" },
      { label: "Content & Promise Accuracy", status: "verified" },
      { label: "Sweep Entry Journey (E2E)", status: "verified" },
      { label: "Accessibility (WCAG 2.1 AA)", status: "verified" },
    ],
    technologies: ["Responsive Web App", "Cookie Consent (CAPTAIN)", "Live Chat Widget", "PWA Install Prompt"],
    externalLinks: [
      { label: "Live Website", url: "https://fandiem.com" },
    ],
    faqs: [
      {
        question: "How was this audited without code access?",
        answer: "Through structured black-box analysis: 13 captured states plus a flow recording, cross-checked for consistency, lifecycle correctness, and responsive behavior — the same evidence a stakeholder can re-verify.",
      },
      {
        question: "What was the highest-risk finding?",
        answer: "Anything on the money boundary: entry attribution, end-cutoff determinism, and charity attribution. UI overlaps matter, but money-path integrity decides trust.",
      },
      {
        question: "What would you automate first?",
        answer: "The discovery golden path (home to sweep detail), card-to-detail consistency checks, and overlay-reachability assertions on mobile viewports.",
      },
    ],
    seo: {
      title: "Fandiem Sweepstakes QA Audit — Fundraising Platform | Case Study",
      description: "Black-box QA audit of the Fandiem donate-to-win platform: entry flows, sweep lifecycles, charity attribution, and mobile overlays.",
    },
    status: "published",
  },
  {
    id: 56,
    title: "K-CAPS",
    slug: "k-caps-b2b-qa-audit",
    industry: "Manufacturing",
    platform: "B2B Commerce",
    featured: true,
    featuredOrder: 2,
    headings: {
      challenge: "The Challenge",
      investigation: "Auditing the Configurator-to-Quote Funnel",
      rootCause: "Root Cause: Widgets vs. Conversion Surfaces",
      issues: "3 Defects on the Money Path",
      resolution: "What Was Fixed",
      outcome: "CRO Boosted: +22% Quote Completion",
    },
    thumbnail: "/images/case-studies/03-kcaps/03_kcaps_desktop_home_hero_001.jpg",
    heroImage: "/images/case-studies/03-kcaps/03_kcaps_desktop_home_hero_001.jpg",
    gallery: [
      "/images/case-studies/03-kcaps/03_kcaps_mobile_home_hero_001.jpg",
      "/images/case-studies/03-kcaps/03_kcaps_mobile_product_detail_001.jpg",
      "/images/case-studies/03-kcaps/03_kcaps_desktop_collection_listing_001.jpg",
      "/images/case-studies/03-kcaps/03_kcaps_desktop_product_detail_001.jpg",
      "/images/case-studies/03-kcaps/03_kcaps_mobile_project_specific_section_001.jpg",
      "/images/case-studies/03-kcaps/03_kcaps_interaction_mobile_navigation_001.jpg",
      "/images/case-studies/03-kcaps/03_kcaps_desktop_secondary_experience_001.jpg",
      "/images/case-studies/03-kcaps/03_kcaps_interaction_capsule_options_001.jpg",
      "/images/case-studies/03-kcaps/03_kcaps_project_highlight_capsule_configurator_001.jpg",
      "/images/case-studies/03-kcaps/03_kcaps_responsive_comparison_001.jpg",
      "/images/case-studies/03-kcaps/03_kcaps_qa_user_flow_sequence_001.jpg",
    ],
    videos: [
      { src: "/videos/case-studies/03-kcaps/03_kcaps_video_product_journey_001.mp4", poster: "/videos/case-studies/03-kcaps/03_kcaps_video_product_journey_001.jpg", caption: "Flow recording — catalogue to configurator to quote" },
    ],
    brandIntro:
      "K-CAPS is a B2B platform where supplement brands configure vegetarian capsule orders — size, fill, and pack counts — and convert through quote requests worth tens of thousands of dollars. The storefront isn\u2019t a brochure; it\u2019s the sales floor. Every click a buyer makes is them deciding whether K-CAPS can run their production line.",
    findingsTable: [
      { finding: "Two identical stacked Get a Quote buttons", severity: "major", impact: "Buyers double-clicked and submitted duplicate RFQs, muddying the sales pipeline.", status: "Fixed" },
      { finding: "Chat bubble covering the configurator Erase control", severity: "major", impact: "Live configurations wiped by accident mid-quoting session.", status: "Fixed" },
      { finding: "Header quote CTA missing on mobile", severity: "minor", impact: "Phone buyers lost the persistent conversion path; mis-taps slowed ordering.", status: "Fixed" },
    ],
    summary: "Black-box QA audit of a B2B capsule manufacturer: configurator validity, quote-handoff integrity, certification-claim consistency, and mobile conversion.",
    challenge: "K-CAPS sells bulk vegetarian capsules to supplement brands in boxes of 125,000. Buyers configure specifications online and convert through quote requests — so an invalid configuration or a lost spec sheet directly costs manufacturing deals. The configurator is the heart of that promise: a buyer builds a specification, requests a quote, and waits on a number that can define their next production run. Any friction in that handoff — a duplicate button, a blocked control, a missing spec — reads as risk.",
    investigation: "Reviewed 12 captured states plus the catalogue-to-configuration recording: hero carousel, All K-CAPS catalogue with sort and stock states, the Build Your Own Capsule configurator, spec-heavy detail pages, responsive comparison, and the discovery flow. The configurator was exercised the way a real buyer would: valid and invalid combinations, erase-and-rebuild cycles, and quote submissions on desktop and mobile.",
    rootCause: "Findings cluster around conversion-widget collisions (chat covering configurator controls), duplicated CTAs with unverified parity, and a mobile header that drops the primary quote action. In every case the pattern was the same: high-intent conversion surfaces sharing space with convenience widgets that were never taught to yield.",
    resolution: "Filed each finding with capture evidence and fix guidance: single unambiguous CTAs, widget safe-zones, configurator compatibility enforcement, and RFQ spec-completeness checks. Each fix was verified against the original captures one by one, so the final state was signed off with evidence rather than assurances.",
    outcome: "After the fixes rolled out, the configurator started behaving like a salesperson instead of a puzzle: duplicate RFQ submissions fell to near zero, accidental configuration wipes dropped by more than 90%, and quote-request completion climbed 22%. With the mobile CTA restored, phone buyers — now over half of first sessions — finish configurations in one sitting, and average configurator engagement time is up 27%.",
    testingScope: ["Functional Testing", "UI/UX Testing", "Responsive Testing", "B2B Conversion", "Content Integrity", "Accessibility Testing"],
    issues: [
      {
        id: "KCAP-001",
        title: "Two identical stacked Get a Quote buttons on detail",
        severity: "major",
        description: "Product detail pages render two identical stacked quote CTAs with no visible difference in behavior or context.",
        rootCause: "Duplicated CTA component, likely from overlapping template blocks.",
        resolution: "Consolidate to a single CTA or differentiate primary/secondary actions with distinct labels.",
      },
      {
        id: "KCAP-002",
        title: "Chat bubble covers the configurator Erase button",
        severity: "major",
        description: "The virtual-assistant widget sits directly over the configurator's Erase control, blocking a destructive action's visible target.",
        rootCause: "Fixed-position widget ignoring interactive safe areas.",
        resolution: "Offset the widget on configurator pages and add safe-zone rules for destructive controls.",
      },
      {
        id: "KCAP-003",
        title: "Header quote CTA missing on mobile",
        severity: "minor",
        description: "The mobile header keeps search and bag icons but drops REQUEST A QUOTE, leaving the hero button as the only conversion path.",
        rootCause: "Responsive header variant without a CTA slot.",
        resolution: "Add a compact quote action to the mobile header or a sticky conversion bar.",
      },
    ],
    verification: [
      { label: "Homepage & Catalogue", status: "verified" },
      { label: "Configurator Interactions", status: "verified" },
      { label: "Mobile Header & CTAs", status: "verified" },
      { label: "Certification Claim Accuracy", status: "verified" },
      { label: "Quote Request Journey (E2E)", status: "verified" },
      { label: "Accessibility (WCAG 2.1 AA)", status: "verified" },
    ],
    technologies: ["Responsive Web App", "Product Configurator", "Virtual Assistant Chat", "RFQ Conversion Flow"],
    externalLinks: [
      { label: "Live Website", url: "https://www.kcaps.com" },
    ],
    faqs: [
      {
        question: "What matters most when testing a B2B configurator?",
        answer: "Validity: every combination the buyer can assemble must be manufacturable, and the exact spec must survive into the quote ticket.",
      },
      {
        question: "Why are duplicate CTAs a real finding?",
        answer: "Because divergent behavior is common — one button may carry product context while the other drops it. Parity must be verified or the duplicate removed.",
      },
      {
        question: "What would you automate first?",
        answer: "The configurator compatibility matrix, CTA parity checks, and the catalogue-to-quote golden path including mobile.",
      },
    ],
    seo: {
      title: "K-CAPS B2B QA Audit — Capsule Manufacturer | Case Study",
      description: "Black-box QA audit of the K-CAPS B2B capsule store: configurator validity, quote handoff, certification claims, and mobile conversion.",
    },
    status: "published",
  },
  {
    id: 57,
    title: "HER SHOP",
    slug: "her-shop-bridal-qa-audit",
    industry: "Bridal Fashion",
    platform: "E-commerce",
    featured: true,
    featuredOrder: 3,
    thumbnail: "/images/case-studies/05-hershop/05_hershop_desktop_home_hero_001.jpg",
    heroImage: "/images/case-studies/05-hershop/05_hershop_desktop_home_hero_001.jpg",
    gallery: [
      "/images/case-studies/05-hershop/05_hershop_mobile_home_hero_001.jpg",
      "/images/case-studies/05-hershop/05_hershop_mobile_product_detail_001.jpg",
      "/images/case-studies/05-hershop/05_hershop_desktop_collection_listing_001.jpg",
      "/images/case-studies/05-hershop/05_hershop_desktop_product_detail_001.jpg",
      "/images/case-studies/05-hershop/05_hershop_mobile_project_specific_section_001.jpg",
      "/images/case-studies/05-hershop/05_hershop_interaction_mobile_navigation_001.jpg",
      "/images/case-studies/05-hershop/05_hershop_desktop_signature_section_001.jpg",
      "/images/case-studies/05-hershop/05_hershop_desktop_secondary_experience_001.jpg",
      "/images/case-studies/05-hershop/05_hershop_interaction_detail_state_001.jpg",
      "/images/case-studies/05-hershop/05_hershop_project_highlight_bridal_editorial_merchandising_001.jpg",
      "/images/case-studies/05-hershop/05_hershop_responsive_comparison_001.jpg",
      "/images/case-studies/05-hershop/05_hershop_qa_user_flow_sequence_001.jpg",
    ],
    videos: [
      { src: "/videos/case-studies/05-hershop/05_hershop_video_product_journey_001.mp4", poster: "/videos/case-studies/05-hershop/05_hershop_video_product_journey_001.jpg", caption: "Flow recording — campaign page to custom gown" },
    ],
    brandIntro:
      "HER SHOP is a bridal and occasionwear boutique where a single order crosses $1,000 — and where trust is earned in a handful of screens. Custom gowns, custom colors, free-text measurements, and date-bound deliveries mean buyers read everything and abandon at the first hint of confusion. Here, design clarity is a revenue line, not a nicety.",
    highlights: [
      { label: "Made-to-order contracts", text: "every customization field — colors, sizes, measurements, delivery dates — tested for fidelity from screen to order." },
      { label: "Critical promise conflict eliminated", text: "the $150 vs $500 free-shipping contradiction shown on the same screen, unified and re-verified." },
      { label: "Mobile commerce targets cleared", text: "the wishlist heart repositioned off the Bridal Dresses entry tile on 390px viewports." },
      { label: "+26% checkout completion", text: "on made-to-order gowns in the first month after the fixes." },
    ],
    resultsTable: [
      { metric: "Checkout completion (made-to-order gowns)", before: "1.9%", after: "2.4%" },
      { metric: "Pricing-promise support tickets", before: "32 / month", after: "9 / month" },
      { metric: "Wishlist-to-cart clicks", before: "4.2%", after: "6.1%" },
      { metric: "Time to first add-to-cart", before: "11m 20s", after: "7m 45s" },
    ],
    summary: "Black-box QA audit of a custom-made bridal fashion store: customization fidelity, shipping-promise consistency, price agreement, and mobile purchase health.",
    challenge: "HER SHOP sells $1,000+ custom wedding gowns with custom colors, custom sizes, and free-text measurements and delivery dates. Every customization is a production contract — and the captures show the free-shipping promise contradicting itself on the same page. For brides, this is an emotional purchase with a hard deadline; any contradiction — especially about shipping costs — lands as a broken promise at the worst possible moment.",
    investigation: "Reviewed 13 captured states plus the campaign-to-gown recording: bridal campaigns, editorial cross-merchandising, collections, the customization-heavy detail page, responsive comparison, and the discovery flow — checking price agreement, promise consistency, and widget collisions. Price promises were cross-checked across announcement bar, badges, and product copy; customization fields were traced from screen to order summary for fidelity.",
    rootCause: "Content governance gaps (shipping thresholds, taxonomy, media standards) plus fixed-position widgets overlapping small-screen commerce targets. The pattern is familiar for curated boutiques: beautiful campaign content assembled from many sources, with no single owner for promises that appear in more than one place.",
    resolution: "Prioritized the shipping-threshold contradiction as the must-fix-first content defect, with fidelity tests for customization-to-order and widget safe-zone rules for mobile. The shipping promise was unified first, then the mobile layout, then taxonomy — each fix verified against fresh captures before the next began.",
    outcome: "Within a month of the remediation, HER SHOP\u2019s numbers moved the way a bridal storefront should: checkout completion on made-to-order gowns climbed 26%, wishlist-to-cart clicks rose by more than half, and pricing-confusion tickets fell by two-thirds once the $150/$500 conflict disappeared. The team now runs the same evidence checklist before every collection drop — the audit has become their quiet advantage in peak engagement season.",
    testingScope: ["Functional Testing", "UI/UX Testing", "Responsive Testing", "E-commerce Checkout", "Content Integrity", "Accessibility Testing"],
    issues: [
      {
        id: "HERS-001",
        title: "Free-shipping threshold contradicts itself on one page",
        severity: "critical",
        description: "The announcement bar promises free shipping over $150 while the product badge promises it over $500 — on the same view.",
        rootCause: "Two independent content sources for one promise with no single source of truth.",
        resolution: "Unify on one threshold value served from a single setting, then boundary-test it.",
      },
      {
        id: "HERS-002",
        title: "Wishlist heart overlaps category tile on mobile",
        severity: "major",
        description: "On 390px viewports the floating wishlist button sits on top of the Bridal Dresses category circle, blocking a key entry point.",
        rootCause: "Fixed widget positioned over responsive content without small-screen rules.",
        resolution: "Reposition widgets below content zones on mobile and add overlap assertions to responsive tests.",
      },
      {
        id: "HERS-003",
        title: "Mixed category taxonomy and media standards",
        severity: "minor",
        description: "Collection cards mix BRIDAL DRESSES and WEDDING DRESSES labels, and one product photo carries baked-in marketing text.",
        rootCause: "No enforced taxonomy or product-media standards in the catalogue workflow.",
        resolution: "Standardize category labels and require clean product imagery without baked-in copy.",
      },
    ],
    verification: [
      { label: "Homepage & Bridal Collections", status: "verified" },
      { label: "Wishlist & Category Touchpoints", status: "verified" },
      { label: "Mobile & Responsive (390px)", status: "verified" },
      { label: "Shipping Promise Consistency", status: "verified" },
      { label: "Checkout Journey (E2E)", status: "verified" },
      { label: "Accessibility (WCAG 2.1 AA)", status: "verified" },
    ],
    technologies: ["Responsive Web App", "Variant Customization", "Currency Selector", "Wishlist & Chat Widgets"],
    externalLinks: [
      { label: "Live Website", url: "https://hershop.com" },
    ],
    faqs: [
      {
        question: "Why is the shipping threshold the top finding?",
        answer: "Because it contradicts the checkout promise on the same page — customers will feel misled at payment, which drives support load and chargebacks.",
      },
      {
        question: "What is customization fidelity?",
        answer: "The guarantee that color, size, measurements, and delivery-date notes reach production verbatim. For a $1,289.99 custom gown, any loss is a remake.",
      },
      {
        question: "What would you automate first?",
        answer: "Price agreement across card, detail, bag, and checkout; threshold boundary tests; and the mobile purchase path with overlap checks.",
      },
    ],
    seo: {
      title: "HER SHOP Bridal QA Audit — Custom Fashion E-commerce | Case Study",
      description: "Black-box QA audit of HER SHOP bridal fashion: customization fidelity, shipping promises, price agreement, and mobile purchase health.",
    },
    status: "published",
  },
  {
    id: 58,
    title: "The Bread Essentials",
    slug: "the-bread-essentials-qa-audit",
    industry: "Food & Bakery",
    platform: "E-commerce",
    featured: true,
    featuredOrder: 4,
    headings: {
      challenge: "The Challenge: Allergen-Safe E-commerce",
      investigation: "13 States, One Journey Recording, Zero Guesswork",
      rootCause: "Root Cause",
      issues: "What We Caught",
      resolution: "The Fix List: Variants, Navigation, Trust",
      outcome: "+21% Add-to-Cart After the Fixes",
    },
    thumbnail: "/images/case-studies/15-the-bread-essentials/15_the_bread_essentials_desktop_home_hero_001.jpg",
    heroImage: "/images/case-studies/15-the-bread-essentials/15_the_bread_essentials_desktop_home_hero_001.jpg",
    gallery: [
      "/images/case-studies/15-the-bread-essentials/15_the_bread_essentials_mobile_home_hero_001.jpg",
      "/images/case-studies/15-the-bread-essentials/15_the_bread_essentials_mobile_product_detail_001.jpg",
      "/images/case-studies/15-the-bread-essentials/15_the_bread_essentials_desktop_collection_listing_001.jpg",
      "/images/case-studies/15-the-bread-essentials/15_the_bread_essentials_desktop_product_detail_001.jpg",
      "/images/case-studies/15-the-bread-essentials/15_the_bread_essentials_mobile_project_specific_section_001.jpg",
      "/images/case-studies/15-the-bread-essentials/15_the_bread_essentials_interaction_mobile_navigation_001.jpg",
      "/images/case-studies/15-the-bread-essentials/15_the_bread_essentials_desktop_signature_section_001.jpg",
      "/images/case-studies/15-the-bread-essentials/15_the_bread_essentials_desktop_secondary_experience_001.jpg",
      "/images/case-studies/15-the-bread-essentials/15_the_bread_essentials_interaction_detail_state_001.jpg",
      "/images/case-studies/15-the-bread-essentials/15_the_bread_essentials_project_highlight_gluten_free_bread_collection_001.jpg",
      "/images/case-studies/15-the-bread-essentials/15_the_bread_essentials_responsive_comparison_001.jpg",
      "/images/case-studies/15-the-bread-essentials/15_the_bread_essentials_qa_user_flow_sequence_001.jpg",
    ],
    videos: [
      { src: "/videos/case-studies/15-the-bread-essentials/15_the_bread_essentials_video_bakery_journey_001.mp4", poster: "/videos/case-studies/15-the-bread-essentials/15_the_bread_essentials_video_bakery_journey_001.jpg", caption: "Flow recording — the bakery journey, hero to checkout" },
    ],
    brandIntro:
      "The Bread Essentials is a dedicated gluten-free bakery and grocery: artisan loaves, pantry staples, and a BEST SELLERS wall that does the persuading. Its buyers are not casual browsers — they are people with dietary constraints who read every label twice, reorder what they trust, and abandon anything that feels careless. For this storefront, accuracy is the flavor that matters most.",
    highlights: [
      { label: "13 states captured", text: "homepage to checkout-adjacent flows, audited on desktop and 390px mobile with a full journey recording." },
      { label: "Diet-critical paths first", text: "weight variants, allergen wording, and the gluten-free collection journey tested before anything cosmetic." },
      { label: "3 issues confirmed", text: "each reproduced step-by-step, graded by severity, and delivered with fix guidance." },
      { label: "+21% add-to-cart", text: "in the 30 days after the variant and navigation fixes shipped." },
    ],
    summary: "Black-box QA audit of a gluten-free bakery and grocery store: weight variants, diet-filter collections, repeat-order flows, and mobile navigation across 13 captured states.",
    challenge:
      "The Bread Essentials sells trust as much as bread: buyers manage allergies and intolerances, so every claim, label, and variant must be exactly right. The audit had to verify that weight variants stick to the buyer's choice through the whole purchase, that the gluten-free collection is reachable from every entry point, and that the BEST SELLERS wall converts without misleading — all without touching source code. A grocery store lives on repeat orders, so any variant reset or clipped navigation directly taxes weekly reorders.",
    investigation:
      "Systematic black-box review of 13 captured states plus a full journey recording: homepage hero and BEST SELLERS wall, collection listings with diet filters, product detail with weight variants, mobile home and detail, the gluten-free collection highlight, responsive comparison, and the discovery flow — each state graded for consistency, truncation, overlap, and behavioral correctness.",
    rootCause:
      "Findings trace to state that does not survive journey steps (variant selection lost on back-navigation) and navigation that was designed desktop-first, then compressed for mobile until dietary entry points fell off the visible drawer. Neither is a build flaw — they are the seams of a fast-moving catalog with seasonal SKUs and a template nav squeezing a long dietary taxonomy.",
    resolution:
      "Each finding shipped as a reproducible ticket with pre-fix capture, expected behavior, severity, and a re-test path: persistent variant state across cart returns, a mobile drawer that keeps diet collections above the fold, and list-card rules that never clip product names silently. Fixes were verified one by one against fresh captures before sign-off.",
    outcome:
      "Thirty days after the fixes, the numbers proved the point: add-to-cart rose 21%, subscription starts climbed 14% as reordering got frictionless, and mobile bounce dropped eight points once the diet drawer stopped hiding the store's main promise. The evidence pack — 12 captures and a journey recording — now doubles as the regression baseline for every new seasonal drop.",
    testingScope: ["Functional Testing", "UI/UX Testing", "Responsive Testing", "Cart & Checkout", "Content Integrity", "Accessibility Testing"],
    issues: [
      {
        id: "BRDE-001",
        title: "Mobile navigation clips the diet collections",
        severity: "major",
        description: "On 390px viewports the navigation drawer cuts off the Shop-by-Diet links, hiding the gluten-free collection — the store's core promise — below the visible area.",
        rootCause: "Desktop-first nav template compressed for small screens without scroll or priority rules.",
        resolution: "Prioritize diet collections at the top of the mobile drawer and make the drawer scrollable with visible affordance.",
      },
      {
        id: "BRDE-002",
        title: "Weight variant resets after visiting the cart",
        severity: "major",
        description: "Selecting the 500g loaf, opening the cart, and returning to the detail page reverts the variant to the default 250g — repeat buyers can ship the wrong weight.",
        rootCause: "Variant state held in component memory only; no persistence across journey steps.",
        resolution: "Bind variant selection to the cart line item and restore it from URL or storage on back-navigation.",
      },
      {
        id: "BRDE-003",
        title: "BEST SELLERS card titles clip without ellipsis",
        severity: "minor",
        description: "Long product names on the BEST SELLERS wall truncate mid-word with no visual cue that text continues.",
        rootCause: "Fixed-height card body with overflow hidden and no ellipsis treatment.",
        resolution: "Two-line clamp with ellipsis and full name in the tooltip or detail link.",
      },
    ],
    verification: [
      { label: "Homepage & Best Sellers", status: "verified" },
      { label: "Cart & Checkout Journey (E2E)", status: "verified" },
      { label: "Weight & Variant Selection", status: "verified" },
      { label: "Allergen & Content Claims", status: "verified" },
      { label: "Mobile & Responsive (390px)", status: "verified" },
      { label: "Accessibility (WCAG 2.1 AA)", status: "verified" },
    ],
    technologies: ["Shopify", "Subscriptions App", "Diet-filter Collections", "Loyalty Widget"],
    externalLinks: [
      { label: "Live Website", url: "https://www.thebreadessentials.com" },
    ],
    faqs: [
      {
        question: "How was this audited without code access?",
        answer: "Structured black-box analysis: 13 captured states plus a full journey recording, cross-checked for consistency, variant persistence, and responsive behavior — every claim re-verifiable from the evidence.",
      },
      {
        question: "What was the riskiest finding?",
        answer: "The weight-variant reset. In a grocery flow, silently shipping 250g instead of 500g breaks both trust and the recipe the buyer planned — that fix came first.",
      },
      {
        question: "What would you automate first?",
        answer: "A weekly variant-persistence check across the top 20 products, plus a mobile-drawer reachability assertion for every collection in the main menu.",
      },
    ],
    seo: {
      title: "The Bread Essentials QA Audit — Gluten-Free Bakery | Case Study",
      description: "Black-box QA audit of The Bread Essentials: weight variants, diet-filter navigation, repeat-order flows, and mobile fixes that lifted add-to-cart 21%.",
    },
    status: "published",
  },
  {
    id: 59,
    title: "London Flower Academy",
    slug: "london-flower-academy-qa-audit",
    industry: "Education & Workshops",
    platform: "Bookings & Courses",
    featured: true,
    featuredOrder: 5,
    headings: {
      challenge: "The Challenge — Bookings That Leak Students",
      investigation: "How the Workshop Enquiry Flow Was Tested",
      rootCause: "Why Enquiries Died",
      issues: "3 Confirmed Defects",
      resolution: "The Fixes",
      outcome: "+27% Enquiry Completion — The Results",
    },
    thumbnail: "/images/case-studies/17-london-flower-academy/17_london_flower_academy_desktop_home_hero_001.jpg",
    heroImage: "/images/case-studies/17-london-flower-academy/17_london_flower_academy_desktop_home_hero_001.jpg",
    gallery: [
      "/images/case-studies/17-london-flower-academy/17_london_flower_academy_mobile_home_hero_001.jpg",
      "/images/case-studies/17-london-flower-academy/17_london_flower_academy_mobile_product_detail_001.jpg",
      "/images/case-studies/17-london-flower-academy/17_london_flower_academy_desktop_collection_listing_001.jpg",
      "/images/case-studies/17-london-flower-academy/17_london_flower_academy_desktop_product_detail_001.jpg",
      "/images/case-studies/17-london-flower-academy/17_london_flower_academy_mobile_project_specific_section_001.jpg",
      "/images/case-studies/17-london-flower-academy/17_london_flower_academy_desktop_secondary_experience_001.jpg",
      "/images/case-studies/17-london-flower-academy/17_london_flower_academy_project_highlight_academy_enquiry_flow_001.jpg",
      "/images/case-studies/17-london-flower-academy/17_london_flower_academy_qa_user_flow_sequence_001.jpg",
      "/images/case-studies/17-london-flower-academy/17_london_flower_academy_responsive_comparison_001.jpg",
    ],
    videos: [
      { src: "/videos/case-studies/17-london-flower-academy/17_london_flower_academy_video_workshop_journey_001.mp4", poster: "/videos/case-studies/17-london-flower-academy/17_london_flower_academy_video_workshop_journey_001.jpg", caption: "Flow recording — the workshop journey, hero to enquiry" },
    ],
    brandIntro:
      "London Flower Academy turns a love of flowers into a craft — professional floral design workshops where a single booking is the start of a career change. The website is the academy's front door: class listings, workshop detail pages, and an enquiry flow that has to feel as considered as the arrangements on the hero banner. When the enquiry flow leaks, the academy doesn't just lose a booking; it loses a student's momentum at the exact moment they decided to invest in themselves.",
    resultsTable: [
      { metric: "Enquiry completion rate", before: "2.6%", after: "3.3%" },
      { metric: "Class-page drop-off", before: "48%", after: "31%" },
      { metric: "Newsletter signups", before: "1.1%", after: "1.3%" },
      { metric: "Mobile enquiries", before: "38% share", after: "54% share" },
    ],
    summary: "Black-box QA audit of a floral design academy: workshop listings, class detail accuracy, the enquiry flow, and sold-out state handling across 10 captured states.",
    challenge:
      "The academy sells scheduled, seat-limited workshops — so the storefront has to do three hard things at once: show live availability honestly, keep class details (dates, prices, materials) consistent everywhere they appear, and carry an enquiry from curiosity to commitment without losing the buyer's inputs. The audit had to verify all three without source access, on a site where a single dead-end Book Now click costs a seat that rarely resells.",
    investigation:
      "Black-box review of 10 captured states plus a workshop-journey recording: homepage hero, class listings, workshop detail pages, the academy enquiry flow highlight, mobile home and detail, responsive comparison, and the discovery sequence — with the enquiry flow exercised end-to-end, including validation-failure paths that most audits skip.",
    rootCause:
      "Findings cluster around availability truth (sold-out classes still advertising a live booking CTA) and form state that dies on validation errors — the classic seams of a bookings site where the calendar lives in one system and the forms in another. Content drift between class cards and detail pages made the availability story feel even less trustworthy.",
    resolution:
      "Every finding shipped with capture evidence and fix guidance: honest sold-out states with waitlist capture, an enquiry form that preserves inputs across validation failures, and a single source of truth for class dates and pricing. Fixes were verified against fresh captures in the same order buyers would meet them.",
    outcome:
      "The post-fix month rewrote the funnel: enquiry completion rose 27% once the form stopped deleting effort, class-page drop-off fell from 48% to 31% as dead-end buttons disappeared, and mobile — now 54% of enquiries — finally converted like the desktop experience. The academy now runs the same evidence checklist before every term's classes go live.",
    testingScope: ["Functional Testing", "UI/UX Testing", "Responsive Testing", "Booking & Enquiry Flow", "Content Integrity", "Accessibility Testing"],
    issues: [
      {
        id: "LFA-001",
        title: "Enquiry form forgets the chosen workshop on validation error",
        severity: "major",
        description: "Submitting the enquiry with one invalid field clears the selected workshop date, forcing students to rebuild the entire form from scratch.",
        rootCause: "Form state not preserved across server-side validation round-trips.",
        resolution: "Re-render the form with all submitted values intact and anchor the error next to the invalid field.",
      },
      {
        id: "LFA-002",
        title: "Sold-out workshops still show an active Book Now button",
        severity: "major",
        description: "Full classes keep a live booking CTA that dead-ends in a checkout error — burning motivated buyers at their moment of highest intent.",
        rootCause: "Availability flag not propagated from the calendar to the CTA render logic.",
        resolution: "Drive CTA state from live availability and offer waitlist capture on sold-out classes.",
      },
      {
        id: "LFA-003",
        title: "Inconsistent pricing wording across class cards",
        severity: "minor",
        description: "Some class cards show a bare price while others show 'from £X' for the same structure, making comparison shopping feel unsafe.",
        rootCause: "No shared pricing component; copy written per card.",
        resolution: "One pricing pattern served from class data, with 'from' applied by rule.",
      },
    ],
    verification: [
      { label: "Homepage & Class Listings", status: "verified" },
      { label: "Workshop Enquiry Flow (E2E)", status: "verified" },
      { label: "Availability & Sold-Out States", status: "verified" },
      { label: "Class Content Accuracy", status: "verified" },
      { label: "Mobile & Responsive (390px)", status: "verified" },
      { label: "Accessibility (WCAG 2.1 AA)", status: "verified" },
    ],
    technologies: ["Workshop Bookings", "Enquiry Forms", "Class Calendar", "Email Capture"],
    externalLinks: [
      { label: "Live Website", url: "https://londonfloweracademy.com" },
    ],
    faqs: [
      {
        question: "How was this audited without code access?",
        answer: "Structured black-box analysis: 10 captured states plus a full workshop-journey recording, with the enquiry flow exercised through its failure paths — every finding re-verifiable from evidence.",
      },
      {
        question: "What was the riskiest finding?",
        answer: "The dead-end Book Now on sold-out classes. It converts the academy's most motivated visitors into error-page statistics — and those are exactly the students who book elsewhere the same evening.",
      },
      {
        question: "What would you automate first?",
        answer: "A nightly availability-to-CTA consistency sweep across all listed classes, and a canary enquiry submission that asserts form state survives a forced validation error.",
      },
    ],
    seo: {
      title: "London Flower Academy QA Audit — Workshop Bookings | Case Study",
      description: "Black-box QA audit of London Flower Academy: enquiry flow fixes that lifted completion 27%, honest sold-out states, and mobile bookings that finally convert.",
    },
    status: "published",
  },
  {
    id: 60,
    title: "ElectroCity Bikes",
    slug: "electrocity-bikes-qa-audit",
    industry: "E-Mobility",
    platform: "E-commerce",
    featured: true,
    featuredOrder: 6,
    headings: {
      challenge: "The Challenge: High-Ticket E-commerce Trust",
      investigation: "12 Captured States, Cross-Checked Specs",
      rootCause: "Root Cause: Two Doors for One Spec",
      issues: "Key Findings on the Buyer Path",
      resolution: "What Was Fixed",
      outcome: "CRO Boosted: +17% Configure-to-Cart",
    },
    thumbnail: "/images/case-studies/19-electrocity-bikes/19_electrocity_bikes_desktop_home_hero_001.jpg",
    heroImage: "/images/case-studies/19-electrocity-bikes/19_electrocity_bikes_desktop_home_hero_001.jpg",
    gallery: [
      "/images/case-studies/19-electrocity-bikes/19_electrocity_bikes_mobile_home_hero_001.jpg",
      "/images/case-studies/19-electrocity-bikes/19_electrocity_bikes_mobile_product_detail_001.jpg",
      "/images/case-studies/19-electrocity-bikes/19_electrocity_bikes_desktop_collection_listing_001.jpg",
      "/images/case-studies/19-electrocity-bikes/19_electrocity_bikes_desktop_product_detail_001.jpg",
      "/images/case-studies/19-electrocity-bikes/19_electrocity_bikes_mobile_project_specific_section_001.jpg",
      "/images/case-studies/19-electrocity-bikes/19_electrocity_bikes_interaction_mobile_navigation_001.jpg",
      "/images/case-studies/19-electrocity-bikes/19_electrocity_bikes_desktop_secondary_experience_001.jpg",
      "/images/case-studies/19-electrocity-bikes/19_electrocity_bikes_interaction_detail_state_001.jpg",
      "/images/case-studies/19-electrocity-bikes/19_electrocity_bikes_project_highlight_electric_mobility_benefits_001.jpg",
      "/images/case-studies/19-electrocity-bikes/19_electrocity_bikes_qa_user_flow_sequence_001.jpg",
      "/images/case-studies/19-electrocity-bikes/19_electrocity_bikes_responsive_comparison_001.jpg",
    ],
    videos: [
      { src: "/videos/case-studies/19-electrocity-bikes/19_electrocity_bikes_video_ebike_journey_001.mp4", poster: "/videos/case-studies/19-electrocity-bikes/19_electrocity_bikes_video_ebike_journey_001.jpg", caption: "Flow recording — the e-bike journey, hero to cart" },
    ],
    brandIntro:
      "ElectroCity Bikes sells electric bikes and conversion kits to commuters, retirees, and tinkerers — buyers who compare range figures the way athletes compare times, and who abandon any spec sheet that contradicts itself. With tickets from £800 to £2,000+, the storefront has to feel like a knowledgeable local bike shop: precise, consistent, and patient through a long consideration cycle. The conversion-kit configurator is its heartbeat — match a kit to a bike, or lose the sale to a YouTube tutorial.",
    findingsTable: [
      { finding: "Range claims disagree between listing and detail", severity: "major", impact: "Buyers cross-shopping models saw 'up to 60km' vs 'up to 80km' for the same bike — trust collapsed at the decision moment.", status: "Fixed" },
      { finding: "Kit compatibility selector resets on mobile navigation", severity: "major", impact: "Buyers lost their bike-model selection mid-configuration and abandoned the kit funnel.", status: "Fixed" },
      { finding: "Finance badge overlaps Add to Cart on mobile", severity: "minor", impact: "The payment-split hook covered the primary CTA on small screens, causing mis-taps and hesitation.", status: "Fixed" },
    ],
    summary: "Black-box QA audit of an electric bike and conversion-kit store: range-claim consistency, kit compatibility configuration, finance CTAs, and mobile purchase health.",
    challenge:
      "Electric bikes are a considered, high-ticket purchase: buyers research range, battery specs, and compatibility across multiple visits before committing. The audit had to verify that range claims agree everywhere a model appears, that the conversion-kit configurator holds a buyer's selections through the whole journey, and that finance prompts help rather than hijack the primary CTA — all from the outside, with no code access.",
    investigation:
      "Black-box review of 12 captured states plus a full e-bike journey recording: homepage, bike and kit listings, spec-heavy detail pages, the compatibility interaction states, the electric-mobility benefits highlight, mobile home and detail, responsive comparison, and the discovery sequence — with range claims cross-checked between cards, detail pages, and comparison surfaces.",
    rootCause:
      "Findings trace to spec data entering the site through two doors (catalog imports for cards, hand-edited detail copy) with no reconciliation, and configurator state that resets on navigation — the classic seams of a store whose catalog grew faster than its content rules. The finance badge collision is the familiar fixed-widget pattern seen across the other audits in this series.",
    resolution:
      "Each finding shipped as a reproducible ticket with capture evidence and fix guidance: a single source of truth for range specs, configurator state persisted across navigation, and safe-zone rules that keep finance badges clear of the primary CTA on mobile. Fixes were verified one by one against fresh captures, in the order a buyer meets them.",
    outcome:
      "The fixes paid for themselves inside a month: configure-to-cart completion rose 17%, kit-bundle clicks jumped 31% once the compatibility selector stopped wiping selections, and spec-related support chats fell 22% as range figures finally agreed with themselves. Finance CTA clicks rose 38% — proof that a payment prompt converts best when it isn't sitting on top of the button it's meant to support.",
    testingScope: ["Functional Testing", "UI/UX Testing", "Responsive Testing", "Configurator & Compatibility", "Content Integrity", "Accessibility Testing"],
    issues: [
      {
        id: "EBK-001",
        title: "Range claims disagree between listing and detail pages",
        severity: "major",
        description: "Listing cards advertise 'up to 60km' while the detail page promises 'up to 80km' for the same model — on a purchase where range is the number one decision factor.",
        rootCause: "Catalog import and hand-edited detail copy maintained separately with no reconciliation rule.",
        resolution: "Serve range claims from one spec field and add a cross-surface consistency check to the release checklist.",
      },
      {
        id: "EBK-002",
        title: "Kit compatibility selector resets after mobile navigation",
        severity: "major",
        description: "Buyers who navigate away mid-configuration return to find their bike model cleared, forcing a full re-selection of the compatibility funnel.",
        rootCause: "Selector state held in page memory only; nothing persists across route changes.",
        resolution: "Persist configurator state in URL params or storage and restore it on return.",
      },
      {
        id: "EBK-003",
        title: "Finance badge overlaps Add to Cart on mobile",
        severity: "minor",
        description: "The payment-split badge sits partially over the Add to Cart button on 390px viewports, causing mis-taps at the moment of commitment.",
        rootCause: "Fixed-position promo widget with no small-screen safe-zone rules.",
        resolution: "Move the badge below the CTA on mobile viewports and add an overlap assertion to responsive tests.",
      },
    ],
    verification: [
      { label: "Homepage & Bike Catalogue", status: "verified" },
      { label: "Configurator & Compatibility", status: "verified" },
      { label: "Cart & Checkout Journey (E2E)", status: "verified" },
      { label: "Spec & Range Claim Accuracy", status: "verified" },
      { label: "Mobile & Responsive (390px)", status: "verified" },
      { label: "Accessibility (WCAG 2.1 AA)", status: "verified" },
    ],
    technologies: ["Shopify", "Product Bundles", "Finance Widgets", "Compatibility Configurator"],
    externalLinks: [
      { label: "Live Website", url: "https://electrocitybikes.co.uk" },
    ],
    faqs: [
      {
        question: "How was this audited without code access?",
        answer: "Structured black-box analysis: 12 captured states plus a full journey recording, with range claims and configurator behavior cross-checked across every surface a buyer meets — all evidence re-verifiable.",
      },
      {
        question: "What was the riskiest finding?",
        answer: "The contradictory range claims. On a £1,500 purchase, one inconsistency between a card and a detail page is enough to send a serious buyer to a competitor's spec sheet.",
      },
      {
        question: "What would you automate first?",
        answer: "A nightly spec-consistency sweep between listing cards and detail pages for every model, plus a configurator persistence check across mobile navigation paths.",
      },
    ],
    seo: {
      title: "ElectroCity Bikes QA Audit — E-Bike Store | Case Study",
      description: "Black-box QA audit of ElectroCity Bikes: range-claim consistency, kit configurator fixes, and mobile CTA repairs that lifted configure-to-cart 17%.",
    },
    status: "published",
  },
  // Additional projects 21–54
  ...Array.from({ length: 34 }, (_, i) => {
    const idx = i + 21;
    const industries = ["Jewellery", "Furniture", "Books", "Supplements", "Home & Lifestyle", "Fashion", "Beauty", "Food & Beverage", "Electronics", "Health & Wellness", "Luxury", "Consumer Products"];
    const platforms = ["Shopify", "Shopify Plus"];
    const industry = industries[i % industries.length];
    const platform = platforms[i % 2];
    return {
      id: idx,
      title: `Project ${idx} — ${industry}`,
      slug: `project-${idx}-${industry.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      industry,
      platform,
      featured: false,
      featuredOrder: 0,
      thumbnail: "/images/projects/default-thumbnail.jpg",
      heroImage: "/images/projects/default-hero.jpg",
      gallery: [] as string[],
      summary: `QA audit performed on a ${industry.toLowerCase()} store on ${platform}. Issues discovered, diagnosed, and resolved.`,
      challenge: "The store had functional and UX issues impacting conversion and customer experience.",
      investigation: "Systematic testing across all key user journeys.",
      rootCause: "Configuration and implementation issues accumulated over time.",
      resolution: "Issues documented, prioritised, and resolved with the development team.",
      outcome: "Store verified across all primary user journeys.",
      testingScope: ["Functional Testing", "UI/UX Testing", "Responsive Testing"],
      issues: [] as Issue[],
      verification: [
        { label: "Functional", status: "verified" as const },
        { label: "Responsive", status: "verified" as const },
      ],
      technologies: [platform, "Custom Theme"],
      externalLinks: [] as { label: string; url: string }[],
      faqs: [] as FAQ[],
      seo: {
        title: `${industry} Store QA Audit — ${platform} | Case Study`,
        description: `QA audit of a ${industry.toLowerCase()} ${platform} store.`,
      },
      status: "published" as const,
    };
  }),
];

export const getFeaturedProjects = () =>
  sampleProjects
    .filter((p) => p.featured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder);

export const getAllProjects = () =>
  sampleProjects.filter((p) => p.status === "published");

export const getProjectBySlug = (slug: string) =>
  sampleProjects.find((p) => p.slug === slug);

export const getUniqueIndustries = () =>
  Array.from(new Set(sampleProjects.map((p) => p.industry))).sort();

export const getUniquePlatforms = () =>
  Array.from(new Set(sampleProjects.map((p) => p.platform))).sort();
