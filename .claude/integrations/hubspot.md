---
name: hubspot
platform: HubSpot
status: scaffold
---

# HubSpot Integration

Publishes blog posts to HubSpot CMS via the HubSpot CMS API.

## Required .env Keys

```
HUBSPOT_ACCESS_TOKEN=your-private-app-access-token
```

**Setup:** In HubSpot → Settings → Integrations → Private Apps → Create private app. Grant `content` scope.

## Authentication

```
Authorization: Bearer {HUBSPOT_ACCESS_TOKEN}
```

## Content Formatting

Field mapping:
- H1 → `htmlTitle` (display title) and `name` (internal name)
- Body → `postBody` (HTML)
- YAML `meta_description` → `metaDescription`
- YAML `slug` → `slug`
- YAML `tags` → `tagIds` (must resolve tag names to IDs first)
- YAML `featured_image` → `featuredImage`

## API Endpoints

**Get available blogs (to find blog ID):**
```
GET https://api.hubapi.com/cms/v3/blogs/
```

**Create blog post:**
```
POST https://api.hubapi.com/cms/v3/blogs/posts
Body: {
  "name": "[internal name / H1]",
  "htmlTitle": "[display title]",
  "postBody": "[HTML content]",
  "metaDescription": "[meta description]",
  "slug": "[url-slug]",
  "state": "DRAFT",
  "contentGroupId": "[blog ID from GET above]"
}
```

**Publish (update state to PUBLISHED):**
```
PATCH https://api.hubapi.com/cms/v3/blogs/posts/{post_id}
Body: { "state": "PUBLISHED" }
```

## Notes

- Always create as DRAFT first, confirm with user before publishing
- The `contentGroupId` is the HubSpot blog ID — users may need to provide this
- HubSpot uses its own rich text format; clean HTML is most compatible
