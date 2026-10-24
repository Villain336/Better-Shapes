"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/content";

/** Deep ink backdrop for the ASCII motion canvases. */
export const RENDER_BG = "#121318";

export const productRender = (slug: string) => asset(`/products/${slug}.webp`);

/** Extracts a product slug from a `/products/<slug>.webp` asset path, if it is one. */
export function productSlugFromSrc(src: string): string | null {
  const m = src.match(/\/products\/([a-z0-9-]+)\.webp$/i);
  return m ? m[1].toLowerCase() : null;
}

type RGB = readonly [number, number, number];

const PALETTE = {
  bg: "#121318",
  bgSubtle: [24, 26, 34] as RGB,
  dim: [72, 74, 86] as RGB,
  muted: [132, 134, 146] as RGB,
  ink: [241, 239, 233] as RGB,
  red: [224, 83, 61] as RGB,
  blue: [92, 133, 255] as RGB,
  cyan: [86, 204, 242] as RGB,
  yellow: [240, 184, 64] as RGB,
  green: [56, 198, 122] as RGB,
};

type Cell = {
  ch: string;
  color: RGB;
  alpha: number;
  glow?: boolean;
};

type GridBuf = {
  cols: number;
  rows: number;
  cells: Cell[];
  clear: () => void;
  set: (x: number, y: number, ch: string, color?: RGB, alpha?: number, glow?: boolean) => void;
  text: (x: number, y: number, str: string, color?: RGB, alpha?: number, glow?: boolean) => void;
  box: (x: number, y: number, w: number, h: number, color?: RGB, alpha?: number, title?: string) => void;
  line: (x0: number, y0: number, x1: number, y1: number, chars: string, color: RGB, alpha?: number, phase?: number) => void;
};

function createGrid(cols: number, rows: number): GridBuf {
  const cells: Cell[] = Array.from({ length: cols * rows }, () => ({
    ch: " ",
    color: PALETTE.ink,
    alpha: 0,
    glow: false,
  }));

  const clear = () => {
    for (let i = 0; i < cells.length; i++) {
      cells[i].ch = " ";
      cells[i].alpha = 0;
      cells[i].glow = false;
    }
  };

  const set = (x: number, y: number, ch: string, color: RGB = PALETTE.ink, alpha = 1, glow = false) => {
    const ix = Math.round(x);
    const iy = Math.round(y);
    if (ix < 0 || ix >= cols || iy < 0 || iy >= rows) return;
    if (alpha <= 0.02) return;
    const cell = cells[iy * cols + ix];
    if (alpha >= cell.alpha * 0.85) {
      cell.ch = ch;
      cell.color = color;
      cell.alpha = Math.min(1, alpha);
      cell.glow = glow;
    }
  };

  const text = (x: number, y: number, str: string, color: RGB = PALETTE.ink, alpha = 1, glow = false) => {
    const iy = Math.round(y);
    if (iy < 0 || iy >= rows) return;
    const startX = Math.round(x);
    for (let i = 0; i < str.length; i++) {
      const ix = startX + i;
      if (ix < 0 || ix >= cols) continue;
      const ch = str[i];
      if (ch === " ") continue;
      set(ix, iy, ch, color, alpha, glow);
    }
  };

  const box = (x: number, y: number, w: number, h: number, color: RGB = PALETTE.muted, alpha = 0.65, title?: string) => {
    const x0 = Math.round(x);
    const y0 = Math.round(y);
    const x1 = x0 + Math.round(w) - 1;
    const y1 = y0 + Math.round(h) - 1;
    if (x1 <= x0 || y1 <= y0) return;
    set(x0, y0, "┌", color, alpha);
    set(x1, y0, "┐", color, alpha);
    set(x0, y1, "└", color, alpha);
    set(x1, y1, "┘", color, alpha);
    for (let ix = x0 + 1; ix < x1; ix++) {
      set(ix, y0, "─", color, alpha);
      set(ix, y1, "─", color, alpha);
    }
    for (let iy = y0 + 1; iy < y1; iy++) {
      set(x0, iy, "│", color, alpha);
      set(x1, iy, "│", color, alpha);
    }
    if (title && w > title.length + 4) {
      text(x0 + 2, y0, ` ${title} `, PALETTE.ink, Math.min(1, alpha + 0.25));
    }
  };

  const line = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    chars: string,
    color: RGB,
    alpha = 0.7,
    phase = 0,
  ) => {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const steps = Math.max(Math.abs(dx), Math.abs(dy), 1);
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const x = x0 + dx * u;
      const y = y0 + dy * u;
      const idx = Math.floor(((u * steps - phase) % chars.length + chars.length) % chars.length);
      set(x, y, chars[idx], color, alpha);
    }
  };

  return { cols, rows, cells, clear, set, text, box, line };
}

const DENSITY = " ·.:+-=*#%@";
function densityChar(v: number): string {
  const clamped = Math.max(0, Math.min(0.999, v));
  return DENSITY[Math.floor(clamped * DENSITY.length)];
}

