"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      style={{
        background: "none",
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
        cursor: "pointer",
        padding: "0.375rem 0.75rem",
        borderRadius: "var(--radius-sm)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.625rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        transition: "all var(--transition-fast)",
        display: "flex",
        alignItems: "center",
        gap: "0.375rem",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
      }}
    >
      {theme === "light" ? (
        <>
          <span aria-hidden="true">◐</span>
          <span>Dark</span>
        </>
      ) : (
        <>
          <span aria-hidden="true">○</span>
          <span>Light</span>
        </>
      )}
    </button>
  );
}
