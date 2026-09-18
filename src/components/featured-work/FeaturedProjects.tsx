"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { MotionConfig } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import type { Project } from "@/data/projects";

interface FeaturedProjectsProps {
  projects: Project[];
}

/** Desktop scroll length devoted to each project in the pinned showcase */
const VH_PER_PROJECT = 90;

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

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const trackRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const prevIdx = useRef(0);

  // Mobile = classic tap-through carousel (no pinning, no overlap risk)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Desktop scroll driver: track progress maps across all 10 projects
  useEffect(() => {
    if (isMobile) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const total = track.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      setProgress(p);
      const idx = Math.min(projects.length - 1, Math.floor(p * projects.length));
      if (idx !== prevIdx.current) {
        prevIdx.current = idx;
        setActiveIndex(idx);
      }
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
  }, [isMobile, projects.length]);

  // Keep the active store pill in view (rail scroll only — never moves the page)
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const active = rail.querySelector<HTMLElement>(`[data-rail="${activeIndex}"]`);
    if (!active) return;
    const r = rail.getBoundingClientRect();
    const a = active.getBoundingClientRect();
    if (a.left < r.left) {
      rail.scrollBy({ left: a.left - r.left - 12, behavior: "smooth" });
    } else if (a.right > r.right) {
      rail.scrollBy({ left: a.right - r.right + 12, behavior: "smooth" });
    }
  }, [activeIndex]);

  const scrollToProject = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, projects.length - 1));
      if (isMobile) {
        if (clamped !== activeIndex) {
          prevIdx.current = clamped;
          setActiveIndex(clamped);
        }
        return;
      }
      const track = trackRef.current;
      if (!track) return;
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      const total = track.offsetHeight - window.innerHeight;
      const y = trackTop + (total * (clamped + 0.5)) / projects.length;
      window.scrollTo({ top: y, behavior: "smooth" });
    },
    [isMobile, activeIndex, projects.length]
  );

  const goTo = useCallback(
    (index: number) => scrollToProject(index),
    [scrollToProject]
  );
  const next = useCallback(
    () => scrollToProject(activeIndex + 1),
    [scrollToProject, activeIndex]
  );
  const prev = useCallback(
    () => scrollToProject(activeIndex - 1),
    [scrollToProject, activeIndex]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  const displayProgress = isMobile
    ? (activeIndex + 1) / projects.length
    : progress;

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={trackRef}
        aria-label="Featured case studies"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="featured-track"
        style={{ height: `${projects.length * VH_PER_PROJECT}vh` }}
      >
        <div className="featured-stage">
          <div className="container" style={{ width: "100%" }}>
            {/* Section header — static, never moves */}
            <Reveal>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
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

            {/* Store index rail — static row, active pill updates in place */}
            <Reveal delay={80}>
              <div
                ref={railRef}
                role="tablist"
                aria-label="Choose a store"
                className="no-scrollbar"
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  overflowX: "auto",
                  paddingTop: "0.375rem",
                  paddingBottom: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                {projects.map((p, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={p.id}
                      role="tab"
                      aria-selected={isActive}
                      data-rail={i}
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
              {/* Left column — frame stays fixed, only the visual swaps */}
              <div>
                {/* Project counter + scroll progress */}
                <div style={{ marginBottom: "1rem" }}>
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
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.5625rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--text-tertiary)",
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
                          backgroundColor: "var(--accent)",
                          animation: "pulse-dot 2s ease-in-out infinite",
                        }}
                      />
                      {isMobile ? "Tap a store" : "Scroll to explore ↓"}
                    </span>
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
                    <div
                      style={{
                        height: "100%",
                        borderRadius: "2px",
                        backgroundColor: "var(--accent)",
                        width: `${Math.round(displayProgress * 100)}%`,
                        transition: "width 200ms linear",
                      }}
                    />
                  </div>
                </div>

                {/* Fixed visual frame — slides crossfade INSIDE, box never moves */}
                <div className="featured-visual-box">
                  {projects.map((p, i) => {
                    const isActive = i === activeIndex;
                    return (
                      <div
                        key={p.id}
                        aria-hidden={!isActive}
                        data-active={isActive}
                        className="featured-visual-slide"
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

                        {/* Issue markers — mount on activation so they pop in */}
                        {isActive &&
                          p.issues.slice(0, 2).map((issue, j) => (
                            <div
                              key={issue.id}
                              title={issue.title}
                              aria-label={`Issue ${issue.id}: ${issue.title}`}
                              style={{
                                position: "absolute",
                                ...(j === 0 ? { top: "12%", right: "30%" } : { bottom: "35%", left: "55%" }),
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
                                animationDelay: `${j * 150 + 250}ms`,
                                opacity: 0,
                              }}
                            >
                              {String(j + 1).padStart(2, "0")}
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
                          {p.industry}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Navigation controls — static */}
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={prev}
                    disabled={activeIndex === 0}
                    aria-label="Previous project"
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      border: "1px solid var(--border-strong)",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "transparent",
                      color: "var(--text-secondary)",
                      cursor: activeIndex === 0 ? "not-allowed" : "pointer",
                      opacity: activeIndex === 0 ? 0.4 : 1,
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
                    disabled={activeIndex === projects.length - 1}
                    aria-label="Next project"
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      border: "1px solid var(--border-strong)",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "transparent",
                      color: "var(--text-secondary)",
                      cursor: activeIndex === projects.length - 1 ? "not-allowed" : "pointer",
                      opacity: activeIndex === projects.length - 1 ? 0.4 : 1,
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
                    marginTop: "0.5rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                    textAlign: "center",
                  }}
                >
                  {isMobile
                    ? "Tap a store above or use ← → keys"
                    : "Scroll to glide through all 10 stores"}
                </p>
              </div>

              {/* Right column — details crossfade in a fixed stack, column never moves */}
              <div className="featured-details-stack">
                {projects.map((p, i) => {
                  const isActive = i === activeIndex;
                  const primaryIssue = p.issues[0];
                  return (
                    <article
                      key={p.id}
                      aria-hidden={!isActive}
                      data-active={isActive}
                      className="featured-details-slide"
                    >
                      {/* Meta tags */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
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
                          {p.platform}
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
                          {p.industry}
                        </span>
                        {p.testingScope.slice(0, 2).map((scope) => (
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
                          marginBottom: "0.75rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        {p.title}
                      </h3>

                      <p style={{ color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: 1.7 }}>
                        {p.summary}
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
                            padding: "1rem 1.25rem",
                            backgroundColor: "var(--bg-surface)",
                            marginBottom: "1rem",
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
                      <div style={{ marginBottom: "1rem" }}>
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
                          {p.verification.slice(0, 4).map((v) => (
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

                      {isActive && (
                        <Link
                          href={`/work/${p.slug}`}
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
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .featured-track {
            position: relative;
            background-color: var(--bg-secondary);
            border-top: 1px solid var(--border);
            border-bottom: 1px solid var(--border);
            outline: none;
          }
          .featured-stage {
            position: sticky;
            top: 0;
            height: 100vh;
            height: 100svh;
            display: flex;
            align-items: center;
            overflow-y: auto;
            scrollbar-width: thin;
          }
          /* Fixed visual frame: slides crossfade inside, the box never moves */
          .featured-visual-box {
            position: relative;
            aspect-ratio: 16/10;
            background-color: var(--bg-surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            overflow: hidden;
            margin-bottom: 1.25rem;
          }
          .featured-visual-slide {
            position: absolute;
            inset: 0;
            opacity: 0;
            transform: scale(1.02);
            visibility: hidden;
            transition:
              opacity 500ms ease,
              transform 600ms ease,
              visibility 0s linear 500ms;
            pointer-events: none;
          }
          .featured-visual-slide[data-active="true"] {
            opacity: 1;
            transform: none;
            visibility: visible;
            transition:
              opacity 500ms ease,
              transform 600ms ease,
              visibility 0s;
            pointer-events: auto;
          }
          /* Details stack: height = tallest panel, so the column never jumps */
          .featured-details-stack {
            display: grid;
          }
          .featured-details-slide {
            grid-area: 1 / 1;
            opacity: 0;
            transform: translateY(14px);
            visibility: hidden;
            transition:
              opacity 450ms ease,
              transform 450ms cubic-bezier(0.22, 0.61, 0.36, 1),
              visibility 0s linear 450ms;
            pointer-events: none;
          }
          .featured-details-slide[data-active="true"] {
            opacity: 1;
            transform: none;
            visibility: visible;
            transition:
              opacity 450ms ease,
              transform 450ms cubic-bezier(0.22, 0.61, 0.36, 1),
              visibility 0s;
            pointer-events: auto;
          }
          @media (prefers-reduced-motion: reduce) {
            .featured-visual-slide,
            .featured-details-slide {
              transition: none;
              transform: none;
            }
          }
          @media (max-width: 900px) {
            .featured-track {
              height: auto !important;
            }
            .featured-stage {
              position: static !important;
              height: auto !important;
              display: block !important;
              overflow: visible !important;
              padding-top: clamp(3rem, 6vw, 4.5rem);
              padding-bottom: clamp(3rem, 6vw, 4.5rem);
            }
            .featured-grid {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
            }
          }
        `}</style>
      </section>
    </MotionConfig>
  );
}
