import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — QA Specialist | Shopify & Shopify Plus",
  description:
    "About the QA specialist behind 50+ Shopify store audits. Specialising in functional, responsive, checkout, and accessibility testing.",
  alternates: { canonical: "/about" },
};

const TESTING_TYPES = [
  "Functional Testing",
  "Responsive Testing",
  "Cross-browser Testing",
  "Checkout Testing",
  "Cart Testing",
  "Product Page Testing",
  "Collection Testing",
  "Accessibility Testing",
  "Performance QA",
  "Regression Testing",
  "Exploratory Testing",
  "Third-party App Testing",
];

export default function AboutPage() {
  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      {/* Header */}
      <header
        style={{
          paddingTop: "5rem",
          paddingBottom: "4rem",
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>About</p>
          <h1 style={{ maxWidth: "640px", marginBottom: "1.25rem" }}>
            I Don&apos;t Speak.{" "}
            <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>
              I Let My Work Speak.
            </span>
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "560px", fontSize: "1.125rem" }}>
            A QA specialist focused exclusively on Shopify and Shopify Plus e-commerce experiences.
          </p>
        </div>
      </header>

      {/* Main content */}
      <div className="container" style={{ paddingTop: "5rem", paddingBottom: "6rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "start",
            marginBottom: "5rem",
          }}
          className="about-grid"
        >
          <div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", marginBottom: "1.5rem" }}>
              What I Actually Do
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
                A Shopify store can technically work while still losing customers through broken
                interactions, inconsistent responsive behaviour, confusing flows, checkout issues,
                visual regressions, or unnoticed edge cases.
              </p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
                My job is to find those things before your customers do. Not just the obvious
                failures — the intermittent ones, the edge cases, the things that work 19 times and
                fail once. The ones that cost conversions without leaving a clear trace.
              </p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
                I test systematically. I document precisely. I communicate clearly. And I re-test
                every fix to verify it actually works before calling it resolved.
              </p>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", marginBottom: "1.5rem" }}>
              The Approach
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                { step: "01", label: "Observe", desc: "Understand the store before touching it." },
                { step: "02", label: "Inspect", desc: "Map every testable surface systematically." },
                { step: "03", label: "Find", desc: "Discover what breaks, when, and under what conditions." },
                { step: "04", label: "Understand", desc: "Diagnose root causes, not just symptoms." },
                { step: "05", label: "Fix", desc: "Work with the team to resolve issues correctly." },
                { step: "06", label: "Verify", desc: "Re-test every fix. Regression test everything else." },
              ].map((item) => (
                <div
                  key={item.step}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    padding: "1rem 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.5625rem",
                      letterSpacing: "0.1em",
                      color: "var(--accent)",
                      paddingTop: "0.25rem",
                      fontWeight: 700,
                    }}
                  >
                    {item.step}
                  </span>
                  <div>
                    <p style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.25rem" }}>{item.label}</p>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testing areas */}
        <div style={{ paddingTop: "4rem", borderTop: "1px solid var(--border)", marginBottom: "4rem" }}>
          <p className="eyebrow" style={{ marginBottom: "1.5rem" }}>Testing Specialisations</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
            {TESTING_TYPES.map((type) => (
              <span
                key={type}
                style={{
                  border: "1px solid var(--border)",
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  backgroundColor: "var(--bg-surface)",
                }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ paddingTop: "4rem", borderTop: "1px solid var(--border)", marginBottom: "4rem" }}>
          <p className="eyebrow" style={{ marginBottom: "1.5rem" }}>By the Numbers</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
            {[
              { num: "50+", label: "Stores Tested" },
              { num: "20", label: "Shopify Plus Projects" },
              { num: "12+", label: "Industries Covered" },
              { num: "100%", label: "Verified Resolutions" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: "1.75rem",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-surface)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: "var(--text-primary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {stat.num}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            padding: "3rem",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--bg-surface)",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "1rem", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}>
            Ready to test your store?
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "480px", margin: "0 auto 2rem" }}>
            Start with a free preliminary audit. No commitment, no fluff — just a real look at what
            your store gets wrong.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/audit"
              style={{
                backgroundColor: "var(--accent)",
                color: "#000",
                fontWeight: 700,
                fontSize: "0.9375rem",
                padding: "0.875rem 1.75rem",
                borderRadius: "var(--radius-sm)",
                transition: "all var(--transition-fast)",
              }}
            >
              Get a Free Audit →
            </Link>
            <Link
              href="/work"
              style={{
                backgroundColor: "transparent",
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: "0.9375rem",
                padding: "0.875rem 1.75rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-strong)",
                transition: "all var(--transition-fast)",
              }}
            >
              View My Work
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
