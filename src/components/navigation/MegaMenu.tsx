"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bug,
  Compass,
  Eye,
  Hammer,
  Map,
  ShieldCheck,
  Store,
  ShoppingBag,
  Sparkles,
  Wrench,
  TrendingUp,
} from "lucide-react";
import { getFeaturedProjects } from "@/data/projects";
import { articleStubs } from "@/data/articles";

interface MegaMenuProps {
  open: string | null;
  onEnterPanel: () => void;
  onLeavePanel: () => void;
  onNavigate: () => void;
}

const EXPERTISE_ROWS = [
  {
    icon: Store,
    label: "Storefront",
    desc: "Everything the shopper sees and touches.",
    samples: "Product pages · Collections · Search",
  },
  {
    icon: ShoppingBag,
    label: "Commerce",
    desc: "Where money changes hands.",
    samples: "Checkout · Discounts · Shipping",
  },
  {
    icon: Sparkles,
    label: "Experience",
    desc: "How it feels on every device.",
    samples: "Mobile · Accessibility · Performance",
  },
  {
    icon: Wrench,
    label: "Technical",
    desc: "Under the hood, across the matrix.",
    samples: "Cross-browser · Regression · Apps",
  },
];

const PROCESS_STEPS = [
  { num: "01", label: "Understand", headline: "Know the store before touching it.", icon: Eye },
  { num: "02", label: "Map", headline: "Build the test surface.", icon: Map },
  { num: "03", label: "Explore", headline: "Walk through it like a real user.", icon: Compass },
  { num: "04", label: "Break", headline: "Systematically push every boundary.", icon: Hammer },
  { num: "05", label: "Reproduce", headline: "Document exactly how it breaks.", icon: Bug },
  { num: "06", label: "Resolve", headline: "Work with the team to fix it right.", icon: Wrench },
  { num: "07", label: "Verify", headline: "Confirm the fix. Then re-test everything.", icon: ShieldCheck },
];

const ABOUT_STATS = [
  { value: "100+", label: "Stores Tested" },
  { value: "20", label: "Shopify Plus Projects" },
  { value: "12+", label: "Industries Covered" },
  { value: "100%", label: "Verified Resolutions" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Intro({
  eyebrow,
  title,
  desc,
  cta,
  href,
  onNavigate,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  onNavigate: () => void;
}) {
  return (
    <div className="mega-intro">
      <p className="mega-eyebrow">{eyebrow}</p>
      <p className="mega-title">{title}</p>
      <p className="mega-desc">{desc}</p>
      <Link
        href={href}
        onClick={onNavigate}
        className="mega-cta"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.6875rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "var(--text-primary)",
        }}
      >
        {cta}
        <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
      </Link>
    </div>
  );
}

