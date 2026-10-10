# Concierge

> An AI support agent that can actually do things.

- **Lane:** AI customer agent
- **Status:** Planned (first in the build order)
- **License:** AGPL-3.0
- **Open-source alternative to:** Sierra, Decagon and Intercom Fin
- **Audience:** Support and CX teams
- **Built on:** Leash (MIT) for tools, approvals, spend caps and audit

## Summary

Concierge is a customer-facing support agent that answers questions from a team's own documentation, cites where each answer came from, and takes real actions such as refunds, order changes and bookings. Every action that touches money, a customer account or an outside system is a Leash tool with a risk level; risky calls wait in an approval queue until a person says yes, unless the team has set an explicit, capped auto-approve policy. When the agent is unsure, or the customer asks for a person, it hands off with the whole conversation, the sources it looked at and the actions it considered. Teams can self-host it with their own model keys, so the price of resolving a ticket is the price of the inference, not a per-resolution fee.

## Why it matters

Today a team that wants an agent able to act, not just answer, pays one of three ways:

- **Per-resolution pricing** (Intercom Fin is reported at about $0.99 per resolution, on top of helpdesk seats). Costs grow with success, and the definition of "resolved" belongs to the vendor.
- **Enterprise contracts** (Sierra and Decagon are reported to start in the low-to-mid six figures per year, plus setup fees). Out of reach for most small and mid-sized teams.
- **Building it in-house**, which usually means rebuilding guardrails: who can refund what, how much, and who signed off.

Open source wins here because the hard part is trust, not the chat window. A support team should be able to read the exact rules that decide when the agent may issue a refund, run it in its own infrastructure next to customer data, and audit every step. A per-token cost on the team's own key is also easier to predict than a per-outcome fee.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| Support lead | "Deflect routine questions without the agent making things up or promising what we can't do." |
| Support agent | "When a conversation reaches me, I want the full history and what the bot already tried, so I don't ask the customer to repeat themselves." |
| CX / ops manager | "Let the agent issue small refunds and reschedule bookings on its own, but make anything above a limit wait for me." |
| Engineer | "Connect our order system and billing provider once, with clear scopes, and see a log of every call." |
| Customer | "Get a correct answer or a fixed problem quickly, or a human, without a maze." |

## MVP scope

1. **Knowledge sources and grounded answers.**
   Import a help center (sitemap or URL list), Markdown/PDF files, and past resolved tickets. Answers cite the source passages.
   *Acceptance:* every answer shown to a customer includes at least one citation link, or the agent says it does not know and offers a handoff. A test set of 50 questions with known answers reaches a measured accuracy that is reported in the dashboard, not assumed.
2. **Web chat widget and email channel.**
   An embeddable script tag widget and an inbound email address that threads replies.
   *Acceptance:* widget loads under 60 KB gzipped; works without third-party cookies; email replies thread correctly on Gmail and Outlook.
3. **Action tools through Leash.**
   Ship adapters for Stripe refunds, Shopify order lookup and cancel, and a generic signed-webhook tool for anything else. Each tool declares a risk level (read, low, high) and parameters.
   *Acceptance:* a high-risk tool call never executes without an approval record or a matching auto-approve policy; denial is shown to the customer in plain words; each call appears in the hash-chained audit log and the chain verifies.
4. **Policies and caps.**
   Per-tool rules such as "refunds up to $25 auto-approve, max 20 per day per workspace".
   *Acceptance:* caps are enforced at execution time, not only at proposal time; breaching a cap pauses the tool and notifies an owner.
5. **Human handoff.**
   One click (or agent decision) moves the conversation to a person, in Concierge's own inbox or in a connected helpdesk.
   *Acceptance:* the receiving person sees the transcript, the cited sources, pending or denied actions, and a three-line summary. The customer is told a person is coming and roughly when.
6. **Approvals inbox.**
   One list of pending actions with the conversation context, the exact parameters, and approve / edit / deny.
   *Acceptance:* approving from the inbox resumes the conversation within 5 seconds; edits are recorded as a separate audit event.
7. **Resolution analytics.**
   Counts of conversations, answered-with-citation, actions taken, handoffs, customer-confirmed resolutions and cost per conversation (tokens times the configured price).
   *Acceptance:* "resolved" is defined in the settings page in plain words and the team can change it; numbers can be exported as CSV.
8. **Evaluation harness.**
   Replay a saved set of conversations against a new prompt, model or knowledge base before switching.
   *Acceptance:* a run produces a side-by-side diff of answers and actions, and no tool executes during a replay.

## Not in v1

- Voice and phone channels (later, through the ShapesOS Voice module).
- WhatsApp, SMS and social DMs.
- Proactive outbound messages.
- Multi-language tuning beyond what the chosen model does out of the box.
- A visual flow builder. Policies are written as simple rules in a form, plus a YAML file for power users.
- Native integrations with every helpdesk; v1 ships one (Chatwoot, MIT core) and a generic webhook.

## Architecture

