"use client";

import React from "react";
import { api, useAsync, CardSkeleton, ErrorAlert, Kv, StatCard } from "@/components/devtools/ui";

interface Health {
  app: {
    status: string;
    nodeVersion: string;
    env: string;
    uptimeSeconds: number;
    buildId: string | null;
    gitCommit: string | null;
    gitBranch: string | null;
    vercelUrl: string | null;
  };
  database: {
    configured: boolean;
    status: string;
    latencyMs: number | null;
    error: string | null;
    poolTotalConnections: number;
  };
  envVarsPresent: string[];
  security: { adminSessionSecretConfigured: boolean };
}

export function HealthPanel() {
  const { data, error, loading, reload } = useAsync<Health>(() => api<Health>("/api/devtools/health"), []);

  if (loading) return <CardSkeleton rows={6} />;
  if (error) return <ErrorAlert message={error} onRetry={reload} />;
  if (!data) return null;

  const db = data.database;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {!data.security.adminSessionSecretConfigured && (
        <div className="dt-alert warn" role="alert">
          <div style={{ flex: 1, fontSize: 12.5 }}>
            <strong>ADMIN_SESSION_SECRET is not configured.</strong> In production the dashboard fails closed without it — sign-in
            returns 503. Set a strong secret (32+ random characters) in your hosting environment and redeploy.
          </div>
        </div>
      )}

      <div className="dt-grid cols-4">
        <StatCard label="Application" value={data.app.status} dot="ok" sub={`Node ${data.app.nodeVersion} · ${data.app.env}`} />
        <StatCard
          label="Database"
          value={db.status}
          dot={db.status === "up" ? "ok" : "err"}
          sub={db.status === "up" ? `${db.latencyMs} ms · select 1` : db.configured ? db.error ?? "unreachable" : "DATABASE_URL missing"}
        />
        <StatCard label="Session security" value={data.security.adminSessionSecretConfigured ? "signed" : "open"} dot={data.security.adminSessionSecretConfigured ? "ok" : "err"} sub="iron-session HMAC" />
        <StatCard label="Uptime" value={`${Math.floor(data.app.uptimeSeconds / 3600)}h ${Math.floor((data.app.uptimeSeconds % 3600) / 60)}m`} sub="this server process" />
      </div>

      <div className="dt-grid cols-2" style={{ alignItems: "start" }}>
        <div className="dt-card">
          <h3>Deployment</h3>
          <Kv
            rows={[
              ["Environment", data.app.env],
              ["Node version", data.app.nodeVersion],
              ["Build ID", data.app.buildId ?? "not provided by host"],
              ["Git commit", data.app.gitCommit ?? "not provided by host"],
              ["Git branch", data.app.gitBranch ?? "not provided by host"],
              ["Vercel URL", data.app.vercelUrl ?? "not provided by host"],
              ["DB pool connections", String(db.poolTotalConnections)],
            ]}
          />
          <p style={{ fontSize: 11.5, color: "var(--dt-text-faint)", marginTop: 14, marginBottom: 0, lineHeight: 1.6 }}>
            Deployment identifiers appear automatically when hosted on Vercel. Uptime is measured per server process — on serverless
            hosting it resets on each cold start, so it is not a service-level uptime metric.
          </p>
        </div>

        <div className="dt-card">
          <h3>Configured environment variables ({data.envVarsPresent.length})</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {data.envVarsPresent.map((name) => (
              <span key={name} className="dt-badge dim">
                {name}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 11.5, color: "var(--dt-text-faint)", marginTop: 14, marginBottom: 0, lineHeight: 1.6 }}>
            Variable names only — values are never read into or returned by the dashboard, and anything with a credential-shaped name
            is not even listed.
          </p>
        </div>
      </div>
    </div>
  );
}
