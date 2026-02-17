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

## Context Files

**Always reads (core context):**
- `context/company/brand-voice.md`
- `context/products/[product]/audience-profiles.md`
- `context/products/[product]/goals-kpis.md`

**Also reads based on analysis type:**
- Content/SEO: `context/products/[product]/seo-guidelines.md`
- Competitive: `context/products/[product]/competitors.md`

## What Happens

**Step 1 — Route the request.** If the analysis type isn't clear from the input, ask:
> "What type of analysis? (1) Content/SEO quality, (2) Audience fit, (3) Competitive positioning, (4) Campaign performance"

Each answer routes to the appropriate agent:
- Content/SEO → `content-analyzer` agent
- Audience fit → `audience-analyst` agent
- Competitive → `competitor-alternatives` skill + `brand-marketing` skill
- Campaign performance → `performance` agent (if data provided) or structured framework analysis

**Step 2 — Gather the content.** Fetch URL, read file, or ask user to paste the content.

**Step 3 — Run the analysis** using the routed agent and relevant skills.

**Step 4 — Return structured insights** with context-specific recommendations.

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
