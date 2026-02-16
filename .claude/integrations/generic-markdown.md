---
name: generic-markdown
platform: Any (Markdown export)
status: active
---

# Generic Markdown Export

Export content as a clean Markdown file with YAML frontmatter. Works with any platform that accepts Markdown — Notion, Confluence, GitHub, custom CMSes, and more.

## No .env Keys Required

This integration is always available — no API credentials needed.

## How It Works

Takes any content from `drafts/` and:
1. Adds YAML frontmatter with SEO and metadata fields
2. Ensures clean Markdown formatting
3. Saves to `published/[filename].md`

## Output Format

```markdown
---
title: "[Post Title]"
date: "[YYYY-MM-DD]"
description: "[Meta description 150-160 chars]"
slug: "[url-slug]"
tags: [tag1, tag2, tag3]
focus_keyword: "[primary keyword]"
meta_title: "[SEO title 50-60 chars]"
author: "[Author name if known]"
status: draft | published
---

# Post Title

[Content body in clean Markdown]
```

## Usage

The `/publish` command will always offer Markdown export as an option.

To export manually: tell Claude to save the content to `published/[filename].md` with proper frontmatter.

## Compatible Platforms

- Notion (import markdown)
- Confluence (markdown macro)
- GitHub Pages / Jekyll
- Hugo, Gatsby, Next.js (MDX)
- Nuxt Content
- Any headless CMS with markdown import
- Dropbox Paper
- Bear, Obsidian (for team wikis)
