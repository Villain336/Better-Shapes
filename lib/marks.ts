/**
 * Product logos: one source for the website and the Figma "Product Brands" page.
 * Each entry is the inner markup of a 96×96 SVG, plus the product's own color and tint.
 */
export type Mark = { color: string; tint: string; svg: string };

const star4 = (cx: number, cy: number, r: number, w: number, fill: string) =>
  `<path d="M${cx} ${cy - r}L${cx + w} ${cy - w}L${cx + r} ${cy}L${cx + w} ${cy + w}L${cx} ${cy + r}L${cx - w} ${cy + w}L${cx - r} ${cy}L${cx - w} ${cy - w}Z" fill="${fill}"/>`;

const petal = (deg: number, fill: string) =>
  `<path d="M48 48C34 38 34 16 48 8C62 16 62 38 48 48Z" fill="${fill}" transform="rotate(${deg} 48 48)"/>`;

const bars = [16, 32, 52, 72, 52, 32, 16]
  .map((h, i) => `<rect x="${8 + i * 12}" y="${48 - h / 2}" width="8" height="${h}" rx="4" fill="#10B981"/>`)
  .join("");

const perforation = [30, 36, 42, 48, 54, 60, 66]
  .map((y) => `<circle cx="66" cy="${y}" r="1.6" fill="#FFF1E6"/>`)
  .join("");

