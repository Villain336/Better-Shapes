# Keyring

> Every password and passkey, in one safe place.

- **Lane:** Passwords
- **Status:** Planned (everyday app; ships only after an independent security audit)
- **License:** AGPL-3.0
- **Open-source alternative to:** 1Password
- **Audience:** Families and teams
- **Built on:** established, audited cryptography libraries (libsodium, the platform WebCrypto APIs, a maintained Argon2id implementation); no new cryptography; Leash is not used inside the vault

## Summary

Keyring is an end-to-end encrypted vault for passwords, passkeys, payment cards, secure notes and developer secrets, with autofill in every major browser and on iOS and Android, and safe sharing with family members or a team. It is zero-knowledge: everything is encrypted on the person's device with keys derived from their master password (using Argon2id) and device keys, so the server, whether self-hosted or hosted, stores only ciphertext it cannot read. Keyring can create, store and use passkeys through the platforms' credential-provider APIs and a browser extension. It does not launch publicly until an independent security firm has audited the design and code and the report is published.

## Why it matters

1Password is reported at roughly $2.99 per month for one person and $4.99 per month for a family of five, with business plans around $7.99 per user per month; prices vary by promotion and region. That is not expensive for what it protects. The case for Keyring is not price. It is that a family or team can read the code that protects every account they have, host the encrypted vault themselves, and not depend on one company's continued good behavior.

That case is already well served:

- **Bitwarden** is open source with a mixed model. Its client apps default to GPL-3.0 and its server defaults to AGPL-3.0, while code in each repository's `/bitwarden_license` directory is under the source-available Bitwarden License, and Bitwarden's trademarks are not licensed. In 2024 a new SDK dependency raised concerns that the desktop client could not be built from GPL code alone; Bitwarden's CTO said packaging was adjusted so the apps can be built using only GPL/OSI-licensed code (verify license of the current SDK packages).
- **Vaultwarden** (AGPL-3.0) is a lightweight, unofficial server compatible with Bitwarden clients, very popular with self-hosters.
- **KeePassXC** (GPL, verify license) is a strong local-file option for people who do not want a server at all.

**Recommendation.** A password manager is the product where a small team is most likely to cause real harm. The studio should not write new cryptography and should seriously consider whether Keyring needs to exist. The default recommendation for families today is Bitwarden or Vaultwarden. Keyring proceeds only if it can (a) reuse a published, audited protocol design or audited libraries end to end, (b) fund an independent audit before launch and after major changes, and (c) offer something real on top, such as a calmer family experience and first-class team secrets for developers. The milestones include a hard stop if (b) is not funded.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| Family organizer | "Share the streaming, utility and bank logins with my partner, and keep the kids' accounts separate." |
| Older relative | "Stop writing passwords in a notebook, and still be able to get in if I forget my master password." |
| Team admin | "Give the team shared vaults, remove access the moment someone leaves, and see an access log." |
| Developer | "Keep API keys and SSH keys in the same vault and use them from the command line." |
| Security-minded user | "Read how my data is encrypted, and host the encrypted server myself." |

## MVP scope

1. **Zero-knowledge vault.**
   Items: logins, passkeys, cards, identities, secure notes and secrets. Encryption and decryption happen only on the device.
   *Acceptance:*
   - The server never receives the master password, the derived key or plaintext item data; a test harness inspects all traffic to confirm it.
   - The cryptographic design is published as a document before v0.5 and matches the code.
2. **Key derivation and account recovery.**
   Master password stretched with Argon2id (parameters at or above the OWASP minimum of 19 MiB memory, 2 iterations, 1 lane, tuned upward per device), combined with a device-generated secret key for new devices. Recovery through a printed recovery kit or a trusted family member's approval, never through the server alone.
   *Acceptance:*
   - KDF parameters are stored per account and can be raised without re-creating the vault.
   - Losing both the master password and every recovery method means the data is unrecoverable, and the app says so plainly at sign-up.
3. **Passkeys and WebAuthn.**
   Create, store, sync and use passkeys through the browser extension (WebAuthn) and as a credential provider on iOS and Android; import and export through the FIDO credential-exchange formats when they are final (verify status).
   *Acceptance:*
   - Passkey registration and sign-in pass the public WebAuthn conformance tests that apply to authenticators.
   - Private keys never leave the encrypted vault in plaintext.
4. **Autofill everywhere.**
   Browser extensions for Chromium browsers, Firefox and Safari; iOS and Android autofill services; a desktop app and a command-line tool.
   *Acceptance:*
   - Autofill never fills into a page whose origin does not match the saved item, including subdomain and lookalike-domain tests.
   - Autofill into iframes requires a user action.
5. **Family and team sharing.**
   Shared vaults with roles; sharing uses public-key encryption so the server cannot read shared items.
   *Acceptance:*
   - Removing a member rotates the shared vault key and re-encrypts for remaining members.
   - An access log records who opened or changed shared items (stored without plaintext).
6. **Import and export.**
   Import from common password-manager export formats (CSV and published JSON formats); export to an encrypted file and to plain CSV with a clear warning.
   *Acceptance:*
   - A round-trip export and import of a 1,000-item vault loses nothing.

## Not in v1

