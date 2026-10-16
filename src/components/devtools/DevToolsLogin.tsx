"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function DevToolsLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setError(data.error ?? `Sign-in failed (${res.status})`);
        return;
      }
      router.push("/devtools");
      router.refresh();
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-devtools className="dt-login-wrap">
      <div className="dt-login-card">
        <div className="dt-login-brand">
          <span className="dt-brand-mark" aria-hidden>
            Q
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>DevTools</div>
            <div style={{ fontFamily: "var(--dt-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dt-text-faint)" }}>
              QA control center · private
            </div>
          </div>
        </div>

        {error && (
          <div className="dt-alert err" role="alert" style={{ marginBottom: 14 }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit} noValidate>
          <div className="dt-field">
            <label className="dt-label" htmlFor="dt-email">
              Email
            </label>
            <input
              id="dt-email"
              className="dt-input"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="dt-field">
            <label className="dt-label" htmlFor="dt-password">
              Password
            </label>
            <input
              id="dt-password"
              className="dt-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="dt-btn primary" type="submit" disabled={busy || !email || !password} style={{ width: "100%", marginTop: 6 }}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={{ marginTop: 16, fontSize: 11.5, color: "var(--dt-text-faint)", lineHeight: 1.6, marginBottom: 0 }}>
          Administrator access only. Sessions are signed and expire after 7 days. Failed attempts are rate-limited and logged.
        </p>
      </div>
    </div>
  );
}
