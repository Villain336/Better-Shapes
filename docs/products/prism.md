# Prism

> A spreadsheet where every cell can research.

- **Lane:** GTM data & research
- **Status:** Planned (second in the build order)
- **License:** AGPL-3.0
- **Open-source alternative to:** Clay
- **Audience:** Growth, sales and RevOps teams
- **Built on:** Leash (MIT) for research agents, spend caps and CRM write approvals

## Summary

Prism is a table for go-to-market work. Each row is a company or a person; each column is either plain data, an enrichment step that asks a data provider, or a research column where an AI agent reads the web and writes back an answer with its sources. Providers are chained in a waterfall the team chooses, using the team's own API keys, so there are no locked credits and no markup. Before a large run, Prism shows an estimated cost and a hard cap. Scoring, dedupe and routing turn the table into a clean list, and syncing to a CRM is a proposed change that a person approves.

## Why it matters

Clay made "enrichment in a spreadsheet" the standard way to build lists. Its plans are reported at roughly $185 to $495 per month for self-serve tiers, with enterprise deals around $30,000 per year, and usage is metered in two kinds of credits. Teams pay for data twice: once through the platform's credits and again when they already hold contracts with the underlying providers.

Open source wins because the core value is orchestration: deciding which provider to ask first, caching results, and keeping a clear record of what was paid for. That logic is ordinary software and should belong to the team. Bring-your-own-key also makes costs visible per lookup, and self-hosting keeps prospect data out of yet another vendor's database.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| SDR / founder | "Paste 300 domains, get the right contact and a reason to reach out, without copying between ten tabs." |
| RevOps | "Use the providers we already pay for, in our order, and never pay twice for the same lookup." |
| Growth marketer | "Ask a question of every row (does this company sell to hospitals?) and see the source for each answer." |
| Sales manager | "Score and route accounts to the right rep, and only push clean, deduped records to the CRM." |

## MVP scope

1. **Table workspace.**
   Fast grid with up to 50,000 rows per table, CSV import/export, column types (text, number, URL, email, JSON, enrichment, research, formula).
   *Acceptance:* scrolling 50,000 rows stays smooth on a mid-range laptop; CSV round-trip preserves values exactly.
2. **Waterfall enrichment.**
   A column that tries providers in a chosen order and stops at the first valid hit. v1 ships adapters for a handful of providers with public APIs and a generic HTTP adapter.
   *Acceptance:* each attempt (hit, miss, error, skipped) is recorded with provider, cost and timestamp; a repeated lookup of the same input within the cache window costs nothing and is labeled "cached".
3. **Cost estimate and caps.**
   Before running a column on many rows, show the estimated cost per provider and total.
   *Acceptance:* runs above the workspace cap refuse to start; a run stops when the cap is reached mid-way and reports exactly how many rows completed.
4. **AI research columns.**
   A prompt template with row variables; a research agent may search the web and read pages, then returns an answer plus source URLs.
   *Acceptance:* every non-empty research cell links to at least one source; cells where the agent found nothing say so instead of guessing; the agent's page fetches respect robots.txt.
5. **Formulas, scoring and filters.**
   Simple formula language plus a scoring column built from weighted rules.
   *Acceptance:* scores recompute on change; the rule set is visible and exportable.
6. **Dedupe.**
   Match on domain, email and fuzzy company name, with a merge preview.
   *Acceptance:* no merge happens without a preview; merges can be undone.
7. **CRM sync with approval.**
   Push rows to HubSpot or to ShapesOS CRM as creates and updates.
   *Acceptance:* a sync produces a change set (creates, updates, skips) that a person approves in the Leash queue before any write; field mapping is saved per table.
8. **Bring your own keys.**
   Keys are stored encrypted per workspace; Prism adds no markup.
   *Acceptance:* the provider settings page shows which key each column uses and its month-to-date spend as reported by Prism's own records.

## Not in v1

- A bundled data marketplace or resold credits.
- Automated outbound email sending (that belongs to ShapesOS Nurture).
- Scheduled table refreshes and webhooks into tables (v0.5 at the earliest).
- Salesforce sync (HubSpot and ShapesOS first).
- Scraping sites that forbid it, or LinkedIn scraping of any kind.

## Architecture

