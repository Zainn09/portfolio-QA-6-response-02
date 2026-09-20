"use client";

import React, { useState, useEffect } from "react";

const INSPECTION_STEPS = [
  { label: "Checking Cart", status: "scanning" },
  { label: "Checking Responsiveness", status: "scanning" },
  { label: "Checking Product Flow", status: "scanning" },
  { label: "Checking Checkout", status: "scanning" },
  { label: "Checking Mobile Experience", status: "scanning" },
  { label: "Audit Complete", status: "complete" },
];

const ISSUES = [
  { label: "Issues Found", value: "07", type: "total" },
  { label: "Critical", value: "01", type: "critical" },
  { label: "Major", value: "03", type: "major" },
  { label: "Minor", value: "03", type: "minor" },
];

// Sample UI elements to "inspect"
const STORE_ELEMENTS = [
  { label: "Nav", x: 10, y: 8, w: 80, h: 6 },
  { label: "Hero", x: 10, y: 18, w: 50, h: 24 },
  { label: "Product", x: 62, y: 18, w: 28, h: 24 },
  { label: "Cart CTA", x: 10, y: 46, w: 20, h: 8 },
  { label: "Footer", x: 10, y: 60, w: 80, h: 10 },
];

const MARKERS = [
  { x: 65, y: 20, id: "01", severity: "critical" },
  { x: 12, y: 47, id: "02", severity: "major" },
  { x: 80, y: 62, id: "03", severity: "minor" },
];

export function InspectionAnimation() {
  const [step, setStep] = useState(0);
  const [showIssues, setShowIssues] = useState(false);
  const [markersVisible, setMarkersVisible] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [scanPos, setScanPos] = useState(0);

  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanPos((p) => (p >= 100 ? 0 : p + 0.5));
    }, 30);

    const stepTimers: ReturnType<typeof setTimeout>[] = [];

    INSPECTION_STEPS.forEach((_, i) => {
      const t = setTimeout(() => {
        setStep(i);
        if (i > 0) {
          setMarkersVisible((prev) => {
            const next = [...prev];
            if (i - 1 < MARKERS.length && !next.includes(i - 1)) next.push(i - 1);
            return next;
          });
        }
        if (i === INSPECTION_STEPS.length - 1) {
          setIsComplete(true);
          setTimeout(() => setShowIssues(true), 400);
          clearInterval(scanInterval);
        }
      }, i * 900 + 800);
      stepTimers.push(t);
    });

    return () => {
      clearInterval(scanInterval);
      stepTimers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "520px",
        margin: "0 auto",
      }}
    >
      {/* Browser frame */}
      <div
        style={{
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          backgroundColor: "var(--bg-surface)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            padding: "0.625rem 0.875rem",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface-2)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.375rem" }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <div
                key={c}
                style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: c, opacity: 0.8 }}
              />
            ))}
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              height: "22px",
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "0.75rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.625rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "var(--text-tertiary)",
                letterSpacing: "0.04em",
              }}
            >
              shopify-store.myshopify.com
            </span>
          </div>
        </div>

        {/* Store wireframe */}
        <div
          style={{
            position: "relative",
            height: "240px",
            backgroundColor: "var(--bg-surface)",
            overflow: "hidden",
          }}
        >
          {/* Scan line */}
          {!isComplete && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${scanPos}%`,
                height: "2px",
                background: `linear-gradient(90deg, transparent, var(--accent), transparent)`,
                opacity: 0.7,
                zIndex: 5,
                transition: "top 30ms linear",
              }}
            />
          )}

          {/* Wireframe store elements */}
          {STORE_ELEMENTS.map((el) => (
            <div
              key={el.label}
              style={{
                position: "absolute",
                left: `${el.x}%`,
                top: `${el.y}%`,
                width: `${el.w}%`,
                height: `${el.h}%`,
                backgroundColor: "var(--bg-surface-2)",
                borderRadius: "2px",
                border: "1px solid var(--border)",
              }}
            />
          ))}

          {/* Inspection markers */}
          {MARKERS.map((marker, i) => (
            <div
              key={marker.id}
              aria-hidden="true"
              style={{
                position: "absolute",
                left: `${marker.x}%`,
                top: `${marker.y}%`,
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor:
                  marker.severity === "critical"
                    ? "var(--critical)"
                    : marker.severity === "major"
                    ? "var(--major)"
                    : "var(--minor)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-mono)",
                fontSize: "0.5625rem",
                fontWeight: 700,
                zIndex: 10,
                opacity: markersVisible.includes(i) ? 1 : 0,
                transform: markersVisible.includes(i) ? "scale(1)" : "scale(0)",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: `0 0 0 3px ${
                  marker.severity === "critical"
                    ? "rgba(224,82,82,0.25)"
                    : marker.severity === "major"
                    ? "rgba(217,119,6,0.25)"
                    : "rgba(94,98,91,0.2)"
                }`,
              }}
            >
              {marker.id}
            </div>
          ))}

          {/* Complete overlay */}
          {isComplete && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(var(--bg-primary-raw, 245,243,237), 0.6)",
                backdropFilter: "blur(2px)",
                zIndex: 20,
                animation: "fade-in 0.4s ease forwards",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "var(--verified)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 0.5rem",
                    color: "white",
                    fontSize: "1.25rem",
                  }}
                >
                  ✓
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6875rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--verified)",
                  }}
                >
                  Audit Complete
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status log below the browser */}
      <div
        style={{
          marginTop: "1rem",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          backgroundColor: "var(--bg-surface)",
          overflow: "hidden",
        }}
      >
        {/* Log header */}
        <div
          style={{
            padding: "0.5rem 0.875rem",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface-2)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: isComplete ? "var(--verified)" : "var(--accent)",
              animation: isComplete ? "none" : "pulse-dot 1.5s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5625rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
            }}
          >
            QA Terminal
          </span>
        </div>

        <div style={{ padding: "0.75rem" }}>
          {INSPECTION_STEPS.slice(0, step + 1).map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.25rem 0",
                animation: "fade-up 0.3s ease forwards",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.5625rem",
                  color:
                    s.status === "complete"
                      ? "var(--verified)"
                      : i === step && !isComplete
                      ? "var(--accent)"
                      : "var(--text-tertiary)",
                }}
              >
                {s.status === "complete" ? "✓" : i < step ? "✓" : "›"}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.625rem",
                  letterSpacing: "0.06em",
                  color: i < step || isComplete ? "var(--text-secondary)" : "var(--text-primary)",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Issue summary */}
        {showIssues && (
          <div
            style={{
              borderTop: "1px solid var(--border)",
              padding: "0.75rem",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0.5rem",
              animation: "fade-up 0.4s ease forwards",
            }}
          >
            {ISSUES.map((issue) => (
              <div key={issue.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color:
                      issue.type === "critical"
                        ? "var(--critical)"
                        : issue.type === "major"
                        ? "var(--major)"
                        : issue.type === "total"
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                  }}
                >
                  {issue.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                    marginTop: "0.125rem",
                  }}
                >
                  {issue.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
