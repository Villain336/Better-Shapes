# Huddle

> Calm video calls with notes that write themselves.

- **Lane:** Video calls
- **Status:** Planned (everyday app)
- **License:** AGPL-3.0
- **Open-source alternative to:** Zoom
- **Audience:** Teams, classrooms and families
- **Built on:** LiveKit (Apache-2.0) as the media server; Leash (MIT) for anything the notes assistant sends out

## Summary

Huddle is a video meeting app that runs in the browser with no download. Calls go through a selective forwarding unit (SFU) the host runs or chooses, so they scale past a handful of people without burning everyone's bandwidth. It has the meeting features people actually use (waiting rooms, breakout rooms, screen sharing, chat, hand raising) and, after the call, AI notes: a summary, decisions and action items, produced by a model running locally on the server or through the host's own API key. Recording is never silent: everyone is told before it starts, and recordings and transcripts stay on the host's storage. Anything the assistant would send to people outside the call, such as follow-up emails or tasks, waits for a person to approve it.

## Why it matters

Zoom Workplace Pro is reported at about $13.33 to $14.16 per user per month billed annually, and its AI notes run on the vendor's infrastructure. For a school, a club or a family the subscription is a nuisance; for a company with confidential meetings, the bigger concern is where recordings and transcripts live.

The open-source landscape is already mature:

- **Jitsi Meet** (Apache-2.0) is a complete, widely deployed browser meeting app with its own SFU (Jitsi Videobridge).
- **LiveKit** (Apache-2.0) is a modern open-source WebRTC SFU with SDKs for every platform, recording (Egress) and an agents framework.

Huddle does not need to reinvent real-time media. **Recommendation:** build Huddle as an application on top of LiveKit's open-source server rather than writing an SFU, and keep Jitsi as the honest comparison in docs. What Huddle adds is a calm, finished meeting experience, consent-first recording and AI notes that run where the host chooses. If a team only needs calls, Jitsi Meet may already be the right answer, and the docs will say so.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| Team lead | "Run the weekly meeting and get decisions and action items without anyone taking notes." |
| Teacher | "Hold class with breakout rooms and a waiting room, and students join from a link without installing anything." |
| Family | "Call grandparents with one link that works on their old tablet." |
| Security-conscious company | "Keep recordings and transcripts on our servers, and choose which model sees them." |
| Participant | "Always know when I'm being recorded or transcribed, and be able to leave before it starts." |

## MVP scope

1. **Browser calls with no install.**
   Join from a link in any modern browser, with camera, microphone and device checks before entering.
   *Acceptance:*
   - A 10-person call works on a typical home connection with adaptive quality (simulcast).
   - Joining takes under 10 seconds from opening the link on a recent laptop.
   - Mobile browsers work; native apps are optional later.
2. **Meeting controls.**
   Waiting room, host and co-host roles, mute controls, screen sharing, chat, hand raising, breakout rooms and lock meeting.
   *Acceptance:*
   - Breakout rooms can be created, timed and closed by the host, and participants return to the main room automatically.
   - Waiting room admits individually or all at once.
3. **Recording and transcripts with consent.**
   Recording and live transcription start only after a host action; every participant sees a banner and hears a short tone, and new joiners see a notice before their media is included.
   *Acceptance:*
   - There is no way to record without the in-call indicator, including through the API.
   - A participant can leave before their audio is captured.
   - Each recording has a consent log (who was present, when notice was shown).
   - Files are written only to the host's configured storage.
4. **AI notes, local or with your own key.**
   After the call, a transcript with speaker labels, a summary, decisions and action items with owners.
   *Acceptance:*
   - A fully local setup (local speech-to-text and local language model) works with no outside network calls.
   - With a hosted model, the host's own key is used and the notes say which provider processed them.
   - Notes link each action item to the transcript moment it came from.
5. **Approved follow-ups.**
   The assistant drafts a follow-up email or creates tasks; nothing is sent until a person approves.
   *Acceptance:*
   - Sending is a Leash tool with an approval record and appears in the audit log.
6. **Scheduling and links.**
   Personal rooms, scheduled meetings with calendar invites (ICS), and optional passcodes.
   *Acceptance:*
   - Meeting links are unguessable; passcodes and waiting rooms can be required by policy.

## Not in v1

- Webinars with thousands of attendees and live streaming to social platforms.
- Phone dial-in (SIP), which LiveKit supports but needs a telephony provider.
- End-to-end encryption together with server-side recording and AI notes; these conflict, so v1 offers end-to-end encryption as a per-meeting mode that disables recording and server-side notes.
- Whiteboards and document co-editing.
- Native desktop apps.

## Architecture

