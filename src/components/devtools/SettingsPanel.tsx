"use client";

import React, { useState } from "react";
import Link from "next/link";
import { api, useAsync, CardSkeleton, ErrorAlert, Kv, StatCard } from "@/components/devtools/ui";
import { CheckCircle2, Loader2 } from "lucide-react";

interface Health {
  app: { env: string; nodeVersion: string };
  database: { configured: boolean; status: string };
  envVarsPresent: string[];
  security: { adminSessionSecretConfigured: boolean };
}

export function SettingsPanel() {
  const { data, error, loading, reload } = useAsync<Health>(() => api<Health>("/api/devtools/health"), []);
  const [migrating, setMigrating] = useState(false);
  const [migrateResult, setMigrateResult] = useState<{ ok: boolean; message: string } | null>(null);

  const runMigration = async () => {
    setMigrating(true);
    setMigrateResult(null);
    try {
      const res = await fetch("/api/devtools/migrate", { method: "POST" });
      const body = (await res.json().catch(() => ({}))) as { success?: boolean; applied?: number; error?: string };
      if (res.ok && body.success) {
        setMigrateResult({ ok: true, message: `Applied ${body.applied} idempotent statements (0001_devtools). Existing data is untouched.` });
        reload();
      } else {
        setMigrateResult({ ok: false, message: body.error ?? `Migration failed (${res.status})` });
      }
    } catch {
      setMigrateResult({ ok: false, message: "Network error while running the migration." });
    } finally {
      setMigrating(false);
    }
  };

  if (loading) return <CardSkeleton rows={5} />;
  if (error) return <ErrorAlert message={error} onRetry={reload} />;
  if (!data) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="dt-grid cols-3">
        <StatCard label="Deployment mode" value={data.app.env} sub={`env · Node ${data.app.nodeVersion}`} />
        <StatCard label="Database" value={data.database.status} dot={data.database.status === "up" ? "ok" : "err"} sub={data.database.configured ? "DATABASE_URL set" : "DATABASE_URL missing"} />
        <StatCard label="Session secret" value={data.security.adminSessionSecretConfigured ? "configured" : "missing"} dot={data.security.adminSessionSecretConfigured ? "ok" : "err"} sub="ADMIN_SESSION_SECRET" />
      </div>

      <div className="dt-card">
        <h3>Schema updates</h3>
        <p style={{ fontSize: 12.5, color: "var(--dt-text-dim)", margin: "0 0 12px", lineHeight: 1.6 }}>
          The DevTools additions (activity trail, request/error logs, and the <span className="mono">status</span> +{" "}
          <span className="mono">notes</span> columns on the two form tables) are applied with the idempotent script{" "}
          <span className="mono">drizzle/0001_devtools.sql</span>. You can run it here, or paste it into your database console.
          Existing rows are never modified.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <button className="dt-btn primary" onClick={runMigration} disabled={migrating}>
            {migrating ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <CheckCircle2 size={14} />}
            {migrating ? "Applying…" : "Apply schema updates"}
          </button>
          {migrateResult && (
            <span className={`dt-badge ${migrateResult.ok ? "ok" : "err"}`}>{migrateResult.ok ? "success" : "failed"}</span>
          )}
        </div>
        {migrateResult && <p style={{ fontSize: 12, color: "var(--dt-text-dim)", margin: "10px 0 0", lineHeight: 1.6 }}>{migrateResult.message}</p>}
      </div>

      <div className="dt-grid cols-2" style={{ alignItems: "start" }}>
        <div className="dt-card">
          <h3>Required environment</h3>
          <Kv
            rows={[
              ["DATABASE_URL", data.database.configured ? "configured" : "missing"],
              ["ADMIN_SESSION_SECRET", data.security.adminSessionSecretConfigured ? "configured" : "missing (dev fallback active)"],
            ]}
          />
          <p style={{ fontSize: 11.5, color: "var(--dt-text-faint)", marginTop: 14, marginBottom: 0, lineHeight: 1.6 }}>
            Placeholder documentation lives in <span className="mono">.env.example</span> and <span className="mono">docs/devtools.md</span>{" "}
            in the repository. Values are never displayed here.
          </p>
        </div>

        <div className="dt-card">
          <h3>Security model</h3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--dt-text-dim)", lineHeight: 1.9 }}>
            <li>Signed sessions (iron-session) with a 7-day expiry; httpOnly, SameSite=Lax, Secure in production.</li>
            <li>Fail-closed: without ADMIN_SESSION_SECRET in production, no page or API under /devtools responds.</li>
            <li>Every write — login, status change, edit, delete, query, export, migration — is recorded in the activity trail.</li>
            <li>Read-only SQL console: single SELECT / WITH / EXPLAIN, 10 s timeout, 500-row cap.</li>
            <li>Secrets and credential-shaped env vars are never returned to any client.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
