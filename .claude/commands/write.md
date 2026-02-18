---
description: Create any marketing content — blog post, landing page, email, social post, ad copy, case study, or any other format. Reads brand context automatically.
---

# /write

Create marketing content of any type. Maiar reads your brand context and produces content that sounds like you, speaks to your audience, and aligns with your goals.

## Usage

```
/write [topic or description]
```

**Examples:**
```
/write blog post about how to reduce SaaS churn
/write landing page for our new enterprise plan
/write email announcing our product launch
/write LinkedIn post about our latest case study
/write case study for Acme Corp reducing onboarding time 60%
/write ad copy for Google Ads targeting "project management software"
```

## Context Files

**Company context (always reads):**
- `context/company/brand-voice.md`
- `context/company/style-guide.md`
- `context/company/content-examples.md` *(if present)*

**Product context (reads after resolving the active product):**
- `context/products/[product]/overview.md`
- `context/products/[product]/audience-profiles.md`
- `context/products/[product]/goals-kpis.md`
- `context/products/[product]/content-examples.md` *(if present — supplements company-level examples)*

**Product resolution:** Reads `context/products.md` to determine which product to use. If only one product is configured, it is auto-selected. If multiple products exist and the product isn't clear from your input, a dropdown will appear before any work begins.

## Agent Chain (SEO content)

For SEO-optimized content, 2 agents run automatically after writing:

1. `editor` — rewrites for human voice, engagement, headline quality, and brand consistency; returns the improved draft
2. `seo-optimizer` — keyword analysis, meta title/description options, and internal link recommendations (reads `internal-links-map.md`)

For short-form content (social posts, short ads), only `editor` runs — no SEO pipeline needed.

## What Happens

1. **Reads context:** Loads core context files + style-guide.md + content-examples.md
2. **Clarifies if needed:** If the content type or audience isn't clear, asks one focused question before proceeding
3. **Determines format:** Chooses the appropriate structure, length, and format for the content type
4. **Writes:** Produces content in brand voice for the right audience
5. **Routes:** Long-form/SEO content → editor + seo-optimizer; short-form → editor only
6. **Saves:** Suggests saving to `drafts/[filename].md`

## Content Types Supported

- Blog posts and articles
- Landing pages
- Email (single or sequence)
- Social media posts (platform-specific)
- Ad copy (search, social, display)
- Case studies
- Whitepapers and guides
- Sales enablement (one-pagers, battlecards)
- Product descriptions
- Video scripts
- Podcast show notes
- Press releases
- Newsletter content
- Webinar or event descriptions

## Quality Check

All content is evaluated against:
- Brand voice consistency
- Audience relevance
- Readability (target 8th-10th grade)
- Clarity of CTA
- Structural quality

---

Read core context files, determine what's being requested, and produce the appropriate content. For SEO content: run through editor → seo-optimizer. For short-form content: run through editor only. If the content type, format, or target audience is ambiguous, ask one focused clarifying question before writing.
