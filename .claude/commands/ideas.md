---
description: Run a marketing ideation session. Generate creative campaign ideas, content angles, growth tactics, or solutions to a specific marketing challenge.
---

# /ideas

Generate marketing ideas, campaign concepts, or creative solutions for a specific challenge or goal.

## Usage

```
/ideas [topic, challenge, or goal]
```

**Examples:**
```
/ideas reduce churn for our SaaS product
/ideas grow our email list from 2K to 10K
/ideas Q4 campaign concepts for enterprise segment
/ideas low-budget marketing tactics for early stage startup
/ideas content ideas for our SEO pillar on "remote work productivity"
/ideas guerrilla marketing ideas for a product launch
/ideas referral program incentive structures
/ideas ABM tactics for 50 enterprise accounts
```

## Context Files

**Always reads (core context):**
- `context/company/brand-voice.md`
- `context/products/[product]/audience-profiles.md`
- `context/products/[product]/goals-kpis.md`

**Also reads:**
- `context/products/[product]/channels.md` — to filter ideas to channels already active or feasible

## Skills Applied

`marketing-ideas`, `marketing-psychology`, plus discipline-specific skills based on the topic (e.g., `retention-lifecycle` for churn ideas, `b2b-marketing` for enterprise ideas, `growth-marketing` for acquisition ideas).

## What Happens

1. Reads core context files + channels.md
2. Applies `marketing-ideas` + `marketing-psychology` + relevant discipline skill
3. Generates ideas across three tiers (quick wins, strategic plays, creative swings)
4. **Scores every idea** using an impact × effort matrix
5. Surfaces top 3 recommendations based on current goals and audience fit

## Output Format

### Scored Idea Table (all ideas)

| Idea | Channel | Effort | Time to Impact | Confidence | Score |
|---|---|---|---|---|---|
| [Idea name] | [Channel] | Low/Med/High | Days/Weeks/Months | Low/Med/High | [1–9] |

*Score = (Impact × Confidence) ÷ Effort. Rank and sort by score.*

### Top 3 Recommendations
The 3 highest-scoring ideas best fit for current goals and audience. For each:
- **What to do:** Specific action
- **Why it will work:** The insight, psychology, or data behind it
- **How to start:** 3–5 concrete first steps
- **Success metric:** How to know it's working

### Quick Wins (execute in days, Low effort)
Ideas scoring high on speed and ease.

### Strategic Plays (require planning, High impact)
Ideas with larger upside that need investment.

### Creative Swings (unconventional)
3–5 unexpected ideas that could generate outsized results if they work.
