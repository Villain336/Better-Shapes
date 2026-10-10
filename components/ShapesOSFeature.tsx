import Image from "next/image";
import { art } from "@/lib/content";
import { productBySlug } from "@/lib/products";
import { Button } from "./Button";
import { Reveal } from "./Reveal";
import { StatusChip } from "./ProductCard";
import { toneColor } from "./Shapes";

const dots = ["blue", "red", "yellow", "green", "blue"] as const;

/** The flagship ShapesOS panel used on Home and /products. */
export function ShapesOSFeature() {
  const p = productBySlug("shapesos")!;
  return (
    <Reveal className="relative isolate grid gap-6 overflow-hidden rounded-[40px] p-4 md:rounded-[48px] md:p-10 lg:grid-cols-[1fr_460px] lg:items-end">
      <Image src={art.products} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(250,248,244,0.75),rgba(250,248,244,0.2))] lg:bg-[linear-gradient(90deg,rgba(250,248,244,0.8)_0%,rgba(250,248,244,0)_60%)]" />
      <div className="flex flex-col items-start gap-5 p-2 md:p-0">
        <StatusChip status={p.status} />
        <h3 className="text-[48px] font-semibold leading-[0.95] tracking-[-0.06em] md:text-[72px]">{p.name}</h3>
        <p className="max-w-[460px] text-[18px] leading-[1.5] text-ink-2 md:text-[20px]">
          {p.tagline} Agents propose, people approve, and nothing touches money or customers without you.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="/products/shapesos">Join early access</Button>
          <Button href="/products" variant="glass">
            All products
          </Button>
        </div>
      </div>
      <div className="glass flex flex-col gap-3 rounded-[28px] p-6">
        <span className="caption text-ink-3">Inside ShapesOS</span>
        <ul className="flex flex-col gap-3">
          {p.features.map((f, i) => (
            <li key={f} className="flex items-start gap-3 text-[15px] leading-[1.45]">
              <span className="mt-[7px] size-2 shrink-0 rounded-full" style={{ background: toneColor[dots[i % dots.length]] }} />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
