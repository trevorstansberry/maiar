# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**At the start of every session: read `progress.md`** to understand the current state of the project, what was done last session, and what's next. Do this before responding to the first message.

---

## What Is Maiar

Maiar is an all-in-one marketing workspace for Claude Code. It covers every major marketing discipline — content, SEO, email, social, paid, ABM, brand, growth, and more — through a system of commands, agents, and skills backed by a shared brand/audience context layer. Marketing teams clone this repo from GitHub so everyone works from the same skills and context.

---

## Architecture

```
maiar/
├── .claude/
│   ├── commands/       Slash commands — user-facing workflow triggers
│   ├── agents/         Sub-agents invoked by commands for specialized tasks
│   ├── skills/         Reusable discipline expertise (one folder per skill)
│   └── integrations/   Publishing platform adapters (scaffold + template)
├── context/
│   ├── products.md     Product registry — lists all products and sets the default
│   ├── company/        Shared brand context (voice, guidelines, style) — constant across all products
│   └── products/       Per-product context — one folder per product, offering, or line of business
│       ├── _template/  Copy this to create a new product context folder
│       └── [slug]/     Audience, goals, channels, competitors, positioning for one product
├── drafts/             Work in progress (gitignored by default)
├── published/          Completed content (gitignored by default)
├── research/           Research briefs and brand research output
├── campaigns/          Campaign plans and briefs
└── templates/          Reusable templates and SOPs
```

### How Context Flows

Every command reads `context/company/` first (shared brand identity), then resolves the active product from `context/products.md` and reads the matching `context/products/[slug]/` folder. Company context + product context are merged before any output is generated.

**Single product:** The product is auto-selected — no friction, no extra questions.

**Multiple products:** If the product isn't clear from your input, you'll see a dropdown to select which product the command is for. If your input names the product (e.g., `/write blog post for health-plans`), the dropdown is skipped.

**To set up:** Run `/brand-research [your-website-url]` — it researches the brand online, asks a few setup questions about your product structure, and writes all context files to the right paths automatically.

**To add a second product:** Run `/brand-research [new-product-url]` again — it detects your existing setup and adds a new product folder without touching `context/company/`.

**To update context:** Edit the relevant file directly. Commit the change so the whole team gets it on next `git pull`.

### How Skills Work

Skills live in `.claude/skills/[skill-name]/SKILL.md`. Each has a YAML frontmatter `description:` field that tells Claude when to activate it — this IS the trigger system. Skills provide deep discipline expertise: named frameworks, expert methodologies, best practices, and step-by-step procedures. Skills are knowledge libraries injected into context, not sub-processes.

### How Agents Work

Agents live in `.claude/agents/`. They are sub-processes invoked by commands for specialized analysis or production. Each agent has a single focused role (e.g., SEO optimization, audience analysis, lifecycle planning). Commands route to agents; agents leverage skills. The distinction: **commands orchestrate → agents execute → skills inform**.

### Core Context Always Loaded

Every command reads `context/company/brand-voice.md` plus the active product's `overview.md`, `audience-profiles.md`, and `goals-kpis.md`. These are the foundational references for every marketing decision: who you're speaking to, how you speak, and what success looks like. Discipline-specific files (seo-guidelines.md, competitors.md, positioning.md) load on top based on task.

---

## Command Reference

| Command | Usage | Description |
|---|---|---|
| `/brand-research` | `/brand-research [url]` | Auto-populate all context files via web research |
| `/research` | `/research [topic]` | Generate a research brief (SEO + market) |
| `/write` | `/write [topic or type]` | Create any marketing content |
| `/campaign` | `/campaign [type] [goal]` | Build a full campaign strategy document |
| `/email` | `/email [type]` | Write an email or full sequence |
| `/social` | `/social [platform] [topic]` | Create platform-specific social content |
| `/ads` | `/ads [platform] [goal]` | Write ad copy and strategy |
| `/audit` | `/audit [channel or url]` | Audit a marketing channel or piece of content |
| `/strategy` | `/strategy [marketing-type]` | Generate a strategy document for any discipline |
| `/analyze` | `/analyze [file or url]` | Analyze existing content or campaigns |
| `/optimize` | `/optimize [file]` | Optimize content for SEO, CRO, or engagement |
| `/publish` | `/publish [file] [platform]` | Publish to a configured integration |
| `/performance-review` | `/performance-review` | Data-driven review of content/channel performance |
| `/competitor` | `/competitor [company]` | Competitive analysis report |
| `/ideas` | `/ideas [topic or challenge]` | Marketing ideation session |
| `/abm` | `/abm [account or list]` | Build an ABM plan for target accounts |
| `/influencer` | `/influencer [topic or campaign]` | Influencer identification and campaign brief |
| `/repurpose` | `/repurpose [file] [format]` | Repurpose content across channels |
| `/lifecycle` | `/lifecycle [stage]` | Design customer lifecycle sequences (onboarding, win-back, retention, expansion) |
| `/brand-positioning` | `/brand-positioning` | Generate positioning statement, message hierarchy, and brand narrative |
| `/persona` | `/persona [role or segment]` | Research and write a detailed buyer persona card |

