# Collage

> Beautiful graphics for everyone, on brand.

- **Lane:** Everyday design
- **Status:** Planned (fifth in the build order, extracted from ShapesOS Studio)
- **License:** AGPL-3.0
- **Open-source alternative to:** Canva
- **Audience:** Marketers, creators and small businesses
- **Built on:** the ShapesOS Studio editor; Leash (MIT) for AI generation caps and publish approvals

## Summary

Collage is an easy design tool for social posts, presentations, flyers and other everyday graphics. People start from a template, apply their brand kit, and edit on a simple canvas. AI can generate a first draft from a prompt, resize a design for every platform at once, and fill a template from a spreadsheet to make many versions. Designs can be shared for comments and approval before they are published or printed. Collage grows out of the ShapesOS Studio editor, which already has most of these pieces.

## Why it matters

Canva is the default for non-designers. Its reported 2026 prices are about $15 to $18 per month for Pro (one person) and about $25 per person per month for Business, which replaced the older Teams plan; for a team of five that is around $1,250 per year, with AI usage increasingly limited by credits.

Open source wins for teams that want their brand assets, templates and content in their own storage, want to choose their own image models, and do not want per-seat pricing for people who only edit occasionally. Templates and brand kits are also natural community contributions, which an open project can accept.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| Small business owner | "Make a good-looking post for this week's offer in ten minutes, in our colors." |
| Marketer | "Produce the same campaign in 12 sizes and three languages without redoing it 36 times." |
| Agency / brand lead | "Keep everyone on brand and approve designs before they go out." |
| Creator | "Start from a nice template and swap in my photos and words." |

## MVP scope

1. **Editor.**
   Text, shapes, images, icons, charts, QR codes, pages, layers, grouping, alignment guides, undo/redo.
   *Acceptance:*
   - A first-time user can change the text, image and color of a template and export it in under three minutes in usability tests.
2. **Template library.**
   At least 150 original templates at launch across social, presentation, print and ads, each with editable placeholders.
   *Acceptance:*
   - Every template is original work or under a license allowing redistribution, with the license recorded per template.
3. **Brand kits.**
   Logos, colors, fonts and voice notes; one-click "apply brand" on any design.
   *Acceptance:*
   - Applying a brand kit replaces template colors and fonts consistently.
   - Custom fonts upload with a license reminder.
4. **AI generate.**
   A prompt produces a draft design using templates and the brand kit; optional AI images.
   *Acceptance:*
   - AI output lands as a draft.
   - Generated images are labeled in the asset panel.
   - The model used is recorded.
5. **Magic resize.**
   Resize a design to many platform sizes in one step.
   *Acceptance:*
   - Text never overflows its box after resize.
   - The resized set is created as new designs and the original is unchanged.
6. **Batch fill.**
   Fill a template from CSV rows to make many designs.
   *Acceptance:*
   - 500 rows produce 500 designs with a preview of the first 10 before running.
   - Errors per row are listed.
7. **Share, comment and approve.**
   Share links with view or comment rights, threaded comments, an approval request with approve/request changes.
   *Acceptance:*
   - Approval state is shown on the design.
   - Links can expire and be revoked.
8. **Export.**
   PNG, JPG, SVG, PDF (with print bleed and crop marks), and an MP4 for simple animated designs (v0.5).
   *Acceptance:*
   - PDF export embeds fonts.
   - Print PDFs have correct bleed for the chosen size.

## Not in v1

- Direct posting to social networks (ShapesOS Social does this when Collage is embedded).
- Video editing beyond simple animated exports (see Snip).
- Website builder and whiteboards.
- A stock photo marketplace; v1 connects to free stock APIs with their attribution rules.
- Real-time multiplayer editing (comments only in v1).

## Architecture

