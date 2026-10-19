# Better Shapes

Marketing site for Better Shapes — design, technology, robotics & marketing.

**Live:** https://villain336.github.io/Better-Shapes/

- **Design source:** Figma file “Better Shapes — Design System & Site” (tokens, glass components, 5 desktop pages + mobile home):
  https://www.figma.com/design/z4u3TIS0foXz7UGiGWEkJf
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

- `app/globals.css` — design tokens (mirror the Figma variables) and the `glass`, `glass-ink`, `rim-gradient` surfaces
- `lib/content.ts` — all copy: services, our work, pricing, FAQs, upcoming posts (edit here)
- `lib/products.ts` — the product catalog (ShapesOS, Leash, Shapes UI, Beacon and the open suite). Set `repo` on a product once its GitHub repo is public to show the link.
- `docs/products/` — clean-room specs for each planned product
- Type: Manrope (headlines) + Plus Jakarta Sans (body) + Geist Mono (small labels). The word "shape" is drawn letter by letter in red, blue, yellow, green and lavender (`components/Accent.tsx`).
- `components/` — `Nav`, `Button`, `GlassCard` (pointer spotlight), `Cards`, `PageHero` (parallax art + word reveal), `Reveal`, `Sections`, `Forms`
- `public/art/` — AI-generated flower/sky paintings, one per page

## Forms (Web3Forms)

Contact, newsletter and waitlist forms post to [Web3Forms](https://web3forms.com).

1. On web3forms.com, enter the inbox that should receive submissions and copy the access key (it's designed to be public).
2. Locally: `NEXT_PUBLIC_WEB3FORMS_KEY=your-key npm run dev`.
3. On GitHub: Settings → Secrets and variables → Actions → **Variables** → add `WEB3FORMS_KEY`.

Without a key the forms say they aren't connected yet instead of failing silently. Each submission includes a `form` field (`contact`, `newsletter`, `waitlist`) and, for waitlists, a `product` field.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds the static site and publishes it on every push to `main` (or manually from the Actions tab).

One-time setup: Settings → Pages → Source: **GitHub Actions**. The site appears at `https://villain336.github.io/Better-Shapes/`. The workflow sets `NEXT_PUBLIC_BASE_PATH=/Better-Shapes` so links and images work under that sub-path; use `asset()` from `lib/content.ts` for any new file in `public/`.

## Notes

- Project names, testimonials, stats and team members are placeholder copy.
- Robotics is gated: it appears only as a Labs venture marked “Exploring”. Don't add claims of shipped robots until something ships.
- All motion respects `prefers-reduced-motion`.
