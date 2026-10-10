import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { StatCard } from "@/components/Cards";
import { GlassCard } from "@/components/GlassCard";
import { ContactForm } from "@/components/Forms";
import { Reveal, RevealItem, Stagger } from "@/components/Reveal";
import { Blobs, SectionHeading } from "@/components/Sections";
import { CapabilityGlyph, toneColor, toneTint } from "@/components/Shapes";
import { art, team, values } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

const glyphFor = { blue: "Tech", red: "Design", yellow: "Robotics", green: "Marketing" } as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        image={art.about}
        alt="A sunlit hillside of pink peonies above a winding river valley"
        eyebrow="About the studio"
        title="Small team."
        accent="Big calm."
        sub="Better Shapes is an independent studio of designers, engineers and roboticists. We believe good ideas deserve a shape people can trust."
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
              We started as a two-person design shop that kept getting asked to “also build it.” Then to “also make it
              move.” Today we’re a calm, senior team that takes ideas from napkin to launch — software, hardware and
              the story around both.
            </p>
          </Reveal>
          <Stagger className="grid grid-cols-3 gap-3 md:gap-4">
            {[
              ["2016", "Founded"],
              ["24", "People"],
              ["9", "Countries"],
            ].map(([v, l]) => (
              <RevealItem key={l}>
                <StatCard value={v} label={l} className="!px-4 md:!px-6" />
              </RevealItem>
            ))}
          </Stagger>
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

      {/* Team */}
      <section className="container-x flex flex-col gap-10 py-16">
        <SectionHeading eyebrow="Team" title="The people" accent="behind the shapes." />
        <Stagger className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {team.map((m) => (
            <RevealItem key={m.name}>
              <GlassCard className="flex flex-col gap-4 rounded-[28px] p-4">
                <div
                  className="grid aspect-square place-items-center rounded-[20px] transition-transform duration-700 ease-[var(--ease-out)] group-hover/card:scale-[0.98]"
                  style={{ background: toneTint[m.tone] }}
                >
                  <span className="transition-transform duration-700 ease-[var(--ease-out)] group-hover/card:rotate-[20deg] group-hover/card:scale-110">
                    <CapabilityGlyph name={glyphFor[m.tone]} size={56} />
                  </span>
                </div>
                <div className="px-1 pb-1">
                  <div className="text-[18px] font-semibold tracking-[-0.02em]">{m.name}</div>
                  <div className="text-[14px] text-ink-3">{m.role}</div>
                </div>
              </GlassCard>
            </RevealItem>
          ))}
        </Stagger>
      </section>

      {/* Contact */}
      <section id="contact" className="container-x scroll-mt-28 pb-24 pt-8">
        <Reveal className="relative isolate grid gap-8 overflow-hidden rounded-[40px] p-4 md:rounded-[48px] md:p-12 lg:grid-cols-[1fr_520px]">
          <Image src={art.pricing} alt="" fill sizes="100vw" className="-z-10 object-cover" />
          <div className="flex flex-col items-start gap-4 p-2 md:p-0">
            <a href="mailto:hello@bettershapes.co" className="glass rounded-full px-4 py-2 text-[15px] font-medium">
              hello@bettershapes.co
            </a>
          </div>
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
