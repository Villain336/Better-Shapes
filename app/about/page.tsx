import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Panel } from "@/components/Panel";
import { ContactForm } from "@/components/Forms";
import { Reveal, RevealItem, Stagger } from "@/components/Reveal";
import { SectionHeading } from "@/components/Sections";
import { Eyebrow } from "@/components/Eyebrow";
import { Check, toneColor } from "@/components/Shapes";
import { art, values } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

const promises = ["A free 30-minute shaping session", "A reply within one business day", "No proposals, no 40-page decks"];

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
      <section className="container-x grid items-start gap-8 pb-24 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        <Reveal className="frame aspect-[4/3]">
          <Image src={art.sign} alt="The Better Shapes sign on a wildflower hillside" fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
        </Reveal>
        <Reveal delay={0.08} className="flex flex-col gap-5 lg:pt-2">
          <Eyebrow>Our story</Eyebrow>
          <p className="display text-[clamp(22px,2.4vw,30px)] font-medium leading-[1.25] tracking-[-0.02em] text-ink">
            Most good ideas stall in the handoffs: design to code, code to launch, launch to growth. We do all of it in
            one place, with AI built in from the start.
          </p>
          <p className="body">
            We take ideas from napkin to launch, from software and AI agents to the story around both, and we build our
            own products the same way.
          </p>
        </Reveal>
      </section>

      {/* Values */}
      <section className="container-x flex flex-col gap-10 pb-24">
        <SectionHeading eyebrow="Values" title="What we" accent="believe." />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <RevealItem key={v.title} className="h-full">
              <Panel className="flex h-full flex-col gap-4 p-5">
                <div className="flex items-center justify-between">
                  <span className="size-2 rounded-full" style={{ background: toneColor[v.tone] }} />
                  <span className="label text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="h3">{v.title}</h3>
                  <p className="small">{v.body}</p>
                </div>
              </Panel>
            </RevealItem>
          ))}
        </Stagger>
      </section>

      {/* Contact */}
      <section id="contact" className="container-x scroll-mt-24 pb-24">
        <Reveal className="grid items-start gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
          <div className="flex flex-col gap-6">
            <Eyebrow>Contact</Eyebrow>
            <h2 className="h2">
              Let’s <span className="text-ink-3">talk.</span>
            </h2>
            <p className="body max-w-[420px]">Tell us what you’re shaping. We reply within one business day — usually with a few ideas.</p>
            <ul className="flex flex-col">
              {promises.map((p, i) => (
                <li key={p} className={`flex items-center gap-3 py-3 text-[14px] text-ink-2 ${i > 0 ? "hairline-t" : ""}`}>
                  <Check size={14} className="text-ink-3" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="frame hidden aspect-[16/9] lg:block">
              <Image src={art.pricing} alt="" fill sizes="400px" className="object-cover" />
            </div>
          </div>
          <Panel className="p-6 md:p-8">
            <ContactForm />
          </Panel>
        </Reveal>
      </section>
    </>
  );
}
