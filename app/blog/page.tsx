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
        sub="Essays on design, engineering, AI and growth — written by the people doing the work."
      />

      <section className="container-x flex flex-col gap-8 pb-24">
        <Reveal className="relative isolate flex min-h-[520px] items-end overflow-hidden rounded-[40px] p-4 md:p-8">
          <Image src={featuredPost.image} alt="" fill sizes="100vw" className="-z-10 object-cover" />
          <div className="glass flex max-w-[560px] flex-col items-start gap-4 rounded-[28px] p-6 md:p-8">
            <div className="flex items-center gap-2.5">
              <Chip tone="red">Featured</Chip>
              <span className="caption text-ink-3">
                {featuredPost.date} · {featuredPost.read}
              </span>
            </div>
            <h2 className="text-[30px] font-medium leading-[1.05] tracking-[-0.05em] md:text-[40px]">
              {featuredPost.title}
            </h2>
            <p className="text-[16px] leading-[1.55] text-ink-2">{featuredPost.excerpt}</p>
            <Button href="#posts">Read the essay</Button>
          </div>
        </Reveal>

        <div id="posts" className="scroll-mt-28">
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <RevealItem key={p.slug} className="h-full">
                <PostCard post={p} />
              </RevealItem>
            ))}
          </Stagger>
        </div>

        <Reveal>
          <NewsletterForm />
        </Reveal>
      </section>
    </>
  );
}
