"use client";

import { useEffect } from "react";

/**
 * The homepage is a tall pinned-scroll experience; browsers that restore the
 * previous scroll position on reload land visitors mid-page (or at the
 * bottom). Always start at the top instead.
 */
export function ScrollToTopOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return null;
}
