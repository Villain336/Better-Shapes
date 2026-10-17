import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { ShapesOSFeature } from "@/components/ShapesOSFeature";
import { RevealItem, Stagger, Reveal } from "@/components/Reveal";
import { Blobs, SectionHeading } from "@/components/Sections";
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
      >
        <Button href="/products/shapesos">Join ShapesOS early access</Button>
        <Button href="#suite" variant="glass">
          See the suite
        </Button>
      </PageHero>

      <section className="container-x pb-16">
        <ShapesOSFeature />
      </section>

      <section className="relative isolate py-16">
        <Blobs className="opacity-70" />
        <div className="container-x flex flex-col gap-10">
          <SectionHeading
            eyebrow="In development"
            title="Building"
            accent="right now."
            side={
              <p className="max-w-[360px] text-[16px] leading-[1.55] text-ink-2">
                The foundations everything else is made from: agent guardrails, our design system and AI visibility. Plus Fig Tree for design and Snipper for video.
              </p>
            }
          />
          <Stagger className="grid gap-5 md:grid-cols-3">
            {building.map((p) => (
              <RevealItem key={p.slug} className="h-full">
                <ProductCard product={p} />
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="suite" className="container-x flex scroll-mt-28 flex-col gap-10 py-16">
        <SectionHeading
          eyebrow="The open suite"
          title="Expensive tools,"
          accent="open to everyone."
          side={
            <p className="max-w-[380px] text-[16px] leading-[1.55] text-ink-2">
              Clean-room, open-source alternatives to software businesses pay a fortune for. Same jobs done, original
              code, AI at the core.
            </p>
          }
        />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {planned.map((p) => (
            <RevealItem key={p.slug} className="h-full">
              <ProductCard product={p} />
            </RevealItem>
          ))}
        </Stagger>
        <Reveal className="text-[14px] leading-[1.55] text-ink-3">
          Product names are working names. Other companies’ names are used only to describe what each tool replaces; we
          aren’t affiliated with them.
        </Reveal>
      </section>

      <section className="relative isolate py-16">
        <Blobs className="opacity-60" />
        <div className="container-x flex flex-col gap-10">
          <SectionHeading
            eyebrow="For everyone"
            title="Everyday apps,"
            accent="yours to keep."
            side={
              <p className="max-w-[380px] text-[16px] leading-[1.55] text-ink-2">
                Open-source versions of the apps people use every day, on hardware you control. Plus Daydream, our
                own streaming service for AI-made movies and series.
              </p>
            }
          />
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {everyday.map((p) => (
              <RevealItem key={p.slug} className="h-full">
                <ProductCard product={p} />
              </RevealItem>
            ))}
          </Stagger>
          <Reveal className="text-[14px] leading-[1.55] text-ink-3">
            Playlist and watchlist imports bring over titles and order, not the audio or video. Hum and Matinee play
            media you own, sources you subscribe to and work artists upload themselves. They never rip, record or unlock
            anyone else’s catalog.
          </Reveal>
        </div>
      </section>

      <section className="container-x flex flex-col gap-6 pb-24">
        <Reveal>
          <NewsletterForm />
        </Reveal>
      </section>
    </>
  );
}
