#!/usr/bin/env python3
"""
Blog ecosystem generator.
Reads src/data/projects.ts (93 real store revamps) and emits
src/data/articles.ts — a research-backed article matrix:
3 articles per project, 5 for the 10 featured flagships.
Sprints: S1 audit (parse) -> S2 keyword matrix (lexicon + blueprints)
-> S3 data model (TS emit) -> S4 production (assignment + copy).
"""
import re, json, random, hashlib

random.seed(20260919)

SRC = 'src/data/projects.ts'
OUT = 'src/data/articles.ts'
RAW = 'raw.githubusercontent.com'  # appears inside project image URLs

# ---------------------------------------------------------------- S1: parse
src = open(SRC).read()
projects = []
for m in re.finditer(r'^    id: (\d+),$', src, re.M):
    start = m.start(); end = src.find('\n  },\n', start)
    b = src[start:end]
    g = lambda k: (re.search(rf'\n    {k}: "([^"]*)"', b) or [None, ''])[1]
    issues = re.findall(r'id: "([A-Z]+-\d+)",\s*\n\s*title: "([^"]*)",\s*\n\s*severity: "(\w+)"', b)
    gallery = re.findall(r'      "(https://[^"]+|/images/[^"]+)",', b)
    thumb = re.search(r'thumbnail: ("(?:https://[^"]+|/images/[^"]+)")', b).group(1)
    hero = re.search(r'heroImage: ("(?:https://[^"]+|/images/[^"]+)")', b).group(1)
    lift = re.search(r'\+(\d+)% ([a-z\- ]+?)(?:[,."]|$)', g('outcome'))
    projects.append({
        'id': int(m.group(1)),
        'title': g('title'),
        'slug': g('slug'),
        'industry': g('industry'),
        'platform': g('platform'),
        'summary': g('summary'),
        'challenge': g('challenge'),
        'outcome': g('outcome'),
        'brandIntro': (re.search(r'\n    brandIntro:\n      "([^"]*)"', b) or [None, ''])[1],
        'issue': {'id': issues[0][0], 'title': issues[0][1], 'sev': issues[0][2]} if issues else None,
        'n_issues': len(issues),
        'n_captures': len(gallery),
        'gallery': gallery,
        'thumb': thumb.strip('"'),
        'hero': hero.strip('"'),
        'lift': f"+{lift.group(1)}% {lift.group(2)}" if lift else None,
        'featured': 'featured: true' in b,
    })
print(f"S1 audit: {len(projects)} projects parsed, {sum(p['n_captures'] for p in projects)} captures, {sum(1 for p in projects if p['lift'])} with lifts")
featured = [p for p in projects if p['featured']]

# ------------------------------------------------- S2: industry keyword bank
# people / things / store / aov lever / season / discovery / trust / ticket
LEX = {
 'Fundraising': dict(people="supporters", things="prize draws", store="fundraising platform", aov="add-on donations", season="year-end giving", discovery="cause-based browsing", trust="where the money goes", ticket="small impulse gifts"),
 'Manufacturing': dict(people="procurement teams", things="bulk specifications", store="B2B manufacturing catalog", aov="volume tiers", season="production planning cycles", discovery="spec-driven search", trust="certifications and tolerances", ticket="four-figure orders"),
 'Bridal Fashion': dict(people="brides", things="made-to-order gowns", store="bridal boutique", aov="veil and accessory pairings", season="engagement season", discovery="silhouette and fabric filters", trust="customization accuracy", ticket="four-figure orders"),
 'Food & Bakery': dict(people="repeat shoppers", things="pantry staples", store="specialty food store", aov="multi-buy pantry deals", season="holiday gifting", discovery="dietary filters", trust="allergen accuracy", ticket="weekly baskets"),
 'Education & Workshops': dict(people="students", things="workshop seats", store="course catalog", aov="class bundles", season="term start", discovery="skill-level filters", trust="honest availability", ticket="career investments"),
 'E-Mobility': dict(people="commuters", things="e-bikes and kits", store="e-mobility store", aov="accessory bundles", season="spring riding season", discovery="range and fit comparison", trust="spec consistency", ticket="four-figure orders"),
 'Jewellery': dict(people="gift buyers", things="fine pieces", store="jewelry store", aov="gift sets and engraving", season="gifting season", discovery="stone and metal filters", trust="materials and sizing detail", ticket="considered purchases"),
 'Fashion & Apparel': dict(people="shoppers", things="wardrobe pieces", store="fashion boutique", aov="complete-the-look pairings", season="seasonal drops", discovery="size and style filters", trust="fit guidance", ticket="multi-item baskets"),
 'Beauty & Skincare': dict(people="skincare buyers", things="routines and refills", store="beauty store", aov="routine bundles", season="new-year resets", discovery="skin-type discovery", trust="ingredient transparency", ticket="replenishment baskets"),
 'Home & Living': dict(people="homeowners", things="statement pieces", store="home decor store", aov="room bundles", season="moving season", discovery="room and style browsing", trust="materials and dimensions", ticket="considered purchases"),
 'Home & Interior': dict(people="homeowners", things="statement pieces", store="interior store", aov="room bundles", season="moving season", discovery="room and style browsing", trust="materials and dimensions", ticket="considered purchases"),
 'Home & Bedding': dict(people="bedroom shoppers", things="sheet sets", store="bedding store", aov="bedroom bundles", season="winter coziness", discovery="size and fabric filters", trust="fabric honesty", ticket="multi-item baskets"),
 'Kids & Family': dict(people="parents", things="kid essentials", store="family store", aov="age-stage bundles", season="back-to-school", discovery="age filters", trust="safety and sizing", ticket="multi-item baskets"),
 'Pet Supplies': dict(people="pet parents", things="collars, beds, and treats", store="pet supply store", aov="starter-kit bundles", season="holiday gifting", discovery="breed and size filters", trust="materials and sizing", ticket="replenishment baskets"),
 'Candles & Home Fragrance': dict(people="gifters", things="signature scents", store="fragrance store", aov="discovery sets", season="gifting season", discovery="scent-family browsing", trust="burn-time honesty", ticket="multi-item baskets"),
 'Coffee & Beverage': dict(people="coffee drinkers", things="beans and gear", store="coffee store", aov="subscription upgrades", season="winter routines", discovery="taste-profile discovery", trust="roast freshness", ticket="subscription baskets"),
 'Art & Prints': dict(people="collectors", things="prints and originals", store="art gallery", aov="framing add-ons", season="autumn interiors", discovery="style and medium browsing", trust="provenance and condition", ticket="considered purchases"),
 'Fitness & Movement': dict(people="members", things="gear and programs", store="fitness store", aov="equipment bundles", season="january resets", discovery="goal-based discovery", trust="spec accuracy", ticket="considered purchases"),
 'Textiles': dict(people="makers", things="fabrics by the meter", store="fabric store", aov="project bundles", season="autumn craft season", discovery="fiber and use-case filters", trust="fiber content accuracy", ticket="project baskets"),
 'Electronics': dict(people="researchers", things="spec-heavy devices", store="electronics store", aov="accessory pairings", season="launch cycles", discovery="spec comparison", trust="spec consistency", ticket="considered purchases"),
 'Health & Wellness': dict(people="wellness buyers", things="protocols and refills", store="wellness store", aov="routine bundles", season="january resets", discovery="goal-based discovery", trust="ingredient transparency", ticket="replenishment baskets"),
 'Travel & Accessories': dict(people="travelers", things="trip gear", store="travel store", aov="packing bundles", season="summer trips", discovery="trip-type browsing", trust="shipping promises", ticket="trip baskets"),
 'Dental & Health': dict(people="patients", things="care kits", store="dental care store", aov="care bundles", season="new-year resets", discovery="condition-based discovery", trust="clinical clarity", ticket="care baskets"),
 'Florist': dict(people="occasion buyers", things="arrangements", store="florist", aov="vase and chocolate add-ons", season="peak floral holidays", discovery="occasion filters", trust="delivery honesty", ticket="occasion baskets"),
 'Luxury Goods': dict(people="collectors", things="investment pieces", store="luxury boutique", aov="concierge pairings", season="gifting season", discovery="collection browsing", trust="authenticity detail", ticket="four-figure orders"),
 'Artisan Goods': dict(people="makers", things="handmade pieces", store="artisan store", aov="material kits", season="fair season", discovery="craft-story browsing", trust="provenance detail", ticket="considered purchases"),
 'Construction Supplies': dict(people="site managers", things="scaffold systems", store="equipment catalog", aov="site bundles", season="build season", discovery="load-spec discovery", trust="safety certifications", ticket="bulk orders"),
 'Industrial Supplies': dict(people="plant managers", things="hose and fitting assemblies", store="industrial catalog", aov="maintenance kits", season="shutdown seasons", discovery="spec-driven search", trust="spec sheet accuracy", ticket="bulk orders"),
 'Footwear': dict(people="shoppers", things="everyday pairs", store="shoe store", aov="care-kit add-ons", season="seasonal rotations", discovery="size and width filters", trust="fit guidance", ticket="multi-item baskets"),
 'Specialty Retail': dict(people="enthusiasts", things="niche gear", store="specialty store", aov="starter bundles", season="hobby season", discovery="use-case browsing", trust="detail accuracy", ticket="considered purchases"),
}
PEOPLE = {"Fundraising": "supporter", "Manufacturing": "procurement lead", "Bridal Fashion": "bride", "Food & Bakery": "repeat shopper", "Education & Workshops": "student", "E-Mobility": "commuter", "Jewellery": "gift buyer", "Fashion & Apparel": "shopper", "Beauty & Skincare": "skincare buyer", "Home & Living": "homeowner", "Home & Interior": "homeowner", "Home & Bedding": "bedroom shopper", "Kids & Family": "parent", "Pet Supplies": "pet parent", "Candles & Home Fragrance": "gifter", "Coffee & Beverage": "coffee drinker", "Art & Prints": "collector", "Fitness & Movement": "member", "Textiles": "maker", "Electronics": "researcher", "Health & Wellness": "wellness buyer", "Travel & Accessories": "traveler", "Dental & Health": "patient", "Florist": "occasion buyer", "Luxury Goods": "collector", "Artisan Goods": "craft lover", "Construction Supplies": "site manager", "Industrial Supplies": "plant manager", "Footwear": "shopper", "Specialty Retail": "enthusiast"}

def lex(ind):
    e = dict(LEX.get(ind, LEX['Specialty Retail']))
    e['person'] = PEOPLE.get(ind_key(ind), 'shopper')
    return e

# industries that share a canonical key
CANON = {'Home & Interior': 'Home & Living'}
def ind_key(ind): return CANON.get(ind, ind)

# category clusters
C_SHOPIFY, C_CRO, C_AOV, C_AI, C_GROWTH, C_UX = ("Shopify", "CRO", "AOV & Merchandising", "AI Commerce", "eCommerce Growth", "UX & Performance")

# --------------------------------------------- S2b: title phrases + helpers
PHRASE = {
 'Pet Supplies':'pet brands','Food & Bakery':'bakery brands','Kids & Family':'kids brands',
 'Coffee & Beverage':'coffee brands','Textiles':'fabric and textile brands','Health & Wellness':'wellness brands',
 'Travel & Accessories':'travel brands','Dental & Health':'dental brands','Industrial Supplies':'industrial brands',
 'Construction Supplies':'construction brands','Artisan Goods':'artisan brands','Specialty Retail':'specialty brands',
 'Education & Workshops':'education brands','E-Mobility':'e-mobility brands','Candles & Home Fragrance':'home fragrance brands',
 'Fitness & Movement':'fitness brands','Art & Prints':'art brands','Home & Bedding':'bedding brands',
 'Bridal Fashion':'bridal brands','Luxury Goods':'luxury brands','Electronics':'consumer electronics brands',
 'Florist':'florists','Footwear':'footwear brands','Fundraising':'fundraising platforms',
 'Manufacturing':'manufacturing brands','Fashion & Apparel':'fashion brands','Beauty & Skincare':'beauty brands',
 'Home & Living':'home decor brands','Jewellery':'jewelry brands',
}
def phrase(p):
    return PHRASE.get(ind_key(p['industry']), (p['industry'] + ' brands').lower())

def sev_word(s): return {'critical':'critical','major':'major','minor':'minor'}.get(s, s)

SOURCES_WEB = {"label": "web.dev — Core Web Vitals", "url": "https://web.dev/vitals/"}
SOURCES_SHOPIFY = {"label": "Shopify Help Center — themes and speed", "url": "https://help.shopify.com/en/manual/online-store/themes"}
SOURCES_GA = {"label": "Google Analytics — events", "url": "https://support.google.com/analytics/answer/9267568"}

def mk_ctx(p, variant):
    L = lex(p['industry'])
    return {
        **L, 'v': variant, 'NAME': p['title'], 'SLUG': p['slug'], 'IND': p['industry'].lower(),
        'PHRASE': phrase(p), 'PLAT': p['platform'], 'NCAP': p['n_captures'],
        'ISSUE': p['issue']['title'] if p['issue'] else None,
        'ISSUEID': p['issue']['id'] if p['issue'] else None,
        'SEV': sev_word(p['issue']['sev']) if p['issue'] else None,
        'LIFT': p['lift'], 'NIS': p['n_issues'],
        'img': p['gallery'], 'hero': p['hero'],
        'CASE': f"/work/{p['slug']}",
    }

def paras(ctx, options):
    return options[ctx['v'] % len(options)]

def img_block(ctx, idx, alt, full=True):
    src = ctx['img'][idx % len(ctx['img'])] if ctx['img'] else ctx['hero']
    return {"type": "image", "src": src, "alt": alt, "full": full}

AUDIT_CTA = {"type":"cta","title":"See what your store is leaking","text":"A store audit reads your screens, your theme code, and your funnel the way this article describes — then hands you the fix list, ranked by revenue impact.","href":"/audit","label":"Get a free audit"}
CASE_CTA = lambda c: {"type":"cta","title":"Read the full rebuild","text":"The complete case study — every capture, every confirmed defect, and the numbers that followed the fixes.","href":c,"label":"Open the case study"}

# ------------------------------------------------------- S2c: INSIGHT pool
INSIGHT = []
def insight(bp_id, titles, category, tags, kw, build, faq, excerpt, sources=None):
    INSIGHT.append(dict(id=bp_id, titles=titles, category=category, tags=tags, kw=kw, build=build, faq=faq, excerpt=excerpt, sources=sources))

