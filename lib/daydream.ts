import { asset } from "./content";

/** Daydream: Better Shapes' AI movies & series platform (see docs/products/daydream.md). */

export type Original = {
  slug: string;
  title: string;
  genre: string;
  format: string;
  rating: string;
  logline: string;
  poster: string;
};

export const originals: Original[] = [
  {
    slug: "meadowlight",
    title: "Meadowlight",
    genre: "Sci-fi drama",
    format: "8 × 22 min",
    rating: "PG",
    logline:
      "In a town where the sky answers questions by dusk, a young meteorologist starts asking the ones everyone agreed never to ask.",
    poster: asset("/daydream/meadowlight.webp"),
  },
  {
    slug: "shipped",
    title: "Shipped",
    genre: "Comedy",
    format: "10 × 12 min",
    rating: "PG-13",
    logline:
      "Three founders, thirty days of runway, and an AI co-founder that keeps approving its own pull requests.",
    poster: asset("/daydream/shipped.webp"),
  },
  {
    slug: "low-orbit",
    title: "Low Orbit",
    genre: "Animated adventure",
    format: "10 × 11 min",
    rating: "G",
    logline:
      "Two siblings find a polite little satellite in Grandma’s sunflower field and have one storm season to get it home.",
    poster: asset("/daydream/low-orbit.webp"),
  },
];

// Draft prices. Personalized episodes are paid in credits so plans stay profitable at today's generation
// costs (see docs/products/daydream.md, "Plans and unit economics"):
// 1 credit = 1 storyboard minute (illustrated stills with camera moves, voice and music);
// a full-motion 720p minute costs 6 credits.
export const daydreamPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/forever",
    description: "Every original and creator series, free with short ads.",
    features: ["Full catalog with ads", "New originals every month", "Kids profiles with reviewed titles", "Web, phone and TV"],
    cta: "Join the waitlist",
    featured: false,
    href: "#waitlist",
  },
  {
    name: "Plus",
    price: "$9.99",
    period: "/month",
    description: "Ad-free, plus credits for episodes made just for you.",
    features: [
      "Ad-free viewing",
      "6 credits a month for personalized episodes",
      "“Make me a series about…”",
      "Continue any original your way",
      "Top up 6 credits for $9.99",
    ],
    cta: "Join the waitlist",
    featured: true,
    href: "#waitlist",
  },
  {
    name: "Studio",
    price: "$49.99",
    period: "/month",
    description: "For creators: more credits, higher resolution and publishing tools.",
    features: [
      "36 credits a month",
      "Higher-resolution renders",
      "Series bible and character tools",
      "Apply to publish and earn",
    ],
    cta: "Join the waitlist",
    featured: false,
    href: "#waitlist",
  },
];
