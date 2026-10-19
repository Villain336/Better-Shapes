"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { shapesOSLaunch } from "@/lib/content";
import { Button } from "./Button";
import { Chip } from "./Chip";
import { CompactNewsletterForm } from "./Forms";
import { ArrowUpRight } from "./Shapes";

const ease = [0.22, 1, 0.36, 1] as const;
const AUTOPLAY_MS = 6000;

/** Days, hours, minutes and seconds until `target`, or null once it has passed. Null before mount, so the server and first client render agree. */
function useCountdown(target: string) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return undefined;
  const left = new Date(target).getTime() - now;
  if (left <= 0) return null;
  const s = Math.floor(left / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}

function LaunchCard() {
  const left = useCountdown(shapesOSLaunch.at);
  const units: [string, number | undefined][] = [
    ["Days", left?.days],
    ["Hours", left?.hours],
    ["Mins", left?.minutes],
    ["Secs", left?.seconds],
  ];
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="caption flex items-center gap-2 text-ink-3">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-green opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-brand-green" />
          </span>
          ShapesOS launch
        </span>
        <Chip tone="blue">{shapesOSLaunch.label}</Chip>
      </div>
      <h3 className="font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.045em]">
        {left === null ? "ShapesOS is live." : "The agentic business OS is almost here."}
      </h3>
      {left !== null && (
        <div className="grid grid-cols-4 gap-2" role="timer" aria-label={`Time until ShapesOS launches on ${shapesOSLaunch.label}`}>
          {units.map(([label, value]) => (
            <div key={label} className="flex flex-col items-center rounded-[16px] bg-white/55 py-2.5">
              <span className="font-display text-[28px] font-semibold leading-none tracking-[-0.05em] tabular-nums">
                {value === undefined ? "--" : String(value).padStart(2, "0")}
              </span>
              <span className="caption mt-1 text-ink-3">{label}</span>
            </div>
          ))}
        </div>
      )}
      <Button href="/products/shapesos" className="mt-auto self-start">
        {left === null ? "Get ShapesOS" : "Join the waitlist"}
      </Button>
    </>
  );
}

function NewsletterCard() {
  return (
    <>
      <span className="caption text-ink-3">Newsletter</span>
      <h3 className="font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.045em]">
        One calm, useful email a month.
      </h3>
      <p className="text-[15px] leading-[1.5] text-ink-2">Launch news, what we’re building and what we’re learning. No spam.</p>
      <div className="mt-auto">
        <CompactNewsletterForm id="hero-newsletter-email" />
      </div>
    </>
  );
}

function ContactCard() {
  return (
    <>
      <span className="caption text-ink-3">Work with us</span>
      <h3 className="font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.045em]">Got something to shape?</h3>
      <p className="text-[15px] leading-[1.5] text-ink-2">
        Book a free 30-minute shaping session. You leave with a clear plan, whether or not we work together.
      </p>
      <Button href="/about#contact" className="mt-auto self-start">
        Book a session
      </Button>
    </>
  );
}

const cards = [
  { key: "launch", label: "ShapesOS launch countdown", Body: LaunchCard },
  { key: "newsletter", label: "Newsletter", Body: NewsletterCard },
  { key: "contact", label: "Contact", Body: ContactCard },
];

/** The home hero's card deck: the front card is live, the others peek out behind and rotate forward. */
export function HeroDeck() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = cards.length;

  useEffect(() => {
    if (paused || reduce) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % n), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, paused, reduce, n]);

  const go = (i: number) => setActive(((i % n) + n) % n);

  return (
    <div
      className="relative mx-auto w-full max-w-[380px] lg:mx-0 lg:justify-self-end"
      role="region"
      aria-roledescription="carousel"
      aria-label="Highlights"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="relative h-[400px] pt-8">
        {cards.map(({ key, label, Body }, i) => {
          const pos = (i - active + n) % n; // 0 = front
          return (
            <motion.div
              key={key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}: ${label}`}
              aria-hidden={pos !== 0}
              inert={pos !== 0}
              onClick={pos !== 0 ? () => go(i) : undefined}
              className={`glass absolute inset-x-0 bottom-0 flex h-[368px] flex-col gap-4 rounded-[32px] p-6 ${pos !== 0 ? "cursor-pointer" : ""}`}
              initial={false}
              animate={{
                y: pos * -20,
                scale: 1 - pos * 0.05,
                rotate: pos === 0 ? 0 : pos === 1 ? -2.5 : 2.5,
                opacity: pos === 2 ? 0.7 : 1,
                zIndex: n - pos,
              }}
              transition={{ duration: reduce ? 0 : 0.7, ease }}
            >
              <div className={`flex h-full flex-col gap-4 transition-opacity duration-500 ${pos === 0 ? "opacity-100" : "opacity-0"}`}>
                <Body />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex gap-2">
          {cards.map(({ key, label }, i) => (
            <button
              key={key}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${label}`}
              aria-current={i === active}
              className={`h-2 cursor-pointer rounded-full transition-all duration-500 ${i === active ? "w-7 bg-ink" : "w-2 bg-ink/40 hover:bg-ink/60"}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Previous card"
            className="glass grid size-10 cursor-pointer place-items-center rounded-full"
          >
            <ArrowUpRight className="-rotate-[135deg]" />
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Next card"
            className="glass grid size-10 cursor-pointer place-items-center rounded-full"
          >
            <ArrowUpRight className="rotate-45" />
          </button>
        </div>
      </div>
    </div>
  );
}
