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
      <section className="container-x flex flex-col gap-10 pb-16">
        <SectionHeading
          eyebrow="Streaming from day one"
          title="Three originals"
          accent="to start."
          side={
            <p className="max-w-[380px] text-[16px] leading-[1.55] text-ink-2">
              Made by Better Shapes with AI and written by people. Every title is labeled AI-made, and no character is
              based on a real person.
            </p>
          }
        />
        <Stagger className="grid gap-6 md:grid-cols-3" stagger={0.12}>
          {originals.map((o) => (
            <RevealItem key={o.slug} className="h-full">
              <article className="group relative isolate flex aspect-[2/3] flex-col justify-end overflow-hidden rounded-[32px] p-3">
                <Image
                  src={o.poster}
                  alt={`${o.title} key art`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="-z-20 object-cover transition-transform duration-[1.4s] ease-[var(--ease-out)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-b from-transparent via-black/20 to-black/75" />
                <div className="absolute left-4 top-4 flex gap-2">
                  <Chip tone="red" glass>
                    Original
                  </Chip>
                  <Chip tone="blue" glass>
                    AI-made
                  </Chip>
                </div>
                <div className="flex flex-col gap-2 p-3 text-white">
                  <span className="caption text-white/70">
                    {o.genre} · {o.format} · {o.rating}
                  </span>
                  <h3 className="text-[40px] font-semibold leading-none tracking-[-0.05em]">{o.title}</h3>
                  <p className="text-[15px] leading-[1.5] text-white/85">{o.logline}</p>
                </div>
              </article>
            </RevealItem>
          ))}
        </Stagger>
      </section>

      <section className="container-x flex flex-col gap-10 pb-16">
        <SectionHeading eyebrow="Plans" title="Free to watch." accent="Plus to make your own." />
        <Stagger className="grid items-stretch gap-6 lg:grid-cols-3" stagger={0.12}>
          {daydreamPlans.map((plan) => (
            <RevealItem key={plan.name} className="h-full">
              <PricingCard {...plan} />
            </RevealItem>
          ))}
        </Stagger>
        <Reveal className="text-[14px] leading-[1.55] text-ink-3">
          Draft pricing. 1 credit makes a storyboard-style minute (illustrated scenes with camera moves, voice and
          music); a full-motion minute uses 6. Credits don’t roll over, and episodes can never depict real or
          identifiable people. Creators keep rights to their series and share in ad and Plus revenue by watch time.
        </Reveal>
      </section>
    </>
  );
}
