---
name: conversational-marketing
description: "Use when designing chatbot and live chat strategies, building conversational lead qualification flows, planning SMS marketing, creating conversational email sequences, or reducing friction in the buying process with real-time dialogue. Also use when the user says "conversational marketing", "chatbot", "live chat", "bot strategy", "conversational AI", "SMS marketing", "chat qualification", "website chat", "Drift", "Intercom", or "real-time lead qualification". Applies Drift's conversational flywheel and David Cancel's bot-to-human handoff methodology."
---

# Conversational Marketing

## Core Philosophy

Conversational marketing replaces forms with conversations. Instead of making a potential customer fill out a form and wait, you engage them in real-time dialogue — qualifying, educating, and routing them to the right outcome in the moment.

**The core insight:** B2B buyers expect B2C-speed experiences. A qualified prospect won't wait 24 hours for a response on a pricing inquiry.


## Expert Foundations

**Drift / David Cancel — Conversational Marketing Framework**
Cancel's conversational flywheel: Engage → Understand → Recommend. The core insight: most website visitors leave without identifying themselves because they hit a form before they're ready to convert. Conversations intercept visitors in the moment of highest intent (on your pricing or product page) and qualify them instantly — replacing the "fill out this form and we'll get back to you in 48 hours" model with "talk to us right now."

**The Buyer's New Reality**
Modern buyers have completed 57-70% of their purchase decision before contacting sales (CEB/Gartner data). Conversational marketing catches them during that research phase — before they're ready for a formal sales conversation, but after they've shown intent.

### The Conversational Flywheel

**Engage:** Start a conversation at the right moment (right page, right visitor segment, right intent signal)
**Understand:** Ask qualifying questions to learn about the visitor's need, role, and timeline
**Recommend:** Route to the right next step — book a demo, watch a relevant video, start a trial, or talk to sales

The fatal mistake: using chatbots to slow people down (form replacement) rather than speed them up (instant conversation routing).

### Where to Deploy Conversations

| Page | Visitor Intent | Recommended Play |
|---|---|---|
| Pricing page | High — comparing options | "What's your biggest question about pricing?" or "Want to see if we fit your budget?" |
| Product/features page | Mid — evaluating fit | "Which team does this matter most to?" (qualification) |
| Homepage | Low — exploring | General "What brings you here today?" |
| Demo request page | High — ready to convert | "Book your demo in 30 seconds" with instant scheduling |
| Blog / content | Low — learning | Subscribe or "Explore this topic" |
| Return visitor (2nd+ visit) | Mid-High — considering | Personalized to what they viewed last session |

### Bot-to-Human Handoff Logic

Define exactly when to hand off to a human:
- **VIP accounts** (ABM target list): Always route to human immediately
- **High-intent signals** (pricing + demo page + returning visitor): Route to human
- **Explicit request** ("I want to talk to someone"): Always human
- **After 3+ bot exchanges** with no resolution: Offer human option
- **After hours:** Capture email, notify sales for next-business-hour follow-up

### Intent Scoring Integration

Combine conversational signals with other intent data:
- Pricing page visit: +15 points
- Bot conversation initiated: +10 points
- Demo requested in chat: +50 points
- Company is on target account list: +25 points
- Return visitor: +10 points

When score crosses threshold → route to sales immediately or trigger SDR follow-up within same day.

### Measurement

| Metric | What It Measures |
|---|---|
| Conversation start rate | % of visitors who engage with bot |
| Bot → human handoff rate | % of conversations escalated |
| Meeting booked rate | % of conversations that result in demo |
| Conversation-influenced pipeline | Pipeline from deals with chat touchpoint |
| Time to response (human) | Speed of human follow-up after handoff |

## Conversational Channels

### Website Chat (Chatbot + Live)

**What it replaces:**
- Long contact forms
- "We'll be in touch" delays
- Generic email nurtures for high-intent visitors

