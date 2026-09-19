"use client";

import { useEffect } from "react";

/**
 * The homepage is a tall pinned-scroll experience. Browsers may restore the
 * previous scroll position, or jump to a leftover #hash (e.g. /#process),
 * landing visitors mid-page. Force a clean start at the top — and keep
 * enforcing it briefly during hydration in case a late layout shift or
 * hash scroll fires after mount. Any real user interaction cancels it.
 */
export function ScrollToTopOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    let userActed = false;
    const mark = () => {
      userActed = true;
    };
    window.addEventListener("wheel", mark, { passive: true, once: true });
    window.addEventListener("touchmove", mark, { passive: true, once: true });
    window.addEventListener("keydown", mark, { once: true });

    const toTop = () => {
      if (!userActed) window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    };

    toTop();
    const timers = [120, 400, 800, 1500, 2500].map((ms) => setTimeout(toTop, ms));
    window.addEventListener("load", toTop);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("load", toTop);
    };
  }, []);

  return null;
}