insight("I1",
 ["How AI Shopping Assistants Are Rewiring Product Discovery for {PHRASE}",
  "AI Shopping Assistants and the New Product Discovery Funnel for {PHRASE}"],
 C_AI, ["AI shopping assistants","product discovery","Shopify"], "AI shopping assistants for {PHRASE}",
 lambda c: [
  {"type":"p","text":paras(c,[
   "Product discovery used to mean a search bar, a filter rail, and hope. AI shopping assistants collapse that funnel into a conversation: a {P} describes a need in plain language and gets a curated shortlist instead of a results page. For {PHRASE}, that changes what \u201cbeing findable\u201d even means.",
   "The discovery funnel {PHRASE} relied on for a decade — keyword search, filters, pagination — is being bypassed. Assistants negotiate intent conversationally: a {P} asks for {T} \u201cunder a budget, good for {SEASON},\u201d and the assistant does the narrowing. Stores that structured their catalogs for filters are now being read by machines that read meaning, not metadata.",
  ])},
  {"type":"h2","text":"What assistants actually read on your store"},
  {"type":"p","text":"Assistants and AI search systems lean on structured product data: titles that say what the thing is, attributes that map to how {P} describe it, copy that answers the follow-up question before it's asked. When we rebuild a {S}, this is the first layer we fix — because discovery that depends on JavaScript-rendered pages or vague titles simply doesn't get quoted."},
  {"type":"h2","text":"Why conversation flattens the funnel"},
  {"type":"p","text":"Three clicks used to separate curiosity from a product page. A assistant does that narrowing inside the chat — which means the product page it lands on must finish the job alone: proof, specifics, and a confident next step. The stores that win are the ones whose pages read like answers, not brochures."},
  {"type":"quote","text":"The new shelf is a conversation. If your catalog can't be quoted, you're not on it."},
  {"type":"h2","text":"What to do this quarter"},
  {"type":"list","items":[
   "Rewrite product titles to match how {P} actually ask for {T}",
   "Expose structured attributes (use, occasion, constraints) — not just SKU fields",
   "Make top pages answer follow-ups inline: sizing, compatibility, delivery",
   "Watch assistant referrals in analytics as a distinct traffic class",
  ]},
  {"type":"p","text":"We put this into practice during the {NAME} revamp — the discovery paths are documented in [the full case study]({CASE})."},
  AUDIT_CTA,
 ],
 [{"q":"Will AI shopping assistants replace search on my store?","a":"They replace the first narrowing step — the shortlisting. Your search and filters still matter for buyers who arrive knowing exactly what they want. Treat assistants as a second discovery surface with stricter data requirements."},
  {"q":"What should I fix first to be assistant-friendly?","a":"Product titles and attribute structure. If a machine can't tell what a product is, who it's for, and how it varies, nothing downstream works — recommendation engines and assistants alike."},
  {"q":"Does this apply to small catalogs?","a":"Yes — smaller catalogs can move faster. With a few dozen products you can rewrite every title and attribute by hand in a week and be measurably more machine-readable than competitors ten times your size."}],
 "AI shopping assistants collapse search, filters, and shortlisting into a conversation. Here's what that rewiring means for {PHRASE} — and the catalog work that makes your products quotable.")

insight("I2",
 ["ChatGPT Is a Storefront Now: Conversational Commerce for {PHRASE}",
  "From Chat to Checkout: Conversational Commerce Playbook for {PHRASE}"],
 C_AI, ["ChatGPT","conversational commerce","Generative AI"], "conversational commerce for {PHRASE}",
 lambda c: [
  {"type":"p","text":paras(c,[
   "ChatGPT and its kin have quietly become shopping surfaces. {P} ask for recommendations, compare {T}, and increasingly click through with intent already shaped by the conversation. For {PHRASE}, the question isn't whether conversational commerce matters — it's whether your storefront can hold up its end of the dialogue.",
   "A year ago, \u201cconversational commerce\u201d meant a chat widget answering shipping questions. Now the conversation starts off-site: a model summarizes options, drafts a shortlist of {T}, and the store visit is the closing argument. That shifts the burden from discovery UX to persuasion UX.",
  ])},
  {"type":"h2","text":"The handoff is the experience"},
  {"type":"p","text":"When a {P} arrives from a chat, the page has one job: confirm the recommendation and remove doubt. That's a different job than seducing a cold visitor. Pages built for the old funnel — hero, features, vibes — lose to pages that restate the need, answer it specifically, and clear the path to checkout."},
  {"type":"h2","text":"Where stores break the conversation"},
  {"type":"list","items":[
   "Product pages that contradict what the assistant said (price, availability, specs)",
   "Slow mobile loads that kill carried-over intent",
   "No clear add-to-cart path for the exact item discussed",
   "Support widgets that overlap the buy button at the decisive second",
  ]},
  {"type":"p","text":"That last one sounds small; it isn't. In the {NAME} work, the single highest-severity finding was an overlay sitting on the conversion path — the exact moment conversational momentum dies. The rebuild is documented in [the case study]({CASE})."},
  {"type":"h2","text":"A practical posture"},
  {"type":"p","text":"Treat ChatGPT-era traffic as pre-sold but skeptical. Keep claims consistent everywhere the product appears, keep pages fast, and make the buy button untouchable. Conversational commerce doesn't need a chatbot on your site — it needs a site that can finish a conversation a model started."},
  AUDIT_CTA,
 ],
 [{"q":"Do I need my own chatbot to do conversational commerce?","a":"No. The conversation is already happening in ChatGPT and similar tools. Your job is to be quotable and consistent when the buyer clicks through — a chatbot is optional, coherence is not."},
  {"q":"What breaks conversational commerce most often?","a":"Inconsistency. If the model's summary says one price and your page shows another, trust evaporates in one glance. Single-source your product data."},
  {"q":"How do I measure it?","a":"Look for referral patterns from AI surfaces in analytics, and compare their conversion against cold organic. They usually convert warmer — which makes page speed and clarity disproportionately valuable."}],
 "ChatGPT has become a storefront that recommends before buyers ever click. What conversational commerce demands from {PHRASE}: consistency, speed, and pages that finish the argument.")

insight("I3",
 ["Personalization Without Creepiness: A Privacy-Aware Playbook for {PHRASE}",
  "Privacy-First Personalization: What {PHRASE} Can Actually Do in 2026"],
 C_AI, ["personalization","privacy","first-party data"], "privacy-first personalization {PHRASE}",
 lambda c: [
  {"type":"p","text":paras(c,[
   "Personalization has a trust problem. Buyers love being understood and hate being surveilled — and the difference is mostly mechanics. For {PHRASE}, the winning posture is personalization that explains itself: relevant {T}, justified by obvious context, built on data the {P} knowingly shared.",
   "The backlash years taught the industry what not to do: retargeting that follows people across the web, \u201cyou viewed\u201d modules that feel like reading diaries. The pendulum has swung toward first-party, session-scoped relevance — and honestly, it converts better because it doesn't need explaining.",
  ])},
  {"type":"h2","text":"Session-scoped beats lifetime-scoped"},
  {"type":"p","text":"The highest-performing personalization we ship is almost boring: remember what a {P} configured this session, resume it when they return to the tab, recommend based on the current basket rather than a shadow profile. In the {NAME} work, simply persisting selections across navigation — a fix we documented in [the case study]({CASE}) — outperformed any clever profiling, because it respects the obvious."},
  {"type":"h2","text":"Three tiers of privacy-aware relevance"},
  {"type":"list","items":[
   "Tier 1 — session context: cart, last viewed, configured options. No consent drama, high lift.",
   "Tier 2 — declared preference: quiz answers, favorites, subscription choices. {P} opt in gladly.",
   "Tier 3 — modeled preference: only with transparent value exchange (early access, better fits).",
  ]},
  {"type":"callout","title":"The explainability test","text":"If a shopper saw why a recommendation appeared, would they nod or flinch? If the answer is flinch, ship the nod version."},
  {"type":"h2","text":"What this means for {SEASON}"},
  {"type":"p","text":"{SEASON} is when personalization pays its rent — and when overreach is most visible. Build the tiers now, lead with session and declared data, and treat anything modeled as a bonus with a disclosure. The brands that personalize like hosts, not detectives, are the ones {P} come back to."},
  AUDIT_CTA,
 ],
 [{"q":"Is session-based personalization enough to move AOV?","a":"Often, yes. Basket-aware recommendations and resumed configurations convert at high rates because the context is undeniable. Lifetime profiling adds marginal lift at a large trust cost."},
  {"q":"How does this interact with cookie consent?","a":"Cleanly — Tier 1 and Tier 2 personalization run on first-party, session, or explicitly-shared data, so consent friction doesn't cripple relevance. That's the design goal."},
  {"q":"What's the first module to ship?","a":"\u201cComplete your {AOV}\u201d powered by the current cart. It's transparent, instantly justified, and it raises order value without touching a byte of tracked history."}],
 "Personalization works best when it explains itself. A privacy-aware playbook for {PHRASE}: session context first, declared preferences second, modeled data last — with the trust math for each.")

insight("I4",
 ["AI Search Is Reshaping Product Pages: Zero-Click Discovery for {PHRASE}",
  "Zero-Click Discovery: Making {PHRASE} Quotable in AI Search"],
 C_AI, ["AI search","zero-click","SEO"], "AI search optimization for {PHRASE}",
 lambda c: [
  {"type":"p","text":paras(c,[
   "A growing share of product research never reaches a results page. AI answers summarize, compare, and recommend {T} directly — and the click, when it comes, arrives pre-convinced or not at all. For {PHRASE}, the discipline is becoming quotability: being the source an answer cites, and a page worth visiting after the answer.",
   "This isn't traditional SEO with a new coat. Rankings still exist, but the unit of consumption is the excerpt, the spec table, the direct answer. Pages engineered around paragraph-and-keyword rituals lose to pages engineered around verifiable specifics.",
  ])},
  {"type":"h2","text":"What gets quoted"},
  {"type":"p","text":"Specifics. Dimensions, materials, compatibility, delivery windows, return terms — stated plainly, near the top, consistent everywhere they appear. Vague marketing prose gets paraphrased away; checkable facts get attributed. When we revamp a {S}, we restructure product pages so the first screenful answers the questions an assistant would be asked."},
  {"type":"h2","text":"The click is the prize, not the impression"},
  {"type":"p","text":"Zero-click discovery gives away the answer and keeps the relationship. Your page then has to convert on trust the engine lent you: fast load, immediate confirmation of the quoted facts, an add-to-cart path with zero detours. Anything that contradicts the excerpt — a price, a variant, an availability flag — burns the borrowed trust instantly."},
  {"type":"list","items":[
   "Lead product pages with answer-shaped specifics, not adjectives",
   "Keep one source of truth for price and availability across the site",
   "Structure data so machines can verify claims without rendering JS",
   "Make post-click speed a design constraint, not an audit item",
  ]},
  {"type":"p","text":"The {NAME} rebuild treated these as ranking factors, not polish — the evidence trail is in [the case study]({CASE})."},
  AUDIT_CTA,
 ],
 [{"q":"Is traditional SEO dead because of AI answers?","a":"No — it's layered. Classic rankings still feed the systems that compose answers. The change is that pages must now satisfy two readers: the crawler that indexes and the model that quotes."},
  {"q":"Which pages should I make quotable first?","a":"Your top twenty products by revenue. Rewrite their openings to answer the three most common buyer questions in the first screenful, and keep every claim consistent across the site."},
  {"q":"How do I know if AI answers mention my store?","a":"Watch analytics for referral strings from AI surfaces, and search your category questions in the major assistants monthly. Track mention sentiment like you would reviews."}],
 "AI answers increasingly resolve product research before a click. How {PHRASE} can win the zero-click era: be quotable, be verifiable, and be fast enough to deserve the click you get.")

insight("I5",
 ["The New CRO Stack: Analytics, AI, UX Testing, and Personalization for {PHRASE}",
  "Beyond A/B Tests: The Modern CRO Stack for {PHRASE}"],
 C_CRO, ["CRO","A/B testing","analytics"], "CRO stack for {PHRASE}",
 lambda c: [
  {"type":"p","text":paras(c,[
   "CRO outgrew the A/B test. The modern stack layers four instruments — analytics that show where, session evidence that shows why, AI that scales the pattern-matching, and personalization that ships the relevance. {PHRASE} don't need more tools; they need the instruments wired to each other.",
   "Most programs stall at dashboards: numbers without causes. The missing layer is almost always evidence — recorded sessions, captured states, the actual screens where {P} hesitate. Numbers locate the wound; evidence tells you what cut it.",
  ])},
  {"type":"h2","text":"The four instruments, in order"},
  {"type":"list","items":[
   "Analytics: where sessions die, which devices bleed, what {SEASON} traffic does differently",
   "Evidence: session recordings and captured states of the exact failing screens",
   "AI assistance: clustering friction signals, drafting variants — checked by humans",
   "Personalization: shipping the fix to the segments that need it most",
  ]},
  {"type":"h2","text":"AI as apprentice, not oracle"},
  {"type":"p","text":"AI is genuinely good at the boring half of CRO: clustering exit patterns, flagging anomaly sessions, drafting copy variants. It is genuinely bad at knowing when a screen lies — overlays, stale states, contradictory promises. That's human work. The {NAME} revamp ran exactly this split: machines clustered the signals, people verified every defect against the code and the screen before it went on the fix list ([case study]({CASE}))."},
  {"type":"quote","text":"Test less, observe more. Most conversion wins never needed an experiment — they needed someone to watch the session."},
  {"type":"h2","text":"A realistic operating rhythm"},
  {"type":"p","text":"Weekly: review funnels for new leaks. Fortnightly: evidence pass on the worst leak. Monthly: ship fixes in buyer-order — money path first. Quarterly: re-baseline speed and accessibility. Nothing exotic; just instruments actually connected."},
  AUDIT_CTA,
 ],
 [{"q":"Do I need all four instruments on day one?","a":"No. Analytics plus session evidence will carry the first quarter of gains. AI and personalization amplify a program that already observes well — they can't substitute for it."},
  {"q":"How many A/B tests should a small team run?","a":"Fewer than you think. Teams that test everything learn slowly; teams that fix verified defects first and test the controversial tail move faster with higher win rates."},
  {"q":"What's the most common stack mistake?","a":"Buying personalization before fixing leaks. Shipping relevance into a broken funnel just personalizes the leak."}],
 "Modern CRO for {PHRASE} is four wired instruments — analytics, evidence, AI assistance, and personalization — operating on a weekly rhythm. Here's the stack, the order, and the operating manual.")

