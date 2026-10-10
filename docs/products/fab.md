# Fab

> Describe a part. Get a model you can make.

- **Lane:** AI-native CAD
- **Status:** Planned (eighth in the build order)
- **License:** AGPL-3.0
- **Open-source alternative to:** SolidWorks and Fusion
- **Audience:** Engineers, makers and hardware startups
- **Built on:** the ShapesOS CAD module, an open B-rep geometry kernel, and Leash (MIT) for AI edits and order approvals

## Summary

Fab is parametric CAD in the browser. Parts are built from sketches and features (extrude, revolve, fillet, chamfer, shell, hole, pattern) whose dimensions stay editable, and every change is saved as a version that can be compared and reviewed. An AI design assistant turns a description such as "a wall bracket for a 40 mm pipe, two M5 holes, 3 mm thick" into a feature history a person can inspect and edit, not a frozen mesh. Parts export to STEP for machining and to STL or 3MF for printing. Fab grows out of the ShapesOS CAD module, which already handles viewing, versioning, diffs and share links, and it is the studio's bridge from software to physical things.

## Why it matters

Professional CAD is expensive and mostly desktop-bound. SolidWorks is sold through resellers and does not publish prices; third-party listings put entry subscriptions around $2,800 per year. Autodesk Fusion is reported at about $680 per year. For a hardware startup, seats for every engineer plus add-ons add up, and design history lives in proprietary formats.

Open source wins because the geometry kernel is already open (OpenCascade powers FreeCAD and many tools), browser technology can now run it, and parametric models written as code are a natural fit for AI assistance. An open, text-based feature history also makes design review work like code review: diffs, comments and approvals.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| Mechanical engineer | "Model a part parametrically, change one dimension, and have everything update correctly." |
| Maker | "Describe a simple part and get something printable today without learning a big CAD package." |
| Hardware startup | "Keep every revision of our parts reviewable and exportable, without per-seat lock-in." |
| Reviewer / manufacturer | "See exactly what changed between revisions before cutting metal." |

## MVP scope

1. **Sketcher.**
   2D sketches on planes and faces with lines, arcs, circles, splines, and constraints (coincident, parallel, perpendicular, tangent, equal, dimension).
   *Acceptance:* the constraint solver shows fully, under and over constrained states; sketches with 200 entities solve in under 100 ms.
2. **Part features.**
   Extrude, revolve, fillet, chamfer, shell, hole (with standard metric sizes), linear and circular pattern, mirror, boolean.
   *Acceptance:* editing an early feature's dimension rebuilds the model; failed rebuilds point to the failing feature with a plain-language reason.
3. **Parameters and expressions.**
   Named parameters and simple expressions shared across features.
   *Acceptance:* changing a parameter rebuilds all dependent features; parameters export as a table.
4. **AI design assistant.**
   From a description, propose a feature history (sketches, features, parameters); also explain or modify an existing model on request.
   *Acceptance:* the assistant's output is a proposal shown as a diff of the feature tree; nothing applies until accepted; the result is always parametric and editable.
5. **Versioning and review.**
   Immutable versions, compare any two (feature tree diff plus geometry diff), comments pinned to geometry, review approval.
   *Acceptance:* comparing two versions shows changed features and the volume and bounding-box change; a version marked "released" cannot be edited, only superseded.
6. **Export and import.**
   Export STEP AP214/AP242, STL, 3MF and the native format; import STEP and STL for reference geometry.
   *Acceptance:* exported STEP files open in FreeCAD and a commercial CAD viewer with matching dimensions; 3MF files open in PrusaSlicer and OrcaSlicer.
7. **Manufacturability checks.**
   Basic checks for 3D printing (wall thickness, overhangs) and CNC (minimum internal radius, tool access hints).
   *Acceptance:* each warning links to the region on the model and explains the rule in one sentence.

## Not in v1

- Assemblies with mates and motion (v1.x after parts are solid).
- 2D drawings with GD&T.
- Simulation (FEA, CFD) and CAM toolpaths.
- Sheet metal and surfacing.
- Direct ordering from manufacturers (later, behind Leash approvals: an order spends money and goes to the outside world).

## Architecture

