# Quick Start — Maiar

Get up and running in 3 steps.

---

## Step 1: Clone & Configure

```bash
git clone https://github.com/your-team/maiar.git
cd maiar
cp .env.example .env
```

Open `maiar/` in Claude Code (VS Code extension or `claude` CLI).

---

## Step 2: Research Your Brand

Run this command with your company's website URL:

```
/brand-research https://your-company.com
```

Maiar will:
1. Scrape your website, G2/Capterra reviews, social profiles, and press mentions
2. Draft all 11 context files with what it finds
3. Ask you follow-up questions to fill in any gaps
4. Write confirmed content to `context/` — commit the results so your team has them

> **Already have context files?** Skip this step and edit `context/` directly.

---

## Step 3: Start Marketing

Try a few commands:

```
# Write a blog post
/write [topic]

# Build an email campaign
/campaign email [goal or product]

# Create social content
/social linkedin [topic]

# Get marketing ideas
/ideas [challenge or goal]

# Competitive analysis
/competitor [competitor name or website]
```

---

## Day 1 Priorities

If you're setting up manually instead of using `/brand-research`, fill these three context files first — they have the biggest impact on output quality:

1. `context/brand-voice.md` — tone, personality, messaging pillars
2. `context/audience-profiles.md` — ICP and buyer personas
3. `context/content-examples.md` — 3-5 approved content samples

---

## Team Setup

1. One person runs `/brand-research` and commits the `context/` results
2. Everyone else `git pull` — they immediately have the full brand context
3. Add `.env` credentials individually (never committed)
4. Pull regularly to get updated context and new skills
