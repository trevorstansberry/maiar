<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import ActionMenu from './ActionMenu.svelte'
  import { Send, Wand2, Square, Paperclip, XCircle } from 'lucide-svelte'
  import type { Command } from '$lib/utils/commandList'
  import { botDisplayName } from '$lib/stores/auth'
  import { chat } from '$lib/stores/chat'

  export let disabled = false
  export let initialValue = ''

  let value = initialValue

  // React to external initialValue changes (e.g., choice selection)
  $: if (initialValue && initialValue !== value) {
    value = initialValue
    initialValue = '' // reset after consuming
    setTimeout(() => textarea?.focus(), 0)
  }
  let textarea: HTMLTextAreaElement
  let showMenu = false
  let focused = false
  let actionMenu: ActionMenu
  let pendingImages: Array<{ file: File; preview: string }> = []
  let fileInput: HTMLInputElement

  const dispatch = createEventDispatcher<{ submit: { message: string; images?: Array<{ base64: string; mediaType: string }> } }>()

  function handleImageFile(file: File) {
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) return // 5MB limit
    const preview = URL.createObjectURL(file)
    pendingImages = [...pendingImages, { file, preview }]
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(pendingImages[index].preview)
    pendingImages = pendingImages.filter((_, i) => i !== index)
  }

  function handlePaste(e: ClipboardEvent) {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) handleImageFile(file)
        return
      }
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    const files = e.dataTransfer?.files
    if (!files) return
    for (const file of files) {
      handleImageFile(file)
    }
  }

  async function uploadImages(): Promise<Array<{ base64: string; mediaType: string }>> {
    const results: Array<{ base64: string; mediaType: string }> = []
    for (const img of pendingImages) {
      const form = new FormData()
      form.append('image', img.file)
      try {
        const res = await fetch('/api/chat/upload-image', {
          method: 'POST',
          credentials: 'include',
          body: form
        })
        if (res.ok) results.push(await res.json())
      } catch {}
    }
    return results
  }

  function handleInput() {
    // Auto-resize
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
  }

  function toggleMenu() {
    showMenu = !showMenu
    if (showMenu) {
      actionMenu?.focusSearch()
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (showMenu) {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        actionMenu?.moveUp()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        actionMenu?.moveDown()
        return
      }
      if (e.key === 'Tab' || (e.key === 'Enter' && !e.shiftKey)) {
        e.preventDefault()
        actionMenu?.selectCurrent()
        return
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
      return
    }
    if (e.key === 'Escape' && showMenu) {
      showMenu = false
    }
  }

  function handleCommandSelect(e: CustomEvent<Command>) {
    // Insert the command name into the input so user can add context
    value = e.detail.name + ' '
    showMenu = false
    textarea.focus()
    handleInput()
  }

  async function submit() {
    const message = value.trim()
    if (!message || disabled) return

    let images: Array<{ base64: string; mediaType: string }> | undefined
    if (pendingImages.length > 0) {
      images = await uploadImages()
      pendingImages.forEach(img => URL.revokeObjectURL(img.preview))
      pendingImages = []
    }

    dispatch('submit', { message, images })
    value = ''
    textarea.style.height = 'auto'
    showMenu = false
  }
</script>

<div class="relative px-4 pb-4 pt-2 shrink-0" on:dragover|preventDefault on:drop={handleDrop}>
  <ActionMenu bind:this={actionMenu} visible={showMenu} on:select={handleCommandSelect} on:close={() => showMenu = false} />

  <!-- Image previews -->
  {#if pendingImages.length > 0}
    <div class="flex gap-2 mb-2 px-1 flex-wrap">
      {#each pendingImages as img, i}
        <div class="relative w-16 h-16 rounded-lg overflow-hidden" style="border: 1px solid var(--border-subtle)">
          <img src={img.preview} alt="Upload preview" class="w-full h-full object-cover" />
          <button
            on:click={() => removeImage(i)}
            class="absolute -top-1 -right-1 rounded-full p-0.5"
            style="background: var(--bg-primary); color: var(--text-muted)"
          >
            <XCircle size={14} />
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <div
    class="flex items-end gap-2 rounded-xl px-3 py-2 transition-all duration-200"
    style="
      background: var(--bg-input);
      border-bottom: 2px solid {focused ? 'var(--accent-light)' : 'var(--border-subtle)'};
    "
  >
    <div class="flex-1 min-w-0">
      <textarea
        bind:this={textarea}
        bind:value
        on:input={handleInput}
        on:keydown={handleKeydown}
        on:paste={handlePaste}
        on:focus={() => focused = true}
        on:blur={() => focused = false}
        disabled={disabled || $chat.streaming}
        rows={1}
        placeholder={`Message ${$botDisplayName}...`}
        class="w-full resize-none bg-transparent outline-none text-sm leading-relaxed"
        style="
          color: var(--text-primary);
          max-height: 200px;
          overflow-y: auto;
        "
      ></textarea>
    </div>

    <!-- Hidden file input for images -->
    <input
      bind:this={fileInput}
      type="file"
      accept="image/jpeg,image/png,image/gif,image/webp"
      multiple
      class="hidden"
      on:change={(e) => {
        const files = e.currentTarget.files
        if (files) for (const f of files) handleImageFile(f)
        e.currentTarget.value = ''
      }}
    />

    <!-- Image upload button -->
    {#if !$chat.streaming}
      <button
        on:click={() => fileInput?.click()}
        class="p-1.5 rounded-lg transition-all duration-150 shrink-0 opacity-40 hover:opacity-80"
        style="color: var(--text-muted)"
        title="Attach image"
      >
        <Paperclip size={15} />
      </button>
    {/if}

    <!-- Action menu trigger (secondary) -->
    {#if !$chat.streaming}
      <button
        on:click={toggleMenu}
        class="p-1.5 rounded-lg transition-all duration-150 shrink-0"
        class:opacity-100={showMenu}
        class:opacity-40={!showMenu}
        style="color: var(--accent-light)"
        aria-label="Open action menu"
        title="Commands"
      >
        <Wand2 size={15} />
      </button>
    {/if}

    {#if $chat.streaming}
      <button
        on:click={() => chat.stopStreaming()}
        class="p-1.5 rounded-lg transition-all duration-150 shrink-0"
        style="background: var(--color-error, #dc2626); color: white"
        title="Stop generation"
      >
        <Square size={15} />
      </button>
    {:else}
      <button
        on:click={submit}
        disabled={(!value.trim() && pendingImages.length === 0) || disabled}
        class="p-1.5 rounded-lg transition-all duration-150 shrink-0 disabled:opacity-30"
        style="background: var(--accent); color: white; box-shadow: var(--shadow-glow)"
      >
        <Send size={15} />
      </button>
    {/if}
  </div>
</div>
