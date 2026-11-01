"use client";

import React, { useState } from "react";
import { api, useAsync, CardSkeleton, ErrorAlert, EmptyState, Modal, ConfirmDialog, StatusBadge, Kv, fmtDateTime, timeAgo } from "@/components/devtools/ui";
import { Download, Save, Trash2, Search } from "lucide-react";

interface Submission {
  form: string;
  id: number;
  name: string;
  email: string;
  status: string | null;
  notes: string | null;
  created_at: string;
  store_url: string | null;
  platform: string | null;
  review_scope: string | null;
  message: string | null;
  company: string | null;
  website: string | null;
  project_type: string | null;
}
interface ListResult {
  submissions: Submission[];
  total: number;
  page: number;
  pageSize: number;
  statuses: string[];
}

const STATUSES = ["new", "in_progress", "completed", "archived"];

function DetailModal({ submission, onClose, onChanged }: { submission: Submission; onClose: () => void; onChanged: () => void }) {
  const [status, setStatus] = useState(submission.status ?? "new");
  const [notes, setNotes] = useState(submission.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAudit = submission.form === "audit";
  const snippet =
    submission.message ?? submission.store_url ?? submission.review_scope ?? submission.company ?? submission.website ?? "";

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await api(`/api/devtools/submissions/${submission.id}`, {
        method: "PATCH",
        body: JSON.stringify({ form: submission.form, status, notes: notes.trim() ? notes : null }),
      });
      onChanged();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await api(`/api/devtools/submissions/${submission.id}`, {
        method: "DELETE",
        body: JSON.stringify({ form: submission.form }),
      });
      onChanged();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <>
      <Modal
        title={`${isAudit ? "Audit request" : "Contact message"} #${submission.id}`}
        onClose={onClose}
        wide
        footer={
          <>
            <button className="dt-btn danger" onClick={() => setConfirmDelete(true)}>
              <Trash2 size={13} /> Delete
            </button>
            <div style={{ flex: 1 }} />
            <button className="dt-btn" onClick={onClose} disabled={saving}>
              Close
            </button>
            <button className="dt-btn primary" onClick={save} disabled={saving}>
              <Save size={13} /> {saving ? "Saving…" : "Save changes"}
            </button>
          </>
        }
      >
        {error && (
          <div className="dt-alert err" style={{ marginBottom: 14 }} role="alert">
            {error}
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 18 }} className="dt-detail-grid">
          <Kv
            rows={[
              ["Name", submission.name],
              ["Email", submission.email],
              ...(isAudit
                ? ([
                    ["Store URL", submission.store_url],
                    ["Platform", submission.platform],
                    ["Review scope", submission.review_scope],
                  ] as [string, React.ReactNode][])
                : ([
                    ["Company", submission.company],
                    ["Website", submission.website],
                    ["Project type", submission.project_type],
                  ] as [string, React.ReactNode][])),
              ["Received", fmtDateTime(submission.created_at)],
              ["Message", submission.message ?? null],
            ]}
          />
          <div>
            <div className="dt-field">
              <label className="dt-label" htmlFor="dt-sub-status">
                Status
              </label>
              <select id="dt-sub-status" className="dt-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <div style={{ marginTop: 6 }}>
                <StatusBadge status={status} />
              </div>
            </div>
            <div className="dt-field">
              <label className="dt-label" htmlFor="dt-sub-notes">
                Internal notes
              </label>
              <textarea id="dt-sub-notes" className="dt-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Visible to admins only" />
            </div>
            <p style={{ fontSize: 11, color: "var(--dt-text-faint)", lineHeight: 1.6, margin: 0 }}>
              Status changes and notes are written to the activity trail with your email address.
            </p>
          </div>
        </div>
        {snippet && !submission.message && (
          <div style={{ marginTop: 14 }}>
            <div className="dt-label">Content</div>
            <div className="dt-code" style={{ maxHeight: "none" }}>
              {snippet}
            </div>
          </div>
        )}
      </Modal>

      {confirmDelete && (
        <ConfirmDialog
          title={`Delete ${isAudit ? "audit request" : "contact message"} #${submission.id}?`}
          body={
            <>
              This permanently deletes <strong>{submission.name}</strong> &lt;{submission.email}&gt;. A snapshot of the
              submission is preserved in the activity trail, but the record itself is gone.
            </>
          }
          confirmLabel="Delete permanently"
          danger
          busy={deleting}
          onConfirm={doDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}

export function SubmissionsManager() {
  const [tab, setTab] = useState<"all" | "audit" | "contact">("all");
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Submission | null>(null);

  const query = `/api/devtools/submissions?form=${tab}&status=${encodeURIComponent(status)}&q=${encodeURIComponent(q)}&page=${page}&pageSize=20`;
  const { data, error, loading, reload } = useAsync<ListResult>(() => api<ListResult>(query), [query]);

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  const exportUrl = `/api/devtools/submissions?form=${tab}&status=${encodeURIComponent(status)}&q=${encodeURIComponent(q)}&export=csv`;

  return (
    <div>
      <div className="dt-tabs" role="tablist" aria-label="Submission form">
        {(["all", "audit", "contact"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`dt-tab ${tab === t ? "active" : ""}`}
            onClick={() => {
              setTab(t);
              setPage(1);
            }}
          >
            {t === "all" ? "All" : t === "audit" ? "Audit requests" : "Contact messages"}
          </button>
        ))}
      </div>

      <div className="dt-toolbar">
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <input
            className="dt-input"
            placeholder="Search name, email, store, message…"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") setQ(searchInput);
            }}
            aria-label="Search submissions"
          />
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--dt-text-faint)" }} aria-hidden />
        </div>
        <select className="dt-select" style={{ width: "auto" }} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <div style={{ flex: 1 }} />
        <a className="dt-btn sm" href={exportUrl} download>
          <Download size={13} /> Export CSV
        </a>
      </div>

      {loading && !data ? (
        <CardSkeleton rows={6} />
      ) : error ? (
        <ErrorAlert message={error} onRetry={reload} />
      ) : !data ? null : (
        <div className="dt-table-wrap">
          <table className="dt-table" aria-label="Submissions">
            <thead>
              <tr>
                <th>When</th>
                <th>Form</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {data.submissions.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <EmptyState title="No submissions" sub={q || status ? "Nothing matches the current filters." : "Audit and contact form submissions will appear here as they arrive."} />
                  </td>
                </tr>
              )}
              {data.submissions.map((s) => (
                <tr key={`${s.form}-${s.id}`} style={{ cursor: "pointer" }} onClick={() => setSelected(s)} title="Click to manage">
                  <td className="mono dim" style={{ whiteSpace: "nowrap" }}>{timeAgo(s.created_at)}</td>
                  <td>
                    <span className={`dt-badge ${s.form === "audit" ? "info" : "dim"}`}>{s.form}</span>
                  </td>
                  <td>{s.name}</td>
                  <td className="mono dim">{s.email}</td>
                  <td>
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="dim">
                    <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 320 }}>
                      {s.message ?? s.store_url ?? s.company ?? s.review_scope ?? ""}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="dt-pagination">
            <span>
              {data.total} submissions · page {data.page}/{pages}
            </span>
            <div style={{ flex: 1 }} />
            <button className="dt-btn sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              ← Prev
            </button>
            <button className="dt-btn sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
              Next →
            </button>
          </div>
        </div>
      )}

      {selected && <DetailModal submission={selected} onClose={() => setSelected(null)} onChanged={() => reload()} />}
    </div>
  );
}
