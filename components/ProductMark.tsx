import { marks } from "@/lib/marks";

/** A product's logo (see lib/marks.ts, mirrored on the Figma "Product Brands" page). */
export function ProductMark({ slug, size = 32, className }: { slug: string; size?: number; className?: string }) {
  const mark = marks[slug];
  if (!mark) return null;
  return (
    <svg
      viewBox="0 0 96 96"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: mark.svg }}
    />
  );
}

/** The product's own tint, used behind its mark. */
export const markTint = (slug: string) => marks[slug]?.tint ?? "#ECE9E2";
