---
description: Build an account-based marketing (ABM) plan for a specific account, list of accounts, or target segment.
---

# /abm

Build an ABM plan for targeted account engagement.

## Usage

```
/abm [account name, list, or segment]
```

**Examples:**
```
/abm Salesforce (1:1 strategic ABM)
/abm top 25 fintech accounts in our CRM
/abm enterprise segment in healthcare and finance
/abm accounts in our CRM that visited pricing page 3+ times
```

## What Happens

1. Reads context files (especially audience-profiles.md, competitors.md, products-services.md)
2. Determines ABM tier (1:1, 1:few, 1:many) based on account count
3. Applies `abm`, `b2b-marketing`, and `outbound-marketing` skills
4. Builds a complete ABM plan for the tier
5. Saves to `campaigns/abm-[account-or-segment].md`

## ABM Plan Output

**For 1:1 (1-10 accounts):**
- Individual stakeholder map per account
- Personalized messaging per account and persona
- Custom campaign elements per account
- Outreach sequence per stakeholder
- Direct mail / gifting recommendations
- Executive outreach plan

**For 1:Few (10-100 accounts):**
- Account segmentation rationale
- Segment-level messaging themes
- Email + LinkedIn outreach sequences
- Content and assets to personalize
- Event or roundtable strategy
- Account scoring and trigger plan

**For 1:Many (100+ accounts):**
- Audience segment definition
- Programmatic campaign strategy
- Intent data recommendations
- Automated nurture sequences
- SDR trigger criteria
- Account scoring model

## Always Includes

- Stakeholder titles and messaging per role
- Channel mix recommendation
- Sales alignment notes (when to hand off to SDR)
- Account engagement scoring criteria
- Success metrics and pipeline targets

---

Read context files, determine ABM tier from account count, apply abm and b2b-marketing skills, and build the ABM plan. Save to campaigns/.
