<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { filterCommands, type Command } from '$lib/utils/commandList'

  export let query: string = ''

  const dispatch = createEventDispatcher<{ select: Command }>()

  $: filtered = filterCommands(query.replace(/^\//, ''))

  const categoryColors: Record<string, string> = {
    Content:  'var(--accent-light)',
    Strategy: 'var(--gold)',
    Research: 'var(--color-info)',
    Analysis: 'var(--color-success)',
    Email:    'var(--color-warning)',
    Setup:    'var(--text-muted)',
    Publish:  'var(--text-secondary)'
  }
</script>

<div
  class="absolute bottom-full mb-2 left-0 right-0 rounded-xl overflow-hidden z-50"
  style="background: var(--bg-elevated); border: 1px solid var(--border-strong); box-shadow: var(--shadow-lg); max-height: 320px; overflow-y: auto"
>
  {#each filtered as cmd}
    <button
      on:click={() => dispatch('select', cmd)}
      class="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[--bg-glass-hover] focus:bg-[--bg-glass-hover] outline-none"
    >
      <span class="font-mono text-sm font-semibold shrink-0" style="color: {categoryColors[cmd.category] ?? 'var(--accent-light)'}">
        {cmd.name}
      </span>
      <span class="text-xs flex-1 truncate" style="color: var(--text-muted)">{cmd.description}</span>
      {#if cmd.args}
        <span class="text-xs font-mono shrink-0" style="color: var(--text-faint)">{cmd.args}</span>
      {/if}
    </button>
  {/each}

  {#if filtered.length === 0}
    <div class="px-4 py-3 text-sm" style="color: var(--text-muted)">No commands match "{query}"</div>
  {/if}
</div>
