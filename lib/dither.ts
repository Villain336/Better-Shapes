/**
 * Dot-matrix dither used for every product render. Kept framework-free so the
 * exact same pass can run on a canvas in the browser and in Node for previews.
 */

export type RGB = readonly [number, number, number];

export const DITHER_BG: RGB = [10, 7, 30];

const WARM: readonly RGB[] = [
  DITHER_BG,
  [52, 12, 50],
  [118, 26, 78],
  [196, 46, 108],
  [246, 92, 152],
  [252, 196, 222],
  [222, 250, 252],
];

const COOL: readonly RGB[] = [
  DITHER_BG,
  [14, 30, 74],
  [20, 88, 150],
  [36, 170, 214],
  [92, 222, 240],
  [176, 244, 250],
  [222, 250, 252],
];

const LEVELS = WARM.length - 1;
const GRAIN_PERIOD = 24;

const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16 - 0.47);

function hash(x: number, y: number, s: number) {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

export type Field = {
  cols: number;
  rows: number;
  /** Tone per cell, 0..1, already contrast-shaped. */
  tone: Float32Array;
  /** 0 = warm (magenta ramp), 1 = cool (cyan ramp). */
  cool: Float32Array;
};

/** Converts a cols×rows RGBA sample of the source into a tone/temperature field. */
export function buildField(
  rgba: Uint8ClampedArray | Uint8Array,
  cols: number,
  rows: number,
  gamma = 0.85,
): Field {
  const n = cols * rows;
  const raw = new Float32Array(n);
  const cool = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const r = rgba[i * 4] / 255;
    const g = rgba[i * 4 + 1] / 255;
    const b = rgba[i * 4 + 2] / 255;
    const max = Math.max(r, g, b);
    // Saturated magenta/cyan light should read as bright, not as its (low) luma.
    raw[i] = 0.45 * (0.3 * r + 0.55 * g + 0.15 * b) + 0.55 * max + 0.3 * Math.min(r, g, b);
    const chroma = max - Math.min(r, g, b);
    const lean = (g + b) * 0.5 - r;
    cool[i] = chroma > 0.06 && lean > 0.02 ? Math.min(1, lean / Math.max(0.12, chroma) + 0.25) : 0;
  }

  const sorted = Float32Array.from(raw).sort();
  const lo = Math.max(0.06, sorted[Math.floor(n * 0.04)] + 0.03);
  const hi = Math.max(lo + 0.2, sorted[Math.min(n - 1, Math.floor(n * 0.996))]);

  const tone = new Float32Array(n);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      let sum = 0;
      let cnt = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= rows) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= cols) continue;
          sum += raw[yy * cols + xx];
          cnt++;
        }
      }
      const sharpened = raw[i] + (raw[i] - sum / cnt) * 0.9;
      const t = Math.max(0, Math.min(1, (sharpened - lo) / (hi - lo)));
      tone[i] = Math.pow(t, gamma);
    }
  }
  return { cols, rows, tone, cool };
}

const pack = (c: RGB) => ((255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0]) >>> 0;
const WARM32 = Uint32Array.from(WARM, pack);
const COOL32 = Uint32Array.from(COOL, pack);
const BG32 = pack(DITHER_BG);

/**
 * Paints the field into an RGBA buffer. Each cell is `pitch` px square: a lit
 * dot of `dot` px sitting on a darker gap, mirroring LED/halftone matrices.
 */
export function paintField(
  field: Field,
  out: Uint8ClampedArray,
  width: number,
  height: number,
  pitch: number,
  dot: number,
  opts: { /** Animation tick; advancing it slowly re-rolls the grain. */ seed?: number; exposure?: number; grain?: number } = {},
) {
  const { cols, rows, tone, cool } = field;
  const seed = opts.seed ?? 1;
  const exposure = opts.exposure ?? 1;
  const grain = opts.grain ?? 0.55;
  const inset = Math.floor((pitch - dot) / 2);
  const px = new Uint32Array(out.buffer, out.byteOffset, out.length >> 2);
  px.fill(BG32);

  for (let cy = 0; cy < rows; cy++) {
    const y0 = cy * pitch;
    if (y0 >= height) break;
    for (let cx = 0; cx < cols; cx++) {
      const x0 = cx * pitch;
      if (x0 >= width) break;
      const i = cy * cols + cx;
      const v = Math.min(1, tone[i] * exposure) * LEVELS;
      // Each cell re-rolls its grain on its own staggered schedule, so only a few cells change per tick.
      const roll = Math.floor((seed + hash(cx, cy, 97) * GRAIN_PERIOD) / GRAIN_PERIOD);
      if (v < 0.3) {
        if (hash(cx, cy, roll) > 0.992) fillCell(px, width, height, x0 + inset, y0 + inset, dot, WARM32[1]);
        continue;
      }
      const bayer = BAYER4[(cy & 3) * 4 + (cx & 3)];
      const noise = (hash(cx, cy, roll) - 0.5) * grain;
      const ramp = cool[i] > 0.45 + bayer * 0.5 ? COOL32 : WARM32;

      const dotLevel = clampLevel(Math.floor(v + 0.35 + bayer + noise));
      const gapLevel = clampLevel(Math.floor(v - 1.25 + bayer * 0.6 + noise * 0.5));

      if (gapLevel > 0) fillCell(px, width, height, x0, y0, pitch, ramp[gapLevel]);
      if (dotLevel > 0) {
        const lvl = dotLevel === LEVELS && gapLevel === LEVELS && bayer > 0.1 ? LEVELS - 2 : dotLevel;
        fillCell(px, width, height, x0 + inset, y0 + inset, dot, ramp[lvl]);
      }
    }
  }
}

function clampLevel(l: number) {
  return l < 0 ? 0 : l > LEVELS ? LEVELS : l;
}

function fillCell(px: Uint32Array, width: number, height: number, x0: number, y0: number, size: number, c: number) {
  const x1 = Math.min(width, x0 + size);
  const y1 = Math.min(height, y0 + size);
  for (let y = y0; y < y1; y++) px.fill(c, y * width + x0, y * width + x1);
}
