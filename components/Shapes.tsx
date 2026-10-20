import type { Capability, Tone } from "@/lib/content";

export const toneColor: Record<Tone, string> = {
  red: "#e0533d",
  blue: "#2f55d4",
  yellow: "#f2cf3a",
  green: "#6cc48e",
};

type GlyphProps = { size?: number; color?: string; className?: string };

export function Quarter({ size = 24, color = toneColor.red, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path d="M0 0H24V0A24 24 0 0 1 0 24Z" fill={color} />
    </svg>
  );
}

export function Triangle({ size = 24, color = toneColor.blue, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path d="M12 1.5 23.5 22.5H.5Z" fill={color} />
    </svg>
  );
}

export function Circle({ size = 24, color = toneColor.yellow, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <circle cx="12" cy="12" r="12" fill={color} />
    </svg>
  );
}

export function LBlock({ size = 24, color = toneColor.green, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path d="M0 0H12V12H24V24H0Z" fill={color} />
    </svg>
  );
}

/** Each capability is represented by one of the four logo shapes, drawn in ink unless a colour is passed. */
export function CapabilityGlyph({ name, size = 18, color = "currentColor" }: { name: Capability; size?: number; color?: string }) {
  switch (name) {
    case "Tech":
      return <Triangle size={size} color={color} />;
    case "Design":
      return <Quarter size={size} color={color} />;
    case "Robotics":
      return <Circle size={size} color={color} />;
    case "Marketing":
      return <LBlock size={size} color={color} />;
  }
}

type IconProps = { className?: string; size?: number };

export function ArrowRight({ className, size = 14 }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" className={className} aria-hidden>
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowUpRight({ className, size = 14 }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" className={className} aria-hidden>
      <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Plus({ className, size = 14 }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" className={className} aria-hidden>
      <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Check({ className, size = 14 }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" className={className} aria-hidden>
      <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
