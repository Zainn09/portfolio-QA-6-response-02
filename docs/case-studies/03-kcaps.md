# K-CAPS — QA Case Study

**Website:** https://www.kcaps.com · **Type:** B2B capsule manufacturing (HPMC vegetarian capsules) · **Captures:** 2026-09-15 (desktop 1440×900, mobile 390×844)
**Assets:** 12 screenshots + 1 video ([project folder](https://github.com/Zainn09/portfolio-images/tree/main/QA-PORTFOLIO-ASSETS/Sprint-01/03-kcaps)) · **Video:** [B2B catalogue and product configuration journey](https://github.com/Zainn09/portfolio-images/blob/main/QA-PORTFOLIO-ASSETS/Sprint-01/03-kcaps/video/03_kcaps_video_product_journey_001.mp4)

> **Evidence legend:** **Confirmed** = directly visible in captures/manifests · **Inferred** = reasonable conclusion · **Recommended** = suggested practice, not observed. No source-code access; black-box QA throughout.

---

## 1. Project Overview

| | |
|---|---|
| **Project** | K-CAPS (kcaps.com) — "Capsules of Vegetable Origin" |
| **Description** | B2B storefront for plant-based empty capsules (K-CAPS vegetable, AR-CAPS acid-resistant): catalogue, capsule configurator ("Build Your Own Capsule"), and quote-request conversion |
| **Domain** | Nutraceutical/pharma supply manufacturing |
| **Application type** | B2B lead-generation + catalogue + RFQ (request-for-quote) web app |
| **Target users** | Supplement/nutraceutical brand buyers, formulators, procurement teams (60+ countries served) |
| **Objective** | Turn capsule buyers into qualified quote requests with correct specifications |
| **Key functionality** | Capsule catalogue with sort/stock states, configurator (type/size/color + summary/reset), quote CTAs, certifications library, FAQ, search, virtual-assistant chat |
| **Stack** | Not confirmed from captures. Observed: carousel UI, chat widget with proactive messaging (**Confirmed**). **Inferred**: CMS-driven marketing site + custom configurator/quote app |
| **Repository** | None — third-party live site; black-box audit (**Confirmed**) |

**Figure 1 — Homepage hero: positioning carousel, dual quote CTAs, certifications strip.**

![K-CAPS homepage hero](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/03-kcaps/images/03_kcaps_desktop_home_hero_001.jpg)

*QA note: the page converts on specifications and trust (certifications) rather than price — so spec accuracy and cert-claim consistency outrank classic cart testing here.*

---

## 2. Business Problem

Supplement brands need certified empty capsules with exact specifications (size, material, color, certifications) before committing to bulk orders — the detail page sells a "Box of 125,000" (**Confirmed**). Wrong specs reaching manufacturing mean wasted production runs; missing or inconsistent certification claims (Non-GMO, Vegan, Kosher, Halal) can disqualify the supplier from regulated buyers' vendor lists.

**If the system fails:** misconfigured capsules quoted (wrong size/material), quote requests lost or missing spec data, certification claims contradicting each other across pages, stock states misleading procurement timelines. Business-critical workflows: configurator→quote handoff with intact specs, RFQ delivery, certification content accuracy.

---

## 3. Product & Feature Breakdown

**Figure 2 — Capsule catalogue: stock badge, breadcrumbs, sort control, product cards.**

![K-CAPS catalogue](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/03-kcaps/images/03_kcaps_desktop_collection_listing_001.jpg)

*QA note: "In stock and ready to ship" next to a sort control and near-identical card titles ("Clear Vegetarian…") makes card differentiation and badge truthfulness prime test targets.*

- **Catalogue (Confirmed).** Category hero with material tag (HPMC) + stock badge, breadcrumbs, SORT BY dropdown, product cards. *QA:* badge truth (in-stock vs made-to-order), sort correctness, card title/image uniqueness, breadcrumb trails.
- **Capsule configurator (Confirmed).** Type (Vegetable K-CAPS / Acid-Resistant AR-CAPS), Size, Color dropdowns + Summary/Reset/Erase actions. *QA:* option compatibility (not every size exists in every material), summary accuracy, reset/erase semantics, configurator→quote data handoff.
- **Quote flow (Confirmed CTAs; form inferred).** REQUEST A QUOTE / GET A QUOTE everywhere. *QA:* every CTA must preserve context (product/configurator state) into the RFQ; submissions must validate, confirm, and actually deliver.
- **Product detail (Confirmed).** Spec-heavy title, gallery, accordions (Description/Advantages/Storage), certification chips. *QA:* spec/title/accordion/chip consistency; gallery navigation; duplicate-CTA review (see §13).
- **Certifications & trust content (Confirmed).** Certifications page/section, "60+ Countries", origin claims. *QA:* claim consistency across hero, detail chips, and cert pages; badge image integrity.
- **Search, FAQ, chat (Confirmed icons/widgets).** *QA:* technical-term search ("HPMC", "Size 1", "enteric"), FAQ accuracy, chat must not cover configurator controls (**Confirmed overlap risk** — chat bubble sits over the Erase button in captures).

**Figure 3 — "Build Your Own Capsule" configurator with spec dropdowns and summary controls.**

![K-CAPS configurator](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/03-kcaps/images/03_kcaps_project_highlight_capsule_configurator_001.jpg)

*QA note: this is the money widget — every combination a buyer can assemble must be a combination the factory can actually make and quote.*

---

## 4. QA Strategy

### Functional Testing
- **Positive:** each type→size→color path yields a summary; summary→quote carries all specs; sort options reorder correctly; accordions expand/collapse.
- **Negative:** incompatible combos blocked with guidance (e.g., size unavailable in AR-CAPS); empty quote submit rejected field-by-field; search for nonsense returns helpful empty state.
- **Boundary:** minimum order quantities (box of 125,000 — what about 1 box vs 100?); configurator with 1 vs all options selected; maximum message length on RFQ.
- **Edge:** RFQ with special characters in company/product fields; configurator state after browser back/refresh; quote CTA from every entry point.
- **Error handling:** failed RFQ submit shows what to do next (email fallback, retry without data loss).

### UI Testing
Announcement bar + sticky nav behavior on scroll; dropdown ("Vegetarian Capsules") hover/click/keyboard; carousel arrows + dots sync; gallery arrows + thumbnails; accordion single/multi-open rules; chat widget z-order vs configurator buttons and sticky CTAs; proactive chat messages dismissible and non-blocking; loading states on catalogue; empty states (no search results, out-of-stock category).

### API Testing (black-box; Recommended)
Implied surface: catalogue/search, configurator options/pricing, RFQ submission, chat. Validate: option-compatibility served correctly (no impossible combos offered); RFQ payload completeness (specs + contact + consent); server-side validation independent of UI; idempotent RFQ submit; status codes (422 on validation, not 500); quote-reference returned and usable for follow-up.

### Integration Testing
Configurator ↔ RFQ (spec fidelity); RFQ ↔ CRM/email delivery (prove delivery, not just success toast); CMS ↔ catalogue/cert pages (publish timing); search index freshness after product changes; chat ↔ agent handoff ("a team member will get back to you" must create a real follow-up).

### Regression Testing
Configurator matrix, RFQ delivery, sort/badge accuracy, accordion/gallery widgets, nav/dropdown, certification content, mobile quote path. Trigger on CMS, configurator, or template deploys.

### Compatibility Testing
Chrome, Firefox, Safari, Edge; desktop/tablet/mobile. Configurator dropdowns and chat widgets are the cross-browser risks.

### Responsive Testing
**Figure 4 — Responsive comparison: stacked mobile hero, hamburger nav, condensed CTAs.**

![K-CAPS responsive comparison](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/03-kcaps/images/03_kcaps_responsive_comparison_001.jpg)

*QA note: mobile hides the header REQUEST A QUOTE — the hero GET A QUOTE becomes the sole conversion path, so its visibility and tap target are conversion-critical on small screens.*

Validate: hamburger covers all 7 nav items + quote CTA reachable; configurator usable at 390px (dropdowns, summary, reset); tables/spec text reflow without horizontal scroll; chat doesn't cover primary CTAs.

### Accessibility Testing
Dropdowns as real selects/comboboxes with labels; carousel pause + announced slides; accordions with aria-expanded and heading structure; gallery arrows labeled; color-contrast on green-on-white CTAs and small mono badges; keyboard-only configurator→quote completion; focus order around proactive chat popups.

**Figure 5 — Discovery flow: proposition → catalogue → capsule detail.**

![K-CAPS user flow](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/03-kcaps/images/03_kcaps_qa_user_flow_sequence_001.jpg)

*QA note: the B2B golden path ends at a quote action, not a purchase — automation should assert spec context survives all three hops.*

---

## 5. Test Scenarios

| ID | Module | Test Scenario | Expected Result | Priority |
|---|---|---|---|---|
| KCAP-001 | Catalogue | Open All K-CAPS, change sort each option | Order changes correctly and persists sensibly | High |
| KCAP-002 | Catalogue | Verify stock badge vs detail availability | Badge truthful on both | High |
| KCAP-003 | Configurator | Build K-CAPS + Size 1 + color → Summary | Summary lists exact selections | Critical |
| KCAP-004 | Configurator | Pick incompatible combo (if any size/material gap) | Blocked with guidance, no quotable invalid spec | Critical |
| KCAP-005 | Configurator | Reset, then Erase | Documented difference honored (defaults vs cleared) | High |
| KCAP-006 | RFQ | Submit quote from configurator with specs | Specs arrive intact; confirmation + reference shown | Critical |
| KCAP-007 | RFQ | Submit from detail, listing, hero, nav CTAs | All reach RFQ with correct product context | High |
| KCAP-008 | RFQ | Double-submit / refresh mid-submit | Single ticket, no data loss | Critical |
| KCAP-009 | Detail | Expand all accordions; check chips vs text | Consistent claims; construction correct | High |
| KCAP-010 | Detail | Gallery arrows + thumbnails | Images cycle; thumbnails sync; alt text present | Medium |
| KCAP-011 | Certifications | Compare cert claims across home/detail/certs page | Zero contradictions (Kosher/Halal/Non-GMO/Vegan) | High |
| KCAP-012 | Search | "HPMC", "Size 1", "enteric", gibberish | Technical terms hit; gibberish empties gracefully | Medium |
| KCAP-013 | Chat | Open chat, ask for quote, close mid-flow | Reachable; never covers CTAs; state sane on close | Medium |
| KCAP-014 | Mobile | Hamburger → catalogue → configurator → quote CTA | All reachable at 390px, no overlap | High |
| KCAP-015 | Carousel | Arrows + dots through all hero slides | Sync correct; pause on hover/focus | Low |
| KCAP-016 | FAQ/Contact | Submit contact with invalid email | Inline error; valid submit confirms + delivers | Medium |

---

## 6. Edge Cases & Negative Testing

- **Impossible configurations:** every type×size×color combination must be validated against manufacturability — an unbuildable combo reaching RFQ wastes sales engineering time and buyer trust.
- **Reset vs Erase semantics:** two destructive actions side by side must differ clearly; verify neither strands the summary in a half-state.
- **Bulk-quantity confusion:** "Box of 125,000" pricing/quote units must be unambiguous (per-box vs per-1,000) everywhere, including the RFQ summary.
- **Certification claim drift:** CMS edits can desync "Kosher and Halal certified" chips from cert-page detail — cross-page claim audits matter because buyers filter vendors on these.
- **Stock badge staleness:** "In stock and ready to ship" cached across sessions could mislead procurement planning; verify refresh behavior.
- **RFQ data loss:** session expiry, validation errors, or back-navigation must preserve long spec messages.
- **Chat overlap:** the assistant bubble demonstrably covers the Erase control — verify across viewports that no widget blocks a destructive or primary action.
- **Duplicate CTAs:** two identical "Get a Quote" buttons stacked on detail (Confirmed) — verify both work identically or consolidate; divergent behavior would be a defect.
- **File attachments (if RFQ allows spec sheets):** type/size limits, malicious files, oversized uploads.
- **Multi-language/region buyers:** 60+ countries — verify currency/unit/terminology consistency and form international inputs (phone formats, company suffixes).

---

## 7. API Testing Approach

No endpoints visible (**Recommended** black-box approach). Map implied resources (products, configurator options, quotes, search, chat) and verify: compatibility matrix served per type (invalid combos never offered); RFQ creation returns a trackable reference; validation errors are field-specific (422) rather than generic 500s; idempotency on RFQ submit; auth/permissions if buyer accounts or saved quotes exist; tamper resistance (altered prices/specs rejected); rate limiting on search/RFQ/chat.

## 8. Database & Data Validation

Schema unknown (approach only). Entities implied: products, specifications, certifications, quotes/RFQs, content pages, chat transcripts. QA approach: spec consistency (detail title ↔ accordions ↔ chips ↔ configurator options — same source of truth); RFQ records complete (product + full spec + contact + timestamp + reference); certification content versioned (claim changes traceable); no orphan RFQs missing product context; catalogue sort/filter reflecting true product attributes; chat transcripts retained per policy.

## 9. Security Testing Perspective

- **Observed:** no login surface visible in captures (B2B RFQ model); forms implied (RFQ/contact); chat widget; no public UGC.
- **QA risks:** RFQ/contact spam and header injection; XSS in reflected search/validation messages; file-upload abuse if spec sheets allowed; chat data handling (PII in transcripts); CMS/admin surface (not visible — verify not exposed); business-email harvesting via RFQ autoresponders; rate limiting on RFQ/search; PII minimization in analytics for quote data.

## 10. Performance Testing Perspective

B2B buyers research on factory networks and mobile: hero/carousel image weight (LCP), configurator interaction latency (option changes must feel instant), catalogue render with full product set, chat widget impact on load, search response time. Suggested scenarios: LCP/CLS budgets on home/catalogue/detail; configurator stress (rapid option switching); concurrent RFQ submission bursts after campaigns; image-optimization audit (responsive sizes, modern formats).

## 11. Automation Strategy

- **UI automation (Recommended — Playwright):** golden path (home→catalogue→detail→RFQ context), full configurator compatibility matrix, sort/accordion/gallery widgets, duplicate-CTA parity check, mobile conversion path.
- **API automation:** RFQ contract tests, idempotency replays, option-matrix validation, invalid-payload suite.
- **Regression automation:** configurator + RFQ + content-claim checks on every CMS/template deploy.
- **CI/CD (Recommended):** PR (lint, unit, API contract, UI smoke) → staging full regression + claim-consistency scan → production deploy → post-deploy smoke (catalogue loads, configurator renders, RFQ endpoint healthy). No existing pipeline evidence.

## 12. QA Tools & Technologies

**Observed (Confirmed):** third-party chat widget; carousel/gallery UI libs (unidentified). Nothing else evidenced.
**Recommended:** Playwright (UI + API + matrix), Postman/REST for RFQ contracts, k6 for burst tests, axe-core + Lighthouse CI for a11y/perf budgets, link/claim crawler for cross-page certification consistency, GitHub Actions-style pipeline per §17.

## 13. Defect Scenarios

| # | Title | Module | Severity / Priority | Business impact |
|---|---|---|---|---|
| D1 | Two identical stacked "Get a Quote" buttons on detail (**Confirmed** in captures — verify intent) | Detail CTA | Medium / High | Confuses buyers; if behaviors diverge, spec context may be lost from one path |
| D2 | Chat bubble overlaps the configurator Erase button (**Confirmed**) | Widgets | Medium / High | Blocks a control; risks accidental erase or missed clicks |
| D3 | Header REQUEST A QUOTE absent on mobile; hero CTA is the only path | Mobile conversion | Medium / Medium | Single point of failure for mobile RFQs |
| D4 | Invalid spec combo quotable (to verify) | Configurator | Critical / Critical | Unmanufacturable quote wastes sales + buyer trust |
| D5 | RFQ arrives without configurator specs (to verify) | RFQ handoff | Critical / Critical | Sales must re-ask; deals stall |
| D6 | Cert claim mismatch across pages (to verify) | Content integrity | High / High | Vendor-list disqualification risk |

Repro pattern (D5): configure K-CAPS Size 1 + color → submit RFQ → inspect confirmation/reference and (with access) the received ticket → Expected: full spec attached → To-verify actual.

## 14. QA Challenges

- **Combinatorial configurator:** type×size×color matrix needs pairwise/model-based coverage, not exhaustive clicking.
- **Content-as-spec:** certifications and spec text ARE the product for B2B buyers — QA must proof claims like data.
- **No-cart conversion:** the "purchase" is an RFQ ticket in someone's inbox — proving delivery requires end-to-end mailbox assertions.
- **Widget collisions:** chat + configurator + sticky CTAs compete for corners; needs a viewport×scroll matrix.
- **Duplicate-action ambiguity:** Reset vs Erase, dual Get-a-Quote — QA must pin exact intended semantics with product before asserting.

## 15. Risk-Based Testing

| Area | Risk | Impact | Likelihood | QA Focus |
|---|---|---|---|---|
| Configurator validity | Unbuildable spec quoted | Critical | Medium | Functional + matrix + API |
| RFQ handoff | Specs lost en route to sales | Critical | Medium | Integration + E2E |
| Cert claims | Contradictory compliance claims | High | Medium | Content + regression |
| RFQ delivery | Ticket never arrives | Critical | Low | Integration + monitoring |
| Mobile conversion | Quote path blocked/hidden | Medium | Medium | Responsive + UI |
| Widgets | Controls covered (chat) | Medium | High | UI + viewports |
| Search | Technical terms miss | Low | Medium | Functional |

## 16. Test Coverage Strategy

- **Smoke:** home, catalogue, one detail, configurator renders, RFQ endpoint reachable.
- **Sanity:** post-CMS-publish spot-checks on touched products/pages.
- **Functional:** configurator matrix, RFQ, sort/search, widgets, accordions, gallery.
- **Regression:** configurator + RFQ + claims + mobile path, every release.
- **Integration:** configurator→RFQ→mailbox/CRM; CMS→pages; search index.
- **API:** options matrix, RFQ contract, idempotency, validation codes.
- **UI:** overlays, duplicates, carousels, loading/empty states.
- **Security:** forms, uploads, XSS, spam, PII.
- **Performance:** LCP/CLS budgets, configurator latency, bursts.
- **Accessibility:** forms, accordions, carousel, keyboard-only RFQ.
- **Compatibility:** 4 browsers × 3 viewport classes.

## 17. CI/CD Quality Gates

No pipeline evidence — proposing (**Recommended**): 1) checkout → 2) install → 3) lint → 4) unit → 5) API contract + matrix tests → 6) UI smoke (Chromium+WebKit) → 7) staging deploy → 8) full regression + claim-crawl → 9) a11y + perf budgets → 10) RFQ mailbox proof → 11) production → 12) post-deploy smoke.

