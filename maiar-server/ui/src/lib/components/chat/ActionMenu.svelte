<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { COMMANDS, CATEGORY_ICONS, filterCommands } from '$lib/utils/commandList'
  import type { Command } from '$lib/utils/commandList'
  import { Bot } from 'lucide-svelte'

  export let visible = false

  const dispatch = createEventDispatcher<{ select: Command; close: void }>()

  let searchQuery = ''
  let highlightIndex = 0
  let searchInput: HTMLInputElement

  $: filtered = filterCommands(searchQuery)
  $: grouped = groupByCategory(filtered)
  $: flatList = filtered
  $: if (searchQuery) highlightIndex = 0

  function groupByCategory(cmds: Command[]): Record<string, Command[]> {
    const groups: Record<string, Command[]> = {}
    for (const cmd of cmds) {
      if (!groups[cmd.category]) groups[cmd.category] = []
      groups[cmd.category].push(cmd)
    }
    return groups
  }

  function selectCommand(cmd: Command) {
    dispatch('select', cmd)
    searchQuery = ''
    visible = false
  }

  export function focusSearch() {
    searchQuery = ''
    highlightIndex = 0
    setTimeout(() => searchInput?.focus(), 10)
  }

  export function moveUp() {
    highlightIndex = Math.max(0, highlightIndex - 1)
  }

  export function moveDown() {
    highlightIndex = Math.min(flatList.length - 1, highlightIndex + 1)
  }

  export function selectCurrent() {
    if (flatList[highlightIndex]) {
      selectCommand(flatList[highlightIndex])
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      moveDown()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      moveUp()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      selectCurrent()
    } else if (e.key === 'Escape') {
      dispatch('close')
    }
  }
</script>

{#if visible}
  <!-- Backdrop -->
  <button
    class="fixed inset-0 z-40"
    on:click={() => dispatch('close')}
    tabindex="-1"
    aria-label="Close menu"
  ></button>

  <div
    class="absolute bottom-full left-0 right-0 mb-2 z-50 rounded-2xl overflow-hidden"
    style="background: var(--bg-glass); backdrop-filter: blur(16px); border: 1px solid var(--border); box-shadow: 0 8px 32px rgba(0,0,0,0.3); max-height: 420px"
  >
    <!-- Search bar -->
    <div class="px-4 pt-3 pb-2" style="border-bottom: 1px solid var(--border-subtle)">
      <input
        bind:this={searchInput}
        bind:value={searchQuery}
        on:keydown={handleKeydown}
        type="text"
        placeholder="Search actions..."
        class="w-full px-3 py-2 rounded-lg text-sm outline-none"
        style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
      />
    </div>

    <!-- Command grid -->
    <div class="overflow-y-auto p-3" style="max-height: 360px">
      {#each Object.entries(grouped) as [category, cmds]}
        <div class="mb-3">
          <div class="flex items-center gap-1.5 px-1 mb-1.5">
            <span class="text-[10px] font-semibold uppercase tracking-wider" style="color: var(--accent-light)">{category}</span>
          </div>
          <div class="space-y-0.5">
            {#each cmds as cmd}
              {@const idx = flatList.indexOf(cmd)}
              <button
                on:click={() => selectCommand(cmd)}
                class="w-full text-left px-3 py-2.5 rounded-xl flex items-start gap-3 transition-all"
                style="
                  background: {idx === highlightIndex ? 'var(--bg-elevated)' : 'transparent'};
                  color: var(--text-primary);
                "
                on:mouseenter={() => highlightIndex = idx}
              >
                <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style="background: var(--accent-muted)"
                >
                  <span class="text-xs" style="color: var(--accent-light)">{cmd.displayName.charAt(0)}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium">{cmd.displayName}</span>
                  </div>
                  <p class="text-xs mt-0.5 truncate" style="color: var(--text-muted)">{cmd.description}</p>
                  {#if cmd.agents.length > 0}
                    <div class="flex gap-1 flex-wrap mt-1.5">
                      {#each cmd.agents as agent}
                        <span
                          class="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full"
                          style="background: var(--accent-muted); color: var(--accent-light)"
                        >
                          <Bot size={8} />
                          {agent}
                        </span>
                      {/each}
                    </div>
                  {/if}
                </div>
              </button>
            {/each}
          </div>
        </div>
      {/each}

      {#if filtered.length === 0}
        <div class="text-center py-6 text-sm" style="color: var(--text-muted)">No matching actions</div>
      {/if}
    </div>
  </div>
{/if}
