# Orbit

> Ads that build, test and rebalance themselves.

- **Lane:** Automated ads
- **Status:** Planned (tenth in the build order)
- **License:** AGPL-3.0
- **Open-source alternative to:** Smartly, Madgicx and AdCreative
- **Audience:** Performance marketers and growing brands
- **Built on:** Leash (MIT) for spend proposals, approvals, caps and audit

## Summary

Orbit generates ad creative from a brand kit, launches structured tests across ad platforms, reads the results, and proposes how to move budget toward what works. Agents do the analysis and the drafting; a person approves every launch and every change to spend. Hard caps, circuit breakers and a hash-chained audit log mean Orbit can never spend more than it was allowed to, and anyone can check afterward what happened and who approved it. Attribution includes offline channels, so a brand that also runs radio, print or direct mail sees one picture.

## Why it matters

Ad automation is sold either as a percentage of media spend or as a monthly subscription with creative credits. Smartly is quote-based and reported to charge a share of spend with practical minimums of several thousand dollars a month; Madgicx and AdCreative publish tiers from tens to hundreds of dollars per month, which have changed often in 2025 and 2026. In every case, the logic that decides where money goes is a black box.

Open source wins because budget allocation is a decision a business should be able to inspect. The models (response curves, test statistics, attribution) are well-documented public methods; the value is in applying them carefully with guardrails. An open, self-hosted tool also connects to the ad accounts with the brand's own credentials, without a middleman holding them.

## Users & jobs to be done

| User | Job to be done |
|---|---|
| Performance marketer | "Ship 20 creative variations a week and learn which ones work without building every ad by hand." |
| Founder / brand owner | "Let software suggest budget moves, but never let it spend money I didn't approve." |
| Agency | "Run the same testing discipline across many client accounts with a clear record for each." |
| Finance | "See exactly how much was spent, on what, and who signed off." |

## MVP scope

1. **Brand kit and creative variations.**
   Import logo, colors, fonts, product photos and approved copy; generate image and copy variations sized for each platform.
   *Acceptance:* every generated asset uses only brand-kit colors and fonts unless a person overrides; generated assets are labeled as AI-generated in Orbit's library; nothing is uploaded to an ad platform at this step.
2. **Test plans.**
   Define a test (hypothesis, variants, audience, budget, duration, success metric) and have Orbit compute the sample size needed.
   *Acceptance:* Orbit refuses to call a winner before the planned sample is reached and shows the confidence interval with the result.
3. **Cross-platform launcher.**
   Launch tests on Meta and Google Ads in v1 through their public APIs.
   *Acceptance:* a launch is a proposal showing every campaign, ad set and ad to be created and the maximum daily and total spend; nothing is created until approved; created objects start paused unless the approver chooses otherwise.
4. **Budget rebalancing proposals.**
   Daily, Orbit proposes moving budget between ad sets or campaigns based on results and diminishing-returns curves.
   *Acceptance:* each proposal shows current vs proposed spend, the evidence, the expected effect with uncertainty, and the cap it stays within; execution re-checks caps and approval at the moment of the change.
5. **Circuit breakers.**
   Automatic pause (never increase) on spend velocity, sudden performance drops, tracking outages or API errors.
   *Acceptance:* a breaker can only pause or freeze; resuming requires a human acknowledgment.
6. **Attribution with offline channels.**
   Platform-reported results plus first-party conversions, UTM touches, promo codes and manual entry for offline channels (radio, print, direct mail, events).
   *Acceptance:* every report states which model it uses (for example last-touch, position-based) and shows platform-claimed and Orbit-measured numbers side by side.
7. **Audit and spend ledger.**
   *Acceptance:* every proposal, approval, denial, execution and breaker event is in the hash-chained log; the ledger reconciles with platform-reported spend within a stated tolerance, and mismatches are flagged.

## Not in v1

- Fully autonomous spend (Orbit will not ship a mode where agents move money without approval).
- TikTok, LinkedIn, Amazon and programmatic platforms (after Meta and Google).
- Video ad generation (comes from Snip and ShapesOS Clips later).
- Media mix modeling; v1 uses test-based and rule-based attribution only.
- Bid strategy management inside platforms beyond budget and status.

## Architecture

