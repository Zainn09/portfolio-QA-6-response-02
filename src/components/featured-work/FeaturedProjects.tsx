"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import type { Project } from "@/data/projects";

interface FeaturedProjectsProps {
  projects: Project[];
}

const AUTOPLAY_MS = 7000;

function SeverityBadge({ severity }: { severity: "critical" | "major" | "minor" }) {
  const colors = {
    critical: "var(--critical)",
    major: "var(--major)",
    minor: "var(--minor)",
  };
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.5625rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: colors[severity],
        border: `1px solid ${colors[severity]}`,
        padding: "0.2rem 0.5rem",
        borderRadius: "2px",
        opacity: 0.9,
      }}
    >
      {severity}
    </span>
  );
}

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 56 : -56 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir >= 0 ? -56 : 56 }),
};

const slideTransition = {
  duration: 0.45,
  ease: [0.22, 0.61, 0.36, 1] as const,
};

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const [[activeIndex, direction], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, projects.length - 1));
      setState(([prev]) => {
        if (clamped === prev) return [prev, 0];
        return [clamped, clamped > prev ? 1 : -1];
      });
      setProgressKey((k) => k + 1);
    },
    [projects.length]
  );

  const next = useCallback(() => {
    setState(([prev]) => [(prev + 1) % projects.length, 1]);
    setProgressKey((k) => k + 1);
  }, [projects.length]);

  const prev = useCallback(() => {
    setState(([prevIdx]) => [
      (prevIdx - 1 + projects.length) % projects.length,
      -1,
    ]);
    setProgressKey((k) => k + 1);
  }, [projects.length]);

  // Autoplay (disabled for reduced-motion users, paused on hover/focus)
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [next, paused, progressKey]);

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 48) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const active = projects[activeIndex];
  const primaryIssue = active.issues[0];

  return (
    <section
      ref={sectionRef}
      aria-label="Featured case studies"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      style={{
        paddingTop: "clamp(3rem, 6vw, 4.5rem)",
        paddingBottom: "clamp(3rem, 6vw, 4.5rem)",
        backgroundColor: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        outline: "none",
      }}
    >
      <div className="container">
        {/* Section header */}
        <Reveal>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2rem",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>
                Featured Work
              </p>
              <h2 style={{ maxWidth: "500px" }}>
                10 Stores.{" "}
                <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>
                  10 Different Problems.
                </span>
              </h2>
            </div>
            <Link
              href="/work"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                borderBottom: "1px solid var(--border-strong)",
                paddingBottom: "0.125rem",
                transition: "color var(--transition-fast)",
                whiteSpace: "nowrap",
              }}
            >
              View All 50+ Projects →
            </Link>
          </div>
        </Reveal>

        {/* Store index rail — jump straight to any store */}
        <Reveal delay={80}>
          <div
            role="tablist"
            aria-label="Choose a store"
            className="no-scrollbar"
            style={{
              display: "flex",
              gap: "0.5rem",
              overflowX: "auto",
              paddingBottom: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            {projects.map((p, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => goTo(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 0.875rem",
                    borderRadius: "999px",
                    border: "1px solid",
                    borderColor: isActive ? "var(--accent)" : "var(--border)",
                    backgroundColor: isActive
                      ? "var(--accent-muted)"
                      : "var(--bg-surface)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 250ms cubic-bezier(0.22, 0.61, 0.36, 1)",
                    transform: isActive ? "translateY(-1px)" : "none",
                    boxShadow: isActive ? "var(--shadow-sm)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.5625rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: isActive ? "var(--accent)" : "var(--text-tertiary)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                    }}
                  >
                    {p.title}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Main project display */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "start",
          }}
          className="featured-grid"
        >
          {/* Left: Project visual/info */}
          <div>
            {/* Project counter + autoplay progress */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.625rem",
                }}
              >
                <span
                  aria-live="polite"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                  }}
                >
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}
                </span>
                <button
                  onClick={() => setPaused((p) => !p)}
                  aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
                  aria-pressed={paused}
                  style={{
                    background: "none",
                    border: "1px solid var(--border)",
                    borderRadius: "999px",
                    padding: "0.25rem 0.75rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                    transition: "all var(--transition-fast)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: paused
                        ? "var(--text-tertiary)"
                        : "var(--accent)",
                      animation: paused
                        ? "none"
                        : "pulse-dot 2s ease-in-out infinite",
                    }}
                  />
                  {paused ? "Paused" : "Auto-play"}
                </button>
              </div>
              {/* Progress bar */}
              <div
                aria-hidden="true"
                style={{
                  height: "3px",
                  borderRadius: "2px",
                  backgroundColor: "var(--border)",
                  overflow: "hidden",
                }}
              >
                {!paused && (
                  <div
                    key={progressKey}
                    style={{
                      height: "100%",
                      borderRadius: "2px",
                      backgroundColor: "var(--accent)",
                      transformOrigin: "left",
                      animation: `featured-progress ${AUTOPLAY_MS}ms linear forwards`,
                    }}
                  />
                )}
              </div>
            </div>

            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={active.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
              >
                {/* Visual placeholder with QA annotations */}
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "4/3",
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    marginBottom: "1.5rem",
                  }}
                >
                  {/* Stylized store interface */}
                  <div
                    style={{
                      padding: "1rem",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      opacity: 0.7,
                    }}
                  >
                    <div
                      style={{
                        height: "28px",
                        backgroundColor: "var(--bg-surface-2)",
                        borderRadius: "3px",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "0.75rem",
                        gap: "0.5rem",
                      }}
                    >
                      <div style={{ width: "40px", height: "8px", backgroundColor: "var(--border-strong)", borderRadius: "2px" }} />
                      <div style={{ flex: 1 }} />
                      <div style={{ width: "24px", height: "8px", backgroundColor: "var(--border-strong)", borderRadius: "2px" }} />
                      <div style={{ width: "24px", height: "8px", backgroundColor: "var(--border-strong)", borderRadius: "2px" }} />
                      <div style={{ width: "24px", height: "8px", backgroundColor: "var(--border-strong)", borderRadius: "2px" }} />
                    </div>

                    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      <div style={{ backgroundColor: "var(--bg-surface-2)", borderRadius: "3px" }} />
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0.5rem" }}>
                        <div style={{ height: "8px", backgroundColor: "var(--border-strong)", borderRadius: "2px", width: "80%" }} />
                        <div style={{ height: "8px", backgroundColor: "var(--border)", borderRadius: "2px", width: "60%" }} />
                        <div style={{ height: "8px", backgroundColor: "var(--border)", borderRadius: "2px", width: "70%" }} />
                        <div style={{ marginTop: "auto", height: "28px", backgroundColor: "var(--accent)", borderRadius: "3px", opacity: 0.5 }} />
                      </div>
                    </div>
                  </div>

                  {/* Issue markers */}
                  {active.issues.slice(0, 2).map((issue, i) => (
                    <div
                      key={issue.id}
                      title={issue.title}
                      aria-label={`Issue ${issue.id}: ${issue.title}`}
                      style={{
                        position: "absolute",
                        ...(i === 0 ? { top: "12%", right: "30%" } : { bottom: "35%", left: "55%" }),
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        backgroundColor:
                          issue.severity === "critical"
                            ? "var(--critical)"
                            : issue.severity === "major"
                            ? "var(--major)"
                            : "var(--minor)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.5625rem",
                        fontWeight: 700,
                        cursor: "default",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        animation: "marker-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                        animationDelay: `${i * 150 + 200}ms`,
                        opacity: 0,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  ))}

                  {/* Industry tag */}
                  <div
                    style={{
                      position: "absolute",
                      top: "0.75rem",
                      left: "0.75rem",
                      backgroundColor: "var(--bg-primary)",
                      border: "1px solid var(--border)",
                      padding: "0.25rem 0.625rem",
                      borderRadius: "var(--radius-sm)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.5625rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {active.industry}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation controls */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={prev}
                aria-label="Previous project"
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "transparent",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.625rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  transition: "all var(--transition-fast)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.375rem",
                }}
              >
                ← Previous
              </button>
              <button
                onClick={next}
                aria-label="Next project"
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "transparent",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.625rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  transition: "all var(--transition-fast)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.375rem",
                }}
              >
                Next →
              </button>
            </div>
            <p
              style={{
                marginTop: "0.75rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.5625rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
                textAlign: "center",
              }}
            >
              Swipe, use ← → keys, or pick a store above
            </p>
          </div>

          {/* Right: Project details */}
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={active.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ ...slideTransition, delay: 0.06 }}
            >
              {/* Meta tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    border: "1px solid var(--border)",
                    padding: "0.25rem 0.625rem",
                    borderRadius: "2px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {active.platform}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    border: "1px solid var(--border)",
                    padding: "0.25rem 0.625rem",
                    borderRadius: "2px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {active.industry}
                </span>
                {active.testingScope.slice(0, 2).map((scope) => (
                  <span
                    key={scope}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.5625rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      border: "1px solid var(--border)",
                      padding: "0.25rem 0.625rem",
                      borderRadius: "2px",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {scope}
                  </span>
                ))}
              </div>

              <h3
                style={{
                  fontSize: "clamp(1.375rem, 2.6vw, 2rem)",
                  letterSpacing: "-0.03em",
                  marginBottom: "1.25rem",
                  color: "var(--text-primary)",
                }}
              >
                {active.title}
              </h3>

              <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.75 }}>
                {active.summary}
              </p>

              {/* Primary issue highlight */}
              {primaryIssue && (
                <div
                  style={{
                    border: "1px solid var(--border)",
                    borderLeft: `3px solid ${
                      primaryIssue.severity === "critical"
                        ? "var(--critical)"
                        : primaryIssue.severity === "major"
                        ? "var(--major)"
                        : "var(--minor)"
                    }`,
                    borderRadius: "var(--radius-sm)",
                    padding: "1.25rem",
                    backgroundColor: "var(--bg-surface)",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.625rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.5625rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      Primary Issue
                    </span>
                    <SeverityBadge severity={primaryIssue.severity} />
                  </div>
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {primaryIssue.title}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {primaryIssue.description}
                  </p>
                </div>
              )}

              {/* Verification summary */}
              <div style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                    marginBottom: "0.75rem",
                  }}
                >
                  Status
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {active.verification.slice(0, 4).map((v) => (
                    <div
                      key={v.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.5625rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color:
                          v.status === "verified"
                            ? "var(--verified)"
                            : v.status === "failed"
                            ? "var(--critical)"
                            : "var(--text-tertiary)",
                      }}
                    >
                      <span>{v.status === "verified" ? "✓" : v.status === "failed" ? "✗" : "○"}</span>
                      {v.label}
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={`/work/${active.slug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  backgroundColor: "var(--text-primary)",
                  color: "var(--bg-primary)",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  padding: "0.875rem 1.75rem",
                  borderRadius: "var(--radius-sm)",
                  transition: "all var(--transition-fast)",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--accent)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--text-primary)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--bg-primary)";
                }}
              >
                View Case Study
                <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        @keyframes featured-progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @media (max-width: 900px) {
          .featured-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