/**
 * 1. SHAPESOS — The Agentic Business OS
 * Four Better Shapes geometric pillars (Grow, Design, Operate, Agents) stream proposals
 * into a central pulsing [APPROVALS INBOX] gate.
 */
function drawShapesOS(g: GridBuf, t: number, compact: boolean) {
  const { cols, rows } = g;
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  const aspect = 0.55; // char width / height ratio compensation

  // Background subtle coordinate grid
  for (let y = 0; y < rows; y += 2) {
    for (let x = 0; x < cols; x += 4) {
      g.set(x, y, "·", PALETTE.dim, 0.28);
    }
  }

  if (compact) {
    // Compact 2x2 Better Shapes geometric pulse
    const hw = Math.max(2, Math.floor(cols * 0.22));
    const hh = Math.max(2, Math.floor(rows * 0.22));
    const pulse = 0.75 + 0.25 * Math.sin(t * 2.6);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const dx = (x - cx) * aspect;
        const dy = y - cy;
        if (Math.abs(dx) < 0.7 || Math.abs(dy) < 0.5) continue;
        if (Math.abs(dx) <= hw * aspect && Math.abs(dy) <= hh) {
          if (dx < 0 && dy < 0) g.set(x, y, "◕", PALETTE.red, pulse, true);
          else if (dx > 0 && dy < 0) g.set(x, y, "▲", PALETTE.blue, pulse, true);
          else if (dx < 0 && dy > 0) g.set(x, y, "●", PALETTE.yellow, pulse, true);
          else g.set(x, y, "▛", PALETTE.green, pulse, true);
        }
      }
    }
    g.set(cx, cy, "◎", PALETTE.ink, 1, true);
    return;
  }

  const rx = Math.min(cols * 0.33, 28);
  const ry = Math.min(rows * 0.31, 9.5);

  const pillars: {
    name: string;
    sub: string;
    ox: number;
    oy: number;
    color: RGB;
    kind: "quarter" | "tri" | "circle" | "lblock";
  }[] = [
    { name: "GROW", sub: "CRM·SEO", ox: -rx, oy: -ry, color: PALETTE.red, kind: "quarter" },
    { name: "DESIGN", sub: "STUDIO·3D", ox: rx, oy: -ry, color: PALETTE.blue, kind: "tri" },
    { name: "OPERATE", sub: "DOCS·LEGAL", ox: -rx, oy: ry, color: PALETTE.yellow, kind: "circle" },
    { name: "AGENTS", sub: "MCP·PLAYS", ox: rx, oy: ry, color: PALETTE.green, kind: "lblock" },
  ];

  // Stream proposals from each pillar to center approval ring
  pillars.forEach((p, idx) => {
    const px = cx + p.ox;
    const py = cy + p.oy;

    // Animated stream lines toward center
    const steps = 18;
    for (let s = 2; s < steps - 3; s++) {
      const u = s / steps;
      const wobble = Math.sin(u * Math.PI * 2 - t * 3.5 + idx) * 0.6;
      const sx = px + (cx - px) * u - (p.oy / ry) * wobble;
      const sy = py + (cy - py) * u + (p.ox / rx) * wobble * 0.4;
      const wave = (Math.sin((u - t * 0.55 + idx * 0.25) * Math.PI * 4) + 1) * 0.5;
      const ch = wave > 0.78 ? "◆" : wave > 0.5 ? "+" : "·";
      g.set(sx, sy, ch, p.color, 0.28 + wave * 0.65, wave > 0.78);
    }

    // Draw ASCII geometric shape at pillar node
    const sr = Math.max(2.2, Math.min(cols / 18, 3.8));
    for (let dy = -Math.ceil(sr); dy <= Math.ceil(sr); dy++) {
      for (let dx = -Math.ceil(sr / aspect); dx <= Math.ceil(sr / aspect); dx++) {
        const nx = (dx * aspect) / sr;
        const ny = dy / sr;
        const rot = 0.18 * Math.sin(t * 1.4 + idx);
        const rx2 = nx * Math.cos(rot) - ny * Math.sin(rot);
        const ry2 = nx * Math.sin(rot) + ny * Math.cos(rot);
        let inside = false;
        if (p.kind === "quarter") {
          inside = rx2 >= -0.6 && ry2 >= -0.6 && rx2 * rx2 + ry2 * ry2 <= 1.05;
        } else if (p.kind === "tri") {
          inside = ry2 <= 0.75 && ry2 >= -0.85 && Math.abs(rx2) <= (ry2 + 0.9) * 0.68;
        } else if (p.kind === "circle") {
          const d = Math.hypot(rx2, ry2);
          inside = d <= 0.92;
        } else {
          inside =
            Math.abs(rx2) <= 0.85 &&
            Math.abs(ry2) <= 0.85 &&
            !(rx2 > 0.05 && ry2 > 0.05);
        }
        if (inside) {
          const edge = Math.hypot(rx2, ry2);
          const ch = edge > 0.68 ? "#" : "@";
          g.set(px + dx, py + dy, ch, p.color, 0.82, edge > 0.75);
        }
      }
    }

    // Label next to pillar
    if (cols >= 48) {
      const labelY = p.oy < 0 ? py - Math.ceil(sr) - 1 : py + Math.ceil(sr) + 1;
      const tag = `[${p.name}]`;
      g.text(px - Math.floor(tag.length / 2), labelY, tag, PALETTE.ink, 0.92);
    }
  });

  // Central Approvals Inbox ring + core
  const ringR = Math.min(cols * 0.11, 7.5);
  for (let a = 0; a < 36; a++) {
    const theta = (a / 36) * Math.PI * 2 + t * 0.7;
    const rxC = cx + ( Math.cos(theta) * ringR ) / aspect;
    const ryC = cy + Math.sin(theta) * (ringR * 0.55);
    const pulse = (Math.sin(theta * 2 - t * 3) + 1) * 0.5;
    const color =
      a < 9 ? PALETTE.red : a < 18 ? PALETTE.blue : a < 27 ? PALETTE.yellow : PALETTE.green;
    g.set(rxC, ryC, pulse > 0.6 ? "═" : "·", color, 0.5 + pulse * 0.45, pulse > 0.75);
  }

  const boxW = Math.min(cols - 6, 21);
  g.box(cx - Math.floor(boxW / 2), cy - 2, boxW, 5, PALETTE.ink, 0.85);
  const title = boxW >= 19 ? "APPROVALS INBOX" : "APPROVALS";
  g.text(cx - Math.floor(title.length / 2), cy - 1, title, PALETTE.ink, 1, true);
  const tick = Math.floor(t * 1.8) % 4;
  const states = ["✓ GROW #42 OK", "✓ DESIGN #19 OK", "✓ SIGN MSA OK", "✓ AGENT RUN OK"];
  const statusStr = boxW >= 19 ? states[tick] : "✓ APPROVED";
  g.text(cx - Math.floor(statusStr.length / 2), cy + 1, statusStr, PALETTE.green, 0.95, true);

  if (cols >= 52 && rows >= 18) {
    const hdr = "SHAPESOS // AGENTIC OS";
    g.text(cols - hdr.length - 2, 1, hdr, PALETTE.muted, 0.75);
    g.text(2, rows - 2, "PROPOSE -> APPROVE -> EXECUTE", PALETTE.dim, 0.7);
  }
}

