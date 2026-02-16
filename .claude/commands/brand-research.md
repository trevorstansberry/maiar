---
description: Research a brand online and auto-populate all context files. Run this first when setting up Maiar for a new brand.
---

# /brand-research

Research a brand from its public web presence and populate all `context/` files.

## Usage

```
/brand-research [company-website-url]
```

**Example:**
```
/brand-research https://www.acme.com
```

## What This Does

1. Scrapes the company website (homepage, about, pricing, blog, features, case studies)
2. Searches G2, Capterra, Trustpilot, and ProductHunt for reviews and category positioning
3. Finds and analyzes social profiles (LinkedIn, Twitter/X, Instagram)
4. Searches for competitors and third-party press coverage
5. Synthesizes findings into drafts for all 11 context files
6. Presents findings and asks follow-up questions to fill gaps and confirm accuracy
7. Writes confirmed content to `context/`

## After Running

- Review each file in `context/` and refine any details
- Commit `context/` to git so your whole team gets the updated brand context
- The context files are now used by every command and agent — the better they are, the better every output

## Agent

This command delegates to the `brand-researcher` agent.

---

Invoke the brand-researcher agent now with the provided URL. If no URL was provided, ask the user: "What is your company's website URL?"
