export type Tone = "red" | "blue" | "yellow" | "green";
export type Capability = "Tech" | "Design" | "Robotics" | "Marketing";

/** Prefix for static files when the site is served from a sub-path (GitHub Pages). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

export const art = {
  home: asset("/art/home-poppies.webp"),
  work: asset("/art/work-lavender.webp"),
  pricing: asset("/art/pricing-cosmos.webp"),
  blog: asset("/art/blog-tulips.webp"),
  about: asset("/art/about-peonies.webp"),
  products: asset("/art/products-ranunculus.webp"),
  labs: asset("/art/labs-anemones.webp"),
  sign: asset("/brand/sign.webp"),
};

export const toneFor: Record<Capability, Tone> = {
  Tech: "blue",
  Design: "red",
  Robotics: "yellow",
  Marketing: "green",
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Products", href: "/products" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export const capabilities: { name: Capability; blurb: string; points: string[]; exploring?: boolean }[] = [
  {
    name: "Tech",
    blurb: "Web apps, platforms & AI integrations engineered to scale.",
    points: ["Next.js & native apps", "AI agents & automation", "Cloud & data platforms"],
  },
  {
    name: "Design",
    blurb: "Brand identities, product UI and websites people remember.",
    points: ["Brand systems", "Product & UX design", "Marketing sites"],
  },
  {
    name: "Robotics",
    blurb: "Physical automation and intelligence. A venture we’re exploring in Labs with Flock, our drone mesh OS; nothing released yet.",
    points: ["Flock: drone mesh OS", "Physical AI research", "Join the interest list"],
    exploring: true,
  },
  {
    name: "Marketing",
    blurb: "Growth strategy, content and campaigns that compound.",
    points: ["Positioning & launch", "Content engines", "Performance & SEO"],
  },
];

/** The kinds of requests members add to their board. Shown as a slow ticker under the hero. */
export const requestables: { text: string; tone: Tone }[] = [
  { text: "Brand identity", tone: "red" },
  { text: "Marketing site", tone: "red" },
  { text: "Product UI", tone: "red" },
  { text: "Design system", tone: "red" },
  { text: "Next.js app", tone: "blue" },
  { text: "AI agent", tone: "blue" },
  { text: "Automation", tone: "blue" },
  { text: "Data platform", tone: "blue" },
  { text: "Launch campaign", tone: "green" },
  { text: "Content engine", tone: "green" },
  { text: "SEO & performance", tone: "green" },
  { text: "Pitch deck", tone: "green" },
];

export const steps = [
  {
    n: "01",
    title: "Subscribe",
    body: "Pick a membership. No contracts, no proposals, no 40-page decks.",
    tone: "blue" as Tone,
  },
  {
    n: "02",
    title: "Request",
    body: "Add anything to your board — a brand, an app, an AI agent, a launch.",
    tone: "red" as Tone,
  },
  {
    n: "03",
    title: "Receive",
    body: "Get polished work in days, iterate until it feels exactly right.",
    tone: "green" as Tone,
  },
];

export type Project = {
  title: string;
  subtitle: string;
  image: string;
  tags: Capability[];
  status: string;
  href: string;
};

/** Work we can show today: our own products. Client work gets added here as it ships. */
export const projects: Project[] = [
  {
    title: "ShapesOS",
    subtitle: "The open-source agentic business OS",
    image: asset("/products/shapesos.webp"),
    tags: ["Tech", "Design"],
    status: "Launching Dec 1, 2026",
    href: "/products/shapesos",
  },
  {
    title: "Periscope",
    subtitle: "A viewing MCP server and API that gives agents eyes",
    image: asset("/products/periscope.webp"),
    tags: ["Tech", "Design"],
    status: "In development",
    href: "/products/periscope",
  },
  {
    title: "Canary",
    subtitle: "Decoy keys that alert you the moment they’re used",
    image: asset("/products/canary.webp"),
    tags: ["Tech"],
    status: "In development",
    href: "/products/canary",
  },
  {
    title: "Kiln",
    subtitle: "Label data and train models on hardware you control",
    image: asset("/products/kiln.webp"),
    tags: ["Tech", "Design"],
    status: "Planned",
    href: "/products/kiln",
  },
  {
    title: "Ripple",
    subtitle: "An open-source live and on-demand streaming platform",
    image: asset("/products/ripple.webp"),
    tags: ["Marketing", "Tech"],
    status: "Planned",
    href: "/products/ripple",
  },
  {
    title: "Flock",
    subtitle: "A mesh operating system for fleets of small drones",
    image: asset("/products/flock.webp"),
    tags: ["Robotics", "Tech"],
    status: "Exploring in Labs",
    href: "/products/flock",
  },
];



