import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { PostCard } from "@/components/Cards";
import { Chip } from "@/components/Chip";
import { NewsletterForm } from "@/components/Forms";
import { Reveal, RevealItem, Stagger } from "@/components/Reveal";
import { SectionHeading } from "@/components/Sections";
import { ArrowRight } from "@/components/Shapes";
import { featuredPost, formatDate, posts, toneFor } from "@/lib/content";
import { essays } from "@/lib/essays";

const allPosts = [featuredPost, ...posts];
const postBySlug = (slug: string) => allPosts.find((p) => p.slug === slug);

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = postBySlug((await params).slug);
  return p ? { title: p.title, description: p.excerpt } : {};
}

/** Split a headline so the last clause can be set in the quieter accent ink. */
function splitTitle(title: string): [string, string] {
  const i = title.indexOf(":");
  if (i > 0 && i < title.length - 2) return [title.slice(0, i + 1), title.slice(i + 1).trim()];
  const words = title.split(" ");
  if (words.length < 5) return [title, ""];
  const cut = Math.ceil(words.length / 2);
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
}

export default async function PostPage({ params }: Params) {
  const p = postBySlug((await params).slug);
  const body = p ? essays[p.slug] : undefined;
  if (!p || !body) notFound();

  const [title, accent] = splitTitle(p.title);
  const more = allPosts.filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <>
      <PageHero
        image={p.image}
        alt=""
        smallAccent
        eyebrow={`${p.category} · ${formatDate(p.date)} · ${p.minutes} min read`}
        title={title}
        accent={accent}
        sub={p.excerpt}
      >
        <Link href="/blog" className="label inline-flex items-center gap-2 text-ink-2 transition-colors hover:text-ink">
          <ArrowRight size={12} className="rotate-180" />
          All essays
        </Link>
      </PageHero>

      <article className="container-x pb-24">
        <Reveal className="mx-auto grid max-w-[1000px] gap-10 lg:grid-cols-[180px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 flex flex-col items-start gap-4">
              <Chip tone={toneFor[p.category]}>{p.category}</Chip>
              <dl className="flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <dt className="label text-ink-3">Published</dt>
                  <dd className="text-[13px] text-ink">{formatDate(p.date)}</dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt className="label text-ink-3">Reading time</dt>
                  <dd className="text-[13px] text-ink">{p.minutes} minutes</dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt className="label text-ink-3">By</dt>
                  <dd className="text-[13px] text-ink">Better Shapes Studio</dd>
                </div>
              </dl>
            </div>
          </aside>

          <div className="hairline-t pt-10 lg:border-t-0 lg:pt-0">
            {body.map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={i} className="h3 mt-10 mb-4 first:mt-0">
                    {block.slice(3)}
                  </h2>
                );
              }
              if (block.startsWith("> ")) {
                return (
                  <blockquote
                    key={i}
                    className="display my-10 border-l-2 border-ink pl-6 text-[clamp(20px,2.2vw,26px)] font-medium leading-[1.3] tracking-[-0.02em] text-ink"
                  >
                    {block.slice(2)}
                  </blockquote>
                );
              }
              return (
                <p key={i} className="mb-6 text-[17px] leading-[1.7] text-ink-2 last:mb-0">
                  {block}
                </p>
              );
            })}

            <div className="hairline-t mt-12 flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <span className="small">Written by the studio. Thoughts, disagreements and questions are welcome.</span>
              <Link href="/about#contact" className="label inline-flex items-center gap-2 text-ink transition-colors hover:text-ink-2">
                Write to us
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </Reveal>
      </article>

      <section className="container-x flex flex-col gap-10 pb-24">
        <SectionHeading eyebrow="Keep reading" title="More" accent="field notes." />
        <Stagger className="grid gap-4 md:grid-cols-3">
          {more.map((x) => (
            <RevealItem key={x.slug} className="h-full">
              <PostCard post={x} />
            </RevealItem>
          ))}
        </Stagger>
      </section>

      <section className="container-x pb-24">
        <Reveal>
          <NewsletterForm />
        </Reveal>
      </section>
    </>
  );
}
