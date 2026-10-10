import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { HeroStack } from "@/components/HeroStack";
import { Button } from "@/components/Button";
import { Reveal, RevealItem, Stagger } from "@/components/Reveal";
import { Blobs, CtaBand, Marquee, SectionHeading } from "@/components/Sections";
import { CapabilityCard, ProjectCard, StatCard, TestimonialCard } from "@/components/Cards";
import { GlassCard } from "@/components/GlassCard";
import { LogoMark } from "@/components/Logo";
import { toneColor } from "@/components/Shapes";
import { art, capabilities, clients, projects, stats, steps, testimonials } from "@/lib/content";

export default function Home() {
  return (
    <>
      <PageHero
        tall
        image={art.home}
        alt="A field of blue poppies under a bright sky with a soft rainbow"
        eyebrow="Independent design & technology studio"
        title="Good ideas."
        accent="Better shape."
        sub="We connect brand, design, robotics and growth to turn your next chapter into something people feel — and trust."
        aside={<HeroStack />}
      >
        <Button href="/about#contact">Start a conversation</Button>
        <Button href="#capabilities" variant="glass">
          Explore capabilities
        </Button>
      </PageHero>

      {/* Steps ticker + trusted-by marquee */}
      <section className="container-x flex flex-col gap-10 pb-16">
        <div className="caption flex flex-wrap gap-x-10 gap-y-2 text-ink-2">
          {["01 / Strategy", "02 / Design", "03 / Build", "04 / Grow"].map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-12">
          <span className="caption shrink-0 text-ink-3">
            Trusted by teams
            <br />
            building what’s next
          </span>
          <div className="w-full min-w-0">
            <Marquee items={clients} />
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="relative isolate scroll-mt-24 py-16 md:py-24">
        <Blobs />
        <div className="container-x flex flex-col gap-14">
          <SectionHeading
            eyebrow="What we do"
            title="Four disciplines."
            accent="One calm team."
            side={
              <p className="max-w-[340px] text-[16px] leading-[1.55] text-ink-2">
                Strategy, craft and engineering under one roof — so nothing gets lost in the handoff.
              </p>
            }
          />
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c, i) => (
              <RevealItem key={c.name} className="h-full">
                <CapabilityCard name={c.name} blurb={c.blurb} index={i} />
              </RevealItem>
            ))}
          </Stagger>
          <Reveal className="flex items-center gap-3 text-[16px] text-ink-2">
            <LogoMark size={18} />
            Every engagement starts with a free 30-minute shaping session.
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="container-x py-12 md:py-16">
        <Reveal className="relative isolate flex min-h-[640px] flex-col justify-between overflow-hidden rounded-[40px] p-5 md:p-12">
          <Image src={art.sign} alt="The Better Shapes stone sign in a meadow" fill sizes="100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-black/50" />
          <span className="glass eyebrow self-start rounded-full px-3.5 py-2 text-ink">How it works</span>
          <Stagger className="grid gap-4 md:grid-cols-3 md:gap-5" stagger={0.12}>
            {steps.map((s) => (
              <RevealItem key={s.n}>
                <GlassCard className="flex h-full flex-col gap-3 rounded-[28px] px-6 pb-6 pt-5">
                  <span className="caption flex items-center gap-2.5 text-ink-3">
                    <span className="size-2.5 rounded-full" style={{ background: toneColor[s.tone] }} />
                    {s.n}
                  </span>
                  <h3 className="text-[36px] font-medium tracking-[-0.05em] md:text-[40px]">{s.title}</h3>
                  <p className="text-[16px] leading-[1.55] text-ink-2">{s.body}</p>
                </GlassCard>
              </RevealItem>
            ))}
          </Stagger>
        </Reveal>
      </section>

      {/* Featured work */}
      <section className="container-x flex flex-col gap-12 py-16 md:py-24">
        <SectionHeading
          eyebrow="Selected work"
          title="Shaped"
          accent="with care."
          side={
            <Button href="/work" variant="ghost">
              View all work
            </Button>
          }
        />
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <ProjectCard project={projects[0]} />
          </Reveal>
          <Reveal delay={0.1}>
            <ProjectCard project={projects[4]} />
          </Reveal>
        </div>
      </section>

      {/* Testimonials + stats */}
      <section className="container-x grid gap-6 py-16 md:py-24 lg:grid-cols-[1.6fr_1fr]">
        <Reveal className="relative isolate overflow-hidden rounded-[40px] p-5 md:p-12">
          <Image src={art.pricing} alt="" fill sizes="(min-width:1024px) 60vw, 100vw" className="-z-10 object-cover" />
          <div className="max-w-[540px]">
            <TestimonialCard {...testimonials[0]} image={art.about} />
          </div>
        </Reveal>
        <Stagger className="flex flex-col gap-6">
          {stats.map((s) => (
            <RevealItem key={s.label}>
              <StatCard value={s.value} label={s.label} />
            </RevealItem>
          ))}
        </Stagger>
      </section>

      <CtaBand image={art.about} />
    </>
  );
}
