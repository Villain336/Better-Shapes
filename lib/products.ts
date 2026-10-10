import type { Capability, Tone } from "./content";

export type ProductStatus = "early-access" | "in-development" | "planned" | "exploring";

export const statusMeta: Record<ProductStatus, { label: string; tone: Tone }> = {
  "early-access": { label: "Early access · 2027", tone: "blue" },
  "in-development": { label: "In development", tone: "green" },
  planned: { label: "Planned", tone: "yellow" },
  exploring: { label: "Exploring", tone: "red" },
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
  /** Clean-room open-source alternative to these (described, never copied). */
  alternativeTo?: string;
  audience: string;
  features: string[];
  license: string;
  /** Only set once the repository is public. */
  repo?: string;
  /** Brand tint behind the product mark, and what the mark means (Figma "Product Brands" page). */
  tint: string;
  meaning: string;
};

export const products: Product[] = [
  {
    slug: "shapesos",
    tint: "#e6e2d9",
    meaning: "Every shape of the business in one window.",
    name: "ShapesOS",
    glyph: "Tech",
    lane: "Agentic business OS",
    status: "early-access",
    tagline: "Grow, design and operate a business from one workspace.",
    description:
      "The open-source agentic business OS. Agents propose, people approve: every action that touches money, customers or the outside world goes through an approval. Self-host it free with your own keys, or use the hosted version.",
    alternativeTo: "a stack of CRM, design, automation and ops tools",
    audience: "Founders, small teams and agencies running a whole business",
    features: [
      "Grow: CRM, nurture, SEO, social, ads and attribution",
      "Design: Studio canvas, clips, voice and CAD viewer",
      "Operate: docs, files, e-sign, legal, funding and invoicing",
      "Agents: one approvals inbox, missions, playbooks and an MCP server",
      "Self-host in under 10 minutes, no API keys needed to start",
    ],
    license: "AGPL-3.0 (open core)",
  },
  {
    slug: "leash",
    tint: "#dee5fb",
    meaning: "An agent, tethered to an approval.",
    name: "Leash",
    glyph: "Tech",
    lane: "Agent infrastructure",
    status: "in-development",
    tagline: "Build AI agents that ask before they act.",
    description:
      "A TypeScript toolkit for agents with guardrails built in: tools carry a risk level, risky calls wait in an approval queue, spend has hard caps, and every step lands in a tamper-evident audit log.",
    alternativeTo: "agent frameworks without human-in-the-loop controls",
    audience: "Developers shipping agents into real businesses",
    features: [
      "Risk-rated tools with automatic approval gates",
      "Spend caps per run, per agent and per workspace",
      "Hash-chained audit log you can verify",
      "Works with MCP tools and any model provider",
    ],
    license: "MIT",
  },
  {
    slug: "shapes-ui",
    tint: "#ece6fa",
    meaning: "Layered glass, one calm system.",
    name: "Shapes UI",
    glyph: "Design",
    lane: "Design system",
    status: "in-development",
    tagline: "The calm glass interface this site is built with.",
    description:
      "Frosted glass cards, pill buttons, soft motion and the five-color shape mark, released as an open React and Tailwind component library with a matching Figma file.",
    alternativeTo: "paid UI kits and templates",
    audience: "Designers and developers who want calm, trustworthy interfaces",
    features: [
      "Glass, ink and gradient-rim surfaces",
      "Motion primitives: reveal, stagger, parallax hero",
      "Design tokens shared between code and Figma",
      "Accessible and reduced-motion aware by default",
    ],
    license: "MIT",
  },
  {
    slug: "beacon",
    tint: "#fdf5d3",
    meaning: "A light that shows where you’re seen.",
    name: "Beacon",
    glyph: "Marketing",
    lane: "AI visibility",
    status: "in-development",
    tagline: "See how AI assistants talk about your brand.",
    description:
      "Ask the major AI assistants the questions your customers ask, then see who they recommend, what they say about you and what to fix. Works in demo mode with no keys.",
    alternativeTo: "paid AI-search visibility trackers",
    audience: "Marketers and founders who need to show up in AI answers",
    features: [
      "Brand mentions and rank across several AI models",
      "Sentiment and competitor share of voice",
      "Concrete content suggestions to close gaps",
      "Scheduled re-checks and history",
    ],
    license: "AGPL-3.0",
  },
  {
    slug: "concierge",
    tint: "#fbe3de",
    meaning: "A conversation that gets things done.",
    name: "Concierge",
    glyph: "Tech",
    lane: "AI customer agent",
    status: "planned",
    tagline: "An AI support agent that can actually do things.",
    description:
      "Answers from your docs, takes real actions like refunds and bookings behind approvals, and hands off to a person with full context. The kind of agent that today costs tens of thousands a year.",
    alternativeTo: "Sierra, Decagon and Intercom Fin",
    audience: "Support and CX teams",
    features: [
      "Grounded answers with citations",
      "Actions through Leash approvals",
      "Human handoff with the whole conversation",
      "Resolution analytics",
    ],
    license: "AGPL-3.0",
  },
  {
    slug: "prism",
    tint: "#dee5fb",
    meaning: "One input, split into every insight.",
    name: "Prism",
    glyph: "Marketing",
    lane: "GTM data & research",
    status: "planned",
    tagline: "A spreadsheet where every cell can research.",
    description:
      "Enrich companies and people, run AI research agents across rows, and score and route leads, with your own data sources instead of locked credits.",
    alternativeTo: "Clay",
    audience: "Growth, sales and RevOps teams",
    features: [
      "Waterfall enrichment across providers you choose",
      "AI research columns with sources",
      "Scoring, dedupe and CRM sync",
      "Bring your own keys, no credit lock-in",
    ],
    license: "AGPL-3.0",
  },
  {
    slug: "echo",
    tint: "#ddf2e5",
    meaning: "Every call, heard again and understood.",
    name: "Echo",
    glyph: "Marketing",
    lane: "Revenue intelligence",
    status: "planned",
    tagline: "Every sales call, understood.",
    description:
      "Record, transcribe and analyze calls; get deal risks, coaching moments and follow-ups drafted for you. Self-hosted, so recordings stay yours.",
    alternativeTo: "Gong and Chorus",
    audience: "Sales teams and founders who sell",
    features: [
      "Call recording and transcripts",
      "Deal risk and talk-ratio insights",
      "Drafted follow-ups and CRM notes",
      "Private by default, self-hostable",
    ],
    license: "AGPL-3.0",
  },
  {
    slug: "recall",
    tint: "#dee5fb",
    meaning: "Find what your company already knows.",
    name: "Recall",
    glyph: "Tech",
    lane: "Company search",
    status: "planned",
    tagline: "Ask your company anything.",
    description:
      "One calm search box and assistant across your docs, chat, tickets and code, respecting everyone’s permissions.",
    alternativeTo: "Glean",
    audience: "Teams drowning in tools",
    features: [
      "Connectors for docs, chat and code",
      "Permission-aware answers with sources",
      "Assistant with Leash-gated actions",
      "Runs on your infrastructure",
    ],
    license: "AGPL-3.0",
  },
  {
    slug: "orbit",
    tint: "#ddf2e5",
    meaning: "Ads that circle back to what works.",
    name: "Orbit",
    glyph: "Marketing",
    lane: "Automated ads",
    status: "planned",
    tagline: "Ads that build, test and rebalance themselves.",
    description:
      "Generate creative, launch tests across ad platforms and shift budget toward what works, with every spend change proposed by agents and approved by you.",
    alternativeTo: "Smartly, Madgicx and AdCreative",
    audience: "Performance marketers and growing brands",
    features: [
      "AI creative variations from your brand kit",
      "Cross-platform test launcher",
      "Budget rebalancing proposals with approvals",
      "Attribution that includes offline channels",
    ],
    license: "AGPL-3.0",
  },
  {
    slug: "forge",
    tint: "#e6e2d9",
    meaning: "Code, with a spark of help.",
    name: "Forge",
    glyph: "Tech",
    lane: "AI code editor",
    status: "planned",
    tagline: "An AI-native editor you can own.",
    description:
      "Built on the open-source core of VS Code, with agents that plan, edit and test across your repo, using any model, local or hosted.",
    alternativeTo: "Cursor",
    audience: "Developers",
    features: [
      "Repo-wide agent edits with diffs to approve",
      "Bring any model, including local ones",
      "Runs tests and fixes failures",
      "Extensions from the open VS Code ecosystem",
    ],
    license: "MIT",
  },
  {
    slug: "frame",
    tint: "#fbe3de",
    meaning: "Crop marks around an idea.",
    name: "Frame",
    glyph: "Design",
    lane: "Interface design",
    status: "planned",
    tagline: "Collaborative design with AI as a teammate.",
    description:
      "Real-time vector design, components and prototyping in the browser, with AI that drafts layouts from a sentence and hands off clean code.",
    alternativeTo: "Figma",
    audience: "Product designers and teams",
    features: [
      "Multiplayer vector canvas",
      "Components, variables and auto layout",
      "AI layout drafts and design-to-code",
      "Self-hostable files",
    ],
    license: "AGPL-3.0",
  },
  {
    slug: "collage",
    tint: "#fdf5d3",
    meaning: "Shapes layered into something new.",
    name: "Collage",
    glyph: "Design",
    lane: "Everyday design",
    status: "planned",
    tagline: "Beautiful graphics for everyone, on brand.",
    description:
      "Templates, brand kits and AI generation for social posts, decks and print. Grows out of the ShapesOS Studio editor.",
    alternativeTo: "Canva",
    audience: "Marketers, creators and small businesses",
    features: [
      "Template library and brand kits",
      "AI generate, resize and batch fill",
      "Share, comment and approve",
      "Export for every platform",
    ],
    license: "AGPL-3.0",
  },
  {
    slug: "atelier",
    tint: "#ece6fa",
    meaning: "A single drop of paint.",
    name: "Atelier",
    glyph: "Design",
    lane: "Creative studio",
    status: "planned",
    tagline: "Pro photo and vector editing with generative tools.",
    description:
      "Layers, masks and vectors with AI fill, expand and cleanup, using open image models you can run yourself.",
    alternativeTo: "Adobe Photoshop and Illustrator generative tools",
    audience: "Designers, photographers and studios",
    features: [
      "Layers, masks and non-destructive edits",
      "Generative fill, expand and remove",
      "Vector tools and image tracing",
      "Local or hosted models",
    ],
    license: "AGPL-3.0",
  },
  {
    slug: "snip",
    tint: "#fbe3de",
    meaning: "The play button, cut to the best part.",
    name: "Snip",
    glyph: "Marketing",
    lane: "Video repurposing",
    status: "planned",
    tagline: "Long videos in, scroll-stopping clips out.",
    description:
      "Finds the best moments in podcasts and talks, reframes them vertically, adds captions and drafts posts, for your approval. Grows out of ShapesOS Clips.",
    alternativeTo: "OpusClip",
    audience: "Creators, podcasters and marketing teams",
    features: [
      "Highlight detection with virality scoring",
      "Auto reframe and animated captions",
      "Brand templates",
      "Draft-for-approval publishing",
    ],
    license: "AGPL-3.0",
  },
  {
    slug: "fab",
    tint: "#ddf2e5",
    meaning: "Three faces of a part you can make.",
    name: "Fab",
    glyph: "Robotics",
    lane: "AI-native CAD",
    status: "planned",
    tagline: "Describe a part. Get a model you can make.",
    description:
      "Parametric CAD in the browser with an AI design assistant, version history and export for printing and machining. Grows out of the ShapesOS CAD module and bridges to the physical world.",
    alternativeTo: "SolidWorks and Fusion",
    audience: "Engineers, makers and hardware startups",
    features: [
      "Parametric modeling in the browser",
      "AI design assistant",
      "Versioning and review",
      "STEP, STL and 3MF export",
    ],
    license: "AGPL-3.0",
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
