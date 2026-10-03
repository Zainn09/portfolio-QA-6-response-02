# Service pages — SEO specification

Internal spec for the 10 Shopify/ecommerce QA service pages. Not displayed publicly.

## Analysis of the existing site (done before writing any copy)

| Aspect | Finding |
| --- | --- |
| Brand | "QA Specialist" — an independent QA practice, not an agency |
| Voice | First-person singular, technical, evidence-led, anti-hype |
| Palette | `--bg-primary #F5F3ED` / dark `#0B0D0C`, accent `#B7FF3C` (lime) |
| Type | Inter (sans) + IBM Plex Mono (`--font-mono`) for eyebrows/labels |
| Radii | `--radius-sm 4px`, `--radius-md 8px`, `--radius-lg 16px` |
| Section rhythm | `clamp(3rem, 6vw, 4.5rem)` vertical padding, `.container` width 1400px |
| Eyebrow pattern | mono, `0.625rem`, `letter-spacing 0.14em`, uppercase, accent colour |
| Card pattern | `1px solid var(--border)`, `--radius-lg`, `var(--bg-surface)` |
| Existing components | `Reveal` (scroll animation), `AuditCTA` (lead form → `/api/audit`), `JsonLd`, `CaseStudyPage`, `ExpertiseSection`, `ProcessSection` |
| CTA destinations | `/audit` (lead form, `#audit`), `/contact` |
| Images | 74 local under `public/images/case-studies/**` + remote GitHub-hosted case-study captures |
| Case studies | 93 published projects in `src/data/projects.ts` |
| Structured data | Entity graph in `layout.tsx` (`Organization`, `WebSite`, `Person`, `ProfessionalService`) + per-page `Article`/`Blog`/`CollectionPage`/`BreadcrumbList`/`FAQPage` |
| Canonical origin | `src/lib/site.ts` → `https://abdulrehman-qa.vercel.app` |

**Verified facts reused in copy** (from existing site content, nothing invented):
100+ stores tested · 20 Shopify Plus projects · 12+ industries · 93 published
case studies · 299 research articles · 12 captured states per audit · seven-step
process (Understand → Map → Explore → Break → Reproduce → Resolve → Verify) ·
WCAG 2.1 AA referenced in the existing expertise section.

**Never written:** client names beyond existing published case studies, review
scores, ratings, awards, certifications, conversion-lift guarantees, performance
score guarantees, team members, years of experience.

## Keyword map (cannibalisation guard)

| # | URL | Primary keyword | Intent | Audience |
| --- | --- | --- | --- | --- |
| 1 | `/shopify-qa-testing` | shopify qa testing | Commercial | Shopify merchants needing QA |
| 2 | `/shopify-plus-qa` | shopify plus qa | Commercial / enterprise | Plus merchants, agencies, enterprise teams |
| 3 | `/shopify-checkout-testing` | shopify checkout testing | Commercial, high intent | Stores losing revenue at checkout |
| 4 | `/shopify-mobile-testing` | shopify mobile testing | Commercial | Mobile-majority stores |
| 5 | `/shopify-accessibility-testing` | shopify accessibility testing | Commercial / compliance-aware | Stores facing accessibility requirements |
| 6 | `/shopify-cross-browser-testing` | shopify cross browser testing | Commercial | Stores with browser-specific bugs |
| 7 | `/shopify-performance-testing` | shopify performance testing | Commercial / technical | Stores with slow pages, poor Core Web Vitals |
| 8 | `/ecommerce-qa-testing` | ecommerce qa testing | Commercial (pillar) | Non-Shopify and multi-platform merchants |
| 9 | `/shopify-regression-testing` | shopify regression testing | Commercial / retainers | Teams shipping frequent changes |
| 10 | `/shopify-qa-audit` | shopify qa audit | Transactional | Buyers wanting a one-off assessment |

Each page owns its primary keyword exclusively in the H1 and title. Secondary
terms are distributed by intent — "checkout testing" appears on the checkout
page as primary but only as a supporting mention elsewhere.

### Secondary + long-tail keyword assignments

| URL | Secondary keywords | Long-tail / question keywords |
| --- | --- | --- |
| `/shopify-qa-testing` | shopify qa, shopify testing services, shopify store testing, shopify quality assurance | what is shopify qa testing, how much does shopify qa testing cost, who tests shopify stores |
| `/shopify-plus-qa` | shopify plus testing, enterprise ecommerce qa, shopify plus audit, plus launch qa | shopify plus qa checklist, how is shopify plus testing different, shopify plus erp integration testing |
| `/shopify-checkout-testing` | shopify checkout qa, cart to checkout testing, shopify payment testing, shopify checkout audit | why does my shopify checkout fail, how to test shopify checkout, shopify discount code testing |
| `/shopify-mobile-testing` | shopify mobile qa, mobile ecommerce testing, responsive testing shopify, shopify mobile audit | how to test a shopify store on mobile, shopify mobile checkout issues, shopify responsive design testing |
| `/shopify-accessibility-testing` | shopify wcag testing, ecommerce accessibility audit, shopify a11y, screen reader testing shopify | is my shopify store accessible, shopify accessibility checklist, wcag compliance shopify store |
| `/shopify-cross-browser-testing` | shopify browser compatibility testing, safari shopify testing, shopify browser qa | why does my shopify store break in safari, browser testing shopify theme, shopify css browser issues |
| `/shopify-performance-testing` | shopify speed testing, shopify core web vitals, shopify lcp inp cls, shopify page speed audit | why is my shopify store slow, how to improve shopify core web vitals, shopify app performance impact |
| `/ecommerce-qa-testing` | ecommerce quality assurance, online store testing, ecommerce testing services, storefront qa | what is ecommerce qa testing, how does ecommerce qa work, ecommerce testing checklist |
| `/shopify-regression-testing` | shopify regression qa, shopify release testing, shopify smoke testing, post-deploy testing | when to run regression testing shopify, what to test after a theme update, shopify app update broke my store |
| `/shopify-qa-audit` | shopify store audit, shopify website audit, shopify qa review, shopify ux audit | what is included in a shopify audit, how long does a shopify qa audit take, shopify audit cost |

