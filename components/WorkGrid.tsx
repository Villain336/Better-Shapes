"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import type { Capability } from "@/lib/content";
import { projects } from "@/lib/content";
import { ProjectCard } from "./Cards";

const filters: ("All" | Capability)[] = ["All", "Tech", "Design", "Marketing"];

export function WorkGrid() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const list = active === "All" ? projects : projects.filter((p) => p.tags.includes(active));

  return (
    <LayoutGroup>
      <div className="hairline-b flex items-center justify-between gap-4 pb-4">
        <div className="flex gap-0.5 rounded-[10px] border border-line bg-surface p-0.5" role="tablist" aria-label="Filter work">
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={active === f}
              onClick={() => setActive(f)}
              className={`relative h-8 cursor-pointer rounded-[8px] px-3 text-[13px] font-medium transition-colors duration-300 ${
                active === f ? "text-on-ink" : "text-ink-2 hover:text-ink"
              }`}
            >
              {active === f && (
                <motion.span
                  layoutId="work-filter"
                  className="absolute inset-0 rounded-[8px] bg-ink"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative">{f}</span>
            </button>
          ))}
        </div>
        <span className="label text-ink-3">
          {list.length} {list.length === 1 ? "project" : "projects"}
        </span>
      </div>
      <motion.div layout className="grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <ProjectCard key={p.title} project={p} tall />
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
