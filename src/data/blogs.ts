export interface StaticBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readMinutes: number;
  trending?: boolean;
  series?: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
}

export const staticBlogPosts: StaticBlogPost[] = [
  {
    slug: "ai-assisted-qa-shopify-faster",
    title: "AI-Assisted QA: How I Test Shopify Stores Faster (Without Trusting AI Blindly)",
    excerpt:
      "AI won't replace a QA specialist — but it makes a good one dramatically faster. Here's exactly where AI helps in my Shopify audits, and where human judgment still wins.",
    category: "AI × QA",
    tags: ["AI Testing", "Shopify QA", "Workflow", "2026 Trends"],
    author: "QA Specialist",
    publishedAt: "2026-09-02T09:00:00Z",
    readMinutes: 7,
    trending: true,
    series: "AI × QA Series",
    content: `
<p>Every merchant I talk to in 2026 asks the same question: <em>can't AI just test my store?</em> The honest answer is: partly — and the <em>partly</em> matters more than ever. After running AI-assisted audits on more than a dozen Shopify stores this year, here is my field-tested breakdown of where AI genuinely helps, and where it quietly fails.</p>
<h2>Where AI genuinely speeds up QA</h2>
<p>The biggest win is <strong>test planning</strong>. I feed an AI model the store's sitemap, theme structure, and list of installed apps, and within minutes I have a first-draft test matrix: pages × devices × user states. What used to take half a day of spreadsheet work now takes twenty minutes of review and refinement.</p>
<ul>
<li><strong>Regression checklists</strong> — AI drafts them from changelogs and past bug reports with surprising accuracy.</li>
<li><strong>Edge-case brainstorming</strong> — models are excellent at combinatorial thinking: every discount type × every cart state × every shipping zone.</li>
<li><strong>Bug report polishing</strong> — my raw reproduction notes become crisp, developer-ready tickets in seconds.</li>
<li><strong>Accessibility first-pass</strong> — automated scans plus AI triage catch roughly 40% of WCAG issues before I touch a keyboard.</li>
</ul>
<h2>Where AI still fails quietly</h2>
<p>The danger zone is <strong>silent confidence</strong>. AI test agents report green checkmarks for flows they never truly understood. The classic misses I keep seeing:</p>
<ul>
<li>Discount codes that <em>apply</em> but calculate the wrong total — the agent verifies the success message, not the math.</li>
<li>Mobile layouts where the CTA is technically present but unreachable behind the iOS browser chrome.</li>
<li>Checkout flows that complete in test mode but fail with real 3D-Secure payment methods.</li>
</ul>
<blockquote>AI verifies what you asked it to verify. A QA specialist questions whether you asked the right thing.</blockquote>
<h2>My 2026 workflow: AI drafts, humans decide</h2>
<p>The formula that works: AI generates breadth (hundreds of test cases, fast), and I provide depth (judgment about what actually matters for conversions). Every AI-generated test result gets human verification before it goes into a client report. No exceptions.</p>
<p>The stores that get the best results treat AI as a junior tester with infinite stamina — brilliant at coverage, hopeless at taste. Pair it with a specialist who has broken fifty stores before, and you get the fastest, most thorough audit either could deliver alone.</p>
`,
    seoTitle: "AI-Assisted QA for Shopify: Faster Audits Without Blind Trust",
    seoDescription:
      "How AI speeds up Shopify QA testing in 2026 — test planning, edge cases, bug reports — and where human QA specialists still win.",
  },
  {
    slug: "ai-agent-tested-shopify-checkout-what-it-missed",
    title: "I Let an AI Agent Test a Shopify Checkout. Here's Everything It Missed.",
    excerpt:
      "An experiment: I gave a leading AI test agent a real Shopify Plus checkout and compared its report against my manual audit. The AI found 6 issues. I found 19. Here's the gap.",
    category: "AI × QA",
    tags: ["AI Testing", "Checkout", "Experiments", "Shopify Plus"],
    author: "QA Specialist",
    publishedAt: "2026-08-24T09:00:00Z",
    readMinutes: 8,
    trending: true,
    series: "AI × QA Series",
    content: `
<p>To settle the debate properly, I ran a controlled experiment: the same Shopify Plus checkout, tested twice — once by a leading autonomous AI test agent, once by me. Same scope, same time budget, same store. Then I compared the reports line by line.</p>
<h2>The scoreboard</h2>
<ul>
<li><strong>AI agent:</strong> 6 issues found, 0 false positives, 40 minutes runtime</li>
<li><strong>Manual audit:</strong> 19 issues found, 0 false positives, 3 hours</li>
</ul>
<p>The AI deserves credit: all 6 of its findings were real, and it caught a broken express-checkout button I initially glossed over. But the 13 issues it missed tell the real story.</p>
<h2>What the AI missed (and why)</h2>
<p><strong>1. The discount math was wrong.</strong> A 20%-off code applied successfully — green banner, no errors. But the line-item total was calculated on the pre-discount variant price. The agent verified the success state. I verified the arithmetic.</p>
<p><strong>2. Shipping rates vanished for one zone.</strong> The agent tested checkout with a single default address. My matrix covered 12 zones, and zone 9 returned an empty rate array with no error message — a silent conversion killer for an entire country.</p>
<p><strong>3. The mobile keyboard buried the discount field.</strong> On real Android devices, opening the keyboard pushed the discount input off-screen with no scroll-into-view. The agent tested in a desktop-emulated viewport and never saw it.</p>
<p><strong>4. Back-button amnesia.</strong> Navigating back from payment to shipping wiped the selected pickup location. AI agents rarely test back-navigation because their scripts move forward through the happy path.</p>
<h2>The pattern behind the gap</h2>
<blockquote>AI agents test the path. Specialists test the journey — including every way a real customer deviates from it.</blockquote>
<p>Every miss shared a root cause: the AI verified <em>states</em> (page loaded, button clicked, success shown) while I verified <em>meaning</em> (is the total right? can a thumb reach this? what happens when the customer hesitates, goes back, or uses an old phone?).</p>
<h2>The takeaway for merchants</h2>
<p>Run the AI agent — it's cheap, fast, and catches the obvious. Then hire a specialist for everything the obvious hides. In this experiment, the AI found the issues worth hundreds. The manual audit found the ones worth thousands.</p>
`,
    seoTitle: "AI Agent vs Human QA: Testing a Shopify Checkout (Experiment)",
    seoDescription:
      "An AI test agent found 6 checkout issues. A manual audit found 19. A line-by-line comparison of what AI checkout testing still misses in 2026.",
  },
  {
    slug: "2026-ai-testing-stack-shopify-qa",
    title: "The 2026 AI Testing Stack for Shopify QA: Tools, Prompts & Guardrails",
    excerpt:
      "The exact AI-assisted stack I use on Shopify audits this year: which tools earn their place, the prompts that produce usable test plans, and the guardrails that keep AI honest.",
    category: "AI × QA",
    tags: ["AI Testing", "Tools", "Prompts", "Workflow"],
    author: "QA Specialist",
    publishedAt: "2026-08-12T09:00:00Z",
    readMinutes: 9,
    trending: true,
    series: "AI × QA Series",
    content: `
<p>After a year of testing AI testing tools on real Shopify stores, most of them didn't survive contact with a real checkout. This is the stack that did — the tools, prompts, and guardrails I actually use on client audits in 2026.</p>
<h2>The stack (4 tools, zero fluff)</h2>
<ul>
<li><strong>1. A frontier LLM with browsing</strong> — for test-plan generation, changelog analysis, and app-documentation research. The model matters less than the prompt; any current-generation model works.</li>
<li><strong>2. An autonomous browser agent</strong> — for happy-path smoke tests across staging after every deploy. Cheap, fast, and honest about what it can see.</li>
<li><strong>3. An accessibility scanner with AI triage</strong> — axe-core style scanning plus AI grouping of violations by template, so one fix pattern resolves dozens of instances.</li>
<li><strong>4. A visual regression tool</strong> — screenshot diffing across breakpoints on every theme change. AI reduces the noise by ignoring anti-aliasing and dynamic content.</li>
</ul>
<h2>The prompt that produces usable test plans</h2>
<p>The difference between AI slop and a usable test matrix is context. My base prompt always includes: the store's sitemap, the theme name and key customisations, the app list, the checkout type (one-page vs three-page), and the last three bug reports. Then one critical instruction:</p>
<blockquote>Generate test cases as falsifiable assertions with exact reproduction steps. For every happy path, generate at least two deviation paths: one interruption (back button, session expiry, network drop) and one edge input (boundary quantity, special characters, expired discount).</blockquote>
<p>That single instruction roughly doubles the useful output. Happy paths are commodities; deviation paths are where the bugs live.</p>
<h2>The guardrails that keep AI honest</h2>
<ul>
<li><strong>Rule 1: AI never closes a test.</strong> Agents propose pass/fail; a human confirms. Every AI-reported pass on checkout or payment flows gets spot-checked manually.</li>
<li><strong>Rule 2: totals are always hand-verified.</strong> Any price, discount, tax, or shipping calculation the AI touches gets re-verified with a calculator and real payment methods.</li>
<li><strong>Rule 3: real devices for real verdicts.</strong> Emulated viewports are for triage only. Anything customer-facing ships only after real-device confirmation.</li>
<li><strong>Rule 4: the client sees the method.</strong> My reports mark which findings are AI-surfaced vs human-verified. Transparency builds trust — and it keeps me accountable.</li>
</ul>
<h2>What I'd skip</h2>
<p>AI-generated automated test scripts for Shopify themes still break on every other theme update, and the maintenance cost exceeds the manual re-test cost for most stores under Plus scale. Record-and-replay tools have the same fragility. Until self-healing actually heals, I rent AI for thinking and keep execution human.</p>
`,
    seoTitle: "2026 AI Testing Stack for Shopify QA: Tools, Prompts & Guardrails",
    seoDescription:
      "The 4-tool AI testing stack for Shopify QA in 2026, the test-plan prompt that works, and 4 guardrails that keep AI-assisted audits honest.",
  },
  {
    slug: "shopify-checkout-testing-checklist",
    title: "The Shopify Checkout Testing Checklist I Use on Every Store",
    excerpt:
      "Checkout is where revenue is won or silently lost. The complete 25-point checklist I run on every Shopify and Shopify Plus store — from discount math to 3D-Secure.",
    category: "Checkout",
    tags: ["Checkout", "Checklist", "Shopify Plus", "Payments"],
    author: "QA Specialist",
    publishedAt: "2026-07-28T09:00:00Z",
    readMinutes: 10,
    content: `
<p>Checkout bugs are uniquely cruel: the customer did everything right, and the store still said no. Over 50+ audits, I've distilled checkout testing into a 25-point checklist. Here it is — the same list I run on every store, from startup to Shopify Plus.</p>
<h2>Cart to checkout handoff (1–5)</h2>
<ul>
<li>Cart contents survive the transition to checkout exactly — quantities, variants, properties.</li>
<li>Discount codes entered in cart persist; codes entered at checkout apply to the correct base price.</li>
<li>Archived or out-of-stock variants fail loudly with a clear message — never silently vanish.</li>
<li>Estimated totals in cart match the first checkout step to the penny.</li>
<li>Guest, new-account, and returning-customer paths all reach checkout independently.</li>
</ul>
<h2>Shipping and delivery (6–11)</h2>
<ul>
<li>Every shipping zone returns rates — especially international zones and remote postcodes.</li>
<li>Weight and price boundaries are tested: just under, exactly at, and just over each tier.</li>
<li>Pickup locations display correct addresses, hours, and availability.</li>
<li>Changing the address after selecting shipping re-quotes rates instead of keeping stale ones.</li>
<li>Express checkout (Shop Pay, Apple Pay, Google Pay) shows correct shipping options.</li>
<li>Digital-only carts skip shipping entirely without dead ends.</li>
</ul>
<h2>Payment (12–18)</h2>
<ul>
<li>Cards: valid, declined, expired, and 3D-Secure challenge flows — each with correct messaging.</li>
<li>Digital wallets complete end-to-end on real iOS and Android devices, not emulators.</li>
<li>BNPL options (Klarna, Afterpay) handle approval, denial, and cancellation redirects.</li>
<li>Currency and language selectors keep the customer in checkout instead of restarting it.</li>
<li>Payment errors preserve all entered data — nothing the customer typed is lost.</li>
<li>Duplicate-submit protection: double-tapping Pay creates exactly one order.</li>
<li>Test-mode vs live-mode behaviour is documented so staging results aren't mistaken for proof.</li>
</ul>
<h2>Post-purchase (19–25)</h2>
<ul>
<li>Order confirmation page shows correct items, totals, and delivery estimates.</li>
<li>Confirmation emails render in Gmail, Apple Mail, and Outlook with images and links intact.</li>
<li>Post-purchase upsells can be declined without breaking the order.</li>
<li>Customer accounts reflect the order immediately with accurate status.</li>
<li>Back-button and refresh behaviour at every step: no duplicate orders, no wiped data.</li>
<li>Accessibility: the full flow completes keyboard-only, with announced errors and visible focus.</li>
<li>Analytics: purchase events fire once, with correct value, currency, and item data.</li>
</ul>
<blockquote>A checkout that works for you on your MacBook in test mode has proven almost nothing. This checklist exists to prove the rest.</blockquote>
<p>Run it before every launch, every theme change, and every BFCM. Or hand it to someone who enjoys breaking things — that's literally what I do.</p>
`,
    seoTitle: "Shopify Checkout Testing Checklist (25 Points) | QA Guide",
    seoDescription:
      "The complete 25-point Shopify checkout testing checklist: cart handoff, shipping zones, payments, 3D-Secure, post-purchase and accessibility.",
  },
  {
    slug: "eaa-accessibility-shopify-2026",
    title: "Accessibility Is the Law Now: EAA-Proofing Your Shopify Store in 2026",
    excerpt:
      "The European Accessibility Act is in force, and Shopify stores selling into the EU are in scope. What the law requires, the 7 failures I find most, and how to fix them.",
    category: "Accessibility",
    tags: ["Accessibility", "EAA", "WCAG", "Compliance"],
    author: "QA Specialist",
    publishedAt: "2026-07-10T09:00:00Z",
    readMinutes: 8,
    content: `
<p>Since June 2025, the European Accessibility Act requires e-commerce stores serving EU customers to be accessible — and enforcement in 2026 is no longer theoretical. If you sell into the EU on Shopify, accessibility moved from "nice to have" to "legal requirement." Here's what that means in practice.</p>
<h2>What the EAA actually requires of your store</h2>
<p>The EAA points to WCAG 2.1 Level AA as the bar. In plain terms: every customer journey — browse, search, configure, cart, checkout, account — must be perceivable, operable, understandable, and robust for people using keyboards, screen readers, magnification, or voice control. No exceptions for "the theme came like that."</p>
<h2>The 7 failures I find on almost every store</h2>
<ul>
<li><strong>1. Unlabelled form fields.</strong> Placeholders masquerading as labels. Screen readers announce nothing; the EAA notices.</li>
<li><strong>2. Keyboard traps — or the opposite.</strong> Modals that don't trap focus let keyboard users tab into the void behind the overlay.</li>
<li><strong>3. Contrast failures on CTAs.</strong> Brand colours that look premium and read at 2.8:1. AA requires 4.5:1 for text.</li>
<li><strong>4. Variant selectors.</strong> Colour-only swatches with no text alternative — unusable for colour-blind customers.</li>
<li><strong>5. Silent errors.</strong> Checkout validation that turns a border red without announcing what went wrong.</li>
<li><strong>6. Inaccessible mega-menus.</strong> Hover-only navigation that keyboard users can never open.</li>
<li><strong>7. Focus that goes nowhere.</strong> After closing a drawer or dialog, focus should return to the trigger. Usually it drops to the top of the page.</li>
</ul>
<h2>How to EAA-proof a Shopify store (in order)</h2>
<p><strong>Step 1: audit the money path first.</strong> Product → cart → checkout → confirmation. If any step blocks assistive technology, that's your highest legal and revenue risk combined.</p>
<p><strong>Step 2: fix templates, not pages.</strong> Most failures repeat from shared templates — one product-template fix can resolve hundreds of instances. Prioritise by template reach.</p>
<p><strong>Step 3: audit your apps.</strong> Reviews, upsells, search, and loyalty widgets are the worst accessibility offenders on most stores. If a vendor can't provide a VPAT or fix timeline, shortlist alternatives.</p>
<p><strong>Step 4: document everything.</strong> The EAA rewards demonstrable effort: an audit trail of findings, fixes, and re-tests is both a compliance asset and a QA asset.</p>
<blockquote>Accessibility work is QA work with a legal deadline. The stores treating it as a one-off project will redo it; the stores building it into QA will be done.</blockquote>
<p>I run EAA-focused audits that map every finding to its WCAG criterion and its fix — so your developers get tickets, not lectures.</p>
`,
    seoTitle: "EAA-Proofing Your Shopify Store in 2026 | Accessibility QA",
    seoDescription:
      "The European Accessibility Act is in force. The 7 accessibility failures found on most Shopify stores and a 4-step plan to reach WCAG 2.1 AA.",
  },
  {
    slug: "responsive-qa-768px-field-guide",
    title: "Why Your Store Breaks at 768px: A Responsive QA Field Guide",
    excerpt:
      "Stores look perfect at phone and desktop sizes — then fall apart on tablets and small laptops. A field guide to the in-between breakpoints where responsive bugs hide.",
    category: "Responsive",
    tags: ["Responsive", "Mobile", "CSS", "Devices"],
    author: "QA Specialist",
    publishedAt: "2026-06-22T09:00:00Z",
    readMinutes: 6,
    content: `
<p>Here's a pattern I've seen on dozens of stores: flawless at 390px, flawless at 1440px, quietly broken everywhere between. Tablets, small laptops, unfolded foldables, and resized desktop windows live in the breakpoints nobody designed for. Welcome to the 768px problem.</p>
<h2>Why the middle breaks</h2>
<p>Most Shopify themes are designed mobile-first with a couple of major breakpoints (often 750px and 990px). Components get full attention at the extremes and interpolation in the middle. The casualties are predictable:</p>
<ul>
<li><strong>Navigation limbo</strong> — too wide for the hamburger, too narrow for the full menu. Items wrap, overlap, or clip.</li>
<li><strong>Grid orphans</strong> — 4-column grids collapsing to 3 columns leave a single lonely product on the last row, often misaligned.</li>
<li><strong>Sticky collisions</strong> — sticky headers, announcement bars, and chat widgets stack into a wall that eats half the viewport.</li>
<li><strong>Type that doesn't scale</strong> — fluid type with bad clamp() bounds renders either microscopic or overflowing.</li>
<li><strong>Tables and comparison tools</strong> — fine on desktop, scrollable on mobile, awkwardly half-visible in between.</li>
</ul>
<h2>The breakpoint testing protocol</h2>
<p>Forget testing two sizes. My responsive pass covers <strong>six widths</strong> on real rendering engines: 360, 390, 768, 834, 1024, and 1280 — plus one fluid drag-through where I slowly resize the window and watch for jumps, overlaps, and layout thrash.</p>
<p>The drag-through is the highest-value minute in responsive QA. Automated screenshot tools compare discrete sizes; only the human eye catches the 40-pixel band where the mega-menu flickers or the sticky bar doubles up.</p>
<h2>Fix patterns that actually hold</h2>
<ul>
<li>Container queries over media queries for reusable components — cards that adapt to their slot, not the viewport.</li>
<li>Explicit min/max bounds on every clamp() — fluid type needs guardrails at both ends.</li>
<li>One sticky element per viewport edge, with z-index and offset contracts documented in the theme.</li>
<li>Horizontal scroll regions (tables, carousels) with visible affordances — if it scrolls, it must look scrollable.</li>
</ul>
<blockquote>Responsive QA isn't testing two designs. It's testing the hundred silent compromises between them.</blockquote>
<p>If your analytics show tablet traffic converting below mobile, the middle breakpoints are your prime suspect. I can prove it in about a week.</p>
`,
    seoTitle: "Why Shopify Stores Break at 768px | Responsive QA Guide",
    seoDescription:
      "The in-between breakpoints where Shopify stores break: nav limbo, grid orphans, sticky collisions — plus a 6-width testing protocol that catches them.",
  },
];

export const getStaticPost = (slug: string) =>
  staticBlogPosts.find((p) => p.slug === slug);

export const getTrendingPosts = () =>
  staticBlogPosts.filter((p) => p.trending);
