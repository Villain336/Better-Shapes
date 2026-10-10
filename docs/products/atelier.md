# Atelier

> Pro photo and vector editing with generative tools.

- **Lane:** Creative studio
- **Status:** Planned (ninth in the build order, after Fab)
- **License:** AGPL-3.0
- **Open-source alternative to:** Adobe Photoshop and Illustrator generative tools
- **Audience:** Designers, photographers and studios
- **Built on:** open image models the user can run; Leash (MIT) for hosted-model spend caps and audit

## Summary

Atelier is a photo and vector editor for professional work: layers, masks, adjustment layers and non-destructive edits for images, plus vector paths, boolean operations and image tracing for illustration. Generative tools (fill a selection, expand the canvas, remove an object, clean up a background) run on open image models that the user can host on their own GPU or point at a hosted provider. Every generated pixel is tracked in the file's history with the model and prompt that made it, so studios can answer "what in this image was generated?"

## Why it matters

Adobe's 2026 pricing is reported at about $22.99 per month for a single app with a small monthly generative credit allowance, and about $69.99 per month for Creative Cloud Pro with the full app set and premium AI credits. For a studio of ten that is thousands of dollars a year, and the generative features run only on Adobe's models and servers.

Open source wins on control and provenance. Studios with client confidentiality requirements want images to stay on their machines; photographers want to choose models whose training and licensing they accept; and everyone benefits from a file format that does not expire with a subscription. Strong open projects (GIMP, Krita, Inkscape, Graphite) prove the editing core is possible; Atelier's focus is a modern browser-first editor with generative tools designed in from the start.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| Photographer | "Remove a distracting object and extend the background for a crop, without sending client photos to a cloud." |
| Designer | "Comp product shots, mask cleanly, and keep every edit reversible." |
| Illustrator | "Trace a sketch into clean vectors and refine them with real path tools." |
| Studio lead | "Know which assets contain generated content and which models made them." |

## MVP scope

1. **Layers and masks.**
   Pixel layers, vector layers, groups, layer masks, clipping, blend modes, opacity.
   *Acceptance:* a 6000x4000 image with 30 layers stays responsive (brush strokes under 16 ms per frame) on a laptop with a recent integrated GPU.
2. **Non-destructive adjustments.**
   Adjustment layers (levels, curves, hue/saturation, color balance, black and white), smart-object style placed layers with transform history.
   *Acceptance:* every adjustment can be edited or removed later without quality loss; 16-bit per channel editing is supported.
3. **Selections.**
   Marquee, lasso, magic wand, color range, and AI subject/object selection.
   *Acceptance:* AI subject selection runs locally in the browser or on the configured server; a selection can be refined with brush and feather and saved as a mask.
4. **Generative fill, expand and remove.**
   Fill a selection from a prompt, extend the canvas, remove an object, all as new layers.
   *Acceptance:* generated content is always a separate layer with the model, prompt, seed and date in its properties; the source pixels below are never overwritten.
5. **Vector tools and tracing.**
   Pen tool, shapes, boolean operations, stroke and fill styles, text on path; bitmap-to-vector tracing.
   *Acceptance:* traced output is editable paths; SVG export opens correctly in Inkscape and browsers.
6. **Local or hosted models.**
   A model settings page listing available models with their licenses; local inference through a companion server (ComfyUI-compatible or a small built-in server), hosted providers by key.
   *Acceptance:* Atelier works fully offline for non-generative editing; for each model, the license name and link are shown before first use.
7. **File format and interchange.**
   An open, documented layered format; import and export PNG, JPEG, WebP, TIFF and SVG; PSD import of basic layers (read-only best effort, from the public specification).
   *Acceptance:* the native format round-trips without loss; provenance metadata can be embedded on export (C2PA content credentials, v0.5).

## Not in v1

- Video editing, 3D and painting-focused brush engines beyond a solid default set.
- PSD export and full PSD feature parity.
- Plugin system.
- Real-time collaboration.
- RAW photo development (later, or via integration with darktable/RawTherapee as external tools).

## Architecture

