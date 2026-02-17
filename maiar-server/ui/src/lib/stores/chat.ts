import { writable, derived } from 'svelte/store'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  savedTo?: string
}

export interface ChatState {
  messages: Message[]
  conversationId: string | null
  streaming: boolean
  streamingText: string
  inputTokens: number
  outputTokens: number
  canvasVisible: boolean
  canvasContent: string
  canvasSavedTo: string | null
}

const initial: ChatState = {
  messages: [],
  conversationId: null,
  streaming: false,
  streamingText: '',
  inputTokens: 0,
  outputTokens: 0,
  canvasVisible: false,
  canvasContent: '',
  canvasSavedTo: null
}

function createChat() {
  const { subscribe, update, set } = writable<ChatState>(initial)

  return {
    subscribe,

    addUserMessage(content: string): string {
      const id = crypto.randomUUID()
      update(s => ({
        ...s,
        messages: [...s.messages, { id, role: 'user', content, timestamp: new Date() }]
      }))
      return id
    },

    startStreaming() {
      update(s => ({ ...s, streaming: true, streamingText: '' }))
    },

    appendDelta(text: string) {
      update(s => ({
        ...s,
        streamingText: s.streamingText + text
        // Canvas no longer mirrors streaming — it loads from disk after done
      }))
    },

    finishStreaming(stats: { inputTokens: number; outputTokens: number; savedTo?: string | null; conversationId?: string }) {
      update(s => {
        const id = crypto.randomUUID()
        return {
          ...s,
          streaming: false,
          messages: [...s.messages, {
            id,
            role: 'assistant',
            content: s.streamingText,
            timestamp: new Date(),
            savedTo: stats.savedTo ?? undefined
          }],
          streamingText: '',
          inputTokens: stats.inputTokens,
          outputTokens: stats.outputTokens,
          conversationId: stats.conversationId ?? s.conversationId,
          canvasSavedTo: s.canvasVisible ? (stats.savedTo ?? null) : s.canvasSavedTo
        }
      })
    },

    openCanvas() {
      update(s => ({ ...s, canvasVisible: true, canvasContent: '', canvasSavedTo: null }))
    },

    restoreCanvas(content: string, savedTo: string) {
      update(s => ({ ...s, canvasVisible: true, canvasContent: content, canvasSavedTo: savedTo }))
    },

    closeCanvas() {
      update(s => ({ ...s, canvasVisible: false }))
    },

    setConversationId(id: string) {
      update(s => ({ ...s, conversationId: id }))
    },

    loadConversation(id: string, messages: Array<{ role: string; content: string; savedTo?: string | null }>): string | null {
      let lastSavedTo: string | null = null
      update(s => {
        const mapped = messages.map(m => {
          const msg: Message = {
            id: crypto.randomUUID(),
            role: m.role as 'user' | 'assistant',
            content: m.content,
            timestamp: new Date(),
            savedTo: m.savedTo ?? undefined
          }
          return msg
        })
        // Find the most recent assistant message with a savedTo path
        for (let i = mapped.length - 1; i >= 0; i--) {
          if (mapped[i].role === 'assistant' && mapped[i].savedTo) {
            lastSavedTo = mapped[i].savedTo!
            break
          }
        }
        return { ...s, conversationId: id, messages: mapped, inputTokens: 0, outputTokens: 0 }
      })
      return lastSavedTo
    },

    clear() {
      set({ ...initial })
    },

    getHistory() {
      let state: ChatState = initial
      const unsub = { subscribe }.subscribe(s => { state = s })
      unsub()
      // Messages with savedTo had their content saved to disk — send a brief reference
      // instead of the full text to keep conversation history lean for multi-turn.
      return state.messages.map(m => ({
        role: m.role,
        content: m.savedTo ? `[Draft at ${m.savedTo}]` : m.content
      }))
    }
  }
}

export const chat = createChat()

// Token usage percentage (out of 200k context window)
// inputTokens from the API already includes the full context sent (system prompt + history + message)
// so it is the authoritative measure of context window usage for this turn
export const contextUsage = derived(chat, $chat => {
  return Math.min(Math.round(($chat.inputTokens / 200000) * 100), 100)
})

// Human-readable token count string e.g. "56.2k / 200k tokens"
export const contextTokenLabel = derived(chat, $chat => {
  if ($chat.inputTokens === 0) return null
  const k = ($chat.inputTokens / 1000).toFixed(1)
  return `${k}k / 200k tokens`
})
