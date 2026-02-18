<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { page } from '$app/stores'
  import { chat } from '$lib/stores/chat'
  import { user, botDisplayName, botPersonalityText } from '$lib/stores/auth'
  import { streamChat, conversations, assets, context, assetRecords } from '$lib/api/client'
  import ContextBar from './ContextBar.svelte'
  import MessageBubble from './MessageBubble.svelte'
  import StreamingCursor from './StreamingCursor.svelte'
  import ChatInput from './ChatInput.svelte'
  import MarkdownRenderer from './MarkdownRenderer.svelte'
  import Spinner from '$lib/components/ui/Spinner.svelte'
  import OnboardingFlow from '$lib/components/onboarding/OnboardingFlow.svelte'
  import CanvasPane from '$lib/components/canvas/CanvasPane.svelte'
  import ThinkingIndicator from './ThinkingIndicator.svelte'
  import AgentActivityPanel from './AgentActivityPanel.svelte'
  import ActionCard from './ActionCard.svelte'
  import ChoiceCards from './ChoiceCards.svelte'
  import type { Choice } from '$lib/stores/chat'
  import { FileText, Layers, ChevronDown } from 'lucide-svelte'
  import WizardIcon from '$lib/components/ui/WizardIcon.svelte'

  let scrollEl: HTMLElement
  let convList: any[] = []
  let contentCommand = false
  let activeCampaignId: string | null = null
  let prefillValue = ''
  let showScrollButton = false
  // Linked assets for current conversation
  let linkedAssets: any[] = []

  async function loadLinkedAssets(conversationId: string) {
    try {
      linkedAssets = await assetRecords.list({ conversationId })
    } catch {
      linkedAssets = []
    }
  }

  // Conversation rename state
  let renamingConvId: string | null = null
  let renameValue = ''

  function startRenameConv(conv: any) {
    renamingConvId = conv.id
    renameValue = conv.title
  }

  async function confirmRenameConv() {
    if (!renamingConvId || !renameValue.trim()) {
      renamingConvId = null
      return
    }
    try {
      await conversations.rename(renamingConvId, renameValue.trim())
      const conv = convList.find(c => c.id === renamingConvId)
      if (conv) conv.title = renameValue.trim()
      convList = [...convList]
    } catch {}
    renamingConvId = null
  }

  // Context readiness check
  let contextReady: boolean | null = null

  async function checkContext() {
    try {
      const { ready } = await context.status()
      contextReady = ready
    } catch {
      contextReady = true // fail open
    }
  }

  // Static action cards — natural language, routed by intent classification
  const ACTION_CARDS: Array<{ icon: string; label: string; description: string; message: string }> = [
    { icon: 'pen-line',  label: 'Write Content',     description: 'Blog posts, landing pages, case studies', message: 'Write a blog post about reducing churn' },
    { icon: 'lightbulb', label: 'Brainstorm Ideas',   description: 'Campaign ideas, growth tactics',          message: 'Brainstorm ideas to increase trial conversion' },
    { icon: 'target',    label: 'Plan a Campaign',    description: 'Multi-channel campaign strategy',         message: 'Plan a product launch campaign for Q3' },
    { icon: 'search',    label: 'Research a Topic',   description: 'SEO briefs, market research',             message: 'Research competitor SEO strategies' },
    { icon: 'megaphone', label: 'Create Ads',         description: 'Google, Meta, LinkedIn ad copy',          message: 'Write a Meta retargeting ad campaign' },
    { icon: 'compass',   label: 'Build a Strategy',   description: 'Content, email, social, SEO plans',       message: 'Create a content marketing strategy for 2026' },
  ]

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
      // Load linked assets for this conversation
      loadLinkedAssets(id)
    } catch {}
  }

  // Scroll detection for scroll-to-bottom button
  function handleScroll() {
    if (!scrollEl) return
    const distFromBottom = scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight
    showScrollButton = distFromBottom > 200
  }

  function scrollToBottom() {
    scrollEl?.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' })
  }

  // Regenerate last assistant response
  async function handleRegenerate() {
    // Find the last user message
    const messages = [...$chat.messages]
    const lastAssistantIdx = messages.length - 1
    if (lastAssistantIdx < 0 || messages[lastAssistantIdx].role !== 'assistant') return
    const lastUserMsg = messages.findLast(m => m.role === 'user')
    if (!lastUserMsg) return

    chat.removeLastMessage()
    // Re-send the last user message
    await doSend(lastUserMsg.content)
  }

  async function handleSubmit(e: CustomEvent<{ message: string; images?: Array<{ base64: string; mediaType: string }> }>) {
    const { message, images } = e.detail
    await doSend(message, images)
  }

  function handleChoiceSelect(e: CustomEvent<Choice>) {
    const choice = e.detail
    chat.clearChoices()
    // Populate the input with the choice label so user can add context before sending
    prefillValue = choice.label
  }

  async function doSend(message: string, images?: Array<{ base64: string; mediaType: string }>) {
    // Build history BEFORE adding the new user message (getHistory substitutes savedTo refs)
    const history = chat.getHistory()

    chat.addUserMessage(message)
    const abortController = chat.startStreaming()
    contentCommand = false

    await tick()
    scrollEl?.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' })

    try {
      for await (const event of streamChat(message, history, $chat.conversationId, activeCampaignId, abortController.signal, images)) {
        if (abortController.signal.aborted) break
        if (event.type !== 'delta') console.log('[chat] Event:', event.type, event)
        if (event.type === 'delta') {
          const target = event.target ?? 'chat'
          chat.appendDelta(event.text, target)
          // Auto-open canvas on first canvas-targeted delta
          if (target === 'canvas' && !$chat.canvasVisible) {
            chat.openCanvas()
          }
          // Debounced auto-scroll — only when user is near bottom
          if (!showScrollButton && scrollEl) {
            requestAnimationFrame(() => {
              scrollEl?.scrollTo({ top: scrollEl.scrollHeight })
            })
          }
        } else if (event.type === 'content_start') {
          contentCommand = true
          chat.openCanvas()
        } else if (event.type === 'agent_chain') {
          chat.setAgentChain(event.agents, event.skills)
        } else if (event.type === 'agent_step') {
          chat.setActiveAgent({ name: event.name, agentSlug: event.agentSlug })
        } else if (event.type === 'choices') {
          chat.setChoices({ prompt: event.prompt, layout: event.layout, choices: event.choices })
        } else if (event.type === 'canvas_clear') {
          chat.clearCanvas()
        } else if (event.type === 'content_detected') {
          chat.openCanvas()
        } else if (event.type === 'done') {
          chat.finishStreaming({
            inputTokens: event.inputTokens,
            outputTokens: event.outputTokens,
            savedTo: event.savedTo,
            assetTitle: event.assetTitle,
            campaignTitle: event.campaignTitle,
            conversationId: event.conversationId,
            agentSteps: event.agentSteps
          })
          loadConversations()
          // Open canvas after streaming completes — fetch file from disk
          if (event.savedTo) {
            console.log('[chat] Canvas restore from savedTo:', event.savedTo)
            const parts = event.savedTo.split('/')
            const folder = parts[0]
            const filename = parts.slice(1).join('/')
            try {
              const { content } = await assets.get(folder, filename) as any
              chat.restoreCanvas(content, event.savedTo)
            } catch (e) {
              console.error('[chat] Canvas fetch failed:', e)
            }
          }
        } else if (event.type === 'conversation_id') {
          chat.setConversationId(event.id)
          activeCampaignId = null // clear after conversation is created
        } else if (event.type === 'error') {
          throw new Error(event.message)
        }
      }

      // Safety net: if stream ended without a done event, unblock the UI
      if ($chat.streaming) {
        console.warn('[chat] Stream ended without done event — forcing finishStreaming')
        chat.finishStreaming({ inputTokens: 0, outputTokens: 0 })
        if (contentCommand) chat.closeCanvas()
      }
    } catch (err: any) {
      // AbortError is expected when user stops generation
      if (err?.name === 'AbortError' || abortController.signal.aborted) {
        chat.finishStreaming({ inputTokens: 0, outputTokens: 0 })
      } else {
        chat.finishStreaming({ inputTokens: 0, outputTokens: 0 })
        if (contentCommand) chat.closeCanvas()
        console.error('[chat] Stream error:', err)
      }
    }

    await tick()
    scrollEl?.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' })
  }

  onMount(() => {
    loadConversations()
    checkContext()

    // Read query params for campaign linking and chat prefill
    const params = $page.url.searchParams
    if (params.get('campaignId')) activeCampaignId = params.get('campaignId')
    if (params.get('prefill')) prefillValue = params.get('prefill') ?? ''
  })
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
        {#if renamingConvId === conv.id}
          <div class="px-2 py-1">
            <input
              bind:value={renameValue}
              on:keydown={(e) => {
                if (e.key === 'Enter') confirmRenameConv()
                if (e.key === 'Escape') renamingConvId = null
              }}
              on:blur={confirmRenameConv}
              class="w-full px-2 py-1.5 rounded text-xs outline-none"
              style="background: var(--bg-input); border: 1px solid var(--accent); color: var(--text-primary)"
              autofocus
            />
          </div>
        {:else}
          <button
            on:click={() => loadConversation(conv.id, conv.canvasPath)}
            on:dblclick|stopPropagation={() => startRenameConv(conv)}
            class="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors hover:bg-[--bg-glass-hover] flex items-center gap-1.5"
            style="color: var(--text-secondary)"
            title="{conv.title} (double-click to rename)"
          >
            {#if conv.hasSavedContent}
              <FileText size={11} style="color: var(--accent-light); flex-shrink: 0" />
            {/if}
            <span class="truncate">{conv.title}</span>
          </button>
        {/if}
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
      <div bind:this={scrollEl} class="flex-1 overflow-y-auto px-6 py-4 relative" on:scroll={handleScroll}>
        {#if $chat.messages.length === 0}
          {#if contextReady === null}
            <div class="flex items-center justify-center h-full"><Spinner /></div>
          {:else if !contextReady}
            <OnboardingFlow on:start={(e) => doSend(e.detail)} />
          {:else}
            <div class="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center"
                style="background: var(--accent-muted); border: 1px solid var(--border); color: var(--accent-light)"
              >
                <WizardIcon size={28} />
              </div>
              <div>
                <p class="font-semibold mb-1" style="color: var(--text-primary)">Hi, I'm {$botDisplayName}</p>
                <p class="text-sm font-decorative" style="color: var(--text-muted)">
                  {$botPersonalityText ? $botPersonalityText : 'Your marketing assistant, ready to help.'}
                </p>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2 max-w-xl w-full">
                {#each ACTION_CARDS as card}
                  <ActionCard
                    icon={card.icon}
                    label={card.label}
                    description={card.description}
                    on:click={() => doSend(card.message)}
                  />
                {/each}
              </div>
            </div>
          {/if}
        {:else}
          {#each $chat.messages as message, i}
            <MessageBubble
              {message}
              streaming={$chat.streaming && i === $chat.messages.length - 1 && message.role === 'assistant'}
              isLast={i === $chat.messages.length - 1 && message.role === 'assistant' && !$chat.streaming}
              on:regenerate={handleRegenerate}
            />
          {/each}

          {#if $chat.streaming && $chat.messages[$chat.messages.length - 1]?.role === 'user'}
            <div class="flex justify-start mb-4">
              {#if contentCommand}
                <!-- Content command: compact indicator (content streams to canvas) -->
                <div class="flex flex-col gap-1.5">
                  <div class="px-4 py-3 glass rounded-2xl rounded-tl-sm flex items-center gap-3 text-sm" style="color: var(--text-muted)">
                    <FileText size={16} style="color: var(--accent-light)" />
                    <ThinkingIndicator />
                  </div>
                </div>
              {:else if $chat.streamingText}
                <!-- Regular chat: show streaming markdown -->
                <div class="max-w-[85%] flex flex-col gap-1.5">
                  <div class="px-5 py-4 rounded-2xl rounded-tl-sm glass text-sm" style="color: var(--text-primary)">
                    <MarkdownRenderer content={$chat.streamingText} />
                    <StreamingCursor />
                  </div>
                </div>
              {:else}
                <!-- Waiting for first delta -->
                <div class="px-5 py-4 glass rounded-2xl rounded-tl-sm flex items-center gap-3">
                  <ThinkingIndicator />
                </div>
              {/if}
            </div>
          {/if}

          <!-- Pending choices from server -->
          {#if $chat.pendingChoices}
            <div class="flex justify-start mb-4">
              <ChoiceCards choiceSet={$chat.pendingChoices} on:select={handleChoiceSelect} />
            </div>
          {/if}
        {/if}
      </div>

      <!-- Scroll-to-bottom button -->
      {#if showScrollButton}
        <div class="relative">
          <button
            on:click={scrollToBottom}
            class="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-110"
            style="background: var(--accent); color: white; box-shadow: var(--shadow-glow)"
            title="Scroll to bottom"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      {/if}

      <ChatInput disabled={$chat.streaming} initialValue={prefillValue} on:submit={handleSubmit} />

      {#if linkedAssets.length > 0}
        <div class="px-6 py-2 flex items-center gap-2 flex-wrap">
          <span class="text-[10px] uppercase tracking-wider font-semibold" style="color: var(--text-faint)">
            <Layers size={10} class="inline mr-0.5" />Assets
          </span>
          {#each linkedAssets as asset}
            <button
              on:click={() => {
                chat.restoreCanvas('', asset.filePath)
                const parts = asset.filePath.split('/')
                assets.get(parts[0], parts.slice(1).join('/')).then(({ content }: any) => {
                  chat.restoreCanvas(content, asset.filePath)
                }).catch(() => {})
              }}
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors"
              style="background: var(--accent-muted); color: var(--accent-light)"
              title={asset.filePath}
            >
              <FileText size={9} />
              {asset.title}
            </button>
          {/each}
        </div>
      {/if}

      <AgentActivityPanel />
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
