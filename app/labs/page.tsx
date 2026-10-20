import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Panel } from "@/components/Panel";
import { WaitlistForm } from "@/components/Forms";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { ProductRender } from "@/components/ProductRender";
import { ProductFeature } from "@/components/ProductFeature";
import { Reveal, RevealItem, Stagger } from "@/components/Reveal";
import { SectionHeading } from "@/components/Sections";
import { toneColor } from "@/components/Shapes";
import { art, type Tone } from "@/lib/content";
import { productBySlug } from "@/lib/products";

export const metadata: Metadata = {
  title: "Labs",
  description:
    "Better Shapes Labs explores robotics and physical AI, starting with Flock, a mesh operating system for small drones. It's research; nothing has been released yet.",
};

const questions: { title: string; body: string; tone: Tone }[] = [
  {
    title: "Many, not one",
    body: "What changes when a fleet has no mothership? Flock treats every drone as a peer that can carry the map, the plan and the failover.",
    tone: "blue",
  },
  {
    title: "Calm machines",
    body: "Robots people are comfortable around: legible intent, gentle motion, and an off switch everyone understands.",
    tone: "red",
  },
  {
    title: "Open by default",
    body: "Building on open foundations like ROS 2, PX4 and MAVLink rather than another closed fleet platform.",
    tone: "yellow",
  },
  {
    title: "Eyes before hands",
    body: "Periscope lets agents see; Kiln trains what they see with. Labs asks what it takes to let them act safely in the world.",
    tone: "green",
  },
];

export default function LabsPage() {
  const flock = productBySlug("flock")!;
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
        <Button href="/products" variant="outline">
          See what’s shipping
        </Button>
      </PageHero>

      <section className="container-x pb-24">
        <ProductFeature product={flock} eyebrow="Current project" image={art.labs} />
      </section>

      <section className="container-x flex flex-col gap-10 pb-24">
        <SectionHeading
          eyebrow="What we’re exploring"
          title="Four questions"
          accent="we can’t stop asking."
          side={
            <div className="flex items-center gap-3">
              <ProductRender slug="field" className="size-12 rounded-[10px]" sizes="48px" />
              <Chip tone="red">Nothing released yet</Chip>
            </div>
          }
        />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {questions.map((q, i) => (
            <RevealItem key={q.title} className="h-full">
              <Panel className="flex h-full flex-col gap-4 p-5">
                <div className="flex items-center justify-between">
                  <span className="size-2 rounded-full" style={{ background: toneColor[q.tone] }} />
                  <span className="label text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="h3">{q.title}</h3>
                  <p className="small">{q.body}</p>
                </div>
              </Panel>
            </RevealItem>
          ))}
        </Stagger>
      </section>

      <section className="container-x grid gap-4 pb-24 lg:grid-cols-2">
        <Reveal>
          <Panel className="flex h-full flex-col gap-4 p-6 md:p-7">
            <span className="label text-ink-3">How Labs works</span>
            <p className="text-[16px] leading-[1.6] text-ink">
              Labs runs alongside the studio. We read, prototype in simulation and talk to people who run physical
              operations. When something is real enough to put in your hands, it moves from “exploring” to a status
              and a date on the Products page.
            </p>
          </Panel>
        </Reveal>
        <Reveal delay={0.08}>
          <Panel className="flex h-full flex-col gap-4 p-6 md:p-7">
            <span className="label text-ink-3">Partner with us</span>
            <p className="text-[16px] leading-[1.6] text-ink">
              Running a farm, an inspection crew, a warehouse or a research group with a fleet problem? We’re looking
              for a few design partners to learn from. No commitment, no sales pitch.
            </p>
            <Button href="/about#contact" variant="outline" className="mt-auto self-start">
              Tell us about it
            </Button>
          </Panel>
        </Reveal>
      </section>

      <section id="interest" className="container-x scroll-mt-24 pb-24">
        <Reveal>
          <WaitlistForm product="Labs" title="Hear first when Labs ships something." body="Research notes now and then; a proper announcement when there’s something real." />
        </Reveal>
      </section>
    </>
  );
}
