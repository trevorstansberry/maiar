---
description: Create platform-specific social media content. Adapts format, length, and style for LinkedIn, Twitter/X, Instagram, TikTok, Facebook, or Threads.
---

# /social

Create social media content optimized for the platform.

## Usage

```
/social [platform] [topic or brief]
```

**Examples:**
```
/social linkedin our new case study with Acme Corp
/social twitter thought leadership on AI in marketing
/social instagram product feature highlight
/social tiktok behind the scenes of our team
/social linkedin series on common [industry] mistakes (5 posts)
/social all-platforms our Q4 product launch
```

## Context Files

**Company context (always reads):**
- `context/company/brand-voice.md`
- `context/company/content-examples.md` *(if present)*

**Product context (reads after resolving the active product):**
- `context/products/[product]/audience-profiles.md`
- `context/products/[product]/goals-kpis.md`
- `context/products/[product]/channels.md` — active handles and platform presence
- `context/products/[product]/content-examples.md` *(if present — supplements company-level)*

**Product resolution:** If multiple products are configured and the product isn't clear from your input, a dropdown will appear before any work begins.

## Agent Chain

1. Writes platform-formatted copy using `social-content` + `social-media-marketing` skills
2. `editor` agent reviews for brand voice consistency and platform fit

## What Happens

1. Reads core context files + channels.md + content-examples.md
2. Adapts format to the target platform (length, structure, hashtags, CTA style)
3. If "all-platforms": creates platform-specific versions for each active channel
4. `editor` agent reviews for brand voice and clarity

## Platform-Specific Formatting

**LinkedIn:** Up to 3,000 characters; line breaks for readability; minimal hashtags (3-5); text-first
**Twitter / X:** Under 280 characters (or thread); punchy; hashtags 1-2 or none
**Instagram:** 125-150 words; hashtag-heavy (10-15); visual description included; CTA to bio link
**TikTok:** Caption under 150 characters; hook-forward; trending audio suggestion
**Facebook:** 80-100 words sweet spot; CTA included; group-friendly framing if applicable
**Threads:** Conversational; can be standalone or thread; under 500 characters per post

## Output Includes

- Post copy (platform-formatted)
- Hashtag suggestions (platform-appropriate)
- Best posting time recommendation
- Visual content brief (what image/video to use with the post)
- Engagement prompt (question or CTA to drive comments)
- Variations (2-3 angle options when relevant)

---

Read core context files, then create the social content for the specified platform(s). Apply `social-content` and `social-media-marketing` skills. Pass to `editor` agent for brand voice review before delivering final output.
