"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toneFor, type Capability, type Post, type Project, type Tone } from "@/lib/content";
import { GlassCard } from "./GlassCard";
import { RENDER_BG } from "./ProductRender";
import { ArrowUpRight, CapabilityGlyph, toneColor, toneTint } from "./Shapes";
import { Chip } from "./Chip";
import { Button } from "./Button";

const lift = "transition-transform duration-700 ease-[var(--ease-out)] hover:-translate-y-1.5";

function ArrowDot({ size = 32 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-ink text-white transition-colors duration-300 group-hover/card:bg-brand-blue"
      style={{ width: size, height: size }}
    >
      <ArrowUpRight className="transition-transform duration-500 ease-[var(--ease-out)] group-hover/card:rotate-45" />
    </span>
  );
}

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
  const tone = toneFor[name];
  return (
    <GlassCard className={`flex h-full flex-col gap-5 rounded-[32px] p-6 ${lift}`}>
      <div className="flex items-start justify-between">
        <span
          className="grid size-16 place-items-center rounded-[20px] transition-transform duration-700 ease-[var(--ease-out)] group-hover/card:rotate-[12deg] group-hover/card:scale-105"
          style={{ background: toneTint[tone] }}
        >
          <CapabilityGlyph name={name} />
        </span>
        {exploring ? (
          <Chip tone={tone}>Exploring</Chip>
        ) : (
          <span className="caption text-ink-3">{String(index + 1).padStart(2, "0")}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-[24px] font-medium tracking-[-0.04em]">{name}</h3>
        <p className="text-[14px] leading-[1.5] text-ink-2">{blurb}</p>
      </div>
      {points && (
        <ul className="flex flex-col gap-1.5">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-2 text-[14px] text-ink-2">
              <span className="size-1.5 rounded-full" style={{ background: toneColor[tone] }} />
              {p}
            </li>
          ))}
        </ul>
      )}
      <Link
        href={exploring ? "/labs" : "/work"}
        className="mt-auto flex items-center justify-between border-t border-white/70 pt-4 text-[15px] font-medium"
      >
        {exploring ? "Visit Labs" : "Explore"} <ArrowDot />
      </Link>
    </GlassCard>
  );
}

export function ProjectCard({ project, className = "" }: { project: Project; className?: string }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group/card relative isolate flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[32px] p-4 md:min-h-[500px] ${className}`}
      style={{ background: RENDER_BG }}
    >
      <Image
        src={project.image}
        alt={`${project.title} product render`}
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="-z-10 object-cover transition-transform duration-[1.4s] ease-[var(--ease-out)] group-hover/card:scale-[1.06]"
      />
      <div className="flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <Chip key={t} tone={toneFor[t]} glass>
            {t}
          </Chip>
        ))}
        <Chip tone="blue" glass>
          {project.status}
        </Chip>
      </div>
      <Link
        href={project.href}
        className="glass flex items-center justify-between gap-4 rounded-[24px] py-4 pl-5 pr-3 transition-transform duration-700 ease-[var(--ease-out)] group-hover/card:-translate-y-1"
      >
        <div>
          <h3 className="text-[22px] font-medium tracking-[-0.04em] md:text-[24px]">{project.title}</h3>
          <p className="text-[14px] text-ink-2">{project.subtitle}</p>
        </div>
        <ArrowDot size={44} />
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
  const dots: Tone[] = ["blue", "red", "yellow", "green", "blue"];
  const body = (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-semibold tracking-[-0.02em]">{name}</h3>
        {featured && <Chip tone="yellow">Most popular</Chip>}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-[56px] font-semibold leading-none tracking-[-0.06em]">{price}</span>
        <span className="text-[18px] font-medium opacity-60">{period}</span>
      </div>
      <p className={`text-[16px] leading-[1.55] ${featured ? "text-white/75" : "text-ink-2"}`}>{description}</p>
      <ul className={`flex flex-col gap-3 border-t pt-6 ${featured ? "border-white/15" : "border-line"}`}>
        {features.map((f, i) => (
          <li key={f} className="flex items-center gap-3 text-[16px]">
            <span className="size-2 rounded-full" style={{ background: toneColor[dots[i % dots.length]] }} />
            {f}
          </li>
        ))}
      </ul>
      <Button href={href} variant={featured ? "glass" : "ink"} className="mt-auto w-full">
        {cta}
      </Button>
    </>
  );

  if (featured) {
    return (
      <div className={`glass-ink rim-gradient flex h-full flex-col gap-6 rounded-[32px] p-8 text-white ${lift}`}>
        {body}
      </div>
    );
  }
  return <GlassCard className={`flex h-full flex-col gap-6 rounded-[32px] p-8 ${lift}`}>{body}</GlassCard>;
}

export function PostCard({ post }: { post: Post }) {
  return (
    <GlassCard as="article" className={`flex h-full flex-col rounded-[32px] ${lift}`}>
      <div className="relative aspect-[380/220] overflow-hidden">
        <Image
          src={post.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover/card:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-6 pb-6 pt-5">
        <div className="flex items-center gap-2.5">
          <Chip tone={toneFor[post.category]}>{post.category}</Chip>
          <span className="caption text-ink-3">Coming soon</span>
        </div>
        <h3 className="text-[24px] font-medium leading-[1.15] tracking-[-0.04em]">{post.title}</h3>
        <p className="text-[14px] leading-[1.5] text-ink-2">{post.excerpt}</p>
      </div>
    </GlassCard>
  );
}

export function StatCard({ value, label, className = "" }: { value: string; label: string; className?: string }) {
  return (
    <GlassCard className={`flex flex-col gap-1 rounded-[24px] px-6 pb-[22px] pt-5 ${className}`}>
      <span className="font-display text-[48px] font-semibold leading-none tracking-[-0.06em] md:text-[56px]">{value}</span>
      <span className="text-[14px] text-ink-2">{label}</span>
    </GlassCard>
  );
}
