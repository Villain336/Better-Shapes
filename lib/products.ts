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
  /** What the product's logo means (logos live in lib/marks.ts and the Figma "Product Brands" page). */
  meaning: string;
  /** Consumer tools for everyone, shown in their own section. */
  everyday?: boolean;
};

export const products: Product[] = [
  {
    slug: "shapesos",
    meaning: "Four petals from one center: every part of the business, growing together.",
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
    meaning: "A leash looped around a hand, holding the agent at the other end.",
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
    meaning: "Three panes of glass, with one clear interface in front.",
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
    meaning: "A lighthouse: making sure you can be seen.",
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
    meaning: "A service bell. Ring once and it gets handled.",
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
    meaning: "A gem splitting one beam into many.",
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
    meaning: "A voice, captured as a waveform.",
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
    meaning: "An open book with a spark: what you already know, found.",
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
    meaning: "A trend line breaking out of its loop.",
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
    meaning: "An anvil, with a spark of help.",
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
    meaning: "A pen nib, where every design starts.",
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
    meaning: "Snapshots, layered into something new.",
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
    meaning: "One confident brush stroke.",
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
    meaning: "Scissors: cut to the best part.",
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
    meaning: "A part being printed, layer by layer.",
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
  {
    slug: "toss",
    meaning: "A paper plane, tossed to the device next to you.",
    name: "Toss",
    glyph: "Tech",
    lane: "File sharing",
    status: "planned",
    everyday: true,
    tagline: "Send anything to the device next to you.",
    description:
      "Drop files, photos and links between phones and computers on any operating system, over your own network, end-to-end encrypted, with no account.",
    alternativeTo: "AirDrop and Quick Share",
    audience: "Anyone with more than one kind of device",
    features: [
      "Works across iPhone, Android, Mac, Windows and Linux",
      "Peer-to-peer on your local network, no cloud upload",
      "End-to-end encrypted with a visible device check",
      "Folders, clipboard and links, not just files",
    ],
    license: "MIT",
  },
  {
    slug: "hum",
    meaning: "A record with a melody running across it.",
    name: "Hum",
    glyph: "Marketing",
    lane: "Music streaming",
    status: "planned",
    everyday: true,
    tagline: "Your music, streamed beautifully, everywhere.",
    description:
      "Stream the music you own from your own server to every device, and give independent artists a place to upload and earn directly. AI playlists and radio run on your hardware, not someone else’s.",
    alternativeTo: "Spotify",
    audience: "Music lovers with a library, and independent artists",
    features: [
      "Stream your own library to phone, desktop and car",
      "Artist uploads with direct support and fair splits",
      "AI radio and playlists that run locally",
      "Offline downloads and lossless playback",
    ],
    license: "AGPL-3.0",
  },
  {
    slug: "matinee",
    meaning: "An admit-one ticket with a gold star.",
    name: "Matinee",
    glyph: "Design",
    lane: "Video streaming",
    status: "planned",
    everyday: true,
    tagline: "Your own streaming service.",
    description:
      "A cinematic home for the movies and shows you own or have the rights to: rich library pages, profiles, downloads, watch-together and AI recommendations, running on your own server.",
    alternativeTo: "Netflix-style streaming apps and Plex",
    audience: "Families, film collectors and independent filmmakers",
    features: [
      "Beautiful library with automatic artwork and details",
      "Profiles, parental controls and watch history",
      "Watch together in sync with friends",
      "Apps for TV, phone and web",
    ],
    license: "AGPL-3.0",
  },
  {
    slug: "keepsake",
    meaning: "A sunset over the hills: the moments worth keeping.",
    name: "Keepsake",
    glyph: "Design",
    lane: "Photos",
    status: "planned",
    everyday: true,
    tagline: "Every photo you’ve taken, safe and searchable.",
    description:
      "Back up your photos and videos to storage you control, then find any moment by describing it. Faces, places and memories are worked out on your own server.",
    alternativeTo: "Google Photos and iCloud Photos",
    audience: "Families and anyone with years of photos",
    features: [
      "Automatic phone backup",
      "Search by description, face or place",
      "Shared albums and memories",
      "Private by default, your storage",
    ],
    license: "AGPL-3.0",
  },
  {
    slug: "huddle",
    meaning: "A camera with two people in frame.",
    name: "Huddle",
    glyph: "Tech",
    lane: "Video calls",
    status: "planned",
    everyday: true,
    tagline: "Calm video calls with notes that write themselves.",
    description:
      "Meetings in the browser with no download, AI notes and action items afterward, and recordings that stay on your server.",
    alternativeTo: "Zoom",
    audience: "Teams, classrooms and families",
    features: [
      "Browser-based calls, no install",
      "AI summaries and action items",
      "Recording and transcripts you own",
      "Waiting rooms, breakouts and screen sharing",
    ],
    license: "AGPL-3.0",
  },
  {
    slug: "keyring",
    meaning: "A key on a ring.",
    name: "Keyring",
    glyph: "Tech",
    lane: "Passwords",
    status: "planned",
    everyday: true,
    tagline: "Every password and passkey, in one safe place.",
    description:
      "An end-to-end encrypted vault for passwords, passkeys and secrets, shared safely with family or a team, with autofill everywhere.",
    alternativeTo: "1Password",
    audience: "Families and teams",
    features: [
      "Passwords, passkeys, cards and secure notes",
      "Zero-knowledge encryption",
      "Family and team sharing",
      "Autofill in every browser and phone",
    ],
    license: "AGPL-3.0",
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
