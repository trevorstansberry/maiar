---
name: email-marketing
description: Use when building email marketing programs, planning list growth strategies, setting up email automation, improving deliverability, segmenting audiences, designing drip campaigns, or auditing email performance beyond individual sequences.
---

# Email Marketing

## Core Philosophy

Email marketing is the highest-ROI channel in marketing — average $42 return for every $1 spent. It's the only channel where you own the audience relationship. But it only works when you earn trust by delivering consistent value, not just promoting.

**The email marketing contract:** Subscribers give you their inbox in exchange for value. The moment you break that contract (too many emails, irrelevant content, too much promotion), they leave or stop opening.

## List Building

### Ethical List Growth Principles
- Only add people who explicitly opted in
- Single opt-in is fine for high-intent actions (free trial, purchase); use double opt-in for passive content subscriptions
- Never buy lists — it destroys deliverability and brand trust

### High-Converting Opt-In Placements
- Homepage header (for audience-first brands)
- Blog post inline CTAs (match to post content)
- Content upgrades (post-specific resource download)
- Exit intent popups (5-8% conversion on abandoning visitors)
- Checkout (purchase + newsletter opt-in)
- Webinar registration
- Free tool / calculator outputs

### Lead Magnet Best Practices
- Solve one specific problem immediately
- Deliver value in under 5 minutes (checklist, template, mini-guide)
- Promise is specific: "7 subject lines that got 50%+ open rates" not "email marketing tips"

## Deliverability

Deliverability is the foundation. Great copy doesn't matter if it lands in spam.

### Technical Setup (non-negotiable)
- **SPF record:** Lists authorized sending servers
- **DKIM signature:** Cryptographically signs emails
- **DMARC policy:** Instructs receivers what to do with failed authentication
- **Custom sending domain:** Never use free email addresses (@gmail, @yahoo)
- **Warm new IPs/domains:** Start with small volumes, ramp over 4-6 weeks

### Engagement-Based Deliverability
- Inbox providers (Gmail, Outlook) watch open and click rates to determine spam vs. inbox routing
- **Sunset unengaged subscribers:** Remove subscribers who haven't opened in 6+ months (or run a re-engagement campaign first)
- **Segment before sending:** Send to engaged subscribers more often; limit cold sends
- **Monitor reputation:** Use Google Postmaster Tools, MxToolbox, mail-tester.com

### Red Flags That Hurt Deliverability
- Spam trap hits (from old/purchased lists)
- Hard bounce rate > 2%
- Spam complaint rate > 0.1%
- Sudden drop in open rates (inbox routing change)

## List Segmentation

Segment by:
- **Acquisition source:** How they joined (intent signals differ by source)
- **Engagement level:** Active (opened in 30 days), at-risk (31-90 days), inactive (90+ days)
- **Behavior:** Has purchased / hasn't, specific pages visited, content downloaded
- **Demographics / firmographics:** Job title, company size, industry
- **Lifecycle stage:** Lead, trial user, paying customer, churned

The more relevant your segments, the higher your engagement rates.

## Email Automation Architecture

### Core Automated Flows

| Sequence | Trigger | Length |
|---|---|---|
| Welcome series | New subscriber | 3-5 emails over 7-14 days |
| Onboarding | Free trial start | 5-7 emails over 14 days |
| Lead nurture | Content download | 4-6 emails over 21 days |
| Post-purchase | First purchase | 3-5 emails over 14 days |
| Re-engagement | 60+ days inactive | 3-4 emails over 14 days |
| Win-back | Churned customer | 3-4 emails over 30 days |
| Upsell/cross-sell | Product milestone or usage signal | 2-3 emails |
| Referral ask | High NPS + milestone | 1-2 emails |

### Behavioral Triggers
- Visited pricing page 3x → send sales touch
- Opened email but didn't click → resend with different subject line
- Completed onboarding milestone → ask for review/referral
- Trial day 7 (no activation) → intervention email
- Trial expiring → urgency sequence

## Broadcast Email (Newsletters & Campaigns)

### Newsletter Best Practices
- **Consistent schedule:** Same day and time every week/month
- **Clear format:** Readers should know what to expect
- **One primary story or insight per send**
- **Reply-worthy:** Invite responses; it boosts deliverability and relationship
- **Subject line:** Test 2-3 variants; curiosity and specificity consistently win

### Campaign Emails
- Every campaign email needs one job (one CTA)
- For time-sensitive campaigns: 3-email sequence (announce → reminder → last chance)
- Personalization beyond first name: reference behavior, segment, or milestone

## Email Metrics

| Metric | Benchmark | Notes |
|---|---|---|
| Open rate | 20-40% | Varies widely by industry; iOS15 inflated rates |
| Click-through rate | 2-5% | Clicks / delivered |
| Click-to-open rate | 10-20% | More reliable than CTR alone |
| Unsubscribe rate | < 0.3% | Per send |
| Hard bounce rate | < 2% | Indicates list quality issues |
| Spam complaint rate | < 0.1% | Watch this closely |
| Conversion rate | Varies | Depends on goal |

## Platform Selection

| Platform | Best For |
|---|---|
| Mailchimp | Small businesses, simple campaigns |
| Kit (formerly ConvertKit) | Creators, newsletter-first businesses |
| Customer.io | Behavioral automation, SaaS/tech |
| Klaviyo | E-commerce, DTC |
| HubSpot | B2B, CRM integration |
| Brevo (Sendinblue) | Budget-friendly, transactional + marketing |
| Resend / Postmark | Transactional email, developer-first |

## Common Mistakes

- Sending to the entire list every time (ignores segmentation)
- Optimizing for open rate instead of revenue (iOS15 made open rates unreliable)
- Never cleaning the list (hurts deliverability)
- Burying the CTA (put it early and repeat it)
- No automated flows — missing high-intent moments

## Related Skills

`email-sequence`, `copywriting`, `retention-lifecycle`, `marketing-psychology`, `analytics-tracking`
