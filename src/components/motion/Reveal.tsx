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
  // Reduced-motion users see content immediately — decided at render, not in an effect.
  const [visible, setVisible] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (visible) return;
    const el = ref.current;
    if (!el) return;
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
