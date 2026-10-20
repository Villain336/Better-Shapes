"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import type { Capability } from "@/lib/content";
import { projects } from "@/lib/content";
import { ProjectCard } from "./Cards";
import { SegmentedControl } from "./Primitives";
import { WorkGalleryButton } from "./Lightbox";

type Filter = "All" | Capability;
const filters: Filter[] = ["All", "Tech", "Design", "Marketing"];

export function WorkGrid() {
  const [active, setActive] = useState<Filter>("All");
  const list = active === "All" ? projects : projects.filter((p) => p.tags.includes(active));

  return (
    <LayoutGroup>
      <div className="hairline-b flex items-center justify-between gap-4 pb-4">
        <SegmentedControl
          label="Filter work"
          size="sm"
          value={active}
          onChange={setActive}
          options={filters.map((f) => ({ value: f, label: f }))}
        />
        <div className="flex items-center gap-3">
          <span className="label hidden text-ink-3 sm:inline">
            {list.length} {list.length === 1 ? "project" : "projects"}
          </span>
          <WorkGalleryButton />
        </div>
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
