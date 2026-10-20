"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { featuredPost, nav, posts } from "@/lib/content";
import { products, shapesOSLaunch, statusMeta } from "@/lib/products";
import { Kbd } from "./Primitives";
import { ProductRender } from "./ProductRender";
import { ArrowRight, Circle, Close, Doc, Grid, LBlock, Mail, Quarter, Search, Sparkle, Triangle } from "./Shapes";
import { useLayer, useModKey, useSiteUI } from "./SiteUI";
import { useTheme } from "./Theme";

const ease = [0.22, 1, 0.36, 1] as const;

const pageIcons: Record<string, React.ReactNode> = {
  "/": <Grid size={14} />,
  "/work": <Quarter size={12} color="currentColor" />,
  "/products": <Triangle size={12} color="currentColor" />,
  "/pricing": <Circle size={12} color="currentColor" />,
  "/blog": <Doc size={14} />,
  "/about": <LBlock size={12} color="currentColor" />,
  "/labs": <Sparkle size={14} />,
};

type Item = {
  id: string;
  group: "Pages" | "Products" | "Essays" | "Actions";
  title: string;
  subtitle?: string;
  keywords?: string;
  icon: React.ReactNode;
  run: () => void;
};

function useItems(close: () => void): Item[] {
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const { setBrief } = useSiteUI();

  return useMemo(() => {
    const go = (href: string) => () => {
      close();
      router.push(href);
    };
    const pages: Item[] = [...nav, { label: "Labs", href: "/labs" }].map((n) => ({
      id: `page-${n.href}`,
      group: "Pages",
      title: n.label,
      subtitle: n.href === "/" ? "bettershapes" : n.href,
      icon: pageIcons[n.href] ?? <Grid size={14} />,
      run: go(n.href),
    }));
    const prods: Item[] = products.map((p) => ({
      id: `product-${p.slug}`,
      group: "Products",
      title: p.name,
      subtitle: `${p.lane} · ${statusMeta[p.status].label}`,
      keywords: `${p.tagline} ${p.description}`,
      icon: <ProductRender slug={p.slug} className="size-7 rounded-[7px]" sizes="28px" />,
      run: go(`/products/${p.slug}`),
    }));
    const essays: Item[] = [featuredPost, ...posts].map((e) => ({
      id: `essay-${e.slug}`,
      group: "Essays",
      title: e.title,
      subtitle: `${e.category} · ${e.minutes} min read`,
      keywords: e.excerpt,
      icon: <Doc size={14} />,
      run: go(`/blog/${e.slug}`),
    }));
    const actions: Item[] = [
      {
        id: "act-theme",
        group: "Actions",
        title: theme === "dark" ? "Switch to day" : "Switch to dusk",
        subtitle: "Light and dark mode",
        keywords: "theme dark light mode night",
        icon: <Sparkle size={14} />,
        run: () => {
          toggle();
          close();
        },
      },
      {
        id: "act-call",
        group: "Actions",
        title: "Book a shaping session",
        subtitle: "Free, 30 minutes, we reply within a business day",
        keywords: "contact talk call email hire",
        icon: <Mail size={14} />,
        run: go("/about#contact"),
      },
      {
        id: "act-brief",
        group: "Actions",
        title: "Start the quick brief",
        subtitle: "Sixty seconds, then straight into the contact form",
        keywords: "brief quote start project",
        icon: <Sparkle size={14} />,
        run: () => {
          close();
          setBrief(true);
        },
      },
      {
        id: "act-waitlist",
        group: "Actions",
        title: "Join the ShapesOS waitlist",
        subtitle: `Launching ${shapesOSLaunch.label}`,
        keywords: "shapesos launch waitlist",
        icon: <ArrowRight size={14} />,
        run: go(`/products/${shapesOSLaunch.slug}#waitlist`),
      },
    ];
    return [...pages, ...actions, ...prods, ...essays];
  }, [close, router, theme, toggle, setBrief]);
}

/** 0 = title starts with the query, 1 = title contains it, 2 = subtitle, 3 = keywords, -1 = no match. */
function score(item: Item, q: string) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const title = item.title.toLowerCase();
  const sub = `${item.subtitle ?? ""} ${item.group}`.toLowerCase();
  const keys = (item.keywords ?? "").toLowerCase();
  if (!words.every((w) => title.includes(w) || sub.includes(w) || keys.includes(w))) return -1;
  if (title.startsWith(words[0])) return 0;
  if (words.every((w) => title.includes(w))) return 1;
  if (words.every((w) => title.includes(w) || sub.includes(w))) return 2;
  return 3;
}

const groups: Item["group"][] = ["Pages", "Actions", "Products", "Essays"];

/**
 * ⌘K. Pages, products, essays and a few actions in one searchable list. Arrow keys move, Enter goes,
 * Escape closes. Opens from the search button in the nav, the mobile dock, or the keyboard.
 */
