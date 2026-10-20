type Variant = "surface" | "glass" | "ink";

type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  /** Adds the hover lift (use on cards that link somewhere). */
  lift?: boolean;
  as?: "div" | "article" | "li" | "section";
};

const variants: Record<Variant, string> = {
  surface: "surface",
  glass: "glass",
  ink: "glass-ink",
};

/** The card. Hairline border on a quiet surface; glass only when it sits on a painting. */
export function Panel({ children, className = "", variant = "surface", lift = false, as = "div" }: Props) {
  const Tag = as;
  return <Tag className={`relative rounded-(--radius-card) ${variants[variant]} ${lift ? "lift" : ""} ${className}`}>{children}</Tag>;
}
