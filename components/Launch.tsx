"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { shapesOSLaunch } from "@/lib/products";
import { Button } from "./Button";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";
import { ProductRender } from "./ProductRender";
import { ArrowRight } from "./Shapes";

type Left = { days: number; hours: number; minutes: number; seconds: number };

/**
 * Time until `target`. `undefined` before mount (so server and first client render agree),
 * `null` once the moment has passed.
 */
export function useCountdown(target: string): Left | null | undefined {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return undefined;
  const ms = new Date(target).getTime() - now;
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}

const pad = (n: number | undefined) => (n === undefined ? "--" : String(n).padStart(2, "0"));

function LiveDot() {
  return (
    <span className="relative flex size-1.5" aria-hidden>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-green opacity-60 motion-reduce:hidden" />
      <span className="relative inline-flex size-1.5 rounded-full bg-brand-green" />
    </span>
  );
}

/** The thin line above the nav: one sentence, one link. Collapses once you scroll. */
export function LaunchStrip() {
  const left = useCountdown(shapesOSLaunch.at);
  return (
    <Link
      href={`/products/${shapesOSLaunch.slug}`}
      className="container-x flex h-9 items-center justify-center gap-3 text-[12.5px] text-ink-2 transition-colors hover:text-ink"
    >
      <LiveDot />
      <span className="truncate">
        {left === null ? (
          <>
            <span className="font-medium text-ink">ShapesOS is live.</span> The open-source agentic business OS.
          </>
        ) : (
          <>
            <span className="font-medium text-ink">ShapesOS launches {shapesOSLaunch.label}.</span>
            <span className="hidden sm:inline"> The open-source agentic business OS.</span>
            {left && (
              <span className="label ml-2 hidden text-ink-3 md:inline">
                {left.days}d {pad(left.hours)}h {pad(left.minutes)}m
              </span>
            )}
          </>
        )}
      </span>
      <span className="label inline-flex items-center gap-1 text-ink">
        {left === null ? "Get it" : "Waitlist"}
        <ArrowRight size={11} />
      </span>
    </Link>
  );
}

/** Four hairline-separated numerals. */
export function CountdownDigits({ left, size = "lg" }: { left: Left | null | undefined; size?: "lg" | "sm" }) {
  const units: [string, number | undefined][] = [
    ["Days", left?.days],
    ["Hours", left?.hours],
    ["Minutes", left?.minutes],
    ["Seconds", left?.seconds],
  ];
  return (
    <div
      role="timer"
      aria-live="off"
      aria-label={`Time until ShapesOS launches on ${shapesOSLaunch.label}`}
      className="grid grid-cols-4 overflow-hidden rounded-(--radius-card) border border-line"
    >
      {units.map(([label, v], i) => (
        <div key={label} className={`flex flex-col gap-1.5 bg-surface px-3 py-3.5 md:px-5 md:py-5 ${i > 0 ? "border-l border-line" : ""}`}>
          <span className={`num text-ink ${size === "lg" ? "text-[clamp(30px,4vw,52px)]" : "text-[28px]"}`}>{pad(v)}</span>
          <span className="label text-ink-3">{label}</span>
        </div>
      ))}
    </div>
  );
}

/** The Home announcement: a wide band with the countdown, what ShapesOS is, and the render. */
export function LaunchBand() {
  const left = useCountdown(shapesOSLaunch.at);
  return (
    <section className="container-x pb-20">
      <Reveal className="surface grid overflow-hidden rounded-(--radius-panel) lg:grid-cols-[1.25fr_1fr]">
        <div className="flex flex-col gap-7 p-6 md:p-10">
          <div className="flex items-center gap-3">
            <Eyebrow>Announcement</Eyebrow>
            <span className="label inline-flex items-center gap-2 text-ink-3">
              <LiveDot />
              {shapesOSLaunch.label} · midnight Eastern
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="h2">
              {left === null ? "ShapesOS is live." : "ShapesOS launches"} {left !== null && <span className="text-ink-3">December 1.</span>}
            </h2>
            <p className="lede max-w-[520px]">
              The open-source agentic business OS: grow, design and operate a company from one workspace, where agents
              propose and people approve. Self-host it free, or use the hosted version.
            </p>
          </div>
          {left !== null && <CountdownDigits left={left} />}
          <div className="flex flex-wrap gap-2.5">
            <Button href={`/products/${shapesOSLaunch.slug}`}>{left === null ? "Get ShapesOS" : "Join the waitlist"}</Button>
            <Button href={`/products/${shapesOSLaunch.slug}#features`} variant="outline">
              What’s inside
            </Button>
          </div>
        </div>
        <div className="border-t border-line lg:border-l lg:border-t-0">
          <ProductRender
            slug="shapesos"
            alt="ShapesOS render: four glass layers around a titanium core"
            className="aspect-[16/10] h-full w-full lg:aspect-auto"
            sizes="(min-width:1024px) 40vw, 100vw"
          />
        </div>
      </Reveal>
    </section>
  );
}

/** Compact countdown for the ShapesOS product page sidebar. */
export function LaunchCountdown() {
  const left = useCountdown(shapesOSLaunch.at);
  if (left === null) return null;
  return (
    <div className="flex flex-col gap-3">
      <span className="label inline-flex items-center gap-2 text-ink-3">
        <LiveDot />
        Until launch · midnight Eastern
      </span>
      <CountdownDigits left={left} size="sm" />
    </div>
  );
}
