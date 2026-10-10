# Snip

> Long videos in, scroll-stopping clips out.

- **Lane:** Video repurposing
- **Status:** Planned (fourth in the build order, extracted from ShapesOS Clips)
- **License:** AGPL-3.0
- **Open-source alternative to:** OpusClip
- **Audience:** Creators, podcasters and marketing teams
- **Built on:** ShapesOS Clips (`lib/clipper`); Leash (MIT) for publish approvals and spend caps

## Summary

Snip takes a long video, such as a podcast, webinar or talk, and finds the moments most likely to work as short clips. It cuts them, reframes them to vertical by following the speaker, adds animated captions in the brand's style, and drafts a post for each clip. Nothing is published until a person approves it. Each suggested clip shows why it was chosen, with a score broken into understandable parts, so the editor can disagree quickly. Snip grows out of the Clips module in ShapesOS, which already has transcription, scoring, selection, reframing and captions.

## Why it matters

Clip tools charge by the minute of uploaded video. OpusClip's reported plans run from a free tier with watermarks to about $15 to $29 per month for 150 to 300 minutes, with credits that expire. A weekly two-hour podcast uses most of a paid plan by itself, and the long tail of a back catalog is out of reach.

Open source wins because every step of the pipeline now has good open components: Whisper-class transcription, face tracking, FFmpeg for rendering. The remaining value is in the scoring and the editing experience, which an open project can improve in public. Self-hosting removes per-minute pricing entirely; a creator with a GPU can process an entire archive.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| Podcaster | "Turn each episode into ten good clips without scrubbing through two hours." |
| Marketing team | "Repurpose webinars into short videos in our brand style, approved before posting." |
| Creator | "Get vertical clips with readable captions that follow whoever is talking." |
| Agency | "Run the same process for several clients with their own templates." |

## MVP scope

