# Echo

> Every sales call, understood.

- **Lane:** Revenue intelligence
- **Status:** Planned (third in the build order)
- **License:** AGPL-3.0
- **Open-source alternative to:** Gong and Chorus
- **Audience:** Sales teams and founders who sell
- **Built on:** Leash (MIT) for follow-up drafts, CRM writes and audit

## Summary

Echo records sales calls, transcribes them with speaker labels, and turns them into something a seller can act on: a short summary, the next steps both sides agreed to, signs that a deal is at risk, talk-time balance and moments worth coaching. It drafts the follow-up email and the CRM note, and a person approves them before anything is sent or written. Because Echo is self-hostable and can transcribe with local open models, recordings never have to leave the team's own infrastructure.

## Why it matters

Conversation intelligence is one of the most expensive line items in a sales stack. Gong does not publish prices; third-party guides estimate per-seat licenses in the low thousands of dollars per year, a separate platform fee, onboarding fees, and since 2026 usage-based AI credits. A ten-person team can be quoted close to $30,000 in the first year.

Recordings of customer calls are also some of the most sensitive data a company holds. Open source wins on both counts: transcription and summarization are now commodity models that run on modest hardware, and a team that self-hosts knows exactly where its recordings live and who can hear them.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| Account executive | "Stop taking notes during calls; get the follow-up and CRM update drafted right after." |
| Founder who sells | "Remember what each prospect said about budget and timing across five calls." |
| Sales manager | "See which deals are slipping and coach on real moments without listening to hours of audio." |
| Security / legal | "Know where recordings are stored, who can access them, and that consent was captured." |

## MVP scope

1. **Capture.**
   Upload audio/video files; a meeting bot for Google Meet and Zoom via their public developer offerings; a browser extension that records the current tab with a visible indicator (later, see Not in v1).
   *Acceptance:*
   - Uploads up to 3 hours process end to end.
   - The bot announces itself by name in the meeting and in chat.
   - Capture refuses to start if the workspace's consent setting requires a notice and none was configured.
2. **Transcription with speakers.**
   Word-level timestamps and speaker diarization; local Whisper-class models by default, hosted APIs optional.
   *Acceptance:*
   - A one-hour call transcribes in under 15 minutes on a single consumer GPU.
   - Speakers can be renamed and the rename applies to the whole call.
3. **Call summary and next steps.**
   Summary, decisions, open questions, next steps with owners and dates.
   *Acceptance:*
   - Every next step links to the transcript moment it came from.
   - No next step is shown without a timestamp link.
4. **Deal signals.**
   Talk ratio, longest monologue, questions asked, mentions of competitors, pricing, timeline, decision makers; a simple "risk" list per deal (for example, no next meeting booked, champion silent for 14 days).
   *Acceptance:*
   - Each signal shows how it was computed in one sentence.
   - Risk rules are editable per workspace.
5. **Follow-up and CRM drafts.**
   Drafted follow-up email and CRM note/fields after each call.
   *Acceptance:*
   - Nothing is sent or written without approval in the Leash queue.
   - Edits before approval are saved as a separate audit event.
6. **Search and library.**
   Full-text search across transcripts, filters by rep, account and date; short shareable snippets.
   *Acceptance:*
   - Search returns within one second on 10,000 calls.
   - Snippet links respect permissions and can expire.
7. **Access control and retention.**
   Per-call visibility (owner, team, workspace), retention policies, deletion.
   *Acceptance:*
   - A deleted call removes audio, transcript and derived data, and the deletion is logged.

## Not in v1

- Real-time in-call prompts.
- Dialer and phone system recording (later, through ShapesOS Calls and Voice).
- Forecasting and pipeline-wide revenue rollups.
- Microsoft Teams bot (after Meet and Zoom).
- The browser tab recorder ships in v0.5 only if the consent UX is solid.
- Emotion or sentiment scoring of individuals; we do not plan to build this.

## Architecture