export function MegaMenu({ open, onEnterPanel, onLeavePanel, onNavigate }: MegaMenuProps) {
  if (!open) return null;

  const featured = getFeaturedProjects().slice(0, 3);
  const latestPosts = [...articleStubs]
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, 3);

  return (
    <div
      role="region"
      aria-label={`${open} submenu`}
      onMouseEnter={onEnterPanel}
      onMouseLeave={onLeavePanel}
      className="mega-panel hidden md:block"
    >
      <div className="mega-accent-bar" aria-hidden="true" />
      <div className="container mega-inner">
        {open === "work" && (
          <>
            <Intro
              eyebrow="Case Studies"
              title="Stores I've broken, so customers never have to."
              desc="Real Shopify audits with documented issues, root causes, and verified fixes."
              cta="Browse all projects"
              href="/work"
              onNavigate={onNavigate}
            />
            <div className="mega-cards-3">
              {featured.map((p, i) => {
                const hasCritical = p.issues.some((issue) => issue.severity === "critical");
                return (
                  <Link
                    key={p.id}
                    href={`/work/${p.slug}`}
                    onClick={onNavigate}
                    className="mega-card mega-rise"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.thumbnail}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", objectPosition: "top", display: "block", borderRadius: "8px", border: "1px solid var(--border)", marginBottom: "0.75rem" }}
                    />
                    <span className="mega-card-top">
                      <span className="mega-num">
                        {String(p.featuredOrder + 1).padStart(2, "0")}
                      </span>
                      {hasCritical && (
                        <span className="mega-flag">
                          <span className="mega-dot" aria-hidden="true" />
                          Critical find
                        </span>
                      )}
                    </span>
                    <span className="mega-card-title" style={{ marginBottom: "0.625rem" }}>{p.title}</span>
                    <span className="mega-meta">
                      {p.industry} · {p.platform}
                    </span>
                    <span className="mega-card-foot">
                      <span className="mega-meta">View case study</span>
                      <ArrowUpRight size={14} className="mega-arrow" aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {open === "expertise" && (
          <>
            <Intro
              eyebrow="Coverage"
              title="Every layer of your store, tested like a user."
              desc="Four focus areas that stack into one complete audit."
              cta="Explore expertise"
              href="/#expertise"
              onNavigate={onNavigate}
            />
            <div className="mega-rows-2">
              {EXPERTISE_ROWS.map((row, i) => {
                const Icon = row.icon;
                return (
                  <Link
                    key={row.label}
                    href="/#expertise"
                    onClick={onNavigate}
                    className="mega-row mega-rise"
                    style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.875rem", animationDelay: `${i * 60}ms` }}
                  >
                    <span className="mega-row-icon" aria-hidden="true" style={{ width: "32px", height: "32px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)", backgroundColor: "var(--accent-muted)", border: "1px solid var(--accent)", color: "var(--text-primary)" }}>
                      <Icon size={16} strokeWidth={2} />
                    </span>
                    <span className="mega-row-body" style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: 0, flex: 1 }}>
                      <span className="mega-row-head">
                        <span className="mega-card-title">{row.label}</span>
                        <ArrowUpRight size={13} className="mega-arrow" aria-hidden="true" />
                      </span>
                      <span className="mega-desc-sm">{row.desc}</span>
                      <span className="mega-meta">{row.samples}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {open === "about" && (
          <>
            <Intro
              eyebrow="The Human"
              title="A specialist, not a checklist."
              desc="Shopify QA is all I do — manual, methodical, and conversion-obsessed."
              cta="More about me"
              href="/about"
              onNavigate={onNavigate}
            />
            <div className="mega-stats">
              {ABOUT_STATS.map((s, i) => (
                <div
                  key={s.label}
                  className="mega-stat mega-rise"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="mega-stat-value">{s.value}</span>
                  <span className="mega-meta">{s.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {open === "process" && (
          <>
            <Intro
              eyebrow="Method"
              title="Seven steps. Zero guesswork."
              desc="The same battle-tested sequence behind every audit."
              cta="See the process"
              href="/#process"
              onNavigate={onNavigate}
            />
            <div className="mega-steps">
              {PROCESS_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <Link
                    key={step.num}
                    href="/#process"
                    onClick={onNavigate}
                    className="mega-step mega-rise"
                    style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "1rem", padding: "0.625rem 0.875rem", animationDelay: `${i * 45}ms` }}
                  >
                    <span className="mega-step-icon" aria-hidden="true" style={{ width: "28px", height: "28px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)", backgroundColor: "var(--accent-muted)", border: "1px solid var(--accent)", color: "var(--text-primary)" }}>
                      <Icon size={14} strokeWidth={2} />
                    </span>
                    <span className="mega-step-body" style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: 0, flex: 1 }}>
                      <span className="mega-step-head">
                        <span className="mega-num">{step.num}</span>
                        <span className="mega-card-title">{step.label}</span>
                      </span>
                      <span className="mega-desc-sm">{step.headline}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {open === "blogs" && (
          <>
            <Intro
              eyebrow="Insights"
              title="Notes from the breaking lab."
              desc="Field guides, checklists, and honest takes on QA in 2026."
              cta="All articles"
              href="/blogs"
              onNavigate={onNavigate}
            />
            <div className="mega-cards-3">
              {latestPosts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blogs/${post.slug}`}
                  onClick={onNavigate}
                  className="mega-card mega-rise"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.heroImage} alt="" loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", objectPosition: "top", display: "block", borderRadius: "8px", border: "1px solid var(--border)", marginBottom: "0.75rem" }} />
                  <span className="mega-card-top">
                    <span className="mega-meta">{post.category}</span>
                    {post.articleType === "case-study" && (
                      <span className="mega-flag">
                        <TrendingUp size={11} strokeWidth={2.5} aria-hidden="true" />
                        From the field
                      </span>
                    )}
                  </span>
                  <span className="mega-card-title mega-clamp">{post.title}</span>
                  <span className="mega-card-foot">
                    <span className="mega-meta">
                      {formatDate(post.publishedAt)} · {post.readingTime} min read
                    </span>
                    <ArrowUpRight size={14} className="mega-arrow" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .mega-panel {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
          animation: mega-in 260ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .mega-accent-bar {
          height: 2px;
          background: linear-gradient(90deg, var(--accent) 0%, var(--accent) 22%, transparent 70%);
        }
        .mega-inner {
          display: grid;
          grid-template-columns: 270px 1fr;
          gap: 2.5rem;
          padding-top: 2rem;
          padding-bottom: 2.5rem;
        }
        .mega-intro {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }
        .mega-eyebrow {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #000;
          background-color: var(--accent);
          padding: 0.25rem 0.625rem;
          border-radius: var(--radius-sm);
          margin-bottom: 1rem;
        }
        .mega-title {
          font-size: 1.375rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.25;
          color: var(--text-primary);
          margin-bottom: 0.625rem;
        }
        .mega-desc {
          font-size: 0.875rem;
          line-height: 1.65;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
        }
        .mega-desc-sm {
          font-size: 0.8125rem;
          line-height: 1.55;
          color: var(--text-secondary);
        }
        .mega-cta {
          border-bottom: 1px solid var(--border-strong);
          padding-bottom: 0.25rem;
          transition: color 150ms ease, border-color 150ms ease;
        }
        .mega-cta:hover {
          color: var(--accent);
          border-color: var(--accent);
        }
        .mega-cards-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.875rem;
          align-content: center;
        }
        .mega-rows-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.875rem;
          align-content: center;
        }
        .mega-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.875rem;
          align-content: center;
        }
        .mega-steps {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.875rem 2.25rem;
          align-content: center;
        }
        .mega-card,
        .mega-row,
        .mega-step {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem 1.125rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background-color: var(--bg-primary);
          transition: border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
        }
        .mega-row {
          display: flex !important;
          flex-direction: row !important;
          align-items: center;
          gap: 0.875rem;
        }
        .mega-step {
          display: flex !important;
          flex-direction: row !important;
          align-items: center;
          gap: 1rem;
          padding: 0.625rem 0.875rem;
        }
        .mega-step-icon {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          background-color: var(--accent-muted);
          border: 1px solid var(--accent);
          color: var(--text-primary);
        }
        .mega-step-head {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        a.mega-card:hover,
        a.mega-row:hover,
        a.mega-step:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
        .mega-row-icon {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          background-color: var(--accent-muted);
          border: 1px solid var(--accent);
          color: var(--text-primary);
        }
        .mega-row-body {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }
        .mega-row-head {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 0.5rem;
        }
        .mega-step-body {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }
        .mega-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .mega-card-title {
          font-size: 0.9375rem;
          font-weight: 700;
          line-height: 1.4;
          color: var(--text-primary);
        }
        .mega-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .mega-meta {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-tertiary);
        }
        .mega-num {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #000;
          background-color: var(--accent);
          padding: 0.125rem 0.4375rem;
          border-radius: 2px;
        }
        .mega-flag {
          display: inline-flex;
          align-items: center;
          gap: 0.3125rem;
          font-family: var(--font-mono);
          font-size: 0.5625rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--critical);
          white-space: nowrap;
        }
        .mega-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--critical);
          animation: pulse-dot 1.8s ease-in-out infinite;
        }
        .mega-card-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-top: auto;
          padding-top: 0.5rem;
        }
        .mega-arrow {
          color: var(--accent);
          opacity: 0;
          transform: translate(-3px, 3px);
          transition: opacity 180ms ease, transform 180ms ease;
          flex-shrink: 0;
        }
        a:hover .mega-arrow {
          opacity: 1;
          transform: none;
        }
        .mega-stat {
          padding: 1.125rem 1.25rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background-color: var(--bg-primary);
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .mega-stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          line-height: 1;
        }
        .mega-rise {
          animation: mega-rise 380ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
        }
        @keyframes mega-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes mega-rise {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .mega-panel,
          .mega-rise {
            animation: none;
          }
          .mega-dot {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
