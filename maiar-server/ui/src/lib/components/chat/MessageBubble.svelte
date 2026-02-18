<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { Message } from '$lib/stores/chat'
  import { chat } from '$lib/stores/chat'
  import { assets } from '$lib/api/client'
  import MarkdownRenderer from './MarkdownRenderer.svelte'
  import StreamingCursor from './StreamingCursor.svelte'
  import { FileText, Bot, Columns2, ExternalLink, FolderOpen, Copy, Check, RefreshCw } from 'lucide-svelte'
  import { getCommandAgents } from '$lib/utils/commandList'

  export let message: Message
  export let streaming = false
  export let isLast = false

  const dispatch = createEventDispatcher()

  let copied = false

  async function copyMessage() {
    await navigator.clipboard.writeText(message.content)
    copied = true
    setTimeout(() => copied = false, 2000)
  }

  // For user messages: check if it's a /command and get mapped agents
  $: userAgents = message.role === 'user' ? getCommandAgents(message.content) : []

  // For saved content: derive display title and folder
  $: displayTitle = message.assetTitle || (message.savedTo ? message.savedTo.split('/').pop()?.replace(/\.md$/, '') : '')
  $: displayFolder = message.savedTo?.split('/')[0] === 'drafts' ? 'Draft' : 'Published'

  async function openInCanvas() {
    if (!message.savedTo) return
    const parts = message.savedTo.split('/')
    const folder = parts[0]
    const filename = parts.slice(1).join('/')
    try {
      const { content } = await assets.get(folder, filename) as any
      chat.restoreCanvas(content, message.savedTo!)
    } catch {
      chat.restoreCanvas('', message.savedTo!)
    }
  }
</script>

<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4 fade-in">
  {#if message.role === 'user'}
    <div class="max-w-[75%] flex flex-col items-end gap-1.5">
      <div
        class="px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm"
        style="background: var(--gold-muted); border: 1px solid rgba(245,166,35,0.2); color: var(--text-primary)"
      >
        {message.content}
      </div>

      {#if userAgents.length > 0}
        <div class="flex items-center gap-1.5 flex-wrap px-1">
          <span class="text-[10px] font-decorative" style="color: var(--text-faint)">routed to</span>
          {#each userAgents as agent}
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px]"
              style="background: var(--bg-elevated); border: 1px solid var(--border-subtle); color: var(--text-muted); border-left: 2px solid var(--border)"
            >
              <Bot size={9} />
              {agent}
            </span>
          {/each}
        </div>
      {/if}
    </div>
  {:else}
    <div class="max-w-[85%] flex flex-col gap-0">
      {#if message.savedTo}
        <!-- Rich asset card (full content lives in canvas) -->
        <div
          class="px-4 py-3.5 rounded-2xl rounded-tl-sm glass text-sm"
          style="color: var(--text-secondary)"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style="background: var(--accent-muted)"
            >
              <FileText size={16} style="color: var(--accent-light)" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-medium truncate" style="color: var(--text-primary)">{displayTitle}</span>
                <span
                  class="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
                  style="background: var(--accent-muted); color: var(--accent-light)"
                >{displayFolder}</span>
              </div>
              {#if message.campaignTitle}
                <div class="flex items-center gap-1 mb-2">
                  <FolderOpen size={10} style="color: var(--text-faint)" />
                  <a href="/campaigns" class="text-[11px] hover:underline" style="color: var(--text-muted)">{message.campaignTitle}</a>
                </div>
              {/if}
              <div class="flex items-center gap-2 mt-2">
                <button
                  on:click={openInCanvas}
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors hover:opacity-80"
                  style="background: var(--accent-muted); color: var(--accent-light)"
                >
                  <Columns2 size={10} />
                  Open in Canvas
                </button>
                <a
                  href="/creations"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors hover:opacity-80"
                  style="background: var(--bg-elevated); color: var(--text-muted); border: 1px solid var(--border-subtle)"
                >
                  <ExternalLink size={10} />
                  View in Creations
                </a>
              </div>
            </div>
          </div>
        </div>
      {:else}
        <!-- Regular chat: render full markdown -->
        <div class="relative group">
          <div
            class="px-5 py-4 rounded-2xl rounded-tl-sm glass text-sm"
            style="color: var(--text-primary)"
          >
            <MarkdownRenderer content={message.content} />
            {#if streaming}<StreamingCursor />{/if}
          </div>
          {#if !streaming}
            <button
              on:click={copyMessage}
              class="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-70 hover:!opacity-100 transition-all"
              style="background: var(--bg-elevated); color: var(--text-muted)"
              title="Copy message"
            >
              {#if copied}
                <Check size={12} style="color: var(--accent)" />
              {:else}
                <Copy size={12} />
              {/if}
            </button>
          {/if}
        </div>
      {/if}

      {#if message.role === 'assistant' && isLast && !streaming && !message.savedTo}
        <div class="flex items-center gap-1 mt-1 px-1">
          <button
            on:click={() => dispatch('regenerate')}
            class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] transition-all opacity-50 hover:opacity-100"
            style="color: var(--text-muted)"
            title="Regenerate response"
          >
            <RefreshCw size={11} />
            Regenerate
          </button>
        </div>
      {/if}

      {#if message.agentSteps?.length}
        <div class="mt-2 pt-2 px-1 flex items-center gap-1.5 flex-wrap" style="border-top: 1px solid var(--border-subtle)">
          <span class="text-[11px] font-decorative" style="color: var(--text-faint)">Powered by</span>
          {#each message.agentSteps as step}
            <span
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] uppercase tracking-wide font-semibold"
              style="background: var(--bg-elevated); border: 1px solid var(--border-subtle); color: var(--accent-light); border-left: 2px solid var(--accent)"
            >
              <Bot size={10} />
              {step.name}
            </span>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>