- **Stack:** Next.js and TypeScript; Postgres with row-level security; Prisma; a job queue for column runs (Postgres-backed to keep self-hosting simple). The grid uses an open-source canvas or virtualized grid component (Glide Data Grid, MIT, or Univer, Apache-2.0; pick one after a performance spike).
- **Data model sketch:** `Table`, `Column` (type, config, provider order), `Row`, `Cell` (value, status, source refs, cost), `ProviderKey` (encrypted), `Lookup` (provider, input hash, result, cost, cached-until), `ResearchTrace` (queries, pages, answer), `ScoringRule`, `SyncPlan`, `SyncItem`.
- **Where AI runs:** research columns run as Leash agents on the worker, one bounded run per cell with a step limit and a token cap. Model choice per column; small models for extraction, larger ones for judgment.
- **Leash fit:** web fetch and search tools are low risk but metered; paid provider lookups are metered against spend caps; CRM writes are high risk and always need approval. Every lookup and write lands in the audit log, which doubles as the cost ledger.
- **Self-host story:** docker compose with app, Postgres and worker; works with no keys using a sample dataset and a mock provider, clearly labeled.

## Relationship to ShapesOS

Prism is the standalone, table-first form of ShapesOS Prospects and enrichment (both AGPL-3.0).

- `lib/enrichment/` (`waterfall.ts`, `provider.ts`, `research.ts`, `crm-sync.ts`, `guard.ts`): the waterfall with stop-at-first-hit, per-attempt audit rows and cost estimate are the starting point to extract.
- `app/dashboard/prospects/ProspectsApp.tsx`: the existing Prospects screen.
- `lib/crm/` (`dedup.ts`, `csv-import.ts`, `leads.ts`) and `app/dashboard/crm/`: dedupe and import logic; ShapesOS CRM is a first-class sync target.
- `lib/knowledge/contextdev/` (`research.ts`, `research-tool.ts`, `budgets.ts`): research-agent tools and budget handling.
- `lib/univer/`: the existing Univer integration if Univer is chosen for the grid.
- `lib/metering/`: credit and spend-cap patterns that Leash will generalize.

## Clean-room sources

- Behavior is specified only from public information: Clay's public docs, help center, pricing page, university/tutorial videos, marketing pages and hands-on use of a free account.
- We never decompile, trace or copy proprietary code, UI assets, icons, templates, copy or trademarks. Original names are used for every feature (for example "research column" and "waterfall", which are generic terms; no vendor-specific product names).
- Provider adapters are written against each provider's public API reference and follow that provider's terms of service.
- Reused open source: Leash (MIT); Glide Data Grid (MIT) or Univer (Apache-2.0); HubSpot's official Node client (verify license).

## Risks

- **Legal:** personal data about prospects falls under GDPR, CCPA and similar laws. Prism must support deletion requests, record the source of each data point, and document lawful-basis responsibilities for the operator. Provider terms may forbid caching or resale; adapters respect cache limits per provider.
- **Technical:** web research is slow and flaky; pages block bots. Mitigation: per-cell timeouts, retries with backoff, clear "could not fetch" states.
- **Inference cost:** a research column over 10,000 rows can cost real money. Mitigation: estimate before run, hard caps, small models by default, and sampling ("run on 20 rows first").
- **Data quality:** an AI answer with a source can still be wrong. Show sources inline and allow quick human correction that is remembered.

## Milestones

- **v0.1:** grid with CSV, two enrichment providers plus generic HTTP, waterfall with audit and cache, cost estimate.
- **v0.5:** research columns with sources, scoring, dedupe, Leash caps, HubSpot and ShapesOS CRM sync behind approval.
- **v1.0:** 50,000-row performance target, scheduled refresh, provider adapter SDK, data deletion tools, published threat model.

## Market notes

Prices are third-party estimates gathered in October 2026; confirm on the vendor's own pricing page.

- Clay 2026 plans reported as Free, Launch (~$185/month), Growth (~$495/month) and Enterprise (~$30,000/year median), with separate Data Credits and Actions since March 2026. Sources: [Valley, Clay pricing and credits 2026](https://www.joinvalley.co/blog/clay-pricing-and-credits-explained-2026), [Zeliq, Clay pricing 2026](https://www.zeliq.com/blog/clay-pricing), [Docket, Clay pricing](https://www.docket.io/resources/research/clay-pricing).
- Some sources still show older plan names and prices; we treat the newer ones as current.
