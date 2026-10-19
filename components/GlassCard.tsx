"use client";

import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
  as?: "div" | "article" | "li";
};

/**
 * Frosted glass surface with a soft light that follows the pointer —
 * the "Glass/Light" effect style from Figma plus a Blume-like spotlight.
 */
export function GlassCard({ children, className = "", strong = true, as = "div" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = as as "div";

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Tag
      ref={ref}
      onPointerMove={onMove}
      className={`group/card relative isolate overflow-hidden ${strong ? "glass" : "glass-soft"} ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,0.75), transparent 45%)",
        }}
      />
      {children}
    </Tag>
  );
}
