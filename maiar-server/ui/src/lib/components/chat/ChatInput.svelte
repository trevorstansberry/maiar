<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import CommandPalette from './CommandPalette.svelte'
  import { Send } from 'lucide-svelte'
  import type { Command } from '$lib/utils/commandList'

  export let disabled = false

  let value = ''
  let textarea: HTMLTextAreaElement
  let showPalette = false

  const dispatch = createEventDispatcher<{ submit: string }>()

  function handleInput() {
    // Auto-resize
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'

    // Show command palette on "/"
    const trimmed = value.trimStart()
    showPalette = trimmed.startsWith('/') && !trimmed.includes('\n')
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
      return
    }
    if (e.key === 'Escape') {
      showPalette = false
    }
  }

  function handleCommandSelect(e: CustomEvent<Command>) {
    value = e.detail.name + ' '
    showPalette = false
    textarea.focus()
  }

  function submit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    dispatch('submit', trimmed)
    value = ''
    textarea.style.height = 'auto'
    showPalette = false
  }
</script>

<div class="relative px-4 pb-4 pt-2 shrink-0">
  {#if showPalette}
    <CommandPalette query={value} on:select={handleCommandSelect} />
  {/if}

  <div
    class="flex items-end gap-2 rounded-xl px-3 py-2"
    style="background: var(--bg-input); border: 1px solid var(--border); box-shadow: var(--shadow-sm)"
  >
    <textarea
      bind:this={textarea}
      bind:value
      on:input={handleInput}
      on:keydown={handleKeydown}
      {disabled}
      rows={1}
      placeholder="Message Maiar... (type / for commands)"
      class="flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed"
      style="
        color: var(--text-primary);
        max-height: 200px;
        overflow-y: auto;
        placeholder-color: var(--text-faint);
      "
    />

    <button
      on:click={submit}
      disabled={!value.trim() || disabled}
      class="p-1.5 rounded-lg transition-all duration-150 shrink-0 disabled:opacity-30"
      style="background: var(--accent); color: white; box-shadow: var(--shadow-glow)"
    >
      <Send size={15} />
    </button>
  </div>

  <p class="text-center text-xs mt-1.5" style="color: var(--text-faint)">
    Enter to send · Shift+Enter for new line · / for commands
  </p>
</div>
