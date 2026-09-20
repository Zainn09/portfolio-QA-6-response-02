"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface MobileMenuProps {
  open: boolean;
  links: { href: string; label: string }[];
  onClose: () => void;
}

export function MobileMenu({ open, links, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99,
        overflowY: "auto",
        overscrollBehavior: "contain",
        backgroundColor: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
        padding: "calc(var(--nav-height) + 2rem) 1.5rem 2rem",
      }}
    >
      <nav aria-label="Mobile navigation">
        <ul role="list" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.125rem" }}>
          {links.map((link, i) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                style={{
                  display: "block",
                  fontSize: "clamp(1.75rem, 7vw, 2.5rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "var(--text-primary)",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid var(--border)",
                  transition: "color var(--transition-fast)",
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.625rem",
                    color: "var(--text-tertiary)",
                    marginRight: "0.75rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  0{i + 1}
                </span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ marginTop: "2rem" }}>
        <Link
          href="/audit"
          onClick={onClose}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "var(--accent)",
            color: "#000",
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "1rem 1.5rem",
            borderRadius: "var(--radius-sm)",
            width: "100%",
            justifyContent: "center",
          }}
        >
          Get Free Audit
        </Link>
      </div>

      <p
        style={{
          marginTop: "auto",
          fontFamily: "var(--font-mono)",
          fontSize: "0.625rem",
          letterSpacing: "0.1em",
          color: "var(--text-tertiary)",
          textTransform: "uppercase",
        }}
      >
        Everything works until someone tests it.
      </p>
    </div>
  );
}
