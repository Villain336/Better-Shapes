import Link from "next/link";
import { statusMeta, type Product } from "@/lib/products";
import { GlassCard } from "./GlassCard";
import { Chip } from "./Chip";
import { ArrowUpRight } from "./Shapes";
import { ProductRender } from "./ProductRender";

export function StatusChip({ status }: { status: Product["status"] }) {
  const s = statusMeta[status];
  return <Chip tone={s.tone}>{s.label}</Chip>;
}

/** Product tile: 3D render up top, then status, name, tagline and what it replaces. */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="block h-full">
      <GlassCard className="flex h-full flex-col rounded-[32px] p-2 transition-transform duration-700 ease-[var(--ease-out)] hover:-translate-y-1.5">
        <div className="relative overflow-hidden rounded-[26px]">
          <ProductRender
            slug={product.slug}
            alt={`${product.name} product render`}
            className="aspect-[4/3] transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover/card:scale-[1.05]"
          />
          <div className="absolute left-3 top-3">
            <StatusChip status={product.status} />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 px-4 pb-4 pt-4">
          <span className="caption text-ink-3">{product.lane}</span>
          <h3 className="text-[26px] font-semibold tracking-[-0.045em]">{product.name}</h3>
          <p className="text-[15px] leading-[1.5] text-ink-2">{product.tagline}</p>
          <div className="mt-auto flex items-center justify-between gap-4 pt-4">
            <span className="text-[13px] leading-[1.4] text-ink-3">
              {product.alternativeTo ? <>Open-source alternative to {product.alternativeTo}</> : product.license}
            </span>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors duration-300 group-hover/card:bg-brand-blue">
              <ArrowUpRight className="transition-transform duration-500 ease-[var(--ease-out)] group-hover/card:rotate-45" />
            </span>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
