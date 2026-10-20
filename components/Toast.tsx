"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Close } from "./Shapes";

type Tone = "success" | "info" | "error";
type Toast = { id: number; title: string; body?: string; tone: Tone };
type Ctx = { toast: (t: Omit<Toast, "id"> & { duration?: number }) => void };

const ToastContext = createContext<Ctx | null>(null);
const ease = [0.22, 1, 0.36, 1] as const;

const dot: Record<Tone, string> = {
  success: "bg-brand-green",
  info: "bg-brand-blue",
  error: "bg-brand-red",
};

/**
 * Small confirmations that slide in at the bottom right (bottom centre on phones) and leave on
 * their own. One provider at the root; call `useToast().toast(...)` anywhere.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), []);

  const toast = useCallback<Ctx["toast"]>(
    ({ duration = 4500, ...t }) => {
      const id = ++seq.current;
      setItems((l) => [...l.slice(-2), { id, ...t }]);
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-[calc(76px+env(safe-area-inset-bottom))] z-[80] flex flex-col items-center gap-2 md:inset-x-auto md:bottom-6 md:right-6 md:items-end"
      >
        <AnimatePresence initial={false}>
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.35, ease }}
              role="status"
              className="glass glass-solid pointer-events-auto flex w-full max-w-[380px] items-start gap-3 rounded-(--radius-card) p-3.5 pr-2.5"
            >
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-ink text-on-ink">
                {t.tone === "success" ? <Check size={12} /> : <span className={`size-1.5 rounded-full ${dot[t.tone]}`} />}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
                <span className="text-[14px] font-medium leading-[1.3] text-ink">{t.title}</span>
                {t.body && <span className="small">{t.body}</span>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-[8px] text-ink-3 transition-colors hover:bg-veil hover:text-ink"
              >
                <Close size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
