"use client";

import React, { useState } from "react";
import { api, useAsync, CardSkeleton, ErrorAlert, EmptyState, fmtDateTime } from "@/components/devtools/ui";

interface ErrorList {
  errors: {
    id: number;
    source: string;
    severity: string;
    message: string;
    stack: string | null;
    context: Record<string, unknown> | null;
    created_at: string;
  }[];
  total: number;
  page: number;
  pageSize: number;
}

export function ErrorsList() {
  const [severity, setSeverity] = useState("");
  const [days, setDays] = useState(30);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);

  const query = `/api/devtools/errors?severity=${severity}&days=${days}&page=${page}&pageSize=25`;
  const { data, error, loading, reload } = useAsync<ErrorList>(() => api<ErrorList>(query), [query]);

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div>
      <div className="dt-alert" style={{ marginBottom: 14 }}>
        <div style={{ flex: 1, fontSize: 12.5, color: "var(--dt-text-dim)" }}>
          Errors captured by the server route handlers (form APIs, admin APIs, DevTools endpoints) are stored here with source and
          a short context. There is no browser-side error reporting installed, so client console errors are not included.
        </div>
      </div>

      <div className="dt-toolbar">
        <select className="dt-select" style={{ width: "auto" }} value={severity} onChange={(e) => { setSeverity(e.target.value); setPage(1); }} aria-label="Filter by severity">
          <option value="">All severities</option>
          <option value="error">error</option>
          <option value="warn">warn</option>
        </select>
        <select className="dt-select" style={{ width: "auto" }} value={days} onChange={(e) => { setDays(Number(e.target.value)); setPage(1); }} aria-label="Time window">
          <option value={1}>Last 24 h</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
        <div style={{ flex: 1 }} />
        <span className="dt-badge dim">{data?.total ?? 0} errors</span>
      </div>

      {loading && !data ? (
        <CardSkeleton rows={6} />
      ) : error ? (
        <ErrorAlert message={error} onRetry={reload} />
      ) : !data ? null : (
        <div className="dt-table-wrap">
          <table className="dt-table" aria-label="Application errors">
            <thead>
              <tr>
                <th>When</th>
                <th>Severity</th>
                <th>Source</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {data.errors.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <EmptyState title="No captured errors" sub="This is the healthy state: nothing has failed in the instrumented routes within this window." />
                  </td>
                </tr>
              )}
              {data.errors.map((e) => (
                <React.Fragment key={e.id}>
                  <tr style={{ cursor: e.stack || e.context ? "pointer" : "default" }} onClick={() => setExpanded(expanded === e.id ? null : e.id)}>
                    <td className="mono dim" style={{ whiteSpace: "nowrap" }}>{fmtDateTime(e.created_at)}</td>
                    <td>
                      <span className={`dt-badge ${e.severity === "warn" ? "warn" : "err"}`}>{e.severity}</span>
                    </td>
                    <td className="mono dim">{e.source}</td>
                    <td>{e.message}</td>
                  </tr>
                  {expanded === e.id && (
                    <tr>
                      <td colSpan={4} style={{ background: "var(--dt-bg-overlay)" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {e.stack && (
                            <div>
                              <div className="dt-label">Stack trace (visible to admins only)</div>
                              <pre className="dt-code">{e.stack}</pre>
                            </div>
                          )}
                          {e.context && (
                            <div>
                              <div className="dt-label">Context</div>
                              <pre className="dt-code">{JSON.stringify(e.context, null, 2)}</pre>
                            </div>
                          )}
                          {!e.stack && !e.context && <span className="dim" style={{ fontSize: 12 }}>No stack or context captured.</span>}
                        </div>
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
