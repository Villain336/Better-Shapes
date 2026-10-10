# Keepsake

> Every photo you've taken, safe and searchable.

- **Lane:** Photos
- **Status:** Planned (everyday app)
- **License:** AGPL-3.0
- **Open-source alternative to:** Google Photos and iCloud Photos
- **Audience:** Families and anyone with years of photos
- **Built on:** open image and face models run on the person's own server or device; no Leash, because nothing here acts on anyone's behalf

## Summary

Keepsake backs up photos and videos from phones to storage the person controls (a home server, a NAS, or any S3-compatible bucket they own), then makes them easy to find by describing a moment ("kids on the beach at sunset"), by place, or by person. Search, places and memories are worked out on the person's own server or device. Face grouping is treated differently from everything else: it is **off by default**, explained before it is turned on, and scoped per person, because face templates are biometric data in several legal systems. Shared albums let a family collect photos together without anyone handing their library to a third party.

## Why it matters

Most people's photo libraries outgrow the free tier and land in a monthly storage plan, reported at about $1.99 for 100 GB and $9.99 for 2 TB with Google One or iCloud+. The money is modest; the dependence is not. Twenty years of family photos sit with one company, and its machine learning runs on its servers.

The open-source answer already exists and is very good:

- **Immich** (AGPL-3.0) is a popular, fast-moving self-hosted Google Photos alternative with mobile backup, CLIP-based smart search, face clustering, maps and shared albums.
- **Ente** (AGPL-3.0, verify license) offers end-to-end encrypted photo storage with on-device machine learning.
- **PhotoPrism** (AGPL-3.0, verify license) is another established self-hosted library.

Honestly, Immich covers most of Keepsake's v1 feature list today. **Recommendation:** the studio should contribute to Immich before building a competitor, and pursue Keepsake only if it can be clearly different in ways Immich's maintainers do not want upstream. The candidate differences are:

- **Consent-first face recognition**: off by default, per-person opt-in, easy deletion of face data, and an exportable record of consent, designed for families and small organizations that host photos for others.
- **Optional end-to-end encryption with on-device ML**, so a hosted Keepsake operator cannot see photos.
- **Plain setup** for non-technical families on a single small box.

The v0.1 review is a go/no-go on exactly this point.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| Parent | "Every photo on both our phones backs up automatically, and I never worry about storage plans again." |
| Grandparent | "See the shared family album on my tablet without making an account somewhere new." |
| Person with 50,000 photos | "Find the picture of the red tent from that camping trip by typing it." |
| Family member who doesn't want face tagging | "Keep my face out of the face index, even though I'm in other people's photos." |
| Family IT person | "Run it on one small box and know backups are verified." |

## MVP scope

1. **Automatic phone backup.**
   iOS and Android apps upload new photos and videos in the background (within platform limits), deduplicate by content hash, and keep originals untouched.
   *Acceptance:*
   - A test set of 10,000 photos backs up with zero missing or altered files, verified by hash.
   - Live photos, HEIC, RAW and HDR video keep their original data.
   - Backup works on Wi-Fi only by default.
2. **Storage you control.**
   Local disk, NAS share or an S3-compatible bucket the person owns, with a scheduled integrity check and an export of the whole library with metadata as plain files plus a JSON sidecar.
   *Acceptance:*
   - A full export can be re-imported into a fresh install without loss.
   - The integrity check reports any file whose hash has changed.
3. **Search by description.**
   CLIP-style image and text embeddings computed on the server (or on device in encrypted mode); search in natural language with optional filters for date, place and media type.
   *Acceptance:*
   - Works with network access disabled once models are downloaded.
   - Embedding 50,000 photos finishes within 24 hours on a small home server without a GPU.
   - Results show why they matched when a filter applied.
4. **Places and memories.**
   Map view from EXIF location using an offline reverse-geocoding dataset; "on this day" memories.
   *Acceptance:*
   - No location lookup is sent to an outside service by default.
   - Memories can be turned off per person and never include hidden albums.
5. **Face grouping with consent.**
   Face detection and clustering on the server or device, off until the account owner turns it on after a plain-language explanation. Each person in the household can opt out; named people can ask for their face data to be deleted.
   *Acceptance:*
   - Turning face grouping off deletes all face embeddings, not just hides them.
   - Opt-out people are excluded from clustering, and new detections matching them are discarded.
   - A written retention policy and consent record are generated for hosted instances.
6. **Shared albums.**
   Invite family by link or account; contributors add photos; viewers can comment and like.
   *Acceptance:*
   - Link-shared albums can expire and be revoked.
   - Shared albums never expose face names unless the owner chooses to.

## Not in v1

- Photo editing beyond rotate, crop and basic adjustments (see Atelier for real editing).
- Printing and photo-book services.
- Public sharing to social networks.
- Face recognition across different households or instances. Never planned.
- Hosted storage run by the studio.

## Architecture