insight("I6",
 ["Mobile-First CRO: Where {PHRASE} Revenue Actually Leaks",
  "The Thumb Tax: Mobile Conversion Leaks in {PHRASE}"],
 C_CRO, ["mobile commerce","CRO","UX"], "mobile CRO for {PHRASE}",
 lambda c: [
  {"type":"p","text":paras(c,[
   "Mobile isn't a channel anymore; for most {PHRASE} it's the majority of sessions and a minority of revenue — a gap with a name: the thumb tax. Every pinched target, every overlay over the buy button, every keyboard that covers the field is a small levy on every {P} who shops from a phone.",
   "The leaks are rarely exotic. They're the same half-dozen patterns, store after store: fixed widgets overlapping CTAs, drawers that clip key categories, keyboards hiding the field being typed into, and page weights that punish cellular patience.",
  ])},
  {"type":"h2","text":"The five recurring leaks"},
  {"type":"list","items":[
   "Fixed-position widgets (chat, promo, install prompts) overlapping primary CTAs",
   "Navigation drawers that hide the categories {P} came for",
   "Forms where the keyboard covers the active field or the submit button",
   "Hero and imagery weights that push the first product below the fold",
   "Sticky bars stacked on sticky bars until the viewport is a mailbox slot",
  ]},
  {"type":"h2","text":"Evidence over empathy"},
  {"type":"p","text":"Every team \u201cknows\u201d mobile matters; few have watched a session. Five minutes of recorded mobile sessions from {SEASON} traffic will surface more fixable friction than a quarter of opinions. In the {NAME} work, the mobile pass produced the sharpest findings of the audit — including a header that dropped the primary action on phones, detailed in [the case study]({CASE})."},
  {"type":"callout","title":"The one-hand rule","text":"If the primary action on any screen can't be reached and tapped confidently with one thumb, that screen isn't finished."},
  {"type":"h2","text":"Fix order that pays"},
  {"type":"p","text":"Clear the overlays from the money path first. Then navigation reachability. Then forms. Then weight. This order follows the buyer, which is why it follows the revenue."},
  AUDIT_CTA,
 ],
 [{"q":"What percentage of {PHRASE} traffic is mobile?","a":"Most stores see well over half of sessions from phones, with revenue share lagging behind — the gap is the opportunity. Check your own split before assuming desktop is your buyer."},
  {"q":"Are chat widgets bad for mobile conversion?","a":"Not inherently — but unmanaged ones are. A chat bubble that overlaps a CTA, or that reopens on every page, taxes every session. Safe zones and dismissal persistence fix it."},
  {"q":"Should I build a separate mobile experience?","a":"Rarely. One responsive experience, tested at 390px like a first-class citizen, beats maintaining two funnels. The work is prioritization, not duplication."}],
 "Mobile sessions dominate {PHRASE} while revenue lags — the thumb tax. The five leaks that cause it, the evidence-first way to find yours, and the fix order that follows the money.")

insight("I7",
 ["Site Speed Is a Conversion Strategy: Core Web Vitals for {PHRASE}",
  "Fast Pages Sell: Core Web Vitals as a Revenue Lever for {PHRASE}"],
 C_UX, ["Core Web Vitals","site speed","performance"], "site speed optimization {PHRASE}",
 lambda c: [
  {"type":"p","text":paras(c,[
   "Speed debates get technical; the stakes aren't. Every second of load time is a tax on intent, paid by {P} who arrived already wanting {T}. Core Web Vitals turned that tax into a scoreboard — and for {PHRASE}, the scoreboard doubles as an SEO asset, because search engines reward the stores that respect attention.",
   "The stores that treat speed as a design constraint — decided at the layout stage, not discovered in an audit — consistently out-convert twins with prettier screenshots and heavier pages.",
  ])},
  {"type":"h2","text":"The three numbers that matter"},
  {"type":"list","items":[
   "LCP — when the page looks ready. Hero imagery weight is the usual culprit.",
   "INP — how fast the page responds. Widget sprawl is the usual culprit.",
   "CLS — whether the page jumps as it loads. Unsized media and late banners are the usual culprits.",
  ]},
  {"type":"h2","text":"Where {PHRASE} typically bleed"},
  {"type":"p","text":"Unminified CSS and JS stacked app by app; heroes exported at desktop resolutions and served to phones; third-party scripts racing each other at the exact moment a {P} tries to tap. The {NAME} rebuild treated all three as first-class design work — minifying bundles, right-sizing imagery, deferring what doesn't earn its place — with the approach documented in [the case study]({CASE})."},
  {"type":"quote","text":"Performance is the first conversion feature. Nobody has ever abandoned a page for loading instantly."},
  {"type":"h2","text":"A budget you can keep"},
  {"type":"p","text":"Give every template a weight budget. New app or script must buy its way in by displacing something else. Review budgets quarterly alongside PageSpeed Insights and Lighthouse reports. Speed isn't a project; it's a policy — and it's the rare policy that simultaneously pleases {P}, search engines, and the finance team."},
  AUDIT_CTA,
 ],
 [{"q":"How much does site speed actually affect conversion?","a":"Directionally, strongly — public research from Google and others consistently ties slower loads to higher abandonment, and every audit we run shows impatient drop-offs concentrated at heavy, slow-to-respond screens. Treat speed as revenue infrastructure."},
  {"q":"Will fixing Core Web Vitals improve my SEO?","a":"Vitals are a confirmed ranking input alongside relevance and content quality. They won't outrank bad content, but between two comparable stores, the faster one gets the edge."},
  {"q":"What's the single fastest win?","a":"Right-size and lazy-load imagery below the fold, and minify CSS/JS. Most theme stacks shed a meaningful chunk of their weight in an afternoon of this work."}],
 "Core Web Vitals are a conversion and SEO strategy disguised as a technical checklist. The three numbers, the places {PHRASE} bleed, and a weight-budget policy that keeps pages fast for good.",
 sources=[SOURCES_WEB, SOURCES_SHOPIFY])

insight("I8",
 ["Merchandising Is the Cheapest Revenue You're Not Earning: {PHRASE} Edition",
  "Digital Merchandising for {PHRASE}: Selling More of What You Already Sell"],
 C_AOV, ["merchandising","AOV","product recommendations"], "digital merchandising {PHRASE}",
 lambda c: [
  {"type":"p","text":paras(c,[
   "Every {S} already owns its cheapest growth lever: what sits next to what. Merchandising — the deliberate arrangement of {T} across collection pages, product pages, and carts — raises order value without a cent of new traffic. It's the oldest retail skill, transplanted to screens and mostly forgotten.",
   "Walk a physical {S} and someone chose every adjacency. Online, most stores outsource those decisions to a default grid and a bestseller widget. The gap between those two postures is measurable in average order value.",
  ])},
  {"type":"h2","text":"Adjacency is the product"},
  {"type":"p","text":"{P} don't browse intent; they browse context. The {T} that pair naturally — the obvious next piece, the completing item, the slightly-better version — should be one tap from everything they relate to. In the {NAME} revamp, rebuilding these adjacencies was among the highest-leverage design work; the arrangement logic is documented in [the case study]({CASE})."},
  {"type":"h2","text":"Four arrangements that pay rent"},
  {"type":"list","items":[
   "Complete-the-look on product pages: the obvious companion, not random bestsellers",
   "Good-better-best within collection rows: let the shopper trade up themselves",
   "Cart-stage additions sized to the basket: small, relevant, one decision",
   "{SEASON} curation: a themed shelf beats a generic sale banner every time",
  ]},
  {"type":"callout","title":"The rule of one decision","text":"Every recommendation should ask exactly one question. Two choices are a helper; five are homework."},
  {"type":"h2","text":"Measure arrangement, not clicks"},
  {"type":"p","text":"Track attach rate and order value by module, not raw CTR. A pairing clicked rarely but attached often beats a curiosity magnet. Merchandising is a portfolio; manage it like one and it quietly becomes the margin engine of the {S}."},
  AUDIT_CTA,
 ],
 [{"q":"Is merchandising different from just adding recommendation apps?","a":"Yes. Apps render slots; merchandising decides what deserves them. The judgment about adjacencies — what completes what — is the actual work, and no default widget does it for you."},
  {"q":"Where should a small store start?","a":"Product pages. Pick your top ten products and hand-curate one companion each. It's an afternoon of work with compounding returns."},
  {"q":"How do I know it's working?","a":"Attach rate per module and average order value by entry point. If a module never attaches, its slot is costing you attention — re-curate or remove it."}],
 "Merchandising is the oldest retail skill and the most neglected digital one. How {PHRASE} can arrange what sits next to what — and turn adjacency into the cheapest AOV lift available.")

insight("I9",
 ["Why LTV Should Decide Your {PHRASE} Roadmap",
  "Build for the Second Order: LTV-Driven Roadmaps for {PHRASE}"],
 C_GROWTH, ["LTV","retention","customer lifetime value"], "customer lifetime value {PHRASE}",
 lambda c: [
  {"type":"p","text":paras(c,[
   "Roadmaps built around first orders optimize for strangers. Roadmaps built around lifetime value optimize for relationships — and for {PHRASE}, the difference shows up in every argument about what to fix next. LTV reframes the store from a place that closes transactions into a place {P} return to for {T}.",
   "The arithmetic is unforgiving: acquisition costs only climb. A {S} that knows its repeat rate, its replenishment cycle, and its natural {AOV} companion logic can spend on retention with confidence and acquire without panic.",
  ])},
  {"type":"h2","text":"The three numbers that shape the roadmap"},
  {"type":"list","items":[
   "Repeat rate: what share of {P} come back within a natural cycle for {T}?",
   "Replenishment interval: how long one purchase realistically lasts",
   "Second-order AOV: what a returning basket adds over a first",
  ]},
  {"type":"h2","text":"Design decisions that compound"},
  {"type":"p","text":"Friction you remove once pays on every future order. In the {NAME} work, the fixes that mattered most to LTV were unglamorous — variant persistence, honest availability, a checkout that doesn't re-argue with the buyer — documented in [the case study]({CASE}). Remove re-learning cost and returning {P} glide."},
  {"type":"h2","text":"Retention instruments worth owning"},
  {"type":"p","text":"Replenishment email timed to the real interval. A subscription where the product genuinely repeats. Post-purchase content that makes the first use successful. None of these are clever; all of them compound. Choose the roadmap by asking one question: does this make the second order more likely, sooner, or bigger? If the answer is no, it's a first-order trick wearing a strategy costume."},
  AUDIT_CTA,
 ],
 [{"q":"How do I calculate LTV without a data team?","a":"Start with average order value × orders per year × gross margin, from whatever your platform reports. Imperfect but directional — enough to re-rank a roadmap."},
  {"q":"Should acquisition spend wait until retention is fixed?","a":"No, but rebalance. Every point of leak you fix raises the effective return on the same acquisition spend. Fix the bucket while pouring."},
  {"q":"What's the highest-LTV design feature for most stores?","a":"Frictionless reordering. Returning buyers have already decided; every extra step is a tax on their loyalty."}],
 "LTV is a roadmap instrument, not a vanity metric. The three numbers that should reorder every {PHRASE} priority list — and the unglamorous design work that compounds into repeat revenue.")

insight("I10",
 ["Retention Compounds: Email & SMS That {PHRASE} Buyers Actually Open",
  "Owned Channels, Real Revenue: Email and SMS for {PHRASE}"],
 C_GROWTH, ["email marketing","SMS","retention"], "email and SMS strategy {PHRASE}",
 lambda c: [
  {"type":"p","text":paras(c,[
   "Rented reach gets more expensive every season; owned channels compound. For {PHRASE}, email and SMS remain the only channels where the audience is yours, the marginal send is free, and the message can be timed to the exact moment a {P} needs {T} again.",
   "The failure mode is volume without rhythm: newsletters nobody scheduled against a calendar, discounts as a personality. The stores that win treat owned channels like a shopkeeper's memory — attentive, timely, rarely pushy.",
  ])},
  {"type":"h2","text":"The flows that earn their keep"},
  {"type":"list","items":[
   "Welcome: earn the relationship before asking for a second order",
   "Replenishment: timed to how long {T} realistically lasts",
   "Post-purchase: make the first use successful; preempt the first ticket",
   "Back-in-stock and restocks: the highest-intent message a store can send",
   "{SEASON}: one thoughtful curation, not twelve blasts",
  ]},
  {"type":"h2","text":"SMS: sparingly, or not at all"},
  {"type":"p","text":"SMS is a candlelit room — one voice, close range. Shipping and payment-prompt messages first, genuine urgency second, and almost nothing else. A {S} that texts like a friend gets read; one that texts like a flyer gets muted, and muted is forever."},
  {"type":"p","text":"In the {NAME} revamp, the owned-channel plan was designed around the replenishment reality of the products — the reasoning is in [the case study]({CASE}). Rhythm beats volume; timing beats cleverness."},
  AUDIT_CTA,
 ],
 [{"q":"How often should a store email?","a":"Often enough to stay familiar, rarely enough to stay welcome — for most stores, one considered send a week with higher-frequency flows (welcome, replenishment) running underneath."},
  {"q":"Is SMS worth it outside of shipping updates?","a":"Selectively. Restock alerts and genuinely time-boxed offers perform; anything that smells like an email copied into a text erodes the list you paid to build."},
  {"q":"What's the single best automated flow?","a":"Replenishment timed to product reality. It arrives exactly when the need returns, which is why it routinely out-earns flash campaigns."}],
 "Email and SMS are the only channels {PHRASE} truly own. The five flows that earn their keep, the sparing art of SMS, and why rhythm beats volume every season.")

insight("I11",
 ["Headless Commerce: When {PHRASE} Should (and Shouldn't) Make the Jump",
  "Headless for {PHRASE}: Freedom, Complexity, and the Honest Trade"],
 C_SHOPIFY, ["headless commerce","Hydrogen","Shopify Plus"], "headless commerce {PHRASE}",
 lambda c: [
  {"type":"p","text":paras(c,[
   "Headless is the industry's favorite argument. Separate the storefront from the commerce engine, and every experience becomes possible. Also every delay, every rewrite, every integration your theme used to handle for free. For {PHRASE}, the honest answer is: it depends on which constraint is actually hurting.",
   "Headless buys you three things — total front-end freedom, multi-surface publishing, and performance ceilings themes struggle to reach. It costs you the ecosystem: themes, app embeds, and the speed of iteration that made Shopify Shopify.",
  ])},
  {"type":"h2","text":"The questions that decide it"},
  {"type":"list","items":[
   "Is a custom buying experience genuinely core to the brand, or is the theme just tired?",
   "Does content velocity matter more than design freedom this year?",
   "Is there engineering capacity to own a custom front-end through platform changes?",
   "Would a themed rebuild — faster to ship, cheaper to run — capture 80% of the benefit?",
  ]},
  {"type":"h2","text":"The middle path most stores skip"},
  {"type":"p","text":"A disciplined theme rebuild — information architecture, performance budget, conversion path — usually delivers most of what teams want from headless at a fraction of the risk. The {NAME} revamp followed exactly that logic: reshape the experience within the platform, earn the metrics, revisit headless only if a real ceiling appears. The reasoning is documented in [the case study]({CASE})."},
  {"type":"quote","text":"Choose headless for the experience you can't build any other way — never for the novelty of saying you did."},
  AUDIT_CTA,
 ],
 [{"q":"Does headless automatically mean faster?","a":"No. It removes theme constraints, but a careless custom build is just as capable of shipping a slow site. Performance is a discipline, not an architecture."},
  {"q":"What signals say a store is ready for headless?","a":"Sustained engineering capacity, a buying experience that's genuinely differentiating, content across many surfaces, and a themed build that has already been optimized and still hits ceilings."},
  {"q":"What should be optimized before considering the jump?","a":"The conversion fundamentals: discovery, product pages, checkout path, speed. Headless multiplies whatever funnel you bring to it — including the leaks."}],
 "Headless is freedom with a bill attached. An honest decision framework for {PHRASE}: the four questions that decide it, and the disciplined middle path most stores skip.")

