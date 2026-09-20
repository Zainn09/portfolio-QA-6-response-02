"use client";

import React, { useEffect, useRef, useState } from "react";

const STATS = [
  { target: 50, suffix: "+", label: "Stores Tested" },
  { target: 20, suffix: "", label: "Shopify Plus Projects" },
  { target: 12, suffix: "+", label: "Industries Covered" },
  { target: 100, suffix: "%", label: "Verified Resolutions" },
];

const DURATION_MS = 1400;

function useCountUp(target: number, start: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf);
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const elapsed = now - t0;
      const t = Math.min(elapsed / DURATION_MS, 1);
      // easeOutExpo — fast start, silky settle
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target]);

  return value;
}

function StatCard({
  target,
  suffix,
  label,
  start,
  index,
}: {
  target: number;
  suffix: string;
  label: string;
  start: boolean;
  index: number;
}) {
  const value = useCountUp(target, start);

  return (
    <div
      style={{
        padding: "1.75rem",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        backgroundColor: "var(--bg-surface)",
        opacity: start ? 1 : 0,
        transform: start ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.6s ease ${index * 90}ms, transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) ${index * 90}ms, border-color 300ms ease, box-shadow 300ms ease`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <div
        aria-label={`${target}${suffix} ${label}`}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "2rem",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "var(--text-primary)",
          marginBottom: "0.25rem",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
        {suffix}
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
        {label}
      </div>
    </div>
  );
}

export function AboutStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  // Numbers begin counting the moment the section loads into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStart(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ paddingTop: "4rem", borderTop: "1px solid var(--border)", marginBottom: "4rem" }}>
      <p className="eyebrow" style={{ marginBottom: "1.5rem" }}>By the Numbers</p>
      <div
        ref={ref}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "1.5rem" }}
      >
        {STATS.map((stat, i) => (
          <StatCard key={stat.label} {...stat} start={start} index={i} />
        ))}
      </div>
    </div>
  );
}
