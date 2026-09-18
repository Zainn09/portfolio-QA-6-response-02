"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { PORTRAIT_EVIDENCE } from "@/data/evidence-aspects";
import type { Project } from "@/data/projects";

interface Props {
  project: Project;
  related: Project[];
}

function SeverityBadge({ severity }: { severity: "critical" | "major" | "minor" }) {
  const config = {
    critical: { color: "var(--critical)", label: "Critical" },
    major: { color: "var(--major)", label: "Major" },
    minor: { color: "var(--minor)", label: "Minor" },
  };
  const { color, label } = config[severity];
  return (
    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color, border: `1px solid ${color}`, padding: "0.25rem 0.625rem", borderRadius: "2px", fontWeight: 600 }}>
      {label}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.625rem" }}>
      <span style={{ width: "20px", height: "1px", backgroundColor: "var(--text-tertiary)", display: "inline-block" }} />
      {children}
    </p>
  );
}

export function CaseStudyPage({ project, related }: Props) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  let evidenceNo = 0;
  const numberedChunks = distributeEvidence(project.gallery, EVIDENCE_LABELS.length).map((chunk) =>
    chunk.map((src) => ({ src, no: ++evidenceNo }))
  );

  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <style>{`
        .cs-related-link { display: block; padding: 1.25rem; border: 1px solid var(--border); border-radius: var(--radius-sm); background-color: var(--bg-surface); text-decoration: none; transition: all var(--transition-fast); }
        .cs-related-link:hover { border-color: var(--accent); background-color: var(--accent-muted); }
        .cs-audit-link { display: block; padding: 1.25rem; background-color: var(--accent); color: #000; border-radius: var(--radius-sm); text-align: center; font-weight: 700; font-size: 0.875rem; letter-spacing: 0.02em; transition: all var(--transition-fast); }
        .cs-audit-link:hover { background-color: var(--accent-hover); }
        .breadcrumb-link:hover { color: var(--text-primary) !important; }
      `}</style>

      {/* Hero */}
      <header style={{ paddingTop: "5rem", paddingBottom: "4rem", borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: "2rem" }}>
            <ol role="list" style={{ listStyle: "none", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
              <li><Link href="/" className="breadcrumb-link" style={{ color: "var(--text-tertiary)" }}>Home</Link></li>
              <li aria-hidden="true">→</li>
              <li><Link href="/work" className="breadcrumb-link" style={{ color: "var(--text-tertiary)" }}>Work</Link></li>
              <li aria-hidden="true">→</li>
              <li aria-current="page" style={{ color: "var(--text-secondary)" }}>{project.title}</li>
            </ol>
          </nav>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "3rem", alignItems: "end" }} className="case-hero-grid">
            <div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {[project.platform, project.industry, ...project.testingScope.slice(0, 2)].map((tag) => (
                  <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid var(--border)", padding: "0.25rem 0.625rem", borderRadius: "2px", color: "var(--text-secondary)" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <h1 style={{ marginBottom: "1.25rem", fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)" }}>{project.title}</h1>
              <p style={{ color: "var(--text-secondary)", maxWidth: "600px", fontSize: "1.0625rem" }}>{project.summary}</p>
            </div>

            {/* Status */}
            <div style={{ padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface)", minWidth: "180px" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.75rem" }}>Project Status</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--verified)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--verified)", fontWeight: 700 }}>Verified</span>
              </div>
              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                {[{ label: "Issues", value: String(project.issues.length) }, { label: "Scope", value: project.testingScope.length + " areas" }].map((s) => (
                  <div key={s.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>{s.label}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-primary)", fontWeight: 700 }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Personal note — deliberately the first thing on the page */}
      {project.brandIntro && (
        <div className="container" style={{ paddingTop: "2.5rem" }}>
          <Reveal>
            <div style={{ maxWidth: "62rem", borderLeft: "3px solid var(--accent)", paddingLeft: "1.5rem", paddingTop: "0.25rem", paddingBottom: "0.25rem" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#000", backgroundColor: "var(--accent)", display: "inline-block", padding: "0.25rem 0.625rem", borderRadius: "var(--radius-sm)", fontWeight: 700, marginBottom: "1.25rem" }}>A Personal Note</p>
              <p style={{ fontSize: "1.375rem", lineHeight: 1.75, color: "var(--text-primary)", fontWeight: 500 }}>
                {project.brandIntro}
              </p>
              <p style={{ marginTop: "1.25rem", fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                — Written personally, before a single screen of this revamp was touched
              </p>
            </div>
          </Reveal>
        </div>
      )}

      {/* Hero evidence capture (real audits only — samples have no gallery) */}
      {project.gallery.length > 0 && (
        <div className="container" style={{ paddingTop: "3rem", paddingBottom: "1rem" }}>
          <EvidenceFigure
            src={project.heroImage}
            alt={`${project.title} — homepage capture from the audit evidence set`}
            caption="Homepage capture — the audit starting point"
          />
        </div>
      )}

      {project.highlights && project.highlights.length > 0 && (
        <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "1rem" }}>
          <Reveal>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "1.25rem" }}>Highlights</p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem 2.5rem" }}>
              {project.highlights.map((h) => (
                <li key={h.label} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                  <span aria-hidden="true" style={{ color: "var(--accent)", lineHeight: 1.6, fontWeight: 700 }}>▸</span>
                  <span style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--accent)", fontWeight: 700 }}>{h.label}</span>
                    {" — "}
                    {h.text}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      )}

      {/* Main content */}
      <div className="container" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "5rem", alignItems: "start" }} className="case-content-grid">
          {/* Main column */}
          <div>
            <Section label="01 — The Challenge" title={project.headings?.challenge ?? "What Was Wrong?"}>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{project.challenge}</p>
            </Section>

            <Divider />

            <Section label="02 — The Investigation" title={project.headings?.investigation ?? "How Was It Discovered?"}>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{project.investigation}</p>
            </Section>

            {<EvidenceBlock items={numberedChunks[0]} project={project} label={EVIDENCE_LABELS[0]} noteSeed={ 0 } />}

            {project.videos?.[0] && (
              <EvidenceVideo
                src={project.videos[0].src}
                poster={project.videos[0].poster}
                caption={project.videos[0].caption}
              />
            )}

            <Divider />

            <Section label="03 — Root Cause" title={project.headings?.rootCause ?? "Why Did It Happen?"}>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{project.rootCause}</p>
            </Section>

            {<EvidenceBlock items={numberedChunks[1]} project={project} label={EVIDENCE_LABELS[1]} noteSeed={ 1 } />}

            {project.issues.length > 0 && (
              <>
                <Divider />
                <Section label="04 — Issues Discovered" title={project.headings?.issues ?? "What Was Found?"}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {project.issues.map((issue, i) => (
                      <div key={issue.id} style={{ padding: "1.5rem", border: "1px solid var(--border)", borderLeft: `3px solid ${issue.severity === "critical" ? "var(--critical)" : issue.severity === "major" ? "var(--major)" : "var(--minor)"}`, borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface)" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "0.875rem", flexWrap: "wrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", color: "var(--text-tertiary)", letterSpacing: "0.1em" }}>{String(i + 1).padStart(2, "0")}</span>
                            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>{issue.title}</h3>
                          </div>
                          <SeverityBadge severity={issue.severity} />
                        </div>
                        <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginBottom: "0.875rem", lineHeight: 1.7 }}>{issue.description}</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", paddingTop: "0.875rem", borderTop: "1px solid var(--border)" }}>
                          <div>
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.375rem" }}>Root Cause</p>
                            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{issue.rootCause}</p>
                          </div>
                          <div>
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.375rem" }}>Resolution</p>
                            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{issue.resolution}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              </>
            )}

            {project.findingsTable && project.findingsTable.length > 0 && (
              <Reveal>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "1rem" }}>Key Findings</p>
                <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface)", marginBottom: "3rem" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", minWidth: "560px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        {["Finding", "Severity", "Buyer Impact", "Status"].map((h) => (
                          <th key={h} style={{ textAlign: "left", padding: "0.875rem 1rem", fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {project.findingsTable.map((row) => (
                        <tr key={row.finding} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "0.875rem 1rem", color: "var(--text-primary)", fontWeight: 500 }}>{row.finding}</td>
                          <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: row.severity === "critical" ? "var(--critical)" : row.severity === "major" ? "var(--major)" : "var(--minor)" }}>
                              {row.severity}
                            </span>
                          </td>
                          <td style={{ padding: "0.875rem 1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{row.impact}</td>
                          <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap", fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--verified)" }}>✓ {row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            )}

            {<EvidenceBlock items={numberedChunks[2]} project={project} label={EVIDENCE_LABELS[2]} noteSeed={ 2 } />}

            <Divider />

            <Section label="05 — The Resolution" title={project.headings?.resolution ?? "What Was Fixed?"}>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{project.resolution}</p>
            </Section>

            {<EvidenceBlock items={numberedChunks[3]} project={project} label={EVIDENCE_LABELS[3]} noteSeed={ 3 } />}

            <Divider />

            <Section label="06 — The Outcome" title={project.headings?.outcome ?? "What Changed?"}>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{project.outcome}</p>
            </Section>

            {project.resultsTable && project.resultsTable.length > 0 && (
              <Reveal>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "1rem" }}>The Results — 30 Days After Fixes</p>
                <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface)", marginBottom: "3rem" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", minWidth: "480px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        {["Metric", "Before the Audit", "After the Fixes"].map((h) => (
                          <th key={h} style={{ textAlign: "left", padding: "0.875rem 1rem", fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {project.resultsTable.map((row) => (
                        <tr key={row.metric} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "0.875rem 1rem", color: "var(--text-primary)", fontWeight: 500 }}>{row.metric}</td>
                          <td style={{ padding: "0.875rem 1rem", color: "var(--text-tertiary)" }}>{row.before}</td>
                          <td style={{ padding: "0.875rem 1rem", color: "var(--accent)", fontWeight: 700, whiteSpace: "nowrap" }}>▲ {row.after}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            )}

            {<EvidenceBlock items={numberedChunks[4]} project={project} label={EVIDENCE_LABELS[4]} noteSeed={ 4 } />}

            {project.videos?.slice(1).map((v) => (
              <EvidenceVideo key={v.src} src={v.src} poster={v.poster} caption={v.caption} />
            ))}

            {<EvidenceBlock items={numberedChunks[5]} project={project} label={EVIDENCE_LABELS[5]} noteSeed={ 5 } />}

            {project.faqs.length > 0 && (
              <>
                <Divider />
                <Section label="07 — FAQ" title="Questions About This Audit">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {project.faqs.map((faq, i) => (
                      <div key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                        <button
                          onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                          aria-expanded={activeFaq === i}
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "1.25rem 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "1rem" }}
                        >
                          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>{faq.question}</h3>
                          <span style={{ color: "var(--text-tertiary)", transform: activeFaq === i ? "rotate(45deg)" : "rotate(0)", transition: "transform var(--transition-fast)", fontSize: "1.25rem", flexShrink: 0 }} aria-hidden="true">+</span>
                        </button>
                        <div style={{ display: "grid", gridTemplateRows: activeFaq === i ? "1fr" : "0fr", transition: "grid-template-rows 400ms cubic-bezier(0.22, 0.61, 0.36, 1)" }}>
                          <div style={{ overflow: "hidden" }}>
                            <div style={{ paddingBottom: activeFaq === i ? "1.25rem" : "0", opacity: activeFaq === i ? 1 : 0, transition: "opacity 300ms ease, padding-bottom 300ms ease" }}>
                              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>{faq.answer}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside style={{ position: "sticky", top: "calc(var(--nav-height) + 2rem)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {project.verification.length > 0 && (
              <div style={{ padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface)" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "1rem" }}>Verification Status</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {project.verification.map((v) => (
                    <div key={v.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                      <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.label}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: v.status === "verified" ? "var(--verified)" : v.status === "failed" ? "var(--critical)" : "var(--text-tertiary)", display: "flex", alignItems: "center", gap: "0.25rem", flexShrink: 0, whiteSpace: "nowrap" }}>
                        {v.status === "verified" ? "✓" : v.status === "failed" ? "✗" : "○"} {v.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.testingScope.length > 0 && (
              <div style={{ padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface)" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "1rem" }}>Testing Scope</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {project.testingScope.map((s) => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "var(--accent)", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.technologies.length > 0 && (
              <div style={{ padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface)" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "1rem" }}>Technologies</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                  {project.technologies.map((t) => (
                    <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", border: "1px solid var(--border)", padding: "0.25rem 0.5rem", borderRadius: "2px", color: "var(--text-tertiary)", backgroundColor: "var(--bg-surface-2)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.externalLinks.length > 0 && (
              <div style={{ padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-surface)" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "1rem" }}>Links</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {project.externalLinks.map((l) => (
                    <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.375rem" }}>
                      {l.label} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <Link href="/audit" className="cs-audit-link">Get a Free Audit →</Link>
          </aside>
        </div>

        {/* Related projects */}
        {related.length > 0 && (
          <div style={{ marginTop: "6rem", paddingTop: "4rem", borderTop: "1px solid var(--border)" }}>
            <p className="eyebrow" style={{ marginBottom: "1.5rem" }}>Related Projects</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {related.map((p) => (
                <Link key={p.id} href={`/work/${p.slug}`} className="cs-related-link">
                  <div style={{ display: "flex", gap: "0.375rem", marginBottom: "0.75rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", border: "1px solid var(--border)", padding: "0.2rem 0.5rem", borderRadius: "2px", color: "var(--text-tertiary)" }}>{p.platform}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", border: "1px solid var(--border)", padding: "0.2rem 0.5rem", borderRadius: "2px", color: "var(--text-tertiary)" }}>{p.industry}</span>
                  </div>
                  <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.375rem" }}>{p.title}</h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const EVIDENCE_LABELS = [
  "Catalogue & discovery",
  "Detail & configuration",
  "Signature experience",
  "Responsive behavior",
  "User flow & journey",
  "Extended evidence",
];

function distributeEvidence(items: string[], buckets: number): string[][] {
  // Tall (portrait) mobile captures are paired GLOBALLY first, so a mobile
  // screenshot never renders alone: pairs are atomic units that always land
  // in the same bucket, side by side in a 2-column grid.
  const isPortrait = (x: string) => PORTRAIT_EVIDENCE.has(evidenceFile(x));
  const pairs: string[][] = [];
  const singles: string[] = [];
  let i = 0;
  while (i < items.length) {
    if (isPortrait(items[i])) {
      const pair = [items[i++]];
      if (i < items.length && isPortrait(items[i])) pair.push(items[i++]);
      pairs.push(pair);
    } else {
      singles.push(items[i++]);
    }
  }
  // A globally odd portrait count leaves one centered single — intentional.
  const oddPortrait = pairs.length > 0 && pairs[pairs.length - 1].length === 1 ? pairs.pop()! : null;
  // Interleave pairs and singles so grids and full-width shots alternate.
  const seq: string[][] = [];
  let pi = 0;
  let si = 0;
  while (pi < pairs.length || si < singles.length) {
    if (pi < pairs.length) seq.push(pairs[pi++]);
    if (si < singles.length) seq.push([singles[si++]]);
  }
  // Chunk whole units into balanced buckets — a pair can never split.
  const target = Math.ceil(items.length / buckets);
  const bucketUnits: string[][][] = Array.from({ length: buckets }, () => []);
  const counts = new Array(buckets).fill(0);
  let bi = 0;
  for (const unit of seq) {
    while (bi < buckets - 1 && counts[bi] > 0 && counts[bi] + unit.length > target) bi++;
    bucketUnits[bi].push(unit);
    counts[bi] += unit.length;
  }
  if (oddPortrait) {
    let mb = 0;
    counts.forEach((c, idx) => {
      if (c < counts[mb]) mb = idx;
    });
    bucketUnits[mb].push([oddPortrait[0]]);
  }
  return bucketUnits.map((bu) => bu.flat());
}

function EvidenceVideo({ src, poster, caption }: { src: string; poster?: string; caption: string }) {
  return (
    <Reveal>
      <figure style={{ margin: "0 0 3rem" }}>
        <video
          controls
          preload="metadata"
          poster={poster}
          src={src}
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }}
        />
        <figcaption style={{ marginTop: "0.75rem", fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", textAlign: "center" }}>
          {caption}
        </figcaption>
      </figure>
    </Reveal>
  );
}

function evidenceFile(src: string) {
  return src.split("/").pop() ?? "";
}

function EvidenceItem({ src, alt, caption, framed }: { src: string; alt: string; caption: string; framed?: boolean }) {
  return (
    <figure style={framed ? { margin: 0, minWidth: 0 } : { margin: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ width: "100%", height: "auto", display: "block", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }}
      />
      <figcaption style={{ marginTop: "0.75rem", fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", textAlign: "center" }}>
        {caption}
      </figcaption>
    </figure>
  );
}

const EVIDENCE_NOTES: Record<string, string[]> = {
  "Catalogue & discovery": [
    "Read the way a first-time buyer reads: every listing card compared against its siblings for claim agreement, price formatting, and image consistency.",
    "The discovery sweep mirrors what every visitor does unconsciously — checking that cards, filters, and entry points tell one coherent story.",
  ],
  "Detail & configuration": [
    "Detail surfaces carry the buying decision, so variant switches, option states, and add-to-cart targets were exercised here and re-exercised from every entry path.",
    "Configuration states were driven through both valid and invalid paths, watching what survives a step forward and what quietly resets on the way back.",
  ],
  "Signature experience": [
    "The store's differentiator earned its own pass: the showcase flow was walked end to end and graded against the promise the marketing makes.",
    "This is the screen the brand is judged by — tested from two directions: does it deliver the promise, and does it survive a first visit with no context?",
  ],
  "Responsive behavior": [
    "At 390px the layout is a different product. Widgets, CTAs, and content zones were re-tested for overlap, reachability, and thumb-sized targets.",
    "Side-by-side breakpoint comparison: whatever desktop forgives, mobile exposes. Every overlap captured here is a real mis-tap on a real phone.",
  ],
  "User flow & journey": [
    "The recorded journey from hero to checkout is the evidence backbone — every state in this audit can be replayed against it, step for step.",
    "One continuous walkthrough, revisited after each fix to confirm that repairs made in isolation didn't break the flow in sequence.",
  ],
  "Extended evidence": [
    "Supporting captures that close the loop: interaction states, edge viewports, and the in-between screens most audits skip entirely.",
    "The residual evidence set — every remaining state captured, graded, and filed so nothing downstream ships on assumption.",
  ],
};

function EvidenceBlock({ items, project, label, noteSeed }: { items: { src: string; no: number }[]; project: Project; label: string; noteSeed: number }) {
  if (items.length === 0) return null;
  const notes = EVIDENCE_NOTES[label] ?? ["Capture reviewed, graded, and filed as part of the audit evidence set."];
  const groups: { src: string; no: number }[][] = [];
  let i = 0;
  while (i < items.length) {
    const run: { src: string; no: number }[] = [];
    const isPortrait = (it: { src: string }) => PORTRAIT_EVIDENCE.has(evidenceFile(it.src));
    run.push(items[i++]);
    if (isPortrait(run[0])) {
      while (i < items.length && isPortrait(items[i]) && run.length < 2) run.push(items[i++]);
    }
    groups.push(run);
  }
  return (
    <>
      {groups.map((g, gi) => (
        <Reveal key={g[0].src}>
          <div
            style={
              g.length > 1
                ? { margin: "0 0 1.25rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", alignItems: "start" }
                : { margin: "0 0 1.25rem" }
            }
          >
            {g.map(({ src, no }) => (
              <EvidenceItem
                key={src}
                src={src}
                alt={`${project.title} — ${label.toLowerCase()} capture ${no}`}
                caption={`Evidence ${String(no).padStart(2, "0")} — ${label}`}
                framed={g.length > 1}
              />
            ))}
          </div>
          <p style={{ margin: "0 0 3rem", maxWidth: "62rem", color: "var(--text-tertiary)", fontSize: "0.9375rem", lineHeight: 1.75, borderLeft: "2px solid var(--accent)", paddingLeft: "1rem" }}>
            {notes[(noteSeed + gi) % notes.length]}
          </p>
        </Reveal>
      ))}
    </>
  );
}

function EvidenceFigure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <Reveal>
      <figure style={{ margin: "0 0 3rem" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)" }}
        />
        <figcaption style={{ marginTop: "0.75rem", fontFamily: "var(--font-mono)", fontSize: "0.625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", textAlign: "center" }}>
          {caption}
        </figcaption>
      </figure>
    </Reveal>
  );
}

function Section({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "4rem" }}>
      <Reveal>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <span style={{ width: "20px", height: "1px", backgroundColor: "var(--text-tertiary)", display: "inline-block" }} />
          {label}
        </div>
        <h2 style={{ fontSize: "clamp(1.375rem, 2.6vw, 1.75rem)", marginBottom: "1rem" }}>{title}</h2>
        {children}
      </Reveal>
    </section>
  );
}

function Divider() {
  return <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "3rem 0" }} />;
}