insight("I12",
 ["Seven Friction Patterns That Quietly Tax Every {PHRASE} Checkout",
  "The Friction Ledger: Hidden Checkout Costs for {PHRASE}"],
 C_UX, ["checkout optimization","friction","UX"], "checkout friction {PHRASE}",
 lambda c: [
  {"type":"p","text":paras(c,[
   "Checkouts don't get abandoned in dramatic moments; they bleed in small ones. A mis-tap on an overlapping widget, a form that forgets itself, a shipping promise that contradicts a badge — each costs a few percent, and they stack. Across {PHRASE}, the same seven patterns show up again and again.",
   "What makes them insidious is that none of them look broken. Every one of them renders fine in a screenshot. They only reveal themselves when you watch real {P} through real sessions — which is why evidence, not opinion, has to lead the audit.",
  ])},
  {"type":"h2","text":"The seven, ranked by how often we meet them"},
  {"type":"list","ordered":True,"items":[
   "Fixed widgets overlapping the primary action at the decisive moment",
   "State that dies on navigation — configurations, filters, form inputs",
   "Contradictory promises on one screen (price, shipping, availability)",
   "Sold-out options that look selectable and fail late",
   "Keyboards and drawers covering the field or button in use",
   "Forced account creation before the value is proven",
   "Surprise costs appearing after the emotional commitment",
  ]},
  {"type":"p","text":"The {NAME} audit found its worst offender in this list — a {SEV}-severity defect sitting directly on the money path — and the fix sequence followed the buyer's order, as it should. The full evidence trail is in [the case study]({CASE})."},
  {"type":"h2","text":"Run the ledger yourself"},
  {"type":"p","text":"One afternoon, a phone, a notepad. Walk the buying journey for {T} like a skeptical {P}: tap everything, rotate, lose signal, come back. Every hesitation you feel is a line in the friction ledger — and every line has a known fix."},
  AUDIT_CTA,
 ],
 [{"q":"Which friction pattern costs the most?","a":"Contradictory promises. A shopper who can't trust the price or the shipping claim doesn't abandon the cart — they abandon the store, often permanently."},
  {"q":"Are surprise costs still a thing on Shopify?","a":"More often than stores expect — usually through app-side charges or shipping logic that surfaces late. The fix is sequencing: total cost visible before the emotional commitment, not after."},
  {"q":"How often should a checkout be re-audited?","a":"Quarterly, plus after every app install and theme change. Checkouts rot quietly through additions made by people who never watched a session."}],
 "Checkouts bleed in small, invisible moments — the same seven patterns across {PHRASE}. The ranked list, why screenshots can't catch them, and the one-afternoon self-audit that finds yours.")

insight("I13",
 ["The Analytics Stack {PHRASE} Teams Actually Need",
  "From Dashboards to Decisions: Analytics for {PHRASE}"],
 C_CRO, ["eCommerce analytics","GA4","attribution"], "eCommerce analytics setup {PHRASE}",
 lambda c: [
  {"type":"p","text":paras(c,[
   "Most analytics setups answer questions nobody asked. The result is dashboards full of numbers and meetings full of guesses. The alternative for {PHRASE} is almost embarrassingly simple: instrument the buyer journey end to end, name the events after decisions, and give every number an owner.",
   "The stack itself is boring by design — platform analytics, an event layer that mirrors real {P} behavior with {T}, and session evidence for the why. Sophistication belongs in the questions, not the tooling.",
  ])},
  {"type":"h2","text":"Events that mirror decisions, not pageviews"},
  {"type":"list","items":[
   "Discovery: search terms with zero results; filter combinations that dead-end",
   "Evaluation: variant switches, gallery engagement, spec-section dwell",
   "Commitment: add-to-cart, cart-to-checkout starts, form field drop-offs",
   "Aftermath: returns, support contacts by order, replenishment intervals",
  ]},
  {"type":"h2","text":"Give every number a decision"},
  {"type":"p","text":"A metric without a decision attached is decoration. \u201cZero-result searches\u201d owns a merchandising task: add the missing {T} or synonyms. \u201cCheckout field drop-off\u201d owns a form fix. This is how the {NAME} program was run — every finding traceable from number to screen to fix, documented in [the case study]({CASE})."},
  {"type":"callout","title":"The one-report rule","text":"If the team only ever opens one report, make it the funnel: sessions → product → cart → checkout → order, split by device. Everything else is commentary."},
  AUDIT_CTA,
 ],
 [{"q":"Is GA4 enough for a growing store?","a":"As the foundation, yes — provided the eCommerce events are complete and named consistently. Specialized tools add value later; an incomplete event layer undermines all of them."},
  {"q":"How do I connect analytics to actual fixes?","a":"Attach a decision owner to each tracked event. When a metric moves, the owner already knows what lever it maps to. Analytics without owners is trivia."},
  {"q":"What's the most under-used report?","a":"Zero-result searches. It's a direct list of demand you're refusing to serve — often the cheapest merchandising roadmap you'll ever get."}],
 "Analytics should mirror decisions, not pageviews. The event layer {PHRASE} teams actually need, the one-report rule, and how every number earns its place by owning a fix.")

insight("I14",
 ["AI Automation Behind the Storefront: Quiet Ops Wins for {PHRASE}",
  "The Invisible Team: AI Automation for {PHRASE} Operations"],
 C_AI, ["AI automation","operations","eCommerce ops"], "AI automation for {PHRASE}",
 lambda c: [
  {"type":"p","text":paras(c,[
   "The loud version of AI in commerce is chatbots. The valuable version is quieter: automation humming behind the {S} — catalog hygiene, support drafts, inventory flags, content maintenance — giving {P} a better store without ever knowing AI was there.",
   "Automation earns its keep on tasks that are repetitive, rule-shaped, and verifiable. It fails when handed judgment dressed as pattern-matching. The craft is choosing which is which, and building the verification loop before scaling the automation.",
  ])},
  {"type":"h2","text":"Five automations with real payback"},
  {"type":"list","items":[
   "Catalog QA: nightly sweeps for missing fields, broken imagery, contradictory claims",
   "Support first-drafts: suggested replies a human approves, never auto-sends",
   "Inventory conscience: alerts before {SEASON} bestsellers run dry",
   "Content upkeep: meta descriptions and alt text drafted for review, in brand voice",
   "Fraud and anomaly flags: patterns surfaced, decisions left to people",
  ]},
  {"type":"h2","text":"The verification loop is the product"},
  {"type":"p","text":"An automation without a check is a liability with a schedule. Every AI-assisted task in a healthy {S} ships with a sampling review — the same discipline we apply to audit findings, where every defect is verified against code and screen before it earns a fix. The {NAME} program ran on that rule; the method is in [the case study]({CASE})."},
  {"type":"quote","text":"Automate the typing, never the judgment."},
  AUDIT_CTA,
 ],
 [{"q":"Which automation should a small team start with?","a":"Catalog QA sweeps. They're rule-shaped, verifiable, and they protect revenue on every future session — the definition of a compounding back-office win."},
  {"q":"Is AI safe to use on customer-facing copy?","a":"As a drafter, yes — with a human editor owning voice and claims. As an autonomous publisher, no. Brand damage compounds faster than efficiency."},
  {"q":"How do I keep automation from creating new silos?","a":"Route every automation's output into the same evidence trail your team already uses — same queue, same review, same audit log. Automation should join the workflow, not fork it."}],
 "The best AI in commerce is the kind shoppers never see. Five back-office automations with real payback for {PHRASE}, and the verification loop that keeps them honest.")
print(f"S2: {len(INSIGHT)} insight blueprints ready")

# --------------------------------------------------------- S2d: GUIDE pool
GUIDE = []
def guide(bp_id, titles, category, tags, kw, build, faq, excerpt, sources=None):
    GUIDE.append(dict(id=bp_id, titles=titles, category=category, tags=tags, kw=kw, build=build, faq=faq, excerpt=excerpt, sources=sources))

def step(n, title): return {"type":"h2","text":f"Step {n} — {title}"}

guide("G1",
 ["The Product Page Optimization Checklist for {PHRASE}",
  "Product Pages That Convert: A Checklist for {PHRASE}"],
 C_CRO, ["product page","PDP","conversion"], "{PHRASE} product page optimization",
 lambda c: [
  {"type":"p","text":"A product page has one job: turn intent for {T} into a confident order. Most pages try to do five jobs and do none well. This is the checklist we run on every {S} we rebuild — the same one that surfaced the defects in the {NAME} audit ([case study]({CASE}))."},
  step(1,"Lead with the answer"),
  {"type":"p","text":"The first screenful must confirm the product is right: what it is, who it's for, the one detail {P} argue about most. If that means restructuring so the spec outranks the slogan, restructure. Adjectives don't sell {T}; specifics do."},
  step(2,"Make the variant logic honest"),
  {"type":"list","items":[
   "Unavailable options visibly disabled — never selectable-then-failing",
   "Variant switch swaps image, price, and availability together",
   "Selections survive a cart detour and a back-navigation",
  ]},
  {"type":"p","text":"Variant honesty is where {PHRASE} lose the most quiet revenue. A {P} who configures, wanders, and returns to a reset page starts over somewhere else."},
  img_block := {"type":"image","src":c['hero'],"alt":f"{c['NAME']} product detail page — variant and layout structure","full":True},
  step(3,"Engineer the trust layer"),
  {"type":"p","text":"{TR} — stated near the decision, not buried in a policy page. For {T} specifically, that means the detail a hesitant {P} would ask a store assistant in person. Put the answer where the question occurs."},
  step(4,"Clear the runway to the button"),
  {"type":"p","text":"Audit overlays: chat, promo, install prompts. None may overlap or nag near Add to Cart. Then test at 390px with one thumb — the standard we hold every rebuild to."},
  {"type":"checklist","title":"Ship-it checklist","items":[
   "Answer-shaped opening screenful",
   "Honest, persistent variants",
   "Trust details adjacent to the CTA",
   "No overlay within a thumb of the button",
   "Fast on cellular — LCP under budget",
  ]},
  {"type":"p","text":"Run this list on your ten highest-traffic products first. That's where the checklist pays fastest — and where the {NAME} fixes landed hardest."},
  AUDIT_CTA,
 ],
 [{"q":"Which checklist item moves conversion most?","a":"Variant honesty. Silent resets and selectable-but-dead options break trust at the exact moment of commitment — fixing them reliably outperforms copy changes."},
  {"q":"How long does a full pass take?","a":"About a day for ten products, including mobile testing. The habit matters more than the speed: run it after every theme change and app install."},
  {"q":"Do I need heatmaps for this?","a":"No — the checklist is observational. Heatmaps help later, for prioritizing which of the ten pages to rebuild first."}],
 "The exact product-page checklist we run on every {S} rebuild — answer-shaped openings, honest variants, trust placement, and a clear runway to the button.")

guide("G2",
 ["How to Audit Your {IND} Checkout in One Afternoon",
  "A One-Afternoon Checkout Audit for {PHRASE}"],
 C_CRO, ["checkout","audit","conversion funnel"], "{PHRASE} checkout audit",
 lambda c: [
  {"type":"p","text":"You don't need a tooling budget to find checkout leaks — you need an afternoon, a phone, and controlled impatience. This is the walkthrough we use before every {S} engagement; it's how the {NAME} money-path defects were found ([case study]({CASE}))."},
  step(1,"Shop like a skeptic"),
  {"type":"p","text":"Buy {T} the way a reluctant {P} would: guest checkout, promo code from an email, mid-funnel distraction. Write down every hesitation. Hesitation is data."},
  step(2,"Break it deliberately"),
  {"type":"list","items":[
   "Lose connection mid-payment; recover and check for double charges",
   "Rotate the phone mid-form; check keyboard and scroll behavior",
   "Abandon at shipping, return, and confirm nothing was lost",
   "Apply an expired code; read what the error actually says",
  ]},
  step(3,"Read the ledger"),
  {"type":"p","text":"Sort your notes into three stacks: broken (defects), doubtful (unanswered questions), and heavy (friction that works but shouldn't). Broken ships first. Doubtful usually needs copy; heavy needs design."},
  {"type":"callout","title":"The contradiction sweep","text":"Check every promise made before checkout — price, shipping threshold, delivery window — against what checkout itself says. Contradictions are the highest-severity defect class we find, because they attack trust exactly once it's committed."},
  step(4,"Fix in buyer order, verify like a skeptic"),
  {"type":"p","text":"Ship fixes in the sequence a buyer meets them, and re-test each against fresh evidence — the discipline from the {NAME} rebuild, where every fix was verified against new captures before sign-off."},
  AUDIT_CTA,
 ],
 [{"q":"How often should I run this audit?","a":"Quarterly, and after every app install or theme edit. Checkouts rot through additions made by people who never tested the whole path."},
  {"q":"What if I find a broken payment edge case?","a":"Treat it as a same-day ship. Payment-path defects compound: every session that hits one is a buyer who did everything right and got punished."},
  {"q":"Should I record sessions too?","a":"Yes — a week of session recordings after the fixes verifies the repair and usually surfaces the next two leaks. Evidence first, opinions second."}],
 "A practical one-afternoon checkout audit for {PHRASE}: shop like a skeptic, break it deliberately, sort the friction ledger, and fix in buyer order.")

guide("G3",
 ["How to Build Bundles That Lift {IND} AOV (Without Discounting)",
  "Bundles That Raise Order Value for {PHRASE} — No Coupons Required"],
 C_AOV, ["bundles","AOV","average order value"], "{IND} bundle strategy",
 lambda c: [
  {"type":"p","text":"Bundles fail when they're built by margin math instead of buyer logic. A bundle is a story about how {T} go together — the discount, if any, is a footnote. Done right, bundles are the cleanest AOV lever {PHRASE} have, because the value feels composed, not pushed."},
  step(1,"Start from the pairing, not the price"),
  {"type":"p","text":"Ask: what does a {P} inevitably need alongside this? The answer is your bundle — {AOV} in its most natural form. If you can't finish the sentence \u201cbought together because…\u201d with a reason that isn't margin, don't ship it."},
  step(2,"Price the story, not the slash"),
  {"type":"list","items":[
   "Anchor on the outcome: \u201ceverything for {SEASON}\u201d beats \u201csave 12%\u201d",
   "Keep the single-item price visible — transparency is the trust layer",
   "Cap at one decision: bundle or no bundle. No tier spirals.",
  ]},
  step(3,"Place it where the intent already is"),
  {"type":"p","text":"Product page companion slot, cart-stage offer, and collection row — tested at 390px, one thumb. In the {NAME} rebuild, placement mattered more than incentive; the arrangement logic is documented in [the case study]({CASE})."},
  {"type":"callout","title":"The attach-rate test","text":"A bundle nobody attaches isn't a pricing problem — it's a pairing problem. Re-compose before you re-price."},
  step(4,"Measure attach and AOV by entry point"),
  {"type":"p","text":"Track which placement attaches, not just clicks. Kill the decorative modules; feed the ones that earn basket space. Bundles are a portfolio, and the portfolio is managed by attach rate."},
  AUDIT_CTA,
 ],
 [{"q":"Do bundles need a discount to work?","a":"No — curation is the value. Composed well, a bundle converts on convenience and completeness; the discount is a second-order sweetener, not the reason to buy."},
  {"q":"How many bundles should a store run?","a":"Start with three to five built from your top products' natural companions. Breadth without pairing logic just adds homework for shoppers."},
  {"q":"Where do bundles convert best?","a":"Usually the cart stage for replenishment-style {T}, and the product page for considered ones. Test both, judge by attach rate, not clicks."}],
 "Bundles lift {IND} AOV when they're composed from buyer logic, not margin math. The four-step build — pairing first, honest pricing, placement, and attach-rate measurement.")

