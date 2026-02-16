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

## What Happens

1. Reads relevant context files for brand and audience standards
2. If given a URL: fetches and analyzes the content
3. If given a file: reads and analyzes it
4. Applies relevant skills (seo-audit, page-cro, email-sequence, etc. based on what's being audited)
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

## Audit Types Supported

- **SEO audit:** Technical SEO, on-page optimization, content quality
- **CRO audit:** Landing page, signup flow, forms, checkout
- **Email audit:** Subject lines, content, segmentation, deliverability
- **Social audit:** Profile completeness, content strategy, engagement
- **Content audit:** Quality, relevance, SEO, conversion
- **Paid audit:** Account structure, ad copy, targeting, landing pages
- **Brand audit:** Consistency across channels, voice, messaging

---

Identify what is being audited, fetch or read the content if needed, apply the relevant skill (seo-audit, page-cro, email-sequence, etc.), and produce a structured audit report with prioritized findings.
