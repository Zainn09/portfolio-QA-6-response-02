"use client";

import { useEffect, useState } from "react";

export function Toc({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const heads = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (heads.length === 0) return;
    const onScroll = () => {
      const line = window.innerHeight * 0.28;
      let cur = heads[0].id;
      for (const h of heads) {
        if (h.getBoundingClientRect().top <= line) cur = h.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <>
      {items.map((it) => (
        <a key={it.id} href={`#${it.id}`} className="toc-link" data-active={active === it.id}>
          {it.text}
        </a>
      ))}
    </>
  );
}
