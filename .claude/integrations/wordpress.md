---
name: wordpress
platform: WordPress
status: scaffold
---

# WordPress Integration

Publishes content to WordPress via the REST API with Yoast SEO metadata support.

## Required .env Keys

```
WP_URL=https://your-site.com
WP_USERNAME=your-wordpress-username
WP_APP_PASSWORD=your-application-password
```

**Setup:** In WordPress admin → Users → [Your User] → Application Passwords → Add New. Use the generated password as WP_APP_PASSWORD.

## Authentication

Basic auth using WordPress Application Passwords (introduced in WP 5.6):
```
Authorization: Basic base64(WP_USERNAME:WP_APP_PASSWORD)
```

## Content Formatting

Convert markdown to HTML before sending. Field mapping:
- H1 → `title.rendered`
- Body (below H1) → `content.raw`
- YAML `meta_title` → Yoast `_yoast_wpseo_title`
- YAML `meta_description` → Yoast `_yoast_wpseo_metadesc`
- YAML `focus_keyword` → Yoast `_yoast_wpseo_focuskw`
- YAML `tags` → `tags` (resolve tag IDs first)
- YAML `category` → `categories` (resolve category ID first)

## API Endpoints

**Create post (draft):**
```
POST {WP_URL}/wp-json/wp/v2/posts
Body: {
  "title": "[H1 text]",
  "content": "[HTML body]",
  "status": "draft",
  "meta": {
    "_yoast_wpseo_title": "[meta title]",
    "_yoast_wpseo_metadesc": "[meta description]",
    "_yoast_wpseo_focuskw": "[focus keyword]"
  }
}
```

**Publish (change status to publish):**
```
POST {WP_URL}/wp-json/wp/v2/posts/{post_id}
Body: { "status": "publish" }
```

**Check available categories:**
```
GET {WP_URL}/wp-json/wp/v2/categories
```

## Notes

- Yoast meta fields require the Yoast SEO plugin to be active
- Images must be uploaded separately via `/wp-json/wp/v2/media` before referencing
- Always create as draft first, then confirm before publishing live
