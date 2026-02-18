<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { ChoiceSet, Choice } from '$lib/stores/chat'
  import { PenLine, Mail, Share2, Target, Search, BarChart3, Lightbulb, Megaphone, FileText, Zap } from 'lucide-svelte'

  export let choiceSet: ChoiceSet

  const dispatch = createEventDispatcher<{ select: Choice }>()

  // Icon mapping for common choice icons
  const ICON_MAP: Record<string, any> = {
    'pen-line': PenLine,
    'mail': Mail,
    'share': Share2,
    'target': Target,
    'search': Search,
    'bar-chart': BarChart3,
    'lightbulb': Lightbulb,
    'megaphone': Megaphone,
    'file-text': FileText,
    'zap': Zap
  }

  function getIcon(iconName?: string) {
    if (!iconName) return null
    return ICON_MAP[iconName] ?? null
  }
</script>

<div class="flex flex-col gap-3 mb-4 max-w-lg">
  {#if choiceSet.prompt}
    <p class="text-sm font-medium" style="color: var(--text-primary)">{choiceSet.prompt}</p>
  {/if}

  {#if choiceSet.layout === 'cards'}
    <div class="grid grid-cols-2 gap-2">
      {#each choiceSet.choices as choice}
        {@const IconComponent = getIcon(choice.icon)}
        <button
          on:click={() => dispatch('select', choice)}
          class="px-3.5 py-3 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
          style="background: var(--bg-elevated); border: 1px solid var(--border-subtle); color: var(--text-secondary)"
        >
          <div class="flex items-center gap-2 mb-1.5">
            {#if IconComponent}
              <svelte:component this={IconComponent} size={14} style="color: var(--accent-light)" />
            {/if}
            <span class="text-xs font-semibold" style="color: var(--text-primary)">{choice.label}</span>
          </div>
          {#if choice.description}
            <div class="text-[11px]" style="color: var(--text-muted)">{choice.description}</div>
          {/if}
        </button>
      {/each}
    </div>

  {:else if choiceSet.layout === 'buttons'}
    <div class="flex gap-2 flex-wrap">
      {#each choiceSet.choices as choice}
        <button
          on:click={() => dispatch('select', choice)}
          class="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          style="background: var(--accent-muted); border: 1px solid var(--accent); color: var(--accent-light)"
        >
          {choice.label}
        </button>
      {/each}
    </div>

  {:else}
    <!-- list layout -->
    <div class="flex flex-col gap-1.5">
      {#each choiceSet.choices as choice}
        <button
          on:click={() => dispatch('select', choice)}
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
          style="background: var(--bg-elevated); border: 1px solid var(--border-subtle); color: var(--text-secondary)"
        >
          {#if getIcon(choice.icon)}
            <svelte:component this={getIcon(choice.icon)} size={14} style="color: var(--accent-light)" />
          {/if}
          <div>
            <span class="text-xs font-semibold" style="color: var(--text-primary)">{choice.label}</span>
            {#if choice.description}
              <span class="text-[11px] ml-1.5" style="color: var(--text-muted)">— {choice.description}</span>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>
