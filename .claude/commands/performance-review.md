---
description: Data-driven review of content and channel performance. Analyzes what's working, what's declining, and where to focus next.
---

# /performance-review

Run a data-driven performance review of your marketing content and channels.

## Usage

```
/performance-review
/performance-review [specific channel or time period]
```

**Examples:**
```
/performance-review
/performance-review blog content last 90 days
/performance-review email campaigns Q3
/performance-review paid channels this month
```

## What Happens

1. Reads `context/goals-kpis.md` for targets and current metrics
2. If data source integrations are configured (GA4, GSC, DataForSEO in `.env`), pulls live data
3. If no integrations: asks user to provide performance data to analyze
4. Applies `performance-analytics` skill
5. Produces a structured performance review with prioritized recommendations

## Performance Review Output

### Executive Summary
- Overall performance vs. targets
- Biggest win this period
- Biggest gap or concern
- #1 priority recommendation

### Content Performance
- Top performing content by sessions, engagement, and conversion
- Declining content that needs updating or refreshing
- Content gaps identified

### Channel Performance
- Performance by channel vs. targets and benchmarks
- Channels over-performing vs. plan
- Channels under-performing vs. plan
- Budget reallocation recommendations

### SEO Performance (if GSC connected)
- Keyword ranking changes
- Clicks and impressions trends
- Quick win opportunities (positions 5-15 that could move to top 3)

### Email Performance (if data provided)
- Open, click, and conversion trends
- Best and worst performing campaigns
- List health metrics

### Recommendations
- Prioritized list of actions for next period
- Stop doing / Start doing / Keep doing framework

---

Read goals-kpis.md, check for configured data integrations, analyze performance data (or ask user to provide it), and produce a structured performance review with specific, prioritized recommendations.
