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
    blurb: "Physical automation and intelligence. A venture we’re exploring in Labs; nothing released yet.",
    points: ["Research in Labs", "Physical AI", "Join the interest list"],
    exploring: true,
  },
  {
    name: "Marketing",
    blurb: "Growth strategy, content and campaigns that compound.",
    points: ["Positioning & launch", "Content engines", "Performance & SEO"],
  },
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
  year: string;
};

export const projects: Project[] = [
  {
    title: "Bloom Labs",
    subtitle: "Identity, site & analytics dashboard",
    image: art.work,
    tags: ["Design", "Tech"],
    year: "2026",
  },
  {
    title: "Skyline AI",
    subtitle: "Product design for an LLM copilot",
    image: art.home,
    tags: ["Tech", "Design"],
    year: "2026",
  },
  {
    title: "Petal Commerce",
    subtitle: "Shopify rebuild, +38% conversion",
    image: art.pricing,
    tags: ["Tech", "Marketing"],
    year: "2025",
  },
  {
    title: "Northfield",
    subtitle: "Brand, launch & growth engine",
    image: art.about,
    tags: ["Marketing", "Design"],
    year: "2025",
  },
  {
    title: "Pollen Health",
    subtitle: "Brand system & patient app",
    image: art.blog,
    tags: ["Design", "Tech"],
    year: "2025",
  },
  {
    title: "ShapesOS",
    subtitle: "Our agentic business OS, early access 2027",
    image: art.sign,
    tags: ["Tech", "Design"],
    year: "2027",
  },
];

export const testimonials = [
  {
    quote:
      "They took a messy idea and gave it a shape our whole team believes in. Calm, sharp, fast.",
    name: "Maya Chen",
    role: "COO, Northfield",
  },
  {
    quote:
      "It feels like having a senior product team on call — without the overhead or the drama.",
    name: "Daniel Okafor",
    role: "Founder, Skyline AI",
  },
  {
    quote: "Our product went from sketch to launch in eleven weeks. I still don’t know how.",
    name: "Priya Raman",
    role: "Head of Product, Fieldwork",
  },
];

export const stats = [
  { value: "98%", label: "Clients who renew after month one" },
  { value: "4.9/5", label: "Average satisfaction score" },
  { value: "2027", label: "ShapesOS early access opens" },
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
    a: "Not yet. Robotics and physical AI are a venture we’re exploring in Labs, and we haven’t released anything. Join the interest list on the Labs page to hear first.",
  },
  {
    q: "How fast will I receive my work?",
    a: "Most requests are delivered in two to three business days. Larger requests are broken into smaller pieces so you always see progress.",
  },
];

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: Capability;
  date: string;
  read: string;
  image: string;
};

export const featuredPost: Post = {
  slug: "calm-technology",
  title: "Calm technology: why the best products feel like a walk outside",
  excerpt:
    "Attention is the scarcest resource your customers have. Here’s how we design products that respect it.",
  category: "Design",
  date: "Oct 2026",
  read: "9 min read",
  image: art.home,
};

export const posts: Post[] = [
  {
    slug: "calm-machines",
    title: "What calm design could mean for machines",
    excerpt: "Notes from Labs: the interface lessons we’d bring to robots in homes and workplaces.",
    category: "Robotics",
    date: "Sep 2026",
    read: "6 min read",
    image: art.blog,
  },
  {
    slug: "brand-is-a-promise",
    title: "A brand is a promise you keep in public",
    excerpt: "Logos are easy. Consistency is the hard, valuable part — and it’s mostly operations.",
    category: "Design",
    date: "Aug 2026",
    read: "5 min read",
    image: art.work,
  },
  {
    slug: "growth-loops",
    title: "Growth loops beat growth hacks",
    excerpt: "Why the compounding channels are the boring ones — and how to build them on purpose.",
    category: "Marketing",
    date: "Jul 2026",
    read: "7 min read",
    image: art.pricing,
  },
  {
    slug: "ai-copilots",
    title: "Shipping an AI copilot people keep using",
    excerpt: "Five patterns that turned a flashy demo into a daily habit for 40,000 users.",
    category: "Tech",
    date: "Jun 2026",
    read: "8 min read",
    image: art.about,
  },
  {
    slug: "prototype-fast",
    title: "Prototype in cardboard before you prototype in code",
    excerpt: "The cheapest, fastest way to find out whether your idea has a shape.",
    category: "Robotics",
    date: "May 2026",
    read: "4 min read",
    image: art.sign,
  },
  {
    slug: "one-calm-team",
    title: "Why we put design, code and AI in one room",
    excerpt: "Handoffs are where good ideas go to die. Here’s how we work without them.",
    category: "Tech",
    date: "Apr 2026",
    read: "6 min read",
    image: art.home,
  },
];

export const values: { title: string; body: string; tone: Tone }[] = [
  { title: "Calm over chaos", body: "Clear plans, honest timelines, no drama.", tone: "blue" },
  { title: "Craft is a promise", body: "Details are how trust is built.", tone: "red" },
  { title: "Build what matters", body: "Fewer, better things that actually ship.", tone: "yellow" },
  { title: "Grow together", body: "Long partnerships beat quick wins.", tone: "green" },
];

export const team = [
  { name: "Jordan Hale", role: "Founder & Creative Director", tone: "blue" as Tone },
  { name: "Ava Lindqvist", role: "Head of Design", tone: "red" as Tone },
  { name: "Marcus Bell", role: "Labs Lead, Physical AI", tone: "yellow" as Tone },
  { name: "Sofia Reyes", role: "Growth Lead", tone: "green" as Tone },
];

export const clients = ["Northfield", "Lumen Labs", "Halo AI", "Fieldwork", "Kinetic", "Pollen", "Meadow", "Arc & Co"];
