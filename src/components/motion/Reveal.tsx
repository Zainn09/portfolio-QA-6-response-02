"use client";

import React, { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  /** Transition delay in ms — use for stagger effects */
  delay?: number;
  /** Vertical travel distance in px */
  y?: number;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

/**
 * Butter-smooth scroll reveal wrapper.
 * Fades + slides content in the first time it enters the viewport.
 * Respects prefers-reduced-motion (renders visible immediately).
 */
export function Reveal({ children, delay = 0, y = 28, className, style, id }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Must start false to match the server render — reading matchMedia during
  // render causes a hydration mismatch, which can leave nodes stranded
  // mid-transition (content stuck invisible or offset).
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    // Reveal immediately (on the next frame, so the transition still plays and
    // we never setState synchronously during the effect) when motion is
    // reduced, when IntersectionObserver is unavailable, or when the element is
    // already on screen at mount — otherwise content above the fold, or
    // restored on a refresh partway down the page, would sit at opacity 0
    // waiting for a scroll that already happened.
    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rect = el.getBoundingClientRect();
    const alreadyOnScreen = rect.top < window.innerHeight && rect.bottom > 0;

    if (prefersReduced || typeof IntersectionObserver === "undefined" || alreadyOnScreen) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div
      ref={ref}
      id={id}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
        willChange: visible ? "auto" : "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
