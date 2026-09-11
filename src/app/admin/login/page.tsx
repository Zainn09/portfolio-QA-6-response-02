"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.push("/admin");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-secondary)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.375rem" }}>
            QA Specialist
          </p>
          <h1 style={{ fontSize: "1.5rem", letterSpacing: "-0.03em" }}>Admin Panel</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            padding: "2rem",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--bg-surface)",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <div>
            <label
              htmlFor="email"
              style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.375rem" }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.9375rem",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.375rem" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.9375rem",
                outline: "none",
              }}
            />
          </div>

          {error && (
            <p
              role="alert"
              style={{
                fontSize: "0.875rem",
                color: "var(--critical)",
                padding: "0.75rem",
                backgroundColor: "rgba(224, 82, 82, 0.08)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--critical)",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "var(--accent)",
              color: "#000",
              fontWeight: 700,
              fontSize: "0.9375rem",
              padding: "0.875rem",
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all var(--transition-fast)",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", textAlign: "center" }}>
            Default: admin@qaspecialist.com / admin123
            <br />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem" }}>
              Seed via POST /api/admin/seed
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
