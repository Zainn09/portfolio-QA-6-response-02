"use client";

import React, { useState } from "react";

const PROCESS_STEPS = [
  {
    num: "01",
    label: "Understand",
    headline: "Know the store before touching it.",
    desc: "Review the store's purpose, audience, key user journeys, recent changes, and known issues. Understand what matters most — before testing anything.",
    icon: "◎",
  },
  {
    num: "02",
    label: "Map",
    headline: "Build the test surface.",
    desc: "Map every testable surface: pages, flows, components, integrations, and edge cases. Create a structured test plan prioritised by business impact.",
    icon: "⊞",
  },
  {
    num: "03",
    label: "Explore",
    headline: "Walk through it like a real user.",
    desc: "Exploratory testing first — no script, no assumptions. Follow intuition and prior experience to find the issues that scripts would miss.",
    icon: "◉",
  },
  {
    num: "04",
    label: "Break",
    headline: "Systematically push every boundary.",
    desc: "Scripted functional, responsive, cross-browser, and checkout testing. Edge cases. Unusual inputs. Unexpected paths. Real device testing.",
    icon: "⊘",
  },
  {
    num: "05",
    label: "Reproduce",
    headline: "Document exactly how it breaks.",
    desc: "Every issue gets a precise reproduction path, severity rating, environment details, and root-cause hypothesis. No vague bug reports.",
    icon: "⊕",
  },
  {
    num: "06",
    label: "Resolve",
    headline: "Work with the team to fix it right.",
    desc: "Clear, actionable reports. Available for questions during the fix. Second opinion on proposed solutions when needed.",
    icon: "◈",
  },
  {
    num: "07",
    label: "Verify",
    headline: "Confirm the fix. Then re-test everything.",
    desc: "Re-test each resolved issue. Run regression testing to ensure fixes didn't break anything else. Only then: verified.",
    icon: "✓",
  },
];

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="process"
      aria-label="QA Process"
      style={{
        paddingTop: "clamp(5rem, 10vw, 9rem)",
        paddingBottom: "clamp(5rem, 10vw, 9rem)",
        backgroundColor: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "3.5rem" }}>
          <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>
            The Process
          </p>
          <h2 style={{ maxWidth: "580px" }}>
            How I Break a Store{" "}
            <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>
              Before Your Customers Do.
            </span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: "4rem",
            alignItems: "start",
          }}
          className="process-grid"
        >
          {/* Step list */}
          <div>
            {PROCESS_STEPS.map((step, i) => (
              <button
                key={step.num}
                onClick={() => setActiveStep(i)}
                aria-selected={activeStep === i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  width: "100%",
                  padding: "1rem 0",
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all var(--transition-fast)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6875rem",
                    letterSpacing: "0.1em",
                    color: activeStep === i ? "var(--accent)" : "var(--text-tertiary)",
                    width: "24px",
                    flexShrink: 0,
                    fontWeight: 600,
                    transition: "color var(--transition-fast)",
                  }}
                >
                  {step.num}
                </span>

                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: activeStep === i ? 700 : 500,
                      color: activeStep === i ? "var(--text-primary)" : "var(--text-secondary)",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    {step.label}
                  </span>
                  <span
                    style={{
                      fontSize: "1rem",
                      color: activeStep === i ? "var(--accent)" : "var(--border-strong)",
                      transition: "color var(--transition-fast)",
                    }}
                    aria-hidden="true"
                  >
                    {step.icon}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Active step detail */}
          <div
            style={{
              position: "sticky",
              top: "calc(var(--nav-height) + 2rem)",
            }}
          >
            <div
              style={{
                padding: "2.5rem",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-surface)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <span
                  style={{
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "var(--accent-muted)",
                    border: "1px solid var(--accent)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "1.25rem",
                    color: "var(--accent)",
                  }}
                  aria-hidden="true"
                >
                  {PROCESS_STEPS[activeStep].icon}
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.5625rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    Step {PROCESS_STEPS[activeStep].num}
                  </p>
                  <h3
                    style={{
                      fontSize: "1.375rem",
                      letterSpacing: "-0.02em",
                      color: "var(--text-primary)",
                    }}
                  >
                    {PROCESS_STEPS[activeStep].label}
                  </h3>
                </div>
              </div>

              <p
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "0.875rem",
                  lineHeight: 1.4,
                }}
              >
                {PROCESS_STEPS[activeStep].headline}
              </p>

              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                {PROCESS_STEPS[activeStep].desc}
              </p>

              {/* Progress indicators */}
              <div
                style={{
                  marginTop: "2rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  gap: "0.25rem",
                }}
              >
                {PROCESS_STEPS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: "3px",
                      flex: 1,
                      borderRadius: "2px",
                      backgroundColor:
                        i < activeStep
                          ? "var(--verified)"
                          : i === activeStep
                          ? "var(--accent)"
                          : "var(--border)",
                      transition: "background-color var(--transition-base)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .process-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
