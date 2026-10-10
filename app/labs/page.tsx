import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { GlassCard } from "@/components/GlassCard";
import { WaitlistForm } from "@/components/Forms";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { Reveal, RevealItem, Stagger } from "@/components/Reveal";
import { Blobs, SectionHeading } from "@/components/Sections";
import { toneColor } from "@/components/Shapes";
import { art, type Tone } from "@/lib/content";

export const metadata: Metadata = {
  title: "Labs",
  description:
    "Better Shapes Labs explores robotics and physical AI. It's a venture in research; nothing has been released yet.",
};

const questions: { title: string; body: string; tone: Tone }[] = [
  {
    title: "Agents with hands",
    body: "What happens when the approval-first agents in ShapesOS can act in warehouses, farms and shops, not just inboxes?",
    tone: "blue",
  },
  {
    title: "Calm machines",
    body: "Robots people are comfortable around: legible intent, gentle motion, and an off switch everyone understands.",
    tone: "red",
  },
  {
    title: "Open by default",
    body: "Building on open foundations like ROS and Open-RMF rather than another closed fleet platform.",
    tone: "yellow",
  },
  {
    title: "Design to make",
    body: "Going from an idea to a part you can print or machine, with AI-native CAD (our planned Fab).",
    tone: "green",
  },
];

export default function LabsPage() {
  return (
    <>
      <PageHero
        image={art.labs}
        alt="White and violet anemones at dawn above misty hills"
        eyebrow="Labs · Exploring"
        title="The physical"
        accent="future, gently."
        sub="Labs is where we explore robotics and physical AI: automation and intelligence that leave the screen. It’s research for now. We haven’t released anything, and we’ll say so plainly until we do."
      >
        <Button href="#interest">Join the interest list</Button>
        <Button href="/products" variant="glass">
          See what’s shipping
        </Button>
      </PageHero>

      <section className="relative isolate py-16">
        <Blobs className="opacity-70" />
        <div className="container-x flex flex-col gap-10">
          <SectionHeading
            eyebrow="What we’re exploring"
            title="Four questions"
            accent="we can’t stop asking."
            side={<Chip tone="red">Nothing released yet</Chip>}
          />
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {questions.map((q) => (
              <RevealItem key={q.title} className="h-full">
                <GlassCard className="flex h-full flex-col gap-3 rounded-[28px] px-6 pb-7 pt-6">
                  <span className="size-3.5 rounded-full" style={{ background: toneColor[q.tone] }} />
                  <h3 className="text-[22px] font-semibold tracking-[-0.04em]">{q.title}</h3>
                  <p className="text-[14px] leading-[1.55] text-ink-2">{q.body}</p>
                </GlassCard>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="container-x grid gap-6 py-16 lg:grid-cols-2">
        <Reveal>
          <GlassCard className="flex h-full flex-col gap-4 rounded-[32px] p-8">
            <span className="caption text-ink-3">How Labs works</span>
            <p className="text-[18px] leading-[1.6] text-ink">
              Labs runs alongside the studio. We read, prototype in simulation and talk to people who run physical
              operations. When something is real enough to put in your hands, it moves to the Products page with a
              status and a date, the same way ShapesOS did.
            </p>
          </GlassCard>
        </Reveal>
        <Reveal delay={0.1}>
          <GlassCard className="flex h-full flex-col gap-4 rounded-[32px] p-8">
            <span className="caption text-ink-3">Partner with us</span>
            <p className="text-[18px] leading-[1.6] text-ink">
              Running a warehouse, farm, lab or shop floor with a problem that feels automatable? We’re looking for a
              few design partners to learn from. No commitment, no sales pitch.
            </p>
            <Button href="/about#contact" variant="ghost" className="mt-auto self-start">
              Tell us about it
            </Button>
          </GlassCard>
        </Reveal>
      </section>

      <section id="interest" className="container-x scroll-mt-28 pb-24 pt-8">
        <Reveal>
          <WaitlistForm product="Labs" title="Hear first when Labs ships something." />
        </Reveal>
      </section>
    </>
  );
}
