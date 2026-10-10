# Matinee

> Your own streaming service.

- **Lane:** Media center
- **Status:** Planned (everyday app)
- **License:** AGPL-3.0
- **Open-source alternative to:** Kodi, Plex and Netflix-style streaming apps
- **Audience:** Families, film collectors and independent filmmakers
- **Built on:** FFmpeg for decoding and transcoding; a new codebase rather than a Kodi fork (see "Fork Kodi or build fresh?")

## Summary

Matinee is an AI-native media center: think Kodi, with AI built in, and a server so every screen in the house shares one library. It gives the movies and shows a person owns or has the rights to a cinematic home, with rich library pages, profiles, parental controls, downloads and watch-together. Its second headline feature is **Bring your watchlists**: import watchlists, ratings and history from Trakt, Letterboxd, IMDb exports and the Netflix viewing-history download, match them to the person's own library, and show where each missing title is legally available to stream, rent or buy. A Kodi-style add-on system, with a curated and signed official catalog, connects legal sources: local files, a NAS, TV tuners and DVRs, IPTV the person subscribes to, links into official streaming apps, public-domain and Creative Commons catalogs, and uploads from independent filmmakers. AI search, mood picks, recommendations, chapter detection, subtitles and dialogue boost run locally where possible.

**Hard rules.** Matinee does not circumvent DRM, does not scrape streaming catalogs or streams, has no torrent integration, and its official add-on catalog does not accept add-ons that link to infringing content.

## Why it matters

People pay for several streaming services at once (Netflix alone is reported at $8.99 to $26.99 per month in the US in 2026) and still cannot find what they want to watch, while their own collections sit on disks with poor software. Plex made personal media easy, but remote streaming now needs a paid pass and its lifetime pass price was reported to rise from $249.99 to $749.99 in July 2026.

The open-source landscape is strong:

