// Product marks exported from the Figma "Product Brands" page. Every mark is built from the
// four logo shapes (quarter, triangle, circle, L) in the brand colors.
const R = "#E0533D";
const B = "#2F55D4";
const Y = "#F2CF3A";
const G = "#6CC48E";
const L = "#8B6FD8";
const K = "#141414";

const round = { strokeLinecap: "round", strokeLinejoin: "round" } as const;

const marks: Record<string, React.ReactNode> = {
  shapesos: (
    <>
      <rect x="11" y="11" width="74" height="74" rx="21" stroke={K} strokeWidth="6" />
      <path d="M24 24H46C46 36.15 36.15 46 24 46V24Z" fill={R} />
      <path d="M50 46L61 24L72 46H50Z" fill={B} />
      <circle cx="35" cy="61" r="11" fill={Y} />
      <path d="M50 50H61V61H72V72H50V50Z" fill={G} />
    </>
  ),
  leash: (
    <>
      <path d="M34 34L70 70" stroke={K} strokeWidth="6" {...round} />
      <circle cx="32" cy="32" r="22" fill={B} />
      <rect x="58" y="58" width="28" height="28" rx="6" fill={G} />
      <path d="M65 72L70 77L79 66" stroke="white" strokeWidth="4" {...round} />
    </>
  ),
  "shapes-ui": (
    <>
      <rect x="28" y="10" width="58" height="58" rx="16" fill={L} fillOpacity="0.45" />
      <rect x="12.5" y="30.5" width="53" height="53" rx="13.5" fill="white" stroke={K} strokeWidth="5" />
      <path d="M22 40H44C44 52.15 34.15 62 22 62V40Z" fill={R} />
    </>
  ),
  beacon: (
    <>
      <path
        d="M15.23 35.06A40 40 0 0 1 80.77 35.06L75.52 38.73A33.6 33.6 0 0 0 20.48 38.73Z"
        fill={Y}
        fillOpacity="0.45"
      />
      <path
        d="M25.06 41.94A28 28 0 0 1 70.94 41.94L65.89 45.47A21.84 21.84 0 0 0 30.11 45.47Z"
        fill={Y}
        fillOpacity="0.75"
      />
      <circle cx="48" cy="58" r="14" fill={Y} />
      <rect x="42" y="72" width="12" height="18" rx="2" fill={K} />
    </>
  ),
  concierge: (
    <>
      <rect x="10" y="12" width="76" height="56" rx="24" fill={R} />
      <path d="M22 58V86L46 64Z" fill={R} />
      <circle cx="34" cy="40" r="5" fill="white" />
      <circle cx="48" cy="40" r="5" fill="white" />
      <circle cx="62" cy="40" r="5" fill="white" />
    </>
  ),
  prism: (
    <>
      <path d="M8 80L38 18L68 80H8Z" fill={B} />
      <rect x="52" y="40" width="36" height="8" rx="4" fill={R} />
      <rect x="56" y="52" width="36" height="8" rx="4" fill={Y} />
      <rect x="60" y="64" width="36" height="8" rx="4" fill={G} />
    </>
  ),
  echo: (
    <>
      <circle cx="48" cy="48" r="40" stroke={G} strokeOpacity="0.3" strokeWidth="5" />
      <circle cx="48" cy="48" r="27" stroke={G} strokeOpacity="0.6" strokeWidth="5" />
      <circle cx="48" cy="48" r="13" fill={G} />
    </>
  ),
  recall: (
    <>
      <path d="M58 58L84 84" stroke={K} strokeWidth="12" {...round} />
      <circle cx="40" cy="40" r="26" stroke={B} strokeWidth="10" />
      <circle cx="40" cy="40" r="7" fill={Y} />
    </>
  ),
  orbit: (
    <>
      <ellipse cx="48" cy="48" rx="41" ry="15" transform="rotate(-24 48 48)" stroke={K} strokeWidth="4" />
      <circle cx="48" cy="48" r="17" fill={G} />
      <circle cx="78.5" cy="25" r="7" fill={R} />
    </>
  ),
  forge: (
    <>
      <path d="M32 26L12 48L32 70" stroke={K} strokeWidth="8" {...round} />
      <path d="M64 26L84 48L64 70" stroke={K} strokeWidth="8" {...round} />
      <path d="M48 30L60 66H36L48 30Z" fill={Y} />
    </>
  ),
  frame: (
    <>
      {["M10 30V10H30", "M66 10H86V30", "M86 66V86H66", "M30 86H10V66"].map((d) => (
        <path key={d} d={d} stroke={K} strokeWidth="7" {...round} />
      ))}
      <path d="M30 30H66C66 49.88 49.88 66 30 66V30Z" fill={R} />
    </>
  ),
  collage: (
    <>
      <circle cx="36" cy="38" r="24" fill={B} fillOpacity="0.9" />
      <rect x="38" y="34" width="46" height="46" rx="8" fill={Y} fillOpacity="0.9" />
      <path d="M12 86L34 48L56 86H12Z" fill={R} fillOpacity="0.9" />
    </>
  ),
  atelier: (
    <>
      <path
        d="M62.38 72.38C52.23 82.54 35.77 82.54 25.62 72.38C15.46 62.23 15.46 45.77 25.62 35.62L44 17.23L62.38 35.62C72.54 45.77 72.54 62.23 62.38 72.38Z"
        fill={L}
      />
      <circle cx="70" cy="24" r="9" fill={G} />
    </>
  ),
  snip: (
    <>
      <path d="M18 14L46 30.2V65.8L18 82V14Z" fill={R} />
      <path d="M54 34.8L84 52L54 69.2V34.8Z" fill={Y} />
      <path d="M50 10V86" stroke={K} strokeOpacity="0.25" strokeWidth="3" {...round} />
    </>
  ),
  fab: (
    <>
      <path d="M48 10L82 29L48 48L14 29Z" fill={Y} />
      <path d="M14 29L48 48V88L14 69Z" fill={B} />
      <path d="M48 48L82 29V69L48 88Z" fill={G} />
    </>
  ),
  field: (
    <>
      {[18, 48, 78].flatMap((x) =>
        [18, 48, 78].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill={K} fillOpacity="0.2" />),
      )}
      <path d="M18 78H48V48H78V18" stroke={K} strokeOpacity="0.85" strokeWidth="5" {...round} />
      <circle cx="78" cy="18" r="10" fill={R} />
    </>
  ),
};

export function ProductMark({ slug, size = 32, className }: { slug: string; size?: number; className?: string }) {
  const mark = marks[slug];
  if (!mark) return null;
  return (
    <svg viewBox="0 0 96 96" width={size} height={size} fill="none" className={className} aria-hidden>
      {mark}
    </svg>
  );
}
