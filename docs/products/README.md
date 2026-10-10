# Better Shapes product specs

These are the product specifications for the studio's planned open-source alternatives to expensive tools. Each one follows the same structure (summary, why it matters, users, MVP scope with acceptance criteria, what is not in v1, architecture, relationship to ShapesOS, clean-room sources, risks, milestones and market notes) and stays consistent with `lib/products.ts`.

Two things hold across every spec:

- **Agents propose, people approve.** Agentic products are built on Leash, the studio's MIT TypeScript agent toolkit (risk-rated tools, approval queue, spend caps, hash-chained audit log, MCP adapter). Anything that touches money, customers or the outside world waits for a person.
- **Clean room.** Behavior is specified only from public information. We never decompile, trace or copy proprietary code, UI assets, icons, copy or trademarks, and we name every open-source project we reuse along with its license.

Prices in the market notes are third-party estimates gathered in October 2026 and will drift.

## Specs

| Product | Alternative to | License | One line |
|---|---|---|---|
| [Concierge](./concierge.md) | Sierra, Decagon, Intercom Fin | AGPL-3.0 | A support agent that answers from your docs with citations and takes real actions behind approvals. |
| [Prism](./prism.md) | Clay | AGPL-3.0 | A GTM table with waterfall enrichment and AI research columns, using your own provider keys. |
| [Echo](./echo.md) | Gong, Chorus | AGPL-3.0 | Self-hosted call recording, transcripts, deal signals and approved follow-ups. |
| [Recall](./recall.md) | Glean | AGPL-3.0 | Permission-aware search and an assistant across your docs, chat, tickets and code. |
| [Orbit](./orbit.md) | Smartly, Madgicx, AdCreative | AGPL-3.0 | Ad creative, cross-platform tests and budget rebalancing, with every spend change approved. |
| [Forge](./forge.md) | Cursor | MIT | An AI code editor on the MIT Code - OSS core, with any model and diff-first agent edits. |
| [Frame](./frame.md) | Figma | AGPL-3.0 | Multiplayer interface design with components, auto layout, AI layout drafts and design-to-code. |
| [Collage](./collage.md) | Canva | AGPL-3.0 | Templates, brand kits, AI generate, resize and batch fill, extracted from ShapesOS Studio. |
| [Atelier](./atelier.md) | Photoshop and Illustrator generative tools | AGPL-3.0 | Layered photo and vector editing with generative tools on open models you can run yourself. |
| [Snip](./snip.md) | OpusClip | AGPL-3.0 | Long videos into scored, reframed, captioned clips, drafted for approval; extracted from ShapesOS Clips. |
| [Fab](./fab.md) | SolidWorks, Fusion | AGPL-3.0 | Parametric CAD in the browser with an AI assistant, versioned review and STEP/STL/3MF export. |

## Everyday apps

Consumer tools for everyone. Strong open-source projects already exist in each of these lanes, so every spec names them, says what we would do differently, and includes a point where the honest answer may be to contribute upstream instead.

| Product | Alternative to | License | One line |
|---|---|---|---|
| [Toss](./toss.md) | AirDrop, Quick Share | MIT | Send files, folders, links and clipboard to nearby devices on any OS, with a visible device check; LocalSend-compatible. |
| [Hum](./hum.md) | Spotify | AGPL-3.0 | Stream the music you own, bring your playlists as metadata, and buy directly from independent artists; never rips audio. |
| [Matinee](./matinee.md) | Kodi, Plex, Netflix-style apps | AGPL-3.0 | An AI-native media center for films you own or have rights to, with watchlist import and a curated, signed add-on catalog. |
| [Keepsake](./keepsake.md) | Google Photos, iCloud Photos | AGPL-3.0 | Photo backup to storage you control, with local search by description and consent-first face grouping. |
| [Huddle](./huddle.md) | Zoom | AGPL-3.0 | Browser video calls on a LiveKit SFU, with consent-first recording and AI notes run locally or on your own key. |
| [Daydream](./daydream.md) | Tubi, Netflix | Proprietary (creator tools may be open source) | A commercial, ad-supported streaming service of AI-generated series, with paid personalized episodes and a creator revenue share; not open source. |
| [Keyring](./keyring.md) | 1Password | AGPL-3.0 | A zero-knowledge vault for passwords and passkeys on audited crypto libraries, launched only after an independent audit. |

## Recommended build order

1. **Concierge** — the clearest demonstration of Leash: real actions, real approvals, a buyer who feels the price.
2. **Prism** — the ShapesOS enrichment waterfall is ready to extract; bring-your-own-key is the whole pitch.
3. **Echo** — reuses transcription work and pairs naturally with Prism and the ShapesOS CRM.
4. **Snip** — extracted from ShapesOS Clips (`lib/clipper`), which already has most of the pipeline.
5. **Collage** — extracted from ShapesOS Studio, sharing one editor package with it.
6. **Forge** — MIT and built on Code - OSS; ShapesOS is a reference only, because its code is AGPL.
7. **Frame** — the hardest editor; benefits from the canvas work done for Collage.
8. **Fab** — builds on the ShapesOS CAD module and adds an open geometry kernel.
9. **Atelier** — a deep editor; starts after the canvas and model-hosting lessons from Collage and Frame.
10. **Orbit** — the most existing code (ShapesOS Media and Flywheel), but it moves money, so it ships after Leash has matured in production.
11. **Recall** — permission sync across many connectors is long, careful work; it goes last.
