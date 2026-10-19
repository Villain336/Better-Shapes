# Fig Tree (formerly Frame)

> Collaborative design with AI as a teammate.

- **Lane:** Interface design
- **Status:** Planned (seventh in the build order)
- **License:** AGPL-3.0
- **Open-source alternative to:** Figma
- **Audience:** Product designers and teams
- **Built on:** Leash (MIT) for AI actions and audit; a CRDT library for multiplayer

## Summary

Frame is a browser-based interface design tool: a multiplayer vector canvas with frames, components, variables, auto layout and simple prototyping. AI works as a teammate on the same canvas. It can draft a layout from a sentence using the team's own components, suggest variants, and hand off clean code (HTML/CSS, React with Tailwind) from a selection. Files are stored in an open, documented format and can be self-hosted, so a team's design system is not locked in one vendor's cloud.

## Why it matters

Interface design has largely converged on one tool. Figma's 2026 seats are reported at about $16 per month on Professional, $55 per month on Organization and $90 per month on Enterprise for full seats, and AI features are increasingly metered. Teams pay for seats per designer and often for developers who mainly inspect.

Open source wins because design files are long-lived company assets, and an open file format means a design system outlives any one tool. Penpot has shown that an open-source design tool can work at scale. Frame is a different take: a TypeScript codebase that shares an editor core with the studio's other canvases (Collage, ShapesOS Studio), with AI built in from the start and agent actions governed by Leash.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| Product designer | "Design screens with components and auto layout, together with my team, in real time." |
| Design system lead | "Maintain components and variables in one place and see where they are used." |
| Developer | "Inspect a design and get code that matches our components, not absolute-positioned divs." |
| Founder / PM | "Turn a rough description into a first layout I can hand to a designer." |

## MVP scope

1. **Vector canvas.**
   Frames, rectangles, ellipses, paths with a pen tool, text, images, boolean operations, groups, constraints, zoom to 6400%.
   *Acceptance:*
   - 60 fps panning on a file with 10,000 layers on a mid-range laptop.
   - Vector paths export to SVG without loss.
2. **Multiplayer.**
   Live cursors, presence, comments with mentions, offline edits that merge on reconnect.
   *Acceptance:*
   - 20 concurrent editors on one file with edits visible to others within 200 ms on a normal connection.
   - No lost edits after a forced disconnect and reconnect.
3. **Components and variables.**
   Main components and instances with overrides; variables for color, number, string and boolean, with modes (for example light and dark).
   *Acceptance:*
   - Editing a main component updates all instances while keeping overrides.
   - Switching a mode recolors the frame.
4. **Auto layout.**
   Stack direction, gap, padding, alignment, hug/fill/fixed sizing, wrap.
   *Acceptance:*
   - Behavior matches the documented flexbox subset Frame maps to, and design-to-code output reproduces the same layout in a browser within 1 px.
5. **AI layout drafts.**
   Describe a screen; Frame drafts it using components and variables from the file's libraries.
   *Acceptance:*
   - Drafts land in a new frame marked as a draft.
   - Only existing components are used when a library is attached.
   - The prompt and model are stored on the frame.
6. **Design-to-code.**
   Export a selection as HTML/CSS or React with Tailwind, mapping components to code components through a mapping file.
   *Acceptance:*
   - Output builds without edits for the reference examples.
   - Mapped components emit the mapped import instead of raw markup.
7. **Prototyping basics.**
   Click-through links between frames, overlays, simple transitions, a share link for viewing.
   *Acceptance:*
   - A prototype link works for logged-out viewers when the owner enables it, and can be revoked.
8. **Self-hostable files.**
   An open JSON-based file format, import of SVG and of Penpot exports, export to SVG, PNG and PDF.
   *Acceptance:*
   - The format is documented in the repository and round-trips without loss.

## Not in v1

- Import of proprietary `.fig` files.
- Advanced prototyping (variables in prototypes, conditional logic, smart animate equivalents).
- Plugins API (planned after the core stabilizes).
- Whiteboarding and slides.
- Developer-mode code inspection beyond export.

## Architecture

