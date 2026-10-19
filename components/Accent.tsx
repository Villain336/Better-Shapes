// Brand red, blue, yellow, green, then lavender (from the Work page art).
export const shapeColors = ["#e0533d", "#2f55d4", "#f2cf3a", "#6cc48e", "#8b6fd8"];

/** "shape" with each letter in its own color; extra letters (e.g. "shapes") keep cycling. */
export function ShapeWord({ word }: { word: string }) {
  return (
    <span aria-label={word}>
      {word.split("").map((ch, i) => (
        <span key={i} aria-hidden style={{ color: shapeColors[i % shapeColors.length] }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

/**
 * The second half of a headline, same font and upright. If it contains "shape"/"shapes" that word
 * gets the multicolor treatment and the rest stays ink; otherwise the whole phrase is a soft muted ink.
 */
export function Accent({ text, className = "" }: { text: string; className?: string }) {
  const parts = text.split(/(shapes?)/i);
  const hasShape = parts.length > 1;
  return (
    <span className={`${hasShape ? "text-ink" : "text-ink-3"} ${className}`}>
      {parts.map((p, i) => (/^shapes?$/i.test(p) ? <ShapeWord key={i} word={p} /> : p))}
    </span>
  );
}
