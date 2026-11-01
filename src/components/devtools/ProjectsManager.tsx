"use client";

import React, { useState } from "react";
import { api, useAsync, CardSkeleton, ErrorAlert, EmptyState, Modal, ConfirmDialog, StatusBadge, Kv, fmtDateTime } from "@/components/devtools/ui";
import { Plus, Trash2, Save, ChevronLeft } from "lucide-react";

interface ProjectSummary {
  id: number;
  title: string;
  slug: string;
  industry: string | null;
  platform: string | null;
  featured: boolean | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
}
interface Project extends ProjectSummary {
  partnerType: string | null;
  thumbnail: string | null;
  heroImage: string | null;
  gallery: string[];
  summary: string | null;
  challenge: string | null;
  investigation: string | null;
  rootCause: string | null;
  resolution: string | null;
  outcome: string | null;
  testingScope: string[];
  issues: { id: string; title: string; severity: "critical" | "major" | "minor"; description: string; rootCause: string; resolution: string }[];
  beforeImage: string | null;
  afterImage: string | null;
  verification: { label: string; status: "verified" | "failed" | "pending" }[];
  technologies: string[];
  externalLinks: { label: string; url: string }[];
  faqs: { question: string; answer: string }[];
  seoTitle: string | null;
  seoDescription: string | null;
  seoImage: string | null;
  seoCanonical: string | null;
  featuredOrder: number | null;
}

const EMPTY_DRAFT: Record<string, string> = {
  title: "",
  slug: "",
  industry: "",
  platform: "Shopify",
  summary: "",
  challenge: "",
  investigation: "",
  rootCause: "",
  resolution: "",
  outcome: "",
  technologies: "",
  seoTitle: "",
  seoDescription: "",
  seoImage: "",
  seoCanonical: "",
  heroImage: "",
  beforeImage: "",
  afterImage: "",
  status: "draft",
};

