"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { products, shapesOSLaunch, statusMeta } from "@/lib/products";
import { toneColor } from "./Shapes";
import { ProductRender } from "./ProductRender";
import { ArrowRight } from "./Shapes";
import { useCountdown } from "./Launch";
import { Button } from "./Button";

const ease = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The Products dropdown. Opens from the nav item on hover or focus and sits on a glass panel just
 * under the bar: the lineup on the left, the launch on the right.
 */
export function ProductsMenu({ open, onClose, id }: { open: boolean; onClose: () => void; id: string }) {
  const left = useCountdown(shapesOSLaunch.at);
  const flagship = products[0];
  const rest = products.slice(1);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={id}
          role="region"
          aria-label="Products"
          initial={{ opacity: 0, y: -6, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.985 }}
          transition={{ duration: 0.28, ease }}
          style={{ transformOrigin: "50% 0%" }}
          className="absolute left-1/2 top-[calc(100%+8px)] z-50 w-[760px] -translate-x-1/2"
        >
          <div className="glass glass-solid grid grid-cols-[1.3fr_1fr] overflow-hidden rounded-(--radius-panel) shadow-[0_30px_80px_-30px_rgb(0_0_0/0.35)]">
            <div className="flex flex-col gap-0.5 p-2.5">
              <span className="label px-3 pb-1.5 pt-2 text-ink-3">The lineup</span>
              {rest.map((p) => {
                const s = statusMeta[p.status];
                return (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    onClick={onClose}
                    className="group/row flex items-center gap-3 rounded-[10px] px-3 py-2 transition-colors duration-150 hover:bg-veil-strong focus-visible:bg-veil-strong"
                  >
                    <ProductRender slug={p.slug} className="size-10 shrink-0 rounded-[9px] border border-line" sizes="40px" />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="flex items-center gap-2">
                        <span className="text-[13.5px] font-medium text-ink">{p.name}</span>
                        <span className="label inline-flex items-center gap-1.5 text-ink-3">
                          <span className="size-1.5 rounded-full" style={{ background: toneColor[s.tone] }} />
                          {s.label}
                        </span>
                      </span>
                      <span className="truncate text-[12.5px] text-ink-2">{p.tagline}</span>
                    </span>
                    <ArrowRight size={12} className="shrink-0 text-ink-4 opacity-0 transition-all duration-200 group-hover/row:translate-x-0.5 group-hover/row:opacity-100 group-hover/row:text-ink" />
                  </Link>
                );
              })}
              <div className="hairline-t mt-1.5 flex items-center justify-between px-3 pb-1 pt-3">
                <Link href="/products" onClick={onClose} className="label inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-ink">
                  All products
                  <ArrowRight size={11} />
                </Link>
                <Link href="/labs" onClick={onClose} className="label inline-flex items-center gap-1.5 text-ink-3 transition-colors hover:text-ink">
                  Labs
                </Link>
              </div>
            </div>

            <div className="relative flex flex-col justify-end gap-3 overflow-hidden border-l border-line p-5">
              <div aria-hidden className="absolute inset-0">
                <ProductRender slug={flagship.slug} className="h-full w-full" sizes="320px" />
              </div>
              <div aria-hidden className="absolute inset-0 bg-surface [mask-image:linear-gradient(180deg,transparent_15%,black_70%)]" />
              <Link href={`/products/${flagship.slug}`} onClick={onClose} aria-label={`${flagship.name}: ${flagship.tagline}`} className="absolute inset-0 rounded-[inherit]" />
              <div className="pointer-events-none relative flex flex-col gap-3">
                <span className="label inline-flex items-center gap-2 text-ink-3">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-green opacity-60 motion-reduce:hidden" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-brand-green" />
                  </span>
                  {left === null ? "Live now" : `Launching ${shapesOSLaunch.label}`}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="h3">{flagship.name}</span>
                  <span className="text-[12.5px] leading-[1.45] text-ink-2">{flagship.tagline}</span>
                </span>
                {left && (
                  <span className="num flex items-baseline gap-1 text-[22px] text-ink" aria-label="Time until launch">
                    {left.days}
                    <span className="label text-ink-3">d</span>
                    {pad(left.hours)}
                    <span className="label text-ink-3">h</span>
                    {pad(left.minutes)}
                    <span className="label text-ink-3">m</span>
                  </span>
                )}
                <Button href={`/products/${flagship.slug}#waitlist`} size="sm" className="pointer-events-auto self-start">
                  {left === null ? "Get ShapesOS" : "Join the waitlist"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
