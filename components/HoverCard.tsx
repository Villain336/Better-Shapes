"use client";

import Link from "next/link";
import { Fragment, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { products, statusMeta, type Product } from "@/lib/products";
import { ProductRender } from "./ProductRender";
import { ArrowRight, toneColor } from "./Shapes";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * A small preview that opens from an inline link after a short pause. Keyboard users get it on focus.
 * The card is positioned under the trigger and flips to the right edge if it would overflow.
 */
export function HoverCard({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const timer = useRef<number | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId();

  const show = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const r = ref.current?.getBoundingClientRect();
      setAlignRight(!!r && r.left + 300 > window.innerWidth - 16);
      setOpen(true);
    }, 160);
  };
  const hide = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <span
      ref={ref}
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hide();
      }}
      aria-describedby={open ? id : undefined}
    >
      {trigger}
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.25, ease }}
            style={{ transformOrigin: alignRight ? "100% 0%" : "0% 0%" }}
            className={`glass glass-solid absolute top-[calc(100%+10px)] z-[70] block w-[300px] overflow-hidden rounded-(--radius-card) text-left font-sans text-[13px] font-normal normal-case tracking-normal shadow-[0_30px_80px_-30px_rgb(0_0_0/0.35)] ${
              alignRight ? "right-0" : "left-0"
            }`}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/** The card's body for a product: render, lane, status, tagline, link. */
export function ProductPreview({ product }: { product: Product }) {
  const s = statusMeta[product.status];
  return (
    <span className="flex flex-col">
      <ProductRender slug={product.slug} className="aspect-[16/9]" sizes="300px" />
      <span className="flex flex-col gap-2 p-3.5">
        <span className="flex items-center justify-between">
          <span className="label text-ink-3">{product.lane}</span>
          <span className="label inline-flex items-center gap-1.5 text-ink-3">
            <span className="size-1.5 rounded-full" style={{ background: toneColor[s.tone] }} />
            {s.label}
          </span>
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="h3 text-[17px] leading-[1.2]">{product.name}</span>
          <span className="text-[13px] leading-[1.45] text-ink-2">{product.tagline}</span>
        </span>
        <Link href={`/products/${product.slug}`} className="label mt-1 inline-flex items-center gap-1.5 text-ink transition-colors hover:text-ink-2">
          Open {product.name}
          <ArrowRight size={11} />
        </Link>
      </span>
    </span>
  );
}

const nameRe = new RegExp(`\\b(${products.map((p) => p.name).join("|")})\\b`, "g");

/**
 * Renders a sentence with every product name turned into a link that previews the product on hover.
 * Skips the product the page is already about.
 */
export function ProductMentions({ text, except }: { text: string; except?: string }) {
  const parts = text.split(nameRe);
  return (
    <>
      {parts.map((part, i) => {
        const p = products.find((x) => x.name === part);
        if (!p || p.slug === except) return <Fragment key={i}>{part}</Fragment>;
        return (
          <HoverCard
            key={i}
            trigger={
              <Link href={`/products/${p.slug}`} className="underline decoration-line-strong decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-ink">
                {p.name}
              </Link>
            }
          >
            <ProductPreview product={p} />
          </HoverCard>
        );
      })}
    </>
  );
}