- **Stack:** web app (TypeScript) with a WebGPU compositing engine and a WebGL2 fallback; image processing in Rust compiled to WebAssembly where speed matters; optional desktop wrapper (Tauri) for local file access. Accounts, cloud files and team libraries use Next.js, Postgres with row-level security, Prisma and S3-compatible storage, but the editor runs without a server.
- **Data model sketch:** `Document` (size, color profile, bit depth), `Layer` (type, blend, mask, transform, provenance), `Adjustment`, `VectorPath`, `HistoryStep`, `GenerationRecord` (model, license, prompt, seed, inputs hash), `Library`, `Asset`.
- **Where AI runs:** segmentation can run in the browser (ONNX Runtime Web); inpainting, outpainting and image generation run on a local companion server with a GPU or on a hosted provider. The editor sends only the selection and its context region, not the whole document, unless asked.
- **Leash fit:** hosted generation calls are metered with spend caps per user and studio, and recorded in the audit log. Uploads of client images to a hosted model are a "leaves the device" action that can require approval per workspace policy.
- **Self-host story:** the editor is a static web app; the companion model server is a docker image with GPU support; team features use docker compose.

## Relationship to ShapesOS

Atelier is a new product rather than an extraction, but it shares pieces with ShapesOS Design (both AGPL-3.0).

- `lib/design/background-removal.ts`: ShapesOS already runs background removal in the browser with no image leaving the device; Atelier's remove-background tool starts from it.
- `lib/images/` (`tool.ts`, `batch.ts`, `openai.ts`): image generation behind a spend gate and metering, with an honest "not configured" state instead of a fake image.
- `lib/design/svg-sanitize.ts` and `lib/design/export-svg.ts`: SVG safety and export.
- `app/dashboard/studio/`: when embedded in ShapesOS, Atelier opens as an advanced editor for images placed in Studio or Collage designs.

## Clean-room sources

- Behavior is specified only from public information: Adobe's public help pages, feature pages, pricing pages, tutorials and demo videos, and ordinary hands-on use. The PSD reader is written from Adobe's publicly available file format specification.
- We never decompile, trace or copy proprietary code, UI assets, icons, copy or trademarks. Tool names are original (for example "Fill from prompt", not another vendor's feature names).
- Reused open source and models, with licenses: Graphite editor (Apache-2.0) as an architecture reference; GIMP/GEGL (GPL-3.0+/LGPL-3.0+) and Krita (GPL, verify version) as references only; Potrace (GPL-2.0-or-later, verify license) is compatible with AGPL-3.0 if we include it; @imgly/background-removal, already used in ShapesOS (AGPL-3.0, verify license); Segment Anything / SAM 2 (Apache-2.0); LaMa inpainting (Apache-2.0); FLUX.1 [schnell] (Apache-2.0). FLUX.1 [dev] is under a non-commercial license and Stable Diffusion models use RAIL-style or community licenses with use restrictions; Atelier shows these terms and does not bundle them by default (verify license per model).

## Risks

- **Legal:** generated images can reproduce protected content; model licenses carry use restrictions; some jurisdictions require disclosure of synthetic media. Mitigation: per-layer provenance, optional C2PA credentials, and a curated default model list with permissive licenses.
- **Technical:** high-performance image editing in the browser is hard (memory limits, color management, 16-bit pipelines). Mitigation: tiled rendering, WebGPU first, and a desktop wrapper for large files.
- **Inference cost:** generative fill on hosted GPUs costs real money per call; local inference needs a capable GPU. Mitigation: caps, small-region generation, and clear guidance on hardware.
- **Scope:** the incumbents represent decades of work. v1 must be narrow and excellent at a few workflows rather than broad.

## Milestones

- **v0.1:** layers, masks, basic adjustments, selections, PNG/JPEG/TIFF, open file format, local remove-background.
- **v0.5:** generative fill/expand/remove via companion server and hosted providers, provenance records, vector tools, C2PA export.
- **v1.0:** tracing, 16-bit pipeline, PSD basic import, team libraries, Tauri desktop build, published model license guide.

## Market notes

Prices are third-party or list estimates gathered in October 2026; check Adobe's pricing page for your region.

- Adobe single app from about $22.99/month with 25 monthly generative credits; Creative Cloud Pro about $69.99/month with premium AI credits; standard generative features such as fill and expand reportedly do not draw from the credit pool on Pro. Sources: [Adobe Creative Cloud pricing](https://www.adobe.com/creativecloud/pricing), [We and the Color, Creative Cloud Pro vs Standard 2026](https://weandthecolor.com/adobe-creative-cloud-pro-vs-standard-who-should-upgrade-in-2026/209911), [CostBench, Adobe Creative Cloud](https://www.costbench.com/software/design/adobe-creative-cloud/).
