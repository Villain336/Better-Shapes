"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { nav } from "@/lib/content";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { ThemeToggle } from "./Theme";
import { LaunchStrip } from "./Launch";
import { ProductsMenu } from "./MegaMenu";
import { PaletteTrigger } from "./CommandPalette";
import { Kbd, Tooltip } from "./Primitives";
import { useLayer, useModKey, useSiteUI } from "./SiteUI";
import { useTheme } from "./Theme";
import { ChevronDown, ChevronRight, Circle, Doc, LBlock, Quarter, Search, Sparkle, Triangle } from "./Shapes";

const ease = [0.22, 1, 0.36, 1] as const;

const mobileRows: { label: string; href: string; body: string; icon: React.ReactNode }[] = [
  { label: "Work", href: "/work", body: "What we’ve shaped so far", icon: <Quarter size={12} color="currentColor" /> },
  { label: "Products", href: "/products", body: "ShapesOS and five open-source tools", icon: <Triangle size={12} color="currentColor" /> },
  { label: "Pricing", href: "/pricing", body: "One flat monthly membership", icon: <Circle size={12} color="currentColor" /> },
  { label: "Blog", href: "/blog", body: "Essays from the meadow", icon: <Doc size={13} /> },
  { label: "About", href: "/about", body: "The studio, and how to reach us", icon: <LBlock size={12} color="currentColor" /> },
  { label: "Labs", href: "/labs", body: "Flock, our drone mesh OS", icon: <Sparkle size={13} /> },
];

/** A slim bar. Transparent over the hero painting, frosted with a hairline once you scroll. */
export function Nav() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const { menu: open, setMenu: setOpen, setPalette } = useSiteUI();
  const [productsOpen, setProductsOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const { theme } = useTheme();
  const mod = useModKey();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));
  useEffect(() => setProductsOpen(false), [pathname]);

  const closeMenu = useCallback(() => setOpen(false), [setOpen]);
  useLayer(open, closeMenu);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const solid = scrolled || open || productsOpen;

  const openProducts = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setProductsOpen(true);
  };
  const closeProductsSoon = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setProductsOpen(false), 140);
  };
  const closeProducts = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setProductsOpen(false);
  };

  useEffect(() => {
    if (!productsOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setProductsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [productsOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-[background-color,border-color,backdrop-filter] duration-500 ${
          solid ? "border-b border-line bg-canvas/85 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        {/* The launch announcement rides above the bar and folds away once you scroll. */}
        <motion.div
          className="overflow-hidden"
          initial={false}
          animate={{ height: scrolled && !open ? 0 : 36, opacity: scrolled && !open ? 0 : 1 }}
          transition={{ duration: 0.45, ease }}
        >
          <div className="hairline-b">
            <LaunchStrip />
          </div>
        </motion.div>

        <nav
          className="container-x relative flex h-16 items-center justify-between"
          aria-label="Main"
          onMouseLeave={closeProductsSoon}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeProducts();
          }}
        >
          <Logo />

          <ul className="hidden items-center gap-0.5 md:flex">
            {nav.map((item) => {
              const active = isActive(item.href);
              const isProducts = item.href === "/products";
              return (
                <li key={item.href} onMouseEnter={isProducts ? openProducts : closeProducts}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    aria-haspopup={isProducts ? "true" : undefined}
                    aria-expanded={isProducts ? productsOpen : undefined}
                    aria-controls={isProducts ? "products-menu" : undefined}
                    onFocus={isProducts ? openProducts : closeProducts}
                    className={`relative flex items-center gap-1 rounded-[8px] px-3 py-2 text-[13.5px] font-medium transition-colors duration-300 hover:text-ink ${
                      active ? "text-ink" : "text-ink-2"
                    }`}
                  >
                    {item.label}
                    {isProducts && (
                      <motion.span animate={{ rotate: productsOpen ? 180 : 0 }} transition={{ duration: 0.3, ease }} className="text-ink-3">
                        <ChevronDown size={11} />
                      </motion.span>
                    )}
                    {active && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute inset-x-3 -bottom-px h-px bg-ink"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <PaletteTrigger />
            <Tooltip label={theme === "dark" ? "Switch to day" : "Switch to dusk"}>
              <ThemeToggle />
            </Tooltip>
            <Button href="/about#contact" size="sm">
              Let’s talk
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle className="size-10!" />
            <button
              className="grid size-10 cursor-pointer place-items-center rounded-[10px] border border-line bg-surface"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className="relative block h-3 w-4">
                <motion.span className="absolute left-0 top-0 h-px w-4 bg-ink" animate={open ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }} transition={{ duration: 0.3 }} />
                <motion.span className="absolute bottom-0 left-0 h-px w-4 bg-ink" animate={open ? { bottom: 5, rotate: -45 } : { bottom: 0, rotate: 0 }} transition={{ duration: 0.3 }} />
              </span>
            </button>
          </div>

          <div className="hidden md:block" onMouseEnter={openProducts} onMouseLeave={closeProductsSoon}>
            <ProductsMenu id="products-menu" open={productsOpen} onClose={closeProducts} />
          </div>
        </nav>

        {/* Mobile menu: a sheet under the bar with search, the pages and the two things you can do. */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              className="md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <div className="container-x flex max-h-[calc(100dvh-104px)] flex-col gap-4 overflow-y-auto pb-6 pt-2">
                <button
                  type="button"
                  onClick={() => setPalette(true)}
                  className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-[10px] border border-line bg-surface px-3.5 text-left text-[14px] text-ink-3"
                >
                  <Search size={14} />
                  <span className="flex-1 truncate">Search the site…</span>
                  {/* Keyboard hint only where there is likely a keyboard (tablets in the mobile layout). */}
                  <span className="hidden items-center gap-0.5 sm:inline-flex">
                    <Kbd>{mod}</Kbd>
                    <Kbd>K</Kbd>
                  </span>
                </button>
                <ul className="surface flex flex-col rounded-(--radius-card)">
                  {mobileRows.map((r, i) => {
                    const active = isActive(r.href);
                    return (
                      <li key={r.href} className={i > 0 ? "hairline-t" : ""}>
                        <Link href={r.href} className="flex items-center gap-3.5 px-3.5 py-3">
                          <span className={`grid size-9 shrink-0 place-items-center rounded-[10px] border ${active ? "border-ink bg-ink text-on-ink" : "border-line bg-canvas text-ink"}`}>{r.icon}</span>
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="text-[15px] font-medium text-ink">{r.label}</span>
                            <span className="truncate text-[12.5px] text-ink-3">{r.body}</span>
                          </span>
                          <ChevronRight size={12} className="text-ink-4" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="flex flex-col gap-2">
                  <Button href="/about#contact" className="w-full">
                    Let’s talk
                  </Button>
                  <Button href="/pricing" variant="outline" className="w-full">
                    See memberships
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