export const marks: Record<string, Mark> = {
  // Four petals: every part of the business blooming from one center.
  shapesos: {
    color: "#141414",
    tint: "#ECE9E2",
    svg:
      petal(0, "#E0533D") +
      petal(90, "#2F55D4") +
      petal(180, "#F2CF3A") +
      petal(270, "#6CC48E") +
      `<circle cx="48" cy="48" r="6" fill="#141414"/>`,
  },
  // A leash handle looped around a hand, ending at the agent it holds.
  leash: {
    color: "#4338CA",
    tint: "#E3E6FA",
    svg: `<circle cx="32" cy="30" r="16" stroke="#4338CA" stroke-width="9"/><path d="M44 41C58 54 52 68 68 70" stroke="#4338CA" stroke-width="7" stroke-linecap="round"/><circle cx="74" cy="71" r="11" fill="#4338CA"/><circle cx="74" cy="71" r="4" fill="#fff"/>`,
  },
  // Three panes of glass, one interface in front.
  "shapes-ui": {
    color: "#7C5CE0",
    tint: "#EEE8FD",
    svg: `<rect x="32" y="12" width="52" height="42" rx="12" fill="#7C5CE0" fill-opacity=".25"/><rect x="22" y="26" width="52" height="42" rx="12" fill="#7C5CE0" fill-opacity=".55"/><rect x="12" y="40" width="52" height="42" rx="12" fill="#7C5CE0"/><rect x="22" y="52" width="24" height="6" rx="3" fill="#fff"/><rect x="22" y="64" width="34" height="6" rx="3" fill="#fff" fill-opacity=".6"/>`,
  },
  // A lighthouse: making sure you can be seen.
  beacon: {
    color: "#F59E0B",
    tint: "#FEF3C7",
    svg: `<path d="M40 34L8 22V46Z" fill="#F59E0B" fill-opacity=".45"/><path d="M56 34L88 22V46Z" fill="#F59E0B" fill-opacity=".45"/><path d="M38 86L44 40H52L58 86Z" fill="#1F2937"/><path d="M41.65 58H54.35L55.4 66H40.6Z" fill="#F59E0B"/><rect x="40" y="28" width="16" height="12" rx="3" fill="#F59E0B"/><path d="M38 28L48 18L58 28Z" fill="#1F2937"/>`,
  },
  // A service bell: ring once, it gets handled.
  concierge: {
    color: "#F06449",
    tint: "#FDE4DE",
    svg: `<rect x="44" y="20" width="8" height="10" rx="3" fill="#1F2937"/><path d="M18 66C18 44 32 30 48 30C64 30 78 44 78 66Z" fill="#F06449"/><path d="M30 56C31 47 37 41 44 39" stroke="#fff" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"/><rect x="12" y="68" width="72" height="10" rx="5" fill="#1F2937"/>`,
  },
  // A gem splitting one beam into many.
  prism: {
    color: "#0EA5A4",
    tint: "#D5F5F3",
    svg: `<path d="M4 50H36" stroke="#1F2937" stroke-width="3" stroke-linecap="round"/><path d="M60 50L92 38" stroke="#E0533D" stroke-width="3.5" stroke-linecap="round"/><path d="M60 50L92 52" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round"/><path d="M60 50L92 66" stroke="#2F55D4" stroke-width="3.5" stroke-linecap="round"/><path d="M28 30L40 18H56L68 30Z" fill="#0EA5A4" fill-opacity=".55"/><path d="M28 30H68L48 80Z" fill="#0EA5A4"/><path d="M40 30L48 80L56 30" stroke="#fff" stroke-opacity=".5" stroke-width="2.5" stroke-linejoin="round"/>`,
  },
  // A voice, captured as a waveform.
  echo: { color: "#10B981", tint: "#D1FAE5", svg: bars },
  // An open book with a spark: what you already know, found.
  recall: {
    color: "#1E3A8A",
    tint: "#DBE4FB",
    svg: `<path d="M48 32C38 24 22 24 12 28V76C22 72 38 72 48 80Z" fill="#1E3A8A"/><path d="M48 32C58 24 74 24 84 28V76C74 72 58 72 48 80Z" fill="#1E3A8A" fill-opacity=".7"/>${star4(48, 14, 10, 3, "#F59E0B")}`,
  },
  // A trend line breaking out of its loop.
  orbit: {
    color: "#0284C7",
    tint: "#E0F2FE",
    svg: `<circle cx="48" cy="50" r="36" stroke="#0284C7" stroke-opacity=".3" stroke-width="6"/><path d="M22 66L40 48L52 58L72 36" stroke="#0284C7" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M62 30H78V46Z" fill="#0284C7"/>`,
  },
  // An anvil, with a spark of help.
  forge: {
    color: "#334155",
    tint: "#E2E8F0",
    svg: `<rect x="16" y="36" width="56" height="12" rx="3" fill="#334155"/><path d="M72 36H90L72 48Z" fill="#334155"/><path d="M30 48H58L54 62H34Z" fill="#334155"/><rect x="24" y="62" width="40" height="12" rx="3" fill="#334155"/>${star4(40, 18, 10, 3, "#F97316")}<circle cx="58" cy="14" r="3" fill="#F97316"/><circle cx="28" cy="10" r="2" fill="#F97316"/>`,
  },
  // A pen nib: where every design starts.
  frame: {
    color: "#EC4899",
    tint: "#FCE7F3",
    svg: `<path d="M48 8L72 40L58 78H38L24 40Z" fill="#EC4899"/><path d="M48 36V62" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="48" cy="34" r="5" fill="#fff"/><rect x="36" y="80" width="24" height="8" rx="2" fill="#1F2937"/>`,
  },
  // Snapshots, layered into something new.
  collage: {
    color: "#FB923C",
    tint: "#FFEDD5",
    svg: `<rect x="16" y="22" width="44" height="52" rx="5" fill="#FDBA74" transform="rotate(-12 38 48)"/><g transform="rotate(8 58 50)"><rect x="34" y="22" width="48" height="56" rx="5" fill="#fff"/><rect x="39" y="27" width="38" height="34" rx="2" fill="#FB923C"/><circle cx="68" cy="37" r="5" fill="#FDE68A"/></g>`,
  },
  // One confident brush stroke.
  atelier: {
    color: "#9333EA",
    tint: "#F3E8FF",
    svg: `<path d="M12 72C28 40 52 72 80 20C84 30 76 50 62 62C48 74 30 74 12 72Z" fill="#9333EA"/><circle cx="84" cy="14" r="6" fill="#9333EA" fill-opacity=".6"/>`,
  },
  // Scissors: cut to the best part.
  snip: {
    color: "#DC2626",
    tint: "#FEE2E2",
    svg: `<path d="M36 60L70 12M60 60L26 12" stroke="#1F2937" stroke-width="7" stroke-linecap="round"/><circle cx="30" cy="72" r="11" stroke="#DC2626" stroke-width="7"/><circle cx="66" cy="72" r="11" stroke="#DC2626" stroke-width="7"/><circle cx="48" cy="43" r="4" fill="#DC2626"/>`,
  },
  // A part being printed, layer by layer.
  fab: {
    color: "#65A30D",
    tint: "#ECFCCB",
    svg: `<path d="M40 8H56V20L50 28H46L40 20Z" fill="#1F2937"/><path d="M48 28V40" stroke="#65A30D" stroke-width="3" stroke-linecap="round"/><rect x="38" y="42" width="20" height="8" rx="4" fill="#65A30D" fill-opacity=".55"/><rect x="30" y="52" width="36" height="8" rx="4" fill="#65A30D" fill-opacity=".7"/><rect x="24" y="62" width="48" height="8" rx="4" fill="#65A30D" fill-opacity=".85"/><rect x="20" y="72" width="56" height="8" rx="4" fill="#65A30D"/><rect x="12" y="82" width="72" height="4" rx="2" fill="#1F2937"/>`,
  },
  // A seedling with circuit tips: intelligence that grows in the real world.
  field: {
    color: "#15803D",
    tint: "#DCFCE7",
    svg: `<path d="M48 84V46" stroke="#15803D" stroke-width="6" stroke-linecap="round"/><path d="M48 60C34 60 22 50 22 36C36 36 48 46 48 60Z" fill="#15803D"/><path d="M48 50C48 36 58 26 74 26C74 40 64 50 48 50Z" fill="#15803D" fill-opacity=".75"/><circle cx="22" cy="36" r="5" fill="#fff" stroke="#1F2937" stroke-width="3"/><circle cx="74" cy="26" r="5" fill="#fff" stroke="#1F2937" stroke-width="3"/><rect x="26" y="84" width="44" height="4" rx="2" fill="#1F2937" fill-opacity=".3"/>`,
  },
  // A paper plane: toss it to the device next to you.
  toss: {
    color: "#06B6D4",
    tint: "#CFFAFE",
    svg: `<path d="M10 46L86 14L66 82L46 58Z" fill="#06B6D4"/><path d="M46 58L52 78L60 66Z" fill="#0E7490"/><path d="M46 58L86 14" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="16" cy="70" r="3" fill="#06B6D4" fill-opacity=".5"/><circle cx="26" cy="78" r="3" fill="#06B6D4" fill-opacity=".5"/>`,
  },
  // A record with a melody running across it.
  hum: {
    color: "#D946EF",
    tint: "#FAE8FF",
    svg: `<circle cx="48" cy="48" r="38" fill="#D946EF"/><circle cx="48" cy="48" r="27" stroke="#fff" stroke-opacity=".35" stroke-width="2"/><path d="M18 48Q26 30 34 48T50 48T66 48T78 48" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="48" cy="48" r="5" fill="#FAE8FF"/>`,
  },
  // An admit-one ticket with a gold star.
  matinee: {
    color: "#B91C1C",
    tint: "#FFF1E6",
    svg: `<path d="M14 26H82V40C76 40 76 56 82 56V70H14V56C20 56 20 40 14 40Z" fill="#B91C1C"/>${perforation}<path d="M44 36L46.94 43.95L55.41 44.29L48.76 49.55L51.05 57.71L44 53L36.95 57.71L39.24 49.55L32.59 44.29L41.06 43.95Z" fill="#FBBF24"/>`,
  },
  // A sunset over the hills: the moments worth keeping.
  keepsake: {
    color: "#F43F5E",
    tint: "#FFE4E6",
    svg: `<rect x="10" y="10" width="76" height="76" rx="22" fill="#F43F5E"/><circle cx="62" cy="34" r="9" fill="#FFE4E6"/><path d="M10 70L36 46L52 62L64 52L86 70V64C86 76 78 86 66 86H30C18 86 10 78 10 70Z" fill="#fff" fill-opacity=".92"/>`,
  },
  // A camera with two people in frame.
  huddle: {
    color: "#2563EB",
    tint: "#DBEAFE",
    svg: `<rect x="8" y="26" width="60" height="46" rx="12" fill="#2563EB"/><path d="M72 40L88 30V68L72 58Z" fill="#2563EB"/><circle cx="29" cy="44" r="6" fill="#fff"/><circle cx="47" cy="44" r="6" fill="#fff" fill-opacity=".8"/><path d="M19 63C19 55 39 55 39 63Z" fill="#fff"/><path d="M37 63C37 55 57 55 57 63Z" fill="#fff" fill-opacity=".8"/>`,
  },
  // A key on a ring.
  keyring: {
    color: "#CA8A04",
    tint: "#FEF9C3",
    svg: `<circle cx="32" cy="32" r="18" stroke="#CA8A04" stroke-width="7"/><path d="M64 64L86 86M76 76L82 70M83 83L89 77" stroke="#CA8A04" stroke-width="7" stroke-linecap="round"/><circle cx="55" cy="55" r="14" fill="#CA8A04"/><circle cx="55" cy="55" r="5" fill="#FEF9C3"/>`,
  },
};

export const markSvg = (slug: string, size = 96) => {
  const m = marks[slug];
  return m
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 96 96" fill="none">${m.svg}</svg>`
    : "";
};
