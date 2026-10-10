# Hum

> Your music, streamed beautifully, everywhere.

- **Lane:** Music streaming
- **Status:** Planned (everyday app)
- **License:** AGPL-3.0
- **Open-source alternative to:** Spotify
- **Audience:** Music lovers with a library, and independent artists
- **Built on:** the OpenSubsonic-style client API for compatibility with existing apps; Leash (MIT) for artist payouts and anything that moves money

## Summary

Hum streams the music a person already owns from their own server to their phone, desktop and car, with offline downloads and lossless playback. Its headline feature is **Bring your playlists**: import playlists from Spotify, Apple Music and YouTube Music through official APIs or the person's own data export, then match every track to the person's own library, to music independent artists have uploaded to Hum, or to a legal place to buy it. A playlist health view shows what matched and what is missing. Independent artists can upload their own music, sell it and receive direct support, with splits between collaborators set up front. AI radio and playlists run on the person's own hardware.

**Hard rule.** Hum never downloads, records, rips or captures audio from Spotify or any other service, and never circumvents DRM. Imports bring over metadata only: titles, artists, ISRCs and order. This rule is enforced in code review and stated in the contributor guide; pull requests that add any such capability are closed.

## Why it matters

Spotify Premium is reported at about $12.99 per month for one person and $21.99 for a family in the US in 2026, after another price rise. People pay that for convenience, but they do not own anything, playlists they spent years building are hard to move, and artists receive a small and opaque share.

The open-source landscape is already strong for the first half of this:

- **Navidrome** (GPL-3.0) is a fast, lightweight music server that speaks the Subsonic API, so dozens of existing mobile and desktop clients work with it.
- **Jellyfin** (GPL-2.0) serves music alongside video.
- **Funkwhale** (AGPL-3.0, verify license) adds federation, so libraries and channels can be shared across servers.

Hum should not pretend those do not exist. What it adds is the bridge for people leaving a subscription (playlist import and matching), a store for independent artists built into the same app, and local AI radio. **Recommendation:** keep the client API compatible with OpenSubsonic so Hum works with existing clients and vice versa, and consider building Hum's import and artist store as add-ons that could also run beside Navidrome. If that proves practical, it is a better outcome than a parallel server.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| Leaving a subscription | "Bring my ten years of playlists with me and see which songs I already own." |
| Collector | "Stream my FLAC library to my phone and car, with offline downloads for the plane." |
| Independent artist | "Upload an album, set a price and a pay-what-you-want minimum, and split income with my bandmates." |
| Fan | "Buy music directly from the artist and have it appear in my library straight away." |
| Privacy-minded listener | "Get a good radio station from my library without sending my listening history anywhere." |

## MVP scope

