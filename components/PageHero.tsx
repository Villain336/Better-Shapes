"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Accent } from "./Accent";
import { Eyebrow } from "./Eyebrow";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  accent: string;
  sub: string;
  children?: React.ReactNode;
  /** Sits to the right of the copy on large screens (the home brief, for instance). */
  aside?: React.ReactNode;
  /** One quiet line under the buttons: proof, a date, a promise. */
  note?: React.ReactNode;
  tall?: boolean;
  /** For sentence-length accents (product taglines): the accent wraps onto its own smaller line. */
  smallAccent?: boolean;
};

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

/** Full-bleed painting, a quiet wash for legibility, and a headline that settles into place. */
export function PageHero({ image, alt, eyebrow, title, accent, sub, children, aside, note, tall = false, smallAccent = false }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.02, reduce ? 1.02 : 1.08]);

  return (
    <section ref={ref} className={`relative isolate overflow-hidden ${tall ? "min-h-[88svh]" : "min-h-[540px] md:min-h-[620px]"}`}>
      <motion.div className="absolute inset-0 -z-20" style={{ y, scale }}>
        <Image src={image} alt={alt} fill priority sizes="100vw" className="object-cover" />
      </motion.div>

      {/* top scrim for the nav, left wash for the copy, bottom fade into the canvas */}
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-canvas/70 to-transparent" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(244,242,237,0.55)_0%,rgba(244,242,237,0.2)_50%,rgba(244,242,237,0.9)_100%)] md:bg-[linear-gradient(90deg,rgba(244,242,237,0.82)_0%,rgba(244,242,237,0.45)_45%,rgba(244,242,237,0)_75%)]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-canvas" />

      <div
        className={`container-x relative flex flex-col justify-center pb-16 pt-28 md:pt-36 ${
          tall ? "min-h-[88svh]" : "min-h-[540px] md:min-h-[620px]"
        }`}
      >
        <div className={`grid items-center gap-12 ${aside ? "lg:grid-cols-[minmax(0,1fr)_400px]" : ""}`}>
          <div className="flex max-w-[720px] flex-col items-start gap-6">
            <motion.div {...rise(0.05)}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </motion.div>

            <motion.h1 {...rise(0.12)} className="display text-[clamp(40px,5.6vw,76px)] text-ink">
              {title}{" "}
              {smallAccent ? (
                <span className="mt-3 block max-w-[640px] text-[0.42em] font-medium leading-[1.2] tracking-[-0.02em]">
                  <Accent text={accent} />
                </span>
              ) : (
                <Accent text={accent} />
              )}
            </motion.h1>

            <motion.p {...rise(0.22)} className="lede max-w-[520px]">
              {sub}
            </motion.p>

            {children && (
              <motion.div {...rise(0.3)} className="flex flex-wrap items-center gap-2.5 pt-1">
                {children}
              </motion.div>
            )}

            {note && (
              <motion.div {...rise(0.38)} className="small text-ink-3">
                {note}
              </motion.div>
            )}
          </div>

          {aside && (
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.3 }}>
              {aside}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
