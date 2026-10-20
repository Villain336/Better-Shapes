"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";

type Ctx = {
  palette: boolean;
  setPalette: (open: boolean) => void;
  brief: boolean;
  setBrief: (open: boolean) => void;
  menu: boolean;
  setMenu: (open: boolean) => void;
};

const UIContext = createContext<Ctx | null>(null);

/** Which floating layer is open: the ⌘K palette, the mobile brief sheet, the mobile menu. One at a time. */
export function SiteUIProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPaletteState] = useState(false);
  const [brief, setBriefState] = useState(false);
  const [menu, setMenuState] = useState(false);
  const pathname = usePathname();

  const setPalette = useCallback((o: boolean) => {
    setPaletteState(o);
    if (o) {
      setBriefState(false);
      setMenuState(false);
    }
  }, []);
  const setBrief = useCallback((o: boolean) => {
    setBriefState(o);
    if (o) {
      setPaletteState(false);
      setMenuState(false);
    }
  }, []);
  const setMenu = useCallback((o: boolean) => {
    setMenuState(o);
    if (o) {
      setPaletteState(false);
      setBriefState(false);
    }
  }, []);

  useEffect(() => {
    setPaletteState(false);
    setBriefState(false);
    setMenuState(false);
  }, [pathname]);

  // ⌘K / Ctrl+K anywhere opens the palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteState((o) => !o);
        setBriefState(false);
        setMenuState(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(() => ({ palette, setPalette, brief, setBrief, menu, setMenu }), [palette, setPalette, brief, setBrief, menu, setMenu]);
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useSiteUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useSiteUI must be used inside SiteUIProvider");
  return ctx;
}

/** Freeze the page (and Lenis) while a layer is open; Escape closes it. */
export function useLayer(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
}

/** Lets the ⌘ hint read as Ctrl on non-Mac keyboards. */
export function useModKey() {
  const [mod, setMod] = useState("⌘");
  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform) && !/Mac/.test(navigator.userAgent)) setMod("Ctrl");
  }, []);
  return mod;
}
