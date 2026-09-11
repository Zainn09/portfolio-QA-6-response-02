"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

/**
 * State-free theme toggle: both icons are always rendered and CSS
 * (driven by html[data-theme]) crossfades + rotates between them.
 * No React state in the visuals = no hydration mismatch, ever.
 */
export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark and light mode"
      title="Toggle dark and light mode"
      className="theme-toggle"
    >
      <span className="theme-toggle-icons" aria-hidden="true">
        <Sun size={16} strokeWidth={2} className="theme-icon theme-icon-sun" />
        <Moon size={16} strokeWidth={2} className="theme-icon theme-icon-moon" />
      </span>
    </button>
  );
}
