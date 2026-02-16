---
description: Generate a research brief for a topic — includes SEO analysis, search intent, competitive content landscape, content angles, and a recommended content outline.
---

# /research

Generate a comprehensive research brief for a topic before writing content.

## Usage

```
/research [topic or keyword]
```

**Examples:**
```
/research reduce SaaS churn
/research best project management software
/research how to run a product launch
/research account-based marketing for enterprise
```

## What Happens

1. Reads `context/seo-guidelines.md` and `context/audience-profiles.md`
2. Analyzes search intent for the topic
3. Researches competitive content landscape
4. If DataForSEO is configured in `.env`: pulls keyword data
5. Applies `seo-audit` and `programmatic-seo` skills
6. Produces a complete research brief
7. Saves to `research/[topic].md`

## Research Brief Output

### Keyword Analysis
- Primary keyword and variants
- Search volume and difficulty estimates
- Search intent classification (informational/commercial/transactional)
- Related questions (People Also Ask)
- Semantic variations to include

### Competitive Content Landscape
- Who's ranking and what they're covering
- Content format that dominates (list, guide, comparison, etc.)
- Word count range of top-ranking content
- Content gaps and angles not yet covered

### Recommended Content Angle
- The unique angle that differentiates this content
- Why this angle will rank and resonate with the audience
- Hook options

### Content Outline
- Recommended H1
- H2 and H3 structure
- Key points to cover in each section
- Data, stats, or examples to include
- Internal links to suggest (from `context/internal-links-map.md`)
- CTA recommendation

### Meta Options
- 2-3 title tag options (50-60 characters each)
- 2-3 meta description options (150-160 characters each)

---

Research the topic using SEO skills and available data integrations. Analyze search intent, competitive landscape, and content opportunities. Produce a complete research brief saved to research/.