**Output format:** When the best output type is unclear (written content vs. strategy doc vs. audit vs. template), commands ask guided clarifying questions before proceeding.

---

## Context Files

### Company Context (shared across all products — `context/company/`)

| File | What to Fill In |
|---|---|
| `brand-voice.md` | Tone, personality traits, messaging pillars, voice examples |
| `brand-guidelines.md` | Brand name usage, writing standards, compliance rules |
| `style-guide.md` | Grammar, formatting, terminology preferences |
| `content-examples.md` | 3-5 approved content examples representing house style *(optional if product-level examples are sufficient)* |
| `competitors.md` | Shared competitive set — only if all products compete with the same companies *(optional)* |
| `positioning.md` | Company-wide positioning statement and brand narrative — only if one unified positioning applies *(optional)* |

### Product Context (per product — `context/products/[slug]/`)

One folder per product, offering, or line of business. Copy `context/products/_template/` to create a new one.

| File | What to Fill In |
|---|---|
| `overview.md` | What this product does, who it's for, pricing, differentiators, proof points |
| `audience-profiles.md` | ICP, buyer personas, and segments for this product |
| `goals-kpis.md` | Marketing goals and success metrics for this product |
| `channels.md` | Active channels and social handles for this product |
| `competitors.md` | Competitive set for this product — only if different from company-wide *(optional)* |
| `positioning.md` | Positioning statement and message hierarchy for this product *(optional)* |
| `seo-guidelines.md` | Keyword targets, content standards, on-page rules for this product |
| `internal-links-map.md` | Site architecture and high-value pages for this product |
| `content-examples.md` | Product-specific content examples — add when this audience needs different formats or vocabulary *(optional)* |

**Context resolution for optional files:** Commands check product level first, then fall back to company level. If both exist, they are read as complementary — company level provides the baseline, product level supplements or overrides.

**Day 1 priorities:** `company/brand-voice.md`, `products/[slug]/overview.md`, `products/[slug]/audience-profiles.md`

---

## Publishing Integrations

Integrations are scaffolded but not yet built. To add a platform:

1. Copy `.claude/integrations/_template.md` to `.claude/integrations/[platform].md`
2. Fill in the API method, endpoint, and field mapping
3. Add credentials to `.env` (see `.env.example`)
4. The `/publish` command will detect and offer the new integration automatically

**Planned platforms:** WordPress, HubSpot, Webflow, Ghost, Contentful, generic Markdown export.

---

## Team Git Workflow

- `context/` files are **committed and shared** — always `git pull` before a session to get the latest brand context
- `drafts/` and `published/` are gitignored by default — remove from `.gitignore` if your team wants to share work via git
- To add a new skill, follow the format in any existing skill, submit a PR with your SKILL.md
- `.env` is never committed — each team member maintains their own copy from `.env.example`

---

## Skills Reference

Skills are organized by marketing discipline. All live in `.claude/skills/`.

**Conversion Optimization:** page-cro, form-cro, signup-flow-cro, onboarding-cro, paywall-upgrade-cro, popup-cro, ab-test-setup
**Content & Copy:** copywriting, copy-editing, content-strategy, content-marketing, social-content, video-marketing, podcast-marketing
**SEO & Discovery:** seo-audit, programmatic-seo, schema-markup, sem-ppc
**Email:** email-sequence, email-marketing
**Paid & Distribution:** paid-ads, affiliate-marketing, direct-mail
**Strategy & Growth:** marketing-ideas, marketing-psychology, launch-strategy, pricing-strategy, product-marketing-context, product-marketing, growth-marketing, performance-marketing, brand-marketing, growth-lead, performance-analytics
**Inbound / Outbound:** inbound-marketing, outbound-marketing, referral-program, free-tool-strategy, competitor-alternatives
**Social & Community:** social-media-marketing, community-marketing, influencer-marketing, conversational-marketing
**B2B / Enterprise:** b2b-marketing, abm, partner-channel-marketing, field-marketing, events-experiential
**B2C / Consumer:** b2c-marketing, retention-lifecycle, cause-marketing, guerrilla-marketing
**Analytics:** analytics-tracking
