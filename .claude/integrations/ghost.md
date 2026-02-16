---
name: ghost
platform: Ghost
status: scaffold
---

# Ghost Integration

Publishes posts to Ghost via the Ghost Admin API.

## Required .env Keys

```
GHOST_URL=https://your-site.ghost.io
GHOST_ADMIN_API_KEY=your-admin-api-key
```

**Setup:** In Ghost admin → Settings → Integrations → Add custom integration → Copy the Admin API Key.

## Authentication

Ghost uses JWT tokens generated from the Admin API Key. The Admin API Key format is `{id}:{secret}`.

Generate a JWT:
```
header: { "alg": "HS256", "kid": "{id from key}", "typ": "JWT" }
payload: { "iat": [current timestamp], "exp": [5 min from now], "aud": "/admin/" }
sign with: hex-decoded secret from key
```

Most HTTP clients have a Ghost API library. Alternatively, use the `@tryghost/admin-api` Node.js package.

## Content Formatting

Field mapping:
- H1 → `title`
- Body → `mobiledoc` (Ghost's format) or `lexical` (newer Ghost)
- YAML `meta_title` → `custom_excerpt` or `meta_title`
- YAML `meta_description` → `meta_description`
- YAML `tags` → `tags` array (objects with `name` field)
- YAML `featured` → `featured` (boolean)

Ghost accepts markdown via the `mobiledoc` format — wrap content in the mobiledoc markdown card structure.

## API Endpoint

**Create post:**
```
POST {GHOST_URL}/ghost/api/admin/posts/
Authorization: Ghost [JWT token]
Body: {
  "posts": [{
    "title": "[H1 text]",
    "mobiledoc": "[mobiledoc JSON with markdown card]",
    "status": "draft",
    "meta_title": "[meta title]",
    "meta_description": "[meta description]",
    "tags": [{"name": "tag1"}, {"name": "tag2"}]
  }]
}
```

## Notes

- Ghost's mobiledoc format wraps markdown in a JSON structure — generate this programmatically
- Always publish as draft first
- Ghost newsletter feature can auto-send to subscribers on publish — warn user before live publishing