/**
 * 2. PERISCOPE — Eyes for Agents (Viewing MCP Server & API)
 * A sweeping optical radar/periscope beam scanning across a live DOM / accessibility tree,
 * resolving raw noise into crisp structured nodes.
 */
function drawPeriscope(g: GridBuf, t: number, compact: boolean) {
  const { cols, rows } = g;
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  const aspect = 0.55;

  const sweepAngle = t * 1.35;
  const beamDx = Math.cos(sweepAngle);
  const beamDy = Math.sin(sweepAngle);

  const maxR = Math.min(cols * aspect * 0.44, rows * 0.43);

  // Concentric optical reticle rings & swept field
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const dx = (x - cx) * aspect;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > maxR * 1.18) {
        if ((x + y) % 5 === 0) g.set(x, y, "·", PALETTE.dim, 0.2);
        continue;
      }

      // Angle difference from scan beam
      const ang = Math.atan2(dy, dx);
      let diff = ((sweepAngle - ang) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      const wake = Math.max(0, 1 - diff / (Math.PI * 0.85));

      // Ring markings
      const rNorm = dist / maxR;
      const onOuter = Math.abs(rNorm - 1) < 0.06;
      const onMid = Math.abs(rNorm - 0.62) < 0.05;
      const onInner = Math.abs(rNorm - 0.28) < 0.05;

      if (onOuter || onMid || onInner) {
        const ch = onOuter ? "○" : "·";
        g.set(x, y, ch, wake > 0.5 ? PALETTE.cyan : PALETTE.blue, 0.35 + wake * 0.6, wake > 0.75);
      } else if (wake > 0.08) {
        const ch = wake > 0.82 ? "+" : wake > 0.45 ? ":" : "·";
        g.set(x, y, ch, wake > 0.75 ? PALETTE.cyan : PALETTE.blue, wake * 0.65, wake > 0.85);
      }
    }
  }

  // Crosshairs
  for (let x = Math.max(1, Math.floor(cx - maxR / aspect)); x <= Math.min(cols - 2, Math.ceil(cx + maxR / aspect)); x += 2) {
    g.set(x, cy, "─", PALETTE.dim, 0.45);
  }
  for (let y = Math.max(1, Math.floor(cy - maxR)); y <= Math.min(rows - 2, Math.ceil(cy + maxR)); y++) {
    g.set(cx, y, "│", PALETTE.dim, 0.45);
  }

  // Scan line ray
  const raySteps = Math.ceil(maxR / aspect);
  for (let i = 1; i <= raySteps; i++) {
    const u = i / raySteps;
    const rx = cx + (beamDx * maxR * u) / aspect;
    const ry = cy + beamDy * maxR * u;
    g.set(rx, ry, u > 0.8 ? "◈" : "*", PALETTE.ink, 0.95, true);
  }

  // Central lens iris
  g.set(cx, cy, "◉", PALETTE.cyan, 1, true);

  if (compact) return;

  // Floating DOM / accessibility tree nodes resolved by the scan beam
  const nodes = [
    { x: 2, y: 4, tag: "<nav role='menu'>", tone: PALETTE.cyan },
    { x: Math.max(cx + 4, cols - 16), y: 4, tag: "[btn#approve]", tone: PALETTE.green },
    { x: 2, y: rows - 4, tag: "<canvas chart>", tone: PALETTE.yellow },
    { x: Math.max(cx + 4, cols - 17), y: rows - 4, tag: "[table 24 rows]", tone: PALETTE.blue },
  ];

  if (cols >= 44) {
    nodes.forEach((n) => {
      const dx = (n.x - cx) * aspect;
      const dy = n.y - cy;
      const ang = Math.atan2(dy, dx);
      const diff = ((sweepAngle - ang) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      const lit = Math.max(0, 1 - diff / (Math.PI * 1.1));
      g.text(n.x, n.y, n.tag, lit > 0.45 ? n.tone : PALETTE.muted, 0.45 + lit * 0.55, lit > 0.65);
    });
  }

  if (cols >= 52 && rows >= 18) {
    const hdr = "PERISCOPE // MCP VIEWER";
    g.text(cols - hdr.length - 2, 1, hdr, PALETTE.muted, 0.8);
    g.text(2, rows - 2, "OPEN -> LOOK -> FIND -> A11Y TREE", PALETTE.cyan, 0.75);
  }
}