- **Stack:** Next.js (App Router) and TypeScript; Postgres 16 with pgvector for retrieval and row-level security for tenant isolation; Prisma; a small job worker for ingestion and email. Widget is a separate, framework-free bundle.
- **Data model sketch:** `Workspace`, `Source` (help center, file, ticket export), `Chunk` (text, embedding, source pointer), `Conversation`, `Message`, `ToolDefinition` (name, risk, schema, adapter), `ToolCall` (status: proposed, approved, denied, executed, failed), `Policy`, `Approval`, `Handoff`, `AuditEvent` (Leash, hash-chained), `EvalSet`, `EvalRun`.
- **Where AI runs:** a server-side agent loop per conversation turn. Retrieval first, then a model call with retrieved passages and the tool list. Model provider is pluggable (hosted APIs or a local model through an OpenAI-compatible endpoint). Embeddings can run locally.
- **Leash fit:** every tool is registered with Leash with its risk level. Leash decides: execute now, wait for approval, or refuse (cap reached). Leash also holds per-conversation and per-workspace spend caps for model usage and for money moved by tools. The audit log is Leash's, and Concierge's admin page includes a "verify chain" button.
- **Self-host story:** one `docker compose up` with app, Postgres and worker. Runs with a mock model and a sample help center for evaluation, with a clear banner saying so. Production needs one model key or a local model endpoint.

## Relationship to ShapesOS

Concierge embeds in ShapesOS as a support surface and can extract proven pieces from it (both are AGPL-3.0, so code can move between them).

- `lib/ops/helpdesk.ts`, `lib/ops/helpdesk-sla.ts` and `app/dashboard/ops/helpdesk/`: tickets, SLA timers and email threading that Concierge hands off into when running inside ShapesOS.
- `lib/messaging/` (`inbound-email.ts`, `consent.ts`, `quiet-hours.ts`): inbound email and consent patterns.
- `lib/approvals/` and `app/dashboard/approvals/`: the "needs you" inbox. Concierge approvals should appear there when embedded.
- `lib/knowledge/contextdev/` and `app/dashboard/intelligence/knowledge/`: the Knowledge corpus as a source of grounded answers.
- `lib/llm/` (`router.ts`, `failover.ts`, `workspace-keys.ts`, `pricing.ts`): bring-your-own-key routing and cost accounting.
- `lib/auditlog.ts` and `lib/orchestrator/`: the current audit and authority code that Leash generalizes.

## Clean-room sources

- Behavior is specified only from public information: vendor docs and help centers, pricing pages, public API references, marketing pages, demo videos and ordinary hands-on use of trial accounts.
- We never decompile, trace or copy proprietary code, UI assets, icons, copy or trademarks. Features and screens use original names (for example "Approvals", "Handoff", "Policies", not any vendor's terms).
- Reused open-source code is named with its license: Leash (MIT, our own); pgvector (PostgreSQL License); Chatwoot's MIT core as an integration target only, never its proprietary `/enterprise` folder; the Stripe and Shopify official SDKs under their published licenses (verify license per SDK version).

## Risks

- **Legal:** an agent that issues refunds or changes orders can create binding commitments. Mitigation: high-risk tools default to approval-required; clear disclosure to customers that they are talking to an AI; per-region data residency is the self-hoster's choice and is documented.
- **Technical:** hallucinated answers and prompt injection through customer messages or poisoned docs. Mitigation: citation-required answers, tool parameters validated against schemas, Leash refusing calls outside policy regardless of what the model asks for, and an injection test set in the eval harness.
- **Inference cost:** a long conversation with retrieval can use tens of thousands of tokens. Mitigation: per-conversation token caps, smaller models for classification and routing, caching of retrieval results, and cost per conversation shown on every analytics view.
- **Name:** "Concierge" is a common word used by other products; run a trademark check before launch.

## Milestones

- **v0.1 (internal):** ingestion of a help center, grounded answers with citations in a test widget, one read-only tool (order lookup), audit log, mock model mode.
- **v0.5 (design partners):** Stripe refund and Shopify cancel tools behind Leash approvals, policies and caps, human handoff to Concierge inbox, email channel, eval harness, basic analytics.
- **v1.0 (public):** hardened widget, Chatwoot handoff, embedding inside ShapesOS approvals, CSV export, documentation for writing custom tools, security review and threat model published.

## Market notes

All prices below are third-party estimates gathered in October 2026; vendors change pricing often and Sierra and Decagon do not publish prices.

- Intercom Fin: about $0.99 per resolution, plus helpdesk seats when used inside Intercom. Sources: [Macha, Intercom Fin pricing](https://www.getmacha.com/blog/intercom-fin-pricing), [Ringly, Intercom pricing 2026](https://www.ringly.io/blog/intercom-pricing), [Gleap, Fin pricing 2026](https://www.gleap.io/blog/intercom-fin-ai-pricing-2026).
- Sierra: outcome-based pricing, reported platform minimums around $150,000 per year plus setup fees. Source: [Quiq, Sierra AI pricing](https://quiq.com/blog/sierra-ai-pricing/).
- Decagon: reported $50,000 platform fee plus per-conversation or per-resolution charges; reported median contracts in the hundreds of thousands per year. Sources: [Macha, Decagon vs Sierra](https://www.getmacha.com/blog/decagon-vs-sierra-ai), [Macha, enterprise AI support pricing](https://www.getmacha.com/blog/enterprise-ai-customer-support-pricing).
- Several of these sources are written by competitors; treat them as directional.
- Chatwoot licensing (MIT core, proprietary `/enterprise`): [Chatwoot enterprise edition docs](https://www.chatwoot.com/docs/product/others/enterprise-edition/).
