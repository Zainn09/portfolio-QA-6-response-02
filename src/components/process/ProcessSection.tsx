"use client";

import React, { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";

const PROCESS_STEPS = [
  {
    num: "01",
    label: "Understand",
    headline: "Know the store before touching it.",
    desc: "Review the store's purpose, audience, key user journeys, recent changes, and known issues. Understand what matters most — before testing anything.",
    icon: "◎",
    tags: ["Discovery", "User journeys"],
  },
  {
    num: "02",
    label: "Map",
    headline: "Build the test surface.",
    desc: "Map every testable surface: pages, flows, components, integrations, and edge cases. Create a structured test plan prioritised by business impact.",
    icon: "⊞",
    tags: ["Test plan", "Prioritisation"],
  },
  {
    num: "03",
    label: "Explore",
    headline: "Walk through it like a real user.",
    desc: "Exploratory testing first — no script, no assumptions. Follow intuition and prior experience to find the issues that scripts would miss.",
    icon: "◉",
    tags: ["Exploratory", "Real devices"],
  },
  {
    num: "04",
    label: "Break",
    headline: "Systematically push every boundary.",
    desc: "Scripted functional, responsive, cross-browser, and checkout testing. Edge cases. Unusual inputs. Unexpected paths. Real device testing.",
    icon: "⊘",
    tags: ["Functional", "Checkout", "Cross-browser"],
  },
  {
    num: "05",
    label: "Reproduce",
    headline: "Document exactly how it breaks.",
    desc: "Every issue gets a precise reproduction path, severity rating, environment details, and root-cause hypothesis. No vague bug reports.",
    icon: "⊕",
    tags: ["Bug reports", "Severity rating"],
  },
  {
    num: "06",
    label: "Resolve",
    headline: "Work with the team to fix it right.",
    desc: "Clear, actionable reports. Available for questions during the fix. Second opinion on proposed solutions when needed.",
    icon: "◈",
    tags: ["Dev handoff", "Fix review"],
  },
  {
    num: "07",
    label: "Verify",
    headline: "Confirm the fix. Then re-test everything.",
    desc: "Re-test each resolved issue. Run regression testing to ensure fixes didn't break anything else. Only then: verified.",
    icon: "✓",
    tags: ["Re-test", "Regression"],
  },
];

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const navRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-spy v2: position-based, rAF-throttled. The card whose centre is
  // nearest the viewport focus line owns the active step — deterministic,
  // never skips, works at any scroll speed or viewport size.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      if (!section) return;
      const sectionRect = section.getBoundingClientRect();
      // Before the section: pin to step 0. Past it: pin to step 6.
      if (sectionRect.top > window.innerHeight * 0.6) {
        setActiveStep((prev) => (prev === 0 ? prev : 0));
        return;
      }
      if (sectionRect.bottom < window.innerHeight * 0.4) {
        setActiveStep((prev) => (prev === PROCESS_STEPS.length - 1 ? prev : PROCESS_STEPS.length - 1));
        return;
      }
      const focusLine = window.innerHeight * 0.45;
      let best = 0;
      let bestDist = Infinity;
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - focusLine);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActiveStep((prev) => (prev === best ? prev : best));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Keep the active nav pill in view inside the rail.
  // NOTE: scrollIntoView() scrolls every scrollable ancestor — including the
  // window — which hijacked the page while the user was scrolling on mobile.
  // We scroll the rail element itself instead, so the page is never touched.
  useEffect(() => {
    const rail = navRef.current;
    if (!rail) return;
    const active = rail.querySelector<HTMLElement>(`[data-step="${activeStep}"]`);
    if (!active) return;

    const isHorizontal = rail.scrollWidth > rail.clientWidth;
    if (isHorizontal) {
      const target =
        active.offsetLeft - rail.clientWidth / 2 + active.offsetWidth / 2;
      const max = rail.scrollWidth - rail.clientWidth;
      rail.scrollTo({ left: Math.max(0, Math.min(target, max)), behavior: "smooth" });
    } else if (rail.scrollHeight > rail.clientHeight) {
      const target =
        active.offsetTop - rail.clientHeight / 2 + active.offsetHeight / 2;
      const max = rail.scrollHeight - rail.clientHeight;
      rail.scrollTo({ top: Math.max(0, Math.min(target, max)), behavior: "smooth" });
    }
  }, [activeStep]);

  const scrollToStep = (i: number) => {
    setActiveStep(i);
    const el = stepRefs.current[i];
    if (!el) return;
    // Manual window scroll (not scrollIntoView) so nested scroll containers
    // are left alone and the fixed navbar offset is respected.
    const navOffset =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--nav-height"),
        10
      ) || 68;
    const rect = el.getBoundingClientRect();
    const isMobile = window.innerWidth <= 900;
    const top = isMobile
      ? window.scrollY + rect.top - navOffset - 16
      : window.scrollY + rect.top - (window.innerHeight - rect.height) / 2;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  const progress = ((activeStep + 1) / PROCESS_STEPS.length) * 100;
  const current = PROCESS_STEPS[activeStep];

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-label="QA Process"
      style={{
        paddingTop: "clamp(3rem, 6vw, 4.5rem)",
        paddingBottom: "clamp(3rem, 6vw, 4.5rem)",
        backgroundColor: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="container">
        {/* Header */}
        <Reveal>
          <div style={{ marginBottom: "2.25rem", maxWidth: "620px" }}>
            <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>
              The Process
            </p>
            <h2>
              How I Break a Store{" "}
              <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>
                Before Your Customers Do.
              </span>
            </h2>
            <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>
              Scroll through the journey — the tracker follows you from step 01
              to 07.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: "clamp(2rem, 4vw, 3.5rem)",
            alignItems: "start",
          }}
          className="process-grid"
        >
          {/* Sticky scroll tracker — stickiness in CSS so the mobile
              `position: static` override actually wins. */}
          <div className="process-rail">
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-surface)",
                padding: "1.25rem",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                }}
              >
                Journey
              </span>

              {/* Big live step number — ticks over as you scroll */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.5rem",
                  marginTop: "0.25rem",
                  marginBottom: "0.125rem",
                }}
              >
                <span
                  key={activeStep}
                  aria-live="polite"
                  aria-label={`Current step ${current.num} of 07: ${current.label}`}
                  className="journey-num-tick"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "2.75rem",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    color: "var(--text-primary)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {current.num}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.875rem",
                    color: "var(--text-tertiary)",
                  }}
                >
                  / 07
                </span>
              </div>
              <p
                key={`label-${activeStep}`}
                className="journey-num-tick"
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                  marginBottom: "1rem",
                }}
              >
                {current.label}
              </p>

              {/* Progress track */}
              <div
                aria-hidden="true"
                style={{
                  height: "4px",
                  borderRadius: "2px",
                  backgroundColor: "var(--border)",
                  overflow: "hidden",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    borderRadius: "2px",
                    backgroundColor: "var(--accent)",
                    transition:
                      "width 450ms cubic-bezier(0.22, 0.61, 0.36, 1)",
                  }}
                />
              </div>

              <div
                ref={navRef}
                role="tablist"
                aria-label="Process steps"
                className="process-nav no-scrollbar"
                style={{
                  display: "flex",
                  gap: "0.25rem",
                }}
              >
                {PROCESS_STEPS.map((step, i) => {
                  const isActive = activeStep === i;
                  const isPast = i < activeStep;
                  return (
                    <button
                      key={step.num}
                      role="tab"
                      aria-selected={isActive}
                      data-step={i}
                      onClick={() => scrollToStep(i)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        width: "100%",
                        padding: "0.625rem 0.75rem",
                        backgroundColor: isActive
                          ? "var(--accent-muted)"
                          : "transparent",
                        border: "1px solid",
                        borderColor: isActive ? "var(--accent)" : "transparent",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 300ms ease",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.625rem",
                          letterSpacing: "0.08em",
                          color: isActive
                            ? "var(--accent)"
                            : isPast
                            ? "var(--verified)"
                            : "var(--text-tertiary)",
                          fontWeight: 700,
                          width: "20px",
                          flexShrink: 0,
                          transition: "color 300ms ease",
                        }}
                      >
                        {isPast ? "✓" : step.num}
                      </span>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: isActive ? 700 : 500,
                          color: isActive
                            ? "var(--text-primary)"
                            : "var(--text-secondary)",
                          transition: "all 300ms ease",
                        }}
                      >
                        {step.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scrolling step cards */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {PROCESS_STEPS.map((step, i) => {
              const isActive = activeStep === i;
              return (
                <article
                  key={step.num}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  data-index={i}
                  aria-label={`Step ${step.num}: ${step.label}`}
                  style={{
                    padding: "clamp(1.25rem, 2.5vw, 1.75rem)",
                    border: "1px solid",
                    borderColor: isActive
                      ? "var(--accent)"
                      : "var(--border)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--bg-surface)",
                    boxShadow: isActive ? "var(--shadow-md)" : "none",
                    transform: isActive ? "translateY(-2px)" : "none",
                    opacity: isActive ? 1 : 0.72,
                    transition:
                      "border-color 400ms ease, box-shadow 400ms ease, transform 400ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 400ms ease",
                    scrollMarginTop: "calc(var(--nav-height) + 1rem)",
                    scrollMarginBottom: "20vh",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <span
                      style={{
                        width: "48px",
                        height: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isActive
                          ? "var(--accent)"
                          : "var(--accent-muted)",
                        border: "1px solid var(--accent)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "1.25rem",
                        color: isActive ? "#000" : "var(--accent)",
                        flexShrink: 0,
                        transition: "all 400ms ease",
                      }}
                      aria-hidden="true"
                    >
                      {step.icon}
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
                        Step {step.num} of 07
                      </p>
                      <h3
                        style={{
                          fontSize: "1.25rem",
                          letterSpacing: "-0.02em",
                          color: "var(--text-primary)",
                        }}
                      >
                        {step.label}
                      </h3>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: "1.0625rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "0.625rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {step.headline}
                  </p>

                  <p
                    style={{
                      color: "var(--text-secondary)",
                      lineHeight: 1.75,
                      marginBottom: "1.25rem",
                    }}
                  >
                    {step.desc}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.5rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--text-primary)",
                          backgroundColor: "var(--accent-muted)",
                          padding: "0.25rem 0.625rem",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--accent)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes journey-num-tick {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .journey-num-tick {
          display: inline-block;
          animation: journey-num-tick 380ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
        }
        .process-rail {
          position: sticky;
          top: calc(var(--nav-height) + 1.5rem);
        }
        .process-nav {
          flex-direction: column;
          max-height: 40vh;
          overflow-y: auto;
        }
        @media (max-width: 900px) {
          .process-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            min-width: 0;
          }
          .process-rail {
            position: static !important;
            min-width: 0;
            max-width: 100%;
          }
          .process-nav {
            flex-direction: row !important;
            max-height: none !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            padding-bottom: 0.25rem;
            /* Horizontal-only gesture handling: vertical swipes stay with the
               page, so scrolling past this section no longer stalls. */
            touch-action: pan-x;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior-x: contain;
            overscroll-behavior-y: auto;
            scrollbar-width: none;
          }
          .process-nav::-webkit-scrollbar {
            display: none;
          }
          .process-nav button {
            width: auto !important;
            flex-shrink: 0;
            white-space: nowrap;
          }
        }
      `}</style>
    </section>
  );
}
