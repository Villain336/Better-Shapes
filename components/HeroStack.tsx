"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Chip } from "./Chip";

const ease = [0.22, 1, 0.36, 1] as const;

/** The floating glass cards on the home hero; they drift with the pointer for depth. */
export function HeroStack() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const far = { x: useTransform(sx, (v) => v * 18), y: useTransform(sy, (v) => v * 18) };
  const mid = { x: useTransform(sx, (v) => v * 10), y: useTransform(sy, (v) => v * 10) };
  const near = { x: useTransform(sx, (v) => v * -14), y: useTransform(sy, (v) => v * -14) };

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduce]);

  const enter = (delay: number, rotate: number) => ({
    initial: { opacity: 0, y: 40, rotate: 0, scale: 0.94 },
    animate: { opacity: 1, y: 0, rotate, scale: 1 },
    transition: { duration: 1.2, ease, delay },
  });

  return (
    <div className="relative hidden h-[520px] lg:block" aria-hidden>
      <motion.div style={far} className="absolute right-0 top-0">
        <motion.div {...enter(0.6, 4)} className="glass animate-float w-[230px] rounded-[24px] px-6 pb-[22px] pt-5">
          <div className="font-display text-[56px] font-semibold leading-none tracking-[-0.06em]">120+</div>
          <div className="text-[14px] text-ink-2">Products shipped</div>
        </motion.div>
      </motion.div>

      <motion.div style={mid} className="absolute left-0 top-[170px]">
        <motion.div
          {...enter(0.8, -3)}
          className="glass animate-float flex w-[270px] flex-col gap-3.5 rounded-[28px] px-5 pb-5 pt-[18px] [animation-delay:-2.5s]"
        >
          <div className="caption flex items-center gap-2 text-ink-3">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-green opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-green" />
            </span>
            Now building
          </div>
          <div className="font-display text-[18px] font-semibold leading-[1.25] tracking-[-0.02em]">ShapesOS: the agentic business OS</div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-green"
              initial={{ width: "0%" }}
              animate={{ width: "70%" }}
              transition={{ duration: 2, ease, delay: 1.3 }}
            />
          </div>
          <div className="flex gap-1.5">
            <Chip tone="blue">Early access 2027</Chip>
          </div>
        </motion.div>
      </motion.div>

      <motion.div style={near} className="absolute bottom-0 right-[10px]">
        <motion.div
          {...enter(1, -2)}
          className="glass animate-float w-[240px] rounded-[24px] px-6 pb-[22px] pt-5 [animation-delay:-5s]"
        >
          <div className="font-display text-[56px] font-semibold leading-none tracking-[-0.06em]">48h</div>
          <div className="text-[14px] text-ink-2">Average first delivery</div>
        </motion.div>
      </motion.div>
    </div>
  );
}
