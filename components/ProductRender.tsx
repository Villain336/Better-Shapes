"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/content";

/** Deep void navy-black background matching the dithered ASCII reference aesthetic. */
export const RENDER_BG = "#0B0514";

export const productRender = (slug: string) => asset(`/products/${slug}.webp`);

/** Extracts a product slug from a `/products/<slug>.webp` asset path, if it is one. */
export function productSlugFromSrc(src: string): string | null {
  const m = src.match(/\/products\/([a-z0-9-]+)\.webp$/i);
  return m ? m[1].toLowerCase() : null;
}

type RGB = readonly [number, number, number];

type PaletteTheme = {
  bg: RGB;
  /** Primary mid-tone halftone color (like the crimson/magenta in the skull reference). */
  mid: RGB;
  /** Deep shadow accent color. */
  deep: RGB;
  /** Secondary rim-light / cool shadow color (like the electric cyan in the skull reference). */
  rim: RGB;
  /** Bright highlight color (pale ice-cyan / white). */
  hi: RGB;
  /** Motion mode for the real-time dithered ASCII shader. */
  mode: "command" | "radar" | "poison" | "conjure" | "ripple" | "mesh";
};

const THEMES: Record<string, PaletteTheme> = {
  shapesos: {
    bg: [11, 5, 20],
    deep: [110, 18, 62],
    mid: [238, 42, 118],
    rim: [0, 212, 245],
    hi: [216, 252, 255],
    mode: "command",
  },
  periscope: {
    bg: [8, 6, 22],
    deep: [28, 52, 138],
    mid: [0, 198, 245],
    rim: [236, 46, 122],
    hi: [220, 254, 255],
    mode: "radar",
  },
  canary: {
    bg: [12, 4, 18],
    deep: [124, 18, 58],
    mid: [242, 42, 112],
    rim: [36, 232, 156],
    hi: [224, 255, 250],
    mode: "poison",
  },
  kiln: {
    bg: [12, 4, 18],
    deep: [128, 22, 68],
    mid: [244, 52, 118],
    rim: [0, 214, 248],
    hi: [222, 252, 255],
    mode: "conjure",
  },
  ripple: {
    bg: [9, 5, 20],
    deep: [88, 22, 92],
    mid: [234, 44, 124],
    rim: [24, 224, 230],
    hi: [220, 254, 255],
    mode: "ripple",
  },
  flock: {
    bg: [10, 5, 20],
    deep: [112, 20, 68],
    mid: [238, 46, 118],
    rim: [0, 216, 246],
    hi: [220, 253, 255],
    mode: "mesh",
  },
  field: {
    bg: [10, 5, 20],
    deep: [112, 20, 68],
    mid: [238, 46, 118],
    rim: [0, 216, 246],
    hi: [220, 253, 255],
    mode: "mesh",
  },
};

/** 4×4 ordered Bayer matrix normalized to [-0.5, +0.5] for crisp retro halftone dithering. */
const BAYER4 = [
  [0 / 16 - 0.5, 8 / 16 - 0.5, 2 / 16 - 0.5, 10 / 16 - 0.5],
  [12 / 16 - 0.5, 4 / 16 - 0.5, 14 / 16 - 0.5, 6 / 16 - 0.5],
  [3 / 16 - 0.5, 11 / 16 - 0.5, 1 / 16 - 0.5, 9 / 16 - 0.5],
  [15 / 16 - 0.5, 7 / 16 - 0.5, 13 / 16 - 0.5, 5 / 16 - 0.5],
];

// Shared image cache so navigating or mounting multiple cards reuses decoded images immediately
const imageCache = new Map<string, HTMLImageElement>();

function loadProductImage(slug: string): Promise<HTMLImageElement> {
  const clean = slug === "field" ? "flock" : slug;
  const cached = imageCache.get(clean);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache.set(clean, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = productRender(clean);
  });
}

