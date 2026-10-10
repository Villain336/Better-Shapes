import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { GlassCard } from "@/components/GlassCard";
import { ProductCard, StatusChip } from "@/components/ProductCard";
import { WaitlistForm } from "@/components/Forms";
import { Button } from "@/components/Button";
import { Reveal, RevealItem, Stagger } from "@/components/Reveal";
import { SectionHeading } from "@/components/Sections";
import { CapabilityGlyph, toneColor, toneTint } from "@/components/Shapes";
import { art, toneFor } from "@/lib/content";
import { productBySlug, products, statusMeta } from "@/lib/products";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = productBySlug((await params).slug);
  return p ? { title: p.name, description: `${p.tagline} ${p.description}` } : {};
}

const dots = ["blue", "red", "yellow", "green", "blue"] as const;

export default async function ProductPage({ params }: Params) {
  const p = productBySlug((await params).slug);
  if (!p) notFound();
  const tone = toneFor[p.glyph];
  const more = products.filter((x) => x.slug !== p.slug && x.status !== "early-access").slice(0, 3);
  const heroArt = [art.products, art.home, art.work, art.pricing, art.blog, art.about];

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
        <Button href="#waitlist">{p.status === "early-access" ? "Join early access" : "Get notified"}</Button>
        {p.repo && (
          <Button href={p.repo} variant="glass">
            View on GitHub
          </Button>
        )}
      </PageHero>

      <section className="container-x grid gap-6 pb-16 lg:grid-cols-[1fr_380px]">
        <Reveal>
          <GlassCard className="flex h-full flex-col gap-6 rounded-[32px] p-8">
            <h2 className="text-[32px] font-semibold tracking-[-0.05em]">What it does</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {p.features.map((f, i) => (
                <li key={f} className="flex items-start gap-3 text-[16px] leading-[1.5]">
                  <span className="mt-[8px] size-2 shrink-0 rounded-full" style={{ background: toneColor[dots[i % dots.length]] }} />
                  {f}
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
        <Reveal delay={0.1}>
          <GlassCard className="flex h-full flex-col gap-5 rounded-[32px] p-8">
            <span className="grid size-16 place-items-center rounded-[20px]" style={{ background: toneTint[tone] }}>
              <CapabilityGlyph name={p.glyph} />
            </span>
            <StatusChip status={p.status} />
            <dl className="flex flex-col gap-4 text-[15px]">
              <div>
                <dt className="caption text-ink-3">For</dt>
                <dd className="mt-1 text-ink">{p.audience}</dd>
              </div>
              {p.alternativeTo && (
                <div>
                  <dt className="caption text-ink-3">Open-source alternative to</dt>
                  <dd className="mt-1 text-ink">{p.alternativeTo}</dd>
                </div>
              )}
              <div>
                <dt className="caption text-ink-3">License</dt>
                <dd className="mt-1 text-ink">{p.license}</dd>
              </div>
            </dl>
          </GlassCard>
        </Reveal>
      </section>

      <section id="waitlist" className="container-x scroll-mt-28 pb-16">
        <Reveal>
          <WaitlistForm product={p.name} />
        </Reveal>
      </section>

      <section className="container-x flex flex-col gap-10 pb-24">
        <SectionHeading eyebrow="More from Better Shapes" title="Keep" accent="exploring." />
        <Stagger className="grid gap-5 md:grid-cols-3">
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
