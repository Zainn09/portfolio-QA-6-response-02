"use client";

import React, { useState } from "react";
import {
  Unplug,
  Shuffle,
  Smartphone,
  CreditCard,
  Palette,
  BellOff,
  MousePointerClick,
  Ghost,
  Plus,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

const BUGS = [
  {
    label: "Broken States",
    tag: "Most common",
    icon: Unplug,
    desc: "Empty carts, empty search results, missing images, zero-stock variants — the states that happen but nobody designed for.",
  },
  {
    label: "Edge Cases",
    tag: "Sneaky",
    icon: Shuffle,
    desc: "The 1-item cart, the 99-item cart, the free order, the maximum discount, the archived product. Real users hit these.",
  },
  {
    label: "Responsive Inconsistencies",
    tag: "Device-specific",
    icon: Smartphone,
    desc: "Things that look fine at 390px and fine at 1440px but break at 768px. The in-between states.",
  },
  {
    label: "Checkout Friction",
    tag: "Revenue risk",
    icon: CreditCard,
    desc: "Shipping rates that don't load. Discount codes that silently fail. Address fields that lose data. Steps that can't be undone.",
  },
  {
    label: "Visual Regressions",
    tag: "Subtle",
    icon: Palette,
    desc: "A font that changed. A spacing that shifted. A colour that no longer passes contrast. Subtle but cumulative.",
  },
  {
    label: "Missing Feedback",
    tag: "UX gap",
    icon: BellOff,
    desc: "The button press that doesn't confirm. The form submit with no response. The action with no outcome visible.",
  },
  {
    label: "Dead Interactions",
    tag: "Frustrating",
    icon: MousePointerClick,
    desc: "Links that go nowhere. Buttons that do nothing. Hover states with no follow-through.",
  },
  {
    label: "Unexpected Behaviour",
    tag: "Intermittent",
    icon: Ghost,
    desc: "The thing that works 19 times and fails once. The session that clears unexpectedly. The flow that breaks on back-navigation.",
  },
];

export function BugsSection() {
  const [activeIdx, setActiveIdx] = useState<number | null>(0);

  return (
    <section
      aria-label="What I look for"
      style={{
        paddingTop: "clamp(3rem, 6vw, 4.5rem)",
        paddingBottom: "clamp(3rem, 6vw, 4.5rem)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 5fr) 7fr",
            gap: "clamp(2rem, 4vw, 3.5rem)",
            alignItems: "start",
          }}
          className="bugs-grid"
        >
          {/* Left — sticky intro */}
          <div
            style={{
              position: "sticky",
              top: "calc(var(--nav-height) + 2rem)",
            }}
            className="bugs-intro"
          >
            <Reveal>
              <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>
                Detection
              </p>
              <h2 style={{ marginBottom: "1rem" }}>
                I Look for the Things Users Don&apos;t Have Time to Report.
              </h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                Most QA misses what happens at the edges — the unusual paths, the
                unexpected inputs, the in-between states. These are exactly what I
                go looking for.
              </p>

              <div
                style={{
                  padding: "1.25rem",
                  border: "1px solid var(--border)",
                  borderLeft: "3px solid var(--accent)",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-surface)",
                  marginBottom: "1.25rem",
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

              {/* Progress readout */}
              <p
                aria-live="polite"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.625rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                }}
              >
                {activeIdx !== null ? (
                  <>
                    Viewing{" "}
                    <span style={{ color: "var(--accent)", fontWeight: 700 }}>
                      {String(activeIdx + 1).padStart(2, "0")}
                    </span>{" "}
                    / {String(BUGS.length).padStart(2, "0")} — {BUGS[activeIdx].label}
                  </>
                ) : (
                  <>Select a detection area to inspect it</>
                )}
              </p>
            </Reveal>
          </div>

          {/* Right — smooth accordion */}
          <div>
            <ul
              role="list"
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {BUGS.map((bug, i) => {
                const isActive = activeIdx === i;
                const Icon = bug.icon;
                return (
                  <Reveal key={bug.label} delay={Math.min(i, 5) * 60} y={18}>
                    <li
                      style={{
                        border: "1px solid",
                        borderColor: isActive ? "var(--accent)" : "var(--border)",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: isActive
                          ? "var(--bg-surface)"
                          : "transparent",
                        boxShadow: isActive ? "var(--shadow-md)" : "none",
                        transform: isActive ? "translateY(-2px)" : "none",
                        transition:
                          "border-color 300ms ease, background-color 300ms ease, box-shadow 300ms ease, transform 300ms cubic-bezier(0.22, 0.61, 0.36, 1)",
                        overflow: "hidden",
                      }}
                    >
                      <button
                        onClick={() => setActiveIdx(isActive ? null : i)}
                        aria-expanded={isActive}
                        aria-controls={`bug-panel-${i}`}
                        id={`bug-button-${i}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          width: "100%",
                          padding: "1.125rem 1.25rem",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        {/* Icon bubble */}
                        <span
                          aria-hidden="true"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "var(--radius-sm)",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: isActive
                              ? "var(--accent)"
                              : "var(--bg-surface-2)",
                            color: isActive ? "#000" : "var(--text-tertiary)",
                            border: "1px solid",
                            borderColor: isActive
                              ? "var(--accent)"
                              : "var(--border)",
                            transition: "all 300ms ease",
                            transform: isActive ? "scale(1.05)" : "scale(1)",
                          }}
                        >
                          <Icon size={18} strokeWidth={2} aria-hidden="true" />
                        </span>

                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.625rem",
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.5625rem",
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                color: isActive
                                  ? "var(--accent)"
                                  : "var(--text-tertiary)",
                                transition: "color 300ms ease",
                              }}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span
                              style={{
                                fontSize: "0.9375rem",
                                fontWeight: isActive ? 700 : 600,
                                color: isActive
                                  ? "var(--text-primary)"
                                  : "var(--text-secondary)",
                                transition: "all 300ms ease",
                              }}
                            >
                              {bug.label}
                            </span>
                          </span>
                          <span
                            style={{
                              display: "block",
                              marginTop: "0.25rem",
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.5625rem",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: "var(--text-tertiary)",
                            }}
                          >
                            {bug.tag}
                          </span>
                        </span>

                        {/* Plus / minus indicator */}
                        <span
                          aria-hidden="true"
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid",
                            borderColor: isActive
                              ? "var(--accent)"
                              : "var(--border-strong)",
                            backgroundColor: isActive
                              ? "var(--accent-muted)"
                              : "transparent",
                            color: isActive
                              ? "var(--accent)"
                              : "var(--text-tertiary)",
                            fontSize: "1rem",
                            lineHeight: 1,
                            transform: isActive
                              ? "rotate(135deg)"
                              : "rotate(0deg)",
                            transition:
                              "transform 350ms cubic-bezier(0.22, 0.61, 0.36, 1), background-color 300ms ease, border-color 300ms ease, color 300ms ease",
                          }}
                        >
                          +
                        </span>
                      </button>

                      {/* Smooth height transition panel */}
                      <div
                        id={`bug-panel-${i}`}
                        role="region"
                        aria-labelledby={`bug-button-${i}`}
                        style={{
                          display: "grid",
                          gridTemplateRows: isActive ? "1fr" : "0fr",
                          transition:
                            "grid-template-rows 450ms cubic-bezier(0.22, 0.61, 0.36, 1)",
                        }}
                      >
                        <div style={{ overflow: "hidden" }}>
                          <div
                            style={{
                              padding: "0 1.25rem 1.25rem 4.5rem",
                              opacity: isActive ? 1 : 0,
                              transform: isActive
                                ? "translateY(0)"
                                : "translateY(-8px)",
                              transition:
                                "opacity 350ms ease 80ms, transform 350ms cubic-bezier(0.22, 0.61, 0.36, 1) 80ms",
                            }}
                          >
                            <p
                              style={{
                                fontSize: "0.875rem",
                                color: "var(--text-secondary)",
                                lineHeight: 1.7,
                                borderLeft: "2px solid var(--border)",
                                paddingLeft: "1rem",
                              }}
                            >
                              {bug.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  </Reveal>
                );
              })}
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
          .bugs-intro {
            position: static !important;
          }
        }
      `}</style>
    </section>
  );
}
