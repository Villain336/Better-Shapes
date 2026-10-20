import type { Capability, Tone } from "./content";

export type ProductStatus = "early-access" | "in-development" | "planned" | "exploring";

export const statusMeta: Record<ProductStatus, { label: string; tone: Tone }> = {
  "early-access": { label: "Launching Dec 1, 2026", tone: "blue" },
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
  /** What the product's 3D render depicts (renders in public/products, mirrored on the Figma "Product Brands" page). */
  meaning: string;
  /** Consumer tools for everyone, shown in their own section. */
  everyday?: boolean;
  /** Set false for commercial services (everything else is open source). */
  openSource?: boolean;
};

export const products: Product[] = [
  {
    slug: "shapesos",
    meaning: "Four glass layers around one titanium core: every part of the business on one system.",
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
    meaning: "A carabiner clipped to a glowing agent: real power, on a tether.",
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
    meaning: "Panes of frosted glass stacked in depth.",
    name: "Shapes UI",
    glyph: "Design",
    lane: "Design system",
    status: "in-development",
    tagline: "The calm interface system this site is built with.",
    description:
      "Hairline panels, quiet buttons, a tight type scale, soft motion and the four-shape mark, released as an open React and Tailwind component library with a matching Figma file.",
    alternativeTo: "paid UI kits and templates",
    audience: "Designers and developers who want calm, trustworthy interfaces",
    features: [
      "Surface, glass and ink panels with hairline borders",
      "Motion primitives: reveal, stagger, parallax hero",
      "Design tokens shared between code and Figma",
      "Accessible and reduced-motion aware by default",
    ],
    license: "MIT",
  },
  {
    slug: "beacon",
    meaning: "A lighthouse lens: making sure you can be seen.",
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
    meaning: "One beam of light, split into a spectrum.",
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
    meaning: "A voice, cast in glass as a waveform.",
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
    meaning: "A stack of index cards, with the right one lifted.",
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
    meaning: "A planet with a ring and a signal riding it.",
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
    meaning: "An anvil and hammer, with sparks.",
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
    slug: "fig-tree",
    meaning: "A pen nib on a design grid.",
    name: "Fig Tree",
    glyph: "Design",
    lane: "Interface design",
    status: "in-development",
    tagline: "Design on a canvas that speaks code, with an AI teammate.",
    description:
      "Full vector design on our own GPU renderer, where every frame is real CSS: flexbox, grid and typography that export as exact code. Sprout, an AI teammate with its own cursor, can guide you, edit alongside you and generate designs and assets.",
    alternativeTo: "Figma",
    audience: "Product designers, design engineers and teams",
    features: [
      "Own WebGPU renderer with shader fills",
      "Code-native canvas: flex and grid that export exactly",
      "Multiplayer, components and variables",
      "Sprout: an AI cursor that guides, edits and generates",
      "MCP server so agents can design with you",
    ],
    license: "AGPL-3.0",
    repo: "https://github.com/Villain336/Fig-tree",
  },
  {
    slug: "collage",
    meaning: "Cards fanned out, layered into something new.",
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
    meaning: "A brushstroke of paint frozen in mid-air.",
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
    slug: "snipper",
    meaning: "Scissors cutting through a film strip.",
    name: "Snipper",
    glyph: "Marketing",
    lane: "Video repurposing",
    status: "in-development",
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
    meaning: "A paper plane flying from phone to laptop.",
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
    meaning: "A record on a turntable.",
    name: "Hum",
    glyph: "Marketing",
    lane: "Music streaming",
    status: "planned",
    everyday: true,
    tagline: "Bring your playlists. Keep your music.",
    description:
      "Import your Spotify, Apple Music and YouTube Music playlists in one click. Hum matches every track to music you own, artists who upload directly, or a place to buy it, then streams it from your own server to every device. AI radio runs on your hardware.",
    alternativeTo: "Spotify",
    audience: "Music lovers with a library, and independent artists",
    features: [
      "Import playlists from Spotify, Apple Music and YouTube Music",
      "Playlist health: see what’s matched, missing, and where to buy it",
      "Stream your own library to phone, desktop and car",
      "Artist uploads with direct support and fair splits",
      "AI radio and playlists that run locally, lossless and offline",
    ],
    license: "AGPL-3.0",
  },
  {
    slug: "matinee",
    meaning: "A home theater, ready for movie night.",
    name: "Matinee",
    glyph: "Design",
    lane: "Media center",
    status: "planned",
    everyday: true,
    tagline: "A media center like Kodi, with AI built in.",
    description:
      "One beautiful home for movies, shows and live TV from every source you have: your files and NAS, TV tuners, and the services you subscribe to. Bring your watchlists and history, then search by describing a scene.",
    alternativeTo: "Kodi, Plex and Netflix-style apps",
    audience: "Families, film collectors and independent filmmakers",
    features: [
      "Import watchlists and history from Netflix, Trakt, Letterboxd and IMDb",
      "Kodi-style add-ons for your files, NAS, tuners and subscriptions",
      "AI search: “the heist movie with the train”",
      "AI subtitles, translation, chapters and dialogue boost",
      "Profiles, watch-together and apps for TV, phone and web",
    ],
    license: "AGPL-3.0",
  },
  {
    slug: "keepsake",
    meaning: "A stack of instant photos.",
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
    meaning: "A camera, ready for the call.",
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
    meaning: "A key and a hardware security key on one ring.",
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
  {
    slug: "daydream",
    meaning: "A projector whose beam turns into clouds: stories, dreamed up.",
    name: "Daydream",
    glyph: "Design",
    lane: "AI movies & series",
    status: "planned",
    everyday: true,
    openSource: false,
    tagline: "Movies and series made with AI, free to watch.",
    description:
      "A streaming service of AI-made movies and series, free with ads. Plus adds ad-free viewing and credits for episodes generated just for you. Creators can apply to publish their own series, and we launch with three originals.",
    audience: "Viewers who want something new, and creators making AI series",
    features: [
      "Free catalog of originals and creator series, with ads",
      "Plus: ad-free, plus personalized episodes on demand",
      "Creator program with revenue share by watch time",
      "Every title labeled AI-made, with content credentials",
      "Three Better Shapes originals from day one",
    ],
    license: "Commercial service (creator tools open source)",
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