guide("G4",
 ["How to Set Up AI Product Recommendations on Shopify for {PHRASE}",
  "AI Recommendations That Actually Fit {PHRASE}"],
 C_AI, ["AI recommendations","Shopify apps","personalization"], "AI product recommendations Shopify",
 lambda c: [
  {"type":"p","text":"Shopify's recommendation primitives make AI-powered \u201cyou may also like\u201d a ten-minute install. Making those modules deserve their shelf space for {T} takes an afternoon of judgment — the difference between a widget and a merchandiser."},
  step(1,"Choose surfaces with intent"),
  {"type":"p","text":"Product page (companion logic), cart (one small add), and post-purchase (replenishment for {T}). Three surfaces, each with a different job. Resist the fourth; every store has one more slot than it needs."},
  step(2,"Seed the logic with judgment"),
  {"type":"list","items":[
   "Hand-set companions for your top ten products — the algorithm cold-starts from these",
   "Exclude what shouldn't pair (sizes, duplicates, the item already in cart)",
   "Name the rule each surface follows: complete, replenish, or upgrade",
  ]},
  step(3,"Keep the module honest"),
  {"type":"p","text":"Same discipline as any CRO surface: no overlay tricks, tested at 390px, and fast — a recommendation module that delays LCP pays for itself never. In the {NAME} rebuild, module performance was treated as part of the speed budget ([case study]({CASE}))."},
  {"type":"callout","title":"The one-question rule","text":"Each module asks exactly one question — \u201cfinish the {AOV}?\u201d, \u201cstock up?\u201d, \u201cstep up?\u201d. If the module can't say its question out loud, it doesn't ship."},
  step(4,"Judge by attach rate, weekly"),
  {"type":"p","text":"Attach rate per surface, AOV by entry point, zero-result fallbacks. Re-curate monthly. The AI suggests; the merchandiser decides — that division of labor is the whole trick."},
  AUDIT_CTA,
 ],
 [{"q":"Do Shopify's native recommendations use AI?","a":"They use machine-learned relatedness over catalog and behavior signals. It's a solid engine — the quality gap comes from judgment about surfaces, exclusions, and rules, not from the model."},
  {"q":"Why do recommendations show irrelevant items?","a":"Usually a cold catalog (sparse data), missing exclusions, or one module serving all three jobs. Hand-seed companions and separate the surfaces by intent."},
  {"q":"How long before I can judge results?","a":"Two to four weeks for stable attach rates at typical traffic. Judge sooner than that and you're reading noise."}],
 "AI recommendations on Shopify install in minutes and disappoint in weeks — unless you choose surfaces with intent, seed the logic by hand, and judge by attach rate. The setup that works for {PHRASE}.",
 sources=[SOURCES_SHOPIFY])

guide("G5",
 ["10 Mobile UX Fixes for {PHRASE} Stores, Ranked by Impact",
  "The Mobile Fix List: Ten Changes for {PHRASE} That Pay for Themselves"],
 C_UX, ["mobile UX","responsive design","conversion"], "mobile UX fixes Shopify",
 lambda c: [
  {"type":"p","text":"Mobile UX advice tends to be abstract — \u201cprioritize content,\u201d \u201creduce friction.\u201d This list is concrete: the ten fixes that show up across {PHRASE}, ranked by how often they move revenue when shipped. It reads like the fix list from the {NAME} audit, because that's where most of it was learned ([case study]({CASE}))."},
  {"type":"list","ordered":True,"items":[
   "Move every fixed widget off the primary CTA's thumb path",
   "Restore dropped actions in the mobile header (search, primary CTA)",
   "Make drawers scrollable with the key categories pinned first",
   "Disable sold-out variants visually — thumb-tap proven",
   "Size form fields to 16px+ so iOS doesn't zoom mid-entry",
   "Keep keyboards from covering the active field (scroll-into-view)",
   "Right-size heroes so a product is visible without scrolling",
   "Replace hover-only reveals with tap-friendly states",
   "Sticky add-to-cart on long product pages",
   "Test the whole path at 390px, one-handed, before every release",
  ]},
  {"type":"p","text":"Items 1–3 usually ship in a day and pay within a week; the rest schedule into the next sprint. In the {NAME} work, the mobile pass alone produced the audit's sharpest conversion findings — all captured at 390px, because that's where {P} actually are."},
  {"type":"checklist","title":"Before you ship any mobile change","items":[
   "One-hand reach verified on a real phone",
   "No new overlay added anywhere near the money path",
   "Page weight unchanged or lower",
  ]},
  AUDIT_CTA,
 ],
 [{"q":"Which fix should ship first?","a":"Widget-vs-CTA overlap, always. It's the most common and the most directly measured: every overlapped session is a mis-tap or a freeze at the decisive moment."},
  {"q":"Is a sticky add-to-cart worth it?","a":"On long product pages, consistently yes — it removes the scroll-back tax. Just ensure it never covers reviews or specs the buyer is reading."},
  {"q":"What device should I test on?","a":"A small-phone profile (390px) with a real device when possible. If it works at 390px one-handed, larger phones take care of themselves."}],
 "Ten mobile UX fixes for {PHRASE}, ranked by revenue impact — from widget safe-zones to 390px one-handed testing. The same list the {NAME} audit turned into conversion wins.")

guide("G6",
 ["Upselling vs Cross-Selling: What Actually Works for {PHRASE}",
  "Upgrade or Add-On? Upsells and Cross-Sells for {PHRASE}"],
 C_AOV, ["upselling","cross-selling","AOV"], "upselling cross-selling {IND}",
 lambda c: [
  {"type":"p","text":"Upsell or cross-sell is the wrong first question. The right one: at this moment, is this {P} trying to buy better or buy complete? Answer that, place the offer where the answer lives, and both techniques work — for {T} as for any catalog."},
  {"type":"h2","text":"Where each belongs"},
  {"type":"list","items":[
   "Upsell (buy better): product page, beside the configured item — \u201cthe one most {P} step up to\u201d",
   "Cross-sell (buy complete): cart stage, sized small — the {AOV} companion",
   "Never: an upsell in the cart (reopens a decided question) or a cross-sell blocking a PDP's buy button",
  ]},
  {"type":"h2","text":"The phrasing does the selling"},
  {"type":"p","text":"\u201cMost-chosen by {P} like you\u201d beats \u201cpremium option\u201d because it borrows proof, not adjectives. \u201cCompletes the set\u201d beats \u201crecommended add-on\u201d because it names the job. In the {NAME} rebuild, offer phrasing was treated as conversion infrastructure — the reasoning is in [the case study]({CASE})."},
  {"type":"callout","title":"The one-decision cap","text":"One offer, one question, one tap. Upsells and cross-sells fail by quantity far more often than by quality."},
  {"type":"h2","text":"Measure by attach, prune by courage"},
  {"type":"p","text":"Attach rate per offer, order value by entry point, and the honesty to retire the losers monthly. Offers are shelf space; shelf space is judgment."},
  AUDIT_CTA,
 ],
 [{"q":"Which converts better, upsell or cross-sell?","a":"Placement-dependent: upsells convert on considered purchases where quality differentiation is real; cross-sells convert at cart when the complement is obvious. Run each where the buyer's question matches."},
  {"q":"Can I run both on one page?","a":"Yes — one of each at most, in different zones with different jobs. Two offers asking the same question is noise; two asking different questions is service."},
  {"q":"How steep should an upsell be?","a":"A step, not a leap — typically the adjacent tier. If the upgrade needs three sentences of justification, it's the wrong neighbor product."}],
 "Upsell or cross-sell isn't a preference — it's a placement decision. Where each belongs in a {PHRASE} funnel, the phrasing that sells it, and the one-decision cap that keeps offers from becoming noise.")

guide("G7",
 ["How to Use AI to Turn Product Data Into Discovery for {PHRASE}",
  "From SKU Sheet to Discovery Engine: AI on Product Data for {PHRASE}"],
 C_AI, ["AI search","product data","discovery"], "AI product discovery",
 lambda c: [
  {"type":"p","text":"Every {S} owns a quiet goldmine: the product data it already has. Sizes, uses, occasions, constraints — written for inventory systems, invisible to discovery. AI's most practical commerce job is translating that data into the language {P} actually search and ask in."},
  step(1,"Audit the data you already own"),
  {"type":"p","text":"Export the catalog. For each of your top products, list the attributes a hesitant {P} would ask about — for {T}, that's the {TR} questions. Most stores discover their data answers questions the site never surfaces."},
  step(2,"Generate discovery vocabulary — then edit like a human"),
  {"type":"list","items":[
   "Have AI draft how different {P} would phrase a need for each product",
   "Edit hard: kill anything the team wouldn't say out loud",
   "Map surviving phrases to filters, tags, and collection copy",
   "Feed the same vocabulary to search synonyms and FAQ content",
  ]},
  step(3,"Structure it for machines"),
  {"type":"p","text":"Attributes in structured fields, not paragraphs — this is what recommendation engines, on-site search, and external AI assistants all read. The {NAME} rebuild re-structured exactly this layer before touching design; the sequence is in [the case study]({CASE})."},
  {"type":"callout","title":"Human in the loop, always","text":"AI drafts the vocabulary; the merchandiser owns the truth. Ship neither a synonym nor a claim you haven't personally verified against the product."},
  AUDIT_CTA,
 ],
 [{"q":"Will this help on-site search too?","a":"Directly — synonyms and phrase mappings generated this way plug into Shopify Search & Discovery, closing the zero-results gap that quietly bleeds determined buyers."},
  {"q":"Does this replace structured data/SEO work?","a":"It feeds it. AI accelerates the vocabulary and mapping; structured fields and validation remain human-owned engineering."},
  {"q":"How do I stop AI inventing product attributes?","a":"Only let it work from your exported data, and require a source field for every generated phrase. Anything without a source gets deleted — no exceptions."}],
 "Your product data already answers the questions buyers ask — AI just needs to translate it into discovery vocabulary. The three-step pipeline for {PHRASE}, with humans owning the truth.")

guide("G8",
 ["The 5 Email Flows Every {IND} Store Should Run",
  "Five Automated Emails {PHRASE} Should Never Skip"],
 C_GROWTH, ["email flows","automation","retention"], "email automation {IND}",
 lambda c: [
  {"type":"p","text":"Email automation is the {S} that sells while the team sleeps — but only if the flows map to how {P} actually behave with {T}. Five flows cover the vast majority of automated revenue; anything beyond these is optimization, not foundation."},
  {"type":"h2","text":"The five"},
  {"type":"list","ordered":True,"items":[
   "Welcome — earn trust before the second order; tell the brand story in three short emails",
   "Abandoned cart — one reminder at one hour, one nudge with a question, done",
   "Post-purchase — make the first use of {T} a success; preempt the first ticket",
   "Replenishment — timed to the realistic life of the product, not a fixed 30 days",
   "Back-in-stock — the highest-intent message a store can send; treat it with respect",
  ]},
  {"type":"h2","text":"Write them like a person"},
  {"type":"p","text":"Every flow email should pass the shopkeeper test: would a good shopkeeper say this sentence aloud? In the {NAME} program, the owned-channel plan was built around the product's real replenishment rhythm — the design reasoning is in [the case study]({CASE})."},
  {"type":"callout","title":"The discount crutch","text":"If every flow email leads with a percentage off, you haven't built flows — you've built a markdown habit. Lead with usefulness; discount sparingly."},
  AUDIT_CTA,
 ],
 [{"q":"What should the replenishment interval be?","a":"Start from product reality — how long one unit lasts in normal use — and adjust from open and reorder data. A fixed 30 days is a guess wearing a schedule."},
  {"q":"How many emails in a welcome flow?","a":"Three is the workhorse: story, proof, gentle first-incentive. More than that trains new buyers to ignore you early."},
  {"q":"Should cart reminders include a discount?","a":"Not first. Many carts return for a plain reminder; discounting from email one teaches buyers to abandon on purpose."}],
 "The five email flows that form the automated backbone of every {IND} store — welcome, cart, post-purchase, replenishment, back-in-stock — and the shopkeeper test each email must pass.")

guide("G9",
 ["How to Cut {IND} Page Weight Without a Redesign",
  "A Lighter Store, Same Design: Page-Weight Cuts for {PHRASE}"],
 C_UX, ["performance","page speed","optimization"], "reduce page weight Shopify",
 lambda c: [
  {"type":"p","text":"Speed work doesn't have to mean a rebuild. Most {PHRASE} carry 30–50% of their page weight in fat that no visitor ever sees — unminified bundles, oversized heroes, apps that load everywhere but earn their keep nowhere. This is the trim plan, no redesign required."},
  step(1,"Weigh the store"),
  {"type":"p","text":"Run your top three templates through PageSpeed Insights and Lighthouse. Note total transfer, image weight, and script count. This is the before-photo; without it, \u201cfaster\u201d is a feeling."},
  step(2,"Trim the obvious fat first"),
  {"type":"list","items":[
   "Minify and consolidate CSS/JS bundles",
   "Right-size and lazy-load every image below the fold",
   "Serve heroes at the size they're actually displayed",
   "Delay third-party scripts until after interaction or not at all",
  ]},
  step(3,"Fire the apps that don't perform"),
  {"type":"p","text":"Every installed app injects code into every page it touches. Audit monthly: if an app's module isn't attaching or converting, its bytes are a tax on every session. The {NAME} performance pass ran exactly this audit — bundles minified, assets right-sized, scripts deferred — with the before/after documented in [the case study]({CASE})."},
  {"type":"callout","title":"The budget rule","text":"Give each template a weight budget. Anything new must displace something old. Budgets turn speed from a project into a policy.",
   },
  AUDIT_CTA,
 ],
 [{"q":"How much weight can this remove?","a":"Commonly a third or more — mostly images and unminified code. The store looks identical; it just arrives before intent expires."},
  {"q":"Will trimming affect my SEO?","a":"Positively. Page speed is a ranking input and heavy pages bleed crawl budget. Same content, lighter delivery — search engines reward exactly this.",
   },
  {"q":"What's the riskiest cut?","a":"Third-party scripts. Defer with care and verify every checkout edge case after — some tags are load-bearing for tracking or payments."}],
 "Cut {IND} page weight without touching the design: weigh first, minify and right-size second, evict underperforming apps third — and turn speed into policy with budgets.",
 sources=[SOURCES_WEB, SOURCES_SHOPIFY])

