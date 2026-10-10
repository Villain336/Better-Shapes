import Link from "next/link";
import { toneFor } from "@/lib/content";
import { statusMeta, type Product } from "@/lib/products";
import { GlassCard } from "./GlassCard";
import { Chip } from "./Chip";
import { ArrowUpRight, CapabilityGlyph, toneTint } from "./Shapes";

export function StatusChip({ status }: { status: Product["status"] }) {
  const s = statusMeta[status];
  return <Chip tone={s.tone}>{s.label}</Chip>;
}

/** Glass product tile: shape glyph, status, name, tagline and what it replaces. */
export function ProductCard({ product }: { product: Product }) {
  const tone = toneFor[product.glyph];
  return (
    <Link href={`/products/${product.slug}`} className="block h-full">
      <GlassCard className="flex h-full flex-col gap-5 rounded-[32px] p-6 transition-transform duration-700 ease-[var(--ease-out)] hover:-translate-y-1.5">
        <div className="flex items-start justify-between gap-3">
          <span
            className="grid size-14 shrink-0 place-items-center rounded-[18px] transition-transform duration-700 ease-[var(--ease-out)] group-hover/card:rotate-[12deg]"
            style={{ background: toneTint[tone] }}
          >
            <CapabilityGlyph name={product.glyph} size={28} />
          </span>
          <StatusChip status={product.status} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="caption text-ink-3">{product.lane}</span>
          <h3 className="text-[26px] font-semibold tracking-[-0.045em]">{product.name}</h3>
          <p className="text-[15px] leading-[1.5] text-ink-2">{product.tagline}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/70 pt-4">
          <span className="text-[13px] leading-[1.4] text-ink-3">
            {product.alternativeTo ? <>Open-source alternative to {product.alternativeTo}</> : product.license}
          </span>
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors duration-300 group-hover/card:bg-brand-blue">
            <ArrowUpRight className="transition-transform duration-500 ease-[var(--ease-out)] group-hover/card:rotate-45" />
          </span>
        </div>
      </GlassCard>
    </Link>
  );
}
