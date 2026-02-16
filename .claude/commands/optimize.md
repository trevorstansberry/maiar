---
description: Optimize existing content for SEO, conversion, engagement, or clarity. Returns specific improvements with before/after examples.
---

# /optimize

Optimize any existing content to improve performance.

## Usage

```
/optimize [file path or paste content]
```

Or with a specific goal:
```
/optimize [file] for SEO
/optimize [file] for conversion
/optimize [file] for engagement
/optimize [file] for our enterprise audience
```

## What Happens

1. Reads the content (from file or paste)
2. Reads seo-guidelines.md, brand-voice.md, and audience-profiles.md
3. Identifies optimization opportunities based on goal
4. Applies relevant agents (seo-optimizer, cro-analyst, headline-generator, meta-creator)
5. Returns scored content with prioritized changes

## SEO Optimization

Applies `seo-optimizer` agent:
- Keyword placement and density analysis
- Heading structure review
- Readability scoring
- Internal link opportunities
- Meta title and description options
- Featured snippet optimization

**SEO Score:** 0-100
- 90-100: Publish-ready
- 80-89: Minor improvements recommended
- 70-79: Priority fixes needed
- Below 70: Significant revision required

## Conversion Optimization

Applies `cro-analyst` agent:
- CTA analysis (clarity, placement, frequency)
- Value proposition strength
- Objection handling
- Trust signal placement
- Form or friction analysis

## Engagement Optimization

Applies `editor` and `headline-generator` agents:
- Hook strength (opening paragraph)
- Readability and scanability
- Headline and subheading quality
- Content flow and structure
- Pull quotes and highlight opportunities

## Output Format

**Overall score:** [0-100] | **Priority action:** [Most impactful fix]

**Quick wins (30 minutes or less):**
1. [Specific change] — [Expected impact]

**Priority improvements:**
1. [Specific change] — [Why it matters]

**Optional enhancements:**
1. [Nice-to-have improvements]

**Updated meta options:**
- Title option 1: [50-60 chars]
- Title option 2: [50-60 chars]
- Description option 1: [150-160 chars]

---

Read the content, run it through the appropriate optimization agents based on the goal, and return a scored report with prioritized, specific improvements.