function ProjectForm({ initial, onSaved, onCancel, isEdit }: { initial: Project | null; onSaved: () => void; onCancel: () => void; isEdit: boolean }) {
  const [fields, setFields] = useState<Record<string, string>>(() => {
    if (!initial) return EMPTY_DRAFT;
    return {
      title: initial.title ?? "",
      slug: initial.slug ?? "",
      industry: initial.industry ?? "",
      platform: initial.platform ?? "Shopify",
      summary: initial.summary ?? "",
      challenge: initial.challenge ?? "",
      investigation: initial.investigation ?? "",
      rootCause: initial.rootCause ?? "",
      resolution: initial.resolution ?? "",
      outcome: initial.outcome ?? "",
      technologies: (initial.technologies ?? []).join(", "),
      seoTitle: initial.seoTitle ?? "",
      seoDescription: initial.seoDescription ?? "",
      seoImage: initial.seoImage ?? "",
      seoCanonical: initial.seoCanonical ?? "",
      heroImage: initial.heroImage ?? "",
      beforeImage: initial.beforeImage ?? "",
      afterImage: initial.afterImage ?? "",
      status: initial.status ?? "draft",
    };
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        title: fields.title.trim(),
        status: fields.status,
        industry: fields.industry.trim() || null,
        platform: fields.platform,
        summary: fields.summary || null,
        challenge: fields.challenge || null,
        investigation: fields.investigation || null,
        rootCause: fields.rootCause || null,
        resolution: fields.resolution || null,
        outcome: fields.outcome || null,
        technologies: fields.technologies.split(",").map((s) => s.trim()).filter(Boolean),
        seoTitle: fields.seoTitle.trim() || null,
        seoDescription: fields.seoDescription.trim() || null,
        seoImage: fields.seoImage.trim() || null,
        seoCanonical: fields.seoCanonical.trim() || null,
        heroImage: fields.heroImage.trim() || null,
        beforeImage: fields.beforeImage.trim() || null,
        afterImage: fields.afterImage.trim() || null,
      };
      if (!isEdit) payload.slug = fields.slug.trim();
      if (isEdit) payload.slug = fields.slug.trim();

      if (isEdit) {
        await api(`/api/devtools/projects/${(initial as Project).id}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await api("/api/devtools/projects", { method: "POST", body: JSON.stringify(payload) });
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setBusy(false);
    }
  };

  const text = (k: keyof typeof EMPTY_DRAFT, label: string, placeholder?: string) => (
    <div className="dt-field">
      <label className="dt-label" htmlFor={`pf-${k}`}>
        {label}
      </label>
      <input id={`pf-${k}`} className="dt-input" value={fields[k]} onChange={set(k)} placeholder={placeholder} />
    </div>
  );
  const area = (k: keyof typeof EMPTY_DRAFT, label: string) => (
    <div className="dt-field">
      <label className="dt-label" htmlFor={`pf-${k}`}>
        {label}
      </label>
      <textarea id={`pf-${k}`} className="dt-textarea" value={fields[k]} onChange={set(k)} rows={3} />
    </div>
  );

  return (
    <div>
      {error && (
        <div className="dt-alert err" style={{ marginBottom: 14 }} role="alert">
          {error}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }} className="dt-form-grid">
        {text("title", "Title *")}
        {text("slug", isEdit ? "Slug *" : "Slug * (url)")}
        {text("industry", "Industry")}
        <div className="dt-field">
          <label className="dt-label" htmlFor="pf-platform">
            Platform
          </label>
          <select id="pf-platform" className="dt-select" value={fields.platform} onChange={set("platform")}>
            <option>Shopify</option>
            <option>Shopify Plus</option>
          </select>
        </div>
        {text("heroImage", "Hero image URL")}
        {text("technologies", "Technologies (comma-separated)")}
      </div>
      {area("summary", "Summary")}
      {area("challenge", "Challenge")}
      {area("investigation", "Investigation")}
      {area("rootCause", "Root cause")}
      {area("resolution", "Resolution")}
      {area("outcome", "Outcome")}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }} className="dt-form-grid">
        {text("seoTitle", "SEO title")}
        {text("seoDescription", "SEO description")}
        {text("seoImage", "SEO image URL")}
        {text("seoCanonical", "Canonical URL")}
      </div>
      <div className="dt-field">
        <label className="dt-label" htmlFor="pf-status">
          Status
        </label>
        <select id="pf-status" className="dt-select" value={fields.status} onChange={set("status")} style={{ maxWidth: 220 }}>
          <option value="draft">draft</option>
          <option value="published">published</option>
        </select>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button className="dt-btn" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button className="dt-btn primary" onClick={save} disabled={busy || !fields.title.trim() || !fields.slug.trim()}>
          <Save size={13} /> {busy ? "Saving…" : isEdit ? "Save changes" : "Create project"}
        </button>
      </div>
    </div>
  );
}

export function ProjectsManager() {
  const { data, error, loading, reload } = useAsync<{ projects: ProjectSummary[] }>(() => api("/api/devtools/projects"), []);
  const [view, setView] = useState<"list" | "edit" | "create">("list");
  const [editing, setEditing] = useState<Project | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ProjectSummary | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openEdit = async (id: number) => {
    try {
      const project = await api<Project>(`/api/devtools/projects/${id}`);
      setEditing(project);
      setView("edit");
    } catch {
      /* handled by list state */
    }
  };

  const doDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await api(`/api/devtools/projects/${confirmDelete.id}`, { method: "DELETE" });
      setConfirmDelete(null);
      reload();
    } catch {
      /* keep dialog open */
    } finally {
      setDeleting(false);
    }
  };

  if (view === "create" || view === "edit") {
    return (
      <div className="dt-card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <button className="dt-btn ghost sm" onClick={() => setView("list")}>
            <ChevronLeft size={13} /> Back
          </button>
          <span style={{ fontWeight: 650, fontSize: 14 }}>{view === "create" ? "New project" : `Edit — ${editing?.title}`}</span>
        </div>
        <ProjectForm
          initial={view === "edit" ? editing : null}
          isEdit={view === "edit"}
          onSaved={() => {
            setView("list");
            reload();
          }}
          onCancel={() => setView("list")}
        />
      </div>
    );
  }

  if (loading) return <CardSkeleton rows={6} />;
  if (error) return <ErrorAlert message={error} onRetry={reload} />;
  if (!data) return null;

  return (
    <div>
      <div className="dt-alert" style={{ marginBottom: 14 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2, color: "var(--dt-info)" }} aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <div style={{ flex: 1, fontSize: 12.5, color: "var(--dt-text-dim)" }}>
          This manages the <span className="mono">projects</span> database table — the case-study content model. The public{" "}
          <span className="mono">/work</span> pages are currently served from Git content files, so edits here are stored in the
          database but not published until the public site is pointed at this table.
        </div>
      </div>

      <div className="dt-toolbar">
        <span style={{ fontSize: 12.5, color: "var(--dt-text-dim)" }}>{data.projects.length} projects</span>
        <div style={{ flex: 1 }} />
        <button className="dt-btn primary sm" onClick={() => setView("create")}>
          <Plus size={13} /> New project
        </button>
      </div>

      {data.projects.length === 0 ? (
        <div className="dt-card">
          <EmptyState title="No projects in the database yet" sub="The public case studies live in Git today. Create the first database-backed project to start building the managed content model." />
        </div>
      ) : (
        <div className="dt-table-wrap">
          <table className="dt-table" aria-label="Projects">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Industry</th>
                <th>Platform</th>
                <th>Status</th>
                <th>Updated</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data.projects.map((p) => (
                <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => openEdit(p.id)} title="Click to edit">
                  <td>
                    {p.title}
                    {p.featured && <span className="dt-badge accent" style={{ marginLeft: 8 }}>featured</span>}
                  </td>
                  <td className="mono dim">{p.slug}</td>
                  <td className="dim">{p.industry ?? "—"}</td>
                  <td className="dim">{p.platform ?? "—"}</td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="mono dim" style={{ whiteSpace: "nowrap" }}>
                    {fmtDateTime(p.updatedAt)}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button className="dt-btn ghost sm" onClick={() => setConfirmDelete(p)} aria-label={`Delete ${p.title}`}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title={`Delete “${confirmDelete.title}”?`}
          body={
            <>
              This permanently removes project <span className="mono">{confirmDelete.slug}</span> (id {confirmDelete.id}) from the
              database, including its issues, FAQs and SEO fields. The action is written to the activity trail.
            </>
          }
          confirmLabel="Delete project"
          danger
          busy={deleting}
          onConfirm={doDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
