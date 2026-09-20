"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { MegaMenu } from "./MegaMenu";

const navLinks = [
  { href: "/work", label: "Work", menu: "work" },
  { href: "/#expertise", label: "Expertise", menu: "expertise" },
  { href: "/about", label: "About", menu: "about" },
  { href: "/#process", label: "Process", menu: "process" },
  { href: "/blogs", label: "Blogs", menu: "blogs" },
  { href: "/contact", label: "Contact", menu: null },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const clearMegaTimers = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  const closeMega = () => {
    clearMegaTimers();
    setOpenMenu(null);
  };

  // Hover intent: slight delay opening, grace period closing — no flicker
  const scheduleOpen = (menu: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
    if (openMenu === menu) return;
    if (openTimer.current) window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setOpenMenu(menu), 110);
  };

  const scheduleClose = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    openTimer.current = null;
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 160);
  };

  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => clearMegaTimers, []);

  const solid = scrolled || openMenu !== null;

  const handleNavKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeMega();
  };

  const handleNavBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeMega();
  };

  return (
    <>
      <nav
        aria-label="Main navigation"
        onKeyDown={handleNavKeyDown}
        onBlur={handleNavBlur}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: scrolled ? "60px" : "var(--nav-height)",
          backgroundColor: solid
            ? "rgba(var(--bg-primary-raw, 245,243,237), 0.95)"
            : "transparent",
          backdropFilter: solid ? "blur(12px)" : "none",
          borderBottom: solid ? "1px solid var(--border)" : "1px solid transparent",
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
            onMouseLeave={scheduleClose}
            style={{
              alignItems: "center",
              gap: "2rem",
              listStyle: "none",
            }}
            className="hidden lg:flex"
          >
            {navLinks.map((link) => {
              const isOpen = openMenu === link.menu;
              const isActive = pathname === link.href;
              return (
                <li
                  key={link.href}
                  onMouseEnter={() => (link.menu ? scheduleOpen(link.menu) : closeMega())}
                >
                  <Link
                    href={link.href}
                    className="nav-link"
                    aria-haspopup={link.menu ? "true" : undefined}
                    aria-expanded={link.menu ? isOpen : undefined}
                    onFocus={() => (link.menu ? setOpenMenu(link.menu) : closeMega())}
                    onClick={closeMega}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      color:
                        isActive || isOpen
                          ? "var(--text-primary)"
                          : "var(--text-secondary)",
                      fontWeight: isActive ? 600 : 500,
                    }}
                  >
                    {link.label}
                    {link.menu && (
                      <ChevronDown
                        size={12}
                        strokeWidth={2.5}
                        aria-hidden="true"
                        style={{
                          transition: "transform 200ms ease",
                          transform: isOpen ? "rotate(180deg)" : "none",
                          color: isOpen ? "var(--accent)" : "var(--text-tertiary)",
                        }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
            <ThemeToggle />
            <Link
              href="/audit"
              className="btn-audit hidden lg:inline-flex"
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
              className="lg:hidden"
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
        <MegaMenu
          open={openMenu}
          onEnterPanel={cancelClose}
          onLeavePanel={scheduleClose}
          onNavigate={closeMega}
        />
      </nav>

      <MobileMenu open={menuOpen} links={navLinks} onClose={() => setMenuOpen(false)} />
    </>
  );
}
