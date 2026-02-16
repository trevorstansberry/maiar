---
name: integration-template
platform: [platform-name]
status: scaffold
---

# Integration Template

Copy this file to `.claude/integrations/[platform-name].md` and fill in the platform-specific details.

## Overview

- **Platform:** [Platform name]
- **API type:** REST / GraphQL
- **Auth method:** API key / OAuth / Bearer token
- **Required .env keys:** [List the keys from .env.example]

## Authentication

```
# .env
PLATFORM_API_KEY=your-key-here
PLATFORM_URL=https://api.platform.com
```

Verify credentials are set before attempting any API call. If missing, tell the user:
> "This integration requires [KEY_NAME] in your .env file. See .env.example for setup instructions."

## Preflight Checks

Before publishing, verify:
- [ ] Credentials are present in .env
- [ ] Content has meta title (50-60 chars)
- [ ] Content has meta description (150-160 chars)
- [ ] Primary keyword is identified
- [ ] User has confirmed content is ready

## Content Formatting

Describe how to convert the source markdown to the platform's expected format:

```
Input: Markdown file from drafts/ or published/
Output: [Platform's expected format - HTML, JSON, rich text, etc.]

Field mapping:
- H1 → title field
- Body → content/body field
- YAML frontmatter → meta fields
- Images → [how to handle images]
```

## API Call

Describe the API endpoint and request structure:

```
Method: POST
Endpoint: https://api.platform.com/v1/posts
Headers:
  Authorization: Bearer {PLATFORM_API_KEY}
  Content-Type: application/json

Body: {
  "title": "[from H1]",
  "content": "[formatted body]",
  "status": "draft" | "published",
  "meta_title": "[from frontmatter or H1]",
  "meta_description": "[from frontmatter]"
}
```

## Success Response

What a successful API response looks like, and what URL to return to the user.

## Error Handling

Common errors and what to tell the user:
- 401 Unauthorized → "Check your API credentials in .env"
- 404 Not Found → "Check your site URL or collection ID"
- 422 Validation Error → "Check required fields: [list]"

## Post-Publish

After successful publish:
1. Return the URL: "[Content is live at: [URL]]"
2. Suggest adding to `context/internal-links-map.md` if it's a key page
