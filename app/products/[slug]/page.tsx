import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { Panel } from "@/components/Panel";
import { ProductCard, StatusChip } from "@/components/ProductCard";
import { WaitlistForm } from "@/components/Forms";
import { Button } from "@/components/Button";
import { Reveal, RevealItem, Stagger } from "@/components/Reveal";
import { SectionHeading } from "@/components/Sections";
import { Check } from "@/components/Shapes";
import { ProductRender } from "@/components/ProductRender";
import { Eyebrow } from "@/components/Eyebrow";
import { art } from "@/lib/content";
import { productBySlug, products, statusMeta } from "@/lib/products";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = productBySlug((await params).slug);
  return p ? { title: p.name, description: `${p.tagline} ${p.description}` } : {};
}

export default async function ProductPage({ params }: Params) {
  const p = productBySlug((await params).slug);
  if (!p) notFound();
  const more = products.filter((x) => x.slug !== p.slug).slice(0, 4);
  const heroArt = [art.products, art.home, art.work, art.pricing, art.labs];

  const facts: [string, string][] = [
    ["For", p.audience],
    ["Status", statusMeta[p.status].label],
    ["License", p.openSource === false ? p.license : `Open source · ${p.license}`],
  ];

  return (
    <>
      <PageHero
        image={heroArt[products.indexOf(p) % heroArt.length]}
        alt=""
        smallAccent
        eyebrow={`${p.lane} · ${statusMeta[p.status].label}`}
        title={p.name}
        accent={p.tagline}
        sub={p.description}
      >
        <Button href="#waitlist">{p.status === "early-access" ? "Get early access" : "Get notified"}</Button>
        {p.repo && (
          <Button href={p.repo} variant="outline">
            View on GitHub
          </Button>
        )}
      </PageHero>

      <section className="container-x grid items-start gap-4 pb-24 lg:grid-cols-[1fr_360px]">
        <Reveal>
          <Panel className="flex h-full flex-col gap-6 p-6 md:p-8">
            <h2 className="h2 text-[28px]">What it does</h2>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {p.features.map((f, i) => (
                <li key={f} className={`flex items-start gap-3 py-3.5 text-[15px] leading-[1.5] text-ink ${i >= 1 ? "hairline-t" : ""} ${i === 1 ? "sm:border-t-0" : ""}`}>
                  <Check size={14} className="mt-1 shrink-0 text-ink-3" />
                  {f}
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>
        <Reveal delay={0.08}>
          <Panel className="flex h-full flex-col gap-5 p-1.5">
            <ProductRender slug={p.slug} alt={`${p.name} render: ${p.meaning}`} className="aspect-square rounded-[10px]" sizes="360px" />
            <div className="flex flex-col gap-5 px-3.5 pb-4">
              <div className="flex flex-col items-start gap-2">
                <StatusChip status={p.status} />
                <p className="small">{p.meaning}</p>
              </div>
              <dl className="flex flex-col">
                {facts.map(([k, v], i) => (
                  <div key={k} className={`flex flex-col gap-1 py-3 ${i > 0 ? "hairline-t" : "pt-0"}`}>
                    <dt className="label text-ink-3">{k}</dt>
                    <dd className="text-[14px] leading-[1.5] text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Panel>
        </Reveal>
      </section>

      <section className="container-x pb-24">
        <Reveal className="hairline-t hairline-b grid items-start gap-8 py-12 md:grid-cols-[1fr_2fr] md:py-16">
          <Eyebrow>How it fits</Eyebrow>
          <p className="display max-w-[760px] text-[clamp(22px,2.6vw,32px)] font-medium leading-[1.25] tracking-[-0.02em] text-ink">
            {p.fit}
          </p>
        </Reveal>
      </section>

      <section id="waitlist" className="container-x scroll-mt-24 pb-24">
        <Reveal>
          <WaitlistForm product={p.name} />
        </Reveal>
      </section>

      <section className="container-x flex flex-col gap-10 pb-24">
        <SectionHeading eyebrow="More from Better Shapes" title="Keep" accent="exploring." />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {more.map((x) => (
            <RevealItem key={x.slug} className="h-full">
              <ProductCard product={x} />
            </RevealItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}