- Breach monitoring that sends hashes of passwords to a third party (a k-anonymity check against a public breach database may come later, opt-in).
- Single sign-on and directory sync for large enterprises.
- Travel mode and other advanced vault-hiding features.
- Any custom cipher, protocol or "improved" algorithm.
- Hosted Keyring run by the studio. v1 is self-hosted only, so the studio never holds anyone's encrypted vaults before it has the audit history to justify it.
- Emergency-access timers and inheritance features beyond the trusted-contact recovery above.
- Password-sharing links to people without a Keyring account.

## Architecture

- **Stack:** core vault logic in Rust (compiled to native and WebAssembly) so every client shares one audited implementation; clients in TypeScript (browser extension, web), Swift and Kotlin (mobile autofill and credential providers); server in Rust or Go with Postgres, storing only ciphertext, metadata needed for sync, and public keys.
- **Cryptography (all from established libraries):** Argon2id from a maintained implementation (for example libsodium or the RustCrypto `argon2` crate); authenticated encryption with XChaCha20-Poly1305 or AES-256-GCM from libsodium or RustCrypto; X25519 for sharing; HKDF for key separation; platform secure enclaves and keychains for device keys. No hand-written primitives.
- **Data model sketch (server sees ciphertext only):** `Account` (KDF params, encrypted account key, public key), `Device`, `Vault` (encrypted vault key per member), `Item` (encrypted blob, revision), `Membership` (role), `ShareInvite`, `RecoveryContact`, `AccessLogEntry`, `AuditEvent`.
- **Where AI runs:** nowhere in the vault. AI features, if ever added, must not see plaintext secrets.
- **Leash fit:** none inside the vault. Keyring can store model API keys that Leash-based products use, but Leash never gets vault access.
- **Self-host story:** one container plus Postgres; TLS required; documented backups of the encrypted database.

## Relationship to ShapesOS

Minimal by design. ShapesOS manages model keys in `lib/llm/workspace-keys.ts`; a later integration could let a workspace pull those keys from a Keyring team vault, implemented on the ShapesOS side. No ShapesOS code goes into Keyring's cryptographic core.

## Clean-room sources

- Behavior is specified only from public information: 1Password's public help center and security white paper, Bitwarden's public security documentation, W3C WebAuthn and FIDO Alliance specifications, OWASP guidance, and ordinary use.
- We never decompile, trace or copy proprietary code, UI assets, icons, copy or trademarks. "1Password" and "Bitwarden" are trademarks of their owners.
- Reused open source with licenses: libsodium (ISC); RustCrypto crates (MIT/Apache-2.0, verify license per crate). Bitwarden's GPL-3.0 clients and AGPL-3.0 server, and Vaultwarden (AGPL-3.0), are references and possible code sources; nothing from any `/bitwarden_license` directory is used, and the license of any Bitwarden SDK package is checked before use (verify license).

## Risks

- **Security (the main risk):** a flaw in encryption, key handling, autofill origin checks or the update channel could expose every account a person has. Mitigation: no new cryptography; one shared Rust core; a published threat model; an independent audit before public launch and after major changes, with reports published; a bug bounty; reproducible, signed builds; and a security contact and disclosure policy from day one.
- **Supply chain:** a compromised dependency or browser-extension update is a direct path to secrets. Mitigation: minimal dependencies, pinned and reviewed versions, signed releases and staged rollouts.
- **Account lockout:** zero-knowledge means no "reset my password" from the server. Mitigation: recovery kit and trusted-contact recovery, explained at sign-up.
- **Phishing and autofill abuse:** lookalike domains and hidden form fields can trick autofill. Mitigation: strict origin matching, no autofill on page load, and passkeys promoted as the phishing-resistant option.
- **Legal:** low on licensing if the rules above are kept; liability after a breach is high. Mitigation: clear terms, no launch before audit.
- **Name:** "Keyring" is a generic term and the name of existing software (for example GNOME Keyring); trademark check before launch.

## Milestones

- **v0.1 (internal, not for real secrets):** Rust core with Argon2id, item encryption, sync to a self-hosted server, CLI and web client; published crypto design draft.
- **v0.5 (closed beta, test accounts only):** browser extensions, mobile autofill, passkeys, family sharing, import/export. **Hard stop:** independent audit funded and scheduled, or the project pauses and recommends Bitwarden or Vaultwarden.
- **v1.0 (public):** audit completed and findings fixed, report published, bug bounty live, signed reproducible builds on all platforms.

## Market notes

Prices are third-party estimates gathered in October 2026; review sites report promotional prices that vary by region.

- 1Password: Individual reported at about $1.99–$2.99/month, Families about $2.99–$4.99/month, Business about $7.99/user/month. Sources: [Cybernews, 1Password pricing 2026](https://password-manager.cybernews.com/1password-review/1password-pricing/), [Subger](https://subger.com/en/gb/service/1password-nordic). Verify on 1Password's pricing page.
- Bitwarden licensing: clients default GPL-3.0 and server default AGPL-3.0, with source-available code only in `/bitwarden_license`, per [bitwarden/clients LICENSE.txt](https://github.com/bitwarden/clients/blob/main/LICENSE.txt) and [bitwarden/server LICENSE.txt](https://github.com/bitwarden/server/blob/main/LICENSE.txt). SDK licensing discussion: [AlternativeTo, October 2024](https://alternativeto.net/news/2024/10/bitwarden-cto-clarifies-sdk-license-concerns-reaffirming-open-source-commitment).
- Vaultwarden: AGPL-3.0, per [dani-garcia/vaultwarden LICENSE.txt](https://github.com/dani-garcia/vaultwarden/blob/main/LICENSE.txt).
- Argon2id parameters: [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
