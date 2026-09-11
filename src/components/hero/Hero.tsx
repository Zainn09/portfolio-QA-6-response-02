"use client";

import React from "react";
import Link from "next/link";
import { InspectionAnimation } from "./InspectionAnimation";

export function Hero() {
  return (
    <section
      aria-label="Hero"
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        paddingTop: "var(--nav-height)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid pattern */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.4,
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left: Copy */}
          <div style={{ maxWidth: "600px" }}>
            <div
              className="eyebrow"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.75rem",
                animation: "fade-up 0.6s ease forwards",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "var(--accent)",
                  animation: "pulse-dot 2s ease-in-out infinite",
                }}
              />
              Quality Assurance / Shopify / Shopify Plus
            </div>

            <h1
              style={{
                marginBottom: "1.5rem",
                animation: "fade-up 0.6s 0.1s ease both",
                color: "var(--text-primary)",
              }}
            >
              I Find What Your Store Gets Wrong{" "}
              <span
                style={{
                  color: "var(--accent)",
                  WebkitTextStroke: "unset",
                  display: "inline-block",
                  position: "relative",
                }}
              >
                Before
              </span>{" "}
              Your Customers Do.
            </h1>

            <p
              style={{
                fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
                color: "var(--text-secondary)",
                marginBottom: "0.75rem",
                animation: "fade-up 0.6s 0.2s ease both",
                maxWidth: "500px",
              }}
            >
              50+ stores tested. 20 Shopify Plus projects. Hundreds of issues discovered, diagnosed, and resolved.
            </p>

            <p
              style={{
                fontSize: "0.9375rem",
                color: "var(--text-tertiary)",
                marginBottom: "2.5rem",
                animation: "fade-up 0.6s 0.25s ease both",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.02em",
              }}
            >
              Functional · Responsive · Checkout · Accessibility · Cross-browser
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                animation: "fade-up 0.6s 0.35s ease both",
              }}
            >
              <Link
                href="/audit"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "var(--accent)",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  padding: "0.875rem 1.75rem",
                  borderRadius: "var(--radius-sm)",
                  transition: "all var(--transition-fast)",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--accent-hover)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--accent)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                }}
              >
                Get a Free Audit Report
                <span aria-hidden="true" style={{ fontSize: "1.1em" }}>→</span>
              </Link>

              <Link
                href="/work"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "transparent",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  padding: "0.875rem 1.75rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-strong)",
                  transition: "all var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--bg-surface)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--text-tertiary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-strong)";
                }}
              >
                Explore My Work
              </Link>
            </div>

            {/* Small stats row */}
            <div
              style={{
                display: "flex",
                gap: "2rem",
                marginTop: "3rem",
                paddingTop: "2rem",
                borderTop: "1px solid var(--border)",
                flexWrap: "wrap",
                animation: "fade-up 0.6s 0.4s ease both",
              }}
            >
              {[
                { num: "50+", label: "Stores Tested" },
                { num: "20", label: "Shopify Plus Projects" },
                { num: "12+", label: "Industries" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "1.375rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.03em",
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

          {/* Right: Inspection Animation */}
          <div
            style={{
              animation: "fade-in 0.8s 0.3s ease both",
            }}
            className="hero-animation"
          >
            <InspectionAnimation />
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .hero-animation {
            order: -1;
          }
        }
      `}</style>
    </section>
  );
}