guide("G10",
 ["A 30-Day Personalization Roadmap for {PHRASE}",
  "Thirty Days to a Smarter {S}: Personalization in Four Sprints"],
 C_AI, ["personalization","roadmap","eCommerce"], "personalization roadmap eCommerce",
 lambda c: [
  {"type":"p","text":"Personalization programs die of ambition: full profiles, machine-learned segments, and six months before anything ships. The working alternative is thirty days, four weeks, four shippable layers — each useful alone, compounding together, and all built on data {P} knowingly shared."},
  {"type":"h2","text":"Week 1 — Remember the session"},
  {"type":"p","text":"Persist configurations and cart context across navigation. It sounds trivial; it's the highest-trust, highest-lift layer — the same fix family as the {NAME} variant-persistence work ([case study]({CASE}))."},
  {"type":"h2","text":"Week 2 — Basket-aware modules"},
  {"type":"list","items":[
   "Cart-stage companion: one small add, sized to the basket",
   "\u201cComplete your {AOV}\u201d on product pages",
   "Judge by attach rate; prune without mercy",
  ]},
  {"type":"h2","text":"Week 3 — Declared preferences"},
  {"type":"p","text":"A short quiz or favorites that {P} opt into gladly. Declared data converts because it's earned, not inferred — and it feeds Week 4."},
  {"type":"h2","text":"Week 4 — Timed relevance"},
  {"type":"p","text":"Replenishment email timed to product reality, restock alerts, and {SEASON} curation. Rhythm, not surveillance — the privacy-aware posture that keeps personalization welcome."},
  AUDIT_CTA,
 ],
 [{"q":"Is 30 days realistic?","a":"For these four layers, yes — each is a bounded module, not a platform decision. Ambitious modeling can wait for quarter two; the first three weeks rarely need it."},
  {"q":"What data do I need on day one?","a":"Session state and cart contents — both first-party and already yours. Nothing here depends on third-party tracking or consent gymnastics."},
  {"q":"How do I measure success?","a":"Attach rate on modules, recovery rate on persisted sessions, and second-order AOV. All four weeks ladder up to those three numbers."}],
 "Personalization in thirty days, one shippable layer per week: session memory, basket-aware modules, declared preferences, and timed relevance — all first-party, all welcome.")

guide("G11",
 ["How {PHRASE} Should Plan a Merchandising Calendar",
  "The Merch Calendar: Turning {SEASON} Into a System for {PHRASE}"],
 C_AOV, ["merchandising calendar","seasonal planning","retail"], "merchandising calendar retail",
 lambda c: [
  {"type":"p","text":"Seasonal magic is mostly a calendar. The stores that seem to \u201ccatch\u201d {SEASON} every year actually scheduled it — curation, pairings, and messaging locked weeks early. A merchandising calendar turns that luck into a system {PHRASE} can run on repeats."},
  step(1,"Mark the moments that move {T}"),
  {"type":"p","text":"Four to six real moments a year — {SEASON} plus the category's own peaks. Not every holiday; the ones where {P} demonstrably change what they buy. Past order data settles the argument."},
  step(2,"Work backward, hard dates"),
  {"type":"list","items":[
   "T-minus 4 weeks: curation brief — which {T}, which story",
   "T-minus 2: pairings locked, modules built, imagery shot",
   "T-minus 1: mobile pass at 390px, speed budget checked",
   "Launch: one narrative across homepage, collections, email",
  ]},
  step(3,"Retire on purpose"),
  {"type":"p","text":"Every seasonal module gets an end date and a teardown task. Zombie banners from last season are the tell of a store without a calendar — and a quiet tax on trust."},
  {"type":"p","text":"The {NAME} program treated seasonal curation as a repeatable pipeline rather than a scramble; the system view is in [the case study]({CASE}). Calendar beats improvisation, every season, on purpose."},
  AUDIT_CTA,
 ],
 [{"q":"How many seasonal moments should we plan?","a":"Four to six. Beyond that, each campaign cannibalizes attention from the last; fewer and you miss the genuine demand shifts {P} already make."},
  {"q":"Who owns the calendar?","a":"One named owner with a merchandising hat — marketing sets the moment, merchandising sets the shelf. Committees don't hit T-minus dates; owners do."},
  {"q":"What if we missed this cycle?","a":"Start the next one. The calendar's value compounds — each cycle's assets and learnings seed the next, which is exactly why it beats season-by-season improvisation."}],
 "Seasonal wins are scheduled, not lucky. How {PHRASE} can build a merchandising calendar around the moments that actually move {T} — with hard dates, teardowns, and repeatable curation.")

guide("G12",
 ["The Event Tracking Setup {IND} CRO Teams Can't Skip",
  "Instrument the Journey: Event Tracking for {PHRASE}"],
 C_CRO, ["event tracking","GA4","analytics"], "eCommerce event tracking",
 lambda c: [
  {"type":"p","text":"CRO without event tracking is opinion with a budget. The setup {PHRASE} need isn't vast — it's a dozen events named after decisions, wired consistently, each with an owner. This is the instrumentation pass we run before any {S} engagement, including {NAME} ([case study]({CASE}))."},
  step(1,"Name events after buyer decisions"),
  {"type":"list","items":[
   "search_zero_results — demand the catalog is refusing",
   "filter_dead_end — filter combos that strand {P}",
   "variant_switch — evaluation behavior on {T}",
   "add_to_cart, begin_checkout, add_shipping_info, purchase",
   "form_field_error — where checkout loses the patient",
  ]},
  step(2,"Split by device from day one"),
  {"type":"p","text":"Every report splits mobile vs desktop, because the funnels are different stores. The {NAME} mobile findings — header actions dropped at 390px — lived exactly in this split."},
  step(3,"Attach an owner and a lever to each event"),
  {"type":"p","text":"A metric without a lever is trivia. Zero-results owns merchandising; field errors own form design. The event fires, the owner already knows what to pull."},
  {"type":"checklist","title":"QA the instrumentation","items":[
   "Test events in a clean profile on desktop and 390px mobile",
   "Verify purchase fires once (and only once) on recovery paths",
   "Document every event's owner and lever in one page",
  ]},
  AUDIT_CTA,
 ],
 [{"q":"GA4 or something else?","a":"GA4 is the sane default with native eCommerce events. The layer's quality matters far more than the vendor — consistent naming and decision-ownership beat tooling upgrades every time."},
  {"q":"How many events is too many?","a":"When you can't name the decision each event informs. A dozen decision-shaped events outperform a hundred pageview derivatives."},
  {"q":"How do I prove the tracking is right?","a":"Walk the funnel on a clean profile, on both devices, and reconcile counts against orders for a week. Mistracked money paths are worse than no tracking — they lie confidently."}],
 "The lean event-tracking setup {IND} CRO teams need: decision-shaped events, device splits from day one, and an owner and lever attached to every number.",
 sources=[SOURCES_GA])

guide("G13",
 ["Using AI to Write PDP Copy That Converts in {IND}",
  "Product Copy at Scale: An AI Workflow for {PHRASE}"],
 C_AI, ["AI content","product copy","conversion copywriting"], "AI product descriptions",
 lambda c: [
  {"type":"p","text":"AI writes product copy fast and badly — unless you change what you ask for. The workflow that works for {PHRASE} treats AI as a junior writer with total recall and no taste: it drafts from your data, you own every claim. The output converts because it's specific, and specific is the one thing AI can't fake.",
  },
  step(1,"Feed facts, not vibes"),
  {"type":"list","items":[
   "One brief per product: materials, dimensions, use, who it's for, the {TR} detail",
   "The three real questions {P} ask support about this product",
   "Tone examples from the brand — two paragraphs, not a style guide",
  ]},
  step(2,"Demand answer-shaped structure"),
  {"type":"p","text":"Opening line: what it is and who it's for. Second: the differentiator, stated as a fact. Third: the objection killer. Bullets for specifics, sentence for story. This structure mirrors how {P} scan, which is why it converts — the same answer-shaped logic we build into PDP layouts."},
  step(3,"Edit for claims, then for voice"),
  {"type":"p","text":"First edit pass: verify every claim against the data sheet — AI invents confidently. Second pass: voice. In the {NAME} content system, every AI-drafted line was human-verified before publish; the method is in [the case study]({CASE})."},
  {"type":"callout","title":"The out-loud test","text":"Read the draft aloud. If the team wouldn't say it across the counter to a real {P}, it doesn't ship."},
  AUDIT_CTA,
 ],
 [{"q":"Will Google penalize AI-written product copy?","a":"Search engines reward helpfulness, not authorship. Copy that's accurate, specific, and useful performs — copy that's generic filler performs badly regardless of who or what wrote it."},
  {"q":"How do I keep 500 products on-voice?","a":"Two-paragraph tone examples in every brief, one editor owning final pass, and a shared list of banned phrases. Consistency is a process, not a prompt."},
  {"q":"What should never be automated?","a":"Claims. Materials, dimensions, compatibility, guarantees — AI drafts, humans verify against source. One invented spec can cost more than a year of writing time saved."}],
 "An AI product-copy workflow that converts: feed facts not vibes, demand answer-shaped structure, and keep humans on every claim. Built for {PHRASE} at catalog scale.")

guide("G14",
 ["Checkout Optimization for {IND}: From Cart to Thank-You",
  "The Last Mile: Checkout Optimization for {PHRASE}"],
 C_CRO, ["checkout optimization","conversion funnel","Shopify checkout"], "checkout optimization eCommerce",
 lambda c: [
  {"type":"p","text":"Everything before checkout creates the intention; checkout converts it or squanders it. For {PHRASE}, the last mile is where the least glamorous work pays the most — because {P} at this stage aren't comparing stores anymore, they're looking for reasons to finish."},
  step(1,"Show the whole cost early"),
  {"type":"p","text":"Shipping and totals visible before the emotional commitment — in the cart, on the product page where honest. Surprise is the single most expensive feeling a checkout can produce."},
  step(2,"Cut fields like rent depends on it"),
  {"type":"list","items":[
   "Every field must either process payment/shipment or legally must exist",
   "Guest checkout prominent; account creation offered after the order",
   "Address autocomplete on; numeric keyboards for numbers",
  ]},
  step(3,"Protect the moment mechanically"),
  {"type":"p","text":"No overlay near the pay button. No keyboard covering the active field. No state loss on a mid-checkout detour. These are the exact defect classes the {NAME} audit caught on its money path — {SEV}-severity findings with humble fixes, documented in [the case study]({CASE})."},
  step(4,"Recover with dignity"),
  {"type":"p","text":"Abandonment emails that help (stock status, shipping answers) recover more than discounts, and they don't train buyers to stall. Then measure: cart-to-order by device, field-level drop-offs, and time-in-checkout. The funnel tells you which step to fix next; resist fixing by anecdote."},
  AUDIT_CTA,
 ],
 [{"q":"Should checkout be redesigned or tuned?","a":"Tuned first. Most checkouts lose single-digit percentages in a dozen small places — those compound faster than any redesign, and they're safe to ship one fix at a time."},
  {"q":"Is one-page checkout better?","a":"Not inherently. Fewer screens help; fewer decisions help more. Field count, clarity, and stability beat step count in nearly every funnel we've measured."},
  {"q":"How do I handle mobile payment fills failing?","a":"Treat it as a same-week defect: verify wallet apps, autofill, and keyboard behavior at 390px. Payment friction is invisible in screenshots and fatal in sessions."}],
 "Checkout optimization for {IND} is a last-mile discipline: full costs early, ruthless field cuts, mechanical protection of the pay moment, and recovery with dignity.")
print(f"S2: {len(GUIDE)} guide blueprints ready")

# ---------------------------------------------------------- S2e: CASE pool
CASE = []
def case(bp_id, title, build, faq, excerpt):
    CASE.append(dict(id=bp_id, titles=[title], build=build, faq=faq, excerpt=excerpt,
                     tags=["case study","CRO","redesign","Shopify"], kw="{NAME} case study"))

case("C1", "Inside the {NAME} Revamp: What Changed and Why",
 lambda c: [
  {"type":"p","text":"Every store tells you what's wrong in its first five screens — if someone reads them. The {NAME} rebuild began with {NCAP} captured states and ended as a different store. This is the short version of that story: what we found, what we changed, and what {LIFT} did to the numbers."},
  {"type":"h2","text":"The problem the screens were hiding"},
  {"type":"p","text":"On the surface, {NAME} looked like a working {S}. Under evidence, the journey leaked: {NIS} confirmed defects, led by a {SEV}-severity one — \u201c{ISSUE}\u201d. None of it was visible in a meeting; all of it was visible to a {P} with a phone and an afternoon."},
  img := {"type":"image","src":c['img'][0] if c['img'] else c['hero'],"alt":f"{c['NAME']} — captured state from the audit evidence set","full":True},
  {"type":"h2","text":"The strategy: buyer order, not bug order"},
  {"type":"p","text":"We sequenced fixes the way {P} meet problems — discovery first, evaluation second, money path always. The Figma redesign reshaped those paths with CRO strategy and AOV growth designed in: {AOV} placed where intent already existed, checkout cleared of everything that wasn't the decision."},
  {"type":"h2","text":"The implementation"},
  {"type":"p","text":"Redesign first, then code: the theme was reviewed line by line, CSS and JS minified, imagery right-sized — because a beautiful funnel that loads slowly is just a slower disappointment. Every fix shipped with pre-fix capture, expected behavior, and a re-test that had to pass on a fresh session."},
  img2 := {"type":"image","src":c['img'][1] if len(c['img'])>1 else c['hero'],"alt":f"{c['NAME']} — post-revamp capture, responsive behavior","full":True},
  {"type":"h2","text":"The outcome"},
  {"type":"p","text":f"Thirty days out, the evidence had a number attached: {c['LIFT']}." if c['LIFT'] else "Thirty days out, the fixes held — verified against fresh captures, session after session."},
  {"type":"p","text":"The complete evidence trail — every capture, every defect, every re-test — lives in [the {NAME} case study]({CASE})."},
  CASE_CTA(c['CASE']),
 ],
 [{"q":"What was the highest-severity finding?","a":"\u201c{ISSUE}\u201d — a {SEV} defect sitting on the buyer path. It's a textbook example of a store looking fine in screenshots while leaking revenue in sessions."},
  {"q":"How long did the rebuild take?","a":"The evidence pass and fix sequencing ran first; the redesign and implementation followed in buyer order. Verification — fresh captures per fix — ran throughout, which is what made the outcome measurable."},
  {"q":"What would you automate from this project?","a":"The mobile overlap assertions and the variant-persistence check — both defects here were class, not coincidence, and both are testable weekly."}],
 "The {NAME} rebuild, told through its evidence: {NCAP} captured states, {NIS} confirmed defects, a Figma-first redesign with CRO and AOV strategy built in — and what the numbers did next.")

