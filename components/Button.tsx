import Link from "next/link";
import { ArrowUpRight } from "./Shapes";

type Variant = "ink" | "glass" | "ghost";

const base =
  "group/btn inline-flex items-center justify-between gap-4 rounded-full py-1.5 pl-5 pr-1.5 text-[15px] font-medium tracking-[-0.01em] whitespace-nowrap transition-[transform,background-color,box-shadow] duration-500 ease-[var(--ease-out)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";

const styles: Record<Variant, { root: string; dot: string }> = {
  ink: {
    root: "glass-ink text-white",
    dot: "bg-raised text-ink group-hover/btn:bg-brand-yellow",
  },
  glass: {
    root: "glass text-ink",
    dot: "bg-ink text-white group-hover/btn:bg-brand-blue",
  },
  ghost: {
    root: "text-ink hover:bg-white/40",
    dot: "border border-ink text-ink group-hover/btn:border-brand-red group-hover/btn:bg-brand-red group-hover/btn:text-white",
  },
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
};

/** Pill button from the Figma "Button" component: label + arrow dot that fills and turns on hover. */
export function Button({ href, children, variant = "ink", className = "" }: Props) {
  const s = styles[variant];
  return (
    <Link href={href} className={`${base} ${s.root} ${className}`}>
      <span>{children}</span>
      <span
        className={`grid size-9 place-items-center rounded-full transition-colors duration-300 ${s.dot}`}
      >
        <ArrowUpRight className="transition-transform duration-500 ease-[var(--ease-out)] group-hover/btn:rotate-45" />
      </span>
    </Link>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button type="submit" className={`${base} ${styles.ink.root} cursor-pointer`}>
      <span>{children}</span>
      <span className={`grid size-9 place-items-center rounded-full transition-colors duration-300 ${styles.ink.dot}`}>
        <ArrowUpRight className="transition-transform duration-500 ease-[var(--ease-out)] group-hover/btn:rotate-45" />
      </span>
    </button>
  );
}
