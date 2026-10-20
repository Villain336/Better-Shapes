/** The second half of a headline, set in a quieter ink so the first half carries the weight. */
export function Accent({ text, className = "" }: { text: string; className?: string }) {
  return <span className={`text-ink-3 ${className}`}>{text}</span>;
}
