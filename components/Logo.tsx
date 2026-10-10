"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Circle, LBlock, Quarter, Triangle } from "./Shapes";

const spring = { type: "spring", stiffness: 400, damping: 18 } as const;

/** The four-shape mark. On hover the shapes nudge apart and the triangle spins. */
export function LogoMark({ size = 30 }: { size?: number }) {
  const g = size * 0.46;
  return (
    <motion.span
      className="relative inline-grid shrink-0 grid-cols-2 gap-[8%]"
      style={{ width: size, height: size }}
      initial="rest"
      animate="rest"
      whileHover="hover"
      aria-hidden
    >
      <motion.span variants={{ rest: { x: 0, y: 0 }, hover: { x: -2, y: -2 } }} transition={spring}>
        <Quarter size={g} />
      </motion.span>
      <motion.span
        variants={{ rest: { x: 0, y: 0, rotate: 0 }, hover: { x: 2, y: -2, rotate: 120 } }}
        transition={spring}
      >
        <Triangle size={g} />
      </motion.span>
      <motion.span variants={{ rest: { x: 0, y: 0 }, hover: { x: -2, y: 2 } }} transition={spring}>
        <Circle size={g} />
      </motion.span>
      <motion.span variants={{ rest: { x: 0, y: 0 }, hover: { x: 2, y: 2 } }} transition={spring}>
        <LBlock size={g} />
      </motion.span>
    </motion.span>
  );
}

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-2.5 text-[20px] font-medium tracking-[-0.04em] md:text-[22px] ${
        inverse ? "text-white" : "text-ink"
      }`}
      aria-label="Better Shapes home"
    >
      <LogoMark />
      <span>Better Shapes</span>
    </Link>
  );
}
