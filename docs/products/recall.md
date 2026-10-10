# Recall

> Ask your company anything.

- **Lane:** Company search
- **Status:** Planned (last in the build order)
- **License:** AGPL-3.0
- **Open-source alternative to:** Glean
- **Audience:** Teams drowning in tools
- **Built on:** Leash (MIT) for assistant actions, approvals and audit

## Summary

Recall is one search box and assistant across a team's documents, chat, tickets and code. It indexes connected tools, keeps each source's permissions in sync, and answers questions with links to the exact passages it used. A person can only ever see results and answers built from content they could already open in the original tool. The assistant can also take small actions, such as filing a ticket or drafting a reply, through Leash approvals. It runs on the team's own infrastructure, so the index of everything the company knows does not live with a third party.

## Why it matters

Enterprise search with AI answers is typically sold on annual contracts. Glean does not publish prices; third-party estimates put it around $50 per user per month with a common minimum of about 100 seats, an AI add-on, and annual minimums near $50,000 to $60,000. That prices out most teams under a few hundred people, which are exactly the teams whose knowledge is scattered across a dozen tools.

Open source wins because company search is a trust problem. A single index of every doc, message and ticket is one of the most sensitive systems a company can run. Being able to read the permission-checking code, run it inside your own network, and choose your own models is worth more than a polished hosted service. Good open-source building blocks (Postgres, pgvector, full-text engines, open embedding models) make it practical.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| New hire | "Find out how we do X without asking five people." |
| Engineer | "Find the design doc, the Slack thread and the PR behind this decision." |
| Support / success | "Answer a customer question using what product and engineering already wrote down." |
| IT / security | "Give people search across tools without creating a backdoor around permissions." |

## MVP scope

1. **Connectors.**
   v1 connectors: Google Drive, Slack, GitHub (issues, PRs, Markdown), Notion, a Confluence-compatible wiki, Linear or Jira (one of the two), and local file upload. Each connector uses the public API of its tool.
   *Acceptance:* initial sync of 100,000 documents completes within 24 hours on the reference hardware; incremental sync picks up edits within 15 minutes; connector health and last sync time are visible.
2. **Permission sync.**
   Store per-document access lists (users, groups, "anyone in domain") from each source and enforce them at query time.
   *Acceptance:* an automated test suite checks that a user never receives a result, snippet or answer sentence drawn from a document they cannot open in the source; permission revocations take effect within the next sync cycle and immediately on a manual "re-check".
3. **Hybrid search.**
   Keyword plus vector search with re-ranking; filters by source, author, date.
   *Acceptance:* p95 query latency under 800 ms on one million chunks; results show source, title, snippet and date.
4. **Answers with sources.**
   An assistant answers questions using only retrieved, permitted passages and cites them.
   *Acceptance:* every factual sentence in an answer is attached to a citation, or the assistant says it could not find it.
5. **Assistant actions.**
   A small set of Leash tools: create a ticket, draft a Slack message, draft an email.
   *Acceptance:* any action that posts or sends waits for the user's approval; the draft shows exactly what will be posted and where.
6. **Admin console.**
   Connector setup, sync status, excluded sources and paths, usage, audit log.
   *Acceptance:* an admin can exclude a channel or folder and confirm that its content disappears from the index within one sync cycle.

## Not in v1

- A no-code agent builder.
- Email inbox indexing (privacy review first).
- Meeting transcript indexing (comes from Echo later).
- Browser extension and desktop app.
- More than the listed connectors; a connector SDK is in v1.0 so the community can add more.

## Architecture

- **Stack:** Next.js and TypeScript for the web app and admin; Postgres with row-level security and Prisma for metadata, access lists and audit; pgvector for embeddings at small scale, with an optional OpenSearch (Apache-2.0) backend for large installs; a worker pool for connectors and indexing.
- **Data model sketch:** `Connector`, `SyncRun`, `Document` (source id, url, title, updated), `Chunk` (text, embedding), `Principal` (user or group, per source), `DocumentAcl` (document, principal, allow), `IdentityLink` (maps a Recall user to identities in each source), `Query`, `Answer` (citations), `ActionDraft`, `AuditEvent`.
- **Where AI runs:** embedding at index time (local open models by default), re-ranking and answer generation at query time with a pluggable provider. Permission filtering happens before retrieval results reach the model, never after.
- **Leash fit:** search and read are low risk; posting, creating and sending are high risk and need approval. Spend caps limit model usage per user per day. The audit log records queries that returned content from restricted sources, for security review.
- **Self-host story:** docker compose for small teams (app, Postgres with pgvector, worker); a Helm chart for larger ones. Runs with a local embedding model and no external keys, using a sample corpus.

