# Better Shapes

Marketing site for Better Shapes — design, technology, robotics & marketing.

**Live:** https://villain336.github.io/Better-Shapes/

- **Design source:** Figma file “Better Shapes — Design System & Site”. Every page of the editorial redesign is
  captured there (https://www.figma.com/design/z4u3TIS0foXz7UGiGWEkJf?node-id=43-2 is Home; the other pages follow).
  References for the direction: the Atlas “Glass · Screens” system (dense, hairline-led, small mono labels) and
  designjoy.co (one calm column, a membership pitch, a plain FAQ).
- **Stack:** Next.js (App Router, static export) · Tailwind CSS v4 · Framer Motion · Lenis smooth scroll
- **Pages:** `/` Home (blue poppies) · `/work` (lavender) · `/products` + `/products/<slug>` (ranunculus) · `/pricing` (cosmos) · `/blog` + `/blog/<slug>` (tulips) · `/about` (peonies + contact) · `/labs` (anemones; robotics, gated as “exploring”)

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
- `lib/content.ts` — all copy: services, our work, pricing, FAQs, post metadata, the request ticker (edit here)
- `lib/essays.ts` — essay bodies keyed by post slug (`## ` lines are subheads, `> ` lines are pull quotes)
- `lib/products.ts` — the six products: ShapesOS (the agentic business OS, the flagship, launching Dec 1, 2026),
  Periscope (viewing MCP + API for agents), Canary (decoy key injector), Kiln (data labeling + model training), Ripple
  (open-source streaming) and Flock (drone mesh OS, in Labs). `products[0]` is the flagship shown on Home. Set `repo`
  once a GitHub repo is public to show the link. `shapesOSLaunch` holds the launch moment; `components/Launch.tsx`
  turns it into the strip above the nav, the Home announcement band and the product-page countdown (all live, and
  they flip to “is live” copy once the date passes).
- `components/ProductRender.tsx` — live ordered-dither ASCII halftone motion shader (`4×4` Bayer matrix + pixel-art
  ASCII glyph density tiers `· : + × # █` on a `#0B0514` deep navy-black void with hot magenta/crimson midtones,
  electric cyan rim lighting, and ice-white highlights) that transforms each product's scene in `public/products/`
  with real-time motion waves, pausing off-screen and respecting `prefers-reduced-motion`.
- `docs/products/` — clean-room specs from the earlier lineup; kept for reference, not shown on the site
- Type: Manrope (headlines, tight) + Inter (body and UI) + Geist Mono (11px uppercase labels). The second half of a headline
  is set in a quieter ink (`components/Accent.tsx`); the four brand colours live in the logo mark and small tone dots only.
- Radii: 6px tags · 10px controls · 14px cards · 18px panels and image frames. One accent blue for the “— SECTION” eyebrows.
- `components/` — `Nav` (slim bar, frosts on scroll; search, Products mega menu, theme toggle), `Button` (one arrow, `ink` / `outline` / `ghost` / `white` / `glass`),
  `Panel`, `Chip`, `Eyebrow`, `PageHero` (painting + staged settle-in), `HeroBrief` (the 60-second brief; it pre-fills the
  contact form), `Sections` (`SectionHeading`, `StatStrip`, `Marquee`, `Timeline`, `Faq`, `CtaBand`), `ProductFeature`
  (the flagship panel), `ProductCard`, `Cards`, `Forms`
- Motion: reveals fade and rise 12px over 0.6s, staggered 60ms; hero parallax is 12%; hovers lift 2px. No blur, no drift, no blobs.
- `public/art/` — AI-generated flower/sky paintings, one per page, each with a `*-dusk.webp` twin for dark mode

## Interaction layer

Floating UI is adapted from the Atlas “Glass · Components” library and sits on the `glass glass-solid` surface so it stays
legible over the paintings. `components/SiteUI.tsx` is the shared state: the command palette, the mobile brief sheet and
the mobile menu are mutually exclusive, close on navigation, and `useLayer` locks scroll (Lenis + body) and handles Escape.

- `components/Primitives.tsx` — `Kbd`, `IconButton`, `Tooltip` (hover/focus, ink pill), `SegmentedControl` (sliding
  ink pill, `role="radiogroup"`), `Breadcrumb`
- `components/CommandPalette.tsx` — ⌘K / Ctrl+K. Pages, actions (theme, book a call, quick brief, waitlist), products
  and essays; title matches rank above subtitle and keyword matches. `PaletteTrigger` is the search button in the nav.
- `components/MegaMenu.tsx` — the Products dropdown on desktop: the lineup on the left, the ShapesOS launch (live
  countdown + waitlist) on the right. Opens on hover or focus from the nav item.
- `components/HoverCard.tsx` — `ProductMentions` turns product names in running copy into links with a render preview
  on hover (used in each product page’s “How it fits”).
- `components/Lightbox.tsx` — full-screen viewer with keyboard, drag and a thumbnail strip. `WorkGalleryButton` opens
  the work grid as a gallery; `RenderLightbox` is the expandable render on product pages.
- `components/CompareSlider.tsx` — day/dusk wipe for any painting (About uses `art.home`, whose twins line up pixel for
  pixel). Pointer drag plus arrow keys on the handle.
- `components/Toast.tsx` — `useToast().toast({ title, body, tone })`, bottom-right (above the dock on phones). Forms
  fire one on success; errors stay inline.
- `components/Mobile.tsx` — `BottomSheet` (drag to dismiss), `BriefSheet` (the quick brief, bare, on phones) and
  `FloatingDock` (Search · Brief · Let’s talk; hides while scrolling down or when any layer is open). The mobile menu in
  `Nav.tsx` lists destinations with icons and descriptions.
- `components/PricingPlans.tsx` — Monthly / Quarterly switch (prices live in `lib/content.ts` as `price.monthly` /
  `price.quarterly`); the amount rolls over in place.

## Day and dusk (theme)

Dark mode is a dusk version of the same scenery, not a grey inversion. `components/Theme.tsx` owns it: a `.dark`
class on `<html>`, remembered in `localStorage` (`better-shapes:theme`), falling back to the system preference; an
inline script in `app/layout.tsx` applies it before first paint. Tokens for both times of day live at the top of
`app/globals.css` (use `on-ink`, `veil`, `glass-stroke` rather than hard-coded white). Flipping the switch adds
`html.theme-transition` for 0.7s so every colour eases at once, while `components/Painting.tsx` renders the day and
dusk images stacked and cross-fades them over 1.4s. Hero scrims are a solid canvas colour under a static alpha mask so
they fade with the theme too. When adding a painting, generate its dusk twin from the day image and name it
`<name>-dusk.webp`.

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
