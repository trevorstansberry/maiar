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

## Context Files

**Company context (always reads):**
- `context/company/brand-voice.md`

**Product context (reads after resolving the active product):**
- `context/products/[product]/audience-profiles.md`
- `context/products/[product]/goals-kpis.md`
- `context/products/[product]/seo-guidelines.md` — target keywords and content standards
- `context/products/[product]/internal-links-map.md` — internal link opportunities

**Product resolution:** If multiple products are configured and the product isn't clear from your input, a dropdown will appear before any work begins.

## Agent Chain

Invokes `seo-optimizer` agent to run keyword analysis and competitive content gap assessment.

## What Happens

1. Reads core context files + seo-guidelines.md + internal-links-map.md
2. Analyzes search intent for the topic
3. Invokes `seo-optimizer` for keyword analysis and competitive content landscape
4. If DataForSEO is configured in `.env`: pulls live keyword volume + difficulty data
5. If DataForSEO is **not** configured: notes that volumes are estimates based on relative search demand
6. Applies `seo-audit` and `programmatic-seo` skills
7. Produces a complete research brief saved to `research/[topic].md`

## Research Brief Output

### Keyword Analysis
- Primary keyword + 10 semantic variants
- 20 long-tail keyword opportunities
- Search volume and difficulty estimates (live if DataForSEO configured, estimated otherwise)
- Search intent classification (informational / commercial / transactional)
- Related questions (People Also Ask)

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

Read core context files, invoke `seo-optimizer` for keyword and competitive analysis. Note DataForSEO status. Produce complete research brief with keyword list (10 primary + 20 long-tail), competitive landscape, content angle, full outline, and meta options. Save to `research/`.
