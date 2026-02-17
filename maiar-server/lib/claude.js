import Anthropic from '@anthropic-ai/sdk'
import { config } from './config.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

/**
 * Stream a chat response via SSE.
 *
 * @param {string} systemPrompt
 * @param {Array<{role: string, content: string}>} history
 * @param {string} userMessage
 * @param {(text: string) => void} onDelta
 * @param {(stats: {inputTokens: number, outputTokens: number}) => void} onDone
 */
export async function streamChat(systemPrompt, history, userMessage, onDelta, onDone) {
  const messages = [
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage }
  ]

  const stream = await client.messages.stream({
    model: config.model,
    max_tokens: config.maxTokens,
    system: systemPrompt,
    messages
  })

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      onDelta(event.delta.text)
    }
  }

  const finalMessage = await stream.finalMessage()
  onDone({
    inputTokens: finalMessage.usage.input_tokens,
    outputTokens: finalMessage.usage.output_tokens
  })
}
