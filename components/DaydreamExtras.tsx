import Image from "next/image";
import { daydreamPlans, originals } from "@/lib/daydream";
import { PricingCard } from "./Cards";
import { Chip } from "./Chip";
import { Reveal, RevealItem, Stagger } from "./Reveal";
import { SectionHeading } from "./Sections";

/** Day-1 originals and plans, shown only on /products/daydream. */
export function DaydreamExtras() {
  return (
    <>
      <section className="container-x flex flex-col gap-10 pb-20">
        <SectionHeading
          eyebrow="Streaming from day one"
          title="Three originals"
          accent="to start."
          description="Made by Better Shapes with AI and written by people. Every title is labeled AI-made, and no character is based on a real person."
        />
        <Stagger className="grid gap-5 md:grid-cols-3" stagger={0.08}>
          {originals.map((o) => (
            <RevealItem key={o.slug} className="h-full">
              <article className="group flex flex-col gap-4">
                <div className="frame aspect-[2/3]">
                  <Image src={o.poster} alt={`${o.title} key art`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                  <div className="absolute left-3 top-3 flex gap-1.5">
                    <Chip glass tone="red">
                      Original
                    </Chip>
                    <Chip glass tone="blue">
                      AI-made
                    </Chip>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="label text-ink-3">
                    {o.genre} · {o.format} · {o.rating}
                  </span>
                  <h3 className="h3">{o.title}</h3>
                  <p className="small">{o.logline}</p>
                </div>
              </article>
            </RevealItem>
          ))}
        </Stagger>
      </section>

      <section className="container-x flex flex-col gap-10 pb-20">
        <SectionHeading eyebrow="Plans" title="Free to watch." accent="Plus to make your own." />
        <Stagger className="grid items-stretch gap-5 lg:grid-cols-3" stagger={0.08}>
          {daydreamPlans.map((plan) => (
            <RevealItem key={plan.name} className="h-full">
              <PricingCard {...plan} />
            </RevealItem>
          ))}
        </Stagger>
        <Reveal className="small max-w-[760px] text-ink-3">
          Draft pricing. 1 credit makes a storyboard-style minute (illustrated scenes with camera moves, voice and music); a
          full-motion minute uses 6. Credits don’t roll over, and episodes can never depict real or identifiable people.
          Creators keep rights to their series and share in ad and Plus revenue by watch time.
        </Reveal>
      </section>
    </>
  );
}
