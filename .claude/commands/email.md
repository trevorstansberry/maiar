---
description: Write a single email or a complete email sequence. Covers welcome sequences, nurture series, launch emails, re-engagement, win-back, transactional, and more.
---

# /email

Write marketing emails — single sends or complete automated sequences.

## Usage

```
/email [type or description]
```

**Examples:**
```
/email welcome sequence for new free trial signups
/email launch announcement for our new feature
/email re-engagement for subscribers inactive 60+ days
/email win-back campaign for customers who churned 30-90 days ago
/email nurture sequence for downloaded our ABM guide
/email post-purchase thank you with upsell
/email cold outreach to fintech CTOs
```

## What Happens

1. Reads brand-voice.md, audience-profiles.md, and style-guide.md
2. If unclear: asks what type of email, who receives it, and what the desired action is
3. Writes the email(s) with appropriate subject lines, preview text, and body
4. For sequences: provides full sequence with day-by-day timing
5. Applies `email-marketing` and `email-sequence` skills

## Output Includes

For single emails:
- Subject line (+ 2 alternatives)
- Preview text
- Email body in brand voice
- CTA text and destination

For sequences:
- Sequence map (email # → trigger/timing → goal)
- Each email written in full with subject line and preview text
- Segmentation notes (when to exit the sequence)
- Platform setup notes (Mailchimp, Customer.io, Klaviyo, etc.)

## Email Types

- Welcome / onboarding sequences
- Lead nurture series
- Product launch announcements
- Re-engagement campaigns
- Win-back sequences
- Transactional follow-ups
- Cold outreach sequences
- Newsletter campaigns
- Promotional / offer emails
- Customer success / milestone emails
- Referral and NPS request emails

---

Read the relevant context files, identify the email type and audience, and write the email or sequence. Apply email-sequence and email-marketing skills.
