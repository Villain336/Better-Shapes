# Daydream

> Free AI-made movies and series, and episodes made just for you.

- **Lane:** Streaming service
- **Status:** Planned (everyday app; commercial service)
- **License:** Proprietary service. Only the creator tools may be released as open source (license to be decided)
- **Commercial alternative to:** Tubi and Netflix-style streaming services
- **Audience:** Viewers who want something new to watch for free, families, and independent AI filmmakers
- **Built on:** HLS/CMAF streaming through a CDN, server-side ad insertion, Stripe billing, and hosted video, voice and music generation APIs

## Summary

Daydream is a streaming service where every title is AI-generated. It works like Tubi: the whole catalog is free to watch with ads. Paid plans remove ads and add a monthly allowance of **personalized episodes**: a viewer writes "make me a series about a lighthouse keeper who talks to whales" and, some time later, gets an episode made for them alone, with a series bible so the next episode remembers the characters. Creators can apply to publish their own AI series and earn a share of revenue by watch time. Better Shapes launches the service with three originals: **Meadowlight** (a gentle sci-fi drama), **Shipped** (a startup comedy) and **Low Orbit** (an animated adventure for all ages).

Every title is labeled as AI-generated and carries C2PA content credentials. Personalized episodes can never show real or identifiable people.

Matinee is a different product: an open-source media center for films people own, while Daydream is a commercial service for AI-made originals, and the two share no code.

## Why it matters

Free, ad-supported streaming is a big and proven business. Tubi reports 110 million monthly viewers and more than $1 billion in yearly revenue, with no subscription at all. What it cannot do is make something that did not exist this morning, for one person.

Generated video is now good enough for short, stylized scenes, and it is getting cheaper every quarter. Two honest caveats shape this spec:

- **Personalized video is expensive.** At October 2026 API prices, one finished minute of full-motion video costs several dollars to make (see "Plans and unit economics"). The draft plans lose money badly, and this spec proposes smaller allowances and a cheaper "storyboard" format instead of pretending otherwise.
- **People are wary of AI entertainment.** Writers, actors and audiences have real concerns about consent, credit and jobs. Daydream's answer is strict labeling, no likenesses without written consent, no cloned voices, and a creator program that pays people rather than replacing them.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| Free viewer | "Something new and watchable tonight, free, without signing up for another subscription." |
| Plus subscriber | "No ads, and a short episode of the exact story I'm in the mood for." |
| Parent | "A kids profile that only shows titles a person has reviewed." |
| AI filmmaker | "Publish my series where people actually watch, and get paid fairly for the minutes they watch." |
| Advertiser | "Brand-safe placements next to clearly labeled content, measured honestly." |

## MVP scope

1. **Free catalog with ads.** Browse, search and play the originals on the web, with mid-roll ads stitched server-side.
   *Acceptance:* playback starts in under 3 seconds on a normal broadband connection; every title page shows the AI-generated label and a link to inspect its content credentials.
2. **Profiles and kids mode.** Up to five profiles per account; kids profiles show only titles marked reviewed-for-kids.
   *Acceptance:* a kids profile cannot reach other titles through search, deep links or recommendations; kids profiles get contextual ads only, never behavioral ones.
3. **Plus and Studio plans.** Stripe checkout on the web, ad-free playback, and a monthly allowance of personalized minutes that does not roll over.
   *Acceptance:* the allowance balance is shown before every request, and a request that would exceed it is refused before any generation starts.
4. **Personalized episodes.** Prompt to finished episode through the pipeline below, delivered asynchronously.
   *Acceptance:* the viewer is told the expected wait up front; a failed episode refunds its minutes automatically; no episode is ever shown without passing the safety and QA checks.
5. **Series memory.** Each personalized series keeps a bible (characters, look, voice choices, world rules) so later episodes stay consistent.
   *Acceptance:* the viewer can read and edit the bible in plain words; edits apply from the next episode.
6. **Creator program (v1.0).** Application, review, publishing tools, watch-time analytics and monthly payouts.
   *Acceptance:* a creator sees the same watch-time numbers that drive their payout, and every payout batch is approved by a person.
7. **TV apps (v1.0).** Android TV / Google TV and Fire TV first, then Roku and Apple TV.
   *Acceptance:* sign-in by code on a phone; no purchases inside TV apps until each store's rules and fees are reviewed.