- **Stack:** Next.js and TypeScript for the app shell; the canvas renderer in TypeScript on WebGL (or WebGPU where available) with a Canvas 2D fallback; Yjs (MIT) as the CRDT for multiplayer with a WebSocket sync server; Postgres with row-level security and Prisma for files, teams and permissions; S3-compatible storage for images and snapshots.
- **Data model sketch:** `Team`, `Project`, `File`, `Page`, `Node` (type, transform, style, layout props, parent) held in the CRDT document; `Component`, `Variable`, `Mode`, `Library` (published version), `Comment`, `ShareLink`, `Snapshot`, `CodeMapping`, `AuditEvent`.
- **Where AI runs:** server-side jobs for layout drafts and design-to-code; the model receives a compact description of the file's components and variables, not raw pixels. Image generation for placeholders is optional.
- **Leash fit:** AI edits are proposals written to a draft frame; applying AI changes to existing frames needs the user's accept. Publishing a library and creating public share links are recorded in the audit log. Spend caps limit AI usage per seat and per team.
- **Self-host story:** docker compose with app, sync server, Postgres and MinIO. Fully usable with no AI keys; AI panels show as not configured.

## Relationship to ShapesOS

Frame shares an editor lineage with ShapesOS Studio but is a different kind of tool (product UI versus marketing assets). Both are AGPL-3.0, so code can move between them.

- `app/dashboard/studio/designs/editor/` (`CanvasEditor.tsx`, `DesignCanvas.tsx`, `Toolbar.tsx`, `panels/`) and `lib/design/store.ts`: the Konva-based Studio editor; Frame can reuse its history, selection and panel patterns, though it needs its own renderer for 10,000-layer files.
- `lib/design/export-svg.ts`, `lib/design/svg-sanitize.ts`, `lib/design/fonts.ts`: export, SVG safety and font handling.
- `lib/design/penpot.ts`: ShapesOS already imports design tokens from Penpot files and documents why Penpot's editor was not merged. Frame follows the same reasoning.
- `lib/design/sharing.ts`: share, comment and approval links.

## Clean-room sources

- Behavior is specified only from public information: Figma's public help center, developer docs (REST and plugin API references), pricing page, Config talks, marketing pages, demo videos and ordinary hands-on use.
- We never decompile, trace or copy proprietary code, UI assets, icons, copy or trademarks. Original names are used for every feature and screen (for example "stacks" or "flow layout" rather than another product's feature names where those are distinctive).
- Penpot is open source under the Mozilla Public License 2.0 (MPL-2.0), not AGPL. We learn from its public architecture docs and talks. MPL-2.0 is file-level copyleft and allows combination with GPL-family licenses unless a file is marked incompatible, so any Penpot file we ever reuse keeps its MPL header and stays MPL; by default we re-implement rather than copy. Verify license on the current Penpot repository before any reuse.
- Other reused open source: Yjs (MIT), Konva (MIT, via ShapesOS Studio), Leash (MIT).

## Risks

- **Legal:** design tools have distinctive UI conventions and trademarks; Frame must look and read like its own product. Patents on specific multiplayer or vector techniques are possible; prefer published, long-standing techniques.
- **Technical:** this is the hardest product in the catalog. Rendering performance, text layout, and CRDT conflict handling for tree moves are all difficult. Mitigation: narrow v1, performance budgets in CI, and learning from Penpot and other public work.
- **Inference cost:** layout drafts are moderate; design-to-code on large selections can be expensive. Mitigation: per-team caps and compact file descriptions.
- **Name:** "Frame" is used by other products (for example Frame.io); trademark check before launch.

## Milestones

- **v0.1:** single-player canvas with frames, shapes, text, pen tool, SVG/PNG export, open file format.
- **v0.5:** multiplayer with comments, components and variables, auto layout, self-host compose.
- **v1.0:** AI layout drafts, design-to-code with component mapping, prototyping basics, Penpot import, libraries.

## Market notes

Prices are third-party estimates gathered in October 2026.

- Figma: reported Professional full seat about $16/month (annual) or $20 (monthly), Organization full seat about $55/month (annual only), Enterprise full seat about $90/month. Sources: [usecarly, Figma pricing](https://www.usecarly.com/blog/figma-pricing/), [CostBench, Figma pricing 2026](https://www.costbench.com/software/ai-design-tools/figma-ai/).
- Penpot license (MPL-2.0): Penpot README license section, mirrored at [ark.sudovanilla.org Penpot README](https://ark.sudovanilla.org/Penpot/penpot/src/commit/55ea84a056a7cc6ee5a712139845b31d99c4f97e/README.md); verify on the official penpot/penpot repository.