/**
 * Draws a single 5×5 crisp pixel-art ASCII / halftone glyph into the RGBA image buffer.
 * Tier 1: single pixel dot `·`
 * Tier 2: two-pixel colon `:`
 * Tier 3: 3×3 cross `+`
 * Tier 4: 5×5 diagonal `×` / checker weave
 * Tier 5: 5×5 dense `#` / hollow-center block
 * Tier 6: 5×5 solid `@` / `█` highlight block
 */
function stampGlyph(
  buf: Uint8ClampedArray,
  strideW: number,
  strideH: number,
  gx: number,
  gy: number,
  cellSize: number,
  tier: number,
  color: RGB,
) {
  const [cr, cg, cb] = color;
  const x0 = gx * cellSize;
  const y0 = gy * cellSize;

  const put = (dx: number, dy: number, boost = 1) => {
    const px = x0 + dx;
    const py = y0 + dy;
    if (px < 0 || px >= strideW || py < 0 || py >= strideH) return;
    const idx = (py * strideW + px) * 4;
    buf[idx] = Math.min(255, Math.round(cr * boost));
    buf[idx + 1] = Math.min(255, Math.round(cg * boost));
    buf[idx + 2] = Math.min(255, Math.round(cb * boost));
    buf[idx + 3] = 255;
  };

  const mid = Math.floor(cellSize / 2);

  if (cellSize <= 3) {
    // Ultra-compact mode for tiny thumbnails
    if (tier <= 1) {
      put(mid, mid);
    } else if (tier === 2) {
      put(mid, 0);
      put(mid, cellSize - 1);
    } else if (tier === 3) {
      put(mid, mid);
      put(0, mid);
      put(cellSize - 1, mid);
      put(mid, 0);
      put(mid, cellSize - 1);
    } else {
      for (let dy = 0; dy < cellSize; dy++) {
        for (let dx = 0; dx < cellSize; dx++) {
          if (tier === 4 && (dx + dy) % 2 === 1) continue;
          put(dx, dy);
        }
      }
    }
    return;
  }

  // Standard 5×5 or 6×6 crisp retro ASCII bitmap font
  if (tier === 1) {
    // Single center pixel dot `·`
    put(mid, mid);
  } else if (tier === 2) {
    // Two-pixel vertical or diagonal pair `:`
    put(mid, mid - 1);
    put(mid, mid + 1);
  } else if (tier === 3) {
    // Plus sign `+`
    put(mid, mid);
    put(mid - 1, mid);
    put(mid + 1, mid);
    put(mid, mid - 1);
    put(mid, mid + 1);
  } else if (tier === 4) {
    // Cross / X-dither `×`
    put(mid, mid);
    put(mid - 1, mid - 1);
    put(mid + 1, mid - 1);
    put(mid - 1, mid + 1);
    put(mid + 1, mid + 1);
    if (cellSize >= 5) {
      put(mid - 2, mid - 2);
      put(mid + 2, mid - 2);
      put(mid - 2, mid + 2);
      put(mid + 2, mid + 2);
    }
  } else if (tier === 5) {
    // Dense `#` / waffle mesh
    for (let dy = 0; dy < cellSize - 1; dy++) {
      for (let dx = 0; dx < cellSize - 1; dx++) {
        if ((dx + dy) % 2 === 0 || (dx === mid && dy === mid)) {
          put(dx, dy);
        }
      }
    }
  } else {
    // Tier 6: Solid luminous highlight block `█` / `@` with subtle 1px breathing corner
    for (let dy = 0; dy < cellSize; dy++) {
      for (let dx = 0; dx < cellSize; dx++) {
        if (dx === cellSize - 1 && dy === cellSize - 1 && tier < 7) continue;
        put(dx, dy, 1.04);
      }
    }
  }
}

