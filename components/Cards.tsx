"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate, toneFor, type Capability, type Post, type Project } from "@/lib/content";
import { Panel } from "./Panel";
import { RENDER_BG } from "./ProductRender";
import { ArrowRight, ArrowUpRight, CapabilityGlyph, Check } from "./Shapes";
import { Chip } from "./Chip";
import { Button } from "./Button";

export function CapabilityCard({
  name,
  blurb,
  index,
  points,
  exploring = false,
}: {
  name: Capability;
  blurb: string;
  index: number;
  points?: string[];
  exploring?: boolean;
}) {
  const href = exploring ? "/labs" : "/work";
  return (
    <Link href={href} className="group block h-full">
      <Panel lift className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-start justify-between">
          <span className="grid size-9 place-items-center rounded-[10px] border border-line bg-canvas text-ink">
            <CapabilityGlyph name={name} size={14} />
          </span>
          {exploring ? <Chip tone={toneFor[name]}>Exploring</Chip> : <span className="label text-ink-3">{String(index + 1).padStart(2, "0")}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="h3">{name}</h3>
          <p className="small">{blurb}</p>
        </div>
        {points && (
          <ul className="hairline-t flex flex-col gap-2 pt-4">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-[13px] text-ink-2">
                <span className="h-px w-3 bg-line-strong" />
                {p}
              </li>
            ))}
          </ul>
        )}
        <span className="mt-auto flex items-center justify-between pt-2 text-[13px] font-medium text-ink">
          {exploring ? "Visit Labs" : "See the work"}
          <ArrowRight className="text-ink-3 transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:text-ink" />
        </span>
      </Panel>
    </Link>
  );
}

export function ProjectCard({ project, className = "", tall = false }: { project: Project; className?: string; tall?: boolean }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`group h-full ${className}`}
    >
      <Link href={project.href} className="block h-full">
        <Panel lift className="flex h-full flex-col p-1.5">
          <div className={`frame rounded-[10px] ${tall ? "aspect-[4/3] md:aspect-[16/10]" : "aspect-[4/3]"}`} style={{ background: RENDER_BG }}>
            <Image
              src={project.image}
              alt={`${project.title} product render`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute left-3 top-3 flex gap-1.5">
              <Chip glass tone="blue">
                {project.status}
              </Chip>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-3 px-3.5 pb-3 pt-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="h3">{project.title}</h3>
                <p className="small">{project.subtitle}</p>
              </div>
              <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                <ArrowUpRight size={12} />
              </span>
            </div>
            <div className="mt-auto flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <Chip key={t} tone={toneFor[t]}>
                  {t}
                </Chip>
              ))}
            </div>
          </div>
        </Panel>
      </Link>
    </motion.article>
  );
}

export function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  featured,
  href = "/about#contact",
  period = "/month",
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  featured: boolean;
  href?: string;
  period?: string;
}) {
  const muted = featured ? "text-white/65" : "text-ink-2";
  return (
    <div
      className={`flex h-full flex-col gap-6 rounded-(--radius-card) p-6 md:p-7 ${
        featured ? "bg-ink text-white" : "surface"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`label ${featured ? "text-white/70" : "text-ink-3"}`}>{name}</span>
        {featured && (
          <span className="label inline-flex h-6 items-center gap-1.5 rounded-(--radius-tag) border border-white/20 bg-white/10 px-2 text-white">
            <span className="size-1.5 rounded-full bg-brand-yellow" />
            Most popular
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="num text-[44px] md:text-[48px]">{price}</span>
        <span className={`text-[14px] ${muted}`}>{period}</span>
      </div>
      <p className={`text-[14px] leading-[1.55] ${muted}`}>{description}</p>
      <ul className={`flex flex-col gap-2.5 border-t pt-5 ${featured ? "border-white/15" : "border-line"}`}>
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-[14px]">
            <Check size={13} className={featured ? "text-white/70" : "text-ink-3"} />
            {f}
          </li>
        ))}
      </ul>
      <Button href={href} variant={featured ? "white" : "ink"} className="mt-auto w-full">
        {cta}
      </Button>
    </div>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Panel as="article" lift className="flex h-full flex-col p-1.5">
        <div className="frame aspect-[16/10] rounded-[10px]">
          <Image src={post.image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-1 flex-col gap-3 px-3.5 pb-3.5 pt-4">
          <div className="flex items-center gap-2">
            <Chip tone={toneFor[post.category]}>{post.category}</Chip>
            <span className="label text-ink-3">
              {formatDate(post.date)} · {post.minutes} min
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <h3 className="h3">{post.title}</h3>
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
              <ArrowUpRight size={12} />
            </span>
          </div>
          <p className="small">{post.excerpt}</p>
        </div>
      </Panel>
    </Link>
  );
}

export function StatCard({ value, label, className = "" }: { value: string; label: string; className?: string }) {
  return (
    <Panel className={`flex flex-col gap-3 p-5 ${className}`}>
      <span className="label text-ink-3">{label}</span>
      <span className="num text-[36px]">{value}</span>
    </Panel>
  );
}