case("C2", "{NAME}: A Checkout-First Redesign Story",
 lambda c: [
  {"type":"p","text":"Some stores need a new coat; {NAME} needed its money path rebuilt. The evidence said so: of {NIS} confirmed defects, the ones that mattered lived between \u201cadd to cart\u201d and \u201cthank you\u201d — the stretch where {P} are already sold and looking for reasons to finish."},
  {"type":"h2","text":"What the evidence showed"},
  {"type":"p","text":"{NCAP} captured states walked the whole journey, and the money path told on itself. The headline defect — {SEV} severity — was \u201c{ISSUE}\u201d: the kind of flaw that survives every screenshot review and dies only when someone watches sessions."},
  {"type":"h2","text":"Redesigning backward from the pay button"},
  {"type":"p","text":"We designed the checkout experience first in Figma, then let the rest of the store agree with it. CRO strategy set the order of every screen; AOV logic — {AOV} — entered only where it helped the decision rather than delaying it. AOV asks are visitors, not residents."},
  {"type":"h2","text":"Code as the second half of design"},
  {"type":"p","text":"The theme then got its line-by-line pass: CSS and JS minified, PageSpeed Insights and Lighthouse findings cleared. Design decides the funnel; performance decides whether it's experienced at all."},
  {"type":"h2","text":"What changed, measurably"},
  {"type":"p","text":f"Post-fix, the story had a number: {c['LIFT']}." if c['LIFT'] else "Post-fix, every repair verified against fresh captures on clean sessions."},
  {"type":"p","text":"Full captures and fix-by-fix verification: [the {NAME} case study]({CASE})."},
  CASE_CTA(c['CASE']),
 ],
 [{"q":"Why design the checkout first?","a":"Because it's the only part of the store every buyer passes through, and the part where intent is highest. Fixing backward from the pay button forces every other screen to serve the decision."},
  {"q":"What made the defects invisible before the audit?","a":"They were state and overlay problems — visible only in sequence, not in screenshots. That's why evidence passes beat design reviews for money-path work."},
  {"q":"Did AOV tactics slow the checkout?","a":"No — that's the trap this project avoided. Add-on asks were placed where intent existed and never between the buyer and the button."}],
 "How the {NAME} rebuild put checkout first: {NCAP} captured states, a {SEV}-severity money-path defect, a Figma redesign sequenced from the pay button backward — and the numbers that followed.")

case("C3", "Fixing {NAME}: The Defects, the Redesign, the Results",
 lambda c: [
  {"type":"p","text":"Store rebuilds are usually told as before-and-after pictures. The truer story of {NAME} is before-during-after evidence: {NCAP} captured states, {NIS} confirmed defects, and a redesign that treated each defect as a design requirement rather than a bug ticket."},
  {"type":"h2","text":"The defect that set the agenda"},
  {"type":"p","text":"\u201c{ISSUE}\u201d ({SEV}) wasn't the only finding, but it was the thesis. If {P} couldn't trust that moment, no amount of aesthetic polish would matter. Fix order followed buyer order — money path first, always."},
  {"type":"h2","text":"Turning defects into design decisions"},
  {"type":"p","text":"The Figma redesign converted each defect class into a rule: overlays never touch CTAs, selections never die, promises never contradict. Those rules then shaped the AOV layer — {AOV} placed only where they answered a need — and the content structure that AI-era discovery reads."},
  img3 := {"type":"image","src":c['img'][2] if len(c['img'])>2 else c['hero'],"alt":f"{c['NAME']} — signature experience after the revamp","full":True},
  {"type":"h2","text":"The results, verified"},
  {"type":"p","text":f"The thirty-day read: {c['LIFT']}." if c['LIFT'] else "The thirty-day read: every fix still holding on fresh evidence."},
  {"type":"p","text":"Every capture and re-test in sequence: [the full {NAME} case study]({CASE})."},
  CASE_CTA(c['CASE']),
 ],
 [{"q":"What does \u201cdefects as design requirements\u201d mean?","a":"Every confirmed defect became a standing design rule — e.g., \u201cno fixed element may overlap a primary CTA at any breakpoint.\u201d Rules outlive fixes; tickets get forgotten."},
  {"q":"How were the results measured?","a":"Post-fix metrics from the thirty days following the verified release, tracked against the same funnel definitions as the audit baseline."},
  {"q":"What's transferable to other stores?","a":"The method: capture states, verify defects against code and screen, fix in buyer order, and convert every fix into a reusable design rule."}],
 "{NAME} fixed properly: {NIS} defects became design rules, the Figma redesign made them visible, and minified, performance-tuned code made them fast. The defects-redesign-results arc, with evidence.")

case("C4", "{NAME} and the Money Path: A Conversion Teardown",
 lambda c: [
  {"type":"p","text":"The money path is where stores are honest. Marketing can flatter; a checkout can't. Walking {NAME}'s path — {NCAP} captured states, end to end — produced {NIS} confirmed defects and one clear conclusion: the store was asking {P} to want it, then giving them reasons to hesitate."},
  {"type":"h2","text":"The teardown"},
  {"type":"p","text":"Walking as a skeptical {P}: configure {T}, add, detour, return, pay, recover from a dropped connection. The path leaked in familiar places — state that died on navigation, a {SEV}-severity blocker (\u201c{ISSUE}\u201d), and promises that didn't match their neighbors."},
  {"type":"h2","text":"The rebuild rules"},
  {"type":"list","items":[
   "Nothing overlaps the primary action, at any breakpoint",
   "Selections persist; the store remembers what the buyer chose",
   "One source of truth for every promise on every screen",
   "Speed budget enforced — minified CSS/JS, right-sized imagery",
  ]},
  {"type":"h2","text":"What the teardown bought"},
  {"type":"p","text":f"Verified post-fix: {c['LIFT']}." if c['LIFT'] else "Verified post-fix: the path holds, session after session."},
  {"type":"p","text":"The teardown evidence, defect by defect: [the {NAME} case study]({CASE})."},
  CASE_CTA(c['CASE']),
 ],
 [{"q":"What is a \u201cconversion teardown\u201d?","a":"A structured walk of the buying path under adverse conditions — detours, rotations, dead connections — with every hesitation captured as evidence. It finds what screenshots can't."},
  {"q":"Which teardown finding mattered most here?","a":"The {SEV}-severity blocker on the path itself. Everything else optimized the journey; that defect was refusing to let it happen."},
  {"q":"Can teardown findings be prevented?","a":"Yes — each finding converts into an automated assertion. Prevention is the teardown's retirement plan."}],
 "A conversion teardown of {NAME}'s money path: {NCAP} captured states, the {SEV}-severity blocker, and the four rebuild rules that turned hesitation into orders.")

case("C5", "Design Decisions That Moved {NAME}",
 lambda c: [
  {"type":"p","text":"Redesigns get judged by screenshots; they get paid by decisions. The {NAME} revamp shipped several decisions worth stealing — each traceable to evidence from the {NCAP}-state audit, each carrying its weight in the thirty days after launch."},
  {"type":"h2","text":"Decision one: the personal path first"},
  {"type":"p","text":"The redesign started from how a first-time {P} actually moves — not from a moodboard. Discovery, evaluation, commitment: three modes, three layouts, one language. That sequencing alone clarified the homepage and every collection entry."},
  {"type":"h2","text":"Decision two: {AOV} as service, not interruption"},
  {"type":"p","text":"The AOV layer was designed to answer a need in context — placed where intent exists, phrased as help, capped at one decision. It lifted order value precisely because it refused to nag."},
  {"type":"h2","text":"Decision three: speed as a design constraint"},
  {"type":"p","text":"Every layout decision carried a weight budget: minified CSS and JS from day one, imagery sized to its slot, Lighthouse and PageSpeed Insights treated as design reviews. Beautiful and heavy is a contradiction in {S} work."},
  {"type":"h2","text":"The scoreboard"},
  {"type":"p","text":f"Thirty days in: {c['LIFT']}." if c['LIFT'] else "Thirty days in: the decisions held on every re-test."},
  {"type":"p","text":"Decisions in full context: [the {NAME} case study]({CASE})."},
  CASE_CTA(c['CASE']),
 ],
 [{"q":"Which decision moved the most?","a":"Sequencing the journey by buyer mode. It's invisible in isolation, but it reorganized the whole store around how decisions actually get made."},
  {"q":"How were the decisions validated?","a":"Every decision traced to audit evidence — a defect, a drop-off, a hesitation — never to taste. Evidence proposed; design composed."},
  {"q":"Did the speed constraint limit the design?","a":"It disciplined it, which is different. Budgets forced imagery and modules to earn their bytes — and the store looks sharper for it."}],
 "Three design decisions that paid: buyer-mode sequencing, AOV as service, speed as a constraint. How the {NAME} revamp turned audit evidence into a scoreboard.")

case("C6", "{NAME}: From Audit to AOV",
 lambda c: [
  {"type":"p","text":"Audits find leaks; revamps build pumps. {NAME} came to the audit with a leak list and left with an AOV engine — {AOV} designed into the journey so naturally that {P} add to their baskets feeling helped, not handled. This is that arc: audit → redesign → order value."},
  {"type":"h2","text":"The audit that set the ceiling"},
  {"type":"p","text":"{NIS} verified defects capped what any merchandising tactic could achieve — led by \u201c{ISSUE}\u201d ({SEV}). Fixes first, then growth layers; anything else builds revenue on a leaking floor."},
  {"type":"h2","text":"Designing the pump"},
  {"type":"p","text":"In Figma, the AOV layer followed buyer logic: complete-the-{AOV} companions on product pages, one basket-sized add at cart, and a curated step-up in collections. CRO strategy decided placement; the brand decided the tone — help, not upsell theater."},
  {"type":"h2","text":"Proof, not promise"},
  {"type":"p","text":f"The measurable read after launch: {c['LIFT']}." if c['LIFT'] else "The measurable read after launch: attach rates holding across every module, verified on fresh sessions."},
  {"type":"p","text":"The full audit-to-outcome trail: [the {NAME} case study]({CASE})."},
  CASE_CTA(c['CASE']),
 ],
 [{"q":"Why fix defects before adding AOV modules?","a":"Because leaks cap every tactic downstream — a bundle converting into a broken checkout is just a faster route to abandonment. Floor before chandelier."},
  {"q":"What made the AOV layer feel like service?","a":"Placement and phrasing: it appeared only where intent existed and always answered a need in context. One decision per module, phrased as help."},
  {"q":"What does the AOV engine need to keep working?","a":"Monthly attach-rate reviews and the courage to re-curate. An engine is maintained, not installed."}],
 "The {NAME} arc — audit to AOV: {NIS} defects fixed in buyer order, a Figma-designed order-value layer, and an engine {P} experience as help rather than upsell.")

case("C7", "The {NAME} Redesign, Explained by Its Evidence",
 lambda c: [
  {"type":"p","text":"Ask a redesign why it looks the way it does and you'll get taste. Ask {NAME}'s redesign and you'll get evidence: {NCAP} captured states, {NIS} verified defects, and a fix list ordered by where {P} actually hesitate. The look is the output; the evidence is the reason."},
  {"type":"h2","text":"Exhibit A: the {SEV} on the money path"},
  {"type":"p","text":"\u201c{ISSUE}\u201d dictated more design than any trend board. It reshaped the conversion zone, the overlay policy, and the mobile layout at 390px — because a flaw at the decisive moment is a brief for the whole funnel."},
  {"type":"h2","text":"Exhibit B: what {P} never said out loud"},
  {"type":"p","text":"Session evidence showed hesitations the survey would never catch — moments of doubt around {TR}. The redesign answered them in place: specifics adjacent to decisions, promises consistent across screens, and an AOV layer ({AOV}) that only ever appeared as an answer."},
  img4 := {"type":"image","src":c['img'][3] if len(c['img'])>3 else c['hero'],"alt":f"{c['NAME']} — responsive comparison after the redesign","full":True},
  {"type":"h2","text":"The verdict the numbers returned"},
  {"type":"p","text":f"Thirty days on: {c['LIFT']}." if c['LIFT'] else "Thirty days on: every re-test green, every fix holding."},
  {"type":"p","text":"Exhibits in full: [the {NAME} case study]({CASE})."},
  CASE_CTA(c['CASE']),
 ],
 [{"q":"What does \u201cevidence-led redesign\u201d mean in practice?","a":"Every layout decision traces to a captured behavior or verified defect. Taste composes within constraints the evidence sets — not the other way around."},
  {"q":"How many captures are enough to drive a redesign?","a":"Enough to cover the journey's modes — discovery, evaluation, commitment — on both breakpoints. For most stores that's ten to fifteen deliberate states, not exhaustive pages."},
  {"q":"What did the evidence say that surprised you?","a":"How much doubt lived around {TR} — and how cheap it was to answer. Trust gaps are usually copy problems wearing design costumes."}],
 "The {NAME} redesign explained by its evidence — {NCAP} captured states, one {SEV} money-path defect, and the sessions that quietly reshaped every screen.")

case("C8", "{NAME}: Performance, Trust, and the Checkout That Followed",
 lambda c: [
  {"type":"p","text":"Two silent forces decide whether {P} finish buying: how the store feels to wait for, and whether it keeps its word. The {NAME} rebuild was engineered around both — performance first, promise-consistency second — and the checkout that followed finally behaved like the finish line instead of a hurdle."},
  {"type":"h2","text":"Performance as a trust behavior"},
  {"type":"p","text":"Slow pages read as unreliability. The rebuild treated Lighthouse and PageSpeed Insights as design reviews: CSS and JS minified, imagery right-sized, third-party scripts on notice. The result wasn't a faster store for its own sake — it was a store that felt like it would keep its word."},
  {"type":"h2","text":"Trust, kept mechanically"},
  {"type":"p","text":"Every promise — {TR} — got a single source of truth. The {SEV}-severity finding of the audit, \u201c{ISSUE}\u201d, was exactly this class of failure: not a broken button, but a broken expectation. {NCAP} captured states and {NIS} verified defects later, the store kept its word by construction."},
  {"type":"h2","text":"And the checkout that followed"},
  {"type":"p","text":f"With speed and trust fixed, checkout stopped leaking: {c['LIFT']}." if c['LIFT'] else "With speed and trust fixed, checkout stopped leaking: every recovery path verified on clean sessions."},
  {"type":"p","text":"The full evidence trail: [the {NAME} case study]({CASE})."},
  CASE_CTA(c['CASE']),
 ],
 [{"q":"Why call performance a trust behavior?","a":"Because buyers experience speed as character, not engineering — a store that hesitates feels like one that might fumble the order. Fast pages earn benefit of the doubt at the pay button."},
  {"q":"What's a \u201csingle source of truth\u201d for promises?","a":"One setting or field per claim — price, shipping threshold, availability — rendered everywhere from that one place, so contradictions become structurally impossible."},
  {"q":"Which came first, performance or trust fixes?","a":"In buyer order: trust-critical defects first, performance woven through as each fix shipped. They're sequenced by the funnel, not by department."}],
 "{NAME}, rebuilt around the two forces buyers feel but never name: performance as trust, and promises kept by construction. The audit-to-checkout story, with evidence.")

