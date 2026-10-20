"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "./Shapes";
import { Chip } from "./Chip";

export const BRIEF_KEY = "better-shapes:brief";

const needs = ["Brand identity", "Website", "Product UI", "Web or mobile app", "AI agent", "Automation", "Launch campaign", "Content & SEO"];
const timelines = ["This month", "This quarter", "Just exploring"];

/** Builds the opening line of a contact message from a brief, so the form arrives half-written. */
export function briefToMessage(b: { needs: string[]; timeline: string }) {
  const what = b.needs.length ? b.needs.join(", ").replace(/, ([^,]*)$/, " and $1") : "a project";
  return `Hi — we're shaping ${what.charAt(0).toLowerCase() + what.slice(1)} and the timeline is: ${b.timeline.toLowerCase()}.\n\n`;
}

/**
 * Sixty-second brief. Pick what you need, say when, carry it into the contact form.
 * `bare` drops the glass panel and header for hosts that already provide them (the mobile sheet).
 */
export function HeroBrief({ bare = false }: { bare?: boolean }) {
  const [picked, setPicked] = useState<string[]>(["Website"]);
  const [when, setWhen] = useState(timelines[1]);

  const toggle = (n: string) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));

  const remember = () => {
    try {
      sessionStorage.setItem(BRIEF_KEY, JSON.stringify({ needs: picked, timeline: when }));
    } catch {
      /* storage unavailable: the form just starts blank */
    }
  };

  return (
    <div className={bare ? "flex flex-col gap-5" : "glass flex flex-col gap-5 rounded-(--radius-panel) p-5 md:p-6"}>
      <div className={`flex items-center justify-between ${bare ? "hidden" : ""}`}>
        <span className="label inline-flex items-center gap-2 text-ink-2">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full rounded-full bg-brand-green opacity-70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-brand-green" />
          </span>
          Quick brief
        </span>
        <Chip>~60 seconds</Chip>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="h3">What are you shaping?</h2>
        <p className="small text-ink-3">Pick everything that applies.</p>
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="What you need">
        {needs.map((n) => {
          const on = picked.includes(n);
          return (
            <button
              key={n}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(n)}
              className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[8px] border px-2.5 text-[13px] font-medium transition-colors duration-200 ${
                on ? "border-ink bg-ink text-on-ink" : "border-line bg-veil text-ink hover:border-line-strong"
              }`}
            >
              {on && <Check size={12} />}
              {n}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <span className="label text-ink-3">Timeline</span>
        <div className="grid grid-cols-3 rounded-[10px] border border-line bg-veil p-0.5" role="radiogroup" aria-label="Timeline">
          {timelines.map((t) => {
            const on = when === t;
            return (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setWhen(t)}
                className={`h-8 cursor-pointer rounded-[8px] text-[12.5px] font-medium transition-colors duration-200 ${
                  on ? "bg-ink text-on-ink" : "text-ink-2 hover:text-ink"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div className="hairline-t flex items-center justify-between gap-4 pt-4">
        <Link href="/pricing" className="small text-ink-2 underline decoration-line-strong underline-offset-4 hover:decoration-ink">
          Prefer to see pricing?
        </Link>
        <Link
          href="/about#contact"
          onClick={remember}
          className="group/btn inline-flex h-10 items-center gap-2 rounded-[10px] bg-ink px-4 text-[14px] font-medium text-on-ink transition-colors hover:bg-ink-hover"
        >
          Continue
          <ArrowRight className="transition-transform duration-300 ease-[var(--ease-out)] group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
