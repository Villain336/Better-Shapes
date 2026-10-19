# Forge

> An AI-native editor you can own.

- **Lane:** AI code editor
- **Status:** Planned (sixth in the build order)
- **License:** MIT
- **Open-source alternative to:** Cursor
- **Audience:** Developers
- **Built on:** the MIT "Code - OSS" core of VS Code, plus Leash (MIT) for agent tools and approvals

## Summary

Forge is a desktop code editor built on Code - OSS, the MIT-licensed open-source core of Visual Studio Code. It adds agents that plan a change, edit across the repository, run the tests and fix what fails, with every edit shown as a diff the developer accepts or rejects. Any model works: hosted providers with your own key, or local models through an OpenAI-compatible endpoint. Terminal commands, network access and file writes outside the workspace are Leash tools with risk levels, so the agent asks before doing anything it should not do on its own.

## Why it matters

AI-first editors have become a standard developer expense. Cursor's 2026 plans are reported at $20 to $200 per month for individuals and $40 per user per month for teams, with usage pools that run out when frontier models are used heavily. The editor itself is mostly the open VS Code core; the value is the agent loop, the context retrieval and the model routing.

Open source wins because developers can then choose their own model and pay the provider directly (or nothing, with a local model), keep their code from leaving the machine when needed, and read exactly what the agent is allowed to do. An MIT license also lets companies embed and modify Forge without legal review friction.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| Individual developer | "Describe a change, review the diff, run tests, done, with the model I prefer." |
| Developer at a strict company | "Use AI help on code that is not allowed to leave our network." |
| Team lead | "Set which models and commands agents may use across the team." |
| Open-source maintainer | "Use and modify the editor without a subscription." |

## MVP scope

1. **Editor base.**
   A build of Code - OSS with Forge branding, the Open VSX extension registry, and settings import from an existing VS Code profile.
   *Acceptance:*
   - Builds reproducibly for macOS, Windows and Linux from a public CI pipeline.
   - No Microsoft trademarks, marketplace endpoints or proprietary components are included.
2. **Inline completion and chat.**
   Multi-line completion and a chat panel with workspace context (open files, selection, symbols).
   *Acceptance:*
   - Completion latency under 400 ms p50 with a local small model on reference hardware.
   - The chat shows which files were sent to the model.
3. **Repo-wide agent edits.**
   An agent that writes a short plan, edits multiple files, and presents a combined diff.
   *Acceptance:*
   - No file changes on disk until the developer accepts.
   - Partial accept per file and per hunk.
   - Undo restores the exact prior state.
4. **Run tests and fix.**
   The agent detects the test command, runs it in the integrated terminal and iterates on failures within a step limit.
   *Acceptance:*
   - Each command is shown before it runs.
   - Commands outside an allow-list require approval.
   - The loop stops at the configured step or token cap and says why.
5. **Model routing.**
   Providers configured by the user: Anthropic, OpenAI, Google, OpenRouter-style gateways, and local endpoints (Ollama, llama.cpp server, vLLM).
   *Acceptance:*
   - A fully local setup works with network disabled.
   - Per-request token usage and estimated cost are visible.
6. **Codebase index.**
   Local embedding index and symbol graph used for context retrieval.
   *Acceptance:*
   - Indexing a 500,000-line repo finishes in under 10 minutes on a laptop.
   - The index stays on disk locally.
   - `.gitignore` and a `.forgeignore` are respected.
7. **Agent rules and audit.**
   A project file (for example `.forge/rules.md`) for conventions, and a local, hash-chained log of agent actions.
   *Acceptance:*
   - The log can be exported and verified.
   - Secrets detected in prompts are masked before sending.

## Not in v1

