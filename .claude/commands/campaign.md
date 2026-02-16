---
description: Build a complete marketing campaign strategy document — including goals, audience, messaging, channel mix, timeline, budget allocation, assets, and success metrics.
---

# /campaign

Build a complete, actionable marketing campaign strategy.

## Usage

```
/campaign [campaign type] [goal or context]
```

**Examples:**
```
/campaign email launch for our new enterprise tier
/campaign content SEO for the "team productivity" keyword cluster
/campaign abm targeting 50 enterprise accounts in fintech
/campaign paid acquisition for Q2 lead gen goal
/campaign retention win-back churned customers from last 90 days
/campaign influencer launch for new product
```

## What Happens

1. Reads all context files to understand brand, audience, and goals
2. Invokes the `campaign-strategist` agent
3. Produces a structured campaign plan document
4. Saves to `campaigns/[campaign-name].md`

## Campaign Plan Includes

- Campaign overview and business objective
- Target audience and segmentation
- Core messaging and CTA
- Channel mix with specific tactics per channel
- Content and asset list
- Timeline with key milestones
- Budget allocation by channel
- Success metrics and measurement plan
- Risk flags and mitigation

---

Read context files, then invoke the `campaign-strategist` agent to build the campaign plan. Save the output to `campaigns/`.