/**
 * 3. CANARY — Decoy Key Poisoning & Killing Hacker Bots
 * A glowing golden ASCII cryptographic key at center emits emerald/amber poison shockwaves;
 * red spider hacker bots scuttle inward and short-circuit/shatter on contact.
 */
function drawCanary(g: GridBuf, t: number, compact: boolean) {
  const { cols, rows } = g;
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  const aspect = 0.55;

  const killRadius = Math.min(cols * aspect * 0.25, rows * 0.32);

  // Expanding poison shockwave rings from the key
  for (let ring = 0; ring < 2; ring++) {
    const phase = (t * 0.65 + ring * 0.5) % 1;
    const r = killRadius * (0.45 + phase * 1.15);
    const alpha = (1 - phase) * 0.85;
    const samples = 44;
    for (let i = 0; i < samples; i++) {
      const a = (i / samples) * Math.PI * 2 + t * 0.3;
      const x = cx + (Math.cos(a) * r) / aspect;
      const y = cy + Math.sin(a) * r;
      const ch = i % 3 === 0 ? "~" : i % 3 === 1 ? "*" : "·";
      g.set(x, y, ch, ring === 0 ? PALETTE.green : PALETTE.yellow, alpha, phase < 0.4);
    }
  }

  // Draw the iconic Golden Canary Key in the center
  if (compact) {
    g.text(cx - 3, cy, "◎══╦╦", PALETTE.yellow, 1, true);
    g.set(cx - 3, cy - 1, "⚡", PALETTE.green, 0.9, true);
    g.set(cx + 2, cy + 1, "✕", PALETTE.red, 0.9, true);
    return;
  }

  // Ornate ASCII key centered at (cx, cy)
  const keyArt = [
    "  ╭───╮          ",
    " ╭│ ◎ │══════════╗",
    " ╰└───╯══════╦═╦═╝",
    "             ║ ║  ",
    "             ╚═╝  ",
  ];
  const kw = keyArt[0].length;
  const kh = keyArt.length;
  const kx = Math.round(cx - kw / 2);
  const ky = Math.round(cy - kh / 2);
  for (let r = 0; r < kh; r++) {
    for (let c = 0; c < kw; c++) {
      const ch = keyArt[r][c];
      if (ch !== " ") {
        g.set(kx + c, ky + r, ch, ch === "◎" ? PALETTE.green : PALETTE.yellow, 1, true);
      }
    }
  }

  // Hacker spider bots approaching from 6 directions and getting poisoned & shattered
  const botCount = 6;
  for (let b = 0; b < botCount; b++) {
    const baseAngle = (b / botCount) * Math.PI * 2 + 0.35;
    const cycle = (t * 0.42 + b * 0.19) % 1;
    const startR = Math.min(cols * aspect * 0.46, rows * 0.46);
    // Bot crawls from startR down to killRadius (cycle 0..0.62), then gets poisoned & explodes (0.62..1.0)
    const impactU = 0.62;
    if (cycle < impactU) {
      const u = cycle / impactU;
      const curR = startR - (startR - killRadius) * u;
      const bx = cx + (Math.cos(baseAngle) * curR) / aspect;
      const by = cy + Math.sin(baseAngle) * curR;
      const legs = Math.floor(t * 10 + b) % 2 === 0 ? "/╲(••)╱\\" : "\\╱(••)╲/";
      g.text(bx - 4, by, legs, PALETTE.red, 0.9, true);
    } else {
      // Poisoned! Electric green lightning arc from key to bot + shattering fragments
      const v = (cycle - impactU) / (1 - impactU); // 0..1 explosion progress
      const bx = cx + (Math.cos(baseAngle) * killRadius) / aspect;
      const by = cy + Math.sin(baseAngle) * killRadius;

      if (v < 0.45) {
        g.line(cx, cy, bx, by, "⚡*+~", PALETTE.green, 0.95 - v, t * 12);
        g.text(bx - 3, by, "⟪✕_✕⟫", PALETTE.yellow, 1, true);
      }
      // Dissolving poisoned shards
      const glyphs = ["✕", "%", "#", "*", ":", "·"];
      for (let s = 0; s < 6; s++) {
        const sa = baseAngle + (s - 2.5) * 0.45;
        const sr = v * 5.5;
        const sx = bx + (Math.cos(sa) * sr) / aspect;
        const sy = by + Math.sin(sa) * sr;
        const gIdx = Math.min(glyphs.length - 1, Math.floor(v * glyphs.length));
        g.set(sx, sy, glyphs[gIdx], s % 2 === 0 ? PALETTE.green : PALETTE.red, (1 - v) * 0.9, v < 0.3);
      }
    }
  }

  if (cols >= 52 && rows >= 18) {
    const kills = 1420 + Math.floor(t * 2.5);
    const hdr = "CANARY // DECOY KEYS";
    g.text(cols - hdr.length - 2, 1, hdr, PALETTE.yellow, 0.85);
    g.text(2, rows - 2, `BOTS TERMINATED: ${kills} · EXFIL BLOCKED`, PALETTE.green, 0.8);
  }
}

