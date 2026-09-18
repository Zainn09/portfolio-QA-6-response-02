# Fandiem — QA Case Study

**Website:** https://fandiem.com · **Type:** Fundraising sweepstakes platform · **Captures:** 2026-09-15 (desktop 1440×900, mobile 390×844)
**Assets:** 13 screenshots + 1 video ([project folder](https://github.com/Zainn09/portfolio-images/tree/main/QA-PORTFOLIO-ASSETS/Sprint-01/01-fandiem)) · **Video:** [homepage-to-sweepstakes discovery flow](https://github.com/Zainn09/portfolio-images/blob/main/QA-PORTFOLIO-ASSETS/Sprint-01/01-fandiem/video/01_fandiem_video_product_journey_001.mp4)

> **Evidence legend used throughout:** **Confirmed** = directly visible in captures/manifests · **Inferred** = reasonable conclusion from structure/UI · **Recommended** = QA practice I suggest, not observed. No source-code access exists for this project; all API/database/CI-CD analysis is black-box.

---

## 1. Project Overview

| | |
|---|---|
| **Project** | Fandiem (fandiem.com) |
| **Description** | A "Donate To Win" platform where fans donate to charity campaigns and earn entries into celebrity-experience sweepstakes (trips, meet-and-greets, signed memorabilia) plus auctions ("Bid To Win") |
| **Domain** | Charitable fundraising × sweepstakes / promotions |
| **Application type** | Consumer web platform with donations, sweepstakes entries, auctions, accounts, content/blog |
| **Target users** | Music fans/donors, charity partners, nonprofit beneficiaries, brand partners |
| **Objective** | Convert fandom into charitable donations via prize incentives |
| **Key functionality** | Sweepstakes discovery, donation-to-entry flow, auctions, winner stories, charity attribution, accounts, search, merch/blog content |
| **Stack** | Not confirmed from captures. Observed client-side: theme toggle, cookie-consent (CAPTAIN), chat widget, mobile PWA install prompt (**Confirmed**: widgets visible; **Inferred**: custom platform — sweepstakes/entry mechanics are not standard e-commerce) |
| **Repository** | None — third-party live site; this is a black-box QA audit (**Confirmed**) |

**Figure 1 — Homepage hero: artist sweepstakes carousel and the 3-step "Donate To Win" model.**

![Fandiem homepage hero](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/01-fandiem/images/01_fandiem_desktop_home_hero_001.jpg)

*QA note: the entire business model is communicated in one viewport (Donate → Gain Entries → Win). Any break in that 3-step chain is a conversion-critical defect, which is why entry attribution is the #1 QA focus below.*

---

## 2. Business Problem

Fandiem solves donor acquisition for charities: traditional donation pages convert poorly, while exclusive artist experiences (cabo trips with Sammy Hagar, Metallica suite passes) motivate giving. Donations flow through "Our Change Foundation, a U.S. 501(c)(3) public charity" (**Confirmed** — footer disclosure), which adds **legal/compliance criticality**: incorrect charity attribution, broken donation receipts, or wrong sweepstakes end-dates aren't just bugs, they're trust and compliance risks.

**If the system fails:** donations without entries (users pay, get nothing), entries without donations (revenue loss), wrong winners announced, expired sweeps accepting money, or misattributed charity funds. Business-critical workflows: donation→entry attribution, sweep lifecycle (live → ended → winner), auction bidding integrity, winner publication.

---

## 3. Product & Feature Breakdown

**Figure 2 — Sweepstakes listing: campaign cards, charity attribution, and the "Ending Soon" rail.**

![Fandiem sweepstakes listing](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/01-fandiem/images/01_fandiem_desktop_collection_listing_001.jpg)

*QA note: every card binds three data points — campaign, charity, and mechanic (SWEEPS vs BID TO WIN). Mismatches here (wrong charity logo, wrong badge) are high-severity content-integrity defects.*

- **Sweep discovery & listing (Confirmed).** Cards show artwork, truncated title, supporting charity + logo, mechanic badge, ENTER NOW CTA, wishlist heart. *QA:* card-to-detail consistency, truncation behavior ("Win a Cabo Getaway to Meet Sammy Hagar at…" — verify full title on detail), 4th-card carousel peek rendering, badge accuracy.
- **Sweep detail (Confirmed).** Breadcrumb, LIVE badge, ENDS date, Enter Now, charity card, tabs (Prize Details / Description / Charity / Tour Dates), itemized prizes with dates. *QA:* every tab must load content; end-date must match entry cutoff logic; prize/event dates must be future-dated and consistent.
- **Donation → entries (Inferred core flow).** *QA:* the money boundary — entry count must exactly match donation tier; failed payments must grant zero entries; double-submits must not double-charge.
- **Auctions — "Bid To Win" (Confirmed: Metallica card).** *QA:* bid increments, outbid notifications, auction end handling, reserve behavior.
- **Winners & winner stories (Confirmed: Winners nav, Recent Blogs winner announcements).** *QA:* winner data accuracy, no pre-announcement leaks, correct campaign linkage.
- **Accounts, search, cart (Confirmed: Log In, search, cart icons).** *QA:* entry history per account, cart/donation totals, search relevance across campaigns.
- **Content & compliance surfaces (Confirmed).** Blog, newsletter subscribe, 501(c)(3) disclosure, cookie consent, charity partner pages. *QA:* subscribe validation, disclosure accuracy, consent persistence.

**Figure 3 — Sweepstakes detail: live status, end date, charity card, tabs, and itemized prizes.**

![Fandiem sweepstakes detail](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/01-fandiem/images/01_fandiem_desktop_product_detail_001.jpg)

*QA note: this page concentrates the highest-risk elements — LIVE/ENDS status, payment entry point, charity attribution, and date-bound prizes. It deserves the deepest test coverage on the site.*

---

## 4. QA Strategy

### Functional Testing
- **Positive:** donate at each tier → exact entries credited; enter free-entry path if offered; auction bid accepted above minimum; winner story links resolve.
- **Negative:** $0/negative donation rejected; expired sweep blocks entry; bid below increment rejected; newsletter rejects malformed email.
- **Boundary:** donation at tier thresholds ($9.99 vs $10.00 entry bands); entry cutoff at the exact ENDS timestamp; 1-entry minimum.
- **Edge:** timezone handling of ENDS dates (09/22/2026 — which timezone?); daylight-saving transitions; leap-day event dates.
- **Error handling:** declined card shows actionable message with zero entries granted; session expiry mid-donation preserves intent or fails safe.

### UI Testing
Layout and dark-theme consistency; dropdown ("Enter To Win") keyboard/mouse behavior; tab switching without content flash; truncated titles/breadcrumbs must expose full text accessibly; wishlist heart state persistence; chat widget must never cover CTAs (**Confirmed risk**: chat bubble overlaps prize text in captures); cookie banner must not permanently block content; loading skeletons on listing; empty states (no live sweeps, no winners yet, empty search).

### API Testing (black-box — no endpoints visible; approach is Recommended)
Exercise the implied donation/entries API surface via UI-chained and direct-request testing: entry-balance endpoint consistency (UI vs API), idempotency keys on donation submit (double-click safety), auth on account/entry-history endpoints, status-code correctness (402/409 on payment issues), schema validation of sweep objects (id, endsAt, charityId, mechanic), and tamper tests (altering entry counts or prices client-side must be rejected server-side).

### Integration Testing
Frontend ↔ payment processor (webhook truth: entries only on settled payment); platform ↔ Our Change Foundation donation records (amounts must reconcile); CMS ↔ listing/detail (publish/unpublish timing); email service (receipts, winner notifications, outbid alerts); analytics (entry events fire once, not per re-render).

### Regression Testing
Lock the money path: donation→entries→receipt, sweep end transition, auction close, login/entry-history, charity attribution, and the compliance footer/disclosures. Any deploy touching checkout, timers, or CMS templates triggers this suite.

### Compatibility Testing
Chrome, Firefox, Safari, Edge (latest + one back); desktop 1440/1280, tablet 768, mobile 390/360. The countdown/LIVE logic and payment widgets are the cross-browser risks.

### Responsive Testing
**Figure 4 — Responsive comparison: desktop grid vs. mobile stacked layout.**

![Fandiem responsive comparison](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/01-fandiem/images/01_fandiem_responsive_comparison_001.jpg)

*QA note: mobile collapses to hamburger + stacked cards — but the captures show the PWA "Install app" prompt rendering on top of the cookie notice, a double-overlay state that must be tested for dismissal order and content blocking.*

Validate: hamburger menu completeness vs desktop nav, ENTER NOW reachability without horizontal scroll, tab overflow behavior on 390px, overlay stacking order (cookie → PWA → chat), and touch-target sizes on hearts/badges.

### Accessibility Testing
Carousel needs pause control + announced slide changes; countdown must be screen-reader announced without spam (aria-live polite, throttled); gradient CTA text contrast; focus-visible states on dark theme; tabs must follow tablist keyboard pattern; truncated text needs full accessible names; cookie/chat widgets must be Esc-dismissible and focus-trapped appropriately.

**Figure 5 — Discovery flow: home → trending campaigns → sweepstakes detail.**

![Fandiem user flow](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/01-fandiem/images/01_fandiem_qa_user_flow_sequence_001.jpg)

*QA note: this is the golden path to automate first — a break at any of the three hops (hero carousel link, card link, detail render) kills conversion.*

---

## 5. Test Scenarios

| ID | Module | Test Scenario | Expected Result | Priority |
|---|---|---|---|---|
| FAND-001 | Discovery | Open home → click hero sweep card | Correct sweep detail loads with matching title/artwork | High |
| FAND-002 | Discovery | Click ENTER NOW on listing card | Lands on that campaign's entry flow, charity matches card | High |
| FAND-003 | Entries | Donate $25 tier (2× entries promo if shown) | Exact entries credited; receipt emailed | Critical |
| FAND-004 | Entries | Submit donation twice rapidly (double-click) | Single charge, single entry grant (idempotent) | Critical |
| FAND-005 | Entries | Donate with declined card | Clear error; zero entries; no receipt | Critical |
| FAND-006 | Lifecycle | View sweep 1 min before ENDS, enter, then past ENDS | Entry accepted before, blocked after with "ended" state | Critical |
| FAND-007 | Detail | Switch all four tabs | Each tab loads correct content, no layout jump | High |
| FAND-008 | Charity | Verify charity card vs footer disclosure | Charity name/logo consistent everywhere; 501(c)(3) note present | High |
| FAND-009 | Auction | Place bid below minimum increment | Rejected with minimum shown | High |
| FAND-010 | Auction | Get outbid | Outbid notice; bid history updates | Medium |
| FAND-011 | Winners | Open Winners page + a winner story | Winner, campaign, and date consistent; no future-dated winners | High |
| FAND-012 | Account | Log in → view entry history | All entries listed with campaign/date/count | High |
| FAND-013 | Search | Search "Sammy" and gibberish "zzzqx" | Relevant results; graceful empty state | Medium |
| FAND-014 | Newsletter | Subscribe with invalid then valid email | Inline error, then success confirmation | Medium |
| FAND-015 | Consent | Reject cookies → reload → finish entry flow | Choice persists; flow works without tracking cookies | High |
| FAND-016 | Mobile | Complete discovery→detail on 390px | No overlap, no horizontal scroll, CTA reachable | High |
| FAND-017 | Themes | Toggle dark/light mid-flow | No unreadable text; state preserved | Medium |
| FAND-018 | Wishlist | Heart a sweep, reload, unheart | State persists then clears correctly | Low |

---

## 6. Edge Cases & Negative Testing

- **Entry cutoff at ENDS timestamp:** requests in-flight across the boundary must resolve deterministically (accepted-or-rejected, never half-credited). Matters: money + fairness.
- **Timezone ambiguity:** "ENDS: 09/22/2026" with no timezone shown — verify server-truth vs displayed time across US timezones. Matters: users entering "late."
- **Free-entry path (AMOE):** US sweepstakes typically require a no-purchase entry method — verify it exists, works, and grants equal odds. Matters: legal compliance.
- **Residency/age eligibility:** sweepstakes are jurisdiction-restricted — verify ineligible users are blocked with a clear reason, not a silent failure.
- **Double-submit / refresh mid-payment:** back-button and refresh during donation must never duplicate charges.
- **Auction snipe at close:** bids in the final seconds need deterministic accept/reject + visible close state.
- **Chat/cookie/PWA overlay stack:** three widgets compete for the viewport corner — verify dismissal order and that none permanently traps CTA access.
- **Truncated content:** card titles, breadcrumbs, and the "SWEEI…" badge show truncation — verify full values survive (title attributes, detail pages, accessible names).
- **Ended-sweep deep links:** shared URLs to finished campaigns must show winner/ended state, not a broken entry form.
- **Concurrent campaigns, same charity:** two live sweeps for MusiCares must attribute donations/entries to the correct campaign ID.

---

## 7. API Testing Approach

No API surface is visible in captures (no docs, no network evidence) — so this section is **Recommended** black-box practice, not a claim about existing endpoints. Strategy: map the implied surface (sweeps, entries, donations, bids, users, content) by observing UI behavior, then validate: entry-balance consistency between UI and API after every donation; idempotency on donation/bid submits; auth enforcement on account and entry-history reads; 4xx correctness on invalid payloads (negative amounts, unknown campaign IDs, malformed tiers); server-side price/entry validation immune to client tampering; webhook reconciliation between payment processor and entry ledger; and rate limiting on bid/entry endpoints.

## 8. Database & Data Validation

Schema unknown (**no evidence** — approach only). The entities that must exist: users, campaigns, charities, donations, entries, bids, winners, content. QA approach: donation↔entry reconciliation (every settled donation has exactly the right entries; every entry traces to a donation or free-entry record); campaign lifecycle states (draft→live→ended→winner-announced) with no illegal transitions; charity attribution integrity (campaign.charity_id immutable after first donation); winner records locked post-announcement; no orphan entries pointing at deleted campaigns; timezone-safe UTC storage for ENDS timestamps with correct localized display.

## 9. Security Testing Perspective

- **Observed:** login/accounts exist, payments implied, cookie consent via CAPTAIN, user-generated surface limited to newsletter/contact (no evidence of public UGC).
- **QA risks to test:** entry/payment tampering (client-side price or entry-count manipulation); insecure direct object references (viewing other users' entries by ID guessing); auction bid manipulation; session fixation/timeout on donation flow; XSS in search/newsletter/reflected error messages; CSRF on entry/bid submits; PII exposure in receipts and winner announcements (winners should be limited-consent disclosures); charity-fund reconciliation (donation totals vs foundation records); rate limiting on login, search, and entry endpoints.

## 10. Performance Testing Perspective

Traffic spikes around artist announcements and sweep endings are the risk: listing/detail page load under spike; countdown accuracy under load (client drift vs server truth); concurrent last-minute entries and auction bids; image-heavy card grids (lazy loading, responsive sizes); chat/consent third-parties must not block first paint; search latency on campaign catalog. Suggested scenarios: 10× normal traffic for 30 min pre-ENDS on a flagship sweep; sustained bid rate test on auction close; homepage LCP/CLS budget checks with carousel + overlays active.

## 11. Automation Strategy

- **UI automation (Recommended — Playwright):** golden-path discovery→detail→(mocked)entry flow; tab switching; sweep end-state transition; newsletter validation; consent persistence; critical mobile flows at 390px.
- **API automation:** entry-balance checks, idempotency replays, invalid-payload matrix, webhook reconciliation checks.
- **Regression automation:** money path + lifecycle + attribution + compliance surfaces, run on every deploy.
- **CI/CD (Recommended):** PR checks (lint, unit, API contract, UI smoke on Chromium+WebKit) → staging full regression + accessibility scan → production post-deploy smoke (homepage, one live sweep, donation widget loads) with rollback on failure. No existing pipeline evidence — all Recommended.

## 12. QA Tools & Technologies

**Observed in use (Confirmed):** CAPTAIN (cookie compliance); third-party chat widget; PWA install prompt (mobile). No test frameworks, CI configs, or API tooling visible — correctly reported as unknown.
**Recommended:** Playwright (UI + API + mobile viewports), Postman/REST suites for entry/payment contract tests, k6 for pre-ENDS spike tests, axe-core for accessibility scans, Lighthouse CI budgets for LCP/CLS, GitHub Actions (or equivalent) for the pipeline above.

## 13. Defect Scenarios (potential — labeled; none executed live)

| # | Title | Module | Severity / Priority | Business impact |
|---|---|---|---|---|
| D1 | Chat widget overlaps prize-detail text on sweep pages (**Confirmed** in captures) | UI overlay | Medium / High | Obscures prize terms users must read before paying |
| D2 | PWA install prompt stacks above cookie notice on mobile, blocking content | Mobile overlays | Medium / High | Double-blocked viewport on first mobile visit |
| D3 | 4th listing card clipped with badge truncated to "SWEEI…" | Listing carousel | Low / Medium | Sloppy merchandising; badge unreadable |
| D4 | Duplicate/conflicting entry grant on double-submit (to verify) | Entries | Critical / Critical | Double charge or phantom entries |
| D5 | Expired sweep still accepts entries for a grace window (to verify) | Lifecycle | Critical / Critical | Taking money for a closed contest |
| D6 | Charity logo/name mismatch between card and detail (to verify) | Attribution | High / High | Donations credited to the wrong cause |

Reproduction pattern (example D5): open a sweep within 2 minutes of ENDS → proceed to entry → submit after ENDS passes → Expected: blocked with ended state → To-verify actual. Each would be filed with capture evidence, timestamp, and timezone.

## 14. QA Challenges

- **Money boundary without code access:** entries must reconcile to payments purely through black-box probing (donation → balance → receipt triangulation).
- **Time-dependent behavior:** ENDS cutoffs, countdowns, auction closes need clock-control testing (staging time-travel or short-lived test sweeps).
- **Compliance surface:** 501(c)(3) disclosure, eligibility rules, free-entry path — QA must read like a regulator, not just a user.
- **Overlay wars:** cookie + chat + PWA + countdowns compete for attention and pixels; matrix-test their combinations.
- **Content velocity:** campaigns launch/end constantly — regression must target templates and lifecycle engine, not individual sweeps.

## 15. Risk-Based Testing

| Area | Risk | Impact | Likelihood | QA Focus |
|---|---|---|---|---|
| Entry attribution | Pay without entries / entries without pay | Critical | Medium | Functional + API + reconciliation |
| Sweep lifecycle | Late entries accepted / early cutoff | Critical | Medium | Boundary + timezone + regression |
| Charity attribution | Funds linked to wrong charity | High | Low | Content integrity + data |
| Auctions | Bid loss/manipulation at close | High | Medium | Functional + concurrency |
| Compliance | Missing eligibility/free-entry path | High | Medium | Requirements + legal review |
| Overlays | Blocked CTAs on mobile | Medium | High | UI + responsive |
| Winners | Wrong/early winner data | High | Low | Data + access control |

## 16. Test Coverage Strategy

- **Smoke:** home loads, one sweep detail renders, donation widget mounts, login works.
- **Sanity:** after CMS publish — affected campaign renders with correct charity/dates.
- **Functional:** full entry, auction, account, search, content matrix.
- **Regression:** money path, lifecycle, attribution, compliance (every release).
- **Integration:** payments↔entries, CMS↔pages, email receipts/notifications.
- **API:** entry balances, idempotency, auth, invalid payloads.
- **UI:** overlays, truncation, tabs, theme toggle, loading/empty states.
- **Security:** tampering, IDOR, XSS/CSRF, PII handling.
- **Performance:** pre-ENDS spike, auction close, image budgets.
- **Accessibility:** carousel, countdown announcements, tabs, contrast, focus.
- **Compatibility:** 4 browsers × desktop/tablet/mobile viewports.

## 17. CI/CD Quality Gates

No pipeline evidence exists — proposing (**Recommended**): 1) checkout → 2) install → 3) lint/typecheck → 4) unit tests → 5) API contract + idempotency tests → 6) UI smoke (Chromium + WebKit, desktop + 390px) → 7) staging deploy → 8) full regression incl. lifecycle/time tests → 9) accessibility + Lighthouse budgets → 10) manual sign-off on money path → 11) production deploy → 12) post-deploy smoke + entry-balance reconciliation check.

