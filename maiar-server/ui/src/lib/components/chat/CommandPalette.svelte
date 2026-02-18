<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { filterCommands, type Command } from '$lib/utils/commandList'
  import { Bot } from 'lucide-svelte'

  export let query: string = ''

  const dispatch = createEventDispatcher<{ select: Command }>()

  let highlightIndex = 0

  $: filtered = filterCommands(query.replace(/^\//, ''))
  $: highlightIndex = Math.min(highlightIndex, Math.max(filtered.length - 1, 0))

  // Group filtered commands by category
  $: grouped = (() => {
    const groups: { category: string; commands: Command[] }[] = []
    const seen = new Set<string>()
    for (const cmd of filtered) {
      if (!seen.has(cmd.category)) {
        seen.add(cmd.category)
        groups.push({ category: cmd.category, commands: [] })
      }
      groups.find(g => g.category === cmd.category)!.commands.push(cmd)
    }
    return groups
  })()

  // Flat index for keyboard nav
  $: flatList = grouped.flatMap(g => g.commands)

  const categoryColors: Record<string, string> = {
    Content:  'var(--accent-light)',
    Strategy: 'var(--gold)',
    Research: 'var(--color-info)',
    Analysis: 'var(--color-success)',
    Email:    'var(--color-warning)',
    Setup:    'var(--text-muted)',
    Publish:  'var(--text-secondary)'
  }

  export function moveUp() {
    highlightIndex = highlightIndex > 0 ? highlightIndex - 1 : flatList.length - 1
    scrollIntoView()
  }

  export function moveDown() {
    highlightIndex = highlightIndex < flatList.length - 1 ? highlightIndex + 1 : 0
    scrollIntoView()
  }

  export function selectCurrent(): Command | null {
    return flatList[highlightIndex] ?? null
  }

  function scrollIntoView() {
    setTimeout(() => {
      const el = document.querySelector(`[data-cmd-idx="${highlightIndex}"]`)
      el?.scrollIntoView({ block: 'nearest' })
    }, 0)
  }

  let flatIdx = 0
</script>

<div
  class="absolute bottom-full mb-2 left-0 right-0 rounded-xl overflow-hidden z-50"
  style="background: var(--bg-elevated); border: 1px solid var(--border-strong); box-shadow: var(--shadow-lg); max-height: 360px; overflow-y: auto"
>
  {#each grouped as group}
    <div class="px-4 pt-2.5 pb-1">
      <span class="text-[10px] font-semibold uppercase tracking-widest" style="color: {categoryColors[group.category] ?? 'var(--text-faint)'}">
        {group.category}
      </span>
    </div>
    {#each group.commands as cmd}
      {@const idx = flatList.indexOf(cmd)}
      <button
        data-cmd-idx={idx}
        on:click={() => dispatch('select', cmd)}
        on:mouseenter={() => highlightIndex = idx}
        class="w-full flex items-start gap-3 px-4 py-2 text-left transition-colors outline-none"
        style="background: {idx === highlightIndex ? 'var(--bg-glass-hover, rgba(255,255,255,0.06))' : 'transparent'}"
      >
        <div class="flex flex-col gap-0.5 flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-mono text-sm font-semibold shrink-0" style="color: {categoryColors[group.category] ?? 'var(--accent-light)'}">
              {cmd.name}
            </span>
            {#if cmd.args}
              <span class="text-xs font-mono shrink-0" style="color: var(--text-faint)">{cmd.args}</span>
            {/if}
          </div>
          <span class="text-xs truncate" style="color: var(--text-muted)">{cmd.description}</span>
        </div>

        {#if cmd.agents.length > 0}
          <div class="flex flex-wrap gap-1 shrink-0 pt-0.5">
            {#each cmd.agents.slice(0, 2) as agent}
              <span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px]" style="background: var(--accent-muted, rgba(194,101,42,0.15)); color: var(--accent-light)">
                <Bot size={9} />
                {agent}
              </span>
            {/each}
            {#if cmd.agents.length > 2}
              <span class="text-[10px] px-1" style="color: var(--text-faint)">+{cmd.agents.length - 2}</span>
            {/if}
          </div>
        {/if}
      </button>
    {/each}
  {/each}

  {#if filtered.length === 0}
    <div class="px-4 py-3 text-sm" style="color: var(--text-muted)">No commands match "{query}"</div>
  {/if}
</div>
