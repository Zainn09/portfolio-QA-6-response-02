import type { BlogArticle } from "@/data/articles";

/**
 * Technology cluster (added 2026-11-01): ten hand-written, research-backed
 * posts covering NVIDIA's 2026 direction, the Microsoft Outlook transition,
 * Microsoft 365 Copilot in Outlook, and enterprise authentication — each
 * through a quality-assurance lens.
 *
 *   9501  NVIDIA's AI vision 2026 (announcements and what they mean)
 *   9502  Blackwell and Rubin performance/reliability testing
 *   9503  The 2026 AI infrastructure investment boom and data-centre reliability
 *   9504  New Outlook for Windows: what the transition means
 *   9505  Classic vs New Outlook: compatibility and regression testing
 *   9506  Microsoft 365 Copilot in Outlook: trust and testing
 *   9507  Enterprise email security 2026: lessons from CISA AA25-239A
 *   9508  Passkeys and phishing-resistant authentication validation
 *   9509  Microsoft Outlook migration checklist
 *   9510  AI adoption velocity and the QA gate
 *
 * Every announcement, date and figure below was verified against the cited
 * sources during writing (2026-11-01). Performance multipliers are NVIDIA's
 * own claims and are labelled as such throughout.
 */
export const techOutlookArticles: BlogArticle[] = [
  {
    "id": 9501,
    "title": "NVIDIA's AI Vision in 2026: What the Announcements Mean for the Future of Computing",
    "slug": "nvidia-ai-vision-2026-announcements",
    "excerpt": "CES 2026, GTC, and the Meta partnership: what Jensen Huang actually announced about Rubin and Blackwell in 2026, what remains unverified, and why the validation gap between announcement and production is where organisations get hurt.",
    "articleType": "insight",
    "category": "Technology",
    "tags": ['"NVIDIA"', '"Rubin"', '"Blackwell"', '"AI infrastructure"', '"Jensen Huang"', '"data centres"'],
    "projectSlug": "",
    "projectTitle": "",
    "primaryKeyword": "NVIDIA AI announcements 2026",
    "searchIntent": "informational — what did NVIDIA and Jensen Huang actually announce in 2026, and what does it mean",
    "metaTitle": "NVIDIA AI Vision 2026: What the Announcements Actually Mean",
    "metaDescription": "CES, GTC and the Meta deal: what NVIDIA announced in 2026, what is still unverified, and the validation gap between announcement and production.",
    "heroImage": "",
    "heroAlt": "",
    "author": "ABDULREHMAN",
    "authorRole": "Founder & QA Lead",
    "publishedAt": "2026-11-01T09:00:00Z",
    "readingTime": 8,
    "featured": false,
    "body": [
      {
            "type": "p",
            "text": "Jensen Huang has a habit of announcing the future on a schedule that surprises people who track semiconductors professionally. At CES in January 2026 he held up a Rubin wafer and said the chip was in full production — not sampling, not qualification, production — with volume shipments targeted for the second half of the year. Analysts who had pencilled in early 2027 for Rubin availability did the arithmetic and found an 18-month development cycle where the industry norm is 24 to 30 months. Then at GTC in March he confirmed the platform and, according to reporting from the keynote, told the audience that NVIDIA has roughly $1 trillion in combined Blackwell and Vera Rubin purchase orders committed through 2027."
      },
      {
            "type": "p",
            "text": "Both events are now a matter of public record, and the pattern they establish matters more than any single number: NVIDIA has moved to an annual cadence. The roadmap NVIDIA itself presented at GTC 2025 runs Blackwell Ultra (B300) in the second half of 2025, Vera Rubin (R100) in the second half of 2026, Rubin Ultra (R300) in the second half of 2027, and Feynman in 2028. One generation per year. That cadence is the announcement with the longest tail, because every organisation that plans compute against it has to decide how much trust to place in a timeline that has compressed by a full year."
      },
      {
            "type": "h2",
            "text": "What was actually announced, and by whom"
      },
      {
            "type": "p",
            "text": "It is worth separating the layers, because they carry different evidentiary weight. First, company announcements: the Rubin platform specifications (336 billion transistors on TSMC's 3nm process, 288 GB of HBM4 memory, 22 TB/s of memory bandwidth, 50 PFLOPS of FP4 inference per GPU, NVLink 6 at 3.6 TB/s per GPU) and the production status. Second, executive statements: Huang's characterisation of Rubin as an extreme co-designed six-chip platform, and at Computex his description of a five-layer cake approach to optimising from silicon to cloud. Third, partner confirmations: the strongest single data point of the year is the multiyear, multigenerational partnership NVIDIA announced with Meta on 17 February 2026."
      },
      {
            "type": "p",
            "text": "The Meta press release is useful precisely because it is specific. It describes the large-scale deployment of NVIDIA CPUs and millions of Blackwell and Rubin GPUs, the first large-scale NVIDIA Grace-only CPU deployment in Meta's data centres, a collaboration on Vera CPUs with the potential for large-scale deployment in 2027, GB300-based systems spanning on-premises and cloud, Spectrum-X Ethernet across Meta's infrastructure, and Confidential Computing adopted for WhatsApp private processing. Zuckerberg's quote in the release — building leading-edge clusters using the Vera Rubin platform to deliver personal superintelligence — is a customer executive endorsing a future product by name. Customers do not usually do that for chips that will not ship for two years. It is the closest thing to independent confirmation that the Rubin timeline is real, though it is still a statement from one of the two parties involved."
      },
      {
            "type": "h2",
            "text": "The claims, separated from the evidence"
      },
      {
            "type": "p",
            "text": "NVIDIA claims the Rubin platform delivers roughly ten times the token-processing capability of Blackwell at lower cost. Read that sentence the way an engineer should: it is a vendor claim, measured on NVIDIA's chosen workloads, on silicon that had not yet reached customers when it was made. The independent benchmarks that would test it do not exist yet, and when they arrive they will land somewhere below the headline number, as they always do. The same applies to the per-GPU power figure reported around 2,300 watts for Rubin — reported, not confirmed, and the number that will decide actual deployment economics. Rubin pricing is simply unannounced."
      },
      {
            "type": "p",
            "text": "What the evidence does support: the transistor count and process node, the memory system (HBM4 at 288 GB, nearly triple Blackwell's bandwidth), the NVLink 6 interconnect doubling per-GPU bandwidth, the annual cadence, and the fact that the world's largest AI buyers are writing purchase orders against a schedule that includes Rubin. Supply constraints are real too — TSMC's 3nm capacity is shared with Apple and AMD, and HBM4 supply is concentrated, which is why allocation in 2026 goes to hyperscalers first and everyone else waits."
      },
      {
            "type": "h2",
            "text": "Why the announcement-to-production gap is a quality problem"
      },
      {
            "type": "p",
            "text": "None of this is a criticism of NVIDIA. The problem it creates is organisational: the distance between a keynote and a dependable production deployment is filled with exactly the work that announcements do not show. Hardware validation — burn-in, stress, thermal soak. Workload validation against the models and data that actually matter to the buyer, not the vendor's demo. Driver and firmware integration across a stack of frameworks and operating systems. Reproducible benchmarking, where the same workload on the same configuration gives the same number, every time. Capacity acceptance before a rack is powered on. Production monitoring that catches the slow degradations no launch test will find."
      },
      {
            "type": "p",
            "text": "Consider an illustrative scenario, and treat it as an illustration, not a reported incident: a mid-size enterprise models its 2027 economics on the claimed ten-times cost reduction, pre-commits to a data-centre lease sized for Rubin, and then discovers during pilot workloads that its models — long-context, memory-heavy, latency-bound — only achieve a fraction of the headline gain on the specific rack configuration it actually bought. Nothing about the announcement was false. The claim was made on workloads the enterprise does not run. The gap between those two facts is a validation gap, and it is closed only by testing on the buyer's own workloads before the buyer's own capital is committed."
      },
      {
            "type": "p",
            "text": "The compressed cadence makes the gap worse, not better. When generations arrive every year, the validation window shrinks every year, and the organisation that treats each generation as a full infrastructure decision — with acceptance criteria, a pilot cohort, and a rollback plan — gets the same economics as the one that just orders what the roadmap promises. The difference is that one of them has evidence and the other has a press release."
      },
      {
            "type": "h2",
            "text": "What to watch next"
      },
      {
            "type": "p",
            "text": "Three things will convert the 2026 narrative from announcement to fact. First, the first independent benchmarks on customer silicon in the second half of 2026 — the numbers that will finally separate claimed multipliers from delivered ones. Second, whether the Rubin Ultra design reported in April 2026 (a dual-die revision targeting roughly 500 billion transistors and 384 GB of HBM4E in 2027) holds together, since it follows a reported design simplification. Third, the power figures: per-GPU draw decides whether Rubin's efficiency claims survive contact with real cooling budgets. Until those three land, the honest summary of NVIDIA's 2026 is this: the direction is credible, the demand is real, the silicon is in production, and the performance case is still a claim waiting for its evidence."
      },
      {
            "type": "links",
            "title": "Related reading",
            "items": [
                  {
                        "text": "How measured performance, not specs, should drive infrastructure decisions",
                        "href": "/blogs/site-speed-is-a-conversion-strategy-core-web-vitals-for-e-commerce-brands"
                  },
                  {
                        "text": "The AI testing stack: keeping generated workloads honest",
                        "href": "/blogs/2026-ai-testing-stack-shopify-qa"
                  },
                  {
                        "text": "All technology and QA analysis",
                        "href": "/blogs/category/technology"
                  }
            ]
      }
],
    "faq": [
      {
            "question": "Is NVIDIA Rubin shipping in 2026?",
            "answer": "NVIDIA announced at CES 2026 that Vera Rubin is in full production, with customer deliveries targeted for the second half of 2026. The announcement was repeated at GTC 2026. Partner and cloud availability follows through the hyperscalers and specialised GPU clouds."
      },
      {
            "question": "Is the 10x performance claim verified?",
            "answer": "No. The figure is NVIDIA's own, based on workloads NVIDIA selected. Independent benchmarks on customer silicon have not yet been published, so treat the multiplier as a claim until third-party testing confirms or corrects it."
      },
      {
            "question": "Why does the Meta partnership matter?",
            "answer": "It is a named customer confirming multi-year, multigenerational deployment of both Blackwell and Rubin, including the first large-scale Grace CPU-only deployment and a Vera CPU collaboration. It is the strongest public signal that the Rubin timeline is being treated as real by a major buyer."
      }
],
    "sources": [
      {
            "label": "NVIDIA — Meta Builds AI Infrastructure With NVIDIA (press release, 17 Feb 2026)",
            "url": "https://investor.nvidia.com/news/press-release-details/2026/Meta-Builds-AI-Infrastructure-With-NVIDIA/default.aspx"
      },
      {
            "label": "Introl — NVIDIA Rubin Enters Full Production (CES 2026 coverage)",
            "url": "https://introl.com/blog/nvidia-rubin-full-production-ces-2026-ai-infrastructure"
      },
      {
            "label": "Labo LLM — Nvidia Roadmap 2025-2028 (GTC 2025 timeline)",
            "url": "https://labo-llm.fr/en/infrastructure/nvidia-roadmap-vera-rubin/"
      },
      {
            "label": "Millionminer — NVIDIA Rubin Explained: Specs, Timeline & GPU Prices 2026",
            "url": "https://millionminer.com/news/nvidia-rubin-explained"
      }
]
  },
  {
    "id": 9502,
    "title": "Testing Blackwell and Rubin: How AI Accelerators Are Validated for Performance and Reliability",
    "slug": "blackwell-rubin-gpu-performance-reliability-testing",
    "excerpt": "How Blackwell and Rubin systems get validated: burn-in, stress and thermal soak, workload fidelity, reproducibility, capacity acceptance, and fleet monitoring — with NVIDIA's claimed multipliers treated as claims, not evidence.",
    "articleType": "insight",
    "category": "Technology",
    "tags": ['"NVIDIA"', '"GPU testing"', '"Blackwell"', '"Rubin"', '"reliability"', '"data centres"', '"QA"'],
    "projectSlug": "",
    "projectTitle": "",
    "primaryKeyword": "GPU performance and reliability testing",
    "searchIntent": "informational/procedural — how are AI accelerator generations validated before and after deployment",
    "metaTitle": "Testing Blackwell and Rubin: GPU Performance & Reliability",
    "metaDescription": "Burn-in, thermal soak, workload fidelity and fleet monitoring: how Blackwell and Rubin systems are validated, and why vendor claims need independent evidence.",
    "heroImage": "",
    "heroAlt": "",
    "author": "ABDULREHMAN",
    "authorRole": "Founder & QA Lead",
    "publishedAt": "2026-11-02T09:00:00Z",
    "readingTime": 8,
    "featured": false,
    "body": [
      {
            "type": "p",
            "text": "An announcement of a GPU generation is not an acceptance test. It is the opposite of one: it is the moment when the specification becomes law for a contract, while the evidence for that specification is still being generated. Blackwell has been through most of that process now, shipping since the second half of 2025 with its 208 billion transistors, HBM3e and the NVLink 5 interconnect. Rubin is mid-process, in full production by NVIDIA's own account as of CES 2026, with customer deliveries targeted for the second half of the year. That puts the two generations at different points on the same reliability curve, and the testing that applies to each is different."
      },
      {
            "type": "h2",
            "text": "What the claims look like before the evidence does"
      },
      {
            "type": "p",
            "text": "Start with the numbers on the table. Rubin: 336 billion transistors on TSMC's 3nm process, 288 GB of HBM4, 22 TB/s of memory bandwidth, 50 PFLOPS of FP4 inference per GPU, NVLink 6 at 3.6 TB/s per GPU, and a claimed roughly ten-times token-processing capability versus Blackwell at lower cost. Blackwell's documented figures sit underneath it, and the NVLink 5 interconnect that Blackwell introduced remains the reference architecture for how two chips act like one. Every one of those figures is a vendor-reported number. None of them is a measurement yet."
      },
      {
            "type": "p",
            "text": "The discipline that decides whether an accelerator fleet is production-ready is treating those numbers as hypotheses. The test questions are: does the claimed throughput hold on your workloads, not the vendor's; does it hold at the thermal and power envelope your data centre can actually sustain; and does it hold for months, not hours. Those three questions map to three distinct phases of testing, each with its own failure modes."
      },
      {
            "type": "h2",
            "text": "Phase one: the silicon earns its seat"
      },
      {
            "type": "p",
            "text": "Burn-in and stress testing is where infant mortality goes. Accelerators are exercised at or above their rated thermal and power envelope for extended periods while the failure count is tracked. A fleet of a few hundred chips will always contain a small number that fail early; the question is whether the failure rate falls off quickly, as it should, or stays flat, which would indicate a systemic issue with a process step, a memory supplier batch, or a design margin. The HBM4 memory that Rubin depends on is the part of the chip that has never shipped before at that density, so memory stress is the phase to watch closely. A single row of bad memory will not fail a stress test that only checks throughput; it will corrupt a training run in three weeks. Memory-pattern testing, error-injection, and ECC behaviour under load are the specific checks that catch what aggregate benchmarks cannot."
      },
      {
            "type": "h2",
            "text": "Phase two: the workload has to be faithful"
      },
      {
            "type": "p",
            "text": "This is the phase most often skipped, and it is where the gap between a press release and a production system lives. Workload fidelity means the benchmark runs the actual models, on the actual data distributions, at the actual batch sizes and sequence lengths, on the actual software stack. An illustrative scenario: a model team benchmarks a new accelerator with a synthetic GPT-style workload and reports a 9x gain versus the previous generation. When the real production load — longer context, heavier memory traffic, different kernel mixes — is applied, the gain is 3x. Neither number was fabricated. One was measured on the wrong workload. The only defence is a test suite built from production traces, versioned and re-run on every generation, so that the comparison is against the same workload, not a convenient one."
      },
      {
            "type": "p",
            "text": "Reproducibility is the second pillar of phase two, and it is harder than it sounds. A number that cannot be reproduced is not a measurement, it is an anecdote. Reproducibility requires pinning the driver, the framework version, the container, the interconnect topology, and the data partition. It requires running the same workload on the same configuration and getting the same number, within noise, every time. It requires knowing what the noise is, so that a 2 percent movement is not mistaken for a regression. For an accelerator fleet, reproducibility is not a lab exercise; it is the property that lets you compare a 2026 rack against a 2025 rack and know the comparison is real."
      },
      {
            "type": "h2",
            "text": "Phase three: the fleet proves itself in production"
      },
      {
            "type": "p",
            "text": "Capacity acceptance is the handover from a test environment to a live one, and it is a decision, not a moment. A cohort of racks is accepted only when burn-in has produced an acceptable failure rate, workload fidelity has been demonstrated on production traces, and the monitoring that will run in production is already in place and has been validated. The monitoring itself must be tested, which is a point that is easily missed: a fleet alert that has never fired in a controlled way has not been tested. Failure injection on a production fleet is the honest way to confirm that the system detects, pages, and recovers from the exact failures that stress testing showed are possible."
      },
      {
            "type": "p",
            "text": "Fleet monitoring is the long tail of reliability. The metrics that matter are not just utilisation and temperature; they are error rates, ECC counters, interconnect retries, memory errors, and power draw versus the rated envelope. A slow thermal creep that does not trip a threshold but steadily reduces throughput is invisible to a single reading and visible only to a trend over weeks. This is where the per-GPU power figure that Rubin's design is reported to push toward around 2,300 watts becomes a quality variable rather than a spec sheet line: the cooling budget it leaves in your data centre determines what thermal headroom your fleet has, and what headroom has is what your long-term reliability is made of."
      },
      {
            "type": "h2",
            "text": "The gap between claimed and measured, in practice"
      },
      {
            "type": "p",
            "text": "The honest expectation, and the one every buyer should build their models around, is that the measured multiplier will be lower than the claimed one, and the gap will vary by workload. The vendor claim is a maximum, measured on the best case. The production number is an average, taken on the real mix. The organisation that budgets for the claimed number is building its 2027 economics on a best case that the physics of real workloads will not deliver. The organisation that budgets for a fraction of the claim, measured on its own workloads, gets a forecast that is wrong in the safe direction. Neither approach is pessimism. Both are just different relationships to evidence."
      },
      {
            "type": "p",
            "text": "The second-hand lesson from Blackwell, now a year into shipping, is that the reliability of an accelerator generation is not a property of the chip; it is a property of the system, the workload, and the organisation running it. The same silicon is a different reliability story in a well-monitored fleet with a faithful test suite than in an unmonitored one that benchmarks on a demo workload. The accelerator is the easy part. The discipline around it is the product."
      },
      {
            "type": "links",
            "title": "Related reading",
            "items": [
                  {
                        "text": "The AI testing stack: keeping generated workloads honest",
                        "href": "/blogs/2026-ai-testing-stack-shopify-qa"
                  },
                  {
                        "text": "How measured performance, not specs, should drive infrastructure decisions",
                        "href": "/blogs/site-speed-is-a-conversion-strategy-core-web-vitals-for-e-commerce-brands"
                  },
                  {
                        "text": "Why quality assurance gets neglected in high-velocity releases",
                        "href": "/blogs/why-quality-assurance-is-neglected"
                  }
            ]
      }
],
    "faq": [
      {
            "question": "How is GPU performance validated?",
            "answer": "By measuring throughput and latency on production-faithful workloads, at the real thermal and power envelope, in a pinned software stack, and checking the result is reproducible across runs. The vendor's claimed multiplier is treated as a hypothesis to be confirmed or corrected, not a baseline to be compared against."
      },
      {
            "question": "How do you test GPU reliability over time?",
            "answer": "Burn-in and stress testing for early failures, memory-pattern and error-injection testing for silent corruption, then fleet monitoring of error counters, interconnect retries and thermal trends in production. A slow creep that never trips a threshold is only visible to a trend over weeks, so trend monitoring is as important as alerting."
      },
      {
            "question": "Is the 10x Rubin claim verified?",
            "answer": "No. It is NVIDIA's own figure, measured on workloads NVIDIA selected. Independent, customer-workload benchmarks on shipping Rubin silicon will be the first real test of the claim, and should be expected in the second half of 2026."
      }
],
    "sources": [
      {
            "label": "Introl — NVIDIA Rubin Enters Full Production (CES 2026 coverage)",
            "url": "https://introl.com/blog/nvidia-rubin-full-production-ces-2026-ai-infrastructure"
      },
      {
            "label": "Millionminer — NVIDIA Rubin Explained: Specs, Timeline & GPU Prices 2026",
            "url": "https://millionminer.com/news/nvidia-rubin-explained"
      },
      {
            "label": "Labo LLM — Nvidia Roadmap 2025-2028 (GTC 2025 timeline)",
            "url": "https://labo-llm.fr/en/infrastructure/nvidia-roadmap-vera-rubin/"
      }
]
  },
  {
    "id": 9503,
    "title": "The 2026 AI Infrastructure Investment Boom: What Reliability Means at Data Centre Scale",
    "slug": "2026-ai-infrastructure-investment-data-centre-reliability",
    "excerpt": "Hyperscalers are guiding 2026 capex toward $720B+. What the money buys, why utilisation and reliability — not headcount — decide the return, and how QA-style acceptance applies to infrastructure.",
    "articleType": "insight",
    "category": "Technology",
    "tags": ['"AI infrastructure"', '"data centres"', '"capex"', '"reliability"', '"hyperscalers"'],
    "projectSlug": "",
    "projectTitle": "",
    "primaryKeyword": "AI infrastructure investment 2026",
    "searchIntent": "informational — the scale of 2026 AI infrastructure spending and what it implies for reliability",
    "metaTitle": "2026 AI Infrastructure Boom & Data Centre Reliability",
    "metaDescription": "2026 capex is heading past $720B. What the spending buys, why reliability and utilisation decide the return, and how acceptance discipline applies at rack scale.",
    "heroImage": "",
    "heroAlt": "",
    "author": "ABDULREHMAN",
    "authorRole": "Founder & QA Lead",
    "publishedAt": "2026-11-03T09:00:00Z",
    "readingTime": 8,
    "featured": false,
    "body": [
      {
            "type": "p",
            "text": "The numbers from the summer 2026 earnings season should be read as a single statement: the four largest cloud providers are collectively guiding capital expenditure for 2026 to somewhere between $720 and $745 billion. Amazon raised its guidance to roughly $220 billion on its July 2026 call, citing in part higher memory costs. Alphabet guided to $195 to 205 billion. Microsoft is at approximately $175 billion for calendar 2026, and Meta at $135 to 145 billion. For context, the same group spent roughly $410 billion across 2025. The step change is not incremental; it is a restructuring of what those companies think their core product is."
      },
      {
            "type": "h2",
            "text": "What the money is actually buying"
      },
      {
            "type": "p",
            "text": "The capex is not buying servers in the old sense. It is buying the full stack: GPUs and the accelerator generations that supply them, the networking to move data between them, the data centres to house them, and increasingly the power infrastructure to run them. The power dimension is the part that most changes the constraint set. A rack built around a generation like Rubin, which is reported to approach 2,300 watts per GPU, changes what a data centre site can host. The bottleneck for 2026 expansion is increasingly grid connection and power delivery, not chip supply, which is why several of the large operators are investing directly in power generation and storage as a line item inside the infrastructure budget."
      },
      {
            "type": "p",
            "text": "The demand side is equally concrete. The purchase orders NVIDIA has described as running into the trillions over 2026 and 2027 are not speculative; they are commitments from the same companies writing this capex. The hyperscalers are not buying for themselves alone. A large share of the accelerator capacity coming online in 2026 will be sold back out as inference and training capacity to enterprises, which means the reliability of that capacity becomes a product feature for everyone downstream, not an internal concern for the operator."
      },
      {
            "type": "h2",
            "text": "Reliability as the return determinant"
      },
      {
            "type": "p",
            "text": "At this scale, the economics of the investment are decided by two variables that are usually invisible in the announcement: utilisation, and reliability. A data centre that is 80 percent utilised and 99.9 percent available is a very different asset from one that is 60 percent utilised and 99.0 percent available, even if the headline capacity is identical. The difference is not theoretical. At the numbers involved, a single point of availability, or a ten-point movement in utilisation, is worth tens of billions of dollars of revenue over the life of the asset. That is the quiet reason reliability engineering has become a first-order business discipline rather than an IT function."
      },
      {
            "type": "p",
            "text": "The reliability problem at this scale is also fundamentally different from the classic one. Classic infrastructure reliability is about redundancy: spare components, failover paths, and the discipline of testing that the failover actually works when you need it. AI-infrastructure reliability adds a new layer: the workload itself. A training run that has been in flight for three weeks across thousands of GPUs is a state that has to be preserved, checkpointed, and recoverable. A silent memory corruption that goes undetected for days does not take the system down; it quietly produces a model that is slightly wrong, and the cost of that failure is measured in a wasted training run, which at current scale is itself a multi-million-dollar event. The reliability question is no longer only whether the system is up; it is whether the output is correct."
      },
      {
            "type": "h2",
            "text": "QA discipline applied to infrastructure"
      },
      {
            "type": "p",
            "text": "The language of quality assurance maps onto this problem better than most people expect, because the core problems are the same. Acceptance: a rack or a cohort of racks is not live until it has been validated against a defined bar, on the workloads it will actually run. Observability: the fleet is instrumented in a way that can detect the slow failure modes, not just the hard ones, and the instrumentation itself is tested by injecting the failures it is meant to catch. Regression: when a new driver, firmware, or accelerator generation is introduced, the existing workloads are re-run to confirm the new component has not moved the behaviour of the old ones. Rollback: a bad component can be pulled from the fleet and replaced without losing the state of the work that was running on it."
      },
      {
            "type": "p",
            "text": "The organisations that treat infrastructure as a product, with acceptance criteria, a regression suite, and a rollback plan, are the ones that will extract the full value of the 2026 investment. The ones that treat it as a purchase, with a delivery date and a serial number, will discover the difference in the fourth quarter of 2027, when the first generation of 2026 capacity has had time to show what it actually does over months, not weeks. The capital is real. The return on it is not guaranteed by the size of the check; it is earned by the discipline applied after the check clears."
      },
      {
            "type": "links",
            "title": "Related reading",
            "items": [
                  {
                        "text": "NVIDIA's 2026 announcements and the validation gap they create",
                        "href": "/blogs/nvidia-ai-vision-2026-announcements"
                  },
                  {
                        "text": "How accelerator generations are validated for performance and reliability",
                        "href": "/blogs/blackwell-rubin-gpu-performance-reliability-testing"
                  },
                  {
                        "text": "Why quality assurance gets neglected in high-velocity releases",
                        "href": "/blogs/why-quality-assurance-is-neglected"
                  }
            ]
      }
],
    "faq": [
      {
            "question": "How much are the major cloud providers spending on AI infrastructure in 2026?",
            "answer": "The four largest providers are collectively guiding 2026 capital expenditure to roughly $720 to $745 billion, up from about $410 billion in 2025. Amazon is at approximately $220 billion, Alphabet $195 to $205 billion, Microsoft about $175 billion for calendar 2026, and Meta $135 to $145 billion."
      },
      {
            "question": "Why is power a bigger constraint than chips?",
            "answer": "Newer accelerator generations draw significantly more power per GPU, and the limiting factor for new data-centre expansion is increasingly grid connection and power delivery rather than chip supply. Several operators are now investing in power generation and storage as a distinct line inside the infrastructure budget."
      },
      {
            "question": "How does QA apply to data-centre infrastructure?",
            "answer": "Through acceptance criteria for new racks, a regression suite that re-runs real workloads on every component change, observability that detects slow failure modes and is itself tested by failure injection, and a rollback path that lets a bad component be replaced without losing the state of in-flight work."
      }
],
    "sources": [
      {
            "label": "NVIDIA — Meta Builds AI Infrastructure With NVIDIA (17 Feb 2026)",
            "url": "https://investor.nvidia.com/news/press-release-details/2026/Meta-Builds-AI-Infrastructure-With-NVIDIA/default.aspx"
      },
      {
            "label": "Introl — NVIDIA Rubin Enters Full Production (CES 2026)",
            "url": "https://introl.com/blog/nvidia-rubin-full-production-ces-2026-ai-infrastructure"
      }
]
  },
  {
    "id": 9504,
    "title": "Microsoft's New Outlook for Windows: What the Transition Means for Businesses and Users",
    "slug": "new-outlook-windows-transition-business-guide",
    "excerpt": "Opt-in, opt-out, cutover: the three stages of the New Outlook for Windows migration, what each means for IT and end users, the 'supported until at least 2029' commitment, and what to do now.",
    "articleType": "insight",
    "category": "Technology",
    "tags": ['"Outlook"', '"Microsoft 365"', '"migration"', '"New Outlook"', '"email"', '"enterprise IT"'],
    "projectSlug": "",
    "projectTitle": "",
    "primaryKeyword": "New Outlook for Windows transition",
    "searchIntent": "informational — how and when New Outlook for Windows rolls out, and what it means",
    "metaTitle": "New Outlook for Windows: What the Transition Means",
    "metaDescription": "Opt-in, opt-out, cutover: the stages of the New Outlook for Windows migration, what each means for IT and users, and the at-least-2029 support floor.",
    "heroImage": "",
    "heroAlt": "",
    "author": "ABDULREHMAN",
    "authorRole": "Founder & QA Lead",
    "publishedAt": "2026-11-04T09:00:00Z",
    "readingTime": 9,
    "featured": false,
    "body": [
      {
            "type": "p",
            "text": "Microsoft has been migrating the world's most-used email client for two years without most of the world noticing. New Outlook for Windows went generally available on 1 August 2024, and for most of 2025 it arrived silently, as a default on new installations. The stage is set for the part that will be harder to ignore: the managed transition, in which Microsoft flips the default for existing subscriptions and, eventually, removes the option to switch back. Understanding what is actually coming, in what order, and with what commitments, is the difference between being ready for the change and discovering it in a user-help ticket."
      },
      {
            "type": "h2",
            "text": "The three stages, in Microsoft's own terms"
      },
      {
            "type": "p",
            "text": "Microsoft documents the transition in three stages, and the distinction between them matters. Stage one, opt-in, is the current state for most managed organisations: New Outlook is available through a try-it toggle, it is off by default, users who try it can run both clients side by side, and they can switch back at any time. Nothing about this stage is forced, and nothing about it should be surprising; it is the period in which the new client earns the trust of the users who volunteer for it. The real work of the transition happens in stages two and three."
      },
      {
            "type": "p",
            "text": "Stage two is opt-out. In this stage, New Outlook becomes on by default for managed Enterprise plans, but users can still switch back to the classic client. Microsoft has committed to at least 12 months of notice before this stage is implemented, delivered through the organisation's existing change channels. The switch-back remains available throughout stage two, which is the window where a well-prepared IT team can watch the adoption, collect the failure reports, and decide which users genuinely need an exception. Stage three is cutover: the switch-back option is removed, the classic client is no longer offered in new Microsoft 365 subscription deployments, and again Microsoft has committed to at least 12 months of notice before Production rings are affected. At cutover, there is no reverting; the organisation is on the new client, full stop."
      },
      {
            "type": "h2",
            "text": "The support commitment that is easy to miss"
      },
      {
            "type": "p",
            "text": "The most under-read sentence in Microsoft's documentation is this: existing classic Outlook installations, on both perpetual and subscription licences, are supported until at least 2029. No end-of-life date has been announced. That sentence does three things. It means the classic client will not be abruptly unsupported in 2026 or 2027. It means the pressure from stage two is real but bounded by the notice commitments. And it means that the true deadline for a complete migration is not a Microsoft date but an organisational one: the point at which the organisation has absorbed the transition on its own schedule, before the cutover removes the option to be deliberate about it."
      },
      {
            "type": "p",
            "text": "One scope clarification that avoids a common error: the staged transition described here applies to desktop Outlook for Windows only. Outlook on Mac, mobile, and web are already on the new experience or their own cadences, and the Windows desktop is where the managed change is happening. An organisation that thinks the Windows transition means Mac users will be affected, or that the desktop transition means the web client is changing, has misread the scope, and its plan will be wrong in both directions."
      },
      {
            "type": "h2",
            "text": "What this means for a business, by role"
      },
      {
            "type": "p",
            "text": "For the end user, the practical change is a new interface built on the web client: a single inbox for mail, calendar, and people; a different search model; and a client that, for the first time, behaves identically on desktop and web. The things that change in daily use are the small ones: the reading pane, the ribbon, the way rules and signatures are managed, the way add-ins load. Most of those are recoverable with a day of familiarity. The things that do not recover easily are the deep integrations: add-ins that rely on the classic client's object model, Power Automate flows that assume a particular client behaviour, and the muscle memory of a decade of keyboard shortcuts."
      },
      {
            "type": "p",
            "text": "For the IT team, the work is not the toggle; it is the surface area that the toggle exposes. The classic client is a COM-rich, heavily extensible, local application. The new client is a web technology running in a desktop shell. Everything that attached to the first will need to be re-examined against the second. That includes the add-ins and plugins the organisation has bought, the integration points that assume the classic client's API surface, the security and compliance controls that were configured against the classic behaviour, and the automation that reads from and writes to the mailbox on the assumption of a stable, well-known client. None of that is a blocker, but all of it is a workstream, and the workstream has a lead time."
      },
      {
            "type": "h2",
            "text": "What to do while you are still in stage one"
      },
      {
            "type": "p",
            "text": "The opt-in stage is the cheap window, and the organisations that treat it that way come out ahead. Enrol a pilot cohort that reflects the actual user population, including the heavy users, the users with the most add-ins, and the users who will complain first. Give the cohort real work, not a sandbox, so that the failures that surface are the failures that will surface in production. Catalogue every integration that depends on the classic client, and test each one against the new client in the pilot. Write down the exceptions you will need at stage two, and decide the policy for them in advance, because deciding at stage two, under the pressure of a 12-month clock, is a different and worse kind of decision."
      },
      {
            "type": "p",
            "text": "The transition is not a risk to be feared; it is a deadline to be planned against. Microsoft has made the commitments that make it manageable: notice before each forced stage, a switch-back window during opt-out, and a support floor for the classic client that runs to at least 2029. The organisations that will struggle in 2027 are not the ones that were caught by the change; they are the ones that used the opt-in stage to admire the new client instead of testing it. The toggle is free to try. The discovery of which of your integrations do not survive it is only free once."
      },
      {
            "type": "links",
            "title": "Related reading",
            "items": [
                  {
                        "text": "Classic vs New Outlook: the compatibility and regression testing that matters",
                        "href": "/blogs/classic-vs-new-outlook-compatibility-regression-testing"
                  },
                  {
                        "text": "The Microsoft Outlook migration checklist, end to end",
                        "href": "/blogs/microsoft-outlook-migration-checklist"
                  },
                  {
                        "text": "Microsoft 365 Copilot in Outlook: can you trust it without testing?",
                        "href": "/blogs/microsoft-365-copilot-outlook-trust-testing"
                  }
            ]
      }
],
    "faq": [
      {
            "question": "When will New Outlook for Windows be forced on existing users?",
            "answer": "In two forced stages. First, opt-out, where it becomes on by default for managed Enterprise plans with at least 12 months of notice and a switch-back still available. Then cutover, where the switch-back is removed and new deployments ship New Outlook only, again with at least 12 months of notice before Production rings."
      },
      {
            "question": "Will classic Outlook stop working?",
            "answer": "Microsoft has committed to supporting existing classic Outlook installations, perpetual and subscription, until at least 2029. No end-of-life date has been announced. The practical deadline is organisational: migrate before cutover removes the option to be deliberate about it."
      },
      {
            "question": "Does the transition affect Mac, mobile, or web?",
            "answer": "No. The staged managed transition applies to desktop Outlook for Windows only. Mac, mobile, and web are on their own cadences, and the web client is effectively what the new desktop client is built from."
      }
],
    "sources": [
      {
            "label": "Microsoft Learn — Guide product availability (Stages of migration to New Outlook for Windows)",
            "url": "https://learn.microsoft.com/en-us/microsoft-365-apps/outlook/get-started/guide-product-availability"
      },
      {
            "label": "Microsoft — New Outlook for Windows general availability (1 Aug 2024)",
            "url": "https://learn.microsoft.com/en-us/microsoft-365-apps/outlook/get-started/new-outlook-what-changed"
      }
]
  },
  {
    "id": 9505,
    "title": "Classic Outlook vs New Outlook: Key Differences and the Compatibility & Regression Testing That Matters",
    "slug": "classic-vs-new-outlook-compatibility-regression-testing",
    "excerpt": "The real differences between classic and New Outlook — and the compatibility and regression testing workstreams that decide whether the switch is smooth or a quarterly project.",
    "articleType": "insight",
    "category": "Technology",
    "tags": ['"Outlook"', '"compatibility testing"', '"regression testing"', '"migration"', '"enterprise email"'],
    "projectSlug": "",
    "projectTitle": "",
    "primaryKeyword": "classic vs new Outlook differences",
    "searchIntent": "informational/procedural — what differs, and what testing is required before switching",
    "metaTitle": "Classic vs New Outlook: Differences & Regression Testing",
    "metaDescription": "COM object model vs web shell: the real differences between classic and New Outlook, and the compatibility and regression testing that decides a clean switch.",
    "heroImage": "",
    "heroAlt": "",
    "author": "ABDULREHMAN",
    "authorRole": "Founder & QA Lead",
    "publishedAt": "2026-11-05T09:00:00Z",
    "readingTime": 8,
    "featured": false,
    "body": [
      {
            "type": "p",
            "text": "The difference between classic Outlook and New Outlook is usually described as a cosmetic one, a modernised interface on the same mailbox. That framing is wrong in the way that matters. The classic client is a local, COM-rich desktop application built around a decades-old object model that a large ecosystem of add-ins and integrations was written against. The new client is a web technology running in a desktop shell, built from the same codebase as the web app. Same mailbox, same Exchange or Microsoft 365 backend, but a different application underneath. Every compatibility question in the transition follows from that one fact."
      },
      {
            "type": "h2",
            "text": "The differences that are visible, and the ones that are not"
      },
      {
            "type": "p",
            "text": "The visible differences are the ones users notice on day one: a unified inbox for mail, calendar and people; a different ribbon; web-based search; and an add-in model that loads web extensions rather than native code. Those are recoverable with familiarity, and they are the part of the change that generates the complaints in the first week. The invisible differences are the ones that generate the complaints in the first quarter. They live in the layer between the client and the organisation's other systems."
      },
      {
            "type": "list",
            "items": [
                  "The object model. The classic client exposes a rich, local COM object model that a generation of line-of-business tools, reporting scripts, and add-ins were written against. The new client does not expose that model in the same way; the integration surface is different, and many of the old integrations have no equivalent.",
                  "The add-in model. The classic client runs native add-ins; the new client runs web-based extensions. An add-in that depends on the classic client's API surface is not merely different in the new client; for many, it is unavailable, and the organisation must find the modern equivalent or lose the capability.",
                  "Local file handling. The classic client reads and writes local files, attachments, and PST archives directly. The new client, being web-based, handles local data through a different and more constrained path, which matters for the workflows that assume direct local access.",
                  "Configuration surface. Rules, signatures, and profiles are managed differently. A configuration that took one group policy in the classic client may require a different mechanism, or may simply not exist, in the new client.",
                  "Keyboard and interaction model. Decades of muscle memory, shortcuts, and the reading-pane behaviour change. This is the difference that does not break anything and still drives adoption friction for months."
            ]
      },
      {
            "type": "h2",
            "text": "The compatibility workstream: what must still work"
      },
      {
            "type": "p",
            "text": "Compatibility testing is the workstream that answers a single question: of everything the organisation does through or around the classic client, what still works in the new one, and what has been quietly lost? The honest method is an inventory, not an assumption. Catalogue every add-in, every integration point, every automation that touches the mailbox or the client, and every workflow that depends on local file behaviour. Then test each one against the new client in a pilot that reflects real user configuration, not a clean test account. The output is not a pass-fail report; it is a list of exceptions, each with a disposition: the integration works, it needs a modern equivalent, or the capability must be retired."
      },
      {
            "type": "p",
            "text": "The discipline that makes this workstream credible is testing on the new client, not on a prediction of it. A vendor's compatibility matrix is a useful starting point and an incomplete one; the organisation's specific set of add-ins, often a mix of purchased, bespoke, and home-grown tools, is what actually has to be verified. The failure mode to guard against is the silent deprecation: the integration that still installs, still appears in the list of add-ins, and quietly does nothing, or does less than it used to, in the new client. That failure is the expensive one, because it is the one that does not announce itself."
      },
      {
            "type": "h2",
            "text": "The regression workstream: what must not change"
      },
      {
            "type": "p",
            "text": "Compatibility asks what still works; regression asks what must not change in behaviour for the things that do work. The distinction matters because the new client is not a frozen target; it is a continuously updated web client, and the behaviour of a workflow that works today can move under the organisation between now and the cutover. A regression suite for the transition means identifying the behaviours that the organisation depends on, the search that returns the right results, the rule that fires in the right order, the signature that renders correctly, the calendar invite that carries the right data, and writing them as repeatable checks that can be re-run on every client update."
      },
      {
            "type": "p",
            "text": "The regression suite has a second, often-missed job: it is the evidence for the exceptions. When the organisation decides, at the opt-out stage, that a particular user group genuinely needs to stay on the classic client, that decision needs to be defensible, and it needs to be reviewable. The defensible version of the decision is backed by a documented, repeatable test that shows which capability is broken, for which users, and why the equivalent is not available. The version that is just a user complaint will not survive the review that a cutover decision eventually faces."
      },
      {
            "type": "h2",
            "text": "Why this is a project, not a toggle"
      },
      {
            "type": "p",
            "text": "The two workstreams together are a project with a lead time, and the lead time is the reason the opt-in stage exists. The organisations that treat the transition as a toggle will discover the exceptions at the opt-out stage, when the switch-back is still available but the 12-month clock is running, and they will make the exception decisions under pressure. The organisations that treat it as a project will have finished the inventory, the compatibility tests, and the regression suite during the opt-in stage, and they will arrive at opt-out with a decision to make, not a fire to fight. The client change is not the hard part. The surface area around it is."
      },
      {
            "type": "links",
            "title": "Related reading",
            "items": [
                  {
                        "text": "New Outlook for Windows: what the transition means for businesses and users",
                        "href": "/blogs/new-outlook-windows-transition-business-guide"
                  },
                  {
                        "text": "The Microsoft Outlook migration checklist, end to end",
                        "href": "/blogs/microsoft-outlook-migration-checklist"
                  },
                  {
                        "text": "Why quality assurance gets neglected in high-velocity releases",
                        "href": "/blogs/why-quality-assurance-is-neglected"
                  }
            ]
      }
],
    "faq": [
      {
            "question": "What is the fundamental difference between the two clients?",
            "answer": "The classic Outlook for Windows is a local, COM-rich desktop application with a decades-old object model. New Outlook is a web technology in a desktop shell, built from the web codebase. Same mailbox and backend, but a different application underneath, which is where most compatibility risk lives."
      },
      {
            "question": "Do existing add-ins work in New Outlook?",
            "answer": "It depends on the add-in. The new client runs web-based extensions rather than the classic client's native model. Many add-ins have modern equivalents; some, particularly those written against the classic client's object model, are unavailable and must be replaced or the capability retired."
      },
      {
            "question": "What should the regression suite cover?",
            "answer": "The behaviours the organisation depends on: search results, rule firing order, signature rendering, calendar invite data, and the specific workflows in use. It should be repeatable, re-run on every client update, and serve as the documented evidence behind any decision to keep a user group on the classic client."
      }
],
    "sources": [
      {
            "label": "Microsoft Learn — Guide product availability (migration stages and client scope)",
            "url": "https://learn.microsoft.com/en-us/microsoft-365-apps/outlook/get-started/guide-product-availability"
      },
      {
            "label": "Microsoft — New Outlook for Windows: what changed",
            "url": "https://learn.microsoft.com/en-us/microsoft-365-apps/outlook/get-started/new-outlook-what-changed"
      }
]
  },
  {
    "id": 9506,
    "title": "Microsoft 365 Copilot in Outlook: Can You Trust It Without Proper Testing?",
    "slug": "microsoft-365-copilot-outlook-trust-testing",
    "excerpt": "What Copilot in Outlook can actually do in 2026, which of those capabilities are generally available versus preview, and the testing discipline that separates trust from hope when an AI takes actions in your mailbox.",
    "articleType": "insight",
    "category": "Technology",
    "tags": ['"Microsoft 365 Copilot"', '"Outlook"', '"AI testing"', '"email automation"', '"governance"'],
    "projectSlug": "",
    "projectTitle": "",
    "primaryKeyword": "Microsoft 365 Copilot in Outlook",
    "searchIntent": "informational — what Copilot in Outlook does, and whether/when it can be trusted in production",
    "metaTitle": "M365 Copilot in Outlook: Can You Trust It Without Testing?",
    "metaDescription": "GA vs preview in Copilot in Outlook, what the agentic capabilities actually do, and the testing discipline that turns hope in an AI inbox into trust.",
    "heroImage": "",
    "heroAlt": "",
    "author": "ABDULREHMAN",
    "authorRole": "Founder & QA Lead",
    "publishedAt": "2026-11-06T09:00:00Z",
    "readingTime": 9,
    "featured": false,
    "body": [
      {
            "type": "p",
            "text": "The question is not whether Copilot in Outlook is smart. It is whether you have evidence. The capability set has grown fast: summarising long threads, drafting replies, and prioritising the inbox have been available for a while, and the more consequential capabilities arrived on a schedule. In March 2026, Copilot in the new Outlook began writing a first draft directly in the compose canvas, iterating with the user and asking clarifying questions about goal, audience and tone, with every change visible in place. In May 2026, draft coaching feedback, conversational in-place drafting, editing and formatting, and an account selector in the Copilot side pane rolled out, and voice-based inbox triage arrived on mobile. Then came the agentic wave: inbox triage actions such as flagging, archiving, deleting, pinning and applying rules, and calendar capabilities including RSVP preferences, rescheduling, room rebooking and focus time, rolling out in spring 2026 to eligible Microsoft 365 Copilot users in the Frontier program, which is early access, not a general rollout. Each of those is a different trust problem, and they should not be grouped into a single answer."
      },
      {
            "type": "h2",
            "text": "The first distinction: reading, drafting, acting"
      },
      {
            "type": "p",
            "text": "Copilot in Outlook does three categories of work, and the trust they require is not the same. The first is reading and summarising: the model reads your mail and produces a summary, a priority order, or a proposed reply. The failure mode here is a wrong summary, and the cost of that failure is bounded, because a human is still the one who sends the mail. The second is drafting and editing: the model writes the message, iterates on it, and coaches on tone and length. The failure mode is a message that is plausible but wrong in detail, and the cost is still bounded, because a human reviews before sending. The third is acting: the model performs an operation on the mailbox or the calendar, archiving, deleting, rescheduling, rebooking a room. The failure mode is a wrong action, and the cost is no longer bounded by a human review step, because the action has already happened by the time anyone sees it. The first two categories are a trust question about accuracy. The third is a trust question about authority, and it needs a different discipline."
      },
      {
            "type": "h2",
            "text": "The GA and preview distinction that most rollouts get wrong"
      },
      {
            "type": "p",
            "text": "The single most common error in evaluating Copilot in Outlook is treating the whole capability set as one product with one status. It is not. Summarise, draft, and prioritise are generally available to licensed users. The in-canvas drafting and conversational editing rolled out to the new Outlook on a defined schedule, with the in-canvas capability live in the new Outlook since March 2026. The agentic inbox and calendar capabilities are the Frontier early-access cohort, not a general rollout, and Microsoft's own release notes state that Copilot features are introduced using a safe deployment model, gradually rolling out to a subset of users within a tenant before expanding. That sentence is the whole story in miniature: the capability you are testing in a pilot tenant is not necessarily the capability that will exist at general availability, and it is not necessarily the capability that will reach every user in the same order. An evaluation that does not pin down which ring the test user is in, and which capabilities are GA versus preview, is measuring a moving target and reporting the result as if it were stable."
      },
      {
            "type": "h2",
            "text": "What testing an AI agent in your mailbox actually looks like"
      },
      {
            "type": "p",
            "text": "The testing discipline for the acting category is the one that most organisations have not built, because it is not a testing problem they have solved before. A classic test verifies that a function produces the right output for a known input. An agentic test has to verify three things at once: that the model interpreted the intent correctly, that the action it chose was the correct action for that intent, and that the action it performed is reversible or acceptable if it was wrong. The third clause is the one that is usually missing, and it is the one that should drive the design. If an action cannot be undone, the test standard for that action has to be higher than for an action that can. An archived mail is recoverable from the recoverable items folder for a period; a deleted mail is not, not reliably; a rebooked meeting room has a different failure class entirely, because the cost of the wrong action is a meeting that happened in the wrong place."
      },
      {
            "type": "p",
            "text": "The practical method is to build the test from the organisation's actual mail patterns, not from a demo inbox. The failure cases that matter are the ones with the ambiguity that a human would resolve with context: the mail that looks like a vendor invoice but is actually a phishing lure, the meeting request that conflicts with a hard deadline that is only in the calendar, the priority that the model gets wrong because the sender is unfamiliar. The test set should include a deliberate proportion of those ambiguous cases, because they are the cases the production system will hit, and they are the cases where a plausible-looking wrong answer is the realistic failure. The pass criterion is not that the agent is usually right; it is that the organisation has measured, on its own mail, how often it is wrong in the specific ways that cost something, and that the rate is below the threshold the organisation can live with."
      },
      {
            "type": "h2",
            "text": "The governance layer the capability implies"
      },
      {
            "type": "p",
            "text": "Trust in an acting agent is not a property of the model; it is a property of the controls around it, and those controls are mostly organisational, not technical. The model does not know what the organisation can afford to lose. The organisation does, and it has to encode that decision into the test standard, the scope of the pilot, and the escalation path. What that looks like in practice: a defined set of actions the agent is permitted to perform without review, a defined set that require it, and a defined set it is never allowed to perform. A documented standard for the ambiguous cases. A monitoring path that catches a wrong action after it happens, because the honest assumption is that it will, eventually, at a rate you measured and accepted. And a rollback or undo path for the reversible actions, exercised in the pilot, not just designed for. None of that is a feature of Copilot in Outlook. All of it is a requirement the capability places on the organisation, and the organisations that treat it that way are the ones that will get the productivity the capability promises, at a risk they actually understand."
      },
      {
            "type": "p",
            "text": "The answer to the question in the title is therefore specific, and it is not yes or no. You can trust the reading and drafting capabilities in a way that is reasonable, because a human remains in the loop before the consequence occurs. You cannot trust the acting capabilities on the strength of the demonstration, because the demonstration is the easy case, and the production mailbox is the hard one. What you can do is measure the acting capabilities on your own mail, to a standard you set, in a pilot that reflects your rings and your users, and then decide, with a number attached, how much authority to hand over. That is not a rejection of the technology. It is the only version of trust that survives contact with a real inbox."
      },
      {
            "type": "links",
            "title": "Related reading",
            "items": [
                  {
                        "text": "New Outlook for Windows: what the transition means for businesses and users",
                        "href": "/blogs/new-outlook-windows-transition-business-guide"
                  },
                  {
                        "text": "Classic vs New Outlook: the compatibility and regression testing that matters",
                        "href": "/blogs/classic-vs-new-outlook-compatibility-regression-testing"
                  },
                  {
                        "text": "AI moving faster than the testing around it: the QA gate",
                        "href": "/blogs/ai-adoption-velocity-qa-gate"
                  }
            ]
      }
],
    "faq": [
      {
            "question": "Which Copilot in Outlook capabilities are generally available?",
            "answer": "Summarising threads, drafting replies, and inbox prioritisation are generally available to licensed users. The in-canvas first-draft capability has been rolling out to the new Outlook since March 2026, and the agentic inbox and calendar actions are in the Frontier early-access program, not a general rollout. Check your tenant's ring and the release notes for the status of each specific capability."
      },
      {
            "question": "What is the risk of the agentic inbox and calendar capabilities?",
            "answer": "The risk is a wrong action taken without a human review step, such as archiving the wrong mail, deleting something that should have been kept, or rebooking a room for the wrong meeting. The discipline that controls the risk is a defined set of permitted actions, a measured error rate on the organisation's own mail, monitoring that catches a wrong action after it happens, and an exercised undo path for the reversible ones."
      },
      {
            "question": "How do you test a Copilot agent on a real inbox?",
            "answer": "Build the test from the organisation's actual mail patterns, with a deliberate share of ambiguous cases, and measure the error rate for each action class against a threshold the organisation has set. Pin down which deployment ring the test users are in, and re-run the suite as capabilities move from preview to general availability, because the behaviour of the two is not guaranteed to be the same."
      }
],
    "sources": [
      {
            "label": "Microsoft Tech Community — What's New in Microsoft 365 Copilot (April 2026)",
            "url": "https://techcommunity.microsoft.com/blog/microsoft-copilot-blog/what%E2%80%99s-new-in-microsoft-365-copilot--april-2026/4510935"
      },
      {
            "label": "Microsoft Learn — Microsoft 365 Copilot release notes",
            "url": "https://learn.microsoft.com/en-us/microsoft-365/copilot/release-notes"
      },
      {
            "label": "Microsoft Learn — Copilot in Outlook (feature documentation)",
            "url": "https://learn.microsoft.com/en-us/microsoft-365/copilot/outlook/overview"
      }
]
  },
  {
    "id": 9507,
    "title": "Enterprise Email Security in 2026: Lessons From CISA Advisory AA25-239A and the Case for Continuous QA",
    "slug": "enterprise-email-security-2026-cisa-aa25-239a-continuous-qa",
    "excerpt": "What CISA advisory AA25-239A actually says about China-linked telecom network compromise, why email sits in the kill chain, and how continuous verification — not one-time hardening — keeps enterprise email defensible.",
    "articleType": "insight",
    "category": "Technology",
    "tags": ['"email security"', '"CISA"', '"threat intelligence"', '"QA"', '"enterprise security"', '"authentication"'],
    "projectSlug": "",
    "projectTitle": "",
    "primaryKeyword": "enterprise email security 2026",
    "searchIntent": "informational — current enterprise email security threats and how to stay defensible",
    "metaTitle": "Enterprise Email Security 2026: CISA AA25-239A & QA",
    "metaDescription": "What CISA AA25-239A really says about China-linked network compromise, why email sits in the kill chain, and why continuous verification beats one-time hardening.",
    "heroImage": "",
    "heroAlt": "",
    "author": "ABDULREHMAN",
    "authorRole": "Founder & QA Lead",
    "publishedAt": "2026-11-07T09:00:00Z",
    "readingTime": 9,
    "featured": false,
    "body": [
      {
            "type": "p",
            "text": "On 3 September 2025, CISA and its Five Eyes and international partners published joint advisory AA25-239A, Countering Chinese State-Sponsored Actors Compromise of Networks Worldwide to Feed Global Espionage System, and it is the document most security teams should have read and fewer than expected have. The advisory concerns PRC state-sponsored actors targeting the telecommunications backbone, specifically peering and carrier-grade edge routers, across the United States, Australia, Canada, New Zealand, the United Kingdom and other countries, with activity observed since at least 2021. The industry names that overlap with the behaviour described include Salt Typhoon, OPERATOR PANDA, RedMike, UNC5807 and GhostEmperor, though the advisory deliberately refers to them only as APT actors. The reason it matters for an enterprise email discussion is not that it is about email. It is that it is about the infrastructure that email runs on, and about the difference between a system that was hardened once and a system that is verified continuously."
      },
      {
            "type": "h2",
            "text": "What the advisory says, precisely"
      },
      {
            "type": "p",
            "text": "The core finding is persistence through the network fabric. The actors are described as modifying router configurations to establish persistent access, then pivoting through compromised devices and trusted connections to extend their reach. The advisory identifies three China-linked companies whose products have been observed in the affected networks, and it lists the targeted sectors, which include government, transportation, lodging and military networks. The co-authoring list is 23 agencies across multiple countries, which is a statement about the scale of the assessment. What the advisory is not, and what is worth being careful about, is a statement about any specific organisation's compromise. It is a general advisory about a pattern of behaviour. The correct reading is defensive: if the pattern exists at the backbone level, the assumptions your own email and identity stack makes about the integrity of the network below it are worth re-examining. The incorrect reading, and the one that produces both panic and false comfort, is to infer either that a specific organisation is compromised, or that the advisory implies nothing about your environment."
      },
      {
            "type": "h2",
            "text": "Why email sits inside the kill chain"
      },
      {
            "type": "p",
            "text": "Email is the layer where a network-level capability becomes an organisational one, because it is the interface through which a persistent foothold converts into a business action. An actor who has modified a router does not need to break your email system to abuse it; they need to abuse the trust relationships that email sits on. The relevant vectors are the ones the advisory's pattern enables: a compromised upstream that can observe or alter traffic in transit, a trusted connection that can be used to reach internal systems, and the identity layer that email authenticates against. That is why the enterprise email security conversation in 2026 cannot be limited to the mail gateway. The gateway filters the messages; it does not verify the integrity of the network the messages travel on, or the honesty of the identity provider that issued the session. Those are separate assumptions, and each one needs its own verification."
      },
      {
            "type": "p",
            "text": "The second reason email is in the kill chain is simpler and more frequent: it is still the primary initial-access channel for the vast majority of enterprise intrusions, and the tools of the trade, the spoofed sender, the look-alike domain, the business email compromise that impersonates an executive or a vendor, have not gone away. The defence against that layer is mature and well understood, and it is also the layer where the failure is most often a configuration that was correct once and has drifted. SPF, DKIM and DMARC are not set-and-forget; they are invariants that need to be checked, because the domain's DNS, the sending infrastructure and the alignment requirements all change under the organisation's feet over the course of a year."
      },
      {
            "type": "h2",
            "text": "Continuous verification is the QA discipline the threat model demands"
      },
      {
            "type": "p",
            "text": "The discipline that matches this threat model is not hardening, which is a one-time act, but verification, which is a continuous one. The distinction is the entire argument. Hardening produces a state: the mail gateway is configured, the authentication is enforced, the policies are written. Verification produces evidence that the state still holds: the SPF record still covers the current senders, the DMARC policy is still at the enforcement level the organisation intends, the TLS behaviour at the gateway is still what it was designed to be, the authentication flow for a privileged user still fails closed when it should. None of those are true forever. They are true until something changes, and the something is usually a legitimate change, a new sending provider, a new regional office, a new identity provider, that quietly moved the invariant without a corresponding update to the control that was meant to protect it."
      },
      {
            "type": "p",
            "text": "The method is the same one that software quality has settled on, and it transfers directly. Define the invariants that the email and identity stack is supposed to hold. Build repeatable checks that test each invariant, in a way that can be run without disturbing production. Run them on a schedule, not on a calendar event. Track the results over time, so that a change is visible the moment it happens, not at the next annual review. And, critically, test the failure path deliberately: verify that a spoofed domain is actually rejected, that a misaligned DMARC record actually produces the enforcement the organisation expects, and that the authentication flow actually fails closed when a credential is presented to the wrong origin. A control that has never been observed failing has not been tested, and a control that has not been tested is a control that is only assumed."
      },
      {
            "type": "h2",
            "text": "What this means for the Outlook transition and beyond"
      },
      {
            "type": "p",
            "text": "The Outlook transition and the Copilot capabilities layered on top of it add new invariants to the set, and the discipline is the same. A new client changes the surface that the mail gateway sees, the way attachments are handled, and the way authentication is presented, each of which is an invariant that was written for the previous client and needs to be re-verified for the new one. An AI agent that acts in the mailbox introduces a new class of action that the previous controls were never designed to constrain, and the verification standard for it is the one described in the companion piece on Copilot in Outlook: a measured error rate on real mail, a defined set of permitted actions, and monitoring that catches a wrong action after it happens. The pattern is consistent across the whole stack: the threat model is moving faster than the one-time controls that were written against the old one, and the only relationship to a moving threat that produces defensible evidence is a continuous one. The advisory is the reminder that the movement is not only in the tools, but in the infrastructure underneath them, which makes the case for verifying the whole stack, continuously, a matter of basic hygiene rather than an ambition."
      },
      {
            "type": "links",
            "title": "Related reading",
            "items": [
                  {
                        "text": "Passkeys and the validation that proves phishing-resistant authentication works",
                        "href": "/blogs/passkeys-phishing-resistant-authentication-validation"
                  },
                  {
                        "text": "M365 Copilot in Outlook: the testing that turns hope into trust",
                        "href": "/blogs/microsoft-365-copilot-outlook-trust-testing"
                  },
                  {
                        "text": "Why quality assurance gets neglected in high-velocity releases",
                        "href": "/blogs/why-quality-assurance-is-neglected"
                  }
            ]
      }
],
    "faq": [
      {
            "question": "What does CISA advisory AA25-239A say?",
            "answer": "It is a joint advisory, published 3 September 2025 and co-authored by 23 agencies, describing PRC state-sponsored actors compromising telecommunications backbone routers across multiple countries, with activity observed since at least 2021, to establish persistent access. The industry names that overlap include Salt Typhoon and others, though the advisory refers only to APT actors. It is a general advisory, not a statement about any specific organisation."
      },
      {
            "question": "Does the advisory mean my organisation is compromised?",
            "answer": "No. The advisory describes a pattern of behaviour at the network level. It does not attribute a compromise to any specific organisation, and it should be read as a prompt to re-examine the assumptions your email and identity stack makes about the integrity of the underlying network, not as a finding against your environment."
      },
      {
            "question": "How does continuous verification differ from hardening?",
            "answer": "Hardening produces a one-time state. Verification produces ongoing evidence that the state still holds: the invariants of the email and identity stack are defined, checked on a schedule, tracked over time, and their failure paths are tested deliberately. The difference matters because the threat, and the legitimate changes in your own environment, are both moving, and only a continuous check can keep the evidence current."
      }
],
    "sources": [
      {
            "label": "CISA — AA25-239A, Countering Chinese State-Sponsored Actors Compromise of Networks Worldwide (last revised 3 Sep 2025)",
            "url": "https://www.cisa.gov/news-events/alerts/aa25-239a"
      },
      {
            "label": "Microsoft Learn — Configure SPF, DKIM and DMARC for Office 365",
            "url": "https://learn.microsoft.com/en-us/microsoft-365/admin/purview/spf-dkim-dmarc"
      },
      {
            "label": "CISA — Phishing-Resistant MFA guidance",
            "url": "https://www.cisa.gov/stopreconsecuring/zero-trust/phishing-resistant-mfa"
      }
]
  },
  {
    "id": 9508,
    "title": "Passkeys and Phishing-Resistant Authentication: How to Validate That FIDO2 Actually Works in Your Organisation",
    "slug": "passkeys-phishing-resistant-authentication-validation",
    "excerpt": "Why passkeys are phishing-resistant by design, where the real risk lives, and the validation work — origin binding, cross-platform behaviour, recovery, enforcement — that separates a FIDO2 rollout from a claim.",
    "articleType": "insight",
    "category": "Technology",
    "tags": ['"passkeys"', '"FIDO2"', '"WebAuthn"', '"authentication"', '"security testing"', '"MFA"'],
    "projectSlug": "",
    "projectTitle": "",
    "primaryKeyword": "passkey validation FIDO2",
    "searchIntent": "informational/procedural — how passkeys work and how to verify they actually provide phishing resistance",
    "metaTitle": "Passkeys & FIDO2: Validating Phishing-Resistant Auth",
    "metaDescription": "Why passkeys are phishing-resistant by design, where the real risk lives, and the validation — origin binding, coverage, recovery, enforcement — that proves it here.",
    "heroImage": "",
    "heroAlt": "",
    "author": "ABDULREHMAN",
    "authorRole": "Founder & QA Lead",
    "publishedAt": "2026-11-08T09:00:00Z",
    "readingTime": 9,
    "featured": false,
    "body": [
      {
            "type": "p",
            "text": "Passkeys are the most genuinely promising change to enterprise authentication in a decade, and they are also the most misunderstood, because the marketing language, the word phishing-resistant, does the work that the validation is supposed to do. NIST SP 800-63-4, finalised in July 2025, recognised synced passkeys as phishing-resistant and eligible for AAL2, and CISA's guidance classifies FIDO2 and WebAuthn as the phishing-resistant multi-factor tier, above SMS and TOTP, with hardware-bound credentials at the highest assurance for privileged access. Those are the right words in the right places, and they are exactly the kind of words that should not be the end of the argument. Phishing-resistant is a property of a mechanism under specific conditions, and the validation is the part that establishes whether the conditions hold in your organisation."
      },
      {
            "type": "h2",
            "text": "Why the mechanism is phishing-resistant, in the technical sense"
      },
      {
            "type": "p",
            "text": "The property comes from three things working together, and each one is a verifiable claim. First, origin binding: a WebAuthn credential is cryptographically bound to the relying party's origin, so a passkey created for a real domain cannot function against a look-alike domain, because the signature it produces is only valid for the origin it was registered to. This is the direct answer to the phishing attack, and it is the reason a passkey does not need to be something you type, which is the thing a phisher is trying to capture. Second, local storage: the private key lives in the device's secure hardware, the TPM or the secure enclave, and never leaves it; only the public key is stored server-side. There is no secret to steal in transit, because there is no secret to transmit. Third, local verification: each sign-in requires the user's biometric or PIN to authorise the signing operation on the device, so a captured public key, or a stolen session token that does not include the signing step, cannot complete a login. The replay and relay attacks that defeat the older factors are blocked by the origin-bound signature, because a replayed signature from the wrong origin does not verify. Every one of those three properties is something you can test, and the testing is the substance of this article."
      },
      {
            "type": "h2",
            "text": "Where the real risk lives, once the mechanism is out of the way"
      },
      {
            "type": "p",
            "text": "The honest risk assessment, and the one that the validation has to cover, is not that the protocol fails. It is that the deployment does not hold the protocol's invariants. The first risk is the origin: a relying party that has changed domains, or that serves sign-in from multiple origins, breaks the origin-binding guarantee silently, because the credential is bound to the origin at registration time, and a new origin is a new relying party as far as the credential is concerned. The second risk is the platform: a passkey that works on one operating system and one browser, and fails, or degrades, on another, is a passkey with a coverage hole, and the coverage hole is where the user falls back to the weaker factor, or to a password, and the security the deployment was supposed to provide is gone. The third risk is recovery: a lost device, a dead phone, a user who leaves and a user who is locked out, and the recovery path is the place where organisations are most tempted to reintroduce a secret, a one-time code, a password, that is not phishing-resistant, because the convenience of the recovery path is not designed to be phishing-resistant by default. Each of these is a deployment invariant, and each one is testable."
      },
      {
            "type": "h2",
            "text": "The validation suite that proves the claim"
      },
      {
            "type": "p",
            "text": "The validation work has four parts, and they map to the four invariants. The first is origin binding, tested directly: register a credential against the real origin, then attempt to use it against a look-alike domain that the organisation controls for testing, and confirm that it does not work. Then test the negative case that matters, that the credential on the real origin still works after the look-alike attempt, and that the look-alike cannot enumerate or influence the credential in any way. This is the test that converts the marketing phrase into an observed behaviour, and it is cheap, and it is the single most important one. The second is cross-platform coverage: for each platform and browser the organisation supports, test registration, sign-in, the biometric or PIN path, and the sync behaviour if synced passkeys are in use, and confirm that the behaviour is the same, not merely similar. A platform where sign-in works but registration does not is a coverage hole, and the user on that platform is on a different, weaker system than the one the deployment was validated for."
      },
      {
            "type": "p",
            "text": "The third part is recovery, and it is the part that most rollouts under-test. Test the recovery path the way an attacker or a locked-out user would use it: from a dead device, from a new device, from a user who has left the organisation. Confirm that the recovery path does not silently downgrade to a non-phishing-resistant factor for a privileged user, and if it does, confirm that the organisation has made that trade-off deliberately, in writing, for the specific users it applies to. The fourth part is enforcement: a passkey deployment that is optional is not a passkey deployment, it is a passkey option, and the validation has to confirm that the enforcement is actually in place for the users it is supposed to cover, that a privileged user cannot complete a sign-in with the old factor, and that the enforcement is itself monitored, so that a configuration change that would open the hole is visible the moment it happens. None of these tests are exotic. All of them are things that a quality function is already good at, applied to a system that is usually left to the vendor's claim."
      },
      {
            "type": "h2",
            "text": "Why this is a QA problem, and why that matters"
      },
      {
            "type": "p",
            "text": "The reason the validation is framed as a quality problem is that the claim being validated is a behavioural one, not a configuration one. The protocol is specified; the question is whether the deployment, with its origins, its platforms, its recovery path and its enforcement, behaves the way the specification requires, for the users the organisation actually has. That is a testing question, and it is the same shape as every other behavioural claim the organisation has to make about a system it runs: does it do what it is supposed to do, under the conditions it will actually be used, and can you show the evidence? The organisations that treat the passkey rollout as a configuration task, and the vendor's compliance statement as the evidence, will find out the difference at the first locked-out user, or the first look-alike that the origin test would have caught in an afternoon. The ones that treat it as a validation problem, with a suite that is run and re-run, have the evidence on file, and they have the answer to the question that will eventually be asked, which is not whether passkeys are phishing-resistant in the abstract, but whether they are, here, for these users, on these platforms, with this recovery path. The first answer is in the marketing. The second is in the test results."
      },
      {
            "type": "links",
            "title": "Related reading",
            "items": [
                  {
                        "text": "Enterprise email security in 2026 and the case for continuous verification",
                        "href": "/blogs/enterprise-email-security-2026-cisa-aa25-239a-continuous-qa"
                  },
                  {
                        "text": "AI moving faster than the testing around it: the QA gate",
                        "href": "/blogs/ai-adoption-velocity-qa-gate"
                  },
                  {
                        "text": "The Microsoft Outlook migration checklist, end to end",
                        "href": "/blogs/microsoft-outlook-migration-checklist"
                  }
            ]
      }
],
    "faq": [
      {
            "question": "Are passkeys actually phishing-resistant?",
            "answer": "The mechanism is, by design, because the credential is cryptographically bound to the relying party's origin and the private key never leaves the device's secure hardware. Whether it is phishing-resistant in a specific deployment depends on the invariants holding: a single, stable origin, full cross-platform coverage, a recovery path that does not silently downgrade to a weaker factor, and real enforcement for the users it covers. Those are the things the validation establishes."
      },
      {
            "question": "What does NIST SP 800-63-4 say about passkeys?",
            "answer": "Finalised in July 2025, it recognises synced passkeys as phishing-resistant and eligible for AAL2, the second level of authenticator assurance. CISA's guidance places FIDO2 and WebAuthn in the phishing-resistant MFA tier, with hardware-bound credentials at the highest assurance for privileged access."
      },
      {
            "question": "What is the most common failure in a passkey rollout?",
            "answer": "The recovery path silently downgrading to a non-phishing-resistant factor, and enforcement that is optional rather than required for the users it was meant to cover. Both are deployment invariants, both are cheap to test, and both are the places where the gap between the claim and the reality shows up first."
      }
],
    "sources": [
      {
            "label": "NIST SP 800-63-4 — Digital Identity Guidelines (finalised July 2025)",
            "url": "https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63-4.pdf"
      },
      {
            "label": "CISA — Phishing-Resistant MFA guidance",
            "url": "https://www.cisa.gov/stopreconsecuring/zero-trust/phishing-resistant-mfa"
      },
      {
            "label": "FIDO Alliance — Passkeys overview",
            "url": "https://fidoalliance.org/fido2/"
      }
]
  },
  {
    "id": 9509,
    "title": "The Microsoft Outlook Migration Checklist: Mail, Calendar, Integrations and Workflows, End to End",
    "slug": "microsoft-outlook-migration-checklist",
    "excerpt": "A complete, stage-aware checklist for moving from classic Outlook to New Outlook for Windows: mail, calendar, rules, signatures, add-ins, integrations and workflows, in the order that protects the organisation from the silent failures.",
    "articleType": "guide",
    "category": "Technology",
    "tags": ['"Outlook"', '"migration"', '"checklist"', '"Microsoft 365"', '"enterprise IT"', '"QA"'],
    "projectSlug": "",
    "projectTitle": "",
    "primaryKeyword": "Outlook migration checklist",
    "searchIntent": "procedural — a concrete, ordered checklist for the Outlook transition",
    "metaTitle": "Outlook Migration Checklist: Mail, Calendar & Integrations",
    "metaDescription": "The stage-aware New Outlook migration checklist: mail, calendar, rules, add-ins, integrations and workflows, in the order that stops silent failures.",
    "heroImage": "",
    "heroAlt": "",
    "author": "ABDULREHMAN",
    "authorRole": "Founder & QA Lead",
    "publishedAt": "2026-11-09T09:00:00Z",
    "readingTime": 9,
    "featured": false,
    "body": [
      {
            "type": "p",
            "text": "A migration checklist is a promise about order, and the order is the point. The organisations that fail the Outlook transition are rarely the ones that skipped a step; they are the ones that ran the steps in an order that let a late discovery invalidate an early decision. This checklist is written around the three stages Microsoft documents, opt-in, opt-out and cutover, and around one assumption that the whole thing depends on: the classic Outlook client, on both perpetual and subscription licences, is supported until at least 2029, with no end-of-life date announced. That is a long runway, and it means every step here can be done deliberately, which is the entire advantage the checklist is trying to preserve."
      },
      {
            "type": "h2",
            "text": "Stage zero: inventory, before any client changes"
      },
      {
            "type": "checklist",
            "items": [
                  "List every user group that is affected, and classify them: standard users, power users, and the small set with the most integrations and the most complaints expected. The pilot cohort has to reflect this distribution, not the easiest users.",
                  "Catalogue every add-in, plugin and extension that attaches to the classic client, with the vendor and the purpose. Mark each one as critical, convenient, or unknown. The unknowns are the ones to test first, because they are the ones nobody owns.",
                  "List every integration point that reads from or writes to the mailbox or the calendar: reporting tools, ticketing, CRM, Power Automate flows, custom scripts, and the line-of-business tools that were built against the classic client's object model.",
                  "Inventory the local-file workflows: PST usage, attachment handling, saved-search files, and any process that assumes the client can read and write local files directly, because the new client handles that path differently.",
                  "Write down the organisation's definition of done for each capability, in a sentence a non-engineer can read. This is the acceptance bar the later stages are measured against, and it is the document that makes the exception decisions at opt-out defensible."
            ]
      },
      {
            "type": "h2",
            "text": "Stage one, opt-in: the cheap window"
      },
      {
            "type": "p",
            "text": "This is the stage where nothing is forced, and it is the stage where the real work happens. The work is not the toggle; it is the discovery that the toggle exposes."
      },
      {
            "type": "checklist",
            "items": [
                  "Enrol the pilot cohort with real work, not a sandbox. The failures that surface on real mail, real calendar, and real integrations are the failures that will surface in production; the sandbox ones are not.",
                  "Test each critical add-in against the new client, in the pilot. Record the outcome for each: works unchanged, works with a modern equivalent, or unavailable. The unavailable ones are the exception list, and the exception list is the artefact the whole migration produces.",
                  "Test the mail surface: rules, signatures, reading-pane behaviour, search, and the specific rules and signatures the organisation depends on. The new client manages some of these differently, and the differences show up as missing behaviour, not as an error.",
                  "Test the calendar surface: invites, the response flow, room booking, shared calendars, and the meeting workflows the organisation runs on. Calendar is where the silent differences are most likely to live, because the new client's calendar is closer to the web calendar than the classic one is.",
                  "Run the integration suite against the new client, end to end, with the real data where the pilot allows it. A flow that triggers on the classic client's behaviour and not the new one will not announce itself; it will simply stop working, which is the most expensive kind of failure in a migration.",
                  "Write the pilot findings into the exception list, with a disposition for each item: the capability works, it needs a replacement, or it is retired. A disposition decided in the pilot is a decision; a disposition decided at opt-out is a reaction."
            ]
      },
      {
            "type": "h2",
            "text": "Between stages: the decisions that have to be made on paper"
      },
      {
            "type": "checklist",
            "items": [
                  "Decide the exception policy before opt-out, not during it. Which user groups may stay on the classic client, on what evidence, for how long, and who owns the review that ends the exception. The evidence should be the pilot test results, which is why the pilot had to be real.",
                  "Decide the communication plan, because the change is felt individually by every user and collectively by every team. The message is the same at each stage: what changes, what does not, what the user can still do to switch back, and how to report a problem that the pilot did not catch.",
                  "Decide the rollback expectation, and be honest about it. Switch-back is available throughout opt-out and is not available after cutover. The organisation's tolerance for the cutover decision is set here, and it should be a deliberate number, not a feeling that forms in the middle of the migration."
            ]
      },
      {
            "type": "h2",
            "text": "Stage two, opt-out: watching the default flip"
      },
      {
            "type": "checklist",
            "items": [
                  "Confirm the 12-month notice has been received and logged, and that the implementation date is on the organisation's calendar, not just Microsoft's. The notice is the commitment; the log is the organisation's part of it.",
                  "Monitor adoption and the failure reports in the first weeks of the flip. The failures that matter at this stage are the ones the pilot did not surface, because they belong to users who were not in the pilot, and they are the input to the exception decisions.",
                  "Apply the exception policy that was written in the previous stage, to the users who qualify, with the evidence attached. An exception applied under pressure, without the pre-written policy, is the one that will not survive the cutover review.",
                  "Re-run the regression suite on the new client as it updates, because the new client is a continuously updated web client and the behaviour of a workflow that works today can move before cutover. The suite is the evidence that the stable things are still stable."
            ]
      },
      {
            "type": "h2",
            "text": "Stage three, cutover: the point of no return"
      },
      {
            "type": "checklist",
            "items": [
                  "Confirm the second 12-month notice and the production-ring date. At cutover the switch-back is removed and new deployments ship New Outlook only, so the organisation is on the new client, full stop.",
                  "Confirm the exception users have either migrated or have a documented, time-boxed plan to do so. An exception that has outlived its review date is a decision that has been made by default, which is the worst way to make a decision in a migration.",
                  "Close the loop on the exception list: every item is resolved, retired, or formally deferred with an owner and a date. The checklist is done when the list is empty, not when the toggle is flipped."
            ]
      },
      {
            "type": "h2",
            "text": "Why the order protects you"
      },
      {
            "type": "p",
            "text": "The structure of the checklist is the argument. The inventory comes first, because you cannot test what you have not listed. The pilot comes before any forced stage, because it is the only window where the discovery is cheap. The decisions are written down between the stages, because a decision made under a 12-month clock is a different and worse kind of decision than one made in the quiet. And the regression suite runs continuously, because the target is moving and the only defence against a moving target is a check that is re-run, not a state that is assumed. The Outlook transition is not a technical event; it is a sequence of decisions, and the checklist is the order that keeps each decision informed by the evidence that came before it. That is the whole value, and it is the reason the list is longer than the toggle it is meant to protect."
      },
      {
            "type": "links",
            "title": "Related reading",
            "items": [
                  {
                        "text": "New Outlook for Windows: what the transition means for businesses and users",
                        "href": "/blogs/new-outlook-windows-transition-business-guide"
                  },
                  {
                        "text": "Classic vs New Outlook: the compatibility and regression testing that matters",
                        "href": "/blogs/classic-vs-new-outlook-compatibility-regression-testing"
                  },
                  {
                        "text": "M365 Copilot in Outlook: the testing that turns hope into trust",
                        "href": "/blogs/microsoft-365-copilot-outlook-trust-testing"
                  }
            ]
      }
],
    "faq": [
      {
            "question": "When does the classic Outlook client stop being supported?",
            "answer": "Microsoft has committed to supporting existing classic Outlook installations, perpetual and subscription, until at least 2029, and no end-of-life date has been announced. The practical deadline is organisational: complete the migration before cutover removes the switch-back option."
      },
      {
            "question": "What is the single most important step in the checklist?",
            "answer": "The pilot, run on real work with a real cohort, before any forced stage. It is the only window where discovering which of your integrations do not survive the switch is cheap, and its output, the exception list with a disposition for each item, is the artefact that makes every later decision defensible."
      },
      {
            "question": "How long does the migration take?",
            "answer": "It is bounded by Microsoft's notice commitments, at least 12 months before opt-out and again before cutover, and by the organisation's own schedule in between. The workstream is the add-in and integration surface, not the client change, and its length depends on how much of that surface the organisation actually uses."
      }
],
    "sources": [
      {
            "label": "Microsoft Learn — Guide product availability (Stages of migration to New Outlook for Windows)",
            "url": "https://learn.microsoft.com/en-us/microsoft-365-apps/outlook/get-started/guide-product-availability"
      },
      {
            "label": "Microsoft — New Outlook for Windows: what changed",
            "url": "https://learn.microsoft.com/en-us/microsoft-365-apps/outlook/get-started/new-outlook-what-changed"
      }
]
  },
  {
    "id": 9510,
    "title": "AI Is Moving Faster Than the Testing Around It: The Case for a QA Gate Before Enterprise Adoption",
    "slug": "ai-adoption-velocity-qa-gate",
    "excerpt": "From Rubin's 18-month cycle to agentic email inboxes: the 2026 pattern of capability outrunning validation, and the QA gate that lets organisations adopt at speed without surrendering evidence.",
    "articleType": "insight",
    "category": "Technology",
    "tags": ['"AI adoption"', '"QA"', '"enterprise"', '"governance"', '"NVIDIA"', '"Outlook"', '"synthesis"'],
    "projectSlug": "",
    "projectTitle": "",
    "primaryKeyword": "AI adoption quality assurance",
    "searchIntent": "informational/opinion — why enterprise AI adoption needs a QA gate, and what that gate looks like",
    "metaTitle": "AI Adoption Velocity: A QA Gate Before Enterprise Use",
    "metaDescription": "Rubin's 18-month cycle, agentic inboxes, passkeys: capability outrunning validation, and the QA gate that lets enterprises adopt at speed with evidence.",
    "heroImage": "",
    "heroAlt": "",
    "author": "ABDULREHMAN",
    "authorRole": "Founder & QA Lead",
    "publishedAt": "2026-11-10T09:00:00Z",
    "readingTime": 9,
    "featured": false,
    "body": [
      {
            "type": "p",
            "text": "There is a pattern running through the enterprise technology story of 2026, and it is visible in every layer of the stack at once. At the silicon layer, NVIDIA has moved to an 18-month cycle, with Rubin in full production as of CES 2026 and customer deliveries targeted for the second half of the year, on a roadmap that names a generation for every year through 2028. At the infrastructure layer, the hyperscalers are collectively guiding 2026 capital expenditure past $700 billion, a number that presupposes the capacity coming online will be reliable enough to sell. At the application layer, Microsoft is running a managed transition of the world's most-used email client through three stages with committed notice periods, while the AI capabilities layered on top of that client move from drafting to acting, from summarising your mail to performing operations in your mailbox, on a schedule that is measured in months. At the identity layer, the authentication standard the industry has been building toward for a decade, passkeys, is now the recognised phishing-resistant tier, and the deployments are catching up to the specification. In every layer, the same thing is happening: the capability is arriving on a schedule, and the validation is the part that has to be built, in parallel, by the organisation that is going to run it."
      },
      {
            "type": "h2",
            "text": "The gap is structural, not accidental"
      },
      {
            "type": "p",
            "text": "The distance between a capability and the evidence that it is safe to run is not a delay that will close on its own; it is a structural feature of how technology moves, and the 2026 stack simply makes the feature visible at every level at once. The vendor announces a multiplier and a date, because the announcement is the product at that stage. The customer's workloads, the customer's data, the customer's users and the customer's tolerance for a wrong action are not part of that product, and they are not going to be, because the vendor does not have them and does not need them to make the announcement. The validation that closes the gap is necessarily the customer's work, and it is necessarily specific to the customer's context, and that is why it cannot be delegated to the vendor's evidence, which is the right evidence for a different question. The question the vendor answers is whether the capability exists. The question the customer has to answer is whether the capability, in the customer's environment, with the customer's data, at the customer's scale, behaves within the customer's limits. Those are different questions, and the second one has no answer until it is tested, and it is tested only once, by the customer, in the customer's context."
      },
      {
            "type": "p",
            "text": "The second structural fact is that the gap is getting wider, not narrower, as the cadence compresses. When a generation or a feature arrives every two to three years, the validation window is long enough that the organisation can absorb the discovery cost at a comfortable pace. When the cycle is eighteen months, and the feature cadence inside a platform is measured in monthly releases, the discovery cost has to be paid on a schedule that the organisation did not choose, and the organisation that has not built the discipline to pay it on that schedule is paying it in production, at production cost, instead. That is the whole argument for the gate, in one sentence: the velocity is fixed by the market, the cost of discovery is fixed by the physics of your own environment, and the only variable the organisation controls is when and where the cost is paid."
      },
      {
            "type": "h2",
            "text": "What the gate actually is"
      },
      {
            "type": "p",
            "text": "A QA gate, in this context, is not a committee and it is not a delay. It is a defined point in the adoption path at which a capability does not move from a controlled environment to a live one until a specific set of evidence exists, and the evidence is defined before the testing starts, not after. The gate has three properties that make it different from a review. First, the acceptance criteria are written in advance, against the organisation's own workloads and data, so that the test is measuring the right thing and not a convenient approximation of it. The criteria are the organisation's limits, expressed as testable statements, the error rate it will accept for an acting agent, the integration behaviours that must not change, the invariants the identity stack is supposed to hold. Second, the gate is repeatable, which means the evidence can be produced again, on a schedule, as the capability moves under the organisation, because the capability is moving, and the evidence has to keep up, or it is not evidence. Third, the gate produces an artefact, a documented result with the conditions attached, that makes the adoption decision defensible to the person who will be asked about it later, and that is the difference between a decision and a hope, in a form that survives an audit."
      },
      {
            "type": "p",
            "text": "The gate applies to every layer of the 2026 stack, and the shape is the same in each. For the silicon and the infrastructure, the gate is the acceptance of a rack or a cohort of racks, against the organisation's own workloads, before the capital is committed to it, which is the discipline described in the pieces on Blackwell and Rubin and on the data-centre reliability that the 2026 investment depends on. For the client transition, the gate is the pilot, run on real work, before the opt-out, with the exception list produced as the artefact, which is the structure of the migration checklist. For the acting agent in the mailbox, the gate is the measured error rate on the organisation's own mail, against a threshold the organisation set, in a pilot that reflects its rings and its users, before the authority is handed over. For the identity layer, the gate is the origin-binding test, the cross-platform coverage check, the recovery-path review and the enforcement verification, before the deployment is called phishing-resistant in the organisation's own name. Four different technologies, one shape: the capability arrives, the organisation defines its limits, the organisation tests against them, and the organisation decides with a number attached."
      },
      {
            "type": "h2",
            "text": "The cost of the gate is smaller than the cost of the gap"
      },
      {
            "type": "p",
            "text": "The objection to the gate is always the same, and it is always the same cost: the time, the effort, the delay, the feature that the competitor will have adopted while the organisation is still testing. The honest answer is that the cost is real, and it is also the smaller of the two numbers. The gate costs a bounded amount of effort, paid on a schedule the organisation can see coming. The gap costs an unbounded amount, paid on a schedule the organisation cannot see, at the moment the wrong action happens, or the wrong model is trained on corrupted data, or the exception that was never tested is the one that breaks in production. The 2026 stack does not change that arithmetic; it only raises both numbers, which is why the decision between them matters more now than it has. The organisations that treat the gate as the price of adoption at speed are the ones that get the speed, because the gate is what makes the speed survivable. The ones that treat it as an obstacle to the speed are the ones that will discover, in the fourth quarter, that the speed was the expensive part all along."
      },
      {
            "type": "p",
            "text": "The synthesis of the year is therefore not that AI is moving too fast, though it is. It is that the speed is the constant, and the evidence is the variable, and the organisations that separate the two, that let the capability arrive on its schedule and build the validation on their own, in parallel, with the acceptance criteria written first, are the ones that will look back on 2026 and find that they adopted everything, at the full speed, and that none of it surprised them. That is the definition of a QA gate, and it is the only relationship to the 2026 stack that produces both the adoption and the confidence, in a form that can be shown, and not just claimed."
      },
      {
            "type": "links",
            "title": "Related reading",
            "items": [
                  {
                        "text": "NVIDIA's 2026 announcements and the validation gap they create",
                        "href": "/blogs/nvidia-ai-vision-2026-announcements"
                  },
                  {
                        "text": "The 2026 AI infrastructure boom and what reliability means at data-centre scale",
                        "href": "/blogs/2026-ai-infrastructure-investment-data-centre-reliability"
                  },
                  {
                        "text": "M365 Copilot in Outlook: the testing that turns hope into trust",
                        "href": "/blogs/microsoft-365-copilot-outlook-trust-testing"
                  }
            ]
      }
],
    "faq": [
      {
            "question": "What is a QA gate in the context of AI adoption?",
            "answer": "A defined point in the adoption path where a capability does not move to production until specific, pre-written acceptance criteria have been met and evidenced, against the organisation's own workloads, data and limits. It is repeatable, because the capability keeps moving, and it produces a documented artefact that makes the adoption decision defensible."
      },
      {
            "question": "Does the gate slow adoption down?",
            "answer": "It costs a bounded amount of effort on a visible schedule, and it removes the unbounded cost of discovering the problem in production. The net effect for an organisation that has the gate is usually faster safe adoption, because the adoption is not repeatedly halted by a surprise, and the evidence that it is safe is already on file."
      },
      {
            "question": "How does the gate apply across the stack?",
            "answer": "The shape is the same at every layer: infrastructure acceptance against real workloads before capital commitment, a client-transition pilot on real work before the forced stage, a measured error rate for acting agents before authority is delegated, and the identity invariants verified before the deployment is called phishing-resistant. Different technologies, one discipline: define the limits, test against them, decide with a number attached."
      }
],
    "sources": [
      {
            "label": "NVIDIA — Meta Builds AI Infrastructure With NVIDIA (17 Feb 2026)",
            "url": "https://investor.nvidia.com/news/press-release-details/2026/Meta-Builds-AI-Infrastructure-With-NVIDIA/default.aspx"
      },
      {
            "label": "Introl — NVIDIA Rubin Enters Full Production (CES 2026)",
            "url": "https://introl.com/blog/nvidia-rubin-full-production-ces-2026-ai-infrastructure"
      },
      {
            "label": "Microsoft Learn — Guide product availability (Outlook migration stages)",
            "url": "https://learn.microsoft.com/en-us/microsoft-365-apps/outlook/get-started/guide-product-availability"
      }
]
  },

];
