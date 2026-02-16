# Maiar — Project Progress

## What Is Maiar

An all-in-one marketing workspace for Claude Code. It covers every major marketing discipline through commands, agents, and skills backed by a shared brand/audience context layer. Built for marketing teams to clone from GitHub, pull latest, and work from the same intelligence.

---

## What We Built

### Foundation

| File | Purpose |
|---|---|
| `CLAUDE.md` | Architecture guide and command reference for Claude Code |
| `README.md` | Project overview and command reference for humans |
| `QUICK-START.md` | 3-step setup guide |
| `CONTRIBUTING.md` | Team workflow and contribution guide |
| `.gitignore` | Excludes credentials and optional work-in-progress folders |
| `.env.example` | Credentials template for all publishing integrations |

### Context System — 11 files in `context/`

Template files populated via `/brand-research` or manually:

| File | Purpose |
|---|---|
| `brand-voice.md` | Tone, messaging pillars, personality, examples |
| `audience-profiles.md` | ICP, buyer personas, segments |
| `products-services.md` | Offerings, value props, pricing, differentiators |
| `competitors.md` | Competitor positioning and how to win |
| `channels.md` | Active channels, social handles, paid channels |
| `brand-guidelines.md` | Brand name usage, writing standards, compliance |
| `content-examples.md` | 3-5 approved content samples for style reference |
| `style-guide.md` | Grammar, formatting, terminology preferences |
| `goals-kpis.md` | Current marketing goals and success metrics |
| `seo-guidelines.md` | Keyword targets, content standards, on-page rules |
| `internal-links-map.md` | Site architecture and high-value pages for linking |

### Skills — 53 total in `.claude/skills/`

**Ported from Corey Haines (25 — exact originals):**
ab-test-setup, analytics-tracking, competitor-alternatives, content-strategy, copy-editing, copywriting, email-sequence, form-cro, free-tool-strategy, launch-strategy, marketing-ideas, marketing-psychology, onboarding-cro, page-cro, paid-ads, paywall-upgrade-cro, popup-cro, pricing-strategy, product-marketing-context, programmatic-seo, referral-program, schema-markup, seo-audit, signup-flow-cro, social-content

**Ported from SEOMachine (1):**
growth-lead

**Newly authored — one per marketing discipline (27):**
abm, affiliate-marketing, b2b-marketing, b2c-marketing, brand-marketing, cause-marketing, community-marketing, content-marketing, conversational-marketing, direct-mail, email-marketing, events-experiential, field-marketing, growth-marketing, guerrilla-marketing, inbound-marketing, influencer-marketing, outbound-marketing, partner-channel-marketing, performance-marketing, podcast-marketing, product-marketing, referral-word-of-mouth, retention-lifecycle, sem-ppc, social-media-marketing, video-marketing

### Agents — 16 total in `.claude/agents/`

**Ported from SEOMachine (10):**
content-analyzer, seo-optimizer, meta-creator, internal-linker, keyword-mapper, editor, headline-generator, cro-analyst, landing-page-optimizer, performance

**Newly created (6):**

| Agent | Role |
|---|---|
| `brand-researcher` | Researches brand online, populates all context files |
| `campaign-strategist` | Builds complete multi-channel campaign plans |
| `audience-analyst` | Validates audience fit and segments messaging |
| `channel-selector` | Recommends best channels for a given goal |
| `output-formatter` | Determines right output type; asks guided questions when ambiguous |
| `publishing-adapter` | Formats and publishes content to connected platforms |

### Commands — 38 total in `.claude/commands/`

**Maiar native commands (18):**

| Command | What It Does |
|---|---|
| `/brand-research [url]` | Research brand online, populate all context files |
| `/write [topic or type]` | Create any marketing content |
| `/campaign [type] [goal]` | Full campaign strategy document |
| `/email [type]` | Email copy or full sequence |
| `/social [platform] [topic]` | Platform-specific social content |
| `/ads [platform] [goal]` | Ad copy and strategy |
| `/audit [channel or url]` | Marketing channel or content audit |
| `/strategy [type]` | Strategy document for any discipline |
| `/analyze [file or url]` | Analyze existing content or campaigns |
| `/optimize [file]` | Optimize for SEO, CRO, or engagement |
| `/publish [file] [platform]` | Publish to a configured platform |
| `/performance-review` | Data-driven content and channel review |
| `/competitor [company]` | Competitive analysis report |
| `/ideas [topic or challenge]` | Marketing ideation session |
| `/abm [account or list]` | ABM plan for target accounts |
| `/influencer [topic or campaign]` | Influencer identification and brief |
| `/repurpose [file] [format]` | Repurpose content across channels |
| `/research [topic]` | SEO and market research brief |

