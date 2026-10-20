import Image from "next/image";
import { art } from "@/lib/content";
import { productBySlug } from "@/lib/products";
import { Button } from "./Button";
import { Reveal } from "./Reveal";
import { StatusChip } from "./ProductCard";
import { Check } from "./Shapes";
import { ProductRender } from "./ProductRender";
import { Eyebrow } from "./Eyebrow";

/** The flagship ShapesOS panel used on Home and /products: copy on the left, the render and feature list on the right. */
export function ShapesOSFeature() {
  const p = productBySlug("shapesos")!;
  return (
    <Reveal className="surface grid overflow-hidden rounded-(--radius-panel) lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col items-start gap-6 p-6 md:p-10">
        <div className="flex items-center gap-3">
          <Eyebrow>Flagship</Eyebrow>
          <StatusChip status={p.status} />
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="display text-[clamp(36px,4.4vw,56px)]">{p.name}</h3>
          <p className="lede max-w-[440px]">
            {p.tagline} Agents propose, people approve, and nothing touches money or customers without you.
          </p>
        </div>
        <ul className="flex flex-col gap-2.5">
          {p.features.slice(0, 4).map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[14px] leading-[1.5] text-ink-2">
              <Check size={13} className="mt-1 shrink-0 text-ink-3" />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-2.5 pt-2">
          <Button href="/products/shapesos">Join the waitlist</Button>
          <Button href="/products" variant="outline">
            All products
          </Button>
        </div>
      </div>
      <div className="relative isolate min-h-[360px] overflow-hidden lg:min-h-0">
        <Image src={art.products} alt="" fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
        <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
          <ProductRender
            slug="shapesos"
            alt="ShapesOS render"
            className="aspect-square w-full max-w-[380px] rounded-(--radius-card) shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)]"
            sizes="380px"
          />
        </div>
      </div>
    </Reveal>
  );
}
