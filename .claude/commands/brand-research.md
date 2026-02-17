---
description: Research a brand online and auto-populate all context files. Run this first when setting up Maiar for a new brand, or again to add a second product.
---

# /brand-research

Research a brand from its public web presence and populate all `context/` files.

## Usage

```
/brand-research [company-or-product-website-url]
```

**Example — first-time setup:**
```
/brand-research https://www.acme.com
```

**Example — adding a second product:**
```
/brand-research https://www.acme.com/consumer
```

## What This Does

1. Scrapes the website (homepage, about, pricing, blog, features, case studies)
2. Searches G2, Capterra, Trustpilot, and ProductHunt for reviews and category positioning
3. Finds and analyzes social profiles (LinkedIn, Twitter/X, Instagram)
4. Searches for competitors and third-party press coverage
5. **Asks setup questions** (using dropdown selectors) to determine product structure before writing anything
6. Synthesizes findings into drafts for all relevant context files
7. Presents findings and asks follow-up questions to fill gaps and confirm accuracy
8. Writes confirmed content to `context/company/` and `context/products/[slug]/`

## Setup Questions Asked

Before writing any files, the agent asks:

- **One product or multiple?** — determines whether product-level folders are needed
- **Shared or unique competitors?** — determines whether `competitors.md` lives at company level, product level, or both
- **Unified or per-product positioning?** — determines where `positioning.md` is written

These questions are answered via dropdown — no typing required.

## First-Time Setup

Running for the first time (no `context/products.md` exists):
- Writes shared brand context to `context/company/`
- Asks what to name the product (becomes the folder slug)
- Writes product context to `context/products/[slug]/`
- Creates `context/products.md` registry

## Adding a Second Product

Running again when `context/products.md` already exists:
- Detects existing products
- Asks: add new product or update an existing one?
- If adding: writes a new `context/products/[new-slug]/` folder, appends to `products.md`
- If updating: overwrites product-level files only — never touches `context/company/` without confirmation

## After Running

- Review each file in `context/company/` and `context/products/[slug]/` and refine details
- Commit `context/` to git so your whole team gets the updated brand context
- Run `/write [topic]` to test the voice, or `/competitor [company]` to see competitive analysis

## Agent

This command delegates to the `brand-researcher` agent.

---

Invoke the brand-researcher agent now with the provided URL. If no URL was provided, ask the user: "What is your company's (or product's) website URL?"
