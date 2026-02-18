<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { PenLine, Target, Search, BarChart3, Settings, Lightbulb, Compass, Megaphone, Mail, Share2 } from 'lucide-svelte'

  export let icon: string = 'pen-line'
  export let label: string
  export let description: string = ''
  export let size: 'normal' | 'small' = 'normal'

  const dispatch = createEventDispatcher<{ click: void }>()

  const ICON_MAP: Record<string, any> = {
    'pen-line': PenLine,
    'target': Target,
    'search': Search,
    'bar-chart': BarChart3,
    'settings': Settings,
    'lightbulb': Lightbulb,
    'compass': Compass,
    'megaphone': Megaphone,
    'mail': Mail,
    'share-2': Share2
  }

  $: IconComponent = ICON_MAP[icon] ?? PenLine
</script>

{#if size === 'small'}
  <button
    on:click={() => dispatch('click')}
    class="px-3 py-2.5 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
    style="background: var(--bg-elevated); border: 1px solid var(--border-subtle); color: var(--text-secondary)"
  >
    <span class="text-xs">{label}</span>
  </button>
{:else}
  <button
    on:click={() => dispatch('click')}
    class="px-4 py-4 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col gap-2"
    style="background: var(--bg-elevated); border: 1px solid var(--border-subtle)"
  >
    <div
      class="w-8 h-8 rounded-lg flex items-center justify-center"
      style="background: var(--accent-muted); color: var(--accent-light)"
    >
      <svelte:component this={IconComponent} size={16} />
    </div>
    <div>
      <div class="text-sm font-medium" style="color: var(--text-primary)">{label}</div>
      {#if description}
        <div class="text-xs mt-0.5" style="color: var(--text-muted)">{description}</div>
      {/if}
    </div>
  </button>
{/if}
