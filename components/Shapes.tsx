import type { Capability, Tone } from "@/lib/content";

export const toneColor: Record<Tone, string> = {
  red: "#e0533d",
  blue: "#2f55d4",
  yellow: "#f2cf3a",
  green: "#6cc48e",
};

export const toneTint: Record<Tone, string> = {
  red: "#fbe3de",
  blue: "#dee5fb",
  yellow: "#fdf5d3",
  green: "#ddf2e5",
};

type GlyphProps = { size?: number; color?: string; className?: string };

export function Quarter({ size = 24, color = toneColor.red, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path d="M0 0H24V0A24 24 0 0 1 0 24Z" fill={color} transform="scale(1 1)" />
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

/** Each capability is represented by one of the four logo shapes. */
export function CapabilityGlyph({ name, size = 34 }: { name: Capability; size?: number }) {
  switch (name) {
    case "Tech":
      return <Triangle size={size} />;
    case "Design":
      return <Quarter size={size} />;
    case "Robotics":
      return <Circle size={size} />;
    case "Marketing":
      return <LBlock size={size} />;
  }
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" className={className} aria-hidden>
      <path
        d="M4 12 12 4M5.5 4H12v6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
