"use client";

import React, { useState } from "react";

const BUGS = [
  {
    label: "Broken States",
    desc: "Empty carts, empty search results, missing images, zero-stock variants — the states that happen but nobody designed for.",
  },
  {
    label: "Edge Cases",
    desc: "The 1-item cart, the 99-item cart, the free order, the maximum discount, the archived product. Real users hit these.",
  },
  {
    label: "Responsive Inconsistencies",
    desc: "Things that look fine at 390px and fine at 1440px but break at 768px. The in-between states.",
  },
  {
    label: "Checkout Friction",
    desc: "Shipping rates that don't load. Discount codes that silently fail. Address fields that lose data. Steps that can't be undone.",
  },
  {
    label: "Visual Regressions",
    desc: "A font that changed. A spacing that shifted. A colour that no longer passes contrast. Subtle but cumulative.",
  },
  {
    label: "Missing Feedback",
    desc: "The button press that doesn't confirm. The form submit with no response. The action with no outcome visible.",
  },
  {
    label: "Dead Interactions",
    desc: "Links that go nowhere. Buttons that do nothing. Hover states with no follow-through.",
  },
  {
    label: "Unexpected Behaviour",
    desc: "The thing that works 19 times and fails once. The session that clears unexpectedly. The flow that breaks on back-navigation.",
  },
];

export function BugsSection() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <section
      aria-label="What I look for"
      style={{
        paddingTop: "clamp(5rem, 10vw, 9rem)",
        paddingBottom: "clamp(5rem, 10vw, 9rem)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
          }}
          className="bugs-grid"
        >
          {/* Left */}
          <div>
            <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>
              Detection
            </p>
            <h2 style={{ marginBottom: "1.25rem" }}>
              I Look for the Things Users Don&apos;t Have Time to Report.
            </h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
              Most QA misses what happens at the edges — the unusual paths, the unexpected inputs,
              the in-between states. These are exactly what I go looking for.
            </p>

            <div
              style={{
                marginTop: "2rem",
                padding: "1.25rem",
                border: "1px solid var(--border)",
                borderLeft: "3px solid var(--accent)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--bg-surface)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.06em",
                  color: "var(--text-secondary)",
                  lineHeight: 1.8,
                }}
              >
                OBSERVE → INSPECT → DETECT → DIAGNOSE → RESOLVE → VERIFY
              </p>
            </div>
          </div>

          {/* Right: bug list */}
          <div>
            <ul role="list" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {BUGS.map((bug, i) => (
                <li key={bug.label}>
                  <button
                    onClick={() => setActiveIdx(activeIdx === i ? null : i)}
                    aria-expanded={activeIdx === i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "1rem 0",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid var(--border)",
                      cursor: "pointer",
                      textAlign: "left",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.5625rem",
                          color: activeIdx === i ? "var(--accent)" : "var(--text-tertiary)",
                          letterSpacing: "0.1em",
                          transition: "color var(--transition-fast)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        style={{
                          fontSize: "0.9375rem",
                          fontWeight: activeIdx === i ? 700 : 500,
                          color: activeIdx === i ? "var(--text-primary)" : "var(--text-secondary)",
                          transition: "all var(--transition-fast)",
                        }}
                      >
                        {bug.label}
                      </span>
                    </div>
                    <span
                      style={{
                        color: "var(--text-tertiary)",
                        transform: activeIdx === i ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform var(--transition-fast)",
                        fontSize: "1.125rem",
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>

                  {activeIdx === i && (
                    <div
                      style={{
                        paddingBottom: "1rem",
                        paddingLeft: "2rem",
                        animation: "fade-up 0.25s ease forwards",
                      }}
                    >
                      <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                        {bug.desc}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .bugs-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
