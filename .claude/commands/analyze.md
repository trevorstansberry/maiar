---
description: Analyze existing marketing content, campaigns, or competitor materials. Returns insights, performance assessment, and actionable recommendations.
---

# /analyze

Analyze any marketing asset — your own content, competitor content, or campaign results — for insights and recommendations.

## Usage

```
/analyze [what to analyze]
```

**Examples:**
```
/analyze this blog post [paste content or file path]
/analyze our top 5 performing emails vs. our worst 5
/analyze competitor homepage at [URL]
/analyze our Q3 campaign results [paste metrics]
/analyze the SERP for "project management software"
/analyze customer reviews on G2 for [competitor]
/analyze our current positioning vs. [competitor]
```

## What Happens

1. Reads relevant context files
2. Fetches content from URL if provided
3. Reads file if file path provided
4. Applies appropriate analysis skills
5. Returns insights with context-specific recommendations

## Analysis Types

**Content analysis:**
- Quality and clarity of messaging
- Brand voice alignment
- Audience fit
- CTA effectiveness
- SEO elements
- Structural quality

**Competitive analysis:**
- Positioning and messaging comparison
- Strengths and weaknesses vs. your brand
- Opportunities to differentiate
- Content gap analysis

**Campaign results analysis:**
- Performance against benchmarks
- What worked and what didn't
- Causal analysis (why did metrics perform as they did)
- Optimization recommendations

**SERP analysis:**
- Who's ranking and why
- Content format that dominates
- Keyword intent and opportunity
- Content angle recommendations

## Output Format

- **Key findings:** 3-5 most important insights
- **What's working:** Specific strengths
- **Opportunities:** Specific improvements
- **Recommendations:** Prioritized, specific actions
- **Competitive implications** (if competitor content): How this affects your positioning

---

Read the content or fetch the URL, analyze it against the relevant context and skills, and return structured insights with specific recommendations.
