# HER SHOP® — QA Case Study

**Website:** https://hershop.com · **Type:** Bridal and occasion fashion (custom-made) · **Captures:** 2026-09-15 (desktop 1440×900, mobile 390×844)
**Assets:** 13 screenshots + 1 video ([project folder](https://github.com/Zainn09/portfolio-images/tree/main/QA-PORTFOLIO-ASSETS/Sprint-01/05-hershop)) · **Video:** [bridal shopping flow, campaign to gown detail](https://github.com/Zainn09/portfolio-images/blob/main/QA-PORTFOLIO-ASSETS/Sprint-01/05-hershop/video/05_hershop_video_product_journey_001.mp4)

> **Evidence legend:** **Confirmed** = directly visible in captures/manifests · **Inferred** = reasonable conclusion · **Recommended** = suggested practice, not observed. No source-code access; black-box QA throughout.

---

## 1. Project Overview

| | |
|---|---|
| **Project** | HER SHOP® (hershop.com) — "Live Beautiful, Live Free" |
| **Description** | Bridal and occasion fashion store selling custom-made wedding gowns ($1,000+), jewelry, accessories, and shoes, with custom color/size personalization |
| **Domain** | Fashion e-commerce, bridal vertical |
| **Application type** | Consumer custom-made fashion storefront (cart + buy-now checkout) |
| **Target users** | Brides and wedding parties, occasion shoppers, gift buyers |
| **Objective** | Convert high-consideration bridal shoppers with customization confidence |
| **Key functionality** | Campaign merchandising, category collections, variant/color/size customization, requirements notes, cart, buy-now, ratings, currency selector, wishlist, chat, blog |
| **Stack** | Not confirmed from captures. Observed: currency selector, chat + wishlist + cart widgets (**Confirmed**). **Inferred**: SaaS commerce platform patterns (buy-now, variant pickers) — platform not evidenced, not claimed |
| **Repository** | None — third-party live site; black-box audit (**Confirmed**) |

**Figure 1 — "Her Bridal" campaign hero with guarantee seal and category entry points.**

![HER SHOP hero](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/05-hershop/images/05_hershop_desktop_home_hero_001.jpg)

*QA note: the promise is "Made to Fit" — every customization control on the detail page is a promise the factory must receive exactly, making variant/note fidelity the core QA theme.*

---

## 2. Business Problem

Wedding gowns are the ultimate high-stakes online purchase: $1,000+, emotionally loaded, date-bound (the wedding day), and usually non-returnable when custom-made. HER SHOP solves fit anxiety with custom sizes, custom colors, and free-text requirements (measurements, delivery date). 

**If the system fails:** wrong color/size reaches production (unwearable $1,289.99 gown), delivery-date notes lost (gown arrives after the wedding), shipping-threshold confusion at checkout (captures show **$150 in the announcement bar vs $500 on the product badge** — Confirmed inconsistency), or currency/pricing errors. Business-critical workflows: customization→cart→order fidelity, delivery-date capture, shipping promise consistency, checkout totals.

---

## 3. Product & Feature Breakdown

**Figure 2 — Bridal collection: ratings, odd-decimal pricing, mixed taxonomy, color dots.**

![HER SHOP collection](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/05-hershop/images/05_hershop_desktop_collection_listing_001.jpg)

*QA note: three content-integrity signals in one grid — "BRIDAL DRESSES" vs "WEDDING DRESSES" labels, $1,361.94-style pricing, and marketing text baked into one product photo. All need taxonomy/media rules.*

- **Campaign & editorial merchandising (Confirmed).** Hero campaigns, "model wears" cross-category tiles, New Arrivals carousel. *QA:* tile→collection linkage, carousel controls, image/text overlay legibility.
- **Collections (Confirmed).** Cards with category label, star rating + count, title, price, color dots. *QA:* label taxonomy consistency, rating math (suspicious uniform 5.0s deserve review), price formatting, dot↔variant truth.
- **Product detail + customization (Confirmed).** Color buttons incl. "Custom Color", "US Size: Custom size" + Size Chart, requirements textarea, ADD TO BAG / BUY NOW, wishlist, share icons. *QA:* the customization contract — selections + notes must reach the order unchanged; size-chart accuracy; custom-color follow-up flow.
- **Cart & checkout (Inferred from widgets).** *QA:* custom options displayed in cart, totals with shipping thresholds, buy-now skipping cart correctly.
- **Currency/region selector (Confirmed: "United States | USD $").** *QA:* conversion accuracy, symbol placement, persistence across pages, checkout currency match.
- **Ratings, wishlist, chat, blog (Confirmed).** *QA:* review authenticity signals, wishlist persistence, chat availability, blog link health.

**Figure 3 — Gown detail: variant pickers, custom size, requirements notes, dual purchase CTAs.**

![HER SHOP product detail](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/05-hershop/images/05_hershop_desktop_product_detail_001.jpg)

*QA note: this page is a made-to-order contract form disguised as a product page — color, size, measurements, and delivery date must all survive to production.*

---

## 4. QA Strategy

### Functional Testing
- **Positive:** each color/size combo adds to bag with correct options echoed; notes saved to order; buy-now checks out with same fidelity; currency switch reprices everything.
- **Negative:** empty notes when required (if required) blocked gracefully; invalid delivery dates (past dates, impossible dates) rejected; out-of-stock combos unselectable.
- **Boundary:** free-shipping threshold behavior at $149.99/$150.00 (and resolution of the $150-vs-$500 conflict — a content defect to fix first); 1 vs max quantity; longest realistic measurements text.
- **Edge:** "Custom Color" with no follow-up selection; size chart vs actual made-to-fit logic; wedding-date rush flags; checkout with mixed custom + standard items.
- **Error handling:** payment failure preserves customization (re-entering measurements is abandonment fuel); session expiry warns before wiping the bag.

### UI Testing
Dropdown navs (5 collections + Sale + Blog); announcement bar persistence; sticky add-to-bag on scroll (verify presence/behavior); image zoom/gallery; color-button selected states; textarea resize/validation; wishlist heart states; chat/cart badge counts; share-icon targets; loading skeletons; empty states (empty bag, no reviews, no results).

### API Testing (black-box; Recommended)
Implied surface: catalogue, variants, cart, checkout, currency, reviews, wishlist. Validate: variant/price consistency (card vs detail vs cart vs checkout must agree to the cent); cart-line custom attributes round-trip; currency conversion math server-side; review aggregation correctness; wishlist auth scoping; idempotent add-to-bag; tamper resistance (edited prices rejected).

### Integration Testing
Storefront ↔ checkout totals (shipping threshold logic unified); customization ↔ order/production payload; currency provider rates; reviews provider sync; email (order confirmation must include custom options + delivery date); analytics (purchase events with custom attributes, no PII leakage).

### Regression Testing
Variant→cart→checkout fidelity, threshold/shipping logic, currency coverage, ratings render, nav/dropdowns, widgets, mobile purchase path. Trigger on theme, checkout, or catalogue-template changes.

### Compatibility Testing
Chrome, Firefox, Safari, Edge; desktop/tablet/mobile. Variant pickers, sticky CTAs, and payment widgets are the risks.

### Responsive Testing
**Figure 4 — Responsive comparison: stacked mobile hero, category circles, widget overlaps.**

![HER SHOP responsive comparison](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/05-hershop/images/05_hershop_responsive_comparison_001.jpg)

*QA note: on mobile the wishlist heart sits on top of the "Bridal Dresses" category circle and the cart badge crowds the viewport edge — widget placement needs a small-screen pass, plus the truncated "Mother of The…" label.*

Validate: hamburger completeness; variant buttons tappable without mis-taps; textarea usable with mobile keyboards; size-chart legible at 390px; sticky bag CTA reachable; no horizontal scroll on detail.

### Accessibility Testing
Variant buttons as a real radiogroup with labels; textarea with instructions + error association; size chart as an accessible table/dialog; carousel controls labeled; star ratings with text equivalents; color contrast of brown-on-white CTAs and small badges; keyboard-only purchase completion; focus management in drawers/dialogs.

**Figure 5 — Discovery flow: bridal campaign → wedding collection → gown detail.**

![HER SHOP user flow](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/05-hershop/images/05_hershop_qa_user_flow_sequence_001.jpg)

*QA note: the automatable golden path — campaign CTA, collection card link, and detail render with correct price/variants.*

---

## 5. Test Scenarios

| ID | Module | Test Scenario | Expected Result | Priority |
|---|---|---|---|---|
| HERS-001 | Discovery | Hero Order Now → collection → gown detail | Correct pages load; price/variants render | High |
| HERS-002 | Customization | Select Champagne + Custom size + notes → Add to Bag | Bag line shows all options + notes verbatim | Critical |
| HERS-003 | Customization | Buy Now with same setup | Checkout carries identical options/notes | Critical |
| HERS-004 | Customization | Past/impossible delivery date in notes | Guided correction (if parsed) or safe pass-through | High |
| HERS-005 | Shipping | Cart at $149.99 vs $150.00 (after threshold fix) | Fee applied/waived exactly at threshold | Critical |
| HERS-006 | Pricing | Compare price card→detail→bag→checkout | Identical to the cent in all four | Critical |
| HERS-007 | Currency | Switch USD→another currency, full flow | Converted totals match rate; symbol correct | High |
| HERS-008 | Variants | "Custom Color" end-to-end | Follow-up captured; nothing defaulted silently | High |
| HERS-009 | Size | Open Size Chart; verify against listed sizes | Chart accurate, readable, printable | Medium |
| HERS-010 | Ratings | Open reviews on a 5.0 product | Reviews exist and math holds | Medium |
| HERS-011 | Taxonomy | Audit category labels across collections | Single consistent taxonomy | Medium |
| HERS-012 | Wishlist | Heart gown → reload → move to bag | Persists; options intact on move | Medium |
| HERS-013 | Checkout | Declined payment, then retry | Customization preserved; single charge | Critical |
| HERS-014 | Mobile | Full purchase path at 390px | No overlap blocking CTAs; no h-scroll | High |
| HERS-015 | Widgets | Chat open during checkout | Never covers pay/submit actions | Medium |
| HERS-016 | Content | Editorial tiles + New Arrivals arrows | Correct links; carousel cycles | Low |

---

## 6. Edge Cases & Negative Testing

- **Shipping-threshold contradiction ($150 vs $500, Confirmed):** must be resolved as a content defect first — then test the single source of truth at boundary values, mixed carts, and discounted totals (does a coupon dropping the total below threshold re-add shipping?).
- **Lost customization:** notes/measurements vanishing between bag and order is the nightmare scenario — verify verbatim persistence including line breaks, units (cm/in), and special characters.
- **Delivery-date semantics:** free-text dates ("June 6", "06/06", "next month") risk misreading — verify whether dates are parsed/validated or passed raw, and test ambiguous formats.
- **Custom Color without color:** selecting Custom Color but providing no usable color detail must trigger a follow-up, not a default Ivory gown.
- **Size-chart mismatch:** made-to-fit logic vs chart values must agree; test chart updates propagating to all gowns.
- **Currency rounding:** $1,289.99 conversions must round consistently (no $0.01 drift between bag and gateway).
- **Rating integrity:** uniform 5.0s across products warrant review-source verification, not blind trust.
- **Baked-in image text:** one product photo carries marketing copy — test media standards (or it reads as a placeholder bug).
- **Widget collisions:** wishlist-over-category and cart-at-edge on mobile; chat over sticky CTAs on detail.
- **Back/refresh/duplicates:** refresh on checkout, double-tap BUY NOW, back-button after payment — exactly one order, options intact.

---

## 7. API Testing Approach

No endpoints visible (**Recommended** black-box approach). Implied resources: products, variants, cart, checkout, currency, reviews, wishlist, content. Verify: price/variant agreement across surfaces; custom-attribute persistence on cart lines; currency math server-side; review read/aggregate correctness; auth scoping on wishlist/account; idempotent bag/checkout submits; 4xx validation (bad variant IDs, negative qty); tamper rejection on prices.

## 8. Database & Data Validation

Schema unknown (approach only). Implied entities: products, variants, custom options, carts, orders, customers, reviews, content. QA approach: variant/price single-source-of-truth (one price service feeding card/detail/bag/checkout); order lines carrying full customization payload; delivery-date/notes stored verbatim and surfaced to fulfillment; currency/rate consistency; review aggregates recomputed correctly; no orphan wishlist/cart lines after product unpublish; order-state machine (pending→paid→production→shipped) with no illegal jumps.

## 9. Security Testing Perspective

- **Observed:** accounts, checkout, free-text notes, newsletter/contact, share links; no public UGC beyond reviews.
- **QA risks:** price/tampering via variant-ID or cart-line manipulation; XSS in notes fields, reviews, search, and reflected errors; IDOR on orders/wishlist; checkout CSRF; PII in notes (measurements, dates, addresses) — storage, display, and email minimization; payment/P CI boundary (gateway-hosted vs on-site); rate limiting on auth/search/reviews; admin/CMS exposure checks.

## 10. Performance Testing Perspective

Bridal traffic is bursty (campaigns, wedding season): image-heavy collection/detail loads (LCP), variant-switch latency, currency-switch reprice speed, checkout step latency, chat/review third-party weight. Suggested scenarios: collection page with full grid under throttled 4G; detail-page LCP budget with gallery + widgets; sale-traffic checkout throughput; image audit (responsive sizes, lazy grids, modern formats).

## 11. Automation Strategy

- **UI automation (Recommended — Playwright):** golden path with customization matrix (colors × sizes × notes variants), price-agreement assertions across four surfaces, threshold boundary tests, currency smoke, mobile purchase path.
- **API automation:** cart/checkout contracts, idempotency, currency math, review aggregation.
- **Regression automation:** customization fidelity + totals + thresholds on every theme/checkout deploy.
- **CI/CD (Recommended):** PR checks → staging full regression + content-crawl (threshold/taxonomy/price audits) → production deploy → post-deploy smoke (detail renders, bag works, checkout reachable). No existing pipeline evidence.

## 12. QA Tools & Technologies

**Observed (Confirmed):** chat, wishlist, cart-badge widgets; currency selector. Nothing else evidenced.
**Recommended:** Playwright (UI + API + mobile), Postman/REST for cart/checkout contracts, k6 for burst tests, axe-core + Lighthouse CI, a content-crawler for price/threshold/taxonomy consistency, GitHub Actions-style pipeline.

## 13. Defect Scenarios

| # | Title | Module | Severity / Priority | Business impact |
|---|---|---|---|---|
| D1 | Free-shipping threshold says $150 (announcement) vs $500 (product badge) (**Confirmed**) | Content integrity | High / Critical | Directly contradicts the checkout promise; support + chargeback fuel |
| D2 | Wishlist heart overlaps "Bridal Dresses" category circle on mobile (**Confirmed**) | Mobile UI | Medium / High | Blocks a category entry point on phones |
| D3 | Mixed taxonomy: BRIDAL DRESSES vs WEDDING DRESSES (**Confirmed**) | Catalogue | Low / Medium | Weakens findability and brand polish |
| D4 | Marketing text baked into a product photo (**Confirmed**) | Media standards | Low / Medium | Reads as unfinished; breaks zoom/crop |
| D5 | Customization lost between bag and order (to verify) | Order fidelity | Critical / Critical | Wrong $1,289.99 gown produced |
| D6 | Currency drift of $0.01+ between bag and gateway (to verify) | Pricing | High / High | Payment mismatch, failed charges |

Repro pattern (D1): load any gown detail → compare announcement bar vs product badge → Expected: single threshold everywhere → Confirmed actual: $150 vs $500. File with capture; fix content before testing boundaries.

## 14. QA Challenges

- **Customization as contract:** free-text measurements + dates must be treated as structured order data with verification, not decoration.
- **Contradictory content:** threshold/taxonomy/media issues mean QA must audit content like code (crawl + assert).
- **Date-bound emotion:** wedding deadlines make delivery-date handling and delay communication uniquely sensitive.
- **Price agreement × 4 surfaces × N currencies:** combinatorial; needs automated cross-surface assertions.
- **Uniform 5.0 ratings:** QA must verify review plumbing and authenticity signals rather than assume social proof works.

## 15. Risk-Based Testing

| Area | Risk | Impact | Likelihood | QA Focus |
|---|---|---|---|---|
| Customization fidelity | Wrong gown produced | Critical | Medium | Functional + E2E + data |
| Shipping threshold | Contradictory promise | High | High (confirmed) | Content + boundary |
| Price agreement | Cent-level mismatch | Critical | Medium | API + automated asserts |
| Delivery dates | Misread/missing date | High | Medium | Functional + edge |
| Currency | Wrong totals abroad | High | Medium | Functional + API |
| Mobile widgets | Blocked categories/CTAs | Medium | High (confirmed) | UI + responsive |
| Reviews | Fake/broken social proof | Medium | Low | Integration + data |

## 16. Test Coverage Strategy

- **Smoke:** home, one collection, one gown detail, bag add, checkout loads.
- **Sanity:** post-publish checks on new/edited gowns (price, variants, media).
- **Functional:** customization matrix, thresholds, currency, widgets, content.
- **Regression:** fidelity + totals + thresholds + mobile path, every release.
- **Integration:** storefront↔checkout, options→orders, currency, reviews, email.
- **API:** cart/checkout/currency/review contracts, idempotency, tampering.
- **UI:** pickers, drawers, carousels, truncation, loading/empty states.
- **Security:** notes/reviews XSS, IDOR, CSRF, PII, rate limits.
- **Performance:** image budgets, variant latency, burst checkout.
- **Accessibility:** radiogroups, dialogs, tables, keyboard purchase.
- **Compatibility:** 4 browsers × 3 viewport classes.

## 17. CI/CD Quality Gates

No pipeline evidence — proposing (**Recommended**): 1) checkout → 2) install → 3) lint → 4) unit → 5) API contracts → 6) UI smoke → 7) staging → 8) full regression + content crawl (prices/thresholds/taxonomy) → 9) a11y + perf budgets → 10) checkout proof (test order with custom options) → 11) production → 12) post-deploy smoke.

