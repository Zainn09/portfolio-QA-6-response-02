"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, X, TrendingUp, ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";

interface WorkArchiveProps {
  projects: Project[];
  industries: string[];
  platforms: string[];
}

const SEARCH_SUGGESTIONS = [
  "Checkout",
  "Shopify Plus",
  "Accessibility",
  "Fashion",
  "Mobile",
  "Beauty",
  "Search",
  "Subscription",
  "Furniture",
  "Jewellery",
  "Cross-browser",
  "B2B",
];

const POPULAR_SEARCHES = SEARCH_SUGGESTIONS.slice(0, 6);

export function WorkArchive({ projects, industries, platforms }: WorkArchiveProps) {
  const [search, setSearch] = useState("");
  const [activePlatform, setActivePlatform] = useState<string>("all");
  const [activeIndustry, setActiveIndustry] = useState<string>("all");
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return POPULAR_SEARCHES;
    const pool = Array.from(
      new Set([
        ...SEARCH_SUGGESTIONS,
        ...industries,
        ...platforms,
        ...projects.flatMap((p) => p.testingScope),
      ])
    );
    return pool
      .filter((s) => s.toLowerCase().includes(q) && s.toLowerCase() !== q)
      .slice(0, 7);
  }, [search, industries, platforms, projects]);

  const showDropdown = focused && suggestions.length > 0;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setFocused(false);
        setHighlight(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const applySuggestion = (value: string) => {
    setSearch(value);
    setFocused(false);
    setHighlight(-1);
    inputRef.current?.focus();
  };

  const onSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && showDropdown) {
      e.preventDefault();
      setHighlight((h) => (h + 1) % suggestions.length);
    } else if (e.key === "ArrowUp" && showDropdown) {
      e.preventDefault();
      setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && highlight >= 0 && highlight < suggestions.length) {
      e.preventDefault();
      applySuggestion(suggestions[highlight]);
    } else if (e.key === "Escape") {
      setFocused(false);
      setHighlight(-1);
      inputRef.current?.blur();
    }
  };

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.industry.toLowerCase().includes(search.toLowerCase()) ||
        p.summary.toLowerCase().includes(search.toLowerCase()) ||
        p.testingScope.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchPlatform =
        activePlatform === "all" || p.platform === activePlatform;
      const matchIndustry =
        activeIndustry === "all" || p.industry === activeIndustry;
      return matchSearch && matchPlatform && matchIndustry;
    });
  }, [projects, search, activePlatform, activeIndustry]);

  return (
    <div>
      <style>{`
        .project-card-link {
          display: block;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background-color: var(--bg-surface);
          overflow: hidden;
          text-decoration: none;
          transition: all var(--transition-base);
          animation: fade-up 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) both;
        }
        .project-card-link:hover {
          border-color: var(--border-strong);
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        .nav-link-footer:hover { color: var(--text-primary) !important; }
      `}</style>

      {/* Header */}
      <div
        style={{
          paddingTop: "5rem",
          paddingBottom: "4rem",
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>All Work</p>
          <h1 style={{ maxWidth: "700px", marginBottom: "1.25rem" }}>
            50+ Stores.{" "}
            <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>
              One Obsession: Finding What Breaks.
            </span>
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "540px" }}>
            Every project below represents a real QA engagement — a store tested, issues discovered,
            root causes diagnosed, and resolutions verified.
          </p>

          {/* Search with predefined suggestions */}
          <div ref={wrapRef} style={{ position: "relative", maxWidth: "520px", marginTop: "2rem" }}>
            <div style={{ position: "relative" }}>
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-tertiary)",
                  display: "flex",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                <Search size={18} strokeWidth={2} aria-hidden="true" />
              </span>
              <input
                ref={inputRef}
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setHighlight(-1); }}
                onFocus={() => setFocused(true)}
                onKeyDown={onSearchKeyDown}
                placeholder="Search by store, industry, or testing type..."
                aria-label="Search projects"
                aria-expanded={showDropdown}
                aria-controls="search-suggestions"
                role="combobox"
                aria-autocomplete="list"
                style={{
                  width: "100%",
                  padding: "0.875rem 2.75rem 0.875rem 2.75rem",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9375rem",
                  outline: "none",
                  transition: "border-color 200ms ease, box-shadow 200ms ease",
                  boxShadow: focused ? "0 0 0 3px var(--accent-muted)" : "none",
                  borderColor: focused ? "var(--accent)" : "var(--border-strong)",
                }}
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "var(--bg-surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    transition: "all 200ms ease",
                  }}
                >
                  <X size={14} strokeWidth={2.5} aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Suggestions dropdown */}
            {showDropdown && (
              <div
                id="search-suggestions"
                role="listbox"
                aria-label="Search suggestions"
                className="animate-pop-in"
                style={{
                  position: "absolute",
                  top: "calc(100% + 0.5rem)",
                  left: 0,
                  right: 0,
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-lg)",
                  overflow: "hidden",
                  zIndex: 60,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                    padding: "0.75rem 1rem 0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}
                >
                  <TrendingUp size={12} strokeWidth={2} aria-hidden="true" />
                  {search.trim() ? "Matching suggestions" : "Popular searches"}
                </p>
                <ul role="list" style={{ listStyle: "none", padding: "0 0.5rem 0.5rem" }}>
                  {suggestions.map((s, i) => (
                    <li key={s}>
                      <button
                        role="option"
                        aria-selected={highlight === i}
                        onClick={() => applySuggestion(s)}
                        onMouseEnter={() => setHighlight(i)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          padding: "0.625rem 0.75rem",
                          backgroundColor:
                            highlight === i ? "var(--accent-muted)" : "transparent",
                          border: "none",
                          borderRadius: "var(--radius-sm)",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          color:
                            highlight === i
                              ? "var(--text-primary)"
                              : "var(--text-secondary)",
                          fontWeight: highlight === i ? 600 : 400,
                          transition: "background-color 150ms ease",
                          textAlign: "left",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                          <Search size={14} strokeWidth={2} aria-hidden="true" style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
                          {s}
                        </span>
                        <ArrowRight
                          size={14}
                          strokeWidth={2}
                          aria-hidden="true"
                          style={{
                            color: "var(--accent)",
                            opacity: highlight === i ? 1 : 0,
                            transform: highlight === i ? "translateX(0)" : "translateX(-4px)",
                            transition: "all 150ms ease",
                            flexShrink: 0,
                          }}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick suggestion chips */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginTop: "0.875rem",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                }}
              >
                Try:
              </span>
              {POPULAR_SEARCHES.slice(0, 4).map((s) => (
                <button
                  key={s}
                  onClick={() => applySuggestion(s)}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "999px",
                    border: "1px solid var(--border)",
                    backgroundColor: search === s ? "var(--accent-muted)" : "transparent",
                    borderColor: search === s ? "var(--accent)" : "var(--border)",
                    color: search === s ? "var(--text-primary)" : "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-primary)", position: "sticky", top: "var(--nav-height)", zIndex: 50 }}>
        <div className="container">
          <div style={{ display: "flex", gap: "0", overflowX: "auto", padding: "0.75rem 0" }} className="no-scrollbar">
            <div style={{ display: "flex", gap: "0.375rem", alignItems: "center", paddingRight: "1.5rem", borderRight: "1px solid var(--border)", marginRight: "1.5rem", flexShrink: 0 }}>
              <FilterChip label="All Platforms" active={activePlatform === "all"} onClick={() => setActivePlatform("all")} />
              {platforms.map((p) => (
                <FilterChip key={p} label={p} active={activePlatform === p} onClick={() => setActivePlatform(p)} />
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
              <FilterChip label="All Industries" active={activeIndustry === "all"} onClick={() => setActiveIndustry("all")} />
              {industries.map((ind) => (
                <FilterChip key={ind} label={ind} active={activeIndustry === ind} onClick={() => setActiveIndustry(ind)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "0.5rem" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
          {filtered.length} project{filtered.length !== 1 ? "s" : ""} found{search && ` for "${search}"`}
        </p>
      </div>

      {/* Project grid */}
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "6rem" }}>
        {filtered.length === 0 ? (
          <EmptyState onReset={() => { setSearch(""); setActivePlatform("all"); setActiveIndustry("all"); }} />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.375rem 0.75rem",
        borderRadius: "2px",
        border: "1px solid",
        borderColor: active ? "var(--accent)" : "var(--border)",
        backgroundColor: active ? "var(--accent-muted)" : "transparent",
        color: active ? "var(--text-primary)" : "var(--text-tertiary)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.5625rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all var(--transition-fast)",
        whiteSpace: "nowrap",
        fontWeight: active ? 700 : 400,
      }}
    >
      {label}
    </button>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const primaryIssue = project.issues[0];

  return (
    <Link href={`/work/${project.slug}`} className="project-card-link" style={{ animationDelay: `${Math.min(index, 11) * 45}ms` }}>
      {/* Visual placeholder */}
      <div style={{ height: "160px", backgroundColor: "var(--bg-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ width: "80%", display: "flex", flexDirection: "column", gap: "0.5rem", opacity: 0.5 }}>
          <div style={{ height: "6px", backgroundColor: "var(--border-strong)", borderRadius: "2px", width: "40%" }} />
          <div style={{ height: "10px", backgroundColor: "var(--border-strong)", borderRadius: "2px" }} />
          <div style={{ height: "10px", backgroundColor: "var(--border)", borderRadius: "2px", width: "80%" }} />
          <div style={{ height: "20px", backgroundColor: "var(--accent)", borderRadius: "2px", width: "40%", marginTop: "0.25rem", opacity: 0.4 }} />
        </div>
        <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)", padding: "0.2rem 0.5rem", borderRadius: "2px", fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
          {project.industry}
        </div>
      </div>

      <div style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", marginBottom: "0.875rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid var(--border)", padding: "0.2rem 0.5rem", borderRadius: "2px", color: "var(--text-tertiary)" }}>
            {project.platform}
          </span>
          {primaryIssue && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.2rem 0.5rem", borderRadius: "2px", color: primaryIssue.severity === "critical" ? "var(--critical)" : primaryIssue.severity === "major" ? "var(--major)" : "var(--minor)", border: "1px solid currentColor" }}>
              {primaryIssue.severity}
            </span>
          )}
        </div>

        <h3 style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: "0.5rem", lineHeight: 1.3 }}>
          {project.title}
        </h3>

        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {project.summary}
        </p>

        <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {project.testingScope.slice(0, 3).map((s) => (
            <span key={s} style={{ fontFamily: "var(--font-mono)", fontSize: "0.4375rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", backgroundColor: "var(--bg-surface-2)", padding: "0.1875rem 0.5rem", borderRadius: "2px" }}>
              {s}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.875rem", borderTop: "1px solid var(--border)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--verified)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <span>✓</span> Verified
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
            View Case Study →
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "6rem 2rem", border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-md)" }}>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.75rem" }}>No Results</p>
      <h3 style={{ marginBottom: "0.75rem", fontSize: "1.5rem" }}>No stores found.</h3>
      <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Try another category or search term.</p>
      <button onClick={onReset} style={{ padding: "0.75rem 1.5rem", backgroundColor: "var(--text-primary)", color: "var(--bg-primary)", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}>
        Clear Filters
      </button>
    </div>
  );
}
