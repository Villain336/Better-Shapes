import type { Tone } from "@/lib/content";
import { toneColor } from "./Shapes";

type Props = {
  children: React.ReactNode;
  tone?: Tone;
  /** For tags that sit on imagery. */
  glass?: boolean;
  className?: string;
};

/** Small mono tag with a hairline border and an optional tone dot. */
export function Chip({ tone, children, glass = false, className = "" }: Props) {
  return (
    <span
      className={`label inline-flex h-6 items-center gap-1.5 rounded-(--radius-tag) border px-2 ${
        glass ? "border-white/40 bg-white/70 text-ink backdrop-blur-md" : "border-line bg-surface text-ink-2"
      } ${className}`}
    >
      {tone && <span className="size-1.5 rounded-full" style={{ background: toneColor[tone] }} />}
      {children}
    </span>
  );
}
