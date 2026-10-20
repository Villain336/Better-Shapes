"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ChevronRight } from "./Shapes";

const ease = [0.22, 1, 0.36, 1] as const;

/** A keyboard key, the size of a tag. */
export function Kbd({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-line bg-surface px-1.5 font-mono text-[10.5px] font-medium text-ink-3 ${className}`}
    >
      {children}
    </kbd>
  );
}

/** Square hairline button for an icon: the shape the theme toggle and the menu button already use. */
export function IconButton({
  label,
  onClick,
  href,
  children,
  className = "",
  size = "md",
  active = false,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  active?: boolean;
}) {
  const dims = { sm: "size-8 rounded-[8px]", md: "size-9 rounded-[10px]", lg: "size-10 rounded-[10px]" }[size];
  const cls = `grid ${dims} cursor-pointer place-items-center border transition-colors duration-300 ${
    active ? "border-ink bg-ink text-on-ink" : "border-line bg-surface text-ink hover:border-line-strong"
  } ${className}`;
  if (href) {
    return (
      <Link href={href} aria-label={label} title={label} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className={cls}>
      {children}
    </button>
  );
}

/**
 * A quiet label that appears above a control on hover or focus. Pure CSS positioning, so it never
 * needs a portal; keep it for short text only.
 */
export function Tooltip({
  label,
  children,
  side = "bottom",
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  side?: "top" | "bottom";
  className?: string;
}) {
  const [show, setShow] = useState(false);
  const id = useId();
  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      aria-describedby={show ? id : undefined}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: side === "bottom" ? -4 : 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === "bottom" ? -4 : 4, scale: 0.98 }}
            transition={{ duration: 0.22, ease }}
            className={`pointer-events-none absolute left-1/2 z-[70] -translate-x-1/2 whitespace-nowrap rounded-[8px] bg-ink px-2.5 py-1.5 text-[12px] font-medium text-on-ink shadow-[0_12px_30px_-12px_rgb(0_0_0/0.35)] ${
              side === "bottom" ? "top-[calc(100%+8px)]" : "bottom-[calc(100%+8px)]"
            }`}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/** A row of options with one sliding ink pill. Used for filters and the billing switch. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
  className = "",
}: {
  options: { value: T; label: React.ReactNode; hint?: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const id = useId();
  const h = size === "sm" ? "h-8 px-3 text-[13px]" : "h-9 px-3.5 text-[13.5px]";
  return (
    <LayoutGroup id={id}>
      <div className={`inline-flex gap-0.5 rounded-[10px] border border-line bg-surface p-0.5 ${className}`} role="radiogroup" aria-label={label}>
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(o.value)}
              className={`relative inline-flex ${h} cursor-pointer items-center gap-1.5 rounded-[8px] font-medium transition-colors duration-300 ${
                on ? "text-on-ink" : "text-ink-2 hover:text-ink"
              }`}
            >
              {on && (
                <motion.span
                  layoutId="segment"
                  className="absolute inset-0 rounded-[8px] bg-ink"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative">{o.label}</span>
              {o.hint && (
                <span className={`relative label normal-case tracking-normal ${on ? "text-on-ink/70" : "text-ink-3"}`}>{o.hint}</span>
              )}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

/** Where you are, in mono. The last crumb is the current page. */
export function Breadcrumb({ items, className = "" }: { items: { label: string; href?: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`label flex flex-wrap items-center gap-1.5 text-ink-3 ${className}`}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${it.label}-${i}`} className="inline-flex items-center gap-1.5">
            {it.href && !last ? (
              <Link href={it.href} className="transition-colors hover:text-ink">
                {it.label}
              </Link>
            ) : (
              <span aria-current={last ? "page" : undefined} className={last ? "text-ink" : ""}>
                {it.label}
              </span>
            )}
            {!last && <ChevronRight size={10} className="text-ink-4" />}
          </span>
        );
      })}
    </nav>
  );
}