/**
 * Live dithered ASCII / halftone motion art for each Better Shapes product, styled after
 * high-contrast 8-bit ordered-dither ASCII graphics (deep navy-black void, hot magenta/crimson
 * midtones, electric cyan rim-lighting, and ice-white highlights) with product-specific motion waves.
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
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const theme = THEMES[slug] ?? THEMES.shapesos;
    let raf = 0;
    let visible = true;
    let disposed = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let cellSize = 5;
    let cols = 64;
    let rows = 40;

    // Sampled source image luminance & chromaticity per grid cell
    let srcLuma = new Float32Array(0);
    let srcCool = new Float32Array(0);
    let srcEdge = new Float32Array(0);
    let loadedImg: HTMLImageElement | null = null;
    let imgDataBuf: ImageData | null = null;

    const sampleSourceToGrid = () => {
      const total = cols * rows;
      srcLuma = new Float32Array(total);
      srcCool = new Float32Array(total);
      srcEdge = new Float32Array(total);

      if (!loadedImg) return;

      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d");
      if (!octx) return;

      // Cover-crop source image into (cols, rows)
      const iw = loadedImg.naturalWidth || 1152;
      const ih = loadedImg.naturalHeight || 720;
      const targetAspect = cols / rows;
      const srcAspect = iw / ih;
      let sx = 0,
        sy = 0,
        sw = iw,
        sh = ih;
      if (srcAspect > targetAspect) {
        sw = ih * targetAspect;
        sx = (iw - sw) * 0.5;
      } else {
        sh = iw / targetAspect;
        sy = (ih - sh) * 0.5;
      }
      octx.drawImage(loadedImg, sx, sy, sw, sh, 0, 0, cols, rows);
      const raw = octx.getImageData(0, 0, cols, rows).data;

      // Pass 1: compute contrast-stretched luma and cool-vs-warm color balance
      let minL = 1;
      let maxL = 0;
      const isFlock = slug === "flock" || slug === "field";
      for (let i = 0; i < total; i++) {
        const y = Math.floor(i / cols);
        const r = raw[i * 4] / 255;
        const g = raw[i * 4 + 1] / 255;
        const b = raw[i * 4 + 2] / 255;
        let l = 0.299 * r + 0.587 * g + 0.114 * b;
        // For outdoor sunlit sky in Flock, vignette the top sky into deep night void so the white robots & cyan mesh lines pop
        if (isFlock && y < rows * 0.48) {
          const skyFade = 0.28 + 0.72 * (y / (rows * 0.48));
          // Keep bright cyan mesh lines or drones, darken uniform bright sky
          const sat = Math.max(r, g, b) - Math.min(r, g, b);
          if (sat < 0.38) l *= skyFade;
        }
        srcLuma[i] = l;
        // Positive when pixel leans blue/cyan/green relative to red
        srcCool[i] = Math.max(-1, Math.min(1, (b * 0.65 + g * 0.55 - r * 0.95) * 1.9));
        if (l < minL) minL = l;
        if (l > maxL) maxL = l;
      }

      const span = Math.max(0.25, maxL - minL);
      for (let i = 0; i < total; i++) {
        // S-curve contrast boost so shadows fall into deep void and highlights pop like the skull reference
        const norm = Math.max(0, Math.min(1, (srcLuma[i] - minL) / span));
        const sCurve = norm * norm * (3 - 2 * norm);
        srcLuma[i] = Math.pow(sCurve, 1.12);
      }

      // Pass 2: Sobel-like local gradient magnitude to crisp up silhouettes & dithering edges
      for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
          const idx = y * cols + x;
          const gx = srcLuma[idx + 1] - srcLuma[idx - 1];
          const gy = srcLuma[idx + cols] - srcLuma[idx - cols];
          srcEdge[idx] = Math.min(1, Math.hypot(gx, gy) * 2.4);
        }
      }
    };

    const measure = () => {
      const rect = wrap.getBoundingClientRect();
      width = Math.max(24, Math.floor(rect.width));
      height = Math.max(24, Math.floor(rect.height));

      const minDim = Math.min(width, height);
      if (minDim < 56) {
        cellSize = 3;
      } else if (minDim < 120) {
        cellSize = 4;
      } else if (width < 520) {
        cellSize = 4;
      } else {
        cellSize = 5;
      }

      cols = Math.max(12, Math.floor(width / cellSize));
      rows = Math.max(12, Math.floor(height / cellSize));
      const snapW = cols * cellSize;
      const snapH = rows * cellSize;
      canvas.width = snapW;
      canvas.height = snapH;
      imgDataBuf = ctx.createImageData(snapW, snapH);
      sampleSourceToGrid();
    };

    const render = (nowMs: number) => {
      if (disposed) return;
      if (!width || !height || !imgDataBuf) measure();
      if (!imgDataBuf) return;

      const t = reduceMotion ? 2.4 : nowMs * 0.001;
      const snapW = cols * cellSize;
      const snapH = rows * cellSize;
      const buf = imgDataBuf.data;

      // Clear buffer to deep void background (#0B0514)
      const [br, bg, bb] = theme.bg;
      for (let i = 0; i < buf.length; i += 4) {
        buf[i] = br;
        buf[i + 1] = bg;
        buf[i + 2] = bb;
        buf[i + 3] = 255;
      }

      const cx = cols * 0.5;
      const cy = rows * 0.5;
      const maxR = Math.hypot(cx, cy) || 1;

      // Horizontal glitch scanline tear (subtle, periodic)
      const glitchRow = Math.floor(((t * 19) % (rows * 1.7)));
      const glitchShift = Math.sin(t * 7.3) > 0.72 ? (Math.sin(t * 31) > 0 ? 1 : -1) : 0;

      for (let gy = 0; gy < rows; gy++) {
        const rowShift = Math.abs(gy - glitchRow) <= 1 ? glitchShift : 0;
        for (let gx = 0; gx < cols; gx++) {
          const sx = Math.max(0, Math.min(cols - 1, gx + rowShift));
          const idx = gy * cols + sx;

          let luma = srcLuma[idx] ?? 0;
          const cool = srcCool[idx] ?? 0;
          const edge = srcEdge[idx] ?? 0;

          // Boost edge definition so characters trace silhouettes sharply
          luma = Math.min(1, luma + edge * 0.22);

          // Product-specific real-time motion field modulation
          const dx = gx - cx;
          const dy = gy - cy;
          const dist = Math.hypot(dx, dy);
          const normDist = dist / maxR;
          const angle = Math.atan2(dy, dx);

          let waveBoost = 0;
          let rimPulse = 0;

          if (theme.mode === "poison") {
            // Canary: concentric poison shockwaves radiating from the golden key & electric arcs
            const ring = Math.sin(dist * 0.32 - t * 4.2);
            if (ring > 0.65) {
              waveBoost += (ring - 0.65) * 0.65;
              rimPulse += (ring - 0.65) * 1.6;
            }
          } else if (theme.mode === "radar") {
            // Periscope: rotating optical radar sweep illuminating the scene
            const sweep = ((t * 1.6 - angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
            const wake = Math.max(0, 1 - sweep / 1.35);
            waveBoost += wake * 0.28;
            rimPulse += wake * 0.95;
          } else if (theme.mode === "conjure") {
            // Kiln: inward-spiraling vortex of data particles rising into the neural brain core
            const spiral = Math.sin(dist * 0.28 + angle * 2 - t * 3.6);
            if (spiral > 0.55 && normDist < 0.75) {
              waveBoost += (spiral - 0.55) * 0.55 * (1 - normDist * 0.5);
              rimPulse += (spiral - 0.55) * 1.1;
            }
          } else if (theme.mode === "ripple") {
            // Ripple: broadcast signal waves propagating across the city skyline
            const broadcast = Math.sin((gx - cols * 0.28) * 0.24 - Math.abs(dy) * 0.08 - t * 4.0);
            if (broadcast > 0.58) {
              waveBoost += (broadcast - 0.58) * 0.52;
              rimPulse += (broadcast - 0.58) * 1.35;
            }
          } else if (theme.mode === "mesh") {
            // Flock: diagonal peer-to-peer mesh laser pulses sweeping across the fleet
            const meshWave = Math.sin((gx + gy) * 0.22 - t * 3.8) * Math.cos((gx - gy) * 0.18 + t * 2.1);
            if (meshWave > 0.52) {
              waveBoost += (meshWave - 0.52) * 0.5;
              rimPulse += (meshWave - 0.52) * 1.25;
            }
          } else {
            // ShapesOS: 4-corner pillar streams converging on the central Approvals Inbox
            const converge = Math.sin(dist * 0.3 + t * 3.4);
            if (converge > 0.6) {
              waveBoost += (converge - 0.6) * 0.48;
              rimPulse += (converge - 0.6) * 1.1;
            }
          }

          // Subtle CRT shimmer + ordered 4×4 Bayer threshold
          const bayer = BAYER4[gy & 3][gx & 3];
          const shimmer = Math.sin(gx * 1.7 + gy * 2.3 + t * 3.2) * 0.035;
          const dithered = luma + waveBoost + bayer * 0.28 + shimmer;

          // Ambient sparse noise dots in the dark background (like the skull reference corners)
          const bgSparkle =
            luma < 0.14 &&
            Math.sin(gx * 12.9898 + gy * 78.233 + Math.floor(t * 3) * 0.7) > 0.965;

          if (dithered < 0.15 && !bgSparkle) continue;

          // Map dithered luminance to 1..6 glyph density tiers
          let tier = 1;
          if (bgSparkle && dithered < 0.15) {
            tier = 1;
          } else if (dithered < 0.27) {
            tier = 1;
          } else if (dithered < 0.40) {
            tier = 2;
          } else if (dithered < 0.54) {
            tier = 3;
          } else if (dithered < 0.68) {
            tier = 4;
          } else if (dithered < 0.82) {
            tier = 5;
          } else {
            tier = 6;
          }

          // Select color from the tri-tone dither palette:
          // - High luminance -> Pale Cyan / Ice White highlight (theme.hi)
          // - Cool source regions or active motion wave -> Electric Cyan/Emerald rim light (theme.rim)
          // - Midtones -> Vibrant Crimson / Hot Pink (theme.mid)
          // - Deep low-density shadows -> Deep Crimson/Berry (theme.deep)
          let color: RGB = theme.mid;
          if (tier >= 6 || luma > 0.78) {
            // Dither the transition between midtone and ice-cyan highlight using the Bayer cell
            color = luma + bayer * 0.18 > 0.76 ? theme.hi : theme.mid;
          } else if (cool + rimPulse * 0.45 > 0.22 + bayer * 0.25) {
            color = theme.rim;
          } else if (tier <= 2 && luma < 0.28) {
            color = theme.deep;
          }

          stampGlyph(buf, snapW, snapH, gx, gy, cellSize, tier, color);
        }
      }

      ctx.putImageData(imgDataBuf, 0, 0);

      if (!reduceMotion && visible) {
        raf = window.requestAnimationFrame(render);
      }
    };

    measure();
    render(performance.now());

    loadProductImage(slug)
      .then((img) => {
        if (disposed) return;
        loadedImg = img;
        sampleSourceToGrid();
        render(performance.now());
      })
      .catch(() => {
        /* fallback if image fails to load */
      });

    const ro = new ResizeObserver(() => {
      measure();
      render(performance.now());
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      (entries) => {
        const isVis = entries[0]?.isIntersecting ?? true;
        if (isVis && !visible) {
          visible = true;
          if (!reduceMotion) raf = window.requestAnimationFrame(render);
        } else if (!isVis && visible) {
          visible = false;
          window.cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.01 },
    );
    io.observe(wrap);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(raf);
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
      <canvas
        ref={canvasRef}
        className="block h-full w-full [image-rendering:pixelated]"
      />
    </div>
  );
}
