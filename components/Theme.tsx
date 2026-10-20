"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type Theme = "light" | "dark";
export const THEME_KEY = "better-shapes:theme";

/**
 * Runs before paint, inline in <head>, so the first frame is already the right time of day.
 * Keep it dependency-free and in sync with `applyTheme` below.
 */
export const themeInitScript = `(function(){try{var k="${THEME_KEY}";var s=localStorage.getItem(k);var d=s?s==="dark":matchMedia("(prefers-color-scheme: dark)").matches;var c=document.documentElement.classList;d?c.add("dark"):c.remove("dark");}catch(e){}})();`;

type Ctx = { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void };
const ThemeContext = createContext<Ctx | null>(null);

function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Flip the class with a brief, page-wide colour transition so every surface fades at once. */
function applyTheme(t: Theme, animate: boolean) {
  const root = document.documentElement;
  if (animate) {
    root.classList.add("theme-transition");
    window.setTimeout(() => root.classList.remove("theme-transition"), 800);
  }
  root.classList.toggle("dark", t === "dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Matches the init script on first render so there's no hydration mismatch, then follows the class.
  const [theme, setThemeState] = useState<Theme>("light");
  const reduce = useReducedMotion();

  useEffect(() => {
    setThemeState(readTheme());
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onSystem = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(THEME_KEY)) return;
      const next: Theme = e.matches ? "dark" : "light";
      applyTheme(next, true);
      setThemeState(next);
    };
    mq.addEventListener("change", onSystem);
    return () => mq.removeEventListener("change", onSystem);
  }, []);

  const setTheme = useCallback(
    (t: Theme) => {
      applyTheme(t, !reduce);
      try {
        localStorage.setItem(THEME_KEY, t);
      } catch {}
      setThemeState(t);
    },
    [reduce],
  );

  const value = useMemo<Ctx>(
    () => ({ theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") }),
    [theme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

/**
 * Day / dusk switch. A sun that sets: the disc sinks behind a horizon line and the rays become stars.
 * Rendered as one button so it reads as a single control.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  const clipId = useId();
  const t = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to day" : "Switch to dusk"}
      aria-pressed={dark}
      title={dark ? "Day" : "Dusk"}
      className={`group/theme grid size-9 cursor-pointer place-items-center rounded-[10px] border border-line bg-surface text-ink transition-colors duration-300 hover:border-line-strong ${className}`}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden className="overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width="24" height="17" />
          </clipPath>
        </defs>
        {/* horizon */}
        <motion.line
          x1="4"
          x2="20"
          y1="17"
          y2="17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ opacity: dark ? 0.6 : 0.35 }}
          transition={t}
        />
        {/* sun: sinks behind the horizon at dusk, leaving a sliver of afterglow */}
        <g clipPath={`url(#${clipId})`}>
          <motion.circle
            cx="12"
            cy="11"
            r="3.6"
            fill="currentColor"
            animate={{ y: dark ? 5 : 0, opacity: dark ? 0.55 : 1 }}
            transition={t}
          />
        </g>
        {/* rays by day */}
        <motion.g
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ opacity: dark ? 0 : 1, rotate: dark ? 40 : 0, scale: dark ? 0.6 : 1 }}
          style={{ originX: "12px", originY: "11px" }}
          transition={t}
        >
          <line x1="12" y1="3" x2="12" y2="4.6" />
          <line x1="18.4" y1="4.6" x2="17.3" y2="5.7" />
          <line x1="5.6" y1="4.6" x2="6.7" y2="5.7" />
          <line x1="20" y1="11" x2="18.4" y2="11" />
          <line x1="4" y1="11" x2="5.6" y2="11" />
        </motion.g>
        {/* stars at dusk */}
        <motion.g fill="currentColor" animate={{ opacity: dark ? 1 : 0, scale: dark ? 1 : 0.6 }} style={{ originX: "12px", originY: "9px" }} transition={{ ...t, delay: dark ? 0.2 : 0 }}>
          <circle cx="6.5" cy="6" r="1.25" />
          <circle cx="17" cy="4" r="1" />
          <circle cx="19" cy="10.5" r="1.1" />
          <circle cx="12" cy="6.5" r="0.85" />
        </motion.g>
      </svg>
    </button>
  );
}
