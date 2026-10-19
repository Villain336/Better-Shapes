"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { nav } from "@/lib/content";
import { Logo } from "./Logo";
import { Button } from "./Button";

export function Nav() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 400 && y > prev && !open);
  });

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:pt-6"
      animate={{ y: hidden ? -120 : 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav
        className={`glass mx-auto flex max-w-[1200px] items-center justify-between rounded-full py-2 pl-4 pr-2 transition-[box-shadow,background-color] duration-500 md:pl-5 ${
          scrolled ? "shadow-[0_20px_50px_-20px_rgba(20,30,60,0.25)]" : ""
        }`}
        aria-label="Main"
      >
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="relative block rounded-full px-4 py-2.5 text-[15px] font-medium tracking-[-0.01em] text-ink"
              >
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-raised shadow-[inset_0_1px_0_white,0_4px_12px_-4px_rgba(20,30,60,0.12)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button href="/about#contact">Let’s talk</Button>
        </div>

        <button
          className="glass-ink grid size-11 place-items-center rounded-full md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="relative block h-3 w-4">
            <motion.span
              className="absolute left-0 top-0 h-[1.6px] w-4 rounded bg-white"
              animate={open ? { top: 5, rotate: 45 } : { top: 0, rotate: 0 }}
            />
            <motion.span
              className="absolute bottom-0 left-0 h-[1.6px] w-4 rounded bg-white"
              animate={open ? { bottom: 5, rotate: -45 } : { bottom: 0, rotate: 0 }}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="glass mx-auto mt-2 max-w-[1200px] rounded-[28px] p-3 md:hidden"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="flex flex-col">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    href={item.href}
                    className={`block rounded-2xl px-4 py-3 text-2xl font-medium tracking-[-0.03em] ${
                      isActive(item.href) ? "bg-raised" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="p-2 pt-3">
              <Button href="/about#contact" className="w-full">
                Let’s talk
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
