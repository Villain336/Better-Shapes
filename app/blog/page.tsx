import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { PostCard } from "@/components/Cards";
import { Chip } from "@/components/Chip";
import { Button } from "@/components/Button";
import { NewsletterForm } from "@/components/Forms";
import { Reveal, RevealItem, Stagger } from "@/components/Reveal";
import { art, featuredPost, posts } from "@/lib/content";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <>
      <PageHero
        image={art.blog}
        alt="Rolling bands of tulips beside a lake under cumulus clouds"
        eyebrow="Field notes"
        title="Notes from"
        accent="the meadow."
        sub="Essays on design, engineering, AI and growth, written by the people doing the work. The first ones are on the way."
      />

      <section className="container-x flex flex-col gap-16 pb-24">
        <Reveal className="grid items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          <div className="frame aspect-[16/10]">
            <Image src={featuredPost.image} alt="" fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col items-start gap-5">
            <div className="flex items-center gap-2">
              <Chip tone="red">First up</Chip>
              <span className="label text-ink-3">Coming soon</span>
            </div>
            <h2 className="h2">{featuredPost.title}</h2>
            <p className="body">{featuredPost.excerpt}</p>
            <Button href="#newsletter" variant="outline">
              Get it in your inbox
            </Button>
          </div>
        </Reveal>

        <div id="posts" className="scroll-mt-24">
          <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <RevealItem key={p.slug} className="h-full">
                <PostCard post={p} />
              </RevealItem>
            ))}
          </Stagger>
        </div>

        <div id="newsletter" className="scroll-mt-24">
          <Reveal>
            <NewsletterForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
