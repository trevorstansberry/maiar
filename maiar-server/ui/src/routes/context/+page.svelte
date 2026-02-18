<script lang="ts">
  import { onMount } from 'svelte'
  import { context } from '$lib/api/client'
  import Badge from '$lib/components/ui/Badge.svelte'
  import Spinner from '$lib/components/ui/Spinner.svelte'
  import { BookOpen } from 'lucide-svelte'

  let files: any = { company: [], products: [] }
  let loading = true
  let selectedFile: any = null
  let fileContent = ''
  let rawMode = false
  let saving = false

  const KNOWN_SCHEMAS: Record<string, string[]> = {
    'brand-voice.md':      ['Tone', 'Personality Traits', 'Messaging Pillars', 'Voice Examples'],
    'overview.md':         ['What This Product Does', 'Who It\'s For', 'Pricing', 'Differentiators', 'Proof Points'],
    'audience-profiles.md':['ICP Description', 'Buyer Personas', 'Segments'],
    'goals-kpis.md':       ['Marketing Goals', 'Key Metrics', 'Success Benchmarks'],
    'channels.md':         ['Active Channels', 'Social Handles', 'Primary Platform'],
    'competitors.md':      ['Main Competitors', 'Key Differentiators vs Competitors']
  }

  async function loadFiles() {
    loading = true
    try {
      files = await context.list()
    } catch {}
    loading = false
  }

  async function openFile(file: any) {
    const { content } = await context.getFile(file.section, file.filename) as any
    fileContent = content
    selectedFile = file
    rawMode = !KNOWN_SCHEMAS[file.filename]
  }

  async function saveFile() {
    if (!selectedFile) return
    saving = true
    try {
      await context.saveFile(selectedFile.section, selectedFile.filename, fileContent)
      loadFiles()
    } catch {}
    saving = false
  }

  const STATUS_VARIANT: Record<string, any> = {
    filled: 'success',
    partial: 'warning',
    empty: 'default'
  }

  onMount(loadFiles)
</script>

<div class="flex h-full">
  <!-- Left panel -->
  <div class="w-72 shrink-0 flex flex-col overflow-hidden" style="border-right: 1px solid var(--border-subtle)">
    <div class="px-5 py-4 shrink-0" style="border-bottom: 1px solid var(--border-subtle)">
      <h1 class="font-semibold" style="color: var(--text-primary)">Context Library</h1>
      <p class="text-xs mt-0.5" style="color: var(--text-muted)">Brand knowledge used in every request</p>
    </div>

    <div class="flex-1 overflow-y-auto p-3">
      {#if loading}
        <div class="flex justify-center pt-8"><Spinner /></div>
      {:else}
        {#if files.company.length > 0}
          <div class="px-2 py-1.5 mb-1">
            <span class="text-xs font-semibold uppercase tracking-wider" style="color: var(--text-faint)">Company</span>
          </div>
          {#each files.company as file}
            <button
              on:click={() => openFile(file)}
              class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left mb-0.5 transition-all"
              style="
                background: {selectedFile?.filename === file.filename && selectedFile?.section === file.section ? 'var(--accent-muted)' : 'transparent'};
                color: var(--text-secondary)
              "
            >
              <span class="text-sm">{file.displayName}</span>
              <Badge variant={STATUS_VARIANT[file.fillStatus]}>{file.fillStatus}</Badge>
            </button>
          {/each}
        {/if}

        {#if files.products.length > 0}
          <div class="px-2 py-1.5 mb-1 mt-3">
            <span class="text-xs font-semibold uppercase tracking-wider" style="color: var(--text-faint)">Product</span>
          </div>
          {#each files.products as file}
            <button
              on:click={() => openFile(file)}
              class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left mb-0.5 transition-all"
              style="
                background: {selectedFile?.filename === file.filename && selectedFile?.section === file.section ? 'var(--accent-muted)' : 'transparent'};
                color: var(--text-secondary)
              "
            >
              <span class="text-sm">{file.displayName}</span>
              <Badge variant={STATUS_VARIANT[file.fillStatus]}>{file.fillStatus}</Badge>
            </button>
          {/each}
        {/if}
      {/if}
    </div>
  </div>

  <!-- Editor panel -->
  <div class="flex-1 flex flex-col overflow-hidden">
    {#if selectedFile}
      <div class="flex items-center justify-between px-5 py-3 shrink-0" style="border-bottom: 1px solid var(--border-subtle)">
        <div>
          <h2 class="font-semibold text-sm" style="color: var(--text-primary)">{selectedFile.displayName}</h2>
          <p class="text-xs" style="color: var(--text-muted)">{selectedFile.section}/{selectedFile.filename}</p>
        </div>

        <div class="flex items-center gap-2">
          {#if KNOWN_SCHEMAS[selectedFile.filename]}
            <div class="flex rounded-lg overflow-hidden" style="border: 1px solid var(--border)">
              <button
                on:click={() => rawMode = false}
                class="px-3 py-1.5 text-xs transition-colors"
                style="background: {!rawMode ? 'var(--accent-muted)' : 'transparent'}; color: {!rawMode ? 'var(--accent-light)' : 'var(--text-muted)'}"
              >Form</button>
              <button
                on:click={() => rawMode = true}
                class="px-3 py-1.5 text-xs transition-colors"
                style="background: {rawMode ? 'var(--accent-muted)' : 'transparent'}; color: {rawMode ? 'var(--accent-light)' : 'var(--text-muted)'}"
              >Raw</button>
            </div>
          {/if}

          <button
            on:click={saveFile}
            disabled={saving}
            class="px-4 py-1.5 rounded-lg text-sm font-medium"
            style="background: var(--accent); color: white"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto">
        <textarea
          bind:value={fileContent}
          class="w-full h-full p-6 font-mono text-sm resize-none outline-none"
          style="background: var(--bg-base); color: var(--text-primary); line-height: 1.7; min-height: 100%"
          placeholder="Start writing..."
        />
      </div>

    {:else}
      <div class="flex flex-col items-center justify-center h-full gap-3 text-center">
        <BookOpen size={32} style="color: var(--text-faint)" />
        <div>
          <p class="font-medium" style="color: var(--text-secondary)">Select a file to edit</p>
          <p class="text-sm mt-1" style="color: var(--text-muted)">Context files tell Maiar about your brand, audience, and goals</p>
        </div>
      </div>
    {/if}
  </div>
</div>
