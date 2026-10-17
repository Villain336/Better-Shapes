import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { GlassCard } from "@/components/GlassCard";
import { ContactForm } from "@/components/Forms";
import { Reveal, RevealItem, Stagger } from "@/components/Reveal";
import { Blobs, SectionHeading } from "@/components/Sections";
import { toneColor } from "@/components/Shapes";
import { art, values } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageHero
        image={art.about}
        alt="A sunlit hillside of pink peonies above a winding river valley"
        eyebrow="About the studio"
        title="Small team."
        accent="Big calm."
        sub="Better Shapes is an independent studio of designers, engineers and AI builders. We believe good ideas deserve a shape people can trust."
      />

      {/* Story */}
      <section className="container-x grid items-start gap-8 pb-16 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
        <Reveal className="relative aspect-[640/520] overflow-hidden rounded-[40px]">
          <Image src={art.sign} alt="The Better Shapes sign on a wildflower hillside" fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
        </Reveal>
        <div className="flex flex-col gap-6 lg:pt-4">
          <Reveal>
            <span className="eyebrow text-ink-3">Our story</span>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-[20px] leading-[1.5] tracking-[-0.01em] md:text-[22px]">
              Most good ideas stall in the handoffs: design to code, code to launch, launch to growth. We do all of it
              in one place, with AI built in from the start. We take ideas from napkin to launch, from software and AI
              agents to the story around both, and we build our own products the same way.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="relative isolate py-16 md:py-20">
        <Blobs className="opacity-70" />
        <div className="container-x flex flex-col gap-10">
          <SectionHeading eyebrow="Values" title="What we" accent="believe." />
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <RevealItem key={v.title} className="h-full">
                <GlassCard className="flex h-full flex-col gap-3 rounded-[28px] px-6 pb-7 pt-6">
                  <span className="size-3.5 rounded-full" style={{ background: toneColor[v.tone] }} />
                  <h3 className="text-[24px] font-medium tracking-[-0.04em]">{v.title}</h3>
                  <p className="text-[14px] leading-[1.5] text-ink-2">{v.body}</p>
                </GlassCard>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="container-x scroll-mt-28 pb-24 pt-8">
        <Reveal className="relative isolate grid gap-8 overflow-hidden rounded-[40px] p-4 md:rounded-[48px] md:p-12 lg:grid-cols-[1fr_520px]">
          <Image src={art.pricing} alt="" fill sizes="100vw" className="-z-10 object-cover" />
          <div aria-hidden />
          <div className="glass flex flex-col gap-5 rounded-[32px] p-6 md:p-10">
            <h2 className="text-[40px] font-semibold leading-none tracking-[-0.055em]">
              Let’s <span className="text-ink-3">talk.</span>
            </h2>
            <p className="text-[16px] leading-[1.55] text-ink-2">
              Tell us what you’re shaping. We reply within one business day — usually with a few ideas.
            </p>
            <ContactForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}
