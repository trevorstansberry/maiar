---
description: Synthesize brand research and competitive context into a positioning statement, message hierarchy, differentiation map, and brand narrative. The strategic foundation for all messaging. Best run after /brand-research has populated context files.
---

# /brand-positioning

**Usage:** `/brand-positioning`

**Prerequisites:** Run `/brand-research [url]` first to populate context files. This command requires populated `context/products/[product]/competitors.md`, `context/products/[product]/audience-profiles.md`, and `context/products/[product]/overview.md` to produce high-quality output.

## Context Files

**Always reads (core context):**
- `context/company/brand-voice.md`
- `context/products/[product]/audience-profiles.md`
- `context/products/[product]/goals-kpis.md`

**Also reads:**
- `context/products/[product]/overview.md` — value props and differentiators
- `context/products/[product]/competitors.md` — competitive alternatives
- `context/company/brand-guidelines.md` — verbal identity constraints

## Agent

Invokes `brand-strategist` agent.

## Positioning Framework Applied

Uses April Dunford's *Obviously Awesome* 5-component positioning process:
1. Competitive alternatives (what customers would do without you)
2. Unique attributes (what you have that alternatives don't)
3. Value for customers (translate features to outcomes)
4. Best-fit customer segment (who cares most about this value)
5. Market category (what frame makes your value obvious)

## What It Produces

- **Positioning statement** (2–3 options using Geoffrey Moore's template, with a recommended choice)
- **Message hierarchy** — Level 1 (core positioning), Level 2 (3 value pillars), Level 3 (proof points per pillar)
- **Differentiation map** — side-by-side comparison vs. top 2–3 alternatives
- **Brand narrative** — 3–4 paragraph emotional story connecting problem → belief → solution → outcome

## Output

Saves to `context/products/[product]/positioning.md` (or `context/company/positioning.md` for company-wide positioning — depends on your setup)

## Skills Applied

`brand-marketing`, `product-marketing`, `copywriting`

## Notes

This is the strategic foundation for everything else. Before running major campaigns, writing homepage copy, or briefing an agency — run `/brand-positioning` to ensure all messaging aligns to a clear, deliberate position. Output is written back into the context layer (not to `campaigns/`) so it becomes the authoritative source for all downstream commands and agents. Update after significant product launches, new competitive entrants, or audience pivots.