## Plans and unit economics

**Draft plans (to validate):** Free with ads. **Plus** about $9.99/month: ad-free plus 60 personalized minutes. **Studio** about $24.99/month: 240 minutes, higher resolution, publishing tools. Minutes do not roll over.

**Cost of one finished minute.** All numbers are third-party or vendor list prices gathered in October 2026 (see "Market notes"); they change often. The pipeline assumes 1.5 generated seconds per finished second (retakes after QA failures), which is our own assumption to measure in v0.5.

| Video route (vendor list price per generated second) | Video per finished minute | Other costs | Total per finished minute |
|---|---|---|---|
| Luma Ray3.2, 540p ($0.03) | $2.70 | $0.80 | **$3.50** |
| Google Veo 3.1 Lite, 720p ($0.05) | $4.50 | $0.80 | **$5.30** |
| Runway Gen-4 Turbo ($0.05) | $4.50 | $0.80 | **$5.30** |
| Kling Standard 720p, no audio ($0.084) | $7.56 | $0.80 | **$8.36** |
| Google Veo 3.1 Fast, 1080p ($0.12) | $10.80 | $0.80 | **$11.60** |
| Google Veo 3.1, 1080p ($0.40) | $36.00 | $0.80 | **$36.80** |

OpenAI's Sora 2 API was listed at $0.10 to $0.70 per second, but OpenAI's docs say the Sora models and Videos API were shut down on September 24, 2026, so it is not an option. That is also a reminder to keep every provider behind one adapter.

"Other costs" per finished minute: voice $0.05 (ElevenLabs Flash about $0.04/min; Gemini 3.8 Flash TTS about $0.014/min), music $0.15 (Eleven Music $0.15/min; Lyria $0.08 per song), reference keyframe images $0.40 (about 12 per minute at roughly $0.03 each; our estimate, verify), LLM writing, continuity and QA checks $0.15 (our estimate), and encoding, storage and delivery $0.05 (our estimate).

**Do the draft plans have positive margin? No.**

| Plan | Price | Net after Stripe fees (2.9% + $0.30) and about $1 of ads no longer shown | Generation cost if fully used | Result at full use |
|---|---|---|---|---|
| Plus (draft) | $9.99 | $8.40 | 60 × $5.30 = $318 | about −$310 |
| Studio (draft) | $24.99 | $22.97 | 240 × $11.60 = $2,784 | about −$2,760 |

Even the cheapest route ($3.50) puts the draft Plus plan at −$200, and assuming only a quarter of minutes get used still loses about $70 per subscriber. The "$1 of ads" comes from Tubi's reported revenue divided by its reported viewing hours, about $0.08 per hour (our derived estimate), times roughly 12 hours a month.

**Proposed instead.** Add a cheaper **storyboard** format: illustrated keyframes with camera moves, real voices, music and subtitles, at about $1.00 per finished minute (images with retakes plus the other costs; our estimate). Allowances are counted in credits: 1 storyboard minute = 1 credit, 1 full-motion 720p minute = 6 credits.

| Plan | Price | Allowance | Net revenue | Cost if fully used | Margin at full use |
|---|---|---|---|---|---|
| Free | $0 | Catalog with ads | ads | none | positive if catalog costs are recovered (below) |
| Plus | $9.99 | Ad-free + 6 credits | $8.40 | $6.00 | $2.40 (29%) |
| Studio | $49.99 | Ad-free + 36 credits, 1080p finishing, publishing tools | $47.24 | $36.00 | $11.24 (24%) |
| Top-up | $9.99 | 6 credits | $9.40 | $6.00 | $3.40 (36%) |

Credits do not roll over. Revisit these numbers every quarter: if per-second prices keep falling, raise allowances rather than cut prices.

**Catalog titles are a different shape.** A 22-minute original at Veo 3.1 Fast 1080p with three takes per shot costs about $475 in video plus about $50 in other generation, before human writing and editing time. At about $0.08 of ad revenue per viewing hour, it needs roughly 6,600 viewing hours (about 18,000 full views) to pay back its generation cost. A shared title is made once and watched many times; a personalized one is made for a single viewer.

