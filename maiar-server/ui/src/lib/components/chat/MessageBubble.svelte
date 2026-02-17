<script lang="ts">
  import type { Message } from '$lib/stores/chat'
  import MarkdownRenderer from './MarkdownRenderer.svelte'
  import StreamingCursor from './StreamingCursor.svelte'
  import Badge from '$lib/components/ui/Badge.svelte'

  export let message: Message
  export let streaming = false
</script>

<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4 fade-in">
  {#if message.role === 'user'}
    <div
      class="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm"
      style="background: var(--gold-muted); border: 1px solid rgba(245,166,35,0.2); color: var(--text-primary)"
    >
      {message.content}
    </div>
  {:else}
    <div class="max-w-[85%] flex flex-col gap-1.5">
      <div
        class="px-5 py-4 rounded-2xl rounded-tl-sm glass text-sm"
        style="color: var(--text-primary)"
      >
        <MarkdownRenderer content={message.content} />
        {#if streaming}<StreamingCursor />{/if}
      </div>

      {#if message.savedTo}
        <Badge variant="success" class="self-start">
          Saved → {message.savedTo}
        </Badge>
      {/if}
    </div>
  {/if}
</div>
