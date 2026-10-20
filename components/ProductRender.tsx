import Image from "next/image";
import { asset } from "@/lib/content";

/** Background the 3D renders were shot on, so tiles blend seamlessly. */
export const RENDER_BG = "#E9E6E0";

export const productRender = (slug: string) => asset(`/products/${slug}.webp`);

/**
 * A product's 3D render. Files are 1152×720 (16:10) with the subject centred in the middle square,
 * so a square frame crops to the subject and wide frames keep the studio background.
 */
export function ProductRender({
  slug,
  alt = "",
  className = "",
  sizes = "(min-width: 1024px) 33vw, 100vw",
}: {
  slug: string;
  alt?: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: RENDER_BG }}>
      <Image src={productRender(slug)} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}
