---
description: Plan an influencer marketing campaign — identify the right types of influencers, write a campaign brief, structure partnership terms, and plan measurement.
---

# /influencer

Build an influencer marketing campaign plan and brief.

## Usage

```
/influencer [topic, product, or campaign goal]
```

**Examples:**
```
/influencer product launch for our new B2B tool
/influencer awareness campaign targeting SaaS founders
/influencer UGC campaign for social proof
/influencer brand ambassador program for power users
/influencer micro-influencer program for our fitness app
```

## Context Files

**Always reads (core context):**
- `context/company/brand-voice.md`
- `context/products/[product]/audience-profiles.md`
- `context/products/[product]/goals-kpis.md`

**Also reads:**
- `context/products/[product]/channels.md` — active social platforms and handles
- `context/products/[product]/overview.md` — product details for briefing

## Skills Applied

`influencer-marketing`, `marketing-psychology`, `social-media-marketing`

## What Happens

1. Reads core context files + channels.md + products-services.md
2. Applies `influencer-marketing` skill (Neal Schaffer's relationship-first framework)
3. Defines influencer criteria, outreach sequence, campaign brief, and measurement plan
4. Saves to `campaigns/influencer-[campaign].md`

## Output

### Influencer Criteria Scorecard

Weighted scoring matrix for evaluating candidates:

| Criterion | Weight | Scoring Notes |
|---|---|---|
| Audience demographics match ICP | 25% | Age, location, interests vs. your buyer profile |
| Engagement rate | 20% | Nano: 5-10%, Micro: 2-5%, Mid: 1-3% minimums |
| Content quality + brand alignment | 20% | Would you be proud to be featured here? |
| Audience authenticity | 15% | No follower spikes, real comments, HypeAuditor score |
| Niche authority | 10% | Are they the go-to voice in your category? |
| Past partnerships | 10% | No direct competitors; disclosure history clean |

**Red flags to screen for:** Sudden follower spikes, emoji-only comments, engagement rate under 1% for micro accounts, history of promoting unrelated products.

### Identification Methodology

Where to find candidates:
- Native hashtag search on Instagram, TikTok, YouTube, LinkedIn
- Your existing audience (who already follows and tags you)
- Competitor analysis (who promotes your competitors?)
- Platforms: Aspire, Creator.co, Grin, Upfluence, Modash

### 3-Touch Outreach Sequence

**Touch 1 — Warm intro (Day 1)**
Subject: [Specific recent post they made] + partnership interest
Body: Short, genuine, specific. Reference their content, describe your brand in one sentence, ask for a conversation.

**Touch 2 — Value add (Day 5)**
Share something relevant: a resource, early access, or insight that connects to their audience. Not a hard ask.

**Touch 3 — Final follow-up (Day 10)**
Short and gracious. Acknowledge they may not be interested now. Leave a clear door open.

### Campaign Brief Template

Ready-to-send creator brief:

1. **Brand overview** — 2-3 sentences on who you are and who you serve
2. **Campaign goal** — Awareness / traffic / signups / social proof
3. **Key message** — The one thing we want the audience to know or feel
4. **Mandatory inclusions** — Discount code, link, hashtag, brand mention style
5. **Tone guidance** — Examples of content we love + content that doesn't fit
6. **What NOT to do** — Restrictions, competitor mentions, claims not to make
7. **Deliverables** — Exactly what's being created (1 Reel + 2 Stories, etc.)
8. **Timeline** — Content due date, posting window, revision rounds
9. **Approval process** — How review works before posting

### Contract Terms Checklist

Key terms to cover in any paid influencer agreement:
- Deliverables (format, quantity, platform)
- Posting window (specific dates or a range)
- Exclusivity period (if any — typically 30-90 days in category)
- Usage rights (can you repurpose their content in paid ads?)
- FTC disclosure requirement (must disclose #ad or #sponsored)
- Revision rounds (typically 1-2)
- Payment terms and schedule
- Performance bonus terms (if applicable)
- Content ownership (creator retains; brand gets license to reuse)

### Compensation Model Recommendation

Based on campaign goal and influencer tier — one of:
- Gifted product only (nano, new relationships)
- Gifted + affiliate commission (micro, strong product fit)
- Flat fee + gifted (mid-tier, campaign-specific)
- Flat fee + performance bonus (any tier — aligns incentives)

Benchmark rates: Instagram post — $100-500 (nano), $500-5K (micro), $5K-25K (mid). Always negotiate.

### Performance Tracking Framework

**Tracking setup:**
- Unique discount code per influencer
- UTM parameters on all links
- Pixel tracking on landing pages (where applicable)

**KPIs by campaign goal:**

| Goal | Primary KPI | Secondary KPI |
|---|---|---|
| Awareness | Reach, Impressions | CPM vs. paid media |
| Traffic | Link clicks, Story swipe-ups | CPC |
| Conversions | Discount code redemptions | CPA |
| Social proof | Saves, Shares | Content quality score |

**Reporting cadence:** Request performance metrics from creators 7 days post-post. Review at 14 days for full halo effect data.

---

Read core context files, apply `influencer-marketing` skill, and produce a complete influencer campaign plan including: influencer criteria scorecard, identification methodology, 3-touch outreach sequence, campaign brief template, contract terms checklist, compensation recommendation, and performance tracking framework. Save to `campaigns/influencer-[campaign].md`.