## Relationship to ShapesOS

Recall can embed in ShapesOS as its company-wide search and borrow existing pieces (both AGPL-3.0).

- `lib/search/` (`records.ts`, `kinds.ts`): ShapesOS global record search, which already runs every source inside one workspace-scoped, row-level-security transaction. Recall generalizes this from ShapesOS records to outside tools.
- `lib/knowledge/contextdev/` and `app/dashboard/intelligence/knowledge/`: the Knowledge corpus and crawl/research code.
- `lib/connectors/` (`github.ts`, `safe-fetch.ts`, `sync-conflict.ts`, `m21/`): connector patterns, including a safe outbound fetch.
- `lib/chat/` (`agent.ts`, `tools.ts`, `tool-exec.ts`) and `app/dashboard/assistant/`: the assistant and tool execution that Recall's assistant extends.
- `lib/substrate/`: the business graph; Recall results can link to it when embedded.

## Clean-room sources

- Behavior is specified only from public information: Glean's public docs, help center, marketing pages, public talks and demo videos, and ordinary hands-on use where available.
- We never decompile, trace or copy proprietary code, UI assets, icons, copy or trademarks. Features and screens use original names.
- Connectors are written against each tool's public API reference and follow its terms.
- Reused open source and prior art: Leash (MIT); pgvector (PostgreSQL License); OpenSearch (Apache-2.0); open embedding models under their own licenses (verify license per model). Onyx (formerly Danswer) is a useful public reference; its core is MIT and its `ee/` directories are under a separate enterprise license, so we may study or reuse only the MIT parts, with attribution.

## Risks

- **Legal:** indexing employee messages may need works-council or privacy review in some countries; admins need clear controls to exclude sources. Connector API terms may restrict bulk indexing; check each.
- **Technical:** permission sync is the hard part and failures leak data. Mitigation: deny by default when an access list is unknown, a dedicated permission test suite, and a "why can I see this" explainer for admins. Source API rate limits slow initial syncs.
- **Inference cost:** embedding a large corpus once is affordable with local models; per-query answer generation is the ongoing cost. Mitigation: cache answers for identical permission sets, use small models for re-ranking, daily caps.
- **Name:** "Recall" is used by other products (for example Recall.ai and a Microsoft Windows feature); trademark check before launch.

## Milestones

- **v0.1:** Google Drive, GitHub and file upload connectors; permission sync for those; hybrid search; answers with citations.
- **v0.5:** Slack, Notion and one ticketing connector; admin console; Leash actions with approval; permission test suite in CI.
- **v1.0:** wiki connector, connector SDK, OpenSearch backend option, Helm chart, ShapesOS embedding, published threat model.

## Market notes

Prices are third-party estimates gathered in October 2026; Glean does not publish pricing.

- Glean: commonly reported around $50 per user per month, plus about $15 per user per month for AI features, with annual minimums around $50,000 to $60,000 and paid proofs of concept. Sources: [eesel, Glean AI pricing 2026](https://www.eesel.ai/blog/glean-ai-pricing), [GoSearch, Glean pricing explained](https://www.gosearch.ai/blog/glean-pricing-explained), [Onyx, Glean cost calculator](https://onyx.app/glean-cost-calculator).
- Several sources are competitors of Glean; treat figures as directional.
- Onyx licensing (MIT core, enterprise license for `ee/`): [Open WebUI docs, Onyx alternative notes](https://docs.openwebui.com/alternatives/onyx.txt), [WZ-IT, Onyx self-hosted and licensing](https://wz-it.com/en/blog/onyx-self-hosted-installation/). Verify against the LICENSE file in the Onyx repository.
