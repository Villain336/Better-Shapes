import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { WorkGrid } from "@/components/WorkGrid";
import { CtaBand, SectionHeading } from "@/components/Sections";
import { CapabilityCard } from "@/components/Cards";
import { RevealItem, Stagger } from "@/components/Reveal";
import { art, capabilities } from "@/lib/content";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <>
      <PageHero
        image={art.work}
        alt="Rows of lavender at golden hour beneath tall clouds"
        eyebrow="Our work"
        title="Work that"
        accent="feels right."
        sub="Right now that’s our own products: an agentic business OS, open-source design and video tools, and a streaming service for AI-made stories. Client work joins them as it ships."
      />

      <section className="container-x flex flex-col gap-6 pb-24">
        <WorkGrid />
      </section>

      <section className="container-x flex flex-col gap-10 pb-24">
        <SectionHeading eyebrow="Capabilities" title="Everything it takes," accent="in one place." />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c, i) => (
            <RevealItem key={c.name} className="h-full">
              <CapabilityCard name={c.name} blurb={c.blurb} index={i} points={c.points} exploring={c.exploring} />
            </RevealItem>
          ))}
        </Stagger>
      </section>

      <CtaBand image={art.work} />
    </>
  );
}
