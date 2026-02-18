---
description: Publish content to a configured platform (WordPress, HubSpot, Webflow, Ghost, Contentful, or Markdown export). Checks which integrations are set up and guides the user through publishing.
---

# /publish

Publish finished content to a connected platform.

## Usage

```
/publish [file path]
/publish [file path] to [platform]
```

**Examples:**
```
/publish drafts/blog-post-reduce-churn.md
/publish drafts/landing-page-enterprise.md to wordpress
/publish drafts/case-study-acme.md to hubspot
```

## What Happens

1. Checks `.env` for configured integrations
2. Presents available platforms (only those with credentials set)
3. Runs pre-publish checklist (meta title, meta description, internal links, brand review)
4. Formats content for the target platform
5. Confirms with user before executing
6. Publishes via the platform's API
7. Returns the published URL

## Pre-Publish Checklist

Before any publish:
- [ ] Meta title (50-60 characters) — if missing, runs `seo-optimizer` agent
- [ ] Meta description (150-160 characters)
- [ ] Primary keyword confirmed
- [ ] Images have alt text
- [ ] Internal links included (3-5)
- [ ] Brand voice reviewed
- [ ] User confirmation

## Supported Platforms

| Platform | Status | Setup Required |
|---|---|---|
| WordPress | Ready when configured | WP_URL, WP_USERNAME, WP_APP_PASSWORD in .env |
| HubSpot | Ready when configured | HUBSPOT_ACCESS_TOKEN in .env |
| Webflow | Ready when configured | WEBFLOW_API_TOKEN, WEBFLOW_SITE_ID, WEBFLOW_COLLECTION_ID in .env |
| Ghost | Ready when configured | GHOST_URL, GHOST_ADMIN_API_KEY in .env |
| Contentful | Ready when configured | CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN in .env |
| Markdown Export | Always available | Saves to published/ folder |

## If No Platforms Are Configured

Direct user to:
1. Copy `.env.example` to `.env`
2. Add credentials for the desired platform
3. Re-run `/publish`

Or use Markdown export to save to `published/` folder.

---

Check .env for configured integrations, run the pre-publish checklist, and invoke the `publishing-adapter` agent to format and publish the content. Always confirm with the user before executing the actual publish.
