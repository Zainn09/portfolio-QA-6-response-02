import type { ServicePageContent } from "./types";

export const shopifyPerformanceTesting: ServicePageContent = {
  slug: "shopify-performance-testing",

  title: "Shopify Performance Testing & Core Web Vitals | QA",
  metaDescription:
    "Shopify speed QA focused on Core Web Vitals — LCP, INP and CLS — plus theme weight, third-party apps, script and image bottlenecks.",

  eyebrow: "Performance • Core Web Vitals",
  h1: "Shopify Performance Testing That Explains Why the Page Is Slow",
  lead:
    "A speed score tells you a number. It does not tell you which app is blocking the main thread, which image is delaying the largest paint, or which layout shift is pushing the buy button down as a customer reaches for it. That is the part worth testing.",
  heroPoints: [
    "Core Web Vitals measured in the field metrics that matter — LCP, INP and CLS — on mobile and desktop",
    "Causes traced to their source: theme assets, app scripts, unoptimised images or render-blocking resources",
    "Findings ordered by the effort-to-benefit ratio, so the cheap wins land before the expensive rewrites",
  ],
  primaryCta: { label: "Run a performance review", href: "/audit" },
  secondaryCta: { label: "See the process", href: "#s-3" },

  schemaName: "Shopify Performance Testing",
  schemaDescription:
    "Performance testing for Shopify stores covering Core Web Vitals (LCP, INP, CLS), page weight, theme asset efficiency, third-party app script impact, image delivery, render-blocking resources and performance regression.",
  serviceType: [
    "Shopify performance testing",
    "Core Web Vitals testing",
    "Page speed auditing",
    "Front-end performance QA",
  ],
  crumb: "Shopify Performance Testing",

  blocks: [
    {
      type: "prose",
      eyebrow: "The problem",
      heading: "Most Shopify performance problems are self-inflicted, and identifiable",
      paragraphs: [
        "Shopify's infrastructure is fast. The slowness customers experience is almost always added on top of it: an app that injects a script blocking the first render, hero images served at several times their display size, a font loaded from a third-party domain, four analytics tools competing for the main thread. Each was installed for a reason. Together they can make a store feel broken.",
        "The metrics that describe this experience are the Core Web Vitals. Largest Contentful Paint measures how long the main content takes to appear. Interaction to Next Paint measures how quickly the page responds when a customer taps something. Cumulative Layout Shift measures how much the layout moves while they are trying to read or tap it. Each maps to a specific complaint — “it takes ages to load”, “the button doesn’t respond”, “I keep tapping the wrong thing” — and each has identifiable causes.",
        "This service measures the metrics, then traces them to the assets and scripts responsible.",
      ],
    },
    {
      type: "cards",
      eyebrow: "Coverage",
      heading: "What performance testing measures",
      columns: 3,
      cards: [
        {
          title: "Largest Contentful Paint",
          text: "What the largest element on each key template actually is, how long it takes to render, and whether it is being delayed by an oversized image or a blocking resource.",
        },
        {
          title: "Interaction to Next Paint",
          text: "How responsive the store is to taps and clicks, and which long-running scripts make the interface feel unresponsive during the moments that matter.",
        },
        {
          title: "Cumulative Layout Shift",
          text: "Which elements move while the page settles — banners, images without dimensions, late-loading fonts, injected widgets — and how far they push the buying controls.",
        },
        {
          title: "Theme asset efficiency",
          text: "Whether CSS and JavaScript are being loaded on every template when they are only needed on one, and how much of the theme payload is unused.",
        },
        {
          title: "Third-party app impact",
          text: "The script weight contributed by each installed app, which ones load on every page, and which ones could be deferred without losing function.",
        },
        {
          title: "Image delivery",
          text: "Files served far larger than their display slot, missing modern formats, incorrect priority on hero images, and screenshots used where an illustration would weigh less.",
        },
        {
          title: "Font loading",
          text: "How typefaces are requested, whether they block rendering, how the fallback behaves while loading, and the layout shift when the real font arrives.",
        },
        {
          title: "Template-level performance",
          text: "Homepage, collection, product and cart measured separately, because they fail for different reasons and are fixed differently.",
        },
        {
          title: "Performance regression",
          text: "Whether a recent app install or theme change made the store slower, and by how much — measured against a recorded baseline.",
        },
      ],
    },
    {
      type: "steps",
      eyebrow: "Process",
      heading: "How the performance review runs",
      steps: [
        { title: "Establish a baseline", text: "Measure the key templates on mobile and desktop before anything changes, so improvements are compared against evidence rather than recollection." },
        { title: "Read the field data", text: "Where real-user data is available, start there — it reflects your customers' devices and connections, not a fast lab machine." },
        { title: "Profile the page", text: "Identify what delays the main content, what blocks the main thread, and which assets are the heaviest contributors." },
        { title: "Attribute the causes", text: "Separate theme assets from app-injected scripts, so each finding points to something that can actually be changed." },
        { title: "Quantify the opportunities", text: "For each cause, estimate the change and the expected benefit, so effort goes where it pays." },
        { title: "Prioritise the fix list", text: "Order by benefit-to-effort — image sizing and deferred scripts before structural rewrites." },
        { title: "Remediate and re-measure", text: "After changes land, measure the same templates again and report what actually moved." },
      ],
    },
    {
      type: "checklist",
      eyebrow: "First, usually",
      heading: "The fixes that most often move the numbers",
      intro:
        "In most audits these account for the majority of the improvement, and most of them do not require touching the theme's structure.",
      items: [
        { title: "Size images to their display slot", text: "the single most common cause of a slow largest paint" },
        { title: "Set explicit width and height on media", text: "which removes most avoidable layout shift on its own" },
        { title: "Defer non-critical third-party scripts", text: "chat widgets, review embeds and analytics that do not need to run immediately" },
        { title: "Preload the hero image", text: "so the element customers see first is not the element the browser discovers last" },
        { title: "Reduce app script surface", text: "removing or restricting apps that load site-wide for a feature used on one template" },
        { title: "Load fonts efficiently", text: "self-hosted or subset where practical, with a fallback that does not shift the layout" },
        { title: "Conditionally load template-specific assets", text: "so the homepage does not pay for the product page's JavaScript" },
      ],
    },
    {
      type: "table",
      eyebrow: "Deliverables",
      heading: "What the performance review produces",
      headers: ["Deliverable", "Contents"],
      rows: [
        ["Baseline measurements", "Recorded metrics per template and device before any changes, so improvements are verifiable."],
        ["Bottleneck analysis", "The specific assets, scripts and resources delaying rendering or blocking interaction, attributed to theme or app."],
        ["Prioritised fix list", "Changes ordered by expected benefit against implementation effort, with the reasoning stated."],
        ["App weight report", "What each installed app contributes to page weight and where it loads, useful for pruning decisions."],
        ["Post-change comparison", "The same measurements repeated after fixes, showing what moved and what did not."],
      ],
    },
    {
      type: "callout",
      heading: "On scores and rankings",
      text:
        "No performance engagement can promise a particular score, and none should promise a ranking position — page experience is one of many signals, and lab scores vary between runs and environments. What is measurable is the page weight, the blocking resources and the vitals themselves. Those are reported as numbers you can act on and re-check.",
    },
    {
      type: "links",
      eyebrow: "Related testing",
      heading: "Performance rarely stands alone",
      items: [
        { href: "/shopify-mobile-testing", label: "Mobile testing", text: "Performance and mobile are the same problem viewed from two angles — hardware and connection differences are where slowness shows." },
        { href: "/shopify-accessibility-testing", label: "Accessibility testing", text: "Slow responses and motion effects are barriers as well as annoyances." },
        { href: "/shopify-qa-audit", label: "QA audit", text: "Performance findings are one section of the full store assessment." },
        { href: "/shopify-regression-testing", label: "Regression testing", text: "A performance baseline is what makes 'this feels slower since the update' answerable." },
      ],
    },
  ],

  faq: [
    {
      q: "What are Core Web Vitals and why do they matter?",
      a: "They are three metrics describing how a page feels to use: Largest Contentful Paint (how long the main content takes to appear), Interaction to Next Paint (how quickly the page responds to input) and Cumulative Layout Shift (how much the layout moves unexpectedly). They matter because they describe real user experience, and because search engines incorporate page experience signals alongside content relevance.",
    },
    {
      q: "Can you guarantee a specific Lighthouse score?",
      a: "No, and you should be wary of anyone who does. Lab scores fluctuate between runs, vary by environment and device profile, and can be improved artificially in ways that do not help customers. The review reports measured values, explains the causes and then re-measures after fixes so the change is documented.",
    },
    {
      q: "Will fixing performance improve my search rankings?",
      a: "Page experience is one of many ranking signals, and no testing service can promise a ranking outcome. What performance work reliably does is remove causes of abandonment — customers who leave before the page renders, or who tap a control that never responds — which is worth doing on its own terms.",
    },
    {
      q: "Why is my Shopify store slow when Shopify says its infrastructure is fast?",
      a: "Because the slowness is almost always added on top of that infrastructure: theme assets, app-injected scripts, oversized images and third-party tags. Shopify's servers are not usually the bottleneck — the total payload delivered through them is.",
    },
    {
      q: "Do Shopify apps really slow stores down?",
      a: "They can, and the heaviest contributors are usually identifiable. Apps that inject scripts on every page for a feature used on one template are a common cause. The review attributes script weight per app and per template, which makes it possible to decide what is worth the cost.",
    },
    {
      q: "Can performance be tested on a staging store?",
      a: "Yes, with one caveat: staging usually has fewer apps and less traffic, so absolute numbers differ from production. Field data from a live store is more representative. Where both are available, production is the baseline and staging is used for testing changes before they ship.",
    },
    {
      q: "How do you measure performance — lab tools or real users?",
      a: "Both, in that order of preference. Real-user data reflects the devices and connections customers actually have, and is the better starting point where it exists. Lab measurement is then used to profile causes and to verify changes, since it can be repeated under controlled conditions.",
    },
  ],

  related: [
    "shopify-qa-testing",
    "shopify-mobile-testing",
    "shopify-accessibility-testing",
    "shopify-regression-testing",
    "shopify-qa-audit",
    "ecommerce-qa-testing",
  ],
};
