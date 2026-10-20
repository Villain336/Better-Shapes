import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Painting } from "@/components/Painting";
import { PricingCard } from "@/components/Cards";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/Button";
import { Reveal, RevealItem, Stagger } from "@/components/Reveal";
import { CtaBand, Faq, SectionHeading } from "@/components/Sections";
import { Eyebrow } from "@/components/Eyebrow";
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
        note="No contracts · No proposals · Every file is yours"
      />

      <section className="container-x -mt-6 pb-24">
        <Stagger className="grid items-stretch gap-4 lg:grid-cols-3" stagger={0.08}>
          {plans.map((p) => (
            <RevealItem key={p.name} className="h-full">
              <PricingCard {...p} />
            </RevealItem>
          ))}
          <RevealItem className="h-full">
            <Panel className="flex h-full flex-col gap-5 p-6 md:p-7">
              <span className="label text-ink-3">Products &amp; Labs</span>
              <span className="num text-[44px] md:text-[48px]">Free</span>
              <p className="text-[14px] leading-[1.55] text-ink-2">
                Our own software: ShapesOS (launching Dec 1, 2026), Periscope, Canary, Kiln, Ripple and Flock, all open source and free to self-host.
                Members get early access and a say in what we build next.
              </p>
              <div className="frame min-h-[160px] flex-1 rounded-[10px]">
                <Painting src={art.products} sizes="400px" />
              </div>
              <Button href="/products" variant="outline" className="w-full">
                See products
              </Button>
            </Panel>
          </RevealItem>
        </Stagger>
      </section>

      <section className="container-x flex flex-col gap-10 pb-24">
        <SectionHeading eyebrow="Why members stay" title="Membership" accent="benefits." />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <RevealItem key={b.title}>
              <Panel className="flex h-full flex-col gap-3 p-5">
                <span className="size-2 rounded-full" style={{ background: toneColor[b.tone] }} />
                <h3 className="h3 text-[17px]">{b.title}</h3>
                <p className="small">{b.body}</p>
              </Panel>
            </RevealItem>
          ))}
        </Stagger>
      </section>

      <section className="container-x grid gap-10 pb-24 lg:grid-cols-[1fr_2fr]">
        <Reveal className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="h2">Straight answers.</h2>
          <p className="body">Can’t find yours? Ask us anything — we reply within one business day.</p>
          <Button href="/about#contact" variant="outline" className="mt-2 self-start">
            Ask a question
          </Button>
        </Reveal>
        <Reveal delay={0.08}>
          <Faq items={faqs} />
        </Reveal>
      </section>

      <CtaBand image={art.pricing} />
    </>
  );
}