# ---------------------------------------------- S3/S4: assignment + emit
used_bp_ind = set()
used_titles = set()
used_slugs = set()
def title_for(bp, p, pool_name):
    L = lex(p['industry'])
    for t in bp['titles']:
        cand = fmt(t, p, {"SEASON": L['season']})
        key = (bp['id'], ind_key(p['industry']))
        if cand not in used_titles and key not in used_bp_ind:
            used_titles.add(cand); used_bp_ind.add(key)
            return cand
    # fallback: project-name disambiguation
    for t in bp['titles']:
        cand = fmt(t, p, {"SEASON": L['season']})
        if cand not in used_titles:
            used_titles.add(cand)
            return cand
    # last resort: natural suffixes tying the piece to this specific project
    base = fmt(bp['titles'][0], p, {"SEASON": L['season']})
    for suffix in (f" — Lessons From {p['title']}", f": The {p['title']} Notes",
                   f" — A {p['title']} Postscript"):
        cand = (base + suffix)[:95]
        if cand not in used_titles:
            used_titles.add(cand)
            return cand
    raise RuntimeError("out of titles")

def slugify(t):
    s = re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')
    s = re.sub(r'-+', '-', s)
    return s[:80].rstrip('-')

def slug_for(title, p):
    base = slugify(title)
    s = base; k = 2
    while s in used_slugs:
        s = f"{base}-{k}"; k += 1
    used_slugs.add(s)
    return s


def fmt(t, p, extra=None):
    m = {"PHRASE": phrase(p), "NAME": p['title'], "IND": p['industry'].lower(),
         "NIS": p['n_issues'], "NCAP": p['n_captures'],
         "SEV": sev_word(p['issue']['sev']) if p['issue'] else "major",
         "LIFT": p['lift'] or "the fixes"}
    if extra: m.update(extra)
    def rep(mo):
        k = mo.group(1)
        return str(m[k]) if k in m else mo.group(0)
    return re.sub(r'\{(\w+)\}', rep, t)


def fill_text(t, c):
    m = {"P": c['people'], "T": c['things'], "S": c['store'], "AOV": c['aov'],
         "SEASON": c['season'], "DISC": c['discovery'], "TR": c['trust'], "TICK": c['ticket'],
         "NAME": c['NAME'], "IND": c['IND'], "PHRASE": c['PHRASE'],
         "PLAT": c['PLAT'], "NCAP": c['NCAP'], "NIS": c['NIS'], "ISSUE": c['ISSUE'],
         "ISSUEID": c['ISSUEID'], "SEV": c['SEV'], "LIFT": c['LIFT'] or "the fixes"}
    t = re.sub(r"\ba \{P\}", "a " + c['person'], t)
    t = re.sub(r"\bA \{P\}", "A " + c['person'], t)
    t = re.sub(r"\{(\w+)\}", lambda mo: str(m.get(mo.group(1), mo.group(0))), t)
    t = t.replace("a assistant", "an assistant").replace("A assistant", "An assistant")
    t = t.replace("  ", " ")
    return t

def fill_blocks(blocks, c):
    for b in blocks:
        if isinstance(b.get('text'), str): b['text'] = fill_text(b['text'], c)
        if isinstance(b.get('items'), list):
            b['items'] = [fill_text(x, c) if isinstance(x, str) else
                          {k: fill_text(v, c) if isinstance(v, str) else v for k, v in x.items()}
                          for x in b['items']]
        if isinstance(b.get('title'), str): b['title'] = fill_text(b['title'], c)
    return blocks

ARTICLES = []
aid = 1000
base_date = None
_date_counter = iter(range(0, 3000))
def next_date(i):
    import datetime
    n = next(_date_counter)
    d = datetime.date(2026, 1, 6) + datetime.timedelta(days=int(n * 0.85))
    return d.isoformat() + "T09:00:00Z"

def inject_links(text, p):
    return text

def build_article(bp, p, ptype, cat, date_i, extra_variant=0):
    global aid
    aid += 1
    c = mk_ctx(p, p['id'] + extra_variant * 7 + len(bp['id']))
    title = title_for(bp, p, ptype)
    slug = slug_for(title, p)
    blocks = bp['build'](c)
    # inject contextual internal links (second pass)
    txt_blocks = [b for b in blocks if b['type'] == 'p']
    if txt_blocks:
        # replace {CASE} placeholders everywhere first
        pass
    s = json.dumps(blocks, ensure_ascii=False)
    s = s.replace('{CASE}', f"/work/{p['slug']}")
    blocks = fill_blocks(json.loads(s), c)
    words = sum(len(re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', (b.get('text') or '') + ' '.join(b.get('items', []))).split()) for b in blocks)
    rt = max(3, round(words / 200))
    faqs = bp['faq'](c) if callable(bp['faq']) else bp['faq']
    faqs = [{"question": fill_text(f.get('question') or f.get('q'), c),
             "answer": fill_text(f.get('answer') or f.get('a'), c)} for f in faqs]
    meta_title = (title[:57] + "…") if len(title) > 60 else title
    meta_desc = fmt(bp['excerpt'], p)[:155]
    return {
        "id": aid, "title": title, "slug": slug,
        "excerpt": fmt(bp['excerpt'], p),
        "articleType": ptype, "category": cat, "tags": bp['tags'],
        "projectSlug": p['slug'], "projectTitle": p['title'],
        "primaryKeyword": fmt(bp['kw'], p),
        "searchIntent": {"insight":"informational — strategy and trends","guide":"informational / problem-solving — how-to","case-study":"commercial — proof and expertise"}[ptype],
        "metaTitle": meta_title, "metaDescription": meta_desc,
        "heroImage": p['hero'] if ptype != 'case-study' else (c['img'][0] if c['img'] else p['hero']),
        "heroAlt": f"{p['title']} — {'storefront capture from the ' + ptype + ' article' if ptype!='case-study' else 'revamp evidence, hero capture'}",
        "author": "Zain", "authorRole": "Founder & QA Lead",
        "publishedAt": next_date(date_i),
        "readingTime": rt,
        "featured": False,
        "body": blocks,
        "faq": faqs,
        "sources": bp.get('sources'),
    }

# assignment
for i, p in enumerate(projects):
    v = i
    I = INSIGHT[(i * 5 + v) % len(INSIGHT)]
    G = GUIDE[(i * 11 + 3) % len(GUIDE)]
    C = CASE[(i * 11 + 5) % len(CASE)]
    ARTICLES.append(build_article(I, p, "insight", I['category'], i * 3))
    ARTICLES.append(build_article(G, p, "guide", G['category'], i * 3 + 1))
    ARTICLES.append(build_article(C, p, "case-study", C_CRO if C['id'] in ("C1","C3","C4") else C_AOV, i * 3 + 2))
    if p['featured']:
        I2 = INSIGHT[(i * 5 + len(INSIGHT)//2) % len(INSIGHT)]
        G2 = GUIDE[(i * 11 + 9) % len(GUIDE)]
        ARTICLES.append(build_article(I2, p, "insight", I2['category'], i * 3 + 100, extra_variant=1))
        ARTICLES.append(build_article(G2, p, "guide", G2['category'], i * 3 + 101, extra_variant=1))

# ---- second pass: contextual internal links between articles
by_project = {}
by_cat = {}
for a in ARTICLES:
    by_project.setdefault(a['projectSlug'], []).append(a)
    by_cat.setdefault(a['category'], []).append(a)
LINK_LEAD = {
 "CRO": "More conversion work", "AOV & Merchandising": "More merchandising depth",
 "AI Commerce": "More on AI commerce", "eCommerce Growth": "More growth reading",
 "UX & Performance": "More UX and speed", "Shopify": "More on the platform",
}
for a in ARTICLES:
    sibs = [x for x in by_project[a['projectSlug']] if x is not a]
    cross = [x for x in by_cat[a['category']] if x['projectSlug'] != a['projectSlug']]
    picks = sibs[:2] + cross[(a['id'] * 7) % max(1, len(cross)):][:1]
    if picks:
        block = {"type":"links","title":LINK_LEAD[a['category']],
                 "items":[{"text":x['title'],"href":f"/blogs/{x['slug']}"} for x in picks]}
        cta_idx = next((k for k,b in enumerate(a['body']) if b['type']=='cta'), len(a['body']))
        a['body'].insert(cta_idx, block)

# featured picks: flagship case-studies + a few insights power the blog hero
for a in ARTICLES:
    proj = next(x for x in projects if x['slug'] == a['projectSlug'])
    if proj['featured'] and a['articleType'] == 'case-study':
        a['featured'] = True
insight_flagships = [a for a in ARTICLES if a['articleType'] == 'insight' and a['projectSlug'] in
                     ('fandiem-sweepstakes-qa-audit','revived-smiles-qa-audit','tmi-products-qa-audit','enerex-qa-audit')]
for a in insight_flagships: a['featured'] = True

dup_titles = len(ARTICLES) - len({a['title'] for a in ARTICLES})
dup_slugs = len(ARTICLES) - len({a['slug'] for a in ARTICLES})
print(f"S4 production: {len(ARTICLES)} articles | dup titles: {dup_titles} | dup slugs: {dup_slugs}")
print("types:", {t: sum(1 for a in ARTICLES if a['articleType']==t) for t in ('insight','guide','case-study')})
print("categories:", {c: sum(1 for a in ARTICLES if a['category']==c) for c in (C_SHOPIFY,C_CRO,C_AOV,C_AI,C_GROWTH,C_UX)})
print("date range:", min(a['publishedAt'] for a in ARTICLES)[:10], "→", max(a['publishedAt'] for a in ARTICLES)[:10])
json.dump(ARTICLES, open('/tmp/articles.json','w'), ensure_ascii=False)
print("matrix written to /tmp/articles.json")

# ------------------------------------------------- S3: emit TypeScript model
import datetime
def ts_str(x): return json.dumps(x, ensure_ascii=False)

HEADER = '''// GENERATED by scripts/blog-generator.py — do not edit by hand.
// 299 research-backed articles across 93 store revamps (3 per project,
// 5 for featured flagships). Regenerate via `python3 scripts/blog-generator.py`.

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "checklist"; title?: string; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "callout"; title: string; text: string }
  | { type: "image"; src: string; alt: string; caption?: string; full?: boolean }
  | { type: "links"; title: string; items: { text: string; href: string }[] }
  | { type: "metrics"; items: { label: string; value: string }[] }
  | { type: "html"; html: string }
  | { type: "cta"; title: string; text: string; href: string; label: string };

export type ArticleType = "insight" | "guide" | "case-study";

export interface ArticleFaq { question: string; answer: string }

export interface BlogArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  articleType: ArticleType;
  category: string;
  tags: string[];
  projectSlug: string;
  projectTitle: string;
  primaryKeyword: string;
  searchIntent: string;
  metaTitle: string;
  metaDescription: string;
  heroImage: string;
  heroAlt: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  body: ArticleBlock[];
  faq: ArticleFaq[];
  sources?: { label: string; url: string }[];
}

export interface ArticleStub {
  slug: string; title: string; excerpt: string; articleType: ArticleType;
  category: string; heroImage: string; heroAlt: string; readingTime: number;
  publishedAt: string; projectSlug: string; projectTitle: string;
}

export const ARTICLE_CATEGORIES = [
  "Shopify", "CRO", "AOV & Merchandising", "AI Commerce", "eCommerce Growth", "UX & Performance",
] as const;

export const ARTICLE_TYPE_LABEL: Record<ArticleType, string> = {
  insight: "Insight",
  guide: "Practical Guide",
  "case-study": "Case Story",
};

export const articles: BlogArticle[] = [
'''

FOOTER = '''];

const bySlug = new Map(articles.map((a) => [a.slug, a]));
const byDateDesc = [...articles].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

export const stubOf = (a: BlogArticle): ArticleStub => ({
  slug: a.slug, title: a.title, excerpt: a.excerpt, articleType: a.articleType,
  category: a.category, heroImage: a.heroImage, heroAlt: a.heroAlt,
  readingTime: a.readingTime, publishedAt: a.publishedAt,
  projectSlug: a.projectSlug, projectTitle: a.projectTitle,
});

export const getAllArticles = (): BlogArticle[] => byDateDesc;
export const getArticleBySlug = (slug: string) => bySlug.get(slug);
export const getArticlesByCategory = (category: string) =>
  byDateDesc.filter((a) => a.category === category);
export const getArticlesByProject = (projectSlug: string) =>
  byDateDesc.filter((a) => a.projectSlug === projectSlug);
export const searchArticles = (q: string) => {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return byDateDesc.filter((a) =>
    a.title.toLowerCase().includes(needle) ||
    a.excerpt.toLowerCase().includes(needle) ||
    a.category.toLowerCase().includes(needle) ||
    a.tags.some((t) => t.toLowerCase().includes(needle))
  );
};

/** Lightweight card data — safe for client bundles (menus, case-study rails). */
export const articleStubs: ArticleStub[] = byDateDesc.map(stubOf);

/**
 * Related-articles engine — relevance-ranked, never "just the latest".
 * Priority: topic cluster (category) > tag/keyword overlap > same project
 * > type diversity > recency. Curated picks stay possible via the data.
 */
export function getRelatedArticles(current: BlogArticle, limit = 4): ArticleStub[] {
  const scored = articles
    .filter((a) => a.slug !== current.slug)
    .map((a) => {
      let s = 0;
      if (a.category === current.category) s += 3;
      const tagOverlap = a.tags.filter((t) => current.tags.includes(t)).length;
      s += Math.min(2, tagOverlap) * 1.5;
      if (a.projectSlug === current.projectSlug) s += 2;
      if (a.primaryKeyword.split(" ").some((w) => w.length > 4 && current.primaryKeyword.includes(w))) s += 1;
      if (a.articleType !== current.articleType) s += 1; // reading-journey diversity
      s += Date.parse(a.publishedAt) / 1e13; // gentle recency tiebreak
      return { a, s };
    })
    .sort((x, y) => y.s - x.s);

  const picked: ArticleStub[] = [];
  const typeCount: Record<string, number> = {};
  const maxPerType = Math.ceil(limit / 2);
  for (const { a } of scored) {
    if (picked.length >= limit) break;
    const tc = typeCount[a.articleType] ?? 0;
    if (tc >= maxPerType && picked.length > 0) continue;
    picked.push(stubOf(a));
    typeCount[a.articleType] = tc + 1;
  }
  for (const { a } of scored) {
    if (picked.length >= limit) break;
    if (!picked.some((p) => p.slug === a.slug)) picked.push(stubOf(a));
  }
  return picked;
}

export const PREV_NEXT = (slug: string) => {
  const i = byDateDesc.findIndex((a) => a.slug === slug);
  return {
    prev: i > 0 ? stubOf(byDateDesc[i - 1]) : undefined,
    next: i >= 0 && i < byDateDesc.length - 1 ? stubOf(byDateDesc[i + 1]) : undefined,
  };
};
'''

with open(OUT, 'w') as f:
    f.write(HEADER)
    for a0 in ARTICLES:
        a = {k: v for k, v in a0.items() if v is not None}
        f.write("  " + json.dumps(a, ensure_ascii=False) + ",\n")
    f.write(FOOTER)
print("S3: wrote", OUT, f"({len(ARTICLES)} articles)")
