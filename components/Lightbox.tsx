"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { products, statusMeta } from "@/lib/products";
import { projects } from "@/lib/content";
import { Chip } from "./Chip";
import { ProductRender, productRender, RENDER_BG } from "./ProductRender";
import { ChevronRight, Close, Expand, Grid } from "./Shapes";
import { useLayer } from "./SiteUI";
import { Tooltip } from "./Primitives";

const ease = [0.22, 1, 0.36, 1] as const;

export type LightboxItem = { src: string; alt: string; title: string; meta?: string; tag?: string; href?: string };

/**
 * Full-screen viewer: one large image, a caption, arrows and a strip of thumbnails. Arrow keys and
 * swipes move; Escape or the scrim closes.
 */
export function Lightbox({
  open,
  onClose,
  items,
  index,
  onIndex,
}: {
  open: boolean;
  onClose: () => void;
  items: LightboxItem[];
  index: number;
  onIndex: (i: number) => void;
}) {
  useLayer(open, onClose);
  const [dir, setDir] = useState(1);
  const n = items.length;

  const go = useCallback(
    (d: number) => {
      setDir(d);
      onIndex((index + d + n) % n);
    },
    [index, n, onIndex],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  const item = items[index];

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          role="dialog"
          aria-modal
          aria-label={item.title}
          className="fixed inset-0 z-[90] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default bg-canvas/95 backdrop-blur-md" />

          <div className="container-x relative flex items-center justify-between pt-5">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid size-9 cursor-pointer place-items-center rounded-[10px] border border-line bg-surface text-ink transition-colors hover:border-line-strong"
            >
              <Close size={13} />
            </button>
            <span className="label rounded-[8px] border border-line bg-surface px-2.5 py-1.5 text-ink">
              {index + 1} <span className="text-ink-4">/</span> {n}
            </span>
          </div>

          <div className="container-x relative flex min-h-0 flex-1 items-center justify-center py-4">
            {n > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous"
                  className="absolute left-2 top-1/2 z-10 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-line-strong md:left-6"
                >
                  <ChevronRight size={14} className="rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next"
                  className="absolute right-2 top-1/2 z-10 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-line-strong md:right-6"
                >
                  <ChevronRight size={14} />
                </button>
              </>
            )}
            {/* Width is capped by the viewport height too, so the 16:10 frame never pushes the caption off-screen. */}
            <div className="relative aspect-[16/10] w-[min(100%,1040px,calc((100dvh-230px)*1.6))]">
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.div
                  key={item.src}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 40, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -dir * 40, scale: 0.98 }}
                  transition={{ duration: 0.4, ease }}
                  drag={n > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70) go(1);
                    else if (info.offset.x > 70) go(-1);
                  }}
                  className="render absolute inset-0 overflow-hidden rounded-(--radius-panel) border border-line"
                  style={{ background: RENDER_BG }}
                >
                  <Image src={item.src} alt={item.alt} fill sizes="(min-width:1100px) 1040px, 100vw" className="object-cover" priority draggable={false} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="container-x relative flex flex-col gap-4 pb-[calc(20px+env(safe-area-inset-bottom))]">
            <div className="flex items-end justify-between gap-6">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-[15px] font-medium text-ink">{item.title}</span>
                {item.meta && <span className="truncate text-[13px] text-ink-3">{item.meta}</span>}
              </div>
              {item.tag && <Chip tone="blue">{item.tag}</Chip>}
            </div>
            {n > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                {items.map((it, i) => (
                  <button
                    key={it.src}
                    type="button"
                    onClick={() => {
                      setDir(i > index ? 1 : -1);
                      onIndex(i);
                    }}
                    aria-label={it.title}
                    aria-current={i === index}
                    className={`render relative h-14 w-[88px] shrink-0 cursor-pointer overflow-hidden rounded-[8px] border-2 transition-[border-color,opacity] duration-300 ${
                      i === index ? "border-ink opacity-100" : "border-transparent opacity-55 hover:opacity-100"
                    }`}
                    style={{ background: RENDER_BG }}
                  >
                    <Image src={it.src} alt="" fill sizes="88px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const productItems: LightboxItem[] = products.map((p) => ({
  src: productRender(p.slug),
  alt: `${p.name} render: ${p.meaning}`,
  title: p.name,
  meta: p.meaning,
  tag: statusMeta[p.status].label,
}));

/** The product page's render, with an expand control that opens every render in the viewer. */
export function RenderLightbox({ slug, name, meaning }: { slug: string; name: string; meaning: string }) {
  const start = Math.max(0, products.findIndex((p) => p.slug === slug));
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(start);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIndex(start);
          setOpen(true);
        }}
        aria-label={`View the ${name} render full size`}
        className="group/render relative block w-full cursor-zoom-in overflow-hidden rounded-[10px]"
      >
        <ProductRender slug={slug} alt={`${name} render: ${meaning}`} className="aspect-square" sizes="360px" />
        <span className="absolute bottom-3 right-3 grid size-8 place-items-center rounded-[8px] border border-glass-stroke bg-veil-strong text-ink opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover/render:opacity-100 group-focus-visible/render:opacity-100">
          <Expand size={13} />
        </span>
      </button>
      <Lightbox open={open} onClose={() => setOpen(false)} items={productItems} index={index} onIndex={setIndex} />
    </>
  );
}

const projectItems: LightboxItem[] = projects.map((p) => ({
  src: p.image,
  alt: `${p.title} product render`,
  title: p.title,
  meta: p.subtitle,
  tag: p.status,
  href: p.href,
}));

/** "Gallery" control for the Work grid: every render, full size. */
export function WorkGalleryButton() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  return (
    <>
      <Tooltip label="View as gallery">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="View as gallery"
          className="grid size-8 cursor-pointer place-items-center rounded-[8px] border border-line bg-surface text-ink transition-colors hover:border-line-strong"
        >
          <Grid size={13} />
        </button>
      </Tooltip>
      <Lightbox open={open} onClose={() => setOpen(false)} items={projectItems} index={index} onIndex={setIndex} />
    </>
  );
}
