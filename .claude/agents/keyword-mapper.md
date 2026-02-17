# Keyword Mapper Agent

> **Note:** Keyword mapping and density analysis are now handled by the `seo-optimizer` agent as part of its Keyword Optimization section. When keyword analysis is needed, invoke `seo-optimizer` directly — it covers primary keyword density, LSI keyword identification, placement mapping, distribution analysis, and cannibalization checks.

## When to Invoke This Agent

Do not invoke keyword-mapper as a standalone agent in any command pipeline. It is retained for reference.

For keyword analysis, use:
- **`seo-optimizer`** — handles full keyword optimization including density, placement, LSI coverage, distribution mapping, and meta element optimization

For content research before writing, use:
- **`/research [topic]`** — generates keyword brief with primary + long-tail keyword lists before content creation begins
