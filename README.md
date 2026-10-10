# Better Shapes

Marketing site for Better Shapes — design, technology, robotics & marketing.

- **Design source:** Figma file “Better Shapes — Design System & Site” (tokens, glass components, 5 desktop pages + mobile home):
  https://www.figma.com/design/z4u3TIS0foXz7UGiGWEkJf
- **Stack:** Next.js (App Router, static export) · Tailwind CSS v4 · Framer Motion · Lenis smooth scroll
- **Pages:** `/` Home (blue poppies) · `/work` (lavender) · `/pricing` (cosmos) · `/blog` (tulips) · `/about` (peonies + contact)

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out — deploy to Vercel, Netlify, GitHub Pages…
npm run typecheck
```

## Where things live

- `app/globals.css` — design tokens (mirror the Figma variables) and the `glass`, `glass-ink`, `rim-gradient` surfaces
- `lib/content.ts` — all copy: services, projects, pricing, FAQs, posts, team (edit here)
- Type: Manrope (headlines) + Plus Jakarta Sans (body) + Geist Mono (small labels). The word "shape" is drawn letter by letter in red, blue, yellow, green and lavender (`components/Accent.tsx`).
- `components/` — `Nav`, `Button`, `GlassCard` (pointer spotlight), `Cards`, `PageHero` (parallax art + word reveal), `Reveal`, `Sections`, `Forms`
- `public/art/` — AI-generated flower/sky paintings, one per page

## Notes

- Forms have no backend yet: the contact form opens the visitor’s email client, and the newsletter form only shows a confirmation. Connect Formspree / Resend / your email provider before launch.
- Project names, testimonials, stats and team members are placeholder copy.
- All motion respects `prefers-reduced-motion`.
