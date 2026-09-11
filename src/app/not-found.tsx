import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Something Failed the Test",
  description: "This page doesn't exist. Let's get you back to a verified page.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-secondary)",
        padding: "2rem",
        paddingTop: "var(--nav-height)",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "520px" }}>
        {/* Status badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "2rem",
            padding: "0.5rem 1rem",
            border: "1px solid var(--critical)",
            borderRadius: "2px",
            backgroundColor: "rgba(224, 82, 82, 0.06)",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "var(--critical)",
              animation: "pulse-dot 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.625rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--critical)",
              fontWeight: 700,
            }}
          >
            Test Failed — 404
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(2.5rem, 8vw, 5rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          404
        </h1>

        <h2
          style={{
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            marginBottom: "1rem",
          }}
        >
          Something failed the test.
        </h2>

        <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem", lineHeight: 1.75 }}>
          This page doesn&apos;t exist — or it never passed inspection.
        </p>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            letterSpacing: "0.08em",
            color: "var(--text-tertiary)",
            marginBottom: "2.5rem",
          }}
        >
          Let&apos;s get you back to a verified page.
        </p>

        {/* Diagnostic card */}
        <div
          style={{
            padding: "1.25rem",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--bg-surface)",
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
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
            Diagnostic Report
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {[
              { label: "Page", value: "Not Found", status: "failed" },
              { label: "Route", value: "Unresolved", status: "failed" },
              { label: "Redirect", value: "Available", status: "verified" },
            ].map((item) => (
              <div
                key={item.label}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: item.status === "verified" ? "var(--verified)" : "var(--critical)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  {item.status === "verified" ? "✓" : "✗"} {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/work"
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
            Back to Work →
          </Link>
          <Link
            href="/"
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
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