**Levers that lower cost:**
- Draft at 540p or storyboard first; spend full-motion and 1080p only on shots that survive review.
- Reuse shots: establishing shots, transitions and recurring locations come from a per-series shot library.
- Cache catalog generations: a scene generated for a published title is never generated twice, and popular personalized premises can seed new catalog titles (with the viewer's permission).
- Limit episode length: personalized episodes are 2 to 5 minutes in v0.5.
- Route by price: one adapter per provider, chosen per shot by cost and quality, with spend caps per request.
- Use batch or off-peak pricing where providers offer it (verify per provider).

## Personalized episode pipeline

Each step is an idempotent job, so a retry never charges twice.

1. **Viewer prompt.** Free text plus optional genre, tone and length. Credits are reserved, not spent.
2. **Safety check.** Refuses real or identifiable people, public figures, copyrighted characters, sexual content involving minors, and other policy violations, and explains the refusal in plain words.
3. **Series bible and episode outline (LLM).** Characters, look, voices, world rules; then a beat outline for this episode.
4. **Shot list.** Per shot: description, camera, characters present, dialogue, duration, and whether a library shot can be reused.
5. **Video generation.** Reference keyframes first, then motion (or storyboard camera moves), through the provider adapter with a per-request spend cap.
6. **Voice.** Text-to-speech from a fixed list of licensed stock voices; never a cloned voice. ShapesOS VoiceStudio is an option once it runs on production hardware (see "Relationship to ShapesOS").
7. **Music.** Generated score from a provider whose terms allow commercial streaming use (verify per provider).
8. **Subtitles.** From the script, aligned to the audio.
9. **Continuity check.** A vision-language model compares shots against the bible (character look, names, setting) and flags contradictions.
10. **Automated QA heuristics, no human in the loop.** Black or frozen frames, audio-video length mismatch, loudness out of range, faces that match a public-figure check, text artifacts, and a second safety pass on the finished video.
11. **"Your episode is ready."** Notification by email or in the app; the episode is signed with C2PA credentials before delivery.

**Failure handling and refunds.** A failed shot is retried up to twice, then replaced with a storyboard shot. If the episode still fails QA, or the run exceeds its spend cap, the job stops, the viewer is told what happened, and the reserved credits are released in full. A viewer can report a finished episode as broken within 7 days for an automatic refund of its credits, limited to a few refunds a month to discourage abuse. Refusals at the safety check never consume credits.

## Creator program

- **Application.** Portfolio link, a sample episode, the tools and models used, and agreement to the creator warranties. Studio plan not required to apply.
- **Review criteria.** Watchable quality, a coherent series idea, a clean rights story for every asset, and correct labeling. Reviewed by a person, not only a model.
- **Publishing.** Upload or publish from Studio; every title passes moderation before release and is signed with content credentials. Kids eligibility is a separate human review.
- **Revenue share (proposal).** Each month, creators receive **55% of net ad revenue** earned on their titles (after ad-tech and insertion fees), plus a **Plus pool**: 40% of Plus net revenue (after payment fees and generation costs), multiplied by the share of Plus viewing time spent on creator titles, split by watch time. Why: 55% matches the long-form share creators already know from YouTube (widely reported; verify), creators pay their own generation costs, and pro-rata by watch time is simple to explain and audit. Watch time counts only after 30 seconds of continuous play, with per-account daily caps and bot filtering. New creators have a 60-day payout hold. Payouts go through Leash approvals.
- **Creator warranties.** The creator owns or has licensed everything they publish; uses no real person's likeness or voice without that person's written consent (on file with us); uses no copyrighted characters or settings; licenses all music, including generated music, for commercial streaming; and follows the terms of every model they used.
- **Strikes.** A confirmed violation is a strike that expires after 90 days. One strike removes the title; two pause publishing and payouts for 30 days; three in 90 days end the account and forfeit unpaid earnings from infringing titles. Child sexual abuse material and non-consensual intimate imagery end the account at once and are reported as the law requires. Every strike can be appealed.

## Trust & safety

- **Labels and provenance.** Every title shows "AI-generated" on its page and in the player, and carries C2PA content credentials naming Daydream and the models used.
- **Moderation before publish.** Catalog and creator titles are reviewed by automated checks and a person before release. Personalized episodes are checked automatically before delivery.
- **No real people in personalized episodes.** They can never depict real or identifiable people or public figures, even with claimed consent. Prompts naming a person are refused, and faces are checked after generation.
- **Kids.** Kids profiles show human-reviewed titles only, cannot request personalized episodes in v1, and get contextual ads only.
- **Takedown and appeals.** A report button on every title; a published policy with response times; decisions explained in plain words; appeals reviewed by a different person.
- **DMCA.** A registered designated agent, notice and counter-notice, and a repeat-infringer policy for creator titles. Whether safe harbor covers episodes Daydream itself generates is unclear (verify with counsel).

## Not in v1

- Personalized episodes for kids profiles.
- Live channels (FAST-style linear streams), downloads, and watch-together.
- Interactive or branching episodes.
- Voice cloning of any kind, including a viewer's own voice.
- Markets outside the US until COPPA-equivalent and likeness rules are reviewed per country.
- In-app purchases inside TV and mobile store apps.

## Architecture

- **Clients:** Next.js web app; Android TV / Fire TV (one Kotlin codebase), then Roku and Apple TV. A shared player layer reports heartbeats every 10 seconds.
- **Generation:** a Postgres-backed job queue with one row per pipeline step, workers that call provider APIs through adapters (no GPUs needed for v0.5), per-request spend caps, and an object store for shots, bibles and finished masters.
- **Delivery:** FFmpeg encode, Shaka Packager (Apache-2.0) into CMAF segments with HLS (and DASH where needed), served through a CDN.
- **Ads:** server-side ad insertion with VAST/VMAP. Options: AWS Elemental MediaTailor (about $0.25 per 1,000 VOD insertions), Google Ad Manager Dynamic Ad Insertion, or a supply partner's stitcher. Choose on fill rate and data terms, not only price.
- **Billing:** Stripe Billing for plans and top-ups, with Stripe meters for overage reporting. Our own credit ledger is the source of truth; Stripe is the money pipe.
- **Analytics and payouts:** append-only playback events, deduplicated and fraud-filtered, rolled up into monthly watch-time per title. The same rollup drives creator dashboards and payout batches.
- **Data model sketch:** `Account`, `Profile`, `Title`, `Episode`, `Rendition`, `ContentCredential`, `Series`, `SeriesBible`, `GenerationRequest`, `PipelineJob`, `Shot`, `CreditLedgerEntry`, `Subscription`, `Creator`, `CreatorApplication`, `Strike`, `Report`, `PlaybackEvent`, `WatchTimeRollup`, `PayoutBatch`, `AuditEvent`.
- **Leash fit:** payouts, refunds above a limit, and strike decisions go through Leash approvals with a hash-chained audit log.
- **Open-source creator tools:** the bible and shot-list formats, the continuity checker and a C2PA signing helper can be published separately; the service itself stays closed.

## Relationship to ShapesOS

ShapesOS is AGPL-3.0 and Daydream is a closed commercial service, so ShapesOS code can only move into Daydream if the studio holds the copyright to every line and relicenses it (verify contributor agreements first); otherwise these are references for patterns only.

- `lib/voice/voicestudio.ts`, `lib/voice/voiceover.ts`, `lib/voice/pronunciation.ts`: TTS client, voiceover job lifecycle and pronunciation lists. VoiceStudio currently runs one generation at a time on CPU and takes minutes per request, so it needs production hardware before it can voice episodes; voice ids are discovered from the backend, never invented.
- `lib/clipper/captions.ts`, `lib/clipper/transcribe.ts`: SRT/ASS subtitle building and word-timed transcription.
- `lib/jobs/claim.ts`, `app/api/clipper/_pipeline.ts`: the `FOR UPDATE SKIP LOCKED` claim pattern for the generation queue.
- `lib/ads/higgsfield.ts`: a video-provider port with a mock for tests, the shape the provider adapters should follow.
- `lib/metering/` (`credits.ts`, `billing.ts`, `THREAT-MODEL-BILLING.md`) and `lib/billing/entitlements.ts`: integer credit ledger, Stripe as a downstream sink, and one plan-entitlement table.
- `lib/llm/router.ts`, `lib/llm/pricing.ts`: model routing and cost accounting.
- `lib/approvals/` and `lib/auditlog.ts`: approvals inbox and audit patterns that Leash generalizes.
- `lib/gdpr/`: account deletion and data export.

## Clean-room sources

- Behavior is specified only from public information: Tubi's and Netflix's public help pages, press releases and investor materials, provider pricing pages and API docs, standards documents (C2PA, HLS, CMAF, VAST), and ordinary use as a viewer.
- We never decompile, trace or copy Tubi or Netflix code, UI, layouts, artwork, copy, sounds or trademarks. "Tubi" and "Netflix" appear only in internal docs as comparisons, never in the product or marketing.
- Being closed source does not loosen any of this. Open-source components are named with their licenses: Shaka Packager (Apache-2.0), FFmpeg (LGPL-2.1 build, so it can ship inside a closed service; verify build flags), Leash (MIT, our own), and the C2PA open-source SDKs (verify license per SDK). No AGPL or GPL code goes into the closed service.

## Risks

**Legal**

- **Copyright in AI works.** The US Copyright Office's January 2025 report says prompts alone do not make a person the author; protection needs perceptible human authorship, arrangement or modification. Purely generated episodes may have no copyright, so others could copy them. Mitigation: human-written bibles and scripts and human editing for originals, registration only of the human parts, and contracts that do not promise creators exclusivity we cannot enforce. (Verify per title with counsel.)
- **Model terms.** Each provider's terms decide commercial use, output ownership, prohibited content and required watermarks (Veo outputs carry SynthID). Providers can also shut down, as Sora's API did. Mitigation: legal review of each provider's current terms before use (verify), and pluggable adapters.
- **Likeness and voice.** Tennessee's ELVIS Act (2024) covers unauthorized voice and likeness replicas, including tools whose primary purpose is making them; California's AB 2602 and AB 1836 (effective January 1, 2025) cover digital-replica contracts and deceased performers. The federal NO FAKES Act was reintroduced in May 2026 and passed Senate Judiciary in June, but is reported stalled as of October 2026 (verify). Mitigation: no real people in personalized episodes, written consent on file for creators, no voice cloning.
- **Children.** The amended COPPA Rule has required full compliance since April 22, 2026. Mitigation: parent-run accounts, no behavioral ads or personal data collection on kids profiles, and a COPPA review before launch (verify scope).
- **Ad privacy.** State privacy laws (opt-out of sale or sharing, Global Privacy Control) and the Video Privacy Protection Act, which restricts sharing who watched what. Mitigation: no third-party pixels on watch pages, consent-based ad targeting, and counsel review (verify).
- **Guilds and unions.** The 2023 SAG-AFTRA TV/Theatrical agreement requires consent and compensation for digital replicas and notice before using synthetic performers; the 2023 WGA agreement says AI-generated material is not literary material and AI is not a writer. Daydream is not a signatory, but the studio should pay human writers on guild-standard terms where it hires them, and never imitate a specific performer (verify any signatory obligations).

**Other**

- **Cost:** generation prices can rise, or usage can concentrate in heavy users. Mitigation: per-request spend caps, credits instead of unlimited minutes, and the quarterly price review.
- **Quality:** continuity across episodes is still hard for current models. Mitigation: storyboard fallback, reusable shot libraries, and short episodes.
- **Reputation:** "AI slop" criticism and creative-community backlash. Mitigation: clear labels, a curated catalog, paid human writers for originals, and a creator program that shares revenue.
- **Name:** "Daydream" was the name of Google's VR platform, and "Shipped" is a common word. Run trademark checks on all four names before launch.

## Milestones

- **v0.1:** the three originals (pilot episodes of Meadowlight, Shipped and Low Orbit), free web catalog with server-side ads, labels and content credentials, kids profile for Low Orbit, waitlist for Plus.
- **v0.5:** Plus beta with Stripe, the credit ledger, personalized episodes (storyboard first, full motion second), series bibles, refunds, and measured cost per finished minute that replaces the estimates above. **Decision point:** keep, reprice or drop full-motion personalized minutes.
- **v1.0:** creator program with payouts through Leash approvals, Android TV / Fire TV apps, then Roku and Apple TV, published trust & safety policy and transparency report, open-source creator tools.

## Market notes

All prices are third-party or vendor list prices gathered in October 2026 and will drift. Several aggregator sources disagree with each other; treat them as directional.

- Tubi: 110 million monthly active users, over $1 billion annual revenue, over 13 billion hours streamed in 12 months (company-reported, August 2026). Source: [Advanced Television](https://www.advanced-television.com/2026/08/06/tubi-hits-110m-monthly-active-users/).
- Google Veo 3.1 (Gemini API, per second with audio): Standard $0.40 (720p/1080p), Fast $0.10/$0.12, Lite $0.05/$0.08. Lyria $0.08 per song; Gemini 3.8 Flash TTS about $0.00225 per 10 seconds. Source: [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing).
- OpenAI Sora 2: $0.10/s (720p); Sora 2 Pro $0.30 to $0.70/s; API shut down September 24, 2026. Source: [OpenAI Sora 2 model page](https://developers.openai.com/api/docs/models/sora-2). OpenAI TTS: tts-1 $15 per million characters. Source: [OpenAI pricing](https://developers.openai.com/api/docs/pricing).
- Runway API: $0.01 per credit; Gen-4 Turbo 5 credits/s, Gen-4.5 12 credits/s, Veo 3.1 Fast 15 credits/s with audio. Source: [Runway API pricing](https://docs.dev.runwayml.com/guides/pricing/).
- Kling API: Standard 720p $0.084/s without audio, Pro 1080p $0.112 to $0.14/s, 4K $0.42/s (aggregator, last verified August 2026). Source: [CostBench, Kling API](https://costbench.com/software/ai-media-apis/kling-api/).
- Luma Ray3.2: $0.15 / $0.30 / $1.20 per 5-second clip at 540p / 720p / 1080p, billed in 5-second blocks. Source: [Luma API pricing](https://lumalabs.ai/api/pricing).
- ElevenLabs: TTS Flash/Turbo $0.04 per 1,000 characters (about $0.04/min); Eleven Music $0.15/min. Source: [ElevenLabs API pricing](https://elevenlabs.io/pricing/api).
- CTV and FAST ad CPMs: reported between about $10 and $40 depending on inventory. Sources: [eMarketer, FAQ on FAST](https://www.emarketer.com/content/faq-on-fast--how-free-streaming-tv-reshaping-ad-market-2026), [Adwave, average CTV CPM](https://adwave.com/resources/average-ctv-cpm-q2-2026).
- AWS Elemental MediaTailor: $0.25 per 1,000 VOD ad insertions. Source: [AWS announcement, April 2025](https://aws.amazon.com/about-aws/whats-new/2025/04/new-aws-elemental-mediatailor-pricing-model).
- Fable's Showrunner, an AI streaming service with user-prompted episodes, reportedly plans free viewing with $10 to $20/month creator credits. Source: [Decrypt](https://decrypt.co/333098/amazon-backs-netflix-of-ai-startup-fable-with-user-generated-animation-launch).
- US Copyright Office, Copyrightability report (Part 2, January 2025). Source: [Crowell summary](https://www.crowell.com/en/insights/client-alerts/us-copyright-office-releases-part-2-of-artificial-intelligence-report-clarifying-copyrightability-of-generative-ai-outputs).
- ELVIS Act and California AB 2602 / AB 1836. Sources: [Skadden](https://www.skadden.com/insights/publications/2024/09/california-enacts-host-of-ai-related-bills), [Covington](https://www.covingtonblogs.com/2024/09/11/california-passes-digital-replica-legislation-as-congress-considers-federal-approach/).
- NO FAKES Act 2026: [Manatt](https://manatt.com/insights/newsletters/client-alert/congress-reintroduces-the-no-fakes-act-what-s-new-in-the-2026-bill), [Senator Blackburn release](https://www.blackburn.senate.gov/2026/6/blackburn-coons-bipartisan-bill-to-protect-individuals-and-creators-from-deepfakes-passes-senate-judiciary-committee), [Daily Journal, October 2026](https://www.dailyjournal.com/article/395055-no-fakes-act-dead-for-now-as-cruz-objects-to-unanimous-consent-request).
- Amended COPPA Rule compliance date April 22, 2026. Source: [Davis Polk](https://www.davispolk.com/insights/client-update/ftc-prioritizes-coppa-enforcement-new-compliance-obligations-take-effect).
