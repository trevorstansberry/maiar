---
description: Research and analyze a competitor — their positioning, messaging, content strategy, product strengths and weaknesses, and how to win against them.
---

# /competitor

Research a competitor and produce a detailed competitive analysis.

## Usage

```
/competitor [company name or URL]
```

**Examples:**
```
/competitor Salesforce
/competitor https://www.competitor.com
/competitor HubSpot vs our positioning
```

## What Happens

1. Reads `context/competitors.md` for existing competitive intelligence
2. Fetches the competitor's website (homepage, pricing, features, about)
3. Searches G2 and Capterra for their reviews and category positioning
4. Searches for "[competitor] vs [your brand]" and "[competitor] alternatives" content
5. Applies `competitor-alternatives` skill
6. Produces a competitive analysis report
7. Suggests updates to `context/competitors.md`

## Competitive Analysis Output

### Overview
- Company description and positioning
- Target market and key segments
- Pricing model and tiers (if public)
- Key differentiators they claim

### Their Strengths
- Where they genuinely beat or match you
- Features or capabilities they lead on
- Customer segments they dominate

### Their Weaknesses
- Common complaints from reviews
- Gaps in their offering
- Segments they underserve

### How They Position Against You
- How they describe themselves relative to your category
- Common objections your prospects raise based on competitor claims
- Their key messages and proof points

### How to Win Against Them
- Your differentiators that matter to their customers
- Qualifying questions to reveal where you win
- Messages that reframe the comparison
- Proof points specific to competitive deals

### Content Gap Opportunities
- Keywords and topics they rank for where you have an opportunity
- Content angles they haven't addressed
- Review themes they're losing on that you can claim

### Suggested Context Update
- Recommended additions to `context/competitors.md`

---

Fetch competitor information, read existing competitive context, apply the competitor-alternatives skill, and produce a structured competitive analysis. Suggest updates to context/competitors.md.