**Use cases:**
- Qualify inbound leads in real-time
- Book meetings directly from high-intent pages (pricing, demo request)
- Answer FAQs without requiring a form
- Route to the right sales person based on segment
- Support existing customers

**Bot vs. live agent:**
- **Bot (24/7):** FAQ, lead qualification, meeting booking, after-hours coverage
- **Live agent:** Complex questions, high-value prospects, late-stage conversations

**Platforms:** Drift, Intercom, HubSpot Live Chat, Qualified (for B2B), Tidio (SMB)

### Conversation Design Principles

**Good chatbot flows:**
1. Greet based on page context (pricing page visitor vs. blog visitor)
2. Ask one qualifying question at a time (not a form disguised as a chat)
3. Offer immediate value before asking anything
4. Always offer a human escalation path
5. Short, conversational messages — not marketing paragraphs
6. Clear decision branches with defined outcomes (book meeting / send resource / route to sales)

**Chatbot script structure:**
```
Bot: "Hey! Are you exploring [Product] for the first time, or looking for help with something specific?"
→ Option A: "First time" → Qualification flow
→ Option B: "Help with something" → Support flow
```

### SMS Marketing

SMS is the highest open-rate channel (98%) but carries the highest risk of abuse — people guard their phone numbers closely.

**SMS best practices:**
- Only send to people who explicitly opted in to SMS (not just email)
- Maximum 2-4 messages/month for most brands
- Message must be immediately relevant and valuable
- Always include opt-out path ("Reply STOP to unsubscribe")
- Personalize: include name + context when possible
- Send at appropriate times (10am-8pm local; never weekends unless warranted)

**High-performing SMS use cases:**
- Transactional: Order confirmation, shipping updates, appointment reminders
- Time-sensitive promotions: Flash sale, event reminder (24-hour window)
- Re-engagement: "We noticed you haven't logged in — your [thing] is ready"
- Abandoned cart: Short, direct reminder with direct link

**Platforms:** Attentive, Klaviyo (SMS), Postscript (e-commerce), SimpleTexting, Twilio (custom)

### Conversational Email

Email can be conversational even when it's not live:
- Use first person, plain text style (not designed HTML templates)
- Reply-worthy subject lines: questions, direct statements, curiosity
- Ask one question per email; invite a reply
- Segment by behavior and respond to replies with human responses
- "Just reply to this email" as CTA — reduces friction vs. form

## Lead Qualification Frameworks in Conversation

### BANT (traditional, useful for context)
- **Budget:** Do they have budget authority?
- **Authority:** Are they the decision-maker?
- **Need:** Do they have the problem your product solves?
- **Timeline:** When are they looking to solve it?

### MEDDIC (deeper, enterprise-focused)
- **Metrics:** What quantified outcome matters to them?
- **Economic Buyer:** Who controls the budget?
- **Decision Criteria:** What criteria will drive their decision?
- **Decision Process:** How do they make this type of decision?
- **Identify Pain:** What's the cost of not solving this?
- **Champion:** Who internally wants this to succeed?

### Conversation-Friendly Qualification
For chat: pick 2-3 key questions that quickly sort fit from non-fit:
1. "What's your main goal with [product category]?"
2. "How many people would be using this?"
3. "When are you looking to move forward?"

## Conversational Marketing Metrics

| Metric | What It Measures |
|---|---|
| Chat engagement rate | % of visitors who engage with chat |
| Bot completion rate | % of chat flows completed without abandonment |
| Meeting booking rate from chat | Conversion efficiency |
| Lead qualification rate | % of chats that produce a qualified lead |
| Response time (live chat) | Speed to human response |
| SMS open rate | Benchmark: 85-98% |
| SMS opt-out rate | Monitor closely; > 3% = overuse |
| Conversation-to-pipeline rate | Business impact |

## Related Skills

`email-marketing`, `outbound-marketing`, `b2b-marketing`, `page-cro`, `marketing-psychology`
