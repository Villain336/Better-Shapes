import Link from "next/link";
import { ArrowRight } from "./Shapes";

type Variant = "ink" | "outline" | "ghost" | "white" | "glass";
type Size = "sm" | "md";

const base =
  "group/btn inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-medium tracking-[-0.005em] transition-[background-color,border-color,color,transform] duration-300 ease-[var(--ease-out)] active:scale-[0.985]";

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-4.5 text-[14px]",
};

const variants: Record<Variant, string> = {
  ink: "bg-ink text-white hover:bg-[#2a2a2a]",
  outline: "border border-line-strong bg-white/45 text-ink backdrop-blur-sm hover:border-ink hover:bg-white/80",
  ghost: "px-2! text-ink hover:text-ink-2",
  white: "bg-white text-ink hover:bg-surface",
  glass: "border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
};

/** The one button. Text, optional arrow that nudges on hover, four quiet variants. */
export function Button({ href, children, variant = "ink", size = "md", arrow = true, className = "" }: Props) {
  const external = href.startsWith("http");
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <ArrowRight className="transition-transform duration-300 ease-[var(--ease-out)] group-hover/btn:translate-x-0.5" />}
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function SubmitButton({ children, variant = "ink", className = "" }: { children: React.ReactNode; variant?: Variant; className?: string }) {
  return (
    <button type="submit" className={`${base} ${sizes.md} ${variants[variant]} ${className}`}>
      <span>{children}</span>
      <ArrowRight className="transition-transform duration-300 ease-[var(--ease-out)] group-hover/btn:translate-x-0.5" />
    </button>
  );
}
