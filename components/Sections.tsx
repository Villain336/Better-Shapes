"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { Button } from "./Button";
import { GlassCard } from "./GlassCard";
import { Accent } from "./Accent";

export function SectionHeading({
  eyebrow,
  title,
  accent,
  side,
}: {
  eyebrow?: string;
  title: string;
  accent: string;
  side?: React.ReactNode;
}) {
  return (
    <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="flex flex-col gap-4">
        {eyebrow && <span className="eyebrow text-ink-3">{eyebrow}</span>}
        <h2 className="text-[40px] font-semibold leading-[1.02] tracking-[-0.055em] md:text-[56px]">
          {title} <Accent text={accent} />
        </h2>
      </div>
      {side}
    </Reveal>
  );
}

/** Soft, blurred brand-color blobs that sit behind glass cards so the frosting has something to refract. */
export function Blobs({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <div className="animate-float absolute left-[2%] top-[30%] h-[320px] w-[420px] rounded-full bg-brand-blue/50 blur-[120px]" />
      <div className="animate-float absolute left-[32%] top-[48%] h-[300px] w-[380px] rounded-full bg-brand-red/35 blur-[140px] [animation-delay:-2s]" />
      <div className="animate-float absolute left-[56%] top-[24%] h-[320px] w-[420px] rounded-full bg-brand-yellow/45 blur-[140px] [animation-delay:-4s]" />
      <div className="animate-float absolute right-[0%] top-[46%] h-[320px] w-[380px] rounded-full bg-brand-green/45 blur-[140px] [animation-delay:-1s]" />
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className="animate-marquee flex w-max gap-16 pr-16">
        {row.map((c, i) => (
          <span key={i} className="whitespace-nowrap font-display text-[24px] font-semibold tracking-[-0.045em] text-ink-3/60">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={item.q} delay={i * 0.05}>
            <GlassCard strong={isOpen} className="rounded-[24px]">
              <button
                className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 pl-7 pr-5 text-left"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
              >
                <span className="text-[18px] font-semibold tracking-[-0.02em]">{item.q}</span>
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
                    isOpen ? "bg-ink text-white" : "bg-raised text-ink"
                  }`}
                >
                  <motion.svg
                    viewBox="0 0 12 12"
                    width="12"
                    height="12"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <path d="M0 6h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <motion.path
                      d="M6 0v12"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      animate={{ scaleY: isOpen ? 0 : 1 }}
                      style={{ originY: "50%" }}
                    />
                  </motion.svg>
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="max-w-[640px] pb-6 pl-7 pr-7 text-[16px] leading-[1.6] text-ink-2">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </Reveal>
        );
      })}
    </div>
  );
}

export function CtaBand({ image }: { image: string }) {
  return (
    <section className="container-x pb-24">
      <Reveal className="relative isolate overflow-hidden rounded-[40px] md:rounded-[48px]">
        <Image src={image} alt="" fill sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(250,248,244,0.85),rgba(250,248,244,0.3))] md:bg-[linear-gradient(90deg,rgba(250,248,244,0.88)_0%,rgba(250,248,244,0)_62%)]" />
        <div className="flex min-h-[460px] flex-col justify-center gap-7 p-8 md:min-h-[520px] md:p-16">
          <h2 className="text-[44px] font-semibold leading-[1.02] tracking-[-0.055em] md:text-[64px]">
            Let’s give your idea
            <br />
            <Accent text="a better shape." />
          </h2>
          <p className="max-w-[480px] text-[18px] leading-[1.5] text-ink-2 md:text-[20px]">
            Book a free 30-minute shaping session. Leave with a clear plan — whether or not we work together.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/about#contact">Book a call</Button>
            <Button href="/pricing" variant="glass">
              See pricing
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
