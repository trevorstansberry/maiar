---
description: Repurpose existing content into new formats for different channels — turn a blog post into social content, emails, ad copy, a video script, and more.
---

# /repurpose

Transform an existing piece of content into formats optimized for other channels.

## Usage

```
/repurpose [file path or URL] [target format(s)]
```

**Examples:**
```
/repurpose drafts/blog-post-churn.md into social posts
/repurpose drafts/webinar-recap.md into email newsletter, linkedin, and twitter thread
/repurpose https://yourblog.com/post into all social formats
/repurpose research/case-study-acme.md into ad copy, one-pager, and social proof snippets
/repurpose published/podcast-ep-47.md into blog post, clips guide, and email
```

## Context Files

**Always reads (core context):**
- `context/company/brand-voice.md`
- `context/products/[product]/audience-profiles.md`
- `context/products/[product]/goals-kpis.md`

**Also reads:**
- `context/company/style-guide.md` — for tone and formatting rules
- `context/products/[product]/channels.md` — active platforms to target

## Agent Chain

1. Reads source content and adapts it for each requested format using `social-content` + `copywriting` + relevant channel skills
2. `editor` agent reviews each repurposed piece for brand voice consistency and platform fit

## What Happens

1. Reads the source content
2. Reads core context files + style-guide.md + channels.md
3. Determines which formats are being requested (or asks if unclear)
4. Adapts content for each target format — not copy-paste, but properly reformatted for each channel
5. `editor` agent reviews each piece for brand voice and platform fit
6. Saves final versions to `drafts/`

## Supported Output Formats

- LinkedIn post (or carousel outline)
- Twitter/X thread
- Instagram caption + visual brief
- TikTok script
- Email newsletter (standalone or digest)
- Blog post (expand short-form to long-form)
- Short-form blog summary (condense long-form)
- Ad copy (Google, Meta)
- Video script
- Podcast episode summary
- Sales email or outreach message
- One-pager or fact sheet
- Press release
- Quote cards or pull quotes
- Slide deck outline

## Repurposing Principles

Each format adaptation:
- Rewrites the hook for the platform (doesn't just copy the blog headline)
- Adjusts length and structure to match platform norms
- Adds platform-appropriate CTAs and engagement prompts
- Preserves the core insight while optimizing for the new context

## Output

Each repurposed piece saved to `drafts/[original-name]-[format].md`

---

Read the source content, understand what formats are requested, and adapt the content for each format with platform-appropriate structure, length, and style. Apply `social-content`, `copywriting`, and relevant channel skills. Pass each piece to `editor` agent for brand voice consistency review before saving to `drafts/`.
