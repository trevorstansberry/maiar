---
description: Write ad copy and strategy for any paid advertising platform — Google Ads, Meta, LinkedIn, TikTok, and more.
---

# /ads

Write ad copy and strategy for paid advertising campaigns.

## Usage

```
/ads [platform] [goal or product/audience]
```

**Examples:**
```
/ads google targeting "project management software" for SMB
/ads meta awareness campaign for new product launch
/ads linkedin lead gen targeting VP of Marketing at 100-500 person companies
/ads tiktok product demo for B2C audience
/ads google branded campaign for [company name]
/ads meta retargeting cart abandoners with discount offer
```

## Context Files

**Company context (always reads):**
- `context/company/brand-voice.md`
- `context/company/competitors.md` *(if present — company-wide competitive set)*

**Product context (reads after resolving the active product):**
- `context/products/[product]/overview.md` — offers, value props, differentiators
- `context/products/[product]/audience-profiles.md`
- `context/products/[product]/goals-kpis.md`
- `context/products/[product]/competitors.md` *(if present — product-specific competitive set)*

**Product resolution:** If multiple products are configured and the product isn't clear from your input, a dropdown will appear before any work begins.

## Agent Chain

1. Writes ad copy using `paid-ads` + `sem-ppc` (for Google) + `marketing-psychology` skills
2. `conversion-optimizer` agent reviews landing page fit and message-match recommendations

## What Happens

1. Reads core context files + products-services.md + competitors.md
2. Writes copy for all required ad formats for the platform
3. Provides targeting recommendations
4. `conversion-optimizer` agent reviews landing page requirements for message match

## Output Per Platform

**Google Search Ads:**
- 15 headlines (30 characters each)
- 4 descriptions (90 characters each)
- Keyword suggestions and match type recommendations
- Negative keyword recommendations
- Extension copy (sitelinks, callouts, snippets)
- Landing page brief

**Meta / Instagram Ads:**
- Primary text (3 variations)
- Headlines (3 variations)
- Description (optional)
- Creative brief (what image/video to use)
- Targeting recommendation
- A/B test setup suggestion

**LinkedIn Ads:**
- Ad copy variations
- Sponsored content text
- Lead gen form fields (if applicable)
- Targeting recommendation (job title, industry, company size)

**TikTok Ads:**
- Hook (first 3 seconds)
- Script outline (15-30 seconds)
- CTA options
- Creative direction

## Includes

- Ad copy in brand voice
- Platform-specific format and character limits respected
- Targeting strategy brief
- A/B test recommendation (what to test first)
- Landing page message-match notes (from `conversion-optimizer`)

---

Read core context files, then write the ad copy for the specified platform using `paid-ads`, `sem-ppc`, and `marketing-psychology` skills. Invoke `conversion-optimizer` agent for landing page message-match review.
