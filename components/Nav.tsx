"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { nav } from "@/lib/content";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { ThemeToggle } from "./Theme";
import { LaunchStrip } from "./Launch";

/** A slim bar. Transparent over the hero painting, frosted with a hairline once you scroll. */
export function Nav() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const solid = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-[background-color,border-color,backdrop-filter] duration-500 ${
          solid
            ? "border-b border-line bg-canvas/85 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        {/* The launch announcement rides above the bar and folds away once you scroll. */}
        <motion.div
          className="overflow-hidden"
          initial={false}
          animate={{
            height: scrolled && !open ? 0 : 36,
            opacity: scrolled && !open ? 0 : 1,
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hairline-b">
            <LaunchStrip />
          </div>
        </motion.div>
        <nav
          className="container-x flex h-16 items-center justify-between"
          aria-label="Main"
        >
          <Logo />

          <ul className="hidden items-center gap-0.5 md:flex">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative block rounded-[8px] px-3 py-2 text-[13.5px] font-medium transition-colors duration-300 hover:text-ink ${
                      active ? "text-ink" : "text-ink-2"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute inset-x-3 -bottom-px h-px bg-ink"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 36,
                        }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <Button href="/pricing" variant="ghost" size="sm" arrow={false}>
              Pricing
            </Button>
            <ThemeToggle />
            <Button href="/about#contact" size="sm">
              Let’s talk
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle className="size-10!" />
            <button
              className="grid size-10 cursor-pointer place-items-center rounded-[10px] border border-line bg-surface"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className="relative block h-3 w-4">
                <motion.span
                  className="absolute left-0 top-0 h-px w-4 bg-ink"
                  animate={
                    open ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }
                  }
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 h-px w-4 bg-ink"
                  animate={
                    open ? { bottom: 5, rotate: -45 } : { bottom: 0, rotate: 0 }
                  }
                  transition={{ duration: 0.3 }}
                />
              </span>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              className="container-x overflow-hidden md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="flex flex-col py-2">
                {nav.map((item) => (
                  <li key={item.href} className="hairline-t first:border-t-0">
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between py-3.5 font-display text-[22px] font-semibold tracking-[-0.02em] ${
                        isActive(item.href) ? "text-ink" : "text-ink-2"
                      }`}
                    >
                      {item.label}
                      {isActive(item.href) && (
                        <span className="size-1.5 rounded-full bg-ink" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="pb-5 pt-2">
                <Button href="/about#contact" className="w-full">
                  Let’s talk
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
