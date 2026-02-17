<script lang="ts">
  import { contextUsage, contextTokenLabel, chat } from '$lib/stores/chat'
  import { user } from '$lib/stores/auth'
</script>

<div
  class="flex items-center justify-between px-4 py-2 text-xs shrink-0"
  style="border-bottom: 1px solid var(--border-subtle); color: var(--text-muted)"
>
  <div class="flex items-center gap-3">
    <span class="font-mono px-2 py-0.5 rounded text-xs" style="background: var(--accent-muted); color: var(--accent-light)">
      {$user?.clientSlug ?? '—'}
    </span>

    <div class="flex items-center gap-2">
      <div class="w-24 h-1.5 rounded-full overflow-hidden" style="background: var(--bg-elevated)">
        <div
          class="h-full rounded-full transition-all duration-500"
          style="width: {$contextUsage}%; background: {$contextUsage > 80 ? 'var(--color-warning)' : $contextUsage > 60 ? 'var(--accent)' : 'var(--color-success)'}"
        />
      </div>
      {#if $contextTokenLabel}
        <span title="{$contextUsage}% of context window used">{$contextTokenLabel}</span>
      {:else}
        <span>Context</span>
      {/if}
    </div>
  </div>

  <button
    on:click={() => chat.clear()}
    class="px-2 py-0.5 rounded transition-colors hover:text-[--text-primary]"
    title="Start a new conversation"
  >
    New conversation
  </button>
</div>
