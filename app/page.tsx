import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { HeroBrief } from "@/components/HeroBrief";
import { Button } from "@/components/Button";
import { Reveal, RevealItem, Stagger } from "@/components/Reveal";
import { CtaBand, Marquee, SectionHeading, StatStrip, Timeline } from "@/components/Sections";
import { CapabilityCard, ProjectCard } from "@/components/Cards";
import { Panel } from "@/components/Panel";
import { Eyebrow } from "@/components/Eyebrow";
import { Check } from "@/components/Shapes";
import { ProductCard } from "@/components/ProductCard";
import { ProductFeature } from "@/components/ProductFeature";
import { flagship, products, statusMeta } from "@/lib/products";
import { art, benefits, capabilities, projects, requestables, steps } from "@/lib/content";

export default function Home() {
  const openSource = products.filter((p) => p.openSource !== false).length;
  const rest = products.filter((p) => p.slug !== flagship.slug);

  return (
    <>
      <PageHero
        tall
        image={art.home}
        alt="A field of blue poppies under a bright sky with a soft rainbow"
        eyebrow="Independent design & technology studio"
        title="Good ideas."
        accent="Better shape."
        sub="We connect brand, design, AI and growth to turn your next chapter into something people feel — and trust."
        aside={<HeroBrief />}
        note="Free 30-minute shaping session · Pause or cancel anytime"
      >
        <Button href="/about#contact">Start a conversation</Button>
        <Button href="#how" variant="outline">
          How it works
        </Button>
      </PageHero>

      <section className="container-x flex flex-col gap-10 pb-20">
        <StatStrip
          items={[
            { label: "Disciplines", value: "4", note: "Design, tech, AI and growth" },
            { label: "Average delivery", value: "72h", note: "Per request, start to finish" },
            { label: "Products in the lineup", value: String(products.length), note: `${openSource} of them open source` },
            { label: "Flagship", value: flagship.name, note: statusMeta[flagship.status].label },
          ]}
        />
        <Marquee label="Request anything" items={requestables} />
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="container-x flex scroll-mt-24 flex-col gap-10 pb-24">
        <SectionHeading
          eyebrow="What we do"
          title="Four disciplines."
          accent="One calm team."
          description="Strategy, craft and engineering under one roof, so nothing gets lost in the handoff."
        />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c, i) => (
            <RevealItem key={c.name} className="h-full">
              <CapabilityCard name={c.name} blurb={c.blurb} index={i} points={c.points} exploring={c.exploring} />
            </RevealItem>
          ))}
        </Stagger>
      </section>

      {/* How it works */}
      <section id="how" className="container-x flex scroll-mt-24 flex-col gap-12 pb-24">
        <SectionHeading
          eyebrow="How it works"
          title="Subscribe, request,"
          accent="receive."
          description="A membership instead of a proposal. Add requests to your board; we work through them one at a time."
          side={
            <Button href="/pricing" variant="outline">
              See memberships
            </Button>
          }
        />
        <Timeline steps={steps} />
        <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <Reveal className="frame aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
            <Image src={art.sign} alt="The Better Shapes stone sign in a meadow" fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
          </Reveal>
          <Reveal delay={0.08}>
            <Panel className="flex h-full flex-col gap-6 p-6 md:p-7">
              <Eyebrow>Why members stay</Eyebrow>
              <ul className="flex flex-col">
                {benefits.map((b, i) => (
                  <li key={b.title} className={`flex gap-3.5 py-3.5 ${i > 0 ? "hairline-t" : "pt-0"}`}>
                    <Check size={14} className="mt-1 shrink-0 text-ink-3" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-medium text-ink">{b.title}</span>
                      <span className="small">{b.body}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          </Reveal>
        </div>
      </section>

      {/* Products */}
      <section className="container-x flex flex-col gap-8 pb-24">
        <SectionHeading
          eyebrow="Products"
          title="We build our own"
          accent="tools too."
          description="Our products are the proof of how we work. Almost everything we make is open source."
          side={
            <Button href="/products" variant="outline">
              All products
            </Button>
          }
        />
        <ProductFeature product={flagship} />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((p) => (
            <RevealItem key={p.slug} className="h-full">
              <ProductCard product={p} />
            </RevealItem>
          ))}
        </Stagger>
      </section>

      {/* Work */}
      <section className="container-x flex flex-col gap-8 pb-24">
        <SectionHeading
          eyebrow="Our work"
          title="Shaped"
          accent="in-house."
          side={
            <Button href="/work" variant="outline">
              View all work
            </Button>
          }
        />
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <ProjectCard project={projects[0]} tall />
          </Reveal>
          <Reveal delay={0.08}>
            <ProjectCard project={projects[1]} tall />
          </Reveal>
        </div>
      </section>

      {/* Open by default */}
      <section className="container-x pb-24">
        <Reveal className="hairline-t hairline-b grid gap-8 py-14 md:grid-cols-[1fr_2fr] md:py-20">
          <Eyebrow>Open by default</Eyebrow>
          <div className="flex flex-col items-start gap-7">
            <p className="display max-w-[760px] text-[clamp(26px,3.2vw,40px)] font-medium leading-[1.15] tracking-[-0.025em] text-ink">
              Almost everything we make is open source, so you can read the code, run it yourself and hold us to it.
            </p>
            <Button href="/products" variant="outline">
              See the lineup
            </Button>
          </div>
        </Reveal>
      </section>

      <CtaBand image={art.about} />
    </>
  );
}