export function CommandPalette() {
  const { palette, setPalette } = useSiteUI();
  const close = useCallback(() => setPalette(false), [setPalette]);
  const items = useItems(close);
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const mod = useModKey();

  useLayer(palette, close);

  const sections = useMemo(() => {
    let scored: { item: Item; s: number }[];
    if (q) {
      scored = items.map((item) => ({ item, s: score(item, q) })).filter((x) => x.s >= 0);
    } else {
      // Empty query: keep it short. Pages, actions and the first three products.
      const firstProducts = items.filter((it) => it.group === "Products").slice(0, 3);
      scored = items
        .filter((it) => it.group === "Pages" || it.group === "Actions" || firstProducts.includes(it))
        .map((item) => ({ item, s: 0 }));
    }
    const out = groups
      .map((g) => {
        const rows = scored.filter((x) => x.item.group === g).sort((a, b) => a.s - b.s);
        return { group: g, rows: rows.map((x) => x.item), best: rows[0]?.s ?? 9 };
      })
      .filter((sec) => sec.rows.length);
    // With a query, the section holding the best match floats to the top.
    return q ? out.sort((a, b) => a.best - b.best) : out;
  }, [items, q]);
  const results = useMemo(() => sections.flatMap((s) => s.rows), [sections]);

  useEffect(() => {
    if (palette) {
      setQ("");
      setCursor(0);
      const t = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(t);
    }
  }, [palette]);

  useEffect(() => setCursor(0), [q]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${cursor}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[cursor]?.run();
    }
  };

  let index = -1;

  return (
    <AnimatePresence>
      {palette && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button type="button" aria-label="Close" onClick={close} className="absolute inset-0 cursor-default bg-canvas/70 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal
            aria-label="Search and commands"
            initial={{ opacity: 0, y: 10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.985 }}
            transition={{ duration: 0.3, ease }}
            className="glass glass-solid relative flex w-full max-w-[640px] flex-col overflow-hidden rounded-(--radius-panel)"
          >
            <div className="hairline-b flex items-center gap-3 px-4 py-3">
              <Search size={15} className="shrink-0 text-ink-3" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Search pages, products, essays…"
                aria-label="Search"
                className="no-ring h-8 flex-1 bg-transparent text-[15px] text-ink placeholder:text-ink-3"
                autoComplete="off"
                spellCheck={false}
              />
              <span className="hidden sm:inline-flex">
                <Kbd>esc</Kbd>
              </span>
              <button type="button" onClick={close} aria-label="Close" className="grid size-8 cursor-pointer place-items-center rounded-[8px] text-ink-3 hover:text-ink sm:hidden">
                <Close size={13} />
              </button>
            </div>

            <div ref={listRef} className="max-h-[min(56vh,480px)] overflow-y-auto overscroll-contain p-2">
              {results.length === 0 && (
                <p className="px-3 py-8 text-center text-[14px] text-ink-3">
                  Nothing for “{q}”. Try a product name, an essay or “talk”.
                </p>
              )}
              {sections.map(({ group: g, rows }) => {
                return (
                  <div key={g} className="flex flex-col gap-0.5 pb-2">
                    <span className="label px-3 pb-1.5 pt-2 text-ink-3">{g}</span>
                    {rows.map((r) => {
                      index += 1;
                      const i = index;
                      const active = i === cursor;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          data-index={i}
                          onMouseMove={() => setCursor(i)}
                          onClick={r.run}
                          className={`flex w-full cursor-pointer items-center gap-3 rounded-[10px] px-3 py-2 text-left transition-colors duration-150 ${
                            active ? "bg-veil-strong" : "hover:bg-veil"
                          }`}
                        >
                          <span className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-[7px] border border-line bg-surface text-ink">
                            {r.icon}
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-[13.5px] font-medium text-ink">{r.title}</span>
                            {r.subtitle && <span className="truncate text-[12px] text-ink-3">{r.subtitle}</span>}
                          </span>
                          {active && <Kbd>↵</Kbd>}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="hairline-t hidden items-center gap-4 px-4 py-2.5 text-[12px] text-ink-3 sm:flex">
              <span className="inline-flex items-center gap-1.5">
                <Kbd>↑↓</Kbd> Navigate
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Kbd>↵</Kbd> Open
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5">
                <Kbd>{mod}</Kbd>
                <Kbd>K</Kbd> Toggle
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** The nav's search button: a magnifier and the shortcut. Collapses to the icon on small screens. */
export function PaletteTrigger({ className = "" }: { className?: string }) {
  const { setPalette } = useSiteUI();
  const mod = useModKey();
  return (
    <button
      type="button"
      onClick={() => setPalette(true)}
      aria-label="Search"
      aria-keyshortcuts="Meta+K Control+K"
      className={`group/search inline-flex h-9 cursor-pointer items-center gap-2 rounded-[10px] border border-line bg-surface px-2.5 text-ink-2 transition-colors duration-300 hover:border-line-strong hover:text-ink ${className}`}
    >
      <Search size={14} />
      <span className="hidden text-[13px] lg:inline">Search</span>
      <span className="hidden items-center gap-0.5 lg:inline-flex">
        <Kbd>{mod}</Kbd>
        <Kbd>K</Kbd>
      </span>
    </button>
  );
}
