# Toss

> Send anything to the device next to you.

- **Lane:** File sharing
- **Status:** Planned (everyday app)
- **License:** MIT
- **Open-source alternative to:** AirDrop and Quick Share
- **Audience:** Anyone with more than one kind of device
- **Built on:** the LocalSend protocol (open, documented) as the default wire format, if the decision below holds; no Leash, because nothing here acts on anyone's behalf

## Summary

Toss sends files, folders, photos, links and clipboard text between phones and computers on any operating system, directly over the local network, with no account and no cloud upload. Devices find each other with mDNS, talk over TLS, and the first time two devices meet, both screens show the same short verification code so the person can see they are connected to the right device. After that the pairing is remembered by pinning the other device's certificate. When two devices cannot reach each other directly (guest Wi-Fi, client isolation, a phone on mobile data), Toss can fall back to an end-to-end encrypted WebRTC connection set up through a small signaling server that never sees file contents.

## Why it matters

AirDrop and Quick Share are free, so the problem is not price. It is that each one works best inside its own ecosystem. A household or office with an iPhone, an Android phone, a Windows laptop and a Linux desktop ends up emailing files to itself or uploading them to a cloud drive to move them two meters.

An open-source tool already solves much of this. **LocalSend** is a mature, popular cross-platform app that does local, encrypted, account-free transfers today. Its repository is currently licensed Apache-2.0 (older write-ups describe it as MIT; the repository's current license is what applies). Any honest plan for Toss starts there.

What Toss would add is narrow:

- **A visible device check.** LocalSend's documented protocol identifies devices by a certificate fingerprint and supports an optional PIN, but it does not describe a short code that both screens show on first contact. Toss makes that check the default, so a stranger's laptop on café Wi-Fi with a similar name cannot receive a file by mistake.
- **A fallback when the local network will not cooperate**, using WebRTC.
- **Folders, clipboard and links as first-class items**, not just files.

**Recommendation.** Do not fork the ecosystem. Toss should speak the LocalSend protocol by default so Toss users can send to and receive from LocalSend users, and the studio should propose the verification code and WebRTC fallback upstream as protocol extensions first. If upstream accepts them, the best outcome may be contributing to LocalSend and shipping Toss only as a thin, differently designed client, or not at all. The milestones below include that decision point on purpose.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| Mixed-device household | "Get the photo from my Android phone onto my partner's iPhone without a cloud service." |
| Office worker | "Move a PDF from my phone to the Windows desktop I'm sitting at, without emailing myself." |
| Developer | "Paste a long command from my laptop's clipboard to the Linux box next to it." |
| Teacher | "Hand a folder of worksheets to 20 student devices on the school network." |
| Privacy-minded user | "Know which device I'm sending to and that nothing went through a server." |

## MVP scope

1. **Discovery.**
   Devices advertise and browse with mDNS / DNS-SD on the local network, with LocalSend-compatible multicast announcement as a second path.
   *Acceptance:*
   - Two devices on the same Wi-Fi see each other within 3 seconds of opening the app.
   - A device can be hidden (receive-only from known devices, or invisible) with one switch.
   - Nothing is announced on networks marked "public" until the person opts in.
2. **Encrypted transfer with a visible device check.**
   Each install generates a long-lived key pair and self-signed certificate. On first contact both devices show the same 6-digit code derived from both certificate fingerprints; the person confirms on the receiving side. After confirmation the peer's certificate is pinned.
   *Acceptance:*
   - No file bytes move before the receiver accepts.
   - If a pinned device presents a different certificate, the transfer stops with a plain warning and requires a fresh check.
   - The code derivation is documented and has a published test vector.
3. **Interoperability with LocalSend.**
   Send to and receive from LocalSend apps using its documented protocol (v2.x).
   *Acceptance:*
   - Round-trip transfers with the current LocalSend release on Android, iOS, macOS, Windows and Linux pass an automated test matrix.
   - When the other side does not support the verification code, Toss says so and falls back to fingerprint display or PIN.
4. **Files, folders, clipboard and links.**
   Folders keep their structure; text and links can go straight to the receiver's clipboard or open in its browser after a prompt.
   *Acceptance:*
   - A 2 GB file transfers on a typical home Wi-Fi network without running out of memory on a mid-range phone.
   - Interrupted transfers resume.
   - Links never open without the receiver's tap.
5. **WebRTC fallback.**
   When direct connection fails, devices can pair through a QR code or short link, exchange signaling through a small relay server, and transfer over a WebRTC data channel with DTLS. The verification code still applies.
   *Acceptance:*
   - The signaling server stores nothing after the session ends and never sees file contents.
   - The fallback is off by default on desktop and clearly labeled when used.
   - A public TURN relay is never used without saying so; self-hosted TURN is documented.
6. **Apps for every platform.**
   iOS and Android apps with a share-sheet entry, desktop apps for macOS, Windows and Linux, and a command-line tool.
   *Acceptance:*
   - Reproducible builds from public CI; Linux packages on Flathub.
   - The app works with no network beyond the local one.

## Not in v1

- Internet transfers between devices in different places (beyond the WebRTC fallback for devices that are physically together).
- Accounts, contacts or cloud history.
- Continuous folder sync (Syncthing already does this well; Toss sends, it does not sync).
- Being the system default for sharing on iOS; platform rules do not allow it, and Toss will not pretend otherwise.
- Bluetooth-only transfers.

## Architecture

- **Stack:** shared core in Rust (discovery, protocol, crypto, transfer state) with thin native UIs: SwiftUI on Apple platforms, Kotlin/Jetpack Compose on Android, and a Tauri desktop shell. Alternatively reuse LocalSend's Flutter app structure as a reference; decide at the v0.1 review.
- **Protocol approach:**
  - Discovery: mDNS / DNS-SD service records plus LocalSend's multicast UDP announcement for compatibility.
  - Transport: HTTPS over TCP between peers, each side with a self-signed certificate. Trust comes from the verification code and pinning, not from certificate authorities.
  - Verification code: both sides hash the two certificate fingerprints in a fixed order and display six digits. This is a short authentication string; it only resists an active attacker because the person compares it, so the UI makes comparing it easy and unavoidable on first contact.
  - Fallback: WebRTC data channel (DTLS-SRTP keys bound to the same verification code), signaling over a minimal WebSocket relay, optional TURN.
- **Data model sketch (local):** `Identity` (key pair, certificate), `Peer` (name, pinned fingerprint, first-seen, verified-at), `Transfer` (direction, items, status, bytes), `Item` (file, folder, text, link), `Setting`. Stored in SQLite on device.
- **Where AI runs:** nowhere. Toss does not need it.
- **Self-host story:** nothing to host for local use. The optional signaling relay is a single small binary or container.

## Relationship to ShapesOS

Toss is MIT and ShapesOS is AGPL-3.0, so, as with Forge, code does not flow from ShapesOS into Toss unless the studio holds copyright on every contribution involved and chooses to relicense. In practice there is little to share: Toss is a device-to-device tool. A later ShapesOS integration could offer "send to Toss" from its files area, implemented on the ShapesOS side.

## Clean-room sources

- Behavior is specified only from public information: Apple's and Google's public help pages for AirDrop and Quick Share, the published LocalSend protocol document, RFCs (DNS-SD RFC 6763, mDNS RFC 6762, TLS 1.3 RFC 8446) and W3C/IETF WebRTC specifications, and ordinary use.
- We never decompile, trace or copy proprietary code, UI assets, icons, copy or trademarks. "AirDrop" and "Quick Share" are trademarks of their owners and do not appear in the product UI; the comparison lives only in docs.
- Reused open source with licenses: LocalSend (Apache-2.0) as protocol reference and possible code source; Apache-2.0 code can be included in an MIT project with its license and notices kept (verify license per file). Rust crates such as rustls (Apache-2.0/MIT/ISC, verify license) and an mDNS crate (verify license). WebRTC via webrtc-rs or platform libraries (verify license).
- No GPL or AGPL code goes into Toss.

## Risks

- **Ecosystem:** a second protocol would split a small community. Mitigation: LocalSend compatibility is a v0.1 requirement, extensions are proposed upstream first, and the go/no-go review can end in "contribute instead".
- **Security:** man-in-the-middle on shared networks, malicious files and link spoofing. Mitigation: verification code and pinning, no auto-open of anything, file names sanitized, executable types flagged, and an external review of the protocol and crypto before v1.0.
- **Platform limits:** iOS restricts background discovery and local network access; Android vendors kill background services. Mitigation: be honest in the UI ("open Toss on both devices"), request only the permissions needed.
- **Legal:** low. Users can send anything, as with any file tool; Toss stores nothing on a server.
- **Name:** "Toss" is a common word and used by other apps (including a large Korean fintech brand); trademark check before launch.

## Milestones

- **v0.1:** Rust core with mDNS discovery, TLS transfer and the verification code; desktop CLI; interoperability tests against LocalSend. **Decision point:** if LocalSend accepts the verification-code extension, decide whether Toss continues as its own client.
- **v0.5:** desktop and Android apps, folders, clipboard and links, resume, certificate pinning UX.
- **v1.0:** iOS app, WebRTC fallback with self-hostable relay, external security review published, reproducible builds for all platforms.

## Market notes

AirDrop and Quick Share are free with their platforms, so there are no prices to compare; the cost is lock-in.

- LocalSend: open-source, cross-platform local sharing. Current license Apache-2.0 per the repository; an April 2024 review described it as MIT, so the license appears to have changed (verify license and date in the repository history). Sources: [localsend/localsend on GitHub](https://github.com/localsend/localsend), [Flathub listing](https://flathub.org/apps/org.localsend.localsend_app), [Tux Machines review, April 2024](https://news.tuxmachines.org/n/2024/04/22/Review_LocalSend_sharing_files_on_a_local_network.shtml).
- LocalSend protocol (multicast discovery on port 53317, HTTPS with SHA-256 certificate fingerprints, optional PIN): [localsend/protocol README](https://github.com/localsend/protocol).
- Third-party LocalSend protocol implementations exist (for example LocalGo, MIT), which suggests the protocol is stable enough to target: [LocalGo on pkg.go.dev](https://pkg.go.dev/github.com/bethropolis/localgo@v0.6.0).
