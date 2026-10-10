"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import type { Capability } from "@/lib/content";
import { projects } from "@/lib/content";
import { ProjectCard } from "./Cards";

const filters: ("All" | Capability)[] = ["All", "Tech", "Design", "Robotics", "Marketing"];

export function WorkGrid() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const list = active === "All" ? projects : projects.filter((p) => p.tags.includes(active));

  return (
    <LayoutGroup>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
        {filters.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={active === f}
            onClick={() => setActive(f)}
            className={`relative cursor-pointer rounded-full px-[18px] py-2.5 text-[15px] font-medium tracking-[-0.01em] ${
              active === f ? "text-white" : "glass text-ink"
            }`}
          >
            {active === f && (
              <motion.span
                layoutId="work-filter"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{f}</span>
          </button>
        ))}
      </div>
      <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <ProjectCard
              key={p.title}
              project={p}
              className={i % 4 === 0 || i % 4 === 3 ? "lg:col-span-3" : "lg:col-span-2"}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