- **Stack:** server in TypeScript (NestJS-style) or Go, Postgres with pgvector for embeddings, a job worker for thumbnails, video transcoding (FFmpeg) and ML. Mobile apps in React Native or Flutter; web app in Next.js.
- **Data model sketch:** `Library`, `Asset` (hash, path, type, EXIF, dimensions), `Thumbnail`, `Embedding` (asset, model, vector), `Place`, `Memory`, `Album`, `AlbumMember`, `Person` (name, consent status), `Face` (asset, box, embedding, person), `ConsentRecord` (who, what, when, method), `IntegrityCheck`, `ExportJob`.
- **Where AI runs:** on the server, or on the device in encrypted mode.
  - Search: an open CLIP-family model (for example OpenCLIP, MIT code, or SigLIP, Apache-2.0; weights carry their own licenses, verify license) exported to ONNX.
  - Faces: an open face detector and embedding model, clustered with a density-based algorithm. Several popular face models are licensed for non-commercial research only; choose one whose weights allow this use (verify license).
  - Places: an offline geonames-based dataset (verify license).
- **Encrypted mode:** photos are encrypted on the device before upload with keys the server never holds; ML runs on device and only encrypted embeddings are synced. Built on an established library (libsodium), never new cryptography.
- **Self-host story:** one `docker compose up` with app, Postgres, worker and ML container; a single-box guide for non-technical families.

## Relationship to ShapesOS

Little overlap; Keepsake is a consumer app. `lib/images/` in ShapesOS handles image generation, not libraries, so it is not a source. The consent patterns in `lib/messaging/` (`consent.ts`) and `lib/voice/` (`consent.ts`) are useful references for recording consent (both AGPL-3.0).

## Clean-room sources

- Behavior is specified only from public information: Google Photos and iCloud Photos help pages, Immich and Ente public docs, published research papers on CLIP and face clustering, and ordinary use.
- We never decompile, trace or copy proprietary code, UI assets, icons, copy or trademarks.
- Reused open source with licenses: Immich (AGPL-3.0) as reference and possible code source with notices kept; pgvector (PostgreSQL License); FFmpeg (LGPL-2.1 or GPL depending on build); libsodium (ISC); OpenCLIP (MIT); model weights per their own licenses (verify license per model).

## Risks

- **Legal (biometrics):** face templates are biometric data.
  - In Illinois, BIPA requires informed written consent (electronic consent is allowed since the 2024 amendment), a public retention and destruction policy, and bars selling biometric data; damages are $1,000 per negligent and $5,000 per intentional or reckless violation, now counted per person rather than per scan. Major photo services have faced large BIPA class actions over face grouping.
  - In the EU and UK, GDPR treats biometric data used to uniquely identify a person as special-category data (Article 9), which needs explicit consent or another Article 9 condition, plus a data protection impact assessment for large-scale processing. Purely personal or household use falls outside GDPR (Article 2(2)(c)), but an operator hosting libraries for others does not.
  - Texas and Washington have their own biometric laws.
  - Mitigation: face grouping off by default, per-person opt-out and deletion, consent records, a retention policy template, and documentation that hosted operators are the data controller.
- **Data loss:** a backup product that loses photos fails at its one job. Mitigation: never modify originals, verify hashes, integrity checks, and a documented second-copy backup.
- **Ecosystem:** Immich is strong and moving fast. Mitigation: the go/no-go review, and contributing upstream where Keepsake would only duplicate.
- **Platform limits:** iOS restricts background uploads. Mitigation: be honest in the UI and use the allowed background APIs.
- **Name:** "Keepsake" is a common word used by other apps; trademark check before launch.

## Milestones

- **v0.1:** backup from Android and iOS, storage backends, integrity check, export, web timeline. **Decision point:** continue Keepsake or contribute the differences to Immich.
- **v0.5:** natural-language search, places, memories, shared albums.
- **v1.0:** consent-first face grouping, encrypted mode with on-device ML, single-box setup guide, external privacy review published.

## Market notes

Prices are third-party estimates gathered in October 2026.

- Google One: reported $1.99/month for 100 GB and $9.99/month for 2 TB in the US; iCloud+: reported $0.99 (50 GB), $2.99 (200 GB) and $9.99 (2 TB) per month. Sources: [Internxt, Google One pricing](https://blog.internxt.com/google-one-pricing/), [Subtracker, Google One vs iCloud+](https://subtracker.io/compare/google-one-vs-icloud). Verify current US prices on the official pages.
- Immich: AGPL-3.0, per the LICENSE file in [immich-app/immich](https://github.com/immich-app/immich).
- Ente and PhotoPrism: AGPL-3.0 to our knowledge; verify license at [ente-io/ente](https://github.com/ente-io/ente) and [photoprism/photoprism](https://github.com/photoprism/photoprism).
- Illinois BIPA 2024 amendment (per-person damages, electronic consent): [Thompson Hine](https://www.thompsonhine.com/insights/illinois-legislature-amends-bipa-to-limit-damages-and-expand-consent-options/), [Fisher Phillips](https://www.fisherphillips.com/en/insights/insights/breaking-bipa-news-illinois-curtails-massive-damage-awards-in-biometric-cases).
- GDPR Article 9 (special categories) and Article 2 (household exemption): [EUR-Lex, Regulation (EU) 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/oj).
