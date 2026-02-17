---
description: Research and build a detailed persona card for a specific buyer role or customer segment. Combines web research with existing audience context to produce a persona that includes goals, pain points, objections, language, buying journey, and channel preferences. Appends to context/products/[product]/audience-profiles.md.
---

# /persona

**Usage:** `/persona [role or segment description]`

**Examples:**
- `/persona VP of Marketing at a B2B SaaS company`
- `/persona SMB founder using marketing automation for the first time`
- `/persona procurement manager evaluating enterprise software`
- `/persona freelance content creator`

## Context Files

**Always reads (core context):**
- `context/company/brand-voice.md`
- `context/products/[product]/audience-profiles.md`
- `context/products/[product]/goals-kpis.md`

**Also reads:**
- `context/products/[product]/overview.md` — to understand what the persona would be evaluating

## Process

1. Reviews existing `context/products/[product]/audience-profiles.md` to avoid duplicating existing personas
2. Uses WebFetch and WebSearch to research the specified role:
   - LinkedIn profiles and job descriptions for this role
   - G2/Capterra reviews written by people in this role
   - Reddit, Slack communities, and forums where this persona engages
   - Industry publications and communities this persona reads
3. Synthesizes findings into a structured persona card
4. Asks the user to validate before appending to `context/products/[product]/audience-profiles.md`

## What It Produces

A detailed persona card including:
- **Name and role:** (fictional representative name + job title)
- **Goals:** Professional and personal priorities
- **Challenges / pain points:** Top 3–5 problems they face
- **Objections:** Specific objections to your type of product
- **Information sources:** Where they learn, who they trust, what they read
- **Language they use:** Verbatim phrases from reviews, forums, and interviews describing their problems
- **Buying journey:** How they discover, evaluate, shortlist, and decide
- **What makes them say yes:** Top purchase triggers
- **What makes them say no:** Top objections and deal-breakers
- **Channel preferences:** Where they prefer to engage (LinkedIn, email, events, etc.)
- **Day-in-the-life:** 3–5 sentences describing a typical work day and where your product fits

## Output

- Saves persona card to `research/persona-[role].md`
- Appends a summary to `context/products/[product]/audience-profiles.md` for the resolved product (confirms with user first)

## Skills Applied

`inbound-marketing`, `b2b-marketing` or `b2c-marketing` (based on persona type), `marketing-psychology`

## Notes

The best personas are grounded in real customer language — not assumptions. The research step searches for real words used by real people in this role when describing their problems. After generating, compare against your own customer interviews or support tickets and refine where the research diverges from reality.