export const plans = [
  {
    name: "Standard",
    price: "$4,995",
    description: "One request at a time. Pause or cancel anytime.",
    features: [
      "One request at a time",
      "Avg. 72-hour delivery",
      "Unlimited brands & users",
      "Webflow / Next.js builds",
      "Pause or cancel anytime",
    ],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Pro Membership",
    price: "$7,495",
    description: "Double the output. Design, tech, AI & growth in one team.",
    features: [
      "Two requests at a time",
      "Avg. 48-hour delivery",
      "AI agents & automations",
      "Growth marketing sprints",
      "Dedicated Slack channel",
    ],
    cta: "Join Pro",
    featured: true,
  },
];

export const benefits: { title: string; body: string; tone: Tone }[] = [
  { title: "Request board", body: "Add as many requests as you like. We work through them in order.", tone: "blue" },
  { title: "Fixed monthly rate", body: "No surprises, no hourly billing. Pay the same every month.", tone: "red" },
  { title: "Fast delivery", body: "Most requests land in 2–3 business days.", tone: "yellow" },
  { title: "Top-tier talent", body: "Senior designers, engineers and AI specialists only.", tone: "green" },
  { title: "Flexible & scalable", body: "Scale up, down, or pause whenever your roadmap shifts.", tone: "blue" },
  { title: "Yours, forever", body: "Every file, repo and design file is 100% yours.", tone: "red" },
];

export const faqs = [
  {
    q: "How does the membership work?",
    a: "Subscribe, add requests to your board, and we deliver one at a time — usually within 72 hours. Pause whenever you like and pick up exactly where you left off.",
  },
  {
    q: "Why not just hire full-time?",
    a: "A senior designer, engineer and marketer cost well over $400k a year combined. With Better Shapes you get all three disciplines — plus AI agents — for a flat monthly fee, and you only pay while you need us.",
  },
  {
    q: "What if I don’t like the work?",
    a: "We keep revising until you love it. Most requests take one or two rounds; nothing is ‘done’ until it feels right to you.",
  },
  {
    q: "Do you build robots?",
    a: "Not yet. Robotics and physical AI are a venture we’re exploring in Labs, where we’re researching Flock, a mesh operating system for small drones. Nothing has been released. Join the interest list on the Labs page to hear first.",
  },
  {
    q: "How fast will I receive my work?",
    a: "Most requests are delivered in two to three business days. Larger requests are broken into smaller pieces so you always see progress.",
  },
];

/** Essays. The bodies live in lib/essays.ts, keyed by slug. */
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: Capability;
  image: string;
  /** ISO date of publication. */
  date: string;
  /** Reading time in minutes. */
  minutes: number;
};

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export const featuredPost: Post = {
  slug: "calm-technology",
  date: "2026-10-06",
  minutes: 6,
  title: "Calm technology: why the best products feel like a walk outside",
  excerpt:
    "Attention is the scarcest resource your customers have. Here’s how we design products that respect it.",
  category: "Design",
  image: art.home,
};

export const posts: Post[] = [
  {
    slug: "calm-machines",
    date: "2026-09-22",
    minutes: 5,
    title: "What calm design could mean for machines",
    excerpt: "Notes from Labs: the interface lessons we’d bring to robots in homes and workplaces.",
    category: "Robotics",
    image: art.blog,
  },
  {
    slug: "brand-is-a-promise",
    date: "2026-09-08",
    minutes: 5,
    title: "A brand is a promise you keep in public",
    excerpt: "Logos are easy. Consistency is the hard, valuable part — and it’s mostly operations.",
    category: "Design",
    image: art.work,
  },
  {
    slug: "growth-loops",
    date: "2026-08-25",
    minutes: 5,
    title: "Growth loops beat growth hacks",
    excerpt: "Why the compounding channels are the boring ones — and how to build them on purpose.",
    category: "Marketing",
    image: art.pricing,
  },
  {
    slug: "ai-copilots",
    date: "2026-08-11",
    minutes: 6,
    title: "Shipping an AI copilot people keep using",
    excerpt: "The patterns that turn a flashy demo into something people open every day.",
    category: "Tech",
    image: art.about,
  },
  {
    slug: "prototype-fast",
    date: "2026-07-28",
    minutes: 4,
    title: "Prototype in cardboard before you prototype in code",
    excerpt: "The cheapest, fastest way to find out whether your idea has a shape.",
    category: "Robotics",
    image: art.sign,
  },
  {
    slug: "one-calm-team",
    date: "2026-07-14",
    minutes: 5,
    title: "Why we put design, code and AI in one room",
    excerpt: "Handoffs are where good ideas go to die. Here’s how we work without them.",
    category: "Tech",
    image: art.home,
  },
];

export const values: { title: string; body: string; tone: Tone }[] = [
  { title: "Calm over chaos", body: "Clear plans, honest timelines, no drama.", tone: "blue" },
  { title: "Craft is a promise", body: "Details are how trust is built.", tone: "red" },
  { title: "Build what matters", body: "Fewer, better things that actually ship.", tone: "yellow" },
  { title: "Grow together", body: "Long partnerships beat quick wins.", tone: "green" },
];


