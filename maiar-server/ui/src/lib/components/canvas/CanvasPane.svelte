<script lang="ts">
  import { chat } from '$lib/stores/chat'
  import { assets } from '$lib/api/client'
  import MarkdownRenderer from '$lib/components/chat/MarkdownRenderer.svelte'
  import Spinner from '$lib/components/ui/Spinner.svelte'

  let editContent = ''
  let textareaEl: HTMLTextAreaElement
  let saveStatus: 'idle' | 'saving' | 'saved' = 'idle'
  let saveTimer: ReturnType<typeof setTimeout>

  // Sync editContent when canvasContent changes (on open or file load)
  $: if ($chat.canvasContent !== undefined) {
    editContent = $chat.canvasContent
  }

  $: wordCount = editContent.trim()
    ? editContent.trim().split(/\s+/).filter(Boolean).length
    : 0

  $: savedPath = $chat.canvasSavedTo
  $: filename = savedPath?.split('/').at(-1) ?? ''
  $: folder = savedPath?.split('/')[0] ?? 'drafts'

  function scheduleSave() {
    clearTimeout(saveTimer)
    saveStatus = 'saving'
    saveTimer = setTimeout(async () => {
      if (!savedPath || !filename) return
      try {
        await assets.update(folder, filename, editContent)
        // Update the store so restoring this conversation later gets the latest content
        chat.restoreCanvas(editContent, savedPath)
        saveStatus = 'saved'
        setTimeout(() => { saveStatus = 'idle' }, 2000)
      } catch {
        saveStatus = 'idle'
      }
    }, 500)
  }

  function handleInput() {
    scheduleSave()
  }

  // Toolbar: insert markdown syntax at cursor position
  function insertMarkdown(before: string, after = '', placeholder = 'text') {
    if (!textareaEl) return
    const start = textareaEl.selectionStart
    const end = textareaEl.selectionEnd
    const selected = editContent.slice(start, end) || placeholder
    const inserted = before + selected + after
    editContent = editContent.slice(0, start) + inserted + editContent.slice(end)
    // Restore cursor after reactivity settles
    requestAnimationFrame(() => {
      textareaEl.focus()
      const newStart = start + before.length
      const newEnd = newStart + selected.length
      textareaEl.setSelectionRange(newStart, newEnd)
    })
    scheduleSave()
  }

  function insertLinePrefix(prefix: string) {
    if (!textareaEl) return
    const start = textareaEl.selectionStart
    const lineStart = editContent.lastIndexOf('\n', start - 1) + 1
    editContent = editContent.slice(0, lineStart) + prefix + editContent.slice(lineStart)
    requestAnimationFrame(() => {
      textareaEl.focus()
      const newPos = start + prefix.length
      textareaEl.setSelectionRange(newPos, newPos)
    })
    scheduleSave()
  }

  async function copyContent() {
    try { await navigator.clipboard.writeText(editContent) } catch {}
  }
</script>

