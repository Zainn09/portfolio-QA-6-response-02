"use client";

import React, { useMemo, useState } from "react";
import {
  api,
  useAsync,
  CardSkeleton,
  ErrorAlert,
  EmptyState,
  Modal,
  StatusBadge,
  fmtDateTime,
  Kv,
} from "@/components/devtools/ui";
import { Database, RefreshCw, Download, Table2, Play, Search } from "lucide-react";

interface TableMeta {
  name: string;
  kind: string;
  rowEstimate: number;
  columnCount: number;
}
interface TableDetail {
  table: string;
  columns: { name: string; type: string; nullable: boolean; default: string | null; isPk: boolean }[];
  foreignKeys: { column: string; refTable: string; refColumn: string; name: string }[];
  indexes: { name: string; def: string }[];
  rowCount: number;
}
interface RowsResult {
  columns: string[];
  rows: unknown[][];
  total: number;
  page: number;
  pageSize: number;
  queryMs: number;
}
interface QueryResult {
  rows: unknown[][];
  columns: string[];
  queryMs: number;
}

function Cell({ value }: { value: unknown }) {
  if (value === null || value === undefined) return <span className="dt-cell-null">null</span>;
  let display: string;
  if (value instanceof Date) display = value.toISOString();
  else if (typeof value === "object") display = JSON.stringify(value);
  else display = String(value);
  return <span className="dt-cell-value" title={display.length > 120 ? undefined : display}>{display}</span>;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="dt-btn ghost sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}

function RowsGrid({ table }: { table: string }) {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<string | null>(null);
  const [dir, setDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<unknown[] | null>(null);

  const query = useMemo(
    () => `/api/devtools/database/rows?table=${encodeURIComponent(table)}&page=${page}&pageSize=25&q=${encodeURIComponent(q)}${sort ? `&sort=${encodeURIComponent(sort)}&dir=${dir}` : ""}`,
    [table, page, q, sort, dir],
  );
  const { data, error, loading, reload } = useAsync<RowsResult>(() => api<RowsResult>(query), [query]);

  const toggleSort = (col: string) => {
    if (sort === col) {
      if (dir === "asc") setDir("desc");
      else {
        setSort(null);
        setDir("asc");
      }
    } else {
      setSort(col);
      setDir("asc");
    }
    setPage(1);
  };

  const exportUrl = (format: "csv" | "json") =>
    `/api/devtools/database/export?table=${encodeURIComponent(table)}&format=${format}`;

  if (loading && !data) return <CardSkeleton rows={8} />;
  if (error) return <ErrorAlert message={error} onRetry={reload} />;
  if (!data) return null;

  const pages = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <div>
      <div className="dt-toolbar">
        <div className="dt-input" style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <input
            className="dt-input"
            placeholder="Search across all columns…"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") setQ(searchInput);
            }}
            aria-label="Search rows"
          />
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--dt-text-faint)" }} aria-hidden />
        </div>
        {q && (
          <button
            className="dt-btn sm"
            onClick={() => {
              setQ("");
              setSearchInput("");
              setPage(1);
            }}
          >
            Clear search “{q}”
          </button>
        )}
        <div style={{ flex: 1 }} />
        <span className="dt-badge dim">{data.queryMs} ms</span>
        <a className="dt-btn sm" href={exportUrl("csv")} download>
          <Download size={13} /> CSV
        </a>
        <a className="dt-btn sm" href={exportUrl("json")} download>
          <Download size={13} /> JSON
        </a>
      </div>

      <div className="dt-table-wrap">
        <table className="dt-table" aria-label={`Rows in ${table}`}>
          <thead>
            <tr>
              <th style={{ width: 52 }}>#</th>
              {data.columns.map((c) => (
                <th key={c} className="sortable" onClick={() => toggleSort(c)} aria-sort={sort === c ? (dir === "asc" ? "ascending" : "descending") : "none"}>
                  {c} {sort === c ? (dir === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.length === 0 && (
              <tr>
                <td colSpan={data.columns.length + 1}>
                  <EmptyState title="No rows" sub={q ? `Nothing matches “${q}”.` : "This table is empty."} />
                </td>
              </tr>
            )}
            {data.rows.map((row, ri) => {
              const idx = (data.page - 1) * data.pageSize + ri + 1;
              return (
                <tr key={ri} style={{ cursor: "pointer" }} onClick={() => setSelected(row)} title="Click to inspect">
                  <td className="mono dim">{idx}</td>
                  {data.columns.map((c, ci) => (
                    <td key={c}>
                      <Cell value={row[ci]} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="dt-pagination">
          <span>
            {data.total} rows · page {data.page}/{pages}
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

      {selected && (
        <Modal title={`Row — ${table}`} onClose={() => setSelected(null)} wide>
          <Kv
            rows={data.columns.map((c, ci) => [
              c,
              <span key={c} style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--dt-mono)", fontSize: 12, overflowWrap: "anywhere" }}>
                  {selected[ci] === null || selected[ci] === undefined ? <span className="dt-cell-null">null</span> : typeof selected[ci] === "object" ? JSON.stringify(selected[ci]) : String(selected[ci])}
                </span>
                {selected[ci] !== null && selected[ci] !== undefined && (
                  <CopyButton text={typeof selected[ci] === "object" ? JSON.stringify(selected[ci]) : String(selected[ci])} />
                )}
              </span>,
            ])}
          />
        </Modal>
      )}
    </div>
  );
}

function StructureView({ detail }: { detail: TableDetail }) {
  return (
    <div className="dt-grid cols-2" style={{ alignItems: "start" }}>
      <div className="dt-card">
        <h3>Columns ({detail.columns.length})</h3>
        <div className="dt-table-wrap" style={{ border: "none", background: "transparent" }}>
          <table className="dt-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Null</th>
                <th>Default</th>
              </tr>
            </thead>
            <tbody>
              {detail.columns.map((c) => (
                <tr key={c.name}>
                  <td>
                    <span className="mono">{c.name}</span>
                    {c.isPk && <span className="dt-badge accent" style={{ marginLeft: 8 }}>PK</span>}
                  </td>
                  <td className="mono dim">{c.type}</td>
                  <td className="dim">{c.nullable ? "yes" : "no"}</td>
                  <td className="mono dim">{c.default ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="dt-card">
          <h3>Foreign keys ({detail.foreignKeys.length})</h3>
          {detail.foreignKeys.length === 0 ? (
            <div className="dt-empty" style={{ padding: "18px 0" }}>
              <span className="dim" style={{ fontSize: 12 }}>No foreign keys on this table.</span>
            </div>
          ) : (
            <table className="dt-table" style={{ border: "none" }}>
              <thead>
                <tr>
                  <th>Column</th>
                  <th>References</th>
                </tr>
              </thead>
              <tbody>
                {detail.foreignKeys.map((f, i) => (
                  <tr key={i}>
                    <td className="mono">{f.column}</td>
                    <td className="mono dim">
                      {f.refTable}.{f.refColumn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="dt-card">
          <h3>Indexes ({detail.indexes.length})</h3>
          {detail.indexes.length === 0 ? (
            <div className="dt-empty" style={{ padding: "18px 0" }}>
              <span className="dim" style={{ fontSize: 12 }}>No indexes.</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {detail.indexes.map((ix) => (
                <div key={ix.name} className="dt-code" style={{ maxHeight: "none" }}>
                  {ix.def}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QueryEditor({ reloadTables }: { reloadTables: () => void }) {
  const [sqlText, setSqlText] = useState("select * from audit_requests order by created_at desc limit 10");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await api<QueryResult>("/api/devtools/database/query", { method: "POST", body: JSON.stringify({ sql: sqlText }) });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Query failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="dt-toolbar">
        <span className="dt-badge dim">read-only</span>
        <span style={{ fontSize: 11.5, color: "var(--dt-text-faint)" }}>
          Single SELECT / WITH / EXPLAIN · 10 s timeout · max 500 rows · every run is logged
        </span>
        <div style={{ flex: 1 }} />
        <button className="dt-btn primary sm" onClick={run} disabled={busy || !sqlText.trim()}>
          <Play size={13} /> {busy ? "Running…" : "Run query"}
        </button>
      </div>

      <textarea
        className="dt-textarea"
        value={sqlText}
        onChange={(e) => setSqlText(e.target.value)}
        rows={5}
        spellCheck={false}
        aria-label="SQL query"
      />

      {error && (
        <div style={{ marginTop: 12 }}>
          <ErrorAlert message={error} />
        </div>
      )}

      {result && (
        <div style={{ marginTop: 12 }}>
          <div className="dt-toolbar" style={{ marginBottom: 8 }}>
            <span className="dt-badge ok">{result.rows.length} rows</span>
            <span className="dt-badge dim">{result.queryMs} ms</span>
          </div>
          <div className="dt-table-wrap">
            <table className="dt-table">
              <thead>
                <tr>
                  {result.columns.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row, ri) => (
                  <tr key={ri}>
                    {result.columns.map((c, ci) => (
                      <td key={c}>
                        <Cell value={row[ci]} />
                      </td>
                    ))}
                  </tr>
                ))}
                {result.rows.length === 0 && (
                  <tr>
                    <td colSpan={Math.max(1, result.columns.length)}>
                      <EmptyState title="Query returned no rows" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function DatabaseExplorer() {
  const { data: tablesData, error: tablesError, loading: tablesLoading, reload: reloadTables } = useAsync<{ tables: TableMeta[] }>(() => api("/api/devtools/database"), []);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tab, setTab] = useState<"rows" | "structure" | "query">("rows");

  const detailQuery = selectedTable ? `/api/devtools/database/table?table=${encodeURIComponent(selectedTable)}` : null;
  const { data: detail, error: detailError, loading: detailLoading } = useAsync<TableDetail>(
    () => (detailQuery ? api<TableDetail>(detailQuery) : Promise.resolve(null as unknown as TableDetail)),
    [detailQuery],
  );

  if (tablesLoading) return <CardSkeleton rows={8} />;
  if (tablesError) return <ErrorAlert message={tablesError} onRetry={reloadTables} />;
  if (!tablesData) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 14, alignItems: "start" }} className="dt-db-layout">
      <div className="dt-card" style={{ padding: 10, position: "sticky", top: 70 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px 10px" }}>
          <Table2 size={14} style={{ color: "var(--dt-text-faint)" }} />
          <span style={{ fontFamily: "var(--dt-mono)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dt-text-faint)" }}>
            Tables ({tablesData.tables.length})
          </span>
          <div style={{ flex: 1 }} />
          <button className="dt-btn ghost sm" onClick={() => reloadTables()} aria-label="Refresh table list">
            <RefreshCw size={12} />
          </button>
        </div>
        {tablesData.tables.map((t) => (
          <button
            key={t.name}
            onClick={() => {
              setSelectedTable(t.name);
              setTab("rows");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              padding: "7px 8px",
              background: selectedTable === t.name ? "var(--dt-accent-dim)" : "transparent",
              border: selectedTable === t.name ? "1px solid rgba(183,255,60,0.25)" : "1px solid transparent",
              borderRadius: 6,
              color: selectedTable === t.name ? "var(--dt-accent)" : "var(--dt-text-dim)",
              cursor: "pointer",
              fontFamily: "var(--dt-mono)",
              fontSize: 12,
              textAlign: "left",
              marginBottom: 2,
            }}
          >
            <Database size={13} style={{ flexShrink: 0 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{t.name}</span>
            <span style={{ color: "var(--dt-text-faint)", fontSize: 10 }}>{t.rowEstimate.toLocaleString()}</span>
          </button>
        ))}
      </div>

      <div style={{ minWidth: 0 }}>
        {!selectedTable ? (
          <div className="dt-card">
            <EmptyState
              title="Pick a table"
              sub="Select a table from the list to browse its rows, inspect its structure, or run a read-only query."
            />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {detailLoading && <CardSkeleton rows={4} />}
            {detailError && <ErrorAlert message={detailError} />}
            {detail && !detailLoading && (
              <div className="dt-grid cols-4">
                <div className="dt-card">
                  <div className="dt-stat-label">Rows</div>
                  <div className="dt-stat-value">{detail.rowCount.toLocaleString()}</div>
                </div>
                <div className="dt-card">
                  <div className="dt-stat-label">Columns</div>
                  <div className="dt-stat-value">{detail.columns.length}</div>
                </div>
                <div className="dt-card">
                  <div className="dt-stat-label">Foreign keys</div>
                  <div className="dt-stat-value">{detail.foreignKeys.length}</div>
                </div>
                <div className="dt-card">
                  <div className="dt-stat-label">Indexes</div>
                  <div className="dt-stat-value">{detail.indexes.length}</div>
                </div>
              </div>
            )}

            <div className="dt-tabs" role="tablist" aria-label="Table views">
              {(["rows", "structure", "query"] as const).map((t) => (
                <button key={t} role="tab" aria-selected={tab === t} className={`dt-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                  {t === "rows" ? "Rows" : t === "structure" ? "Structure" : "Query"}
                </button>
              ))}
            </div>

            {tab === "rows" && <RowsGrid table={selectedTable} />}
            {tab === "structure" && (detail && !detailLoading ? <StructureView detail={detail} /> : <CardSkeleton rows={6} />)}
            {tab === "query" && <QueryEditor reloadTables={() => reloadTables()} />}
          </div>
        )}
      </div>
    </div>
  );
}