- **Stack:** Next.js and TypeScript web app; Postgres with row-level security and Prisma; object storage (S3-compatible, MinIO for self-host) for media; a Python worker for transcription and diarization; FFmpeg for audio extraction.
- **Data model sketch:** `Call` (source, consent record, retention), `MediaAsset`, `Transcript`, `Utterance` (speaker, start, end, text), `Speaker`, `Insight` (type, value, evidence span), `RiskRule`, `Deal` (CRM link), `Draft` (email or CRM note, status), `Snippet`, `AuditEvent`.
- **Where AI runs:** transcription and diarization on the worker (whisper.cpp or faster-whisper, both MIT; pyannote.audio for diarization, MIT code with model weights under their own terms, verify license). Summaries and signals run as one bounded LLM job per call, provider pluggable, local models supported.
- **Leash fit:** reading transcripts is low risk; sending email and writing CRM fields are high risk and wait for approval. Spend caps cover hosted transcription and model tokens per call and per month. The audit log records who listened to or exported what.
- **Self-host story:** docker compose with app, Postgres, MinIO and a CPU worker; a GPU worker image for faster transcription. Demo mode ships with two sample calls recorded by the team with consent.

## Relationship to ShapesOS

Echo embeds in ShapesOS Grow next to the CRM and can reuse several modules (all AGPL-3.0).

- `lib/clipper/transcribe.ts`: the word-level transcription provider contract (with an honest "not configured" error instead of a fake transcript) is the starting point for Echo's transcription layer.
- `lib/calls/` and `app/dashboard/calls/`: call tracking and booking pages; Echo adds analysis of the recordings.
- `lib/voice/` (`consent.ts`, `sessions.ts`, `livekit.ts`): consent capture and LiveKit integration patterns.
- `lib/crm/` and `app/dashboard/crm/`: deals and leads that Echo attaches calls to.
- `lib/messaging/` (`approvals.ts`, `mail-channel.ts`): follow-up email sending behind approval.
- `lib/approvals/`: when embedded, Echo drafts land in the shared approvals inbox.

## Clean-room sources

- Behavior is specified only from public information: Gong and Chorus public docs, help centers, pricing pages, marketing pages, public webinars and demo videos, and ordinary hands-on use.
- We never decompile, trace or copy proprietary code, UI assets, icons, copy or trademarks. Feature names are original (for example "Signals", "Next steps", "Library").
- Meeting integrations use only the public Zoom and Google Meet developer APIs and follow their terms.
- Reused open source: Leash (MIT); whisper.cpp (MIT) or faster-whisper (MIT); pyannote.audio (MIT code, model weights gated, verify license); FFmpeg (LGPL-2.1+ or GPL depending on build options, verify the build we ship).

## Risks

- **Legal:** recording laws differ; some US states and many countries require all-party consent. Echo defaults to announcing the recording and storing a consent record per call; operators remain responsible for their jurisdiction. Employee monitoring rules (for example in the EU) may limit manager-facing analytics.
- **Technical:** diarization errors on overlapping speech and poor audio; meeting platforms change bot policies. Mitigation: easy speaker correction, file upload as a fallback for every platform.
- **Inference cost:** hosted transcription is billed per minute; local transcription needs a GPU for speed. Summaries per call are cheap relative to transcription. Mitigation: local-first defaults, per-month caps, and a cost-per-call figure in settings.
- **Security:** recordings are high-value targets. Encrypt at rest, short-lived signed URLs, and access logging from day one.
- **Name:** "Echo" is widely used (including Amazon Echo); check trademark before launch.

## Milestones

- **v0.1:** file upload, local transcription with diarization, summary and next steps with timestamp links, search.
- **v0.5:** Zoom and Meet bot, deal signals and risk rules, follow-up and CRM drafts behind Leash approvals, retention and deletion.
- **v1.0:** ShapesOS CRM embedding, snippets with expiry, GPU worker image, published threat model and consent guide.

## Market notes

Prices are third-party estimates gathered in October 2026; Gong does not publish pricing.

- Gong: reported per-user licenses roughly $1,300 to $1,600 per year, platform fees of about $5,000 to $50,000 per year, onboarding fees, and AI usage credits in 2026. Sources: [Claap, Gong pricing 2026](https://www.claap.io/blog/gong-pricing), [tl;dv, Gong pricing](https://tldv.io/blog/gong-pricing/), [Avoma, Gong pricing](https://www.avoma.com/blog/gong-pricing).
- Many of these guides are published by competitors; treat them as directional.
- Chorus is now part of ZoomInfo and is sold within its platform; we found no reliable standalone price.
