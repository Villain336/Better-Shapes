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

export function Close({ className, size = 14 }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" className={className} aria-hidden>
      <path d="m3.5 3.5 9 9m0-9-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Search({ className, size = 14 }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" className={className} aria-hidden>
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronRight({ className, size = 14 }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" className={className} aria-hidden>
      <path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDown({ className, size = 14 }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" className={className} aria-hidden>
      <path d="m3.5 6 4.5 4.5L12.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Expand({ className, size = 14 }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" className={className} aria-hidden>
      <path d="M9.5 2.5h4v4m-11 3v4h4m7-11L9 7.5m-6.5 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Mail({ className, size = 14 }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" className={className} aria-hidden>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m2.5 4.5 5.5 4 5.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Sparkle({ className, size = 14 }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" className={className} aria-hidden>
      <path d="M8 1.5c.4 3.6 2.9 6.1 6.5 6.5-3.6.4-6.1 2.9-6.5 6.5-.4-3.6-2.9-6.1-6.5-6.5 3.6-.4 6.1-2.9 6.5-6.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function Pencil({ className, size = 14 }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" className={className} aria-hidden>
      <path d="m2.5 13.5.8-3.3 7.4-7.4a1.4 1.4 0 0 1 2 0l.5.5a1.4 1.4 0 0 1 0 2l-7.4 7.4-3.3.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m9.5 4 2.5 2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function Doc({ className, size = 14 }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" className={className} aria-hidden>
      <path d="M4 1.5h5.5L13 5v9.5H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9.5 1.5V5H13M6.5 8.5h4m-4 3h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Grid({ className, size = 14 }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" className={className} aria-hidden>
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