## 18. QA Metrics

Meaningful here: **entry-reconciliation rate** (donations↔entries, must be 100%), **critical-path coverage** (discovery→entry→receipt), **regression pass rate** on money path, **defect leakage** to production on payment/lifecycle, **pre-ENDS incident count**, **accessibility violations** on entry flow, **LCP/CLS** on listing/detail, **MTTD/MTTR** for payment incidents. Vanity coverage % matters less than reconciliation integrity.

## 19. What I Would Test First

1. **Smoke:** home, one sweep detail, donation widget, login — 15 minutes.
2. **Money path:** smallest donation tier end-to-end incl. receipt and entry balance.
3. **Lifecycle:** find a sweep ending soonest; verify countdown, cutoff, and ended state.
4. **Attribution:** charity on card vs detail vs receipt vs footer disclosure.
5. **Overlays:** cookie reject → chat → PWA on mobile; confirm CTAs reachable.
6. **Tabs/content:** all four detail tabs + footer links (rules/FAQs/contact).
7. **Auction:** bid flow on the Metallica-style lot if live.
8. **Accessibility pass:** keyboard-only entry flow + screen-reader tab order.
9. **Regression baseline:** record the above as the repeatable suite.

**Figure 6 — Footer: winner-story content, newsletter, link architecture, and the 501(c)(3) disclosure.**