- **Stack:** Next.js and TypeScript; Postgres with row-level security and Prisma; a scheduler for daily analysis and platform syncs; object storage for creative.
- **Data model sketch:** `BrandKit`, `Asset` (source, AI-generated flag), `Variation`, `TestPlan`, `PlatformAccount` (encrypted tokens), `PlatformObject` (campaign, ad set, ad mirror), `MetricSnapshot`, `Conversion`, `OfflineTouch`, `Proposal` (type: launch, rebalance, pause), `Approval`, `SpendCap`, `BreakerEvent`, `AuditEvent`.
- **Where AI runs:** creative generation (image models and LLM copy) on demand; the analysis agent runs on a schedule, reads metrics and writes proposals. The statistics (sample sizes, intervals, response curves) are plain code, not model output; the model only explains them.
- **Leash fit:** reading metrics is low risk; creating objects and changing budgets are high risk and always require approval; caps exist per run, per account, per workspace and per day. Breakers are implemented as one-way Leash policies that can only reduce risk.
- **Self-host story:** docker compose with app, Postgres, worker and MinIO; ad platform developer credentials are the operator's own. A sandbox mode uses recorded fixtures and is clearly labeled as such.

## Relationship to ShapesOS

Orbit is the standalone form of ShapesOS Media and Flywheel (both AGPL-3.0), and is the module with the most existing code.

- `lib/flywheel/reallocation/` (`optimizer.ts`, `curves.ts`, `breakers.ts`, `policy.ts`, `checkout.ts`, `audit.ts`): budget reallocation proposals, one-way circuit breakers, checkout-time re-verification and a hash-chained audit log already exist here.
- `lib/flywheel/testlab/` (`experiment.ts`, `stats.ts`, `integrity.ts`): test design and statistics.
- `lib/flywheel/recycling/` and `app/dashboard/flywheel/`: creative recycling and the Flywheel screens.
- `lib/media/` (`approvals.ts`, `killswitch.ts`, `executor.ts`, `buying-store.ts`) and `app/dashboard/media/`: media buying approvals and kill switch.
- `lib/attribution/` (`models.ts`, `touches.ts`, `spend.ts`) and `app/dashboard/attribution/`: attribution models.
- `lib/ads/` and `lib/adplatforms/`: ad briefs and platform adapters. `lib/connectors/m21/live/` holds Google Ads and Meta Ads code tested against recorded fixtures only.
- `lib/studio/creatives.ts`: creative generation shared with Collage.

## Clean-room sources

- Behavior is specified only from public information: Smartly, Madgicx and AdCreative public docs, help centers, pricing pages, marketing pages, webinars and demo videos, and ordinary hands-on use of trials.
- We never decompile, trace or copy proprietary code, UI assets, icons, templates, copy or trademarks. Feature and screen names are original.
- Platform integrations use only the public Meta Marketing API and Google Ads API, under their developer terms.
- Methods come from public literature. Reused open source: Leash (MIT); optionally Google's Meridian (Apache-2.0) and Meta's Robyn (MIT) as references or later MMM backends (verify license at adoption).

## Risks

- **Legal:** ad platforms restrict automated tools and require app review; misuse can get accounts banned. Generated creative must avoid trademarks, real people and misleading claims; platforms require disclosure of some AI-generated content. Orbit must not make claims about regulated products without human review.
- **Financial:** a bug that spends money is the worst failure. Mitigation: approvals on every spend change, caps re-checked at execution, paused-by-default launches, breakers that can only pause, and reconciliation against platform spend.
- **Technical:** platform APIs change often; reporting delays and attribution windows make daily decisions noisy. Mitigation: minimum data thresholds before proposals and conservative step sizes.
- **Inference cost:** image generation is the main cost; analysis is cheap. Mitigation: caps per batch, local image models optional.

## Milestones

- **v0.1:** brand kit, creative variations, test plans with sample-size math, read-only Meta and Google metrics sync.
- **v0.5:** launcher behind approvals (paused by default), daily rebalance proposals, breakers, audit ledger with reconciliation.
- **v1.0:** offline-channel attribution, agency multi-account view, ShapesOS embedding, published threat model for spend.

## Market notes

Prices are third-party estimates gathered in October 2026.

- Smartly: quote-based, reported as a percentage of media spend with practical minimums around $4,000 to $5,000 per month. Source: [Superscale, Smartly pricing 2026](https://superscale.ai/alternatives/smartly/pricing).
- Madgicx: published tiers changed several times in 2025 and 2026 (reported from about $44 to $99 per month for core plans). Sources: [PricingSaaS, Madgicx changes Q4 2025](https://pricingsaas.com/companies/madgicx/diffs/2025Q4), [Toolradar, Madgicx calculator](https://toolradar.com/tools/madgicx/calculator).
- AdCreative.ai: reported from about $29 to $39 per month for entry plans, about $249 per month for Professional, and higher tiers up to roughly $599 to $999 per month; credits are consumed on download. Sources: [Atria, AdCreative pricing](https://www.tryatria.com/blog/adcreative-ai-pricing), [Capterra, AdCreative.ai](https://www.capterra.com/p/253052/AdCreativeai/).
