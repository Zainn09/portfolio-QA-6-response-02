"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/#expertise", label: "Expertise" },
  { href: "/about", label: "About" },
  { href: "/#process", label: "Process" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        aria-label="Main navigation"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: scrolled ? "60px" : "var(--nav-height)",
          backgroundColor: scrolled
            ? "rgba(var(--bg-primary-raw, 245,243,237), 0.95)"
            : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
          transition: "all var(--transition-base)",
        }}
      >
        <div
          className="container"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="QA Specialist — Home"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.125rem",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
                lineHeight: 1,
              }}
            >
              QA
            </span>
            <span
              style={{
                fontSize: "0.9375rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                lineHeight: 1,
              }}
            >
              SPECIALIST
            </span>
          </Link>

          {/* Desktop links */}
          <ul
            role="list"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              listStyle: "none",
            }}
            className="hidden md:flex"
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="nav-link"
                  style={{
                    color:
                      pathname === link.href
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                    fontWeight: pathname === link.href ? 600 : 500,
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
            <ThemeToggle />
            <Link
              href="/audit"
              className="btn-audit hidden md:inline-flex"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 700,
                backgroundColor: "var(--accent)",
                color: "#000",
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-sm)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                transition: "all var(--transition-fast)",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#000",
                  animation: "pulse-dot 2s ease-in-out infinite",
                }}
              />
              Free Audit
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="md:hidden"
              style={{
                background: "none",
                border: "1px solid var(--border-strong)",
                color: "var(--text-primary)",
                padding: "0.375rem 0.625rem",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu open={menuOpen} links={navLinks} onClose={() => setMenuOpen(false)} />
    </>
  );
}
