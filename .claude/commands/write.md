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

## What Happens

1. **Reads context:** Loads brand-voice.md, audience-profiles.md, style-guide.md, and relevant content-examples.md
2. **Clarifies if needed:** If the content type or audience isn't clear from the request, asks before proceeding
3. **Determines format:** Chooses the appropriate structure, length, and format for the content type
4. **Writes:** Produces content in brand voice for the right audience
5. **Reviews and scores:** Checks against brand voice, audience fit, SEO (if applicable), and readability
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

## SEO Content

For SEO-optimized content, the following agents run automatically after writing:
- `seo-optimizer` — keyword analysis and optimization recommendations
- `meta-creator` — title tag and meta description options
- `internal-linker` — suggests internal links from `context/internal-links-map.md`

## Quality Check

All content is evaluated against:
- Brand voice consistency
- Audience relevance
- Readability (target 8th-10th grade)
- Clarity of CTA
- Structural quality

---

Read the relevant context files, determine what's being requested, and produce the appropriate content. If the content type, format, or target audience is ambiguous, ask one focused clarifying question before writing.