- Cloud background agents that run without the editor open.
- Hosted team billing and a model proxy (v1 is bring-your-own-key).
- A custom completion model trained by the studio.
- Fork of the Microsoft-licensed language servers or extensions that are not open source (for example, some Microsoft remote and C# tooling is proprietary; Forge relies on open alternatives).
- Mobile or web versions.

## Architecture

- **Stack:** Electron and TypeScript via Code - OSS; Forge features implemented as built-in extensions where possible, to keep the fork small and easy to rebase on upstream monthly.
- **Data model sketch (local):** `Session` (task, plan, status), `Step` (tool call, input, output, tokens), `Diff` (files, hunks, accepted state), `IndexChunk`, `Symbol`, `ProviderConfig`, `Rule`, `AuditEvent`. Stored in SQLite under the user's profile.
- **Where AI runs:** model calls go directly from the editor to the configured provider, or to a local server. No Forge-operated backend is required.
- **Leash fit:** tools include read file, write file (via diff), run command, fetch URL and search. Leash assigns risk: reads are allowed, writes go through the diff review, unknown commands and network fetches need approval. Spend caps limit tokens per session and per day.
- **Self-host story:** nothing to host; it is a desktop app. Teams can ship a managed settings file that pins allowed providers, models and commands.

## Relationship to ShapesOS

Forge is the one MIT product in this list and ShapesOS is AGPL-3.0, so code does not flow from ShapesOS into Forge unless the studio holds copyright on every contribution involved and chooses to relicense. The default is to treat ShapesOS as a reference and re-implement.

- `lib/sandbox/` (`tools.ts`, `exec-fs.ts`, `egress-gateway.ts`, `edit.ts`): ShapesOS's agent sandbox and file-edit tools are the design reference for Forge's tool set and command gating.
- `lib/ship/` (`diff.ts`, `review.ts`, `pull-requests.ts`): diff review and PR flow ideas.
- `lib/sites/` (`apply.ts`, `revisions.ts`) and the ShapesOS site IDE: snapshot and revert patterns.
- `app/mcp/` and `lib/mcp/`: Forge should be able to connect to the ShapesOS MCP server as a client, so developers can drive ShapesOS from the editor.

## Clean-room sources

- Behavior is specified only from public information: Cursor's public docs, changelog, pricing page, forum posts, marketing pages, demo videos and ordinary hands-on use.
- We never decompile, trace or copy proprietary code, UI assets, icons, copy or trademarks. Feature names are original.
- Reused open source with licenses: Code - OSS (MIT, github.com/microsoft/vscode); the Visual Studio Code product build, marketplace and branding are not open source and are not used. Open VSX (Eclipse Foundation) as the extension registry, under its publisher terms. VSCodium (MIT) as a reference for build scripts. Continue (Apache-2.0) and Cline (Apache-2.0) as public references; Apache-2.0 code can be included in an MIT project with its notices kept (verify license per file). Leash (MIT).
- No AGPL or GPL code goes into Forge.

## Risks

- **Legal:** the VS Code Marketplace terms limit use to Microsoft products, so Forge must use Open VSX; some popular extensions are only on the Microsoft marketplace. Trademarks "Visual Studio Code" and "VS Code" cannot be used in branding. "Forge" is used by other developer products (for example Atlassian Forge and Laravel Forge); trademark check before launch.
- **Technical:** keeping a fork current with upstream monthly releases is ongoing work. Mitigation: implement features as extensions and keep core patches minimal.
- **Inference cost:** borne by the user; agent loops can be expensive with frontier models. Mitigation: visible per-session cost, caps, and good defaults for smaller models on simple steps.
- **Security:** agents running commands can damage a machine or leak secrets. Mitigation: command allow-lists, approval on unknown commands, secret masking, optional container sandbox.

## Milestones

- **v0.1:** reproducible Code - OSS build with Open VSX, chat panel, bring-your-own-key, local model support.
- **v0.5:** inline completion, codebase index, multi-file agent edits with diff review, Leash command gating.
- **v1.0:** test-and-fix loop, rules file, audit export, managed team settings, signed releases for three platforms.

## Market notes

Prices are third-party estimates gathered in October 2026.

- Cursor: reported Hobby (free), Pro ($20/month), Pro+ ($60/month), Ultra ($200/month), Teams ($40/user/month) and Enterprise (custom), with included usage pools. Sources: [Jetadmin, Cursor pricing 2026](https://www.jetadmin.io/blog/cursor-pricing-explained-plans-credit-system-and-real-costs-in-2026/), [DEV Community, Cursor pricing 2026](https://dev.to/rahulxsingh/cursor-pricing-in-2026-hobby-pro-pro-ultra-teams-and-enterprise-plans-explained-4b89).
- Code - OSS license and the distinction from the Visual Studio Code product: the MIT LICENSE in [microsoft/vscode](https://github.com/microsoft/vscode).
- Open VSX registry: [open-vsx.org](https://open-vsx.org/).