**SEOMachine commands preserved as reference (20, prefixed `seomachine-`):**
seomachine-research, seomachine-write, seomachine-rewrite, seomachine-analyze-existing, seomachine-optimize, seomachine-publish-draft, seomachine-research-gaps, seomachine-research-performance, seomachine-research-serp, seomachine-research-topics, seomachine-research-trending, seomachine-performance-review, seomachine-priorities, seomachine-article, seomachine-scrub, seomachine-landing-research, seomachine-landing-write, seomachine-landing-audit, seomachine-landing-competitor, seomachine-landing-publish

### Publishing Integrations — 6 files in `.claude/integrations/`

Scaffolded and ready to activate — add credentials to `.env` to enable each:

| Platform | Status |
|---|---|
| WordPress | Scaffold ready — needs WP credentials in `.env` |
| HubSpot | Scaffold ready — needs HUBSPOT_ACCESS_TOKEN |
| Webflow | Scaffold ready — needs WEBFLOW_API_TOKEN + IDs |
| Ghost | Scaffold ready — needs GHOST_URL + Admin API key |
| Generic Markdown | Always available — no credentials needed |
| `_template.md` | Template for adding any new platform |

---

## Current State

| Area | Status | Notes |
|---|---|---|
| Directory structure | ✅ Complete | All folders created |
| Context files | ✅ Templates ready | Content not yet filled in — run `/brand-research` |
| Skills (53) | ✅ Complete | Full content in all SKILL.md files |
| Agents (16) | ✅ Complete | All agents authored |
| Commands (38) | ✅ Complete | 18 Maiar + 20 SEOMachine reference |
| Integrations | ✅ Scaffolded | Architecture ready; credentials needed to activate |
| Git repo | ⬜ Not initialized | No `.git` directory yet |
| `.env` | ⬜ Not created | `.env.example` exists as template |
| Context populated | ⬜ Empty | Run `/brand-research [url]` to fill |
| Published to GitHub | ⬜ Not yet | No remote repository set up |

---

## Next Steps

### Immediate — to make Maiar usable

**1. Initialize git and publish to GitHub**
```bash
cd /Users/trevorstansberry/Documents/Maiar
git init
git add .
git commit -m "Initial Maiar commit"
# Then create a repo on GitHub and push
```

**2. Test `/brand-research` end-to-end**
Open Maiar in Claude Code and run `/brand-research https://any-company.com` to validate the brand researcher agent works, context files populate, and follow-up questions are asked correctly.

**3. Create `.env`** from `.env.example` and add credentials for any publishing integrations the team uses.

**4. Publish to GitHub** so the team can clone it and contribute.

---

### Near-term improvements

**5. Activate publishing integrations** — add WordPress, HubSpot, or Webflow credentials and test `/publish` end-to-end.

**6. Add `data_sources/` directory** — port SEOMachine's GA4, Google Search Console, and DataForSEO integrations for analytics-driven performance reviews.

**7. Create `performance-analytics` skill** — referenced in CLAUDE.md and commands but not yet a skill file. Should cover GA4 interpretation, GSC analysis, and DataForSEO data.

**8. Test all 18 Maiar commands** against a real brand context and refine prompt quality based on outputs.

**9. Review seomachine- prefixed commands** — some reference SEOMachine-specific file paths (e.g., `drafts/`, `published/`) that may need alignment with Maiar's structure.

---

### Nice to have

**10. Contentful integration** — referenced in `.env.example` but no scaffold file yet in `.claude/integrations/`.

**11. `context/content-calendar.md`** — a shared editorial calendar template for team planning.

**12. Marketing analytics skill** — dedicated skill for interpreting cross-channel performance data.

**13. Open to community contributions** — once stable, the CONTRIBUTING.md is ready for external skill contributions.

---

## How to Use (Today)

```bash
# Open Maiar/ in Claude Code, then run any command:

/brand-research https://your-company.com   # Populate context — do this first
/write blog post about [topic]             # Create content in brand voice
/campaign email launch for [product]       # Build a full campaign plan
/ideas reduce churn                        # Marketing ideation session
/competitor [company name]                 # Competitive analysis
/strategy content marketing 2025           # Strategy document
/social linkedin [topic]                   # LinkedIn post
/email welcome sequence for new signups    # Welcome email series
```

The better the context files, the better every output. Run `/brand-research` first, then refine `context/` files before generating production content.
