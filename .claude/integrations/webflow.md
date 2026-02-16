---
name: webflow
platform: Webflow
status: scaffold
---

# Webflow Integration

Publishes content to a Webflow CMS collection via the Webflow Data API.

## Required .env Keys

```
WEBFLOW_API_TOKEN=your-api-token
WEBFLOW_SITE_ID=your-site-id
WEBFLOW_COLLECTION_ID=your-collection-id
```

**Setup:**
1. In Webflow → Project Settings → Integrations → API Access → Generate API Token
2. Find your Site ID: GET `https://api.webflow.com/v2/sites` and copy the `id`
3. Find your Collection ID: GET `https://api.webflow.com/v2/sites/{site_id}/collections` and copy the blog collection `id`

## Authentication

```
Authorization: Bearer {WEBFLOW_API_TOKEN}
Content-Type: application/json
```

## Content Formatting

Webflow CMS fields are custom per collection. Common blog collection fields:
- `name` → post title (required, used as slug base)
- `slug` → URL slug
- `post-body` → rich text body (Webflow rich text format)
- `post-summary` → meta description / excerpt
- `thumbnail-image` → featured image (requires Webflow asset URL)
- `_draft` → true (create as draft); false (publish)
- `_archived` → false

**Note:** Ask the user to confirm their exact Webflow collection field names before publishing — they vary per project.

## API Endpoints

**Get collection fields (to confirm field names):**
```
GET https://api.webflow.com/v2/collections/{WEBFLOW_COLLECTION_ID}
```

**Create CMS item (draft):**
```
POST https://api.webflow.com/v2/collections/{WEBFLOW_COLLECTION_ID}/items
Body: {
  "isArchived": false,
  "isDraft": true,
  "fieldData": {
    "name": "[post title]",
    "slug": "[url-slug]",
    "post-body": "[rich text content]",
    "post-summary": "[meta description]"
  }
}
```

**Publish item:**
```
POST https://api.webflow.com/v2/collections/{WEBFLOW_COLLECTION_ID}/items/{item_id}/live
```

## Notes

- Webflow rich text has its own format — plain HTML may not render correctly in all cases
- Images must be hosted externally or uploaded to Webflow Assets first
- Always create as draft and confirm with user before publishing live
- After publishing via API, a site publish may be required to make it visible on the live site