- **Stack:** Next.js and TypeScript; Konva (MIT) canvas editor carried over from ShapesOS Studio; Postgres with row-level security and Prisma; S3-compatible storage; a server-side renderer for exports and batch jobs.
- **Data model sketch:** `Workspace`, `BrandKit`, `Template` (license, category, sizes), `Design`, `Page`, `Element` (type, props), `Asset` (source, license, AI flag), `BatchJob`, `ShareLink`, `Comment`, `ApprovalRequest`, `Export`, `AuditEvent`.
- **Where AI runs:** server jobs for prompt-to-design, copy suggestions and image generation; providers pluggable, including self-hosted open image models.
- **Leash fit:** generation and batch jobs are metered against spend caps per user and workspace. Publishing or sending a design outside Collage (social, print vendor, email) is a high-risk action that requires an approval.
- **Self-host story:** docker compose with app, Postgres, MinIO and renderer; templates ship in the repository; works without AI keys, with AI features marked as not configured.

## Relationship to ShapesOS

Collage is an extraction of ShapesOS Studio into a standalone product (both AGPL-3.0). Most MVP features exist there in some form.

- `app/dashboard/studio/designs/editor/` (`CanvasEditor.tsx`, `DesignCanvas.tsx`, `BatchModal.tsx`, `ShareModal.tsx`, `ChartNode.tsx`, `QrNode.tsx`, `PagesStrip.tsx`): the Studio editor.
- `lib/design/` (`magic-resize.ts`, `ai.ts`, `store.ts`, `sharing.ts`, `export-svg.ts`, `fonts.ts`, `background-removal.ts`, `template-data/pack.json`): resize math, AI generation, sharing, export and templates.
- `lib/design/brandfetch.ts`, `lib/brand-theme.ts`: brand kit autofill and theming.
- `lib/studio/` (`creatives.ts`, `formats.ts`, `qr-designer.ts`) and `app/dashboard/studio/`: creative formats and wizard.
- `lib/design/pexels.ts`, `pixabay.ts`, `iconify.ts`: stock photo and icon sources (each with its own terms).
- `lib/images/` (`batch.ts`): batch image generation.

Extraction plan: move the editor and design libraries into a shared package used by both ShapesOS Studio and Collage, so fixes land in one place.

## Clean-room sources

- Behavior is specified only from public information: Canva's public help center, pricing page, design school articles, marketing pages, demo videos and ordinary hands-on use.
- We never decompile, trace or copy proprietary code, UI assets, icons, templates, copy or trademarks. Collage templates are made by the studio or contributors, or come from sources with redistribution rights; we never recreate a Canva template. Feature names are original.
- Reused open source: ShapesOS Studio (AGPL-3.0, our own); Konva (MIT); Inter and other fonts under OFL-1.1; Iconify icon sets under each set's license (verify license per set); Leash (MIT).

## Risks

- **Legal:** template and asset licensing is the main risk; each asset records its license. AI images may resemble protected work; disclose AI use and let teams turn image generation off. Fonts uploaded by users may not be licensed for web embedding.
- **Technical:** export fidelity (fonts, print bleed) and performance of batch rendering. Mitigation: a single server renderer used for all exports, with visual regression tests.
- **Inference cost:** image generation dominates. Mitigation: caps, cached results, and local open image models as an option.
- **Content quality:** templates are the product for many users; budget design time for them, not only engineering.

## Milestones

- **v0.1:** editor extracted from Studio into a shared package, 40 templates, brand kits, PNG/PDF export.
- **v0.5:** AI generate, magic resize, batch fill, share and comment, 100 templates, self-host compose.
- **v1.0:** approvals, print PDFs with bleed, simple animated export, 150+ templates, ShapesOS embedding through the shared package.

## Market notes

Prices are third-party estimates gathered in October 2026.

- Canva: Pro reported at $18/month monthly or about $144 to $180/year; Business (replacing Teams for new sign-ups) about $25/user/month or $250/user/year. Sources: [Piktochart, Canva pricing 2026](https://piktochart.com/blog/canva-pricing-2026-costs-raised/), [Moda, Canva pricing](https://moda.app/blog/canva-pricing), [eesel, Canva AI pricing](https://www.eesel.ai/en/blog/canva-ai-pricing).
- Sources disagree on Pro's annual price; check Canva's pricing page.
