# Maiar — All-in-One Marketing Workspace

Maiar is a Claude Code workspace that makes your AI an expert in every field of marketing. It combines deep marketing expertise across 50+ disciplines with your brand's specific context — so every output sounds like you, speaks to your audience, and aligns with your goals.

Built for marketing teams that want a shared, version-controlled AI toolkit.

---

## What It Does

- **Covers every marketing channel:** SEO, content, email, social, paid, ABM, influencer, affiliate, video, podcast, events, brand, growth, and more
- **Knows your brand:** All outputs draw from your context files (brand voice, audience, products, competitors, goals)
- **Works as a team:** Shared via GitHub — everyone pulls the same skills and brand context
- **Thinks in frameworks:** 50+ skills with embedded best practices, mental models, and step-by-step playbooks
- **Produces the right output:** Written copy, strategy docs, audits, or templates — guided by what the situation calls for

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/your-team/maiar.git
cd maiar
cp .env.example .env
```

### 2. Research your brand

Open Maiar in Claude Code, then run:

```
/brand-research https://your-company-website.com
```

This will research your brand online, draft all context files, ask you follow-up questions to fill in any gaps, and write the confirmed content to `context/`.

### 3. Start marketing

```
/write blog post about [topic]
/campaign email launch for [product]
/social linkedin [campaign topic]
/ideas reduce churn for [product]
/strategy abm for enterprise accounts
```

---

## Context Files

Context files live in `context/` and are committed to git so the whole team shares them. They define everything about your brand: voice, audience, products, competitors, channels, and goals.

Run `/brand-research` to auto-populate them, or edit them manually. The better your context, the better every output.

---

## Command Reference

| Command | What It Does |
|---|---|
| `/brand-research [url]` | Research your brand and populate all context files |
| `/research [topic]` | SEO and market research brief |
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
| `/competitor [company]` | Competitive analysis |
| `/ideas [topic or challenge]` | Marketing ideation session |
| `/abm [account or list]` | ABM plan for target accounts |
| `/influencer [topic or campaign]` | Influencer identification and brief |
| `/repurpose [file] [format]` | Repurpose content across channels |

---

## Publishing Integrations

Platform integrations are scaffolded and ready to activate. To connect a platform:

1. Add your credentials to `.env` (see `.env.example`)
2. Run `/publish [file] [platform]`

**Supported (in progress):** WordPress, HubSpot, Webflow, Ghost, Contentful, generic Markdown

---

## For the Team

- **Always `git pull` before a session** to get the latest context files
- `drafts/` and `published/` are gitignored — remove from `.gitignore` to share work via git
- To add a skill: follow the format in any existing skill in `.claude/skills/`, submit a PR
- Never commit `.env`
