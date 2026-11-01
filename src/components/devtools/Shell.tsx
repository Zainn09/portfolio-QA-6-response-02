"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Inbox,
  FolderKanban,
  Activity,
  AlertTriangle,
  ScrollText,
  HeartPulse,
  BarChart3,
  Settings,
  ChevronsLeft,
  Menu,
  ExternalLink,
  LogOut,
} from "lucide-react";

const NAV: { group: string; items: { href: string; label: string; icon: React.ComponentType<{ size?: number | string; strokeWidth?: number | string }> }[] }[] = [
  {
    group: "Monitor",
    items: [
      { href: "/devtools", label: "Overview", icon: LayoutDashboard },
      { href: "/devtools/api", label: "API monitor", icon: Activity },
      { href: "/devtools/errors", label: "Errors", icon: AlertTriangle },
      { href: "/devtools/logs", label: "Activity log", icon: ScrollText },
      { href: "/devtools/health", label: "System health", icon: HeartPulse },
    ],
  },
  {
    group: "Data",
    items: [
      { href: "/devtools/database", label: "Database", icon: Database },
      { href: "/devtools/forms", label: "Submissions", icon: Inbox },
      { href: "/devtools/projects", label: "Projects", icon: FolderKanban },
      { href: "/devtools/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    group: "System",
    items: [{ href: "/devtools/settings", label: "Settings", icon: Settings }],
  },
];

const TITLES: Record<string, string> = {
  "/devtools": "Overview",
  "/devtools/database": "Database explorer",
  "/devtools/forms": "Submissions",
  "/devtools/projects": "Projects",
  "/devtools/api": "API monitor",
  "/devtools/errors": "Application errors",
  "/devtools/logs": "Activity log",
  "/devtools/health": "System health",
  "/devtools/analytics": "Analytics",
  "/devtools/settings": "Settings",
};

export function Shell({
  userEmail,
  userName,
  configured,
  children,
}: {
  userEmail: string | null;
  userName: string | null;
  configured: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isLogin = pathname === "/devtools/login" || pathname.startsWith("/devtools/login/");
  const title = TITLES[pathname] ?? "DevTools";
  const isActive = (href: string) => (href === "/devtools" ? pathname === "/devtools" : pathname.startsWith(href));

  // The login page renders standalone — no sidebar, no topbar.
  if (isLogin) {
    return (
      <div data-devtools>{children}</div>
    );
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.push("/devtools/login");
      router.refresh();
    }
  };

  const nav = (
    <nav className="dt-nav" aria-label="DevTools sections">
      {NAV.map((group) => (
        <div key={group.group}>
          <div className="dt-nav-group">
            <span>{group.group}</span>
          </div>
          {group.items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dt-nav-item ${isActive(item.href) ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                <Icon size={15} strokeWidth={1.8} />
                <span className="dt-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  const brand = (
    <Link href="/devtools" className="dt-brand" aria-label="DevTools overview">
      <span className="dt-brand-mark" aria-hidden>
        Q
      </span>
      <span className="dt-brand-text">
        DevTools
        <small>QA control center</small>
      </span>
    </Link>
  );

  const footer = (
    <div className="dt-sidebar-footer">
      <span className={`dt-dot ${configured ? "ok" : "dim"}`} aria-hidden />
      <span className="dt-sidebar-footer-text">{configured ? "Sessions secured" : "Dev mode"}</span>
    </div>
  );

  return (
    <div data-devtools className="dt-shell">
      {mobileOpen && <div className="dt-mobile-backdrop" onClick={() => setMobileOpen(false)} aria-hidden />}
      <aside className={`dt-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        {brand}
        {nav}
        {footer}
      </aside>

      <div className="dt-main">
        <header className="dt-topbar">
          <button
            className="dt-btn ghost sm"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((v) => !v)}
            style={{ display: "none" }}
            data-mobile-toggle
          >
            <Menu size={16} />
          </button>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, minWidth: 0 }}>
            <span className="dt-topbar-title">{title}</span>
            <span className="dt-breadcrumb">
              devtools{pathname !== "/devtools" ? ` / ${pathname.replace("/devtools/", "")}` : ""}
            </span>
          </div>
          <div className="dt-topbar-spacer" />
          {!configured && (
            <span className="dt-badge warn">dev — set ADMIN_SESSION_SECRET for production</span>
          )}
          <Link href="/" className="dt-btn ghost sm">
            <ExternalLink size={13} /> Site
          </Link>
          {userEmail && (
            <span className="dt-topbar-user" title={userName ?? userEmail}>
              <span className="dt-dot" aria-hidden />
              {userEmail}
            </span>
          )}
          <button className="dt-btn ghost sm" onClick={handleLogout} disabled={loggingOut} aria-label="Sign out">
            <LogOut size={13} /> {loggingOut ? "…" : "Sign out"}
          </button>
          <button className="dt-btn ghost sm" onClick={() => setCollapsed((v) => !v)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <ChevronsLeft size={15} style={{ transform: collapsed ? "rotate(180deg)" : undefined, transition: "transform 0.15s ease" }} />
          </button>
        </header>

        <main className="dt-content">{children}</main>
      </div>
    </div>
  );
}