/**
 * 4. KILN — Small Data Lab Team Conjuring an AI Core
 * Four lab stations around the perimeter stream labeled training tokens into a rotating
 * 3D ASCII neural icosahedron / brain vortex glowing in the furnace center.
 */
function drawKiln(g: GridBuf, t: number, compact: boolean) {
  const { cols, rows } = g;
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  const aspect = 0.55;

  // Rotating 3D icosahedron / neural crystal vertices in the center
  const phi = (1 + Math.sqrt(5)) / 2;
  const rawVerts: [number, number, number][] = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
  ];

  const scale = compact
    ? Math.min(cols * aspect, rows) * 0.23
    : Math.min(cols * aspect * 0.19, rows * 0.24);

  const ay = t * 0.85;
  const ax = t * 0.52;
  const cosY = Math.cos(ay), sinY = Math.sin(ay);
  const cosX = Math.cos(ax), sinX = Math.sin(ax);

  const proj = rawVerts.map(([vx, vy, vz]) => {
    const x1 = vx * cosY - vz * sinY;
    const z1 = vx * sinY + vz * cosY;
    const y2 = vy * cosX - z1 * sinX;
    const z2 = vy * sinX + z1 * cosX;
    return {
      x: cx + (x1 * scale) / aspect,
      y: cy + y2 * scale,
      z: z2,
    };
  });

  // Connect nearby vertices of the icosahedron
  for (let i = 0; i < proj.length; i++) {
    for (let j = i + 1; j < proj.length; j++) {
      const d = Math.hypot(
        rawVerts[i][0] - rawVerts[j][0],
        rawVerts[i][1] - rawVerts[j][1],
        rawVerts[i][2] - rawVerts[j][2],
      );
      if (d < 2.15) {
        const zAvg = (proj[i].z + proj[j].z) * 0.5;
        const front = zAvg > 0;
        g.line(
          proj[i].x,
          proj[i].y,
          proj[j].x,
          proj[j].y,
          front ? "=+*" : "·:",
          front ? PALETTE.cyan : PALETTE.red,
          front ? 0.88 : 0.4,
          t * 4,
        );
      }
    }
  }

  proj.forEach((p) => {
    const front = p.z >= 0;
    g.set(p.x, p.y, front ? "◈" : "•", front ? PALETTE.yellow : PALETTE.red, front ? 1 : 0.55, front);
  });

  // Glowing core inside the conjured AI
  g.set(cx, cy, "✦", PALETTE.ink, 1, true);

  if (compact) return;

  // Four team stations around the table conjuring the AI with streams of labeled data
  const sx = Math.min(cols * 0.36, 30);
  const sy = Math.min(rows * 0.33, 9.5);
  const team = [
    { label: "[ENG·01]", token: "bbox", x: cx - sx, y: cy - sy, color: PALETTE.yellow },
    { label: "[ENG·02]", token: "mask", x: cx + sx, y: cy - sy, color: PALETTE.cyan },
    { label: "[ENG·03]", token: "rlhf", x: cx - sx, y: cy + sy, color: PALETTE.red },
    { label: "[ENG·04]", token: "eval", x: cx + sx, y: cy + sy, color: PALETTE.green },
  ];

  team.forEach((m, i) => {
    g.text(m.x - 4, m.y, m.label, PALETTE.ink, 0.9);
    // Spiraling conjuring particles into the neural core
    for (let p = 0; p < 8; p++) {
      const u = ((t * 0.45 + p / 8 + i * 0.25) % 1);
      const swirl = (1 - u) * 0.9;
      const baseAng = Math.atan2(m.y - cy, (m.x - cx) * aspect) + u * 1.4;
      const dist = (1 - u) * Math.hypot((m.x - cx) * aspect, m.y - cy);
      const px = cx + (Math.cos(baseAng) * dist) / aspect;
      const py = cy + Math.sin(baseAng) * dist + Math.sin(u * 8 + t * 3) * swirl;
      const ch = p % 3 === 0 ? "#" : p % 3 === 1 ? "+" : "·";
      g.set(px, py, ch, m.color, 0.35 + u * 0.65, u > 0.75);
    }
  });

  if (cols >= 52 && rows >= 18) {
    const loss = (0.042 + 0.008 * Math.sin(t * 0.7)).toFixed(3);
    const hdr = "KILN // MODEL FORGE";
    g.text(cols - hdr.length - 2, 1, hdr, PALETTE.yellow, 0.85);
    g.text(2, rows - 2, `TEAM: 4 · WEIGHTS: LOCAL · LOSS ${loss}`, PALETTE.cyan, 0.78);
  }
}

