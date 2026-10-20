import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { ShapesOSFeature } from "@/components/ShapesOSFeature";
import { RevealItem, Stagger, Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/Sections";
import { Button } from "@/components/Button";
import { NewsletterForm } from "@/components/Forms";
import { art } from "@/lib/content";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "ShapesOS and a growing suite of open-source tools for the agentic future: clean-room alternatives to the expensive software businesses rely on.",
};

export default function ProductsPage() {
  const building = products.filter((p) => p.status === "in-development");
  const planned = products.filter((p) => p.status === "planned" && !p.everyday);
  const everyday = products.filter((p) => p.everyday);

  return (
    <>
      <PageHero
        image={art.products}
        alt="A meadow of coral and peach ranunculus under fluffy clouds"
        eyebrow="Products"
        title="Tools worth"
        accent="building on."
        sub="ShapesOS and a growing suite of open-source software for the agentic future. Free to self-host, built to be trusted."
        note={`${products.length} products · ${products.filter((p) => p.openSource !== false).length} open source`}
      >
        <Button href="/products/shapesos">Join the ShapesOS waitlist</Button>
        <Button href="#suite" variant="outline">
          See the suite
        </Button>
      </PageHero>

      <section className="container-x pb-24">
        <ShapesOSFeature />
      </section>

      <section className="container-x flex flex-col gap-10 pb-24">
        <SectionHeading
          eyebrow="In development"
          title="Building"
          accent="right now."
          description="The foundations everything else is made from: agent guardrails, our design system and AI visibility. Plus Fig Tree for design and Snipper for video."
        />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {building.map((p) => (
            <RevealItem key={p.slug} className="h-full">
              <ProductCard product={p} />
            </RevealItem>
          ))}
        </Stagger>
      </section>

      <section id="suite" className="container-x flex scroll-mt-24 flex-col gap-10 pb-24">
        <SectionHeading
          eyebrow="The open suite"
          title="Expensive tools,"
          accent="open to everyone."
          description="Clean-room, open-source alternatives to software businesses pay a fortune for. Same jobs done, original code, AI at the core."
        />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {planned.map((p) => (
            <RevealItem key={p.slug} className="h-full">
              <ProductCard product={p} />
            </RevealItem>
          ))}
        </Stagger>
        <Reveal className="small max-w-[720px] text-ink-3">
          Product names are working names. Other companies’ names are used only to describe what each tool replaces; we
          aren’t affiliated with them.
        </Reveal>
      </section>

      <section className="container-x flex flex-col gap-10 pb-24">
        <SectionHeading
          eyebrow="For everyone"
          title="Everyday apps,"
          accent="yours to keep."
          description="Open-source versions of the apps people use every day, on hardware you control. Plus Daydream, our own streaming service for AI-made movies and series."
        />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {everyday.map((p) => (
            <RevealItem key={p.slug} className="h-full">
              <ProductCard product={p} />
            </RevealItem>
          ))}
        </Stagger>
        <Reveal className="small max-w-[720px] text-ink-3">
          Playlist and watchlist imports bring over titles and order, not the audio or video. Hum and Matinee play media
          you own, sources you subscribe to and work artists upload themselves. They never rip, record or unlock anyone
          else’s catalog.
        </Reveal>
      </section>

      <section className="container-x pb-24">
        <Reveal>
          <NewsletterForm />
        </Reveal>
      </section>
    </>
  );
}