<div class="flex flex-col h-full" style="background: var(--bg-surface)">
  <!-- Header -->
  <div
    class="flex items-center justify-between px-4 py-2.5 shrink-0"
    style="border-bottom: 1px solid var(--border-subtle)"
  >
    <div class="flex items-center gap-2">
      <span class="text-sm font-semibold truncate max-w-[180px]" style="color: var(--text-primary)" title={filename}>
        {filename || 'Draft'}
      </span>
      {#if wordCount > 0}
        <span class="px-2 py-0.5 rounded-full text-xs" style="background: var(--bg-elevated); color: var(--text-muted)">
          {wordCount}w
        </span>
      {/if}
      {#if saveStatus === 'saving'}
        <span class="text-xs" style="color: var(--text-faint)">Saving…</span>
      {:else if saveStatus === 'saved'}
        <span class="text-xs" style="color: var(--color-success)">✓ Saved</span>
      {/if}
    </div>

    <div class="flex items-center gap-1">
      {#if editContent}
        <button
          on:click={copyContent}
          title="Copy content"
          class="px-2.5 py-1 rounded-lg text-xs transition-colors hover:bg-[--bg-elevated]"
          style="color: var(--text-muted)"
        >Copy</button>
      {/if}
      <button
        on:click={() => chat.closeCanvas()}
        title="Close"
        class="w-7 h-7 flex items-center justify-center rounded-lg text-base transition-colors hover:bg-[--bg-elevated]"
        style="color: var(--text-muted)"
      >✕</button>
    </div>
  </div>

  <!-- Toolbar -->
  {#if !$chat.streaming && editContent}
    <div
      class="flex items-center gap-0.5 px-3 py-1.5 shrink-0"
      style="border-bottom: 1px solid var(--border-subtle)"
    >
      {#each [
        { label: 'B', title: 'Bold', action: () => insertMarkdown('**', '**', 'bold text'), style: 'font-weight:700' },
        { label: 'I', title: 'Italic', action: () => insertMarkdown('*', '*', 'italic text'), style: 'font-style:italic' },
        { label: 'H1', title: 'Heading 1', action: () => insertLinePrefix('# '), style: '' },
        { label: 'H2', title: 'Heading 2', action: () => insertLinePrefix('## '), style: '' },
        { label: '❝', title: 'Blockquote', action: () => insertLinePrefix('> '), style: '' },
        { label: '🔗', title: 'Link', action: () => insertMarkdown('[', '](url)', 'link text'), style: '' },
      ] as tool}
        <button
          on:click={tool.action}
          title={tool.title}
          class="px-2 py-1 rounded text-xs transition-colors hover:bg-[--bg-elevated]"
          style="color: var(--text-secondary); {tool.style}"
        >
          {tool.label}
        </button>
      {/each}
    </div>
  {/if}

  <!-- Body: split editor -->
  <div class="flex-1 flex overflow-hidden">
    {#if $chat.streaming && !editContent}
      <!-- Streaming: show skeleton in canvas area -->
      <div class="flex-1 flex flex-col items-center justify-center gap-3">
        <Spinner />
        <p class="text-xs" style="color: var(--text-faint)">Generating draft…</p>
      </div>
    {:else if editContent}
      <!-- Split pane: editor left, preview right -->
      <div class="flex-1 flex overflow-hidden" style="min-width:0">
        <!-- Editor -->
        <div class="flex-1 flex flex-col overflow-hidden" style="border-right: 1px solid var(--border-subtle); min-width:0">
          <div class="px-3 py-1.5 text-xs shrink-0" style="color: var(--text-faint); border-bottom: 1px solid var(--border-subtle)">
            Markdown
          </div>
          <textarea
            bind:this={textareaEl}
            bind:value={editContent}
            on:input={handleInput}
            class="flex-1 w-full resize-none p-4 text-sm font-mono focus:outline-none"
            style="background: transparent; color: var(--text-primary); line-height: 1.6; caret-color: var(--accent)"
            spellcheck="true"
            placeholder="Start writing…"
          ></textarea>
        </div>

        <!-- Preview -->
        <div class="flex-1 flex flex-col overflow-hidden" style="min-width:0">
          <div class="px-3 py-1.5 text-xs shrink-0" style="color: var(--text-faint); border-bottom: 1px solid var(--border-subtle)">
            Preview
          </div>
          <div class="flex-1 overflow-y-auto px-5 py-4">
            <div class="markdown" style="font-size: 0.875rem; line-height: 1.7">
              <MarkdownRenderer content={editContent} />
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="flex-1 flex items-center justify-center">
        <p class="text-sm" style="color: var(--text-faint)">No content loaded</p>
      </div>
    {/if}
  </div>

  <!-- Footer -->
  {#if savedPath && !$chat.streaming}
    <div
      class="flex items-center justify-between px-4 py-2.5 shrink-0 text-xs"
      style="border-top: 1px solid var(--border-subtle); color: var(--text-muted)"
    >
      <span style="color: var(--color-success)">✓ {savedPath}</span>
      <a
        href="/assets/drafts"
        class="transition-colors hover:underline"
        style="color: var(--accent-light)"
      >
        Open in Library →
      </a>
    </div>
  {/if}
</div>
