import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { PricingCard } from "@/components/Cards";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { Reveal, RevealItem, Stagger } from "@/components/Reveal";
import { Blobs, CtaBand, Faq, SectionHeading } from "@/components/Sections";
import { toneColor } from "@/components/Shapes";
import { art, benefits, faqs, plans } from "@/lib/content";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <>
      <PageHero
        image={art.pricing}
        alt="A meadow of pink and white cosmos flowers under fluffy clouds"
        eyebrow="Memberships"
        title="One subscription."
        accent="Endless shapes."
        sub="Pause or cancel anytime. A senior team for design, technology, AI and growth — for one flat monthly fee."
      />

      <section className="container-x -mt-10 pb-20">
        <Stagger className="grid items-stretch gap-6 lg:grid-cols-3" stagger={0.12}>
          {plans.map((p) => (
            <RevealItem key={p.name} className="h-full">
              <PricingCard {...p} />
            </RevealItem>
          ))}
          <RevealItem className="h-full">
            <GlassCard className="flex h-full flex-col gap-5 rounded-[32px] p-8 transition-transform duration-700 ease-[var(--ease-out)] hover:-translate-y-1.5">
              <h3 className="text-[18px] font-semibold tracking-[-0.02em]">Products &amp; Labs</h3>
              <span className="font-display text-[56px] font-semibold leading-none tracking-[-0.06em]">Soon</span>
              <p className="text-[16px] leading-[1.55] text-ink-2">
                Our own software: ShapesOS (early access 2027) and a suite of open-source tools. Members get early access.
              </p>
              <div className="relative min-h-[160px] flex-1 overflow-hidden rounded-[24px]">
                <Image src={art.products} alt="" fill sizes="400px" className="object-cover" />
              </div>
              <Button href="/products" variant="ghost" className="self-start">
                See products
              </Button>
            </GlassCard>
          </RevealItem>
        </Stagger>
      </section>

      <section className="relative isolate py-16">
        <Blobs className="opacity-70" />
        <div className="container-x flex flex-col gap-10">
          <SectionHeading eyebrow="Why members stay" title="Membership" accent="benefits." />
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <RevealItem key={b.title}>
                <GlassCard className="flex h-full flex-col gap-3 rounded-[28px] p-6">
                  <span className="size-3 rounded-full" style={{ background: toneColor[b.tone] }} />
                  <h3 className="text-[18px] font-semibold tracking-[-0.02em]">{b.title}</h3>
                  <p className="text-[14px] leading-[1.5] text-ink-2">{b.body}</p>
                </GlassCard>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="container-x flex flex-col gap-10 py-16 md:py-24">
        <SectionHeading eyebrow="FAQ" title="Questions," accent="answered." />
        <Reveal>
          <Faq items={faqs} />
        </Reveal>
      </section>

      <CtaBand image={art.pricing} />
    </>
  );
}