## 18. QA Metrics

Meaningful: **customization-fidelity rate** (orders with exact options/notes), **price-agreement rate** across surfaces, **threshold-correctness** (boundary suite), **content-violation count** (crawl), **regression pass rate**, **defect leakage** on checkout/fidelity, **mobile purchase health**, **LCP/CLS**, **MTTR** for checkout incidents.

## 19. What I Would Test First

1. **Smoke:** home → collection → gown → bag → checkout reachable.
2. **Fidelity:** full customization order end-to-end; verify options + notes in bag.
3. **Threshold:** resolve $150/$500 conflict; boundary-test the single truth.
4. **Price agreement:** one gown across card/detail/bag (checkout if accessible).
5. **Currency:** switch + full flow in second currency.
6. **Mobile:** purchase path at 390px; widget collisions.
7. **Content:** taxonomy, ratings, media-standards spot audit.
8. **A11y:** keyboard-only purchase.
9. **Baseline:** lock suite for regression.

**Figure 6 — Editorial cross-merchandising and New Arrivals rail.**

![HER SHOP editorial](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/05-hershop/images/05_hershop_project_highlight_bridal_editorial_merchandising_001.jpg)

*QA note: model-worn tiles sell across categories (gowns → jewelry → accessories → shoes) — each tile is a merchandising promise whose link, label, and landing must be verified.*

