"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Tone } from "@/lib/content";
import { Reveal } from "./Reveal";
import { Button } from "./Button";
import { Accent } from "./Accent";
import { Eyebrow } from "./Eyebrow";
import { Panel } from "./Panel";
import { toneColor } from "./Shapes";

const ease = [0.22, 1, 0.36, 1] as const;

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  side,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: React.ReactNode;
  side?: React.ReactNode;
}) {
  return (
    <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="flex max-w-[680px] flex-col gap-4">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="h2 text-ink">
          {title} {accent && <Accent text={accent} />}
        </h2>
        {description && <p className="body max-w-[560px]">{description}</p>}
      </div>
      {side && <div className="shrink-0">{side}</div>}
    </Reveal>
  );
}

/** Four facts, hairlines above and below, dividers between. */
export function StatStrip({ items }: { items: { label: string; value: string; note?: string }[] }) {
  return (
    <Reveal className="hairline-t hairline-b grid grid-cols-2 md:grid-cols-4">
      {items.map((s, i) => (
        <div
          key={s.label}
          className={`flex flex-col gap-3 py-6 pr-4 ${i % 2 === 1 ? "border-l border-line pl-6" : ""} ${
            i >= 2 ? "border-t border-line md:border-t-0 md:border-l md:pl-6" : ""
          }`}
        >
          <span className="label text-ink-3">{s.label}</span>
          <span className="num text-[30px] md:text-[34px]">{s.value}</span>
          {s.note && <span className="small text-ink-3">{s.note}</span>}
        </div>
      ))}
    </Reveal>
  );
}

/** A slow row of small tags between hairlines. Pauses on hover. */
export function Marquee({ items, label }: { items: { text: string; tone?: Tone }[]; label?: string }) {
  const row = [...items, ...items];
  return (
    <div className="marquee-group hairline-t hairline-b flex items-center gap-6 py-3">
      {label && <span className="label hidden shrink-0 text-ink-3 md:block">{label}</span>}
      <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="animate-marquee flex w-max gap-2.5 pr-2.5">
          {row.map((c, i) => (
            <span
              key={i}
              className="inline-flex h-7 items-center gap-2 whitespace-nowrap rounded-[8px] border border-line bg-surface px-2.5 text-[12.5px] font-medium text-ink-2"
            >
              {c.tone && <span className="size-1.5 rounded-full" style={{ background: toneColor[c.tone] }} />}
              {c.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Numbered steps along a single hairline. */
export function Timeline({ steps }: { steps: { n: string; title: string; body: string; tone?: Tone }[] }) {
  return (
    <Reveal className={`grid gap-8 sm:grid-cols-2 ${steps.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
      {steps.map((s, i) => (
        <div key={s.n} className="relative flex flex-col gap-3 pt-9">
          <div className="absolute left-0 right-0 top-[11px] flex items-center">
            <span
              className="grid size-6 shrink-0 place-items-center rounded-full border border-line-strong bg-surface font-mono text-[10px] font-medium text-ink"
              style={s.tone ? { borderColor: toneColor[s.tone] } : undefined}
            >
              {s.n.replace(/^0/, "")}
            </span>
            {i < steps.length - 1 && <span className="ml-2 h-px flex-1 bg-line-strong" />}
          </div>
          <span className="label text-ink-3">Step {s.n}</span>
          <h3 className="h3">{s.title}</h3>
          <p className="small max-w-[280px]">{s.body}</p>
        </div>
      ))}
    </Reveal>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <Panel className="overflow-hidden">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={i > 0 ? "hairline-t" : ""}>
            <button
              className="flex w-full cursor-pointer items-center justify-between gap-6 px-5 py-4.5 text-left md:px-6"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
            >
              <span className="text-[15px] font-medium tracking-[-0.005em] text-ink">{item.q}</span>
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                  isOpen ? "border-ink bg-ink text-white" : "border-line-strong text-ink"
                }`}
              >
                <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden>
                  <path d="M1 6h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <motion.path
                    d="M6 1v10"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    animate={{ scaleY: isOpen ? 0 : 1 }}
                    transition={{ duration: 0.3, ease }}
                    style={{ originY: "50%" }}
                  />
                </svg>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <p className="small max-w-[640px] px-5 pb-5 md:px-6">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </Panel>
  );
}

/** Closing band on a painting: headline left, actions right. */
export function CtaBand({
  image,
  title = "Let’s give your idea",
  accent = "a better shape.",
  body = "Book a free 30-minute shaping session. Leave with a clear plan — whether or not we work together.",
}: {
  image: string;
  title?: string;
  accent?: string;
  body?: string;
}) {
  return (
    <section className="container-x pb-20">
      <Reveal className="frame relative isolate min-h-[420px] md:min-h-[460px]">
        <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_20%,rgba(0,0,0,0.3)_55%,rgba(0,0,0,0.7)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-8 p-6 md:flex-row md:items-end md:p-10">
          <div className="flex max-w-[560px] flex-col gap-4 text-white">
            <h2 className="h2">
              {title} <span className="text-white/70">{accent}</span>
            </h2>
            <p className="text-[15px] leading-[1.55] text-white/85">{body}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Button href="/about#contact" variant="white">
              Book a call
            </Button>
            <Button href="/pricing" variant="glass">
              See pricing
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
