"use client";

import Link from "next/link";
import { useCallback } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { HeroBrief } from "./HeroBrief";
import { ArrowRight, Close, Search, Sparkle } from "./Shapes";
import { useLayer, useSiteUI } from "./SiteUI";

const ease = [0.22, 1, 0.36, 1] as const;

/** A panel that rises from the bottom edge on phones. Drag down or tap the scrim to dismiss. */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useLayer(open, onClose);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[85] md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default bg-ink/30 backdrop-blur-[2px]" />
          <motion.div
            role="dialog"
            aria-modal
            aria-label={title}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 600) onClose();
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease }}
            className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-[22px] bg-canvas pb-[env(safe-area-inset-bottom)] shadow-[0_-24px_60px_-24px_rgb(0_0_0/0.35)]"
          >
            <div className="flex flex-col items-center gap-3 px-5 pt-2.5">
              <span aria-hidden className="h-1 w-10 rounded-full bg-line-strong" />
              <div className="flex w-full items-center justify-between">
                <span className="label text-ink-3">{title}</span>
                <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 cursor-pointer place-items-center rounded-[8px] text-ink-3 hover:text-ink">
                  <Close size={13} />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto overscroll-contain px-5 pb-6 pt-3">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** The quick brief, in a sheet, for phones. */
export function BriefSheet() {
  const { brief, setBrief } = useSiteUI();
  const close = useCallback(() => setBrief(false), [setBrief]);
  return (
    <BottomSheet open={brief} onClose={close} title="Quick brief · ~60 seconds">
      <HeroBrief bare />
    </BottomSheet>
  );
}

/**
 * A small dock pinned to the bottom of the screen on phones: search, the brief, and the one call to
 * action. Hides while you scroll down and comes back when you scroll up.
 */
export function FloatingDock() {
  const { setPalette, setBrief, menu, brief, palette } = useSiteUI();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160);
  });

  const away = hidden || menu || brief || palette;

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-[calc(12px+env(safe-area-inset-bottom))] md:hidden"
      animate={{ y: away ? 96 : 0, opacity: away ? 0 : 1 }}
      transition={{ duration: 0.4, ease }}
      style={{ pointerEvents: away ? "none" : "auto" }}
    >
      <div className="glass glass-solid flex items-center gap-1 rounded-[16px] p-1.5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.4)]">
        <button
          type="button"
          onClick={() => setPalette(true)}
          aria-label="Search"
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[11px] px-3 text-[13px] font-medium text-ink transition-colors hover:bg-veil"
        >
          <Search size={14} />
          Search
        </button>
        <button
          type="button"
          onClick={() => setBrief(true)}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[11px] px-3 text-[13px] font-medium text-ink transition-colors hover:bg-veil"
        >
          <Sparkle size={14} />
          Brief
        </button>
        <Link href="/about#contact" className="inline-flex h-10 items-center gap-2 rounded-[11px] bg-ink px-4 text-[13px] font-medium text-on-ink">
          Let’s talk
          <ArrowRight size={12} />
        </Link>
      </div>
    </motion.div>
  );
}
