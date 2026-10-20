"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { duskOf } from "./Painting";
import { Chip } from "./Chip";

/**
 * Two versions of one painting with a handle between them. Drag, or use the arrow keys, to see the
 * same scene by day and at dusk. Sits inside a `.frame`.
 */
export function CompareSlider({ src, alt, before = "Day", after = "Dusk", sizes = "100vw" }: { src: string; alt: string; before?: string; after?: string; sizes?: string }) {
  const [x, setX] = useState(58);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromEvent = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setX(Math.min(97, Math.max(3, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className="absolute inset-0 touch-pan-y select-none"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromEvent(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && setFromEvent(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Image src={duskOf(src)} alt="" fill sizes={sizes} className="object-cover" draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" draggable={false} />
      </div>

      <div className="pointer-events-none absolute left-3 top-3">
        <Chip glass>{before}</Chip>
      </div>
      <div className="pointer-events-none absolute right-3 top-3">
        <Chip glass>{after}</Chip>
      </div>

      <div
        role="slider"
        tabIndex={0}
        aria-label={`Compare ${before.toLowerCase()} and ${after.toLowerCase()}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(x)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setX((v) => Math.max(3, v - 4));
          if (e.key === "ArrowRight") setX((v) => Math.min(97, v + 4));
        }}
        className="absolute inset-y-0 w-px cursor-ew-resize bg-white/80 shadow-[0_0_0_1px_rgb(0_0_0/0.15)] outline-none focus-visible:ring-2 focus-visible:ring-accent"
        style={{ left: `${x}%` }}
      >
        <span className="absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/85 text-[#141414] shadow-[0_12px_30px_-10px_rgb(0_0_0/0.45)] backdrop-blur-md">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
            <path d="M6 4 2.5 8 6 12m4-8 3.5 4L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}
