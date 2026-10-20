# Better Shapes

Marketing site for Better Shapes — design, technology, robotics & marketing.

**Live:** https://villain336.github.io/Better-Shapes/

- **Design source:** Figma file “Better Shapes — Design System & Site”. The current editorial redesign is captured there as
  “Home” and “Pricing” pages (https://www.figma.com/design/z4u3TIS0foXz7UGiGWEkJf?node-id=26-2). References for the
  direction: the Atlas “Glass · Screens” system (dense, hairline-led, small mono labels) and designjoy.co (one calm
  column, a membership pitch, a plain FAQ).
- **Stack:** Next.js (App Router, static export) · Tailwind CSS v4 · Framer Motion · Lenis smooth scroll
- **Pages:** `/` Home (blue poppies) · `/work` (lavender) · `/products` + `/products/<slug>` (ranunculus) · `/pricing` (cosmos) · `/blog` (tulips) · `/about` (peonies + contact) · `/labs` (anemones; robotics, gated as “exploring”)

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out — deploy to Vercel, Netlify, GitHub Pages…
npm run typecheck
```

## Where things live

- `app/globals.css` — design tokens, the type scale (`display`, `h2`, `h3`, `lede`, `body`, `small`, `label`, `num`) and
  the surfaces: `surface` (hairline card), `glass` (only on top of paintings), `frame` (image container), `lift` (hover)
- `lib/content.ts` — all copy: services, our work, pricing, FAQs, upcoming posts, the request ticker (edit here)
- `lib/products.ts` — the product catalog (ShapesOS, Leash, Shapes UI, Beacon and the open suite). Set `repo` on a product once its GitHub repo is public to show the link.
- `docs/products/` — clean-room specs for each planned product
- Type: Manrope (headlines, tight) + Inter (body and UI) + Geist Mono (11px uppercase labels). The second half of a headline
  is set in a quieter ink (`components/Accent.tsx`); the four brand colours live in the logo mark and small tone dots only.
- Radii: 6px tags · 10px controls · 14px cards · 18px panels and image frames. One accent blue for the “— SECTION” eyebrows.
- `components/` — `Nav` (slim bar, frosts on scroll), `Button` (one arrow, `ink` / `outline` / `ghost` / `white` / `glass`),
  `Panel`, `Chip`, `Eyebrow`, `PageHero` (painting + staged settle-in), `HeroBrief` (the 60-second brief; it pre-fills the
  contact form), `Sections` (`SectionHeading`, `StatStrip`, `Marquee`, `Timeline`, `Faq`, `CtaBand`), `Cards`, `Forms`
- Motion: reveals fade and rise 12px over 0.6s, staggered 60ms; hero parallax is 12%; hovers lift 2px. No blur, no drift, no blobs.
- `public/art/` — AI-generated flower/sky paintings, one per page

## Forms (Web3Forms)

Contact, newsletter and waitlist forms post to [Web3Forms](https://web3forms.com).

The studio's access key is built into `components/Forms.tsx`; Web3Forms keys are designed to be public, since they only let people send submissions to your inbox. To use a different key:

- Locally: `NEXT_PUBLIC_WEB3FORMS_KEY=your-key npm run dev`.
- On GitHub: Settings → Secrets and variables → Actions → **Variables** → add `WEB3FORMS_KEY`. Each submission includes a `form` field (`contact`, `newsletter`, `waitlist`) and, for waitlists, a `product` field.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds the static site and publishes it on every push to `main` (or manually from the Actions tab).

One-time setup: Settings → Pages → Source: **GitHub Actions**. The site appears at `https://villain336.github.io/Better-Shapes/`. The workflow sets `NEXT_PUBLIC_BASE_PATH=/Better-Shapes` so links and images work under that sub-path; use `asset()` from `lib/content.ts` for any new file in `public/`.

## Notes

- Project names, testimonials, stats and team members are placeholder copy.
- Robotics is gated: it appears only as a Labs venture marked “Exploring”. Don't add claims of shipped robots until something ships.
- All motion respects `prefers-reduced-motion`.