1. **Import.**
   Upload files (up to 4 hours) or import from a URL the user has rights to (YouTube via the official API for the user's own channel, direct links).
   *Acceptance:*
   - Uploads resume after interruption.
   - The user confirms they have rights to the content before processing.
2. **Transcription.**
   Word-level timestamps, speaker labels, 20+ languages via open models.
   *Acceptance:*
   - Transcript is editable and edits flow into captions.
   - No transcript is ever faked when no provider is configured.
3. **Highlight detection with scoring.**
   Candidate segments of 15 to 90 seconds scored on hook strength, self-containedness, emotional or informational payoff, and pacing.
   *Acceptance:*
   - Each clip shows its overall score and the sub-scores with a one-line reason each.
   - The user can re-rank by any sub-score.
4. **Clip editor.**
   Adjust start/end on word boundaries, trim filler words, reorder, split.
   *Acceptance:*
   - Boundary changes snap to words.
   - Preview plays within one second of a change.
5. **Auto reframe.**
   Convert 16:9 to 9:16, 1:1 or 4:5 by tracking the active speaker's face; split-screen layout for two speakers.
   *Acceptance:*
   - The subject stays in frame for at least 95% of frames in the reference test set.
   - The user can override the crop per section.
6. **Animated captions.**
   Word-by-word highlighted captions with style presets and brand fonts; export burned-in or as SRT/ASS.
   *Acceptance:*
   - Captions stay within platform safe zones for each target aspect ratio.
7. **Brand templates.**
   Fonts, colors, logo, intro/outro cards, caption style per brand.
   *Acceptance:*
   - Applying a template to 20 clips renders consistently.
   - Templates can be exported and shared.
8. **Draft-for-approval publishing.**
   Draft caption, title and hashtags per clip; publish or schedule to connected accounts after approval.
   *Acceptance:*
   - No post leaves Snip without an approval record in the Leash queue.
   - Scheduled posts can be cancelled until they go out.

## Not in v1

- Full multi-track timeline editing (Snip is not a general video editor).
- B-roll generation and AI avatars.
- Dubbing and voice translation (later, through ShapesOS Voice).
- Live-stream clipping.
- Downloading videos from platforms whose terms forbid it.

## Architecture

- **Stack:** Next.js and TypeScript; Postgres with row-level security and Prisma; S3-compatible storage; a media worker (Node orchestrating FFmpeg, plus a Python sidecar for transcription and face tracking); a job queue with progress events.
- **Data model sketch:** `Source` (video, rights confirmation), `Transcript`, `Word`, `Speaker`, `Candidate` (start, end, scores, reasons), `Clip` (edits, aspect, crop track), `CaptionStyle`, `BrandTemplate`, `Render`, `PostDraft`, `ScheduledPost`, `Approval`, `AuditEvent`.
- **Where AI runs:** transcription (faster-whisper or whisper.cpp) and face tracking (MediaPipe) on the worker; scoring combines simple signal features (pauses, speech rate, laughter, keywords) with an LLM judgment on the transcript window; caption copy and post drafts by LLM.
- **Leash fit:** rendering is local and unmetered; hosted transcription and LLM scoring are metered against caps; publishing to a social account is high risk and requires approval.
- **Self-host story:** docker compose with app, Postgres, MinIO and a worker; a GPU worker image speeds transcription. Demo mode ships with a short, studio-owned sample video.

## Relationship to ShapesOS

Snip is a direct extraction of ShapesOS Clips (both AGPL-3.0).

- `lib/clipper/` (`transcribe.ts`, `score.ts`, `select.ts`, `reframe.ts`, `captions.ts`, `types.ts`, `index.ts`): the existing pipeline: word-timed transcription with an honest not-configured error, segment scoring, clip selection, FFmpeg reframe filter building with a face-tracker hook, and SRT/ASS caption generation.
- `app/dashboard/clips/` (`ClipsApp.tsx`, `api.ts`): the current Clips screen; `app/api/clipper/` holds the pipeline routes.
- `lib/social/` and `app/dashboard/social/`: publishing (through the Postiz sidecar) when Snip is embedded.
- `lib/approvals/`: drafts appear in the shared approvals inbox when embedded.
- `lib/design/fonts.ts` and `lib/brand-theme.ts`: fonts and brand theming for caption styles.

Extraction plan: move `lib/clipper` into a package consumed by both ShapesOS and Snip, then build Snip's editor and templates on top.

## Clean-room sources

- Behavior is specified only from public information: OpusClip's public help center, pricing page, marketing pages, demo videos and ordinary hands-on use.
- We never decompile, trace or copy proprietary code, UI assets, icons, caption style presets, copy or trademarks. Our score names and caption presets are original; the score is ours and is not presented as equivalent to any vendor's metric.
- Reused open source: FFmpeg (LGPL-2.1+ by default, GPL if built with GPL components; verify the build we ship); faster-whisper (MIT); whisper.cpp (MIT); MediaPipe (Apache-2.0); Postiz as an integration (AGPL-3.0, run as a separate service); Leash (MIT).

## Risks

- **Legal:** users may upload content they do not own; require rights confirmation and respond to takedown requests on the hosted version. Platform terms restrict downloading and automated posting; use official APIs only.
- **Technical:** reframing fails on unusual shots (screen shares, wide panels); scoring quality is subjective. Mitigation: per-section manual crop override, and user feedback on clips used to tune scoring weights per workspace.
- **Inference cost:** transcription is the largest cost on hosted providers; rendering is CPU-heavy. Mitigation: local transcription by default, render queues with limits, and caching of transcripts.
- **Name:** "Snip" is used by other tools (for example screenshot utilities); trademark check before launch.

## Milestones

- **v0.1:** `lib/clipper` extracted as a package; upload, transcription, scored candidates with reasons, basic vertical render with captions.
- **v0.5:** clip editor on word boundaries, face-tracking reframe, brand templates, caption styles, self-host compose with GPU image.
- **v1.0:** draft-for-approval publishing and scheduling, split-screen layouts, YouTube import for own channel, ShapesOS re-embedding via the shared package.

## Market notes

Prices are third-party estimates gathered in October 2026.

- OpusClip: Free (60 credits/month, watermark), Starter (~$15/month, 150 credits), Pro (~$29/month, 300 credits), Business (custom); one credit is reported as one minute of uploaded video, and monthly credits expire. Sources: [Creatify, OpusClip pricing 2026](https://creatify.ai/blog/opusclip-pricing-plans-and-what-you-ll-actually-pay-in-2026), [Castmagic, OpusClip pricing 2026](https://www.castmagic.io/fr/blog/opus-clip-pricing), [Klap, OpusClip pricing](https://klap.app/blog/opus-clip-pricing).
- Some of these sources are competitors; check OpusClip's pricing page.
