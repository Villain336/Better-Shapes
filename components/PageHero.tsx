"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LogoMark } from "./Logo";
import { Accent } from "./Accent";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  accent: string;
  sub: string;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  tall?: boolean;
  priority?: boolean;
};

/** Full-bleed painted landscape with parallax + slow drift, headline with a soft accent line ("shape" in brand colors). */
export function PageHero({ image, alt, eyebrow, title, accent, sub, children, aside, tall = false }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, reduce ? 1.04 : 1.14]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  const words = title.split(" ");

  return (
    <section
      ref={ref}
      className={`relative isolate overflow-hidden ${tall ? "min-h-[100svh] md:min-h-[920px]" : "min-h-[640px] md:min-h-[700px]"}`}
    >
      <motion.div className="absolute inset-0 -z-20" style={{ y, scale }}>
        <div className="animate-drift absolute inset-0">
          <Image src={image} alt={alt} fill priority sizes="100vw" className="object-cover" />
        </div>
      </motion.div>
      {/* left wash for legibility + bottom fade into the cream canvas */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(250,248,244,0.7)_0%,rgba(250,248,244,0.15)_55%,rgba(241,239,234,1)_100%)] md:bg-[linear-gradient(90deg,rgba(250,248,244,0.82)_0%,rgba(250,248,244,0.35)_42%,rgba(250,248,244,0)_70%)]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-b from-transparent to-canvas" />

      <motion.div
        className={`container-x relative flex flex-col justify-center ${tall ? "min-h-[100svh] pb-24 pt-32 md:min-h-[920px] md:pt-36" : "min-h-[640px] pb-24 pt-36 md:min-h-[700px]"}`}
        style={{ y: copyY, opacity: copyOpacity }}
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col items-start gap-6 md:gap-7">
            <motion.span
              className="glass eyebrow inline-flex items-center gap-2.5 rounded-full py-2 pl-3 pr-4 text-ink-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
            >
              <LogoMark size={14} />
              {eyebrow}
            </motion.span>

            <h1 className="display text-[clamp(52px,8.2vw,120px)] text-ink">
              <span className="block lg:whitespace-nowrap">
                {words.map((w, i) => (
                  <span key={i} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                    <motion.span
                      className="inline-block"
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 1, ease, delay: 0.15 + i * 0.08 }}
                    >
                      {w}
                      {i < words.length - 1 ? " " : ""}
                    </motion.span>
                  </span>
                ))}
              </span>
              <span className="block overflow-hidden pb-[0.1em]">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease, delay: 0.25 + words.length * 0.08 }}
                >
                  <Accent text={accent} />
                </motion.span>
              </span>
            </h1>

            <motion.p
              className="max-w-[520px] text-[18px] leading-[1.5] tracking-[-0.01em] text-ink-2 md:text-[20px]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.55 }}
            >
              {sub}
            </motion.p>

            {children && (
              <motion.div
                className="flex flex-wrap items-center gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.7 }}
              >
                {children}
              </motion.div>
            )}
          </div>
          {aside}
        </div>
      </motion.div>
    </section>
  );
}
