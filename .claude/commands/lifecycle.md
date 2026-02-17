---
description: Design customer lifecycle marketing sequences for any stage — onboarding, retention, win-back, expansion, or advocacy. Produces trigger-based email sequences, health scoring models, and activation playbooks grounded in Lincoln Murphy's Customer Success framework.
---

# /lifecycle

**Usage:** `/lifecycle [stage]`

**Examples:**
- `/lifecycle onboarding` — full onboarding email sequence + activation metrics
- `/lifecycle win-back` — segmented win-back email sequence for churned customers
- `/lifecycle retention` — re-engagement campaigns + expansion trigger sequences
- `/lifecycle expansion` — upsell/cross-sell sequence design
- `/lifecycle full` — complete lifecycle map covering all stages
- `/lifecycle` — (no argument) asks which stage to design

## Context Files

**Always reads (core context):**
- `context/company/brand-voice.md`
- `context/products/[product]/audience-profiles.md`
- `context/products/[product]/goals-kpis.md`

**Also reads:**
- `context/products/[product]/overview.md` — to understand what value milestones look like and what expansion options exist

## Agent

Invokes `lifecycle-planner` agent.

## What It Produces

For each stage:
- Stage goal and primary success metric
- Complete email sequence (subject lines, timing, goal per email, content direction)
- Trigger conditions (what customer behavior starts/ends each sequence)
- Health scoring model (for at-risk stage) or expansion trigger map (for active stage)
- Handoff logic (when does automation hand off to CS team?)
- In-app or non-email touchpoints

## Output

Saves to `campaigns/lifecycle-[stage].md`

## Skills Applied

`retention-lifecycle`, `email-marketing`, `email-sequence`, `onboarding-cro`

## Notes

If context files are empty, the lifecycle-planner will ask for key inputs before producing the sequence. The quality of lifecycle sequences depends directly on the specificity of the audience-profiles.md and products-services.md files — run `/brand-research` first for best results.
