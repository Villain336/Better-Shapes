import Image from "next/image";

/** `/art/home-poppies.webp` → `/art/home-poppies-dusk.webp`. Every painting ships with a dusk version. */
export const duskOf = (src: string) => src.replace(/\.webp$/, "-dusk.webp");

type Props = {
  /** The daytime painting. The dusk version is derived from its path. */
  src: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * A painting that knows what time it is. Both the day and dusk versions are rendered on top of each
 * other and cross-fade when the theme changes, so the scenery slips into evening instead of cutting.
 * Always `fill`; size it with the parent.
 */
export function Painting({ src, alt = "", sizes = "100vw", priority = false, className = "" }: Props) {
  return (
    <>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={`painting-day object-cover ${className}`} />
      <Image src={duskOf(src)} alt="" fill priority={priority} sizes={sizes} className={`painting-dusk object-cover ${className}`} aria-hidden />
    </>
  );
}
