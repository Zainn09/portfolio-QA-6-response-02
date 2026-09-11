"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import type { Project } from "@/data/projects";

interface FeaturedProjectsProps {
  projects: Project[];
}

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (index: number) => {
      if (index === activeIndex || isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex(index);
        setIsTransitioning(false);
      }, 300);
    },
    [activeIndex, isTransitioning]
  );

  const next = () => goTo(Math.min(activeIndex + 1, projects.length - 1));
  const prev = () => goTo(Math.max(activeIndex - 1, 0));

  const active = projects[activeIndex];
  const primaryIssue = active.issues[0];

  return (
    <section
      aria-label="Featured case studies"
      style={{
        paddingTop: "clamp(5rem, 10vw, 9rem)",
        paddingBottom: "clamp(5rem, 10vw, 9rem)",
        backgroundColor: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="container">
        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "4rem",
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

        {/* Main project display */}
        <div
          ref={containerRef}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "start",
          }}
          className="featured-grid"
        >
          {/* Left: Project visual/info */}
          <div
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? "translateY(16px)" : "translateY(0)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            {/* Project counter */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <span
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
              <div style={{ display: "flex", gap: "0.25rem" }}>
                {projects.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to project ${i + 1}`}
                    style={{
                      width: i === activeIndex ? "20px" : "6px",
                      height: "6px",
                      borderRadius: "3px",
                      backgroundColor:
                        i === activeIndex ? "var(--accent)" : "var(--border-strong)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all var(--transition-base)",
                    }}
                  />
                ))}
              </div>
            </div>

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
                {/* Nav bar mock */}
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

                {/* Content area */}
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
                    animationDelay: `${i * 150}ms`,
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

            {/* Navigation controls */}
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
          </div>

          {/* Right: Project details */}
          <div
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? "translateX(16px)" : "translateX(0)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
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
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                letterSpacing: "-0.03em",
                marginBottom: "1.25rem",
                color: "var(--text-primary)",
              }}
            >
              {active.title}
            </h3>

            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: 1.75 }}>
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
                  marginBottom: "2rem",
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
            <div style={{ marginBottom: "2rem" }}>
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
          </div>
        </div>
      </div>

      <style jsx>{`
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
