/**
 * Agent Runner — executes multi-step agent chains for commands.
 *
 * Each agent in the chain gets:
 *   - Its own system prompt (agent prompt + relevant skills + client context)
 *   - The user's original message
 *   - The accumulated output from previous agents in the chain
 *
 * Emits `agent_step` SSE events as each agent starts so the frontend
 * can show real-time progress tags.
 */

import Anthropic from '@anthropic-ai/sdk'
import { config } from './config.js'
import { buildAgentPrompt } from './systemPrompt.js'
import { createContentRouter } from './contentRouter.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

/**
 * Pretty-print an agent name for display.
 * 'seo-optimizer' → 'SEO Optimizer'
 */
function formatAgentName(slug) {
  return slug
    .split('-')
    .map(word => {
      const upper = word.toUpperCase()
      // Keep common acronyms uppercase
      if (['seo', 'cro', 'abm', 'ppc'].includes(word)) return upper
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

/**
 * Run a chain of agents, streaming every agent's output to canvas.
 * Each agent refines the previous agent's work. A `canvas_clear` event
 * is sent before each agent so the frontend shows the latest version.
 *
 * @param {Object} opts
 * @param {string} opts.clientSlug - client workspace slug
 * @param {string} opts.userMessage - the user's original message
 * @param {Array} opts.history - prior conversation messages
 * @param {string[]} opts.agentChain - ordered list of agent slugs
 * @param {string[]} opts.skills - skill slugs to load
 * @param {(text: string) => void} opts.onDelta - streaming text callback
 * @param {(data: object) => void} opts.sendEvent - SSE event sender
 * @param {(stats: {inputTokens: number, outputTokens: number}) => void} opts.onDone - completion callback
 */
export async function runAgentChain({
  clientSlug,
  userMessage,
  history,
  agentChain,
  skills,
  persona,
  prioritySkills = [],
  images,
  onDelta,
  sendEvent,
  onDone
}) {
  let previousOutput = ''
  let totalInputTokens = 0
  let totalOutputTokens = 0
  const agentSteps = []

  // Emit the full agent chain + skills so the frontend can show a pipeline timeline
  sendEvent({
    type: 'agent_chain',
    agents: agentChain.map(slug => ({ slug, name: formatAgentName(slug) })),
    skills: skills ?? []
  })

  for (let i = 0; i < agentChain.length; i++) {
    const agentSlug = agentChain[i]
    const agentName = formatAgentName(agentSlug)

    // Emit agent step event for frontend tags
    sendEvent({ type: 'agent_step', name: agentName, agentSlug })
    agentSteps.push({ name: agentName, agentSlug })
    console.log(`[agent] Starting agent: ${agentName} (${i + 1}/${agentChain.length})`)

    // Build agent-specific system prompt
    const systemPrompt = buildAgentPrompt(clientSlug, agentSlug, skills, persona, prioritySkills)

    // Build messages for this agent step — images only for the first agent
    const messages = buildAgentMessages(userMessage, history, previousOutput, i, i === 0 ? images : undefined)

    // Clear canvas before each agent so it shows the fresh refined version
    sendEvent({ type: 'canvas_clear' })

    // Route agent output through content tags — preamble → chat, deliverable → canvas
    const router = createContentRouter((text, target) => {
      if (target === 'canvas') {
        onDelta(text)
      } else {
        // Agent preamble/thinking goes to chat
        sendEvent({ type: 'delta', text, target: 'chat' })
      }
    })

    const stream = await client.messages.stream({
      model: config.model,
      max_tokens: config.maxTokens,
      system: systemPrompt,
      messages
    })

    let agentOutput = ''
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        agentOutput += event.delta.text
        router.route(event.delta.text)
      }
    }
    router.flush()

    const finalMessage = await stream.finalMessage()
    totalInputTokens += finalMessage.usage.input_tokens
    totalOutputTokens += finalMessage.usage.output_tokens
    previousOutput = agentOutput

    console.log(`[agent] ${agentName} done (${agentOutput.length} chars)`)
  }

  onDone({
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
    agentSteps
  })
}

/**
 * Build the messages array for an agent step.
 * First agent sees the original user message + history.
 * Subsequent agents see the user message + previous agent output.
 */
function buildAgentMessages(userMessage, history, previousOutput, stepIndex, images) {
  if (stepIndex === 0) {
    const userContent = images?.length
      ? [
          ...images.map(img => ({
            type: 'image',
            source: { type: 'base64', media_type: img.mediaType, data: img.base64 }
          })),
          { type: 'text', text: userMessage }
        ]
      : userMessage
    return [
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: userContent }
    ]
  }

  // Subsequent agents get the original request + prior agent output
  return [
    {
      role: 'user',
      content: `Original request: ${userMessage}\n\n---\n\nPrevious agent output:\n\n${previousOutput}`
    }
  ]
}