## 18. QA Metrics

Meaningful: **configurator-matrix pass rate**, **RFQ spec-completeness rate** (received tickets with full specs), **RFQ delivery success**, **claim-consistency violations** (automated crawl), **mobile quote-path conversion health**, **regression pass rate**, **defect leakage** on RFQ/configurator, **LCP/CLS**, **MTTR** for RFQ outages. Raw case counts matter less than handoff integrity.

## 19. What I Would Test First

1. **Smoke:** home → catalogue → one detail → configurator renders.
2. **Configurator matrix:** every type through size/color to summary.
3. **RFQ end-to-end:** from configurator AND detail; verify received content.
4. **Duplicate/divergent CTAs:** both Get-a-Quote buttons; Reset vs Erase.
5. **Claims audit:** cert chips vs accordions vs cert page.
6. **Widgets:** chat vs configurator controls across viewports.
7. **Mobile path:** hamburger → catalogue → configurator → quote.
8. **Search sanity:** technical terms + empty state.
9. **Baseline:** lock the above as the regression suite.

**Figure 6 — Product detail: spec title, dual quote CTAs, accordions, certification chips, gallery.**

![K-CAPS product detail](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/03-kcaps/images/03_kcaps_desktop_product_detail_001.jpg)

*QA note: this single viewport contains the audit's two sharpest UI observations — stacked duplicate quote CTAs and certification chips that must match every other page.*

