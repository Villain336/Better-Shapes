import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { WorkGrid } from "@/components/WorkGrid";
import { Blobs, CtaBand, SectionHeading } from "@/components/Sections";
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
        eyebrow="Selected work"
        title="Work that"
        serif="feels right."
        sub="A few of the products, brands and machines we’ve helped shape — for startups, labs and teams who care about the details."
      />

      <section className="container-x flex flex-col gap-8 pb-24">
        <WorkGrid />
      </section>

      <section className="relative isolate py-16 md:py-24">
        <Blobs />
        <div className="container-x flex flex-col gap-12">
          <SectionHeading eyebrow="Capabilities" title="Everything it takes," serif="in one place." />
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c, i) => (
              <RevealItem key={c.name} className="h-full">
                <CapabilityCard name={c.name} blurb={c.blurb} index={i} points={c.points} />
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand image={art.work} />
    </>
  );
}