- **Stack:** Next.js and TypeScript web app; LiveKit server (Go, Apache-2.0) as the SFU; LiveKit Egress for recording (Apache-2.0, verify license); a TURN server (for example coturn, BSD-3-Clause, verify license) for restrictive networks; Postgres for meetings, users and notes; object storage for recordings.
- **SFU in plain words:** each participant sends their video once, at a few quality levels (simulcast), to the SFU; the SFU forwards the right quality to each viewer without decoding it. This scales far better than a mesh where everyone sends to everyone, and is cheaper than a server that mixes video.
- **Data model sketch:** `Room`, `Meeting` (schedule, policies), `Participant`, `Breakout`, `Recording` (storage path, consent log), `Transcript` (segments, speakers), `Notes` (summary, decisions), `ActionItem` (owner, due, transcript anchor), `FollowUp` (draft, approval status), `AuditEvent`.
- **Where AI runs:** post-call by default. Speech-to-text with an open model (for example whisper.cpp, MIT) on the server; summarization with a local model through an OpenAI-compatible endpoint, or a hosted model with the host's key. Live captions are optional and use the same pipeline in streaming mode.
- **Leash fit:** follow-up emails, task creation in outside tools and calendar changes are Leash tools that need approval; spend caps limit hosted-model tokens per meeting.
- **Self-host story:** `docker compose up` with app, LiveKit, Egress, TURN and Postgres; a guide for opening the right UDP ports, which is the most common failure.

## Relationship to ShapesOS

Huddle can extract proven pieces from ShapesOS (both AGPL-3.0):

- `lib/voice/` (`consent.ts`, `sessions.ts`, `livekit.ts`): consent capture, session handling and LiveKit integration patterns.
- `lib/clipper/transcribe.ts`: the word-level transcription provider contract, with an honest "not configured" error instead of a fake transcript.
- `lib/messaging/` and `lib/approvals/`: follow-up emails behind approval, and the approvals inbox where Huddle follow-ups should appear when embedded.
- Echo shares the same transcription layer; meeting notes in Huddle and sales-call analysis in Echo should not diverge.

## Clean-room sources

- Behavior is specified only from public information: Zoom's public help center, pricing pages and ordinary use; LiveKit and Jitsi documentation; W3C and IETF WebRTC specifications.
- We never decompile, trace or copy proprietary code, UI assets, icons, copy or trademarks. Feature names are original where possible.
- Reused open source with licenses: LiveKit server, SDKs and Egress (Apache-2.0, verify license per component); Jitsi Meet (Apache-2.0) as reference; Apache-2.0 code can be used in an AGPL-3.0 project with notices kept. whisper.cpp (MIT). coturn (BSD-3-Clause, verify license). Leash (MIT).

## Risks

- **Legal (recording):** about a dozen US states, including California, require consent from everyone on a call before recording, and many other countries have similar rules; employment and education settings add their own. Mitigation: recording is always visible and announced, consent logs are kept, the host is told local law may require more, and recording can be disabled by policy for a whole instance.
- **Legal (AI notes):** transcripts and summaries are personal data under GDPR and similar laws. Mitigation: retention settings, deletion, and a clear record of which model processed the data.
- **Technical:** real-time media is unforgiving: NAT traversal, bandwidth variation and old devices. Mitigation: rely on LiveKit's SFU and TURN rather than custom media code, and test on low-end devices.
- **Inference cost:** a one-hour meeting transcript is long. Mitigation: local speech-to-text, chunked summarization and per-meeting caps.
- **Security:** meeting links get shared and "zoombombed". Mitigation: unguessable links, waiting rooms and passcodes by default for large meetings.
- **Name:** "Huddle" is used by other products, including a feature name at Slack; trademark check before launch.

## Milestones

- **v0.1:** LiveKit-based browser calls with screen share, chat, waiting room, and self-host guide.
- **v0.5:** recording with consent logs, post-call transcripts and local AI notes, breakout rooms, scheduling.
- **v1.0:** approved follow-ups through Leash, end-to-end encrypted mode, policy controls for instances, published accessibility and security review.

## Market notes

Prices are third-party estimates gathered in October 2026.

- Zoom Workplace Pro: reported $13.33–$14.16 per user per month billed annually, about $16.99 billed monthly. Sources: [eesel, Zoom pricing 2026](https://www.eesel.ai/en/blog/zoom-pricing), [tl;dv, Zoom pricing](https://tldv.io/blog/zoom-pricing/). Sources disagree; verify on Zoom's pricing page.
- Jitsi Meet: Apache-2.0, per the LICENSE file in [jitsi/jitsi-meet](https://github.com/jitsi/jitsi-meet) (originally contributed under MIT, per the same file).
- LiveKit server: Apache-2.0, per the LICENSE file in [livekit/livekit](https://github.com/livekit/livekit).
