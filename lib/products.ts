import type { Capability, Tone } from "./content";

export type ProductStatus = "early-access" | "in-development" | "planned" | "exploring";

export const statusMeta: Record<ProductStatus, { label: string; tone: Tone }> = {
  "early-access": { label: "Launching Dec 1, 2026", tone: "blue" },
  "in-development": { label: "In development", tone: "green" },
  planned: { label: "Planned", tone: "yellow" },
  exploring: { label: "Exploring in Labs", tone: "red" },
};

export type Product = {
  slug: string;
  name: string;
  /** Which logo shape / brand color represents it. */
  glyph: Capability;
  lane: string;
  status: ProductStatus;
  tagline: string;
  description: string;
  /** Who it's for. */
  audience: string;
  features: string[];
  license: string;
  /** Only set once the repository is public. */
  repo?: string;
  /** What the product's render depicts (renders live in public/products). */
  meaning: string;
  /** Set false for commercial services (everything else is open source). */
  openSource?: boolean;
  /** Shown on the product page as "How it fits". */
  fit: string;
};

export const products: Product[] = [
  {
    slug: "shapesos",
    meaning: "Grow, Design, Operate and Agents routing every action into one Approvals Inbox.",
    name: "ShapesOS",
    glyph: "Tech",
    lane: "Agentic business OS",
    status: "early-access",
    tagline: "Grow, design and operate a business from one workspace.",
    description:
      "The open-source agentic business OS. Agents propose, people approve: every action that touches money, customers or the outside world goes through an approval. Self-host it free with your own keys, or use the hosted version. Launching December 1, 2026.",
    audience: "Founders, small teams and agencies running a whole business",
    features: [
      "Grow: CRM, nurture, SEO, social, ads and attribution",
      "Design: Studio canvas, clips, voice and CAD viewer",
      "Operate: docs, files, e-sign, legal, funding and invoicing",
      "Agents: one approvals inbox, missions, playbooks and an MCP server",
      "Self-host in under 10 minutes, no API keys needed to start",
    ],
    license: "AGPL-3.0 (open core)",
    fit: "ShapesOS is the workspace the others plug into: Periscope gives its agents eyes, Canary guards its secrets, Kiln trains its models, Ripple streams from it and Flock will fly for it.",
  },
  {
    slug: "periscope",
    meaning: "A cybernetic periscope scanning live interfaces into structured accessibility trees while an operator watches the same feed.",
    name: "Periscope",
    glyph: "Tech",
    lane: "Agent infrastructure",
    status: "in-development",
    tagline: "Eyes for agents. A viewing MCP server and API.",
    description:
      "Periscope gives any agent a way to look: render a web page, document, dashboard or live app session into screenshots, accessibility trees and plain-language observations, over MCP or a REST API. People can watch the same view the agent sees, so nothing happens in the dark.",
    audience: "Teams building agents that need to read screens, sites and documents",
    features: [
      "MCP server and REST API with the same primitives: open, look, find, describe",
      "Web pages, PDFs, dashboards and desktop sessions rendered to pixels and structure",
      "Element-level descriptions, so agents reason about what’s there, not just coordinates",
      "Live viewer and replay: watch what an agent saw, step by step",
      "Per-key rate limits, allow-lists and an audit log of every view",
    ],
    license: "MIT",
    fit: "Periscope is the sensing layer the rest of the lineup assumes exists: ShapesOS agents look through it, Kiln uses it to collect screens for labeling, and Flock streams its map through it.",
  },
  {
    slug: "canary",
    meaning: "A poisoned golden decoy key short-circuiting and destroying rogue hacker bots the moment they touch it.",
    name: "Canary",
    glyph: "Tech",
    lane: "Security",
    status: "in-development",
    tagline: "Decoy keys that sing the moment someone uses them.",
    description:
      "Canary plants realistic but useless API keys, tokens and credentials throughout your repos, environment files, CI, wikis and agent prompts. The first time anyone, or any model, tries to use one, you get an alert with where it came from.",
    audience: "Engineering and security teams, and anyone letting agents near their secrets",
    features: [
      "Generates keys in the real formats of AWS, Stripe, GitHub, Slack, OpenAI and more",
      "Injects via CLI, GitHub Action, SDK or a pre-commit hook",
      "Alerts carry the source IP, user agent, the decoy’s location and what was attempted",
      "Agent mode: seed prompts and tool outputs to catch exfiltration by models",
      "Rotate, retire and re-seed on a schedule",
    ],
    license: "MIT",
    fit: "Canary is how we test the rest of our own stack. Every Better Shapes repo ships with canaries in it.",
  },
  {
    slug: "kiln",
    meaning: "A small lab team conjuring a neural core out of labeled data on their own hardware.",
    name: "Kiln",
    glyph: "Tech",
    lane: "Data & model platform",
    status: "planned",
    tagline: "Label data, train models, keep the weights.",
    description:
      "A data labeling and model training platform you can run yourself. Queue up images, text, audio and screen recordings for labeling with AI pre-labels and human consensus, version the dataset, then fine-tune and evaluate on your own GPUs or rented ones. The weights are yours.",
    audience: "ML teams, research groups and companies with data they can’t send away",
    features: [
      "Labeling queues with AI pre-labels, consensus and reviewer roles",
      "Versioned datasets with lineage back to every label and labeler",
      "Fine-tuning runs for vision, language and audio models on your hardware or rented GPUs",
      "Eval suites and regression checks before anything ships",
      "Export weights, datasets and reports in open formats",
    ],
    license: "AGPL-3.0",
    fit: "Kiln is where the models behind Periscope and Flock get trained, and where client projects that need a custom model start.",
  },
  {
    slug: "ripple",
    meaning: "One creator linked through a self-hosted Better Shapes Ripple screen to millions of viewers across the city.",
    name: "Ripple",
    glyph: "Marketing",
    lane: "Live & on-demand video",
    status: "planned",
    tagline: "An open-source streaming platform you can own.",
    description:
      "Go live from a phone, a camera or OBS, and reach viewers in the browser with sub-second latency. Ripple handles ingest, transcoding, playback, chat, clips and the library afterward, on your servers, with no platform taking a cut.",
    audience: "Creators, communities, schools and companies that want their own channel",
    features: [
      "RTMP, SRT and WHIP ingest; LL-HLS and WebRTC playback",
      "Chat, reactions, moderation and clipping built in",
      "Automatic VOD library with chapters, captions and search",
      "Creator pages, memberships and tipping with your own payment processor",
      "Single-binary self-host or scale out with a CDN",
    ],
    license: "AGPL-3.0",
    fit: "Ripple grows out of the live tooling we built for client launches. It’s also how Labs streams its field tests.",
  },
  {
    slug: "flock",
    meaning: "Drones, hexapods, humanoids and relay nodes with Better Shapes branding linked over a peer-to-peer mesh.",
    name: "Flock",
    glyph: "Robotics",
    lane: "Drone mesh OS",
    status: "exploring",
    tagline: "One operating system for many drones, with no single point of failure.",
    description:
      "Flock is an open operating system for fleets of small drones that talk to each other over a mesh. Shared map, shared tasks, graceful failover when one craft drops out, and strict geofences and approvals for anything that moves. It’s a Labs project: research, not a release.",
    audience: "Robotics researchers, agricultural and inspection teams, and makers",
    features: [
      "Peer-to-peer mesh networking between craft, with no base station required",
      "Shared world map and task allocation that re-plans when a drone leaves",
      "Geofences, altitude limits and human approvals for anything risky",
      "Built on open foundations: ROS 2, PX4 and MAVLink",
      "Simulator-first: fly a fleet on a laptop before anything takes off",
    ],
    license: "Apache-2.0",
    fit: "Flock is why Labs exists. Everything we learn about calm, legible machines starts here.",
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

/** The product featured on Home and at the top of /products. */
export const flagship = products[0];

/** ShapesOS launch: midnight US Eastern (EST, UTC-5) on Dec 1, 2026. */
export const shapesOSLaunch = { at: "2026-12-01T00:00:00-05:00", label: "Dec 1, 2026", slug: "shapesos" };
