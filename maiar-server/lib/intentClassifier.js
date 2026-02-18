/**
 * Intent Classifier — classifies natural language messages into Maiar command intents.
 *
 * Uses a fast Claude call to determine what the user wants to do,
 * mapping their request to an existing command or a high-level category.
 */

import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const CLASSIFICATION_PROMPT = `You are an intent classifier for a marketing assistant. Classify the user's request into one of these specific intents, or a high-level category if the request is too broad.

Specific intents (map directly to commands):
- write: creating written content (blog posts, landing pages, case studies, guides, etc.)
- email: writing emails or email sequences (welcome, nurture, drip, etc.)
- social: creating social media posts (LinkedIn, Twitter/X, Instagram, etc.)
- ads: writing ad copy or ad strategy (Google Ads, Meta, LinkedIn, etc.)
- campaign: planning a marketing campaign
- research: SEO research, keyword research, market research
- audit: auditing content, a channel, or a website
- analyze: analyzing existing content or competitor materials
- optimize: optimizing existing content for SEO/CRO/engagement
- strategy: creating a strategy document
- ideas: brainstorming marketing ideas
- competitor: competitor analysis
- persona: building a buyer persona
- lifecycle: designing lifecycle/onboarding/retention sequences
- abm: account-based marketing plans
- influencer: influencer marketing campaigns
- repurpose: repurposing existing content into new formats
- brand-positioning: brand positioning and messaging
- brand-research: researching a brand to populate context
- performance-review: reviewing content/channel performance
- publish: publishing content to a platform

High-level categories (need user to narrow down):
- create: user wants to create something but hasn't specified what type
- plan: user wants to plan something but hasn't specified what

If the request is truly general chat, a question, or asking for advice, use:
- general: questions, advice, opinions, information requests, or general conversation

Important classification rules:
- Questions asking for advice, opinions, or information → always classify as "general"
  Examples: "What's the best time to post?", "How do I improve my CTR?", "What's a good subject line?"
- Only classify as a specific intent when the user is requesting an ACTION — create, write, build, plan, audit, analyze, or optimize something specific
  Examples: "Write me a blog post about X" → write, "Create a LinkedIn post about X" → social, "Audit my homepage" → audit
- "What should I write about?" → general (advice), NOT write
- "What's the best time to post on LinkedIn?" → general (advice), NOT social
- When in doubt, classify as "general" with lower confidence

Respond with ONLY a JSON object (no markdown, no explanation):
{"intent": "...", "topic": "...", "confidence": 0.0-1.0}

Where "topic" extracts the subject matter from the request (e.g., "reducing churn", "Q4 product launch").`

/**
 * Classify a user message into a marketing intent.
 * @param {string} message - The user's natural language message
 * @returns {Promise<{intent: string, topic: string, confidence: number}>}
 */
export async function classifyIntent(message) {
  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: CLASSIFICATION_PROMPT,
      messages: [{ role: 'user', content: message }]
    })

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')

    // Strip markdown fences if Claude wraps JSON in ```json ... ```
    let jsonStr = text.trim()
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (fenceMatch) jsonStr = fenceMatch[1].trim()

    const parsed = JSON.parse(jsonStr)
    return {
      intent: parsed.intent ?? 'general',
      topic: parsed.topic ?? '',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5
    }
  } catch (err) {
    console.error('[intent] Classification failed:', err.message)
    return { intent: 'general', topic: '', confidence: 0 }
  }
}