- **Jellyfin** (GPL-2.0) is a full, free media server with clients for most platforms. For many people it is already the answer.
- **Kodi** (GPL-2.0-or-later, with some GPL-2.0-only parts such as its default skin, per Debian's packaging records; verify license) is the long-standing open-source media center with a large add-on ecosystem.

Matinee's honest reason to exist is the AI layer (natural-language search, mood picks, subtitles, dialogue boost) and the watchlist bridge, combined with a curated add-on catalog that stays on the right side of the law. If those can be built as Jellyfin plugins or Kodi add-ons instead, the studio should consider doing that first; the v0.1 review includes that question.

## Fork Kodi or build fresh?

**Recommendation: build fresh, and stay friendly to Kodi.**

- Kodi is a mature C++ single-device player. Matinee's design is server-first (one library, many screens, profiles, watch-together), which Kodi was not built around.
- License: GPL-2.0-or-later code can be used in an AGPL-3.0 project (by taking it under GPL-3.0), but GPL-2.0-only parts cannot. A fork would need a file-by-file license audit and would carry those parts forever.
- Trademark and reputation: "Kodi" is a trademark of the XBMC Foundation, and a fork would inherit the association with preloaded piracy boxes without the Foundation's years of effort to separate itself from them.
- What we keep: Kodi's add-on idea (sources, metadata scrapers and players as separate, versioned packages) and interoperability. Matinee ships a Kodi add-on so Kodi users can browse and play from a Matinee server, as Jellyfin does.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| Family | "One place for our films and shows, with kids' profiles that only show what's appropriate." |
| Film collector | "Make my disc and file collection look and feel like a streaming service, on every TV." |
| Subscriber to several services | "Bring my Letterboxd watchlist and see what I own, and where the rest is legally available." |
| Independent filmmaker | "Put my film in front of audiences on my own terms, with a page, a trailer and a price." |
| Hard-of-hearing viewer | "Accurate subtitles in my language and dialogue I can actually hear over the music." |

## MVP scope

1. **Library from owned sources.**
   Scan local folders, network shares and DVR recordings; fetch artwork and details from an open metadata source.
   *Acceptance:*
   - A 2,000-title library is identified with over 95 percent accuracy on a public test set, with a "fix match" flow for the rest.
   - No streaming service catalog is scraped; metadata comes only from sources with an API and terms that allow it.
2. **Bring your watchlists.**
   Import from Trakt (API with the person's authorization), Letterboxd (CSV export), IMDb (CSV export) and the Netflix viewing-history download. Match against the library; for missing titles, show legal availability from a public availability source with an API. Candidates include TMDB's watch-provider data (sourced from JustWatch, attribution required) and Watchmode (free developer tier is non-commercial); verify which fits the license and use.
   *Acceptance:*
   - Every imported item is shown as owned, available to stream/rent/buy (with region), or not found.
   - Availability data is cached only as long as the source's terms allow and shown with the required attribution.
   - Links open the official app or store; Matinee never plays another service's stream itself.
3. **Profiles, parental controls and history.**
   Per-person profiles, ratings-based limits, PIN-protected adult profiles, watch history and resume.
   *Acceptance:*
   - A child profile cannot see or search titles above its limit, including through AI search.
4. **Watch together.**
   Synchronized playback across devices with chat and reactions.
   *Acceptance:*
   - Drift under 500 ms between participants on normal connections.
   - The host is reminded on first use that sharing films outside the household may require rights they do not have.
5. **Add-ons with a curated, signed catalog.**
   Add-on types: source (local, NAS, tuner/DVR, IPTV with the person's own subscription, public-domain and Creative Commons catalogs, indie uploads), metadata, subtitles and player features.
   *Acceptance:*
   - Official catalog add-ons are reviewed by a person, built from public source, and signed; the app verifies signatures before install.
   - Unofficial add-ons can be installed only after a clear warning and are never promoted or listed by the studio.
   - Add-ons run with declared permissions (network hosts, file paths) and are sandboxed.
6. **AI features, local first.**
   Natural-language search ("the heist movie with the train"), mood-based picks, recommendations from history, scene and chapter detection, subtitle generation and translation, and dialogue boost.
   *Acceptance:*
   - All of these work on the server with no external calls once models are downloaded; an optional hosted model uses the person's own key and says so.
   - Generated subtitles are labeled as generated.
7. **Apps for TV, phone and web.**
   Web, Android TV, Apple TV, iOS and Android apps, with downloads for offline viewing of the person's own files.
   *Acceptance:*
   - Direct play when the device supports the format; otherwise transcode with hardware acceleration where available.

## Not in v1

- Live TV guide data beyond what tuners and IPTV providers supply.
- A public storefront across instances for filmmakers (v1: a filmmaker runs or uses one instance).
- Music (see Hum) and photos (see Keepsake).
- Disc ripping tools of any kind.

## Architecture

- **Stack:** server in TypeScript or Go, Postgres or SQLite, FFmpeg for transcoding and analysis, a job queue for scans and AI work. Clients: Next.js web, React Native for phone, native or Kotlin/Swift shells for TV platforms. A Kodi add-on in Python.
- **Data model sketch:** `Library`, `Title`, `Episode`, `MediaFile`, `Profile`, `Rating`, `PlaybackState`, `WatchlistImport`, `WatchlistItem` (source, match status, availability), `Availability` (provider, region, type, fetched-at), `Addon` (manifest, signature, permissions), `WatchParty`, `Chapter`, `SubtitleTrack`, `Release` (indie upload), `AuditEvent`.
- **Where AI runs:** on the server. Speech-to-text with an open model (for example whisper.cpp, MIT) for subtitles; open translation models; frame and transcript embeddings (CLIP-style models) for natural-language search and chapter detection; speech/music separation for dialogue boost; recommendations from history with local embeddings. A GPU helps but is not required.
- **Leash fit:** indie sales and payouts go through Leash approvals and caps, as in Hum. Add-on installs are not agent actions.
- **Self-host story:** one container plus a media folder; hardware transcoding is documented per platform.

## Relationship to ShapesOS

Small overlap. `lib/clipper/` (`transcribe.ts`, `reframe.ts`, `captions.ts`) has word-timed transcription and SRT/ASS caption generation that Matinee's subtitle feature can reuse (both AGPL-3.0). `lib/approvals/` patterns apply to filmmaker payouts.

## Clean-room sources

- Behavior is specified only from public information: Plex, Kodi and streaming services' public help pages, the Kodi add-on documentation, Trakt and TMDB API docs, export format documentation, and ordinary use.
- We never decompile, trace or copy proprietary code, UI assets, icons, copy or trademarks. "Kodi", "Plex" and "Netflix" are trademarks of their owners and appear only in docs and import labels.
- Reused open source with licenses: Jellyfin (GPL-2.0) as reference only, because GPL-2.0-only code cannot be combined into an AGPL-3.0 project. Kodi (GPL-2.0-or-later, some GPL-2.0-only parts; verify license per file) as reference. FFmpeg (LGPL-2.1 or GPL depending on build). whisper.cpp (MIT). Model weights each carry their own licenses (verify license per model).

## Risks

- **Legal (piracy reputation):** Kodi's history shows how an open media center gets tied to piracy through third-party add-ons and preloaded "fully loaded" boxes; in 2017 the EU Court of Justice held that selling media players preloaded with add-ons linking to infringing streams can itself infringe (Filmspeler, C-527/15). Mitigation: the official catalog only accepts legal sources, add-ons are reviewed and signed, the studio never links to or promotes unofficial repositories, and the trademark policy forbids selling devices that bundle piracy add-ons under the Matinee name.
- **Legal (DRM and ripping):** in the US, circumventing DRM on discs or streams can violate DMCA section 1201 even for media the person owns, and similar rules exist in the EU. Mitigation: Matinee includes no ripping or circumvention tools and plays only files and streams it can lawfully access.
- **Legal (watch together and filmmaker uploads):** showing films to people outside the household can be a public performance; uploads may include content the uploader does not own. Mitigation: plain warnings, rights confirmation at upload, and a takedown process.
- **Data terms:** metadata and availability APIs restrict commercial use, caching and attribution. Mitigation: review each source's terms before shipping and make the source pluggable.
- **Technical:** TV platform apps and hardware transcoding are long work. Mitigation: web and Android TV first.
- **Name:** "Matinee" is a common word; trademark check before launch.

## Milestones

- **v0.1:** server, library scan, web player, profiles, Letterboxd/IMDb/Netflix-export import with library matching. **Decision point:** build on as a standalone app, or ship the AI and watchlist features as Jellyfin plugins or Kodi add-ons instead.
- **v0.5:** availability lookups, add-on system with signing, local subtitles and natural-language search, Android TV and phone apps, Kodi add-on.
- **v1.0:** watch together, dialogue boost, chapter detection, indie filmmaker uploads with Leash-approved payouts, Apple TV app, published add-on review policy.

## Market notes

Prices are third-party estimates gathered in October 2026.

- Netflix (US): reported $8.99 (with ads), $19.99 (Standard) and $26.99 (Premium) per month after a March 2026 increase. Source: [Fox 5 NY](https://www.fox5ny.com/news/netflix-raising-prices-again-all-plans-how-much-more-youll-be-paying).
- Plex Pass: reported $6.99/month or $69.99/year; lifetime reported to rise from $249.99 to $749.99 on July 1, 2026; remote streaming of personal media has needed a paid pass since April 2025. Sources: [9to5Mac](https://9to5mac.com/2026/05/19/plex-increasing-lifetime-plex-pass-cost-to-whopping-750/), [The Mac Observer](https://www.macobserver.com/news/plex-lifetime-pass-jumps-from-250-to-750-starting-july-2026/).
- Jellyfin: GPL-2.0, per the LICENSE file in [jellyfin/jellyfin](https://github.com/jellyfin/jellyfin).
- Kodi: GPL-2.0-or-later with GPL-2.0-only parts per [Debian's Kodi copyright file](https://metadata.ftp-master.debian.org/changelogs/main/k/kodi/stable_copyright); verify license against [xbmc/xbmc](https://github.com/xbmc/xbmc).
- Kodi's public position on piracy add-ons (a neutral tool whose team discourages piracy): [TorrentFreak](https://torrentfreak.com/?p=117828), [Trusted Reviews](https://www.trustedreviews.com/news/kodi-addons-illegal-streaming-warning-3686613).
- Availability data: TMDB watch providers require JustWatch attribution ([FileBot forum quoting TMDB](https://www.filebot.net/forums/viewtopic.php?p=64174)); Watchmode offers a non-commercial free tier and paid plans reported from $349/month ([Watchmode API](https://api.watchmode.com/), [terms](https://api.watchmode.com/tc)). Verify which source fits.
- Filmspeler ruling: [CJEU C-527/15 on EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62015CJ0527).
