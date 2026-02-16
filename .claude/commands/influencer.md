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
```

## What Happens

1. Reads context files (audience-profiles.md, brand-voice.md, channels.md)
2. Applies `influencer-marketing` skill
3. Defines the influencer profile, campaign brief, and measurement plan
4. Saves to `campaigns/influencer-[campaign].md`

## Output Includes

**Influencer Profile**
- Tier recommendation (nano/micro/mid/macro) with rationale
- Platform focus
- Follower profile characteristics
- Content style that fits your brand
- Engagement rate minimum
- Red flags to screen for

**Vetting Criteria Checklist**
Specific criteria for evaluating and approving influencer partners

**Campaign Brief Template**
Ready-to-send brief including:
- Brand overview
- Campaign goal and key message
- Mandatory inclusions
- Content guardrails
- Deliverables and timeline
- Compensation structure
- Approval process

**Outreach Templates**
Initial outreach message for influencer recruitment

**Measurement Plan**
- Tracking setup (UTM, discount codes, pixel)
- KPIs and targets
- Reporting cadence

---

Read context files, apply influencer-marketing skill, and produce an influencer campaign plan and brief. Save to campaigns/.
