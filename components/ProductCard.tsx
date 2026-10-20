import Link from "next/link";
import { statusMeta, type Product } from "@/lib/products";
import { Panel } from "./Panel";
import { Chip } from "./Chip";
import { ArrowUpRight } from "./Shapes";
import { ProductRender } from "./ProductRender";

export function StatusChip({ status, glass = false }: { status: Product["status"]; glass?: boolean }) {
  const s = statusMeta[status];
  return (
    <Chip tone={s.tone} glass={glass}>
      {s.label}
    </Chip>
  );
}

/** Product tile: the render up top, then lane, name, tagline and what it replaces. */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <Panel lift className="flex h-full flex-col p-1.5">
        <div className="frame rounded-[10px]">
          <ProductRender slug={product.slug} alt={`${product.name} render: ${product.meaning}`} className="aspect-[4/3]" />
          <div className="absolute left-3 top-3">
            <StatusChip status={product.status} glass />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 px-3.5 pb-3.5 pt-4">
          <span className="label text-ink-3">{product.lane}</span>
          <div className="flex items-start justify-between gap-4">
            <h3 className="h3">{product.name}</h3>
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-on-ink">
              <ArrowUpRight size={12} />
            </span>
          </div>
          <p className="small">{product.tagline}</p>
          <p className="hairline-t mt-auto pt-3 text-[12.5px] leading-[1.45] text-ink-3">
            {product.openSource === false ? product.license : <>Open source · {product.license}</>}
          </p>
        </div>
      </Panel>
    </Link>
  );
}