- **Stack:** Next.js and TypeScript; the geometry kernel is OpenCascade compiled to WebAssembly (via opencascade.js), with replicad as a TypeScript modeling layer; three.js for rendering; a constraint solver in WebAssembly; Postgres with row-level security and Prisma; S3-compatible storage. Heavy rebuilds and exports can run on a server worker with the same kernel.
- **Data model sketch:** `Project`, `Part`, `Version` (immutable), `FeatureTree` (ordered features with parameters, stored as JSON), `Sketch`, `Parameter`, `GeometryCache` (tessellated mesh per version), `Comment` (anchored to face/edge ids), `Review`, `Export`, `CheckResult`, `AuditEvent`.
- **Where AI runs:** the assistant is a server-side agent that writes feature-tree operations through a typed tool interface (create sketch, add constraint, extrude) and checks its own result by rebuilding. The model never writes raw geometry.
- **Leash fit:** AI edits are proposals applied only on accept; releasing a version is an approval; sending files to an outside manufacturer or placing an order (post-v1) is high risk and always approval-gated, with spend caps.
- **Self-host story:** docker compose with app, Postgres, MinIO and an optional kernel worker; the editor runs mostly in the browser, so small installs need little server power.

## Relationship to ShapesOS

Fab grows out of the ShapesOS CAD module (both AGPL-3.0).

- `lib/cad/` (`types.ts`, `geometry.ts`, `diff.ts`, `prisma-store.ts`, `project-store.ts`, `design-proposals.ts`, `ai-store.ts`, `manufacturability.ts`, `prototype.ts`, `bom-derive.ts`, `hardware.ts`): format sniffing from bytes, mesh stats, honest diffs ("not computable" instead of guesses), immutable versions, fail-closed share links, AI design proposals and manufacturability estimates. `lib/cad/README.md` documents the slice-1 design.
- `app/dashboard/cad/views/` (`CadViewer.tsx`, `CompareTab.tsx`, `ProposalsTab.tsx`, `ManufacturingTab.tsx`, `PrototypeTab.tsx`, `ShareLinksTab.tsx`, `BomDerivePanel.tsx`): the existing CAD screens.
- ShapesOS CAD today views and versions STL/OBJ/STEP but does not model; Fab adds the kernel and modeling, and ShapesOS can embed Fab's editor in place of the viewer.
- `lib/twin/` and `lib/physical/`: digital twin and physical-world bundles, the longer-term bridge to shop floors.

## Clean-room sources

- Behavior is specified only from public information: SolidWorks and Fusion public help, feature pages, pricing pages, tutorials and demo videos, and ordinary hands-on use of trial or free licenses. File formats are implemented from public standards (ISO 10303 STEP, the 3MF specification).
- We never decompile, trace or copy proprietary code, UI assets, icons, copy or trademarks. Feature names follow generic engineering terms (extrude, fillet) and screen names are original.
- Reused open source with licenses: Open CASCADE Technology (LGPL-2.1 with an additional exception, compatible with AGPL-3.0); opencascade.js (LGPL-2.1, verify license); replicad (MIT, verify license); three.js (MIT); lib3mf (BSD-2-Clause) for 3MF; Manifold (Apache-2.0) as an optional fast mesh boolean library; FreeCAD (LGPL-2.0-or-later) and CadQuery/build123d (Apache-2.0) as public references. Open-RMF (Apache-2.0) is a later option for coordinating robots and machines on a shop floor, not part of v1.

## Risks

- **Legal:** low on code if the license list holds; parts made from Fab models can fail in the real world. Fab states clearly that it does not certify designs, and released versions record who approved them.
- **Technical:** robust B-rep modeling is very hard; topological naming (features referencing faces that change after edits) is a known problem in open CAD. Mitigation: start with a narrow feature set, study FreeCAD's public work on this, and add rebuild regression tests from real parts.
- **Inference cost:** assistant sessions involve several model calls and rebuilds; moderate per session. Mitigation: per-session caps and small models for simple edits.
- **Performance:** WebAssembly kernels are slower than native; large parts may need the server worker.

## Milestones

- **v0.1:** sketcher with constraints, extrude/revolve/fillet, parameters, STL and STEP export, built on top of ShapesOS CAD versioning.
- **v0.5:** full v1 feature set for single parts, version compare with feature diff, comments and review, 3MF export, manufacturability checks.
- **v1.0:** AI design assistant with proposal diffs, STEP import, server kernel worker, ShapesOS embedding, assemblies design doc.

## Market notes

Prices are third-party estimates gathered in October 2026; SolidWorks pricing comes from resellers.

- SolidWorks: entry subscription listed around $2,820 per year. Source: [G2, SolidWorks pricing](https://g2.com/products/solidworks/pricing).
- Autodesk Fusion: entry subscription listed around $680 per year. Source: [G2, Autodesk Fusion comparison](https://www.g2.com/compare/autodesk-fusion-vs-sketchup-vs-solidworks).
- Both vendors offer free or low-cost licenses for hobbyists, students or startups with restrictions; check current terms.
