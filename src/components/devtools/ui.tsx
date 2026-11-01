"use client";

import React, { useEffect, useState } from "react";

/* ── Shared helpers for the DevTools client components ────────────────────── */

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const j = (await res.json()) as { error?: string };
      if (j?.error) message = j.error;
    } catch {
      /* not json */
    }
    throw new ApiError(message, res.status);
  }
  return (await res.json()) as T;
}

export function timeAgo(iso: string | number | null | undefined): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return String(iso);
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(then).toLocaleDateString();
}

export function fmtDateTime(iso: string | number | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function StatusBadge({ status }: { status: string | null | undefined }) {
  const s = (status ?? "new").toLowerCase();
  const cls = s === "completed" || s === "published" || s === "verified" ? "ok" : s === "in_progress" ? "info" : s === "archived" || s === "draft" || s === "pending" ? "dim" : s === "new" || s === "critical" || s === "failed" ? "err" : "dim";
  return <span className={`dt-badge ${cls}`}>{s.replace(/_/g, " ")}</span>;
}

export function StatCard({ label, value, sub, dot }: { label: string; value: React.ReactNode; sub?: React.ReactNode; dot?: "ok" | "err" | "dim" }) {
  return (
    <div className="dt-card" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div className="dt-stat-label" style={{ display: "flex", alignItems: "center", gap: 7 }}>
        {dot && <span className={`dt-dot ${dot}`} />}
        {label}
      </div>
      <div className="dt-stat-value">{value}</div>
      {sub && <div className="dt-stat-sub">{sub}</div>}
    </div>
  );
}

export function EmptyState({ title, sub, icon }: { title: string; sub?: string; icon?: React.ReactNode }) {
  return (
    <div className="dt-empty">
      {icon ?? (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.29 7 12 12 20.71 7" />
          <line x1="12" y1="22" x2="12" y2="12" />
        </svg>
      )}
      <div className="dt-empty-title">{title}</div>
      {sub && <div className="dt-empty-sub">{sub}</div>}
    </div>
  );
}

export function ErrorAlert({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="dt-alert err" role="alert">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div style={{ flex: 1 }}>
        <div>{message}</div>
        {onRetry && (
          <button className="dt-btn sm" style={{ marginTop: 8 }} onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export function CardSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="dt-card" aria-busy="true" aria-label="Loading">
      <div className="dt-skeleton" style={{ height: 14, width: "40%", marginBottom: 14 }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="dt-skeleton" style={{ height: 30, marginBottom: 8 }} />
      ))}
    </div>
  );
}

export function Modal({ title, onClose, children, footer, wide }: { title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="dt-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`dt-modal ${wide ? "" : "narrow"}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="dt-modal-head">
          <div className="dt-modal-title">{title}</div>
          <button className="dt-btn ghost sm" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>
        <div className="dt-modal-body">{children}</div>
        {footer && <div className="dt-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({ title, body, confirmLabel, danger, busy, onConfirm, onCancel }: { title: string; body: React.ReactNode; confirmLabel: string; danger?: boolean; busy?: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="dt-btn" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button className={`dt-btn ${danger ? "danger" : "primary"}`} onClick={onConfirm} disabled={busy}>
            {busy ? "Working…" : confirmLabel}
          </button>
        </>
      }
    >
      <div style={{ fontSize: 13, color: "var(--dt-text-dim)", lineHeight: 1.6 }}>{body}</div>
    </Modal>
  );
}

/** Simple two-column key/value detail list. */
export function Kv({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="dt-kv">
      {rows.map(([k, v]) => (
        <React.Fragment key={k}>
          <dt>{k}</dt>
          <dd>{v ?? <span className="dt-cell-null">null</span>}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

export function useAsync<T>(fn: () => Promise<T>, deps: React.DependencyList): { data: T | null; error: string | null; loading: boolean; reload: () => void } {
  const [state, setState] = useState<{ data: T | null; error: string | null; status: "loading" | "done" | "error" }>({
    data: null,
    error: null,
    status: "loading",
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    // State updates happen only inside async callbacks (after a microtask
    // boundary), never synchronously in the effect body.
    Promise.resolve()
      .then(() => {
        if (!alive) return null;
        setState((s) => ({ ...s, status: "loading" }));
        return fn();
      })
      .then((d) => {
        if (alive) setState({ data: d, error: null, status: "done" });
      })
      .catch((e: unknown) => {
        if (alive) setState((s) => ({ ...s, error: e instanceof Error ? e.message : "Something went wrong", status: "error" }));
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { data: state.data, error: state.error, loading: state.status === "loading", reload: () => setTick((t) => t + 1) };
}
