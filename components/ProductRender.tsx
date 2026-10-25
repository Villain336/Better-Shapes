"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/content";
import { buildField, paintField, DITHER_BG, type Field } from "@/lib/dither";

export const RENDER_BG = `rgb(${DITHER_BG.join(",")})`;

export const productRender = (slug: string) => asset(`/products/${slug}.webp`);

/** Extracts a product slug from a `/products/<slug>.webp` asset path, if it is one. */
export function productSlugFromSrc(src: string): string | null {
  const m = src.match(/\/products\/([a-z0-9-]+)\.webp$/i);
  return m ? m[1].toLowerCase() : null;
}

/** Horizontal position of each subject in its source, so narrow crops stay on it. */
const FOCUS_X: Record<string, number> = {
  shapesos: 0.49,
  periscope: 0.62,
  canary: 0.5,
  kiln: 0.5,
  ripple: 0.46,
  flock: 0.56,
};

const imageCache = new Map<string, Promise<HTMLImageElement>>();

function loadImage(slug: string) {
  let p = imageCache.get(slug);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = productRender(slug);
    });
    imageCache.set(slug, p);
  }
  return p;
}

/** CSS-pixel cell pitch and dot fill; small renders get a denser matrix so the subject still reads. */
function gridFor(w: number, h: number) {
  const m = Math.min(w, h);
  if (m < 72) return { pitch: 2, fill: 1 };
  if (w < 280) return { pitch: 3, fill: 0.66 };
  if (w < 560) return { pitch: 4, fill: 0.62 };
  if (w < 1100) return { pitch: 5, fill: 0.6 };
  return { pitch: 6, fill: 0.6 };
}

const GRAIN_INTERVAL = 140;
const DEVELOP_MS = 900;

/**
 * Product art rendered as a dot-matrix dither of a minimal source image:
 * navy void, magenta/cyan ramps, ice highlights. The only motion is a quiet
 * film-grain shimmer and a short "develop" when it first scrolls into view.
 */
export function ProductRender({
  slug,
  alt = "",
  className = "",
}: {
  slug: string;
  alt?: string;
  className?: string;
  sizes?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let img: HTMLImageElement | null = null;
    let field: Field | null = null;
    let frame: ImageData | null = null;
    let pitch = 5;
    let dot = 3;
    let raf = 0;
    let visible = false;
    let disposed = false;
    let developStart = -1;
    let lastGrain = 0;
    let seed = 1;

    const sample = () => {
      if (!img) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = wrap.getBoundingClientRect();
      const cssW = Math.max(16, rect.width);
      const cssH = Math.max(16, rect.height);
      const g = gridFor(cssW, cssH);
      pitch = Math.max(2, Math.round(g.pitch * dpr));
      dot = Math.max(1, Math.min(pitch, Math.round(pitch * g.fill)));
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);

      const cols = Math.ceil(canvas.width / pitch);
      const rows = Math.ceil(canvas.height / pitch);
      // Sources sit on pure black, so narrow frames can zoom out past "cover" and pad with black seamlessly.
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const cover = Math.max(cols / iw, rows / ih);
      const contain = Math.min(cols / iw, rows / ih);
      const scale = Math.max(contain, cover * 0.74);
      const dw = iw * scale;
      const dh = ih * scale;
      const fx = FOCUS_X[slug] ?? 0.5;
      const dx = dw <= cols ? (cols - dw) / 2 : Math.min(0, Math.max(cols - dw, cols / 2 - fx * dw));
      const dy = (rows - dh) / 2;

      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.fillStyle = "#000";
      octx.fillRect(0, 0, cols, rows);
      octx.imageSmoothingQuality = "high";
      octx.drawImage(img, dx, dy, dw, dh);
      field = buildField(octx.getImageData(0, 0, cols, rows).data, cols, rows);
      frame = ctx.createImageData(canvas.width, canvas.height);
    };

    const paint = (exposure: number) => {
      if (!field || !frame) return;
      paintField(field, frame.data, frame.width, frame.height, pitch, dot, { seed, exposure });
      ctx.putImageData(frame, 0, 0);
    };

    const tick = (now: number) => {
      if (disposed || !visible) return;
      if (developStart < 0) developStart = now;
      const k = Math.min(1, (now - developStart) / DEVELOP_MS);
      const developing = k < 1;
      if (developing || now - lastGrain > GRAIN_INTERVAL) {
        if (!developing) seed++;
        lastGrain = now;
        const eased = 1 - Math.pow(1 - k, 3);
        paint(eased * (1 + 0.012 * Math.sin(now / 1400)));
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (!field) return;
      if (reduceMotion) {
        paint(1);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    loadImage(slug)
      .then((loaded) => {
        if (disposed) return;
        img = loaded;
        sample();
        if (visible) start();
      })
      .catch(() => {});

    const ro = new ResizeObserver(() => {
      if (!img) return;
      sample();
      if (reduceMotion || developStart >= 0) paint(1);
      if (visible) start();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (visible) start();
        else cancelAnimationFrame(raf);
      },
      { rootMargin: "120px" },
    );
    io.observe(wrap);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [slug]);

  return (
    <div
      ref={wrapRef}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={`render relative overflow-hidden select-none ${className}`}
      style={{ background: RENDER_BG }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
