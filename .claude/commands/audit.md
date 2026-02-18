---
description: Audit a marketing channel, piece of content, or campaign. Returns structured findings with prioritized recommendations.
---

# /audit

Audit any marketing channel, content piece, or campaign to identify what's working, what's not, and what to fix first.

## Usage

```
/audit [what to audit]
```

**Examples:**
```
/audit our blog SEO
/audit this landing page [paste URL or file path]
/audit our email nurture sequence [paste content or file path]
/audit our LinkedIn company page
/audit our homepage conversion rate
/audit our paid search campaign setup [paste account structure or description]
/audit our onboarding email sequence
```

## Context Files

**Always reads (core context):**
- `context/company/brand-voice.md`
- `context/products/[product]/audience-profiles.md`
- `context/products/[product]/goals-kpis.md`

**Also reads based on audit type:** seo-guidelines.md (SEO audits), internal-links-map.md (content audits), channels.md (social/email audits)

## Agent Routing

Audit type determines which agents run:

| Audit Type | Agents Invoked | Skills Applied |
|---|---|---|
| SEO audit | `seo-optimizer` | `seo-audit`, `programmatic-seo` |
| CRO / landing page audit | `conversion-optimizer` | `page-cro`, `signup-flow-cro`, `form-cro` |
| Email audit | `editor` | `email-sequence`, `email-marketing` |
| Content quality audit | `content-analyzer` | `content-marketing`, `copy-editing` |
| Social / brand audit | `editor` | `social-media-marketing`, `brand-marketing` |
| Paid audit | `conversion-optimizer` | `paid-ads`, `sem-ppc`, `page-cro` |

## What Happens

1. Reads core context files + audit-type-specific context
2. If given a URL: fetches and analyzes the content
3. If given a file: reads and analyzes it
4. Routes to the appropriate agent(s) based on audit type
5. Produces structured audit report with prioritized findings

## Audit Report Structure

### Executive Summary
- Overall assessment (Strong / Needs Work / Significant Issues)
- Top 3 findings
- Priority recommendation

### Detailed Findings

For each finding:
- **Issue:** What's wrong or suboptimal
- **Impact:** Why this matters (metric or outcome affected)
- **Recommendation:** Specific action to fix it
- **Priority:** Critical / High / Medium / Low

### Quick Wins
Items that can be fixed in under 30 minutes with significant impact.

### Strategic Improvements
Larger changes that require planning but have meaningful upside.

### Strengths
What's working well (don't just focus on problems).

---

Identify what is being audited, fetch or read the content if needed. Route to the appropriate agent(s) based on audit type: SEO → seo-optimizer; CRO/landing page → conversion-optimizer; email → editor; content → content-analyzer. Produce structured audit report with prioritized findings.
