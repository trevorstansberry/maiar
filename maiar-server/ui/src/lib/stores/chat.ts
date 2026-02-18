import { writable, derived } from 'svelte/store'

export interface AgentStep {
  name: string
  agentSlug?: string
}

export interface Choice {
  id: string
  label: string
  description?: string
  icon?: string
  category?: string
  mapTo?: string
}

export interface ChoiceSet {
  prompt?: string
  layout: 'cards' | 'buttons' | 'list'
  choices: Choice[]
}

export interface AgentChainEntry {
  slug: string
  name: string
  status: 'pending' | 'active' | 'complete'
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  savedTo?: string
  assetTitle?: string
  campaignTitle?: string
  agentSteps?: AgentStep[]
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
  activeAgent: string | null
  agentSteps: AgentStep[]
  agentChain: AgentChainEntry[] | null
  activeSkills: string[]
  pendingChoices: ChoiceSet | null
  abortController: AbortController | null
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
  canvasSavedTo: null,
  activeAgent: null,
  agentSteps: [],
  agentChain: null,
  activeSkills: [],
  pendingChoices: null,
  abortController: null
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

    startStreaming(): AbortController {
      const abortController = new AbortController()
      update(s => ({ ...s, streaming: true, streamingText: '', activeAgent: null, agentSteps: [], abortController }))
      return abortController
    },

    stopStreaming() {
      update(s => {
        s.abortController?.abort()
        return { ...s, abortController: null }
      })
    },

    setActiveAgent(step: AgentStep) {
      update(s => {
        // Also update the agent chain timeline if available
        let chain = s.agentChain
        if (chain) {
          chain = chain.map(entry => {
            if (entry.slug === step.agentSlug) return { ...entry, status: 'active' as const }
            if (entry.status === 'active') return { ...entry, status: 'complete' as const }
            return entry
          })
        }
        return {
          ...s,
          activeAgent: step.name,
          agentSteps: [...s.agentSteps, step],
          agentChain: chain
        }
      })
    },

    setAgentChain(agents: Array<{ slug: string; name: string }>, skills: string[]) {
      update(s => ({
        ...s,
        agentChain: agents.map(a => ({ ...a, status: 'pending' as const })),
        activeSkills: skills
      }))
    },

    setChoices(choiceSet: ChoiceSet) {
      update(s => ({ ...s, pendingChoices: choiceSet }))
    },

    clearChoices() {
      update(s => ({ ...s, pendingChoices: null }))
    },

    appendDelta(text: string, target: 'chat' | 'canvas' = 'chat') {
      update(s => ({
        ...s,
        streamingText: target === 'chat' ? s.streamingText + text : s.streamingText,
        canvasContent: target === 'canvas' ? s.canvasContent + text : s.canvasContent
      }))
    },

    finishStreaming(stats: { inputTokens: number; outputTokens: number; savedTo?: string | null; assetTitle?: string | null; campaignTitle?: string | null; conversationId?: string; agentSteps?: AgentStep[] | null }) {
      update(s => {
        const id = crypto.randomUUID()
        const steps = stats.agentSteps ?? (s.agentSteps.length > 0 ? s.agentSteps : undefined)
        return {
          ...s,
          streaming: false,
          messages: [...s.messages, {
            id,
            role: 'assistant',
            content: s.streamingText,
            timestamp: new Date(),
            savedTo: stats.savedTo ?? undefined,
            assetTitle: stats.assetTitle ?? undefined,
            campaignTitle: stats.campaignTitle ?? undefined,
            agentSteps: steps
          }],
          streamingText: '',
          inputTokens: stats.inputTokens,
          outputTokens: stats.outputTokens,
          conversationId: stats.conversationId ?? s.conversationId,
          canvasSavedTo: s.canvasVisible ? (stats.savedTo ?? null) : s.canvasSavedTo,
          activeAgent: null,
          agentSteps: [],
          agentChain: null,
          activeSkills: [],
          pendingChoices: null
        }
      })
    },

    openCanvas() {
      update(s => ({ ...s, canvasVisible: true, canvasContent: '', canvasSavedTo: null }))
    },

    restoreCanvas(content: string, savedTo: string) {
      update(s => ({ ...s, canvasVisible: true, canvasContent: content, canvasSavedTo: savedTo }))
    },

    clearCanvas() {
      update(s => ({ ...s, canvasContent: '' }))
    },

    closeCanvas() {
      update(s => ({ ...s, canvasVisible: false }))
    },

    setConversationId(id: string) {
      update(s => ({ ...s, conversationId: id }))
    },

    loadConversation(id: string, messages: Array<{ role: string; content: string; savedTo?: string | null; agentSteps?: AgentStep[] | null }>): string | null {
      let lastSavedTo: string | null = null
      update(s => {
        // Abort any in-flight streaming before switching
        s.abortController?.abort()

        const mapped = messages.map(m => {
          const msg: Message = {
            id: crypto.randomUUID(),
            role: m.role as 'user' | 'assistant',
            content: m.content,
            timestamp: new Date(),
            savedTo: m.savedTo ?? undefined,
            agentSteps: m.agentSteps ?? undefined
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
        // Reset ALL transient state — clean slate for the loaded conversation
        return {
          ...initial,
          conversationId: id,
          messages: mapped,
        }
      })
      return lastSavedTo
    },

    removeLastMessage() {
      update(s => {
        const msgs = [...s.messages]
        if (msgs.length > 0 && msgs[msgs.length - 1].role === 'assistant') {
          msgs.pop()
        }
        return { ...s, messages: msgs }
      })
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
