import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { ProductFeature } from "@/components/ProductFeature";
import { RevealItem, Stagger, Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/Sections";
import { Button } from "@/components/Button";
import { NewsletterForm } from "@/components/Forms";
import { Panel } from "@/components/Panel";
import { Eyebrow } from "@/components/Eyebrow";
import { ProductRender } from "@/components/ProductRender";
import { art } from "@/lib/content";
import { flagship, products, statusMeta } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Five open-source products from Better Shapes: Periscope, Canary, Kiln, Ripple and Flock. Tools for agents, security, data, video and drones.",
};

export default function ProductsPage() {
  const rest = products.filter((p) => p.slug !== flagship.slug);
  const openSource = products.filter((p) => p.openSource !== false).length;

  return (
    <>
      <PageHero
        image={art.products}
        alt="A meadow of coral and peach ranunculus under fluffy clouds"
        eyebrow="Products"
        title="Tools worth"
        accent="building on."
        sub="Five products, one idea: software you can read, run and trust. Eyes for agents, decoy keys, a model platform, a streaming stack and a drone mesh OS, all open source."
        note={`${products.length} products · ${openSource} open source`}
      >
        <Button href={`/products/${flagship.slug}`}>Get early access to {flagship.name}</Button>
        <Button href="#lineup" variant="outline">
          See the lineup
        </Button>
      </PageHero>

      <section className="container-x pb-24">
        <ProductFeature product={flagship} />
      </section>

      <section id="lineup" className="container-x flex scroll-mt-24 flex-col gap-10 pb-24">
        <SectionHeading
          eyebrow="The lineup"
          title="Four more,"
          accent="each with a job."
          description="A security tool we use on ourselves, a data and model platform, a streaming stack and a Labs project that leaves the screen entirely."
        />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((p) => (
            <RevealItem key={p.slug} className="h-full">
              <ProductCard product={p} />
            </RevealItem>
          ))}
        </Stagger>
      </section>

      <section className="container-x flex flex-col gap-10 pb-24">
        <SectionHeading
          eyebrow="How they fit"
          title="Five parts,"
          accent="one system."
          description="Each product stands alone, but they were designed to lean on each other."
        />
        <Reveal>
          <Panel className="p-2">
            <ol className="grid lg:grid-cols-5">
              {products.map((p, i) => (
                <li
                  key={p.slug}
                  className={`flex gap-4 p-4 lg:flex-col lg:gap-5 ${i > 0 ? "hairline-t lg:border-t-0 lg:border-l lg:border-line" : ""}`}
                >
                  <ProductRender slug={p.slug} className="size-14 shrink-0 rounded-[10px]" sizes="56px" />
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="label text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                      <span className="label text-ink-3">{statusMeta[p.status].label}</span>
                    </div>
                    <h3 className="h3">{p.name}</h3>
                    <p className="small">{p.fit}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </Reveal>
      </section>

      <section className="container-x pb-24">
        <Reveal className="hairline-t hairline-b grid gap-8 py-12 md:grid-cols-[1fr_2fr] md:py-16">
          <Eyebrow>A note on names</Eyebrow>
          <p className="body max-w-[680px]">
            Product names are working names and may change before release. Other companies’ products are mentioned
            only to describe what a tool does; we aren’t affiliated with them. Statuses are honest: “planned” means
            we haven’t started, and “exploring” means research with nothing released.
          </p>
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