![Fandiem footer and blogs](https://raw.githubusercontent.com/Zainn09/portfolio-images/main/QA-PORTFOLIO-ASSETS/Sprint-01/01-fandiem/images/01_fandiem_project_highlight_donation_journey_001.jpg)

*QA note: the footer carries legal weight (foundation disclosure) and breadth (auctions, club, merch, nonprofits) — every link is a promise to verify, and the disclosure text must be pixel-accurate.*

## 20. QA Deliverables

Test plan (black-box, risk-weighted) · scenario matrix (Section 5 expanded) · API contract collection (Recommended) · Playwright regression suite (Recommended) · defect reports with capture evidence · execution reports per release · traceability matrix (requirements→scenarios→evidence) · sign-off checklist with entry-reconciliation proof.

## 21. Final QA Assessment

Fandiem is a **medium-high complexity** platform where the hardest QA problems are invisible: entry attribution, lifecycle timing, and compliance — not page layouts. The captures show a polished, content-rich front end with real overlay-management risks (chat/cookie/PWA collisions) and merchandising details to tighten (truncation, carousel peeks). Main focus: **money-path reconciliation, ENDS-cutoff determinism, charity attribution, and auction integrity**, backed by automated regression on the golden path and spike testing around endings. Highest risk: anything that takes money without granting exactly the right entries. Recommended improvements: deterministic cutoff behavior with visible timezone, overlay stacking rules, idempotent submits, and a public free-entry path verified end-to-end.

---

## Appendix — Full asset inventory

All captures: [01-fandiem/images/](https://github.com/Zainn09/portfolio-images/tree/main/QA-PORTFOLIO-ASSETS/Sprint-01/01-fandiem/images) · Video + poster: [01-fandiem/video/](https://github.com/Zainn09/portfolio-images/tree/main/QA-PORTFOLIO-ASSETS/Sprint-01/01-fandiem/video/) · Manifest: [asset-manifest.json](https://github.com/Zainn09/portfolio-images/blob/main/QA-PORTFOLIO-ASSETS/Sprint-01/01-fandiem/asset-manifest.json) · Coverage notes: [project README](https://github.com/Zainn09/portfolio-images/blob/main/QA-PORTFOLIO-ASSETS/Sprint-01/01-fandiem/README.md)
