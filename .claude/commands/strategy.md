---
description: Generate a strategy document for any marketing discipline — SEO, content, email, social, ABM, growth, retention, and more.
---

# /strategy

Build a comprehensive strategy document for any marketing discipline or channel.

## Usage

```
/strategy [marketing type or discipline]
```

**Examples:**
```
/strategy content marketing for 2025
/strategy inbound marketing for B2B SaaS
/strategy email marketing rebuild
/strategy SEO for a new product category
/strategy ABM for enterprise segment
/strategy growth marketing for freemium product
/strategy retention and lifecycle for SaaS
/strategy social media LinkedIn-first
/strategy partner and affiliate program
```

## What Happens

1. Reads all context files (especially goals-kpis.md and channels.md)
2. Invokes `channel-selector` agent to validate channel recommendations against context
3. Applies the relevant skill(s) for the strategy discipline
4. Builds a complete strategy document
5. Saves to `campaigns/strategy-[type]-[date].md`

## Strategy Document Includes

### 1. Situation Analysis
- Current state assessment
- Key opportunities
- Constraints and risks

### 2. Goals and Success Metrics
- Primary objective (specific, measurable)
- KPIs with targets
- Timeline

### 3. Target Audience
- Primary segment
- Key insights that drive strategy

### 4. Strategic Approach
- Core strategy in 1-2 sentences
- Key strategic bets
- What we're NOT doing (and why)

### 5. Tactics and Execution Plan
- Channel-by-channel tactics
- Content/asset requirements
- Prioritized action list

### 6. Resources Required
- Budget estimate
- Team/skills needed
- Tools and technology

### 7. Measurement and Reporting
- Reporting cadence
- Metrics dashboard
- Success review date

---

Read context files, apply the relevant skill for the strategy discipline, and produce a complete strategy document. Save to campaigns/.
