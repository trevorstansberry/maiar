# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
├── context/            Brand/audience knowledge base — team-shared via git
├── drafts/             Work in progress (gitignored by default)
├── published/          Completed content (gitignored by default)
├── research/           Research briefs and brand research output
├── campaigns/          Campaign plans and briefs
└── templates/          Reusable templates and SOPs
```

### How Context Flows

Every command and agent reads from `context/` before producing output. Context files define brand voice, audience, products, competitors, channels, and goals. The quality of all outputs depends directly on the quality of these files.

**To populate context:** Run `/brand-research [your-website-url]` — it researches the brand online, drafts all context files, asks follow-up questions, and writes confirmed content to `context/`.

**To update context:** Edit the relevant file in `context/` directly. Commit the change so the whole team gets it on next `git pull`.

### How Skills Work

Skills live in `.claude/skills/[skill-name]/SKILL.md`. Each has a YAML frontmatter `description:` field that tells Claude when to activate it. Skills provide deep discipline expertise — frameworks, best practices, mental models, and step-by-step procedures. Commands and agents reference skills by name.

### How Agents Work

Agents live in `.claude/agents/`. They are invoked automatically by commands or manually by the user. Each agent has a single focused role (e.g., SEO optimization, headline generation, audience analysis). Commands often chain multiple agents in sequence.

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

**Output format:** When the best output type is unclear (written content vs. strategy doc vs. audit vs. template), commands ask guided clarifying questions before proceeding.

---

## Context Files

| File | What to Fill In |
|---|---|
| `context/brand-voice.md` | Tone, personality, messaging pillars, voice examples |
| `context/audience-profiles.md` | ICP, buyer personas, segments |
| `context/products-services.md` | Offerings, value props, pricing, differentiators |
| `context/competitors.md` | Competitor positioning and how we win |
| `context/channels.md` | Active channels, social handles, paid channels |
| `context/brand-guidelines.md` | Brand name usage, writing standards, compliance |
| `context/content-examples.md` | 3-5 approved content examples for style reference |
| `context/style-guide.md` | Grammar, formatting, terminology preferences |
| `context/goals-kpis.md` | Current marketing goals and success metrics |
| `context/seo-guidelines.md` | Keyword targets, content standards, on-page rules |
| `context/internal-links-map.md` | Site architecture and high-value pages for linking |

**Day 1 priorities:** `brand-voice.md`, `audience-profiles.md`, `content-examples.md`

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
**Inbound / Outbound:** inbound-marketing, outbound-marketing, referral-program, referral-word-of-mouth, free-tool-strategy, competitor-alternatives
**Social & Community:** social-media-marketing, community-marketing, influencer-marketing, conversational-marketing
**B2B / Enterprise:** b2b-marketing, abm, partner-channel-marketing, field-marketing, events-experiential
**B2C / Consumer:** b2c-marketing, retention-lifecycle, cause-marketing, guerrilla-marketing
**Analytics:** analytics-tracking