## Metadata (unique title + description per page)

Titles use `title.absolute` so the `%s | QA Specialist` template in
`layout.tsx` does not push them past the effective SERP width.

| URL | Title | Chars | Meta description | Chars |
| --- | --- | --- | --- | --- |
| `/shopify-qa-testing` | Shopify QA Testing Services \| QA Specialist | 46 | Independent QA for Shopify and Shopify Plus stores: functional, checkout, responsive, accessibility and performance testing, with reproducible bug reports. | 150 |
| `/shopify-plus-qa` | Shopify Plus QA & Enterprise Testing \| QA Specialist | 55 | QA for complex Shopify Plus builds — custom checkout, ERP/CRM/PIM integrations, multi-market and B2B storefronts, plus launch and release validation. | 148 |
| `/shopify-checkout-testing` | Shopify Checkout Testing Services \| QA Specialist | 51 | End-to-end Shopify checkout testing: cart, discounts, shipping, tax, payment methods, error states and order confirmation — across devices and markets. | 149 |
| `/shopify-mobile-testing` | Shopify Mobile Testing Services \| QA Specialist | 48 | Shopify mobile QA across phones and tablets: navigation, search, product pages, add-to-cart, forms and mobile checkout in real viewports. | 136 |
| `/shopify-accessibility-testing` | Shopify Accessibility Testing (WCAG) \| QA Specialist | 57 | Practical accessibility QA for Shopify stores — keyboard navigation, screen readers, focus states, contrast, forms and accessible checkout journeys. | 147 |
| `/shopify-cross-browser-testing` | Shopify Cross-Browser Testing Services \| QA Specialist | 54 | Verify your Shopify store in Chrome, Safari, Firefox and Edge — rendering, CSS, JavaScript, forms and checkout behaviour across browsers. | 139 |
| `/shopify-performance-testing` | Shopify Performance Testing & Core Web Vitals QA | 51 | Shopify speed QA focused on Core Web Vitals — LCP, INP and CLS — plus theme weight, third-party apps, script and image bottlenecks. | 135 |
| `/ecommerce-qa-testing` | Ecommerce QA Testing Services \| QA Specialist | 46 | Ecommerce QA across the full purchase journey: functional, cart, checkout, payment, search, integration, mobile and regression testing. | 137 |
| `/shopify-regression-testing` | Shopify Regression Testing Services \| QA Specialist | 52 | Regression QA for Shopify releases: theme updates, app installs, platform changes and campaigns — protect the journeys that drive revenue. | 143 |
| `/shopify-qa-audit` | Shopify QA Audit — Full Store Review \| QA Specialist | 51 | A structured Shopify QA audit: captured states, severity-rated findings, reproduction steps and a prioritised fix list, delivered as one report. | 139 |

## Technical SEO decisions

- **Self-referencing canonicals** on all 10 URLs, via the shared renderer.
- **One H1 per page**, then `h2` per section, `h3` for sub-items. No styled-up `div`s.
- **Breadcrumbs** — Home → Services → [page], matching the existing case-study
  breadcrumb design, emitted together with `BreadcrumbList` JSON-LD.
- **Schema** — `Service` (with `provider` → the existing `#person` node,
  `areaServed`, `serviceType`) plus `BreadcrumbList`, plus `FAQPage` only where
  visible FAQs exist.
- **Indexable** — no `noindex` on any of the 10 pages. Added to `sitemap.ts`
  with a `Service`-appropriate priority.
- **Internal linking** — `/ecommerce-qa-testing` is the broad pillar; it links
  down to every Shopify service. `/shopify-qa-testing` is the Shopify hub and
  links to the eight specialised pages. Every specialised page links back to its
  hub, to two or three sibling services with distinct anchor text, and to a
  relevant published case study.
- **No new dependencies, no new images.** Reuse the card/eyebrow/section
  patterns, the `Reveal` animation and the existing `/audit` lead form.

## Content architecture (shared renderer, unique content)

`src/components/services/ServicePage.tsx` renders a block list. The ten pages
share structure and styling but not wording — each has its own hero, problem
framing, coverage, process emphasis, deliverables, benefits, FAQs and CTA copy.

Blocks: `prose` · `cards` · `steps` · `checklist` · `table` · `callout` · `faq` · `links`
