import Link from "next/link";
import { Circle, LBlock, Quarter, Triangle } from "./Shapes";

/** The four-shape mark. Still; the colour is the only ornament on the page. */
export function LogoMark({ size = 22 }: { size?: number }) {
  const g = size * 0.46;
  return (
    <span className="inline-grid shrink-0 grid-cols-2 gap-[8%]" style={{ width: size, height: size }} aria-hidden>
      <Quarter size={g} />
      <Triangle size={g} />
      <Circle size={g} />
      <LBlock size={g} />
    </span>
  );
}

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 font-display text-[16px] font-semibold tracking-[-0.02em] ${inverse ? "text-white" : "text-ink"}`}
      aria-label="Better Shapes home"
    >
      <LogoMark />
      <span>Better Shapes</span>
    </Link>
  );
}
