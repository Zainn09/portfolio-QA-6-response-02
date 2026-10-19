"use client";

import React, { useState } from "react";
import { api, useAsync, CardSkeleton, ErrorAlert, EmptyState, fmtDateTime } from "@/components/devtools/ui";

interface ActivityList {
  entries: {
    id: number;
    actor_email: string | null;
    action: string;
    target: string | null;
    detail: Record<string, unknown> | null;
    ip: string | null;
    created_at: string;
  }[];
  total: number;
  page: number;
  pageSize: number;
}

export function ActivityLog() {
  const [days, setDays] = useState(30);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);

  const query = `/api/devtools/activity?days=${days}&page=${page}&pageSize=30`;
  const { data, error, loading, reload } = useAsync<ActivityList>(() => api<ActivityList>(query), [query]);

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div>
      <div className="dt-toolbar">
        <select className="dt-select" style={{ width: "auto" }} value={days} onChange={(e) => { setDays(Number(e.target.value)); setPage(1); }} aria-label="Time window">
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
        </select>
        <div style={{ flex: 1 }} />
        <span className="dt-badge dim">{data?.total ?? 0} entries</span>
      </div>

      {loading && !data ? (
        <CardSkeleton rows={8} />
      ) : error ? (
        <ErrorAlert message={error} onRetry={reload} />
      ) : !data ? null : (
        <div className="dt-table-wrap">
          <table className="dt-table" aria-label="Administrative activity">
            <thead>
              <tr>
                <th>When</th>
                <th>Action</th>
                <th>Target</th>
                <th>Actor</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {data.entries.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <EmptyState title="No activity in this window" sub="Every login, status change, edit, delete, query run and export is recorded here with the acting admin." />
                  </td>
                </tr>
              )}
              {data.entries.map((e) => (
                <React.Fragment key={e.id}>
                  <tr style={{ cursor: e.detail ? "pointer" : "default" }} onClick={() => setExpanded(expanded === e.id ? null : e.id)}>
                    <td className="mono dim" style={{ whiteSpace: "nowrap" }}>{fmtDateTime(e.created_at)}</td>
                    <td className="mono">
                      {e.action}
                      {e.detail && <span className="dim"> ·</span>}
                    </td>
                    <td className="mono dim">{e.target ?? "—"}</td>
                    <td className="dim">{e.actor_email ?? "—"}</td>
                    <td className="mono dim">{e.ip ?? "—"}</td>
                  </tr>
                  {expanded === e.id && e.detail && (
                    <tr>
                      <td colSpan={5} style={{ background: "var(--dt-bg-overlay)" }}>
                        <pre className="dt-code">{JSON.stringify(e.detail, null, 2)}</pre>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div className="dt-pagination">
            <span>
              page {data.page}/{pages}
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
    </div>
  );
}