1. **Bring your playlists.**
   Import from Spotify (Web API with the person's OAuth consent, or the "Download your data" export), Apple Music (MusicKit with the person's authorization, verify scope) and YouTube Music (YouTube Data API or the person's Google Takeout export, verify coverage). Only playlist metadata is imported: titles, artists, album, ISRCs where present, and order.
   *Acceptance:*
   - No import path requests, stores or plays audio from the source service.
   - The person can import from a data-export file without connecting any account.
   - Imported metadata is stored only as needed to run the matching, and API-sourced data follows the source's developer terms (see Risks).
2. **Matching and playlist health.**
   Each imported track is matched in order against (a) the person's own library, (b) artist uploads on the Hum server, and (c) legal purchase links (for example Bandcamp, Qobuz and the iTunes Store) for anything missing. Matching uses ISRC first, then MusicBrainz identifiers, then normalized title, artist and duration.
   *Acceptance:*
   - The health view shows matched, uncertain and missing tracks with a reason for each, and the person can confirm or fix uncertain matches.
   - A test set of 1,000 tracks with known answers reports precision and recall in the release notes.
   - Purchase links are plain outbound links; Hum does not use affiliate codes by default.
3. **Stream your own library.**
   Scan a music folder, read tags, fetch artwork and metadata from MusicBrainz and Cover Art Archive, and stream to web, iOS and Android apps, with transcoding when bandwidth needs it.
   *Acceptance:*
   - A 50,000-track library scans in under 15 minutes on a small home server.
   - FLAC plays bit-perfect when no transcoding is requested.
   - Existing Subsonic/OpenSubsonic clients can connect and play.
4. **Offline and lossless.**
   Mobile apps download albums and playlists for offline play and support gapless playback.
   *Acceptance:*
   - Downloads survive app restarts and are only of files the server holds.
   - Car integration through Android Auto and CarPlay audio templates.
5. **Artist uploads, sales and splits.**
   Artists upload releases, set a price or pay-what-you-want minimum, and define percentage splits between collaborators. Fans buy downloads or send direct support; purchases appear in the fan's library.
   *Acceptance:*
   - Uploading requires the artist to confirm they own or control all rights in the recording and the composition. Cover versions and samples are not accepted in v1.
   - Splits must total 100 percent before a release can go live; every payout is a Leash tool call with an audit record.
   - A takedown request flow exists and is documented.
6. **AI radio and playlists, locally.**
   Start a station from a song, artist or mood, or describe a playlist in words. Audio features and embeddings are computed on the server from files it holds.
   *Acceptance:*
   - Works with network access disabled once models are downloaded.
   - Listening history never leaves the server.
   - The person can see why a song was picked ("similar tempo and timbre to X").

## Not in v1

- Per-stream royalty pools. Streaming of other people's music to the public needs licenses Hum does not have; v1 sells downloads and accepts support.
- Licensed catalog music from labels.
- Podcasts and audiobooks.
- Social features beyond sharing a playlist link.
- Federation between Hum servers (Funkwhale already does this; revisit later).

## Architecture

- **Stack:** server in Go or TypeScript (decide at v0.1; Go matches Navidrome's footprint), SQLite by default and Postgres for larger instances, FFmpeg for transcoding. Web app in Next.js; mobile apps in React Native or Flutter with native audio engines.
- **Data model sketch:** `Library`, `Track` (file path, tags, ISRC, MusicBrainz IDs, audio features), `Album`, `Artist`, `Playlist`, `ImportJob` (source, file or OAuth grant, status), `ImportedEntry` (title, artist, ISRC, position, match status, matched track or purchase link), `Release` (artist upload), `Split` (collaborator, percent), `Order`, `Payout`, `Station`, `AuditEvent`.
- **Payments and royalties (high level):** the instance operator connects a payment provider (Stripe Connect is the reference integration). Each artist and collaborator onboards to the provider and is paid out directly according to the split; Hum never holds funds itself. Taxes on digital sales (VAT and sales tax) are handled by the provider's tax features where available and are the operator's responsibility, which the setup screen says plainly. Each payout is a Leash tool with a risk level and spend caps.
- **Where AI runs:** on the server. Audio analysis with an open model (for example Essentia, AGPL-3.0, whose pretrained models carry their own licenses, verify license) produces embeddings and features; radio uses nearest-neighbor search plus simple rules. Natural-language playlist requests can use a small local language model or the person's own key.
- **Leash fit:** payouts, refunds and takedowns are Leash tools. Imports are read-only.
- **Self-host story:** one container with the server and a SQLite file; mount the music folder read-only.

## Relationship to ShapesOS

Little code overlaps; Hum is a consumer app. Patterns worth reusing (both AGPL-3.0):

- `lib/approvals/` and `app/dashboard/approvals/`: the approval inbox model for payouts and takedowns.
- `lib/metering/`: spend-cap patterns that Leash generalizes, applied here to payout limits.

## Clean-room sources

- Behavior is specified only from public information: Spotify, Apple Music and YouTube Music help pages and public API documentation, the OpenSubsonic API documentation, Bandcamp's public artist help pages, and ordinary use.
- We never decompile, trace or copy proprietary code, UI assets, icons, copy or trademarks. Service names appear only to label import sources.
- Never download, record or rip audio from any service, and never circumvent DRM. No exceptions for "personal use".
- Reused open source with licenses: Navidrome (GPL-3.0) as reference; GPL-3.0 code can be combined with AGPL-3.0 under section 13 of both licenses (verify license per file). MusicBrainz data (core data CC0; some data CC BY-NC-SA, verify license) and Cover Art Archive (per-image licenses, verify license). FFmpeg (LGPL-2.1 or GPL depending on build). Chromaprint (LGPL-2.1, verify license) for fingerprinting local files; the AcoustID web service has its own terms (verify license).

## Risks

- **Legal (copyright):** an artist store invites uploads of music the uploader does not own. Mitigation: rights confirmation at upload, no covers or samples in v1, a published takedown process, a registered DMCA agent for any hosted instance, and audio fingerprint checks against known releases where a service permits it.
- **Legal (import terms):** Spotify's developer terms restrict storing Spotify content and have at times restricted moving it to competing services; reports say this was later loosened for user-created playlists. The current terms must be checked before shipping the API path, and the data-export path is the safer default. The person should verify this as well. Apple's and Google's API terms need the same review.
- **Payments:** money moving to artists creates fraud, tax and chargeback exposure. Mitigation: payment provider handles onboarding and identity checks; payouts are delayed and capped through Leash.
- **Technical:** matching quality varies; ISRCs are missing or wrong for some tracks. Mitigation: confidence levels, manual fixes, and honest health numbers.
- **Name:** "Hum" is a common word used by other products; trademark check before launch.

## Milestones

- **v0.1:** library scan and streaming to a web app, OpenSubsonic compatibility, playlist import from data-export files, matching against the library, playlist health view.
- **v0.5:** mobile apps with offline and lossless, Spotify, Apple Music and YouTube Music API imports after terms review, purchase links, local AI radio.
- **v1.0:** artist uploads, sales, splits and payouts through Stripe Connect and Leash; takedown process; documentation for operators on tax and rights.

## Market notes

Prices are third-party estimates gathered in October 2026.

- Spotify Premium (US): reported $12.99/month individual, $21.99/month family after an early-2026 increase. Sources: [SoundGuys](https://www.soundguys.com/spotify-confirms-us-subscription-price-hike-151412/), [MacDailyNews](https://macdailynews.com/2026/01/15/spotify-again-jacks-up-subscription-prices-in-the-u-s/amp/).
- Playlist transfer services already do metadata-only moves between services: Soundiiz (reported free up to 200 tracks, premium about €5/month) and TuneMyMusic (reported free up to 500 tracks, premium about $4.50–$5.50/month). Sources: [PlaylistGo comparison](https://www.playlistgo.io/compare/tunemymusic-vs-soundiiz/), [TuneMyMusic FAQ](https://www.tunemymusic.com/de/help). Hum differs by matching to music the person owns or can buy, not to another subscription.
- Spotify developer terms on storing and transferring content: [Spotify Developer Policy](https://developer.spotify.com/policy/); background on past enforcement: [AppleInsider, 2020](https://appleinsider.com/articles/20/10/12/spotify-reportedly-threatens-developers-over-transferring-playlists-to-other-services/amp/), [RouteNote](https://routenote.com/blog/spotify-are-blocking-songshift-from-transferring-libraries-out-of-spotify/). Verify the current terms.
- Navidrome: GPL-3.0, per the LICENSE file in [navidrome/navidrome](https://github.com/navidrome/navidrome).
- Jellyfin: GPL-2.0, per the LICENSE file in [jellyfin/jellyfin](https://github.com/jellyfin/jellyfin).
- Funkwhale: AGPL-3.0 per secondary listings ([fediverse.party](https://fediverse.party/en/funkwhale), [YunoHost, AGPL-3.0-or-later](https://apps.yunohost.org/app/funkwhale)); the upstream repository could not be reached while writing, so verify license.