/**
 * 5. RIPPLE — One Creator -> Better Shapes Platform Screen -> Millions of Viewers
 * Left: a single live creator node. Center: the Better Shapes Ripple platform screen.
 * Right: cascading wave fronts linking out to a constellation of millions of viewer nodes.
 */
function drawRipple(g: GridBuf, t: number, compact: boolean) {
  const { cols, rows } = g;
  const cy = (rows - 1) / 2;
  const aspect = 0.55;

  if (compact) {
    const cx = (cols - 1) / 2;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const d = Math.hypot((x - cx) * aspect, y - cy);
        const w = (Math.sin(d * 1.5 - t * 4) + 1) * 0.5;
        if (w > 0.65) g.set(x, y, w > 0.85 ? "◎" : "·", PALETTE.green, w, w > 0.85);
      }
    }
    g.set(cx, cy, "▶", PALETTE.ink, 1, true);
    return;
  }

  const creatorX = Math.max(5, Math.floor(cols * 0.12));
  const screenX = Math.floor(cols * 0.34);
  const screenW = Math.max(12, Math.min(18, Math.floor(cols * 0.22)));
  const screenH = Math.max(7, Math.min(11, Math.floor(rows * 0.48)));
  const screenTop = Math.round(cy - screenH / 2);

  // 1. Creator node on the left
  g.set(creatorX, cy - 1, "◉", PALETTE.red, 1, true);
  g.text(creatorX - 2, cy, "[YOU]", PALETTE.ink, 0.95);
  g.text(creatorX - 2, cy + 1, "LIVE", PALETTE.red, 0.85);

  // Feed line from creator to the Better Shapes Ripple screen
  g.line(creatorX + 3, cy, screenX - 1, cy, "═▶*", PALETTE.green, 0.9, t * 8);

  // 2. Central Better Shapes Ripple platform screen
  g.box(screenX, screenTop, screenW, screenH, PALETTE.green, 0.9, "RIPPLE");
  const midX = screenX + Math.floor(screenW / 2);
  // Four-color Better Shapes emblem inside the screen
  g.set(midX - 2, cy - 1, "◕", PALETTE.red, 1, true);
  g.set(midX, cy - 1, "▲", PALETTE.blue, 1, true);
  g.set(midX - 2, cy, "●", PALETTE.yellow, 1, true);
  g.set(midX, cy, "▛", PALETTE.green, 1, true);
  g.set(midX + 2, cy, "▶", PALETTE.ink, 1, true);
  if (screenH >= 9) {
    g.text(screenX + 2, screenTop + screenH - 2, "BETTER SHAPES", PALETTE.muted, 0.85);
  }

  // 3. Right side: waves & fan-out streams linking the screen to millions of viewer nodes
  const emitX = screenX + screenW;
  const fieldStart = emitX + 2;

  for (let y = 2; y < rows - 2; y++) {
    for (let x = fieldStart; x < cols - 1; x++) {
      const dx = (x - emitX) * aspect;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);
      const ang = Math.atan2(dy, dx);
      if (Math.abs(ang) > 1.08) continue;

      const wave = Math.sin(dist * 1.15 - t * 4.2);
      // Pseudo-random viewer crowd nodes across the city
      const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const frac = hash - Math.floor(hash);

      if (frac > 0.86) {
        const lit = (wave + 1) * 0.5;
        const ch = lit > 0.72 ? "◈" : "◦";
        const col = lit > 0.72 ? PALETTE.cyan : PALETTE.green;
        g.set(x, y, ch, col, 0.4 + lit * 0.6, lit > 0.78);
      } else if (wave > 0.55) {
        g.set(x, y, ")", PALETTE.green, (wave - 0.4) * 0.85);
      }
    }
  }

  if (cols >= 52 && rows >= 18) {
    const viewers = (2847390 + Math.floor(Math.sin(t * 2) * 420 + t * 18)).toLocaleString("en-US");
    const hdr = "RIPPLE // STREAMING";
    g.text(cols - hdr.length - 2, 1, hdr, PALETTE.green, 0.85);
    g.text(2, rows - 2, `1 CREATOR -> RIPPLE -> ${viewers} VIEWERS`, PALETTE.cyan, 0.8);
  }
}

