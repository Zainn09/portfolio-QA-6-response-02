"use client";

import React, { useState } from "react";
import Link from "next/link";
import { api, useAsync, StatCard, CardSkeleton, ErrorAlert, EmptyState, timeAgo } from "@/components/devtools/ui";

interface Overview {
  dbStatus: "up" | "down";
  dbLatencyMs?: number;
  counts?: {
    audit_total: number;
    audit_new: number;
    contact_total: number;
    contact_new: number;
    projects_total: number;
    projects_published: number;
    blog_total: number;
  };
  recentActivity?: { actor_email: string | null; action: string; target: string | null; created_at: string }[];
  auditTrend?: { day: string; n: number }[];
  contactTrend?: { day: string; n: number }[];
  server?: { nodeVersion: string; env: string; uptimeSeconds: number };
  error?: string;
}

function Trend({ data, label }: { data: { day: string; n: number }[]; label: string }) {
  // Stable "now" for the whole mounted chart (lazy init keeps render pure).
  const [now] = useState(() => Date.now());
  const days = 30;
  const byDay = new Map<string, number>();
  for (const d of data) byDay.set(d.day, d.n);
  const bars: number[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const dt = new Date(now - i * 86_400_000);
    const key = dt.toISOString().slice(0, 10);
    bars.push(byDay.get(key) ?? 0);
  }
  const max = Math.max(1, ...bars);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "var(--dt-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dt-text-faint)" }}>
          {label} · last 30 days
        </span>
        <span style={{ fontFamily: "var(--dt-mono)", fontSize: 11, color: "var(--dt-text-dim)" }}>{bars.reduce((a, b) => a + b, 0)} total</span>
      </div>
      <div className="dt-trend" role="img" aria-label={`${label} activity, last 30 days`}>
        {bars.map((n, i) => (
          <div key={i} className={`dt-trend-bar ${n === 0 ? "zero" : ""}`} style={{ height: `${Math.max(4, (n / max) * 100)}%` }} title={`${n}`} />
        ))}
      </div>
    </div>
  );
}

export function OverviewDashboard() {
  const { data, error, loading, reload } = useAsync<Overview>(() => api<Overview>("/api/devtools/overview"), []);

  if (loading) {
    return (
      <div className="dt-grid cols-2">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton rows={6} />
        <CardSkeleton rows={6} />
      </div>
    );
  }
  if (error) return <ErrorAlert message={error} onRetry={reload} />;
  if (!data) return null;

  const dbDown = data.dbStatus === "down";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {dbDown && (
        <div className="dt-alert err">
          <div style={{ flex: 1 }}>
            <strong>Database unreachable.</strong> The metrics below need a live connection — check{" "}
            <Link href="/devtools/health" style={{ color: "var(--dt-accent)" }}>
              system health
            </Link>{" "}
            and the DATABASE_URL configuration.
          </div>
        </div>
      )}

      <div className="dt-grid cols-4">
        <StatCard label="Audit requests" value={dbDown ? "—" : data.counts?.audit_total ?? 0} dot={dbDown ? "err" : "ok"} sub={dbDown ? undefined : `${data.counts?.audit_new ?? 0} new · ${data.counts?.contact_new ?? 0} new contacts`} />
        <StatCard label="Contact messages" value={dbDown ? "—" : data.counts?.contact_total ?? 0} dot={dbDown ? "err" : "dim"} sub={dbDown ? undefined : "in the contact_messages table"} />
        <StatCard label="Projects (DB)" value={dbDown ? "—" : data.counts?.projects_total ?? 0} dot={dbDown ? "err" : "dim"} sub={dbDown ? undefined : `${data.counts?.projects_published ?? 0} published`} />
        <StatCard label="Database" value={dbDown ? "down" : "up"} dot={dbDown ? "err" : "ok"} sub={dbDown ? "connection failed" : `${data.dbLatencyMs ?? 0} ms · measured select 1`} />
      </div>

      <div className="dt-grid cols-2">
        <div className="dt-card">
          <h3>
            Submission activity
            <Link href="/devtools/forms" className="dt-btn ghost sm">
              Manage →
            </Link>
          </h3>
          {dbDown ? (
            <EmptyState title="Unavailable" sub="The database is unreachable, so no activity can be measured." />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Trend data={data.auditTrend ?? []} label="Audit requests" />
              <Trend data={data.contactTrend ?? []} label="Contact messages" />
            </div>
          )}
        </div>

        <div className="dt-card">
          <h3>
            Recent admin activity
            <Link href="/devtools/logs" className="dt-btn ghost sm">
              Full log →
            </Link>
          </h3>
          {dbDown ? (
            <EmptyState title="Unavailable" sub="The activity trail is stored in the database." />
          ) : data.recentActivity && data.recentActivity.length > 0 ? (
            <table className="dt-table" style={{ border: "none" }} aria-label="Recent admin activity">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Action</th>
                  <th>Actor</th>
                </tr>
              </thead>
              <tbody>
                {data.recentActivity.map((a, i) => (
                  <tr key={i}>
                    <td className="mono dim" style={{ whiteSpace: "nowrap" }}>{timeAgo(a.created_at)}</td>
                    <td>
                      <span className="mono">{a.action}</span>
                      {a.target && <span className="dim"> · {a.target}</span>}
                    </td>
                    <td className="dim">{a.actor_email ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState title="No activity yet" sub="Logins, edits, deletes, queries and exports appear here the moment they happen." />
          )}
        </div>
      </div>

      <div className="dt-grid cols-3">
        <StatCard label="Environment" value={data.server?.env ?? "—"} sub={data.server?.nodeVersion} />
        <StatCard label="Server uptime" value={`${Math.floor((data.server?.uptimeSeconds ?? 0) / 3600)}h ${Math.floor(((data.server?.uptimeSeconds ?? 0) % 3600) / 60)}m`} sub="this server process" />
        <StatCard label="Blog posts (DB)" value={dbDown ? "—" : data.counts?.blog_total ?? 0} sub="managed in /admin" />
      </div>
    </div>
  );
}
