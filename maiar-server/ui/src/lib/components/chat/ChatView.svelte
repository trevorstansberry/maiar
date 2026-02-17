<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { chat } from '$lib/stores/chat'
  import { user } from '$lib/stores/auth'
  import { streamChat, conversations, assets } from '$lib/api/client'
  import ContextBar from './ContextBar.svelte'
  import MessageBubble from './MessageBubble.svelte'
  import StreamingCursor from './StreamingCursor.svelte'
  import ChatInput from './ChatInput.svelte'
  import MarkdownRenderer from './MarkdownRenderer.svelte'
  import Spinner from '$lib/components/ui/Spinner.svelte'
  import OnboardingFlow from '$lib/components/onboarding/OnboardingFlow.svelte'
  import CanvasPane from '$lib/components/canvas/CanvasPane.svelte'
  import { FileText } from 'lucide-svelte'

  let scrollEl: HTMLElement
  let convList: any[] = []

  async function loadConversations() {
    try {
      convList = await conversations.list()
    } catch {}
  }

  async function loadConversation(id: string, canvasPath?: string | null) {
    try {
      const { messages } = await conversations.get(id)
      const savedTo = chat.loadConversation(id, messages)
      const pathToRestore = canvasPath ?? savedTo
      if (pathToRestore) {
        // Parse "folder/filename.md" → fetch and restore canvas
        const parts = pathToRestore.split('/')
        const folder = parts[0]
        const filename = parts.slice(1).join('/')
        try {
          const { content } = await assets.get(folder, filename) as any
          chat.restoreCanvas(content, pathToRestore)
        } catch {
          // File may have been deleted — open canvas pane without content
          chat.restoreCanvas('', pathToRestore)
        }
      } else {
        chat.closeCanvas()
      }
    } catch {}
  }

  async function handleSubmit(e: CustomEvent<string>) {
    const message = e.detail

    // Build history BEFORE adding the new user message (getHistory substitutes savedTo refs)
    const history = chat.getHistory()

    chat.addUserMessage(message)
    chat.startStreaming()

    await tick()
    scrollEl?.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' })

    try {
      for await (const event of streamChat(message, history, $chat.conversationId)) {
        if (event.type === 'delta') {
          chat.appendDelta(event.text)
          scrollEl?.scrollTo({ top: scrollEl.scrollHeight })
        } else if (event.type === 'done') {
          chat.finishStreaming({
            inputTokens: event.inputTokens,
            outputTokens: event.outputTokens,
            savedTo: event.savedTo,
            conversationId: event.conversationId
          })
          loadConversations()
          // Open canvas after streaming completes — fetch file from disk
          if (event.savedTo) {
            const parts = event.savedTo.split('/')
            const folder = parts[0]
            const filename = parts.slice(1).join('/')
            try {
              const { content } = await assets.get(folder, filename) as any
              chat.restoreCanvas(content, event.savedTo)
            } catch {}
          }
        } else if (event.type === 'conversation_id') {
          chat.setConversationId(event.id)
        } else if (event.type === 'error') {
          throw new Error(event.message)
        }
      }
    } catch (err) {
      chat.finishStreaming({ inputTokens: 0, outputTokens: 0 })
      console.error(err)
    }

    await tick()
    scrollEl?.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' })
  }

  onMount(loadConversations)
</script>

<div class="flex h-full">
  <!-- Conversation list sidebar -->
  <div class="w-56 flex flex-col shrink-0 overflow-hidden hidden lg:flex" style="border-right: 1px solid var(--border-subtle)">
    <div class="px-4 py-3 text-xs font-semibold uppercase tracking-wider" style="color: var(--text-faint); border-bottom: 1px solid var(--border-subtle)">
      History
    </div>
    <div class="flex-1 overflow-y-auto p-2 space-y-0.5">
      <button
        on:click={() => chat.clear()}
        class="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors hover:bg-[--bg-glass-hover]"
        style="color: var(--accent-light)"
      >
        + New conversation
      </button>
      {#each convList as conv}
        <button
          on:click={() => loadConversation(conv.id, conv.canvasPath)}
          class="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors hover:bg-[--bg-glass-hover] flex items-center gap-1.5"
          style="color: var(--text-secondary)"
          title={conv.title}
        >
          {#if conv.hasSavedContent}
            <FileText size={11} style="color: var(--accent-light); flex-shrink: 0" />
          {/if}
          <span class="truncate">{conv.title}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Main area: chat + optional canvas split-pane -->
  <div class="flex-1 flex overflow-hidden">
    <!-- Chat pane -->
    <div
      class="flex flex-col overflow-hidden transition-all duration-300"
      style="width: {$chat.canvasVisible ? '45%' : '100%'}"
    >
      <ContextBar />

      <!-- Messages -->
      <div bind:this={scrollEl} class="flex-1 overflow-y-auto px-6 py-4">
        {#if $chat.messages.length === 0}
          {#if $user?.role !== 'admin' && !$user?.onboardingComplete}
            <OnboardingFlow on:start={(e) => handleSubmit({ detail: e.detail } as any)} />
          {:else}
            <div class="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center"
                style="background: var(--accent-muted); border: 1px solid var(--border)"
              >
                <span style="font-size: 1.75rem">✦</span>
              </div>
              <div>
                <p class="font-semibold mb-1" style="color: var(--text-primary)">Welcome to Maiar</p>
                <p class="text-sm" style="color: var(--text-muted)">Type a message or use / to pick a command</p>
              </div>

              <div class="grid grid-cols-3 gap-2 mt-2 max-w-lg">
                {#each ['/write blog post', '/ideas reduce churn', '/social linkedin'] as suggestion}
                  <button
                    on:click={() => handleSubmit({ detail: suggestion } as any)}
                    class="px-3 py-2 rounded-lg text-xs text-left transition-all hover:scale-[1.02]"
                    style="background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text-secondary)"
                  >
                    <span style="color: var(--accent-light)">{suggestion.split(' ')[0]}</span>
                    {suggestion.split(' ').slice(1).join(' ')}
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        {:else}
          {#each $chat.messages as message, i}
            <MessageBubble {message} streaming={$chat.streaming && i === $chat.messages.length - 1 && message.role === 'assistant'} />
          {/each}

          {#if $chat.streaming && $chat.streamingText && $chat.messages[$chat.messages.length - 1]?.role === 'user'}
            <div class="flex justify-start mb-4">
              <div class="max-w-[85%] px-5 py-4 rounded-2xl rounded-tl-sm glass text-sm" style="color: var(--text-primary)">
                <MarkdownRenderer content={$chat.streamingText} />
                <StreamingCursor />
              </div>
            </div>
          {:else if $chat.streaming && !$chat.streamingText}
            <div class="flex justify-start mb-4">
              <div class="px-5 py-4 glass rounded-2xl rounded-tl-sm">
                <Spinner size="sm" />
              </div>
            </div>
          {/if}
        {/if}
      </div>

      <ChatInput disabled={$chat.streaming} on:submit={handleSubmit} />
    </div>

    <!-- Canvas pane (slides in when a content command is active) -->
    {#if $chat.canvasVisible}
      <div
        class="flex-1 overflow-hidden"
        style="border-left: 1px solid var(--border); animation: slide-in-right 0.25s ease"
      >
        <CanvasPane />
      </div>
    {/if}
  </div>
</div>