/**
 * 6. FLOCK (+ FIELD) — Drones, Hexapods, Humanoids & Nodes on a Better Shapes Mesh
 * Multi-craft robotic fleet linked by dynamic peer-to-peer laser mesh lines.
 */
function drawFlock(g: GridBuf, t: number, compact: boolean) {
  const { cols, rows } = g;
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  const aspect = 0.55;

  // Topographic horizon grid
  for (let y = 0; y < rows; y += 3) {
    for (let x = 0; x < cols; x += 3) {
      g.set(x, y, "·", PALETTE.dim, 0.25);
    }
  }

  const rx = cols * 0.34;
  const ry = rows * 0.32;

  const units = [
    {
      kind: "DRONE·01",
      sprite: "⨯─◈─⨯",
      x: cx - rx * 0.75 + Math.sin(t * 1.3) * 3,
      y: cy - ry * 0.85 + Math.cos(t * 1.7) * 1.2,
      color: PALETTE.cyan,
    },
    {
      kind: "DRONE·02",
      sprite: "⨯─◈─⨯",
      x: cx + rx * 0.72 + Math.cos(t * 1.1) * 3,
      y: cy - ry * 0.8 + Math.sin(t * 1.5) * 1.2,
      color: PALETTE.cyan,
    },
    {
      kind: "HUMANOID",
      sprite: "⟦▲ BS⟧",
      x: cx + Math.sin(t * 0.7) * 2,
      y: cy - 1,
      color: PALETTE.ink,
    },
    {
      kind: "HEXAPOD·A",
      sprite: "⧓═◉═⧓",
      x: cx - rx * 0.82 + Math.cos(t * 0.9) * 2.2,
      y: cy + ry * 0.25,
      color: PALETTE.yellow,
    },
    {
      kind: "HEXAPOD·B",
      sprite: "⧓═◉═⧓",
      x: cx + rx * 0.82 - Math.sin(t * 0.95) * 2.2,
      y: cy + ry * 0.25,
      color: PALETTE.red,
    },
    {
      kind: "BS·NODE·1",
      sprite: "[■ NODE]",
      x: cx - rx * 0.45,
      y: cy + ry * 0.9,
      color: PALETTE.green,
    },
    {
      kind: "BS·NODE·2",
      sprite: "[■ NODE]",
      x: cx + rx * 0.45,
      y: cy + ry * 0.9,
      color: PALETTE.blue,
    },
  ];

  if (compact) {
    // Compact triangle of mesh nodes
    const p0 = { x: cx, y: cy - rows * 0.25 };
    const p1 = { x: cx - cols * 0.26, y: cy + rows * 0.22 };
    const p2 = { x: cx + cols * 0.26, y: cy + rows * 0.22 };
    g.line(p0.x, p0.y, p1.x, p1.y, "·+*", PALETTE.cyan, 0.8, t * 4);
    g.line(p1.x, p1.y, p2.x, p2.y, "·+*", PALETTE.cyan, 0.8, t * 4);
    g.line(p2.x, p2.y, p0.x, p0.y, "·+*", PALETTE.cyan, 0.8, t * 4);
    g.set(p0.x, p0.y, "◈", PALETTE.red, 1, true);
    g.set(p1.x, p1.y, "◈", PALETTE.yellow, 1, true);
    g.set(p2.x, p2.y, "◈", PALETTE.green, 1, true);
    return;
  }

  // Draw peer-to-peer mesh links between all nearby units
  for (let i = 0; i < units.length; i++) {
    for (let j = i + 1; j < units.length; j++) {
      const u1 = units[i];
      const u2 = units[j];
      const dist = Math.hypot((u1.x - u2.x) * aspect, u1.y - u2.y);
      if (dist < Math.min(cols * aspect, rows) * 0.58) {
        g.line(u1.x, u1.y, u2.x, u2.y, "·:+*", PALETTE.cyan, 0.55, t * 6 + i);
      }
    }
  }

  // Draw each robot/node sprite + Better Shapes four-shape badge in center
  units.forEach((u) => {
    const sx = Math.round(u.x - u.sprite.length / 2);
    const sy = Math.round(u.y);
    g.text(sx, sy, u.sprite, u.color, 1, true);
    if (cols >= 50 && rows >= 16) {
      g.text(sx, sy - 1, u.kind, PALETTE.muted, 0.72);
    }
  });

  // Better Shapes 4-shape emblem on the central node
  g.set(cx - 1, cy + 1, "◕", PALETTE.red, 0.95);
  g.set(cx, cy + 1, "▲", PALETTE.blue, 0.95);
  g.set(cx + 1, cy + 1, "●", PALETTE.yellow, 0.95);
  g.set(cx + 2, cy + 1, "▛", PALETTE.green, 0.95);

  if (cols >= 52 && rows >= 18) {
    const hdr = "FLOCK // ROBOTICS MESH";
    g.text(cols - hdr.length - 2, 1, hdr, PALETTE.cyan, 0.85);
    g.text(2, rows - 2, "DRONES · HEXAPODS · HUMANOIDS · NODES", PALETTE.muted, 0.78);
  }
}

