import type { Tone } from "@/lib/content";
import { toneColor, toneTint } from "./Shapes";

export function Chip({ tone, children, glass = false }: { tone: Tone; children: React.ReactNode; glass?: boolean }) {
  return (
    <span
      className={`caption inline-flex items-center gap-2 rounded-full py-[7px] pl-3 pr-3.5 text-ink ${glass ? "glass" : ""}`}
      style={glass ? undefined : { background: toneTint[tone] }}
    >
      <span className="size-[7px] rounded-full" style={{ background: toneColor[tone] }} />
      {children}
    </span>
  );
}