## 20. QA Deliverables

Test plan (customization-weighted) · scenario matrix · cart/checkout contract collection (Recommended) · Playwright regression (Recommended) · defect reports with capture evidence · content-crawl reports · execution reports · traceability matrix · sign-off with fidelity + totals proof.

## 21. Final QA Assessment

HER SHOP® is **medium complexity** with **high business stakes per order**: a $1,289.99 custom gown with a wedding deadline leaves no room for "minor" data loss. Captures reveal a beautiful storefront with confirmed content-integrity issues (shipping-threshold contradiction, mixed taxonomy, widget overlaps) that should be fixed before boundary testing means anything. Focus: **customization fidelity, price agreement, threshold truth, and mobile purchase health**, automated as cross-surface assertions plus a content crawl. Highest risk: options/notes failing to reach production, and the $150/$500 promise gap reaching customers.

---

## Appendix — Full asset inventory

All captures: [05-hershop/images/](https://github.com/Zainn09/portfolio-images/tree/main/QA-PORTFOLIO-ASSETS/Sprint-01/05-hershop/images) · Video + poster: [05-hershop/video/](https://github.com/Zainn09/portfolio-images/tree/main/QA-PORTFOLIO-ASSETS/Sprint-01/05-hershop/video/) · Manifest: [asset-manifest.json](https://github.com/Zainn09/portfolio-images/blob/main/QA-PORTFOLIO-ASSETS/Sprint-01/05-hershop/asset-manifest.json) · Coverage notes: [project README](https://github.com/Zainn09/portfolio-images/blob/main/QA-PORTFOLIO-ASSETS/Sprint-01/05-hershop/README.md)