function drawScene(slug: string, g: GridBuf, t: number, compact: boolean) {
  g.clear();
  switch (slug) {
    case "shapesos":
      drawShapesOS(g, t, compact);
      break;
    case "periscope":
      drawPeriscope(g, t, compact);
      break;
    case "canary":
      drawCanary(g, t, compact);
      break;
    case "kiln":
      drawKiln(g, t, compact);
      break;
    case "ripple":
      drawRipple(g, t, compact);
      break;
    case "flock":
    case "field":
    default:
      drawFlock(g, t, compact);
      break;
  }
}

/**
 * Live ASCII motion canvas for each Better Shapes product. Scales cleanly from 28px command-palette
 * thumbnails up to full-screen lightbox views, pauses when off-screen, and respects reduced motion.
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

    let raf = 0;
    let visible = true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cellW = 8;
    let cellH = 14;
    let fontSize = 12;
    let compact = false;
    let grid = createGrid(32, 18);

    const measure = () => {
      const rect = wrap.getBoundingClientRect();
      width = Math.max(24, Math.floor(rect.width));
      height = Math.max(24, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      const minDim = Math.min(width, height);
      compact = minDim < 96;
      if (minDim < 52) {
        fontSize = 8.5;
      } else if (minDim < 96) {
        fontSize = 10;
      } else if (width < 360) {
        fontSize = 10.5;
      } else if (width < 640) {
        fontSize = 11.5;
      } else {
        fontSize = 13;
      }

      cellW = Math.max(5, Math.round(fontSize * 0.62));
      cellH = Math.max(8, Math.round(fontSize * 1.22));
      const cols = Math.max(7, Math.floor((width - 8) / cellW));
      const rows = Math.max(5, Math.floor((height - 8) / cellH));
      grid = createGrid(cols, rows);
    };

    const render = (nowMs: number) => {
      if (!width || !height) measure();
      const t = reduceMotion ? 4.2 : nowMs * 0.001;
      drawScene(slug, grid, t, compact);

      ctx.save();
      ctx.scale(dpr, dpr);

      // Dark terminal canvas background with subtle vignette
      ctx.fillStyle = PALETTE.bg;
      ctx.fillRect(0, 0, width, height);

      const ox = Math.floor((width - grid.cols * cellW) / 2);
      const oy = Math.floor((height - grid.rows * cellH) / 2);

      ctx.font = `500 ${fontSize}px ui-monospace, SFMono-Regular, "Geist Mono", Menlo, monospace`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      for (let r = 0; r < grid.rows; r++) {
        const py = oy + r * cellH + cellH * 0.5;
        for (let c = 0; c < grid.cols; c++) {
          const cell = grid.cells[r * grid.cols + c];
          if (cell.alpha <= 0.02 || cell.ch === " ") continue;
          const [cr, cg, cb] = cell.color;
          const px = ox + c * cellW + cellW * 0.5;
          if (cell.glow && !compact) {
            ctx.shadowColor = `rgba(${cr},${cg},${cb},0.55)`;
            ctx.shadowBlur = 7;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${cell.alpha.toFixed(3)})`;
          ctx.fillText(cell.ch, px, py);
        }
      }

      // Subtle scanline overlay on medium/large canvases
      if (!compact) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
        for (let y = 0; y < height; y += 3) {
          ctx.fillRect(0, y, width, 1);
        }
      }

      ctx.restore();

      if (!reduceMotion && visible) {
        raf = window.requestAnimationFrame(render);
      }
    };

    measure();
    render(performance.now());

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
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
