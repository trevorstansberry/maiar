<script lang="ts">
  import { onMount } from 'svelte'
  import { context, assets } from '$lib/api/client'
  import Badge from '$lib/components/ui/Badge.svelte'
  import Spinner from '$lib/components/ui/Spinner.svelte'
  import { BookOpen, Layout } from 'lucide-svelte'

  type ViewMode = 'context' | 'templates'
  let viewMode: ViewMode = 'context'

  let files: any = { company: [], products: [] }
  let templates: any[] = []
  let loading = true
  let loadingTemplates = false
  let selectedFile: any = null
  let fileContent = ''
  let rawMode = false
  let saving = false

  // template-specific state
  let selectedTemplate: any = null
  let templateContent = ''
  let savingTemplate = false
  let showNewTemplate = false
  let newTemplateName = ''

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

  async function loadTemplates() {
    loadingTemplates = true
    try {
      templates = await assets.list('templates')
    } catch {}
    loadingTemplates = false
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

  async function openTemplate(file: any) {
    const { content } = await assets.get('templates', file.name) as any
    templateContent = content
    selectedTemplate = file
  }

  async function saveTemplate() {
    if (!selectedTemplate) return
    savingTemplate = true
    try {
      await assets.update('templates', selectedTemplate.name, templateContent)
      loadTemplates()
    } catch {}
    savingTemplate = false
  }

  async function createTemplate() {
    if (!newTemplateName.trim()) return
    const name = newTemplateName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.md'
    try {
      await assets.save('templates', name, `# ${newTemplateName.trim()}\n\n`)
      showNewTemplate = false
      newTemplateName = ''
      await loadTemplates()
      const created = templates.find(t => t.name === name)
      if (created) openTemplate(created)
    } catch {}
  }

  function switchMode(mode: ViewMode) {
    viewMode = mode
    selectedFile = null
    selectedTemplate = null
    if (mode === 'templates' && templates.length === 0) loadTemplates()
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

      <!-- Tab switcher -->
      <div class="flex gap-1 mt-3">
        <button
          on:click={() => switchMode('context')}
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style="background: {viewMode === 'context' ? 'var(--accent-muted)' : 'transparent'}; color: {viewMode === 'context' ? 'var(--accent-light)' : 'var(--text-muted)'}"
        >
          <BookOpen size={12} />
          Context
        </button>
        <button
          on:click={() => switchMode('templates')}
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style="background: {viewMode === 'templates' ? 'var(--accent-muted)' : 'transparent'}; color: {viewMode === 'templates' ? 'var(--accent-light)' : 'var(--text-muted)'}"
        >
          <Layout size={12} />
          Templates
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-3">
      {#if viewMode === 'context'}
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

      {:else}
        <!-- Templates tab -->
        <div class="flex items-center justify-between px-2 py-1.5 mb-1">
          <span class="text-xs font-semibold uppercase tracking-wider" style="color: var(--text-faint)">Templates</span>
          <button
            on:click={() => showNewTemplate = true}
            class="text-xs px-2 py-0.5 rounded"
            style="color: var(--accent-light); background: var(--accent-muted)"
          >+ New</button>
        </div>

        {#if showNewTemplate}
          <div class="px-2 mb-2">
            <input
              bind:value={newTemplateName}
              placeholder="Template name"
              class="w-full px-2.5 py-1.5 rounded-lg text-xs outline-none mb-1"
              style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
              on:keydown={(e) => e.key === 'Enter' && createTemplate()}
            />
            <div class="flex gap-1">
              <button on:click={createTemplate} class="flex-1 py-1 rounded text-xs" style="background: var(--accent); color: white">Create</button>
              <button on:click={() => { showNewTemplate = false; newTemplateName = '' }} class="px-2 py-1 rounded text-xs" style="background: var(--bg-elevated); color: var(--text-muted)">Cancel</button>
            </div>
          </div>
        {/if}

        {#if loadingTemplates}
          <div class="flex justify-center pt-8"><Spinner /></div>
        {:else if templates.length === 0}
          <p class="text-xs px-2 py-3" style="color: var(--text-faint)">No templates yet. Create one above.</p>
        {:else}
          {#each templates as tmpl}
            <button
              on:click={() => openTemplate(tmpl)}
              class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left mb-0.5 transition-all"
              style="
                background: {selectedTemplate?.name === tmpl.name ? 'var(--accent-muted)' : 'transparent'};
                color: var(--text-secondary)
              "
            >
              <span class="text-sm truncate">{tmpl.slug.replace(/-/g, ' ')}</span>
              <span class="text-xs shrink-0 ml-1" style="color: var(--text-faint)">{tmpl.wordCount}w</span>
            </button>
          {/each}
        {/if}
      {/if}
    </div>
  </div>

  <!-- Editor panel -->
  <div class="flex-1 flex flex-col overflow-hidden">
    {#if viewMode === 'context' && selectedFile}
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

    {:else if viewMode === 'templates' && selectedTemplate}
      <div class="flex items-center justify-between px-5 py-3 shrink-0" style="border-bottom: 1px solid var(--border-subtle)">
        <div>
          <h2 class="font-semibold text-sm" style="color: var(--text-primary)">{selectedTemplate.slug.replace(/-/g, ' ')}</h2>
          <p class="text-xs" style="color: var(--text-muted)">templates/{selectedTemplate.name}</p>
        </div>
        <button
          on:click={saveTemplate}
          disabled={savingTemplate}
          class="px-4 py-1.5 rounded-lg text-sm font-medium"
          style="background: var(--accent); color: white"
        >
          {savingTemplate ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div class="flex-1 overflow-y-auto">
        <textarea
          bind:value={templateContent}
          class="w-full h-full p-6 font-mono text-sm resize-none outline-none"
          style="background: var(--bg-base); color: var(--text-primary); line-height: 1.7; min-height: 100%"
          placeholder="Write your template here..."
        />
      </div>

    {:else}
      <div class="flex flex-col items-center justify-center h-full gap-3 text-center">
        {#if viewMode === 'context'}
          <BookOpen size={32} style="color: var(--text-faint)" />
          <div>
            <p class="font-medium" style="color: var(--text-secondary)">Select a file to edit</p>
            <p class="text-sm mt-1" style="color: var(--text-muted)">Context files tell Maiar about your brand, audience, and goals</p>
          </div>
        {:else}
          <Layout size={32} style="color: var(--text-faint)" />
          <div>
            <p class="font-medium" style="color: var(--text-secondary)">Select a template to edit</p>
            <p class="text-sm mt-1" style="color: var(--text-muted)">Templates are reusable reference files — email formats, brief structures, campaign frameworks</p>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
