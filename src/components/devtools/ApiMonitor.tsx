"use client";

import React, { useState } from "react";
import { api, useAsync, CardSkeleton, ErrorAlert, EmptyState, fmtDateTime } from "@/components/devtools/ui";

interface ApiLogList {
  requests: {
    id: number;
    method: string;
    path: string;
    status: number;
    duration_ms: number | null;
    error: string | null;
    created_at: string;
  }[];
  total: number;
  page: number;
  pageSize: number;
}

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export function ApiMonitor() {
  const [method, setMethod] = useState("");
  const [path, setPath] = useState("");
  const [status, setStatus] = useState("");
  const [days, setDays] = useState(7);
  const [page, setPage] = useState(1);

  const query = `/api/devtools/api-logs?method=${method}&path=${encodeURIComponent(path)}&status=${status}&days=${days}&page=${page}&pageSize=30`;
  const { data, error, loading, reload } = useAsync<ApiLogList>(() => api<ApiLogList>(query), [query]);

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div>
      <div className="dt-alert" style={{ marginBottom: 14 }}>
        <div style={{ flex: 1, fontSize: 12.5, color: "var(--dt-text-dim)" }}>
          Requests are recorded by the instrumented server routes (public forms, health, admin and DevTools APIs). Logging started
          when the DevTools build was deployed, so history before that is not available. Only method, path, status, duration and a
          short error tag are stored — never headers, bodies or credentials.
        </div>
      </div>

      <div className="dt-toolbar">
        <select className="dt-select" style={{ width: "auto" }} value={method} onChange={(e) => { setMethod(e.target.value); setPage(1); }} aria-label="Filter by method">
          <option value="">All methods</option>
          {METHODS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <input className="dt-input" style={{ width: 220 }} placeholder="Path prefix, e.g. /api/audit" value={path} onChange={(e) => { setPath(e.target.value); setPage(1); }} aria-label="Filter by path" />
        <select className="dt-select" style={{ width: "auto" }} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
          <option value="">All statuses</option>
          <option value="2xx">2xx</option>
          <option value="4xx">4xx</option>
          <option value="5xx">5xx</option>
        </select>
        <select className="dt-select" style={{ width: "auto" }} value={days} onChange={(e) => { setDays(Number(e.target.value)); setPage(1); }} aria-label="Time window">
          <option value={1}>Last 24 h</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
        </select>
        <div style={{ flex: 1 }} />
        <span className="dt-badge dim">{data?.total ?? 0} requests</span>
      </div>

      {loading && !data ? (
        <CardSkeleton rows={8} />
      ) : error ? (
        <ErrorAlert message={error} onRetry={reload} />
      ) : !data ? null : (
        <div className="dt-table-wrap">
          <table className="dt-table" aria-label="API requests">
            <thead>
              <tr>
                <th>When</th>
                <th>Method</th>
                <th>Path</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {data.requests.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <EmptyState title="No requests recorded yet" sub="Once the instrumented routes handle traffic (form submissions, health checks, admin calls), they appear here." />
                  </td>
                </tr>
              )}
              {data.requests.map((r) => (
                <tr key={r.id}>
                  <td className="mono dim" style={{ whiteSpace: "nowrap" }}>{fmtDateTime(r.created_at)}</td>
                  <td>
                    <span className={`dt-badge ${r.method === "GET" ? "info" : r.method === "POST" ? "accent" : "dim"}`}>{r.method}</span>
                  </td>
                  <td className="mono">{r.path}</td>
                  <td>
                    <span className={`dt-badge ${r.status < 300 ? "ok" : r.status < 500 ? "warn" : "err"}`}>{r.status}</span>
                  </td>
                  <td className="mono dim">{r.duration_ms === null ? "—" : `${r.duration_ms} ms`}</td>
                  <td className="dim">{r.error ?? ""}</td>
                </tr>
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