## 20. QA Deliverables

Test plan (B2B/RFQ-weighted) · configurator matrix + scenarios · RFQ contract collection (Recommended) · Playwright regression (Recommended) · defect reports with capture evidence · claim-consistency crawl report · execution reports · traceability matrix · sign-off with RFQ-delivery proof.

## 21. Final QA Assessment

K-CAPS is **medium complexity** with an unusual risk profile: the product is specifications, and the checkout is an email ticket. Captures show a polished catalogue/configurator with concrete issues to resolve (duplicate CTAs, chat/control overlap, mobile CTA scarcity) and one systemic demand — **spec fidelity from configurator to sales inbox**. Focus testing on the compatibility matrix, RFQ handoff integrity, and certification-claim consistency; automate the golden path and the claim crawl; prove RFQ delivery, don't trust success toasts. Highest risk: an unbuildable or spec-less quote reaching manufacturing conversations.

---

## Appendix — Full asset inventory

All captures: [03-kcaps/images/](https://github.com/Zainn09/portfolio-images/tree/main/QA-PORTFOLIO-ASSETS/Sprint-01/03-kcaps/images) · Video + poster: [03-kcaps/video/](https://github.com/Zainn09/portfolio-images/tree/main/QA-PORTFOLIO-ASSETS/Sprint-01/03-kcaps/video/) · Manifest: [asset-manifest.json](https://github.com/Zainn09/portfolio-images/blob/main/QA-PORTFOLIO-ASSETS/Sprint-01/03-kcaps/asset-manifest.json) · Coverage notes: [project README](https://github.com/Zainn09/portfolio-images/blob/main/QA-PORTFOLIO-ASSETS/Sprint-01/03-kcaps/README.md)
