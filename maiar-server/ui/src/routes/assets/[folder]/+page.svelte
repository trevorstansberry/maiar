<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { assets, assetRecords } from '$lib/api/client'
  import { chat } from '$lib/stores/chat'
  import { user } from '$lib/stores/auth'
  import { formatDistanceToNow, parseISO } from 'date-fns'
  import Badge from '$lib/components/ui/Badge.svelte'
  import Spinner from '$lib/components/ui/Spinner.svelte'
  import MarkdownRenderer from '$lib/components/chat/MarkdownRenderer.svelte'
  import { FileText, Upload, Trash2, Edit2, Eye, Copy, X, Columns2, Pencil, Plus, Users, User as UserIcon } from 'lucide-svelte'

  const FOLDERS = ['drafts', 'published', 'campaigns', 'research', 'templates']
  const FOLDER_LABELS: Record<string, string> = {
    drafts: 'Drafts', published: 'Published', campaigns: 'Campaigns', research: 'Research', templates: 'Templates'
  }
  const FILTERABLE_FOLDERS = new Set(['drafts', 'published'])

  $: folder = $page.params.folder

  let files: any[] = []
  let allFiles: any[] = []
  let loading = true
  let viewMode: 'mine' | 'all' = 'mine'
  let assetMap: Map<string, any> = new Map()

  // Canvas panel state
  let panelFile: any = null
  let panelContent = ''
  let panelMode: 'preview' | 'edit' = 'preview'
  let saving = false
  let copied = false

  // Rename state
  let renamingFile: string | null = null
  let renameValue = ''
  let renamingPanel = false
  let renamePanelValue = ''

  async function loadFiles() {
    loading = true
    try {
      // Fetch disk files and DB records in parallel
      const [diskFiles, dbRecords] = await Promise.all([
        assets.list(folder),
        assetRecords.list({ folder }).catch(() => [] as any[])
      ])

      // Build map of filePath → DB record for enrichment
      assetMap = new Map()
      for (const rec of dbRecords) {
        assetMap.set(rec.filePath, rec)
      }

      allFiles = diskFiles
      applyFilter()
    } catch {}
    loading = false
  }

  function applyFilter() {
    if (!FILTERABLE_FOLDERS.has(folder) || viewMode === 'all') {
      files = allFiles
      return
    }
    // "mine" mode: show files owned by current user (or with no DB record for backward compat)
    const currentUserId = $user?.id
    files = allFiles.filter(f => {
      const rec = assetMap.get(`${folder}/${f.name}`)
      return !rec || !rec.userId || rec.userId === currentUserId
    })
  }

  async function openPanel(file: any, mode: 'preview' | 'edit' = 'preview') {
    const { content } = await assets.get(folder, file.name) as any
    panelContent = content
    panelFile = file
    panelMode = mode
    renamingPanel = false
  }

  function closePanel() {
    panelFile = null
    panelContent = ''
    renamingPanel = false
  }

  async function saveEdit() {
    if (!panelFile) return
    saving = true
    try {
      await assets.update(folder, panelFile.name, panelContent)
      panelMode = 'preview'
      loadFiles()
    } catch {}
    saving = false
  }

  async function copyContent() {
    await navigator.clipboard.writeText(panelContent)
    copied = true
    setTimeout(() => (copied = false), 2000)
  }

  async function openInCanvas(file: any) {
    const { content } = await assets.get(folder, file.name) as any
    chat.restoreCanvas(content, `${folder}/${file.name}`)
    goto('/chat')
  }

  async function moveToPublished(file: any) {
    await assets.move(folder, file.name, 'published')
    if (panelFile?.name === file.name) closePanel()
    loadFiles()
  }

  async function deleteFile(file: any) {
    if (!confirm(`Delete "${file.name}"? This cannot be undone.`)) return
    await assets.delete(folder, file.name)
    if (panelFile?.name === file.name) closePanel()
    loadFiles()
  }

  function startRename(file: any) {
    renamingFile = file.name
    renameValue = file.slug
  }

  async function confirmRename(oldName: string) {
    const newFilename = renameValue.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.md'
    if (newFilename === oldName || !renameValue.trim()) {
      renamingFile = null
      return
    }
    try {
      await assets.rename(folder, oldName, newFilename)
      if (panelFile?.name === oldName) {
        panelFile = { ...panelFile, name: newFilename, slug: newFilename.replace('.md', '') }
      }
      loadFiles()
    } catch {}
    renamingFile = null
  }

  function startPanelRename() {
    renamingPanel = true
    renamePanelValue = panelFile.slug.replace(/-/g, ' ')
  }

  async function confirmPanelRename() {
    if (!panelFile) return
    const newFilename = renamePanelValue.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.md'
    if (newFilename === panelFile.name || !renamePanelValue.trim()) {
      renamingPanel = false
      return
    }
    try {
      await assets.rename(folder, panelFile.name, newFilename)
      panelFile = { ...panelFile, name: newFilename, slug: newFilename.replace('.md', '') }
      loadFiles()
    } catch {}
    renamingPanel = false
  }

  $: wordCount = panelContent.split(/\s+/).filter(Boolean).length

  // Create new file (templates)
  let showNewFile = false
  let newFileName = ''

  async function createFile() {
    if (!newFileName.trim()) return
    const name = newFileName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.md'
    try {
      await assets.save(folder, name, `# ${newFileName.trim()}\n\n`)
      showNewFile = false
      newFileName = ''
      await loadFiles()
      const created = files.find((f: any) => f.name === name)
      if (created) openPanel(created, 'edit')
    } catch {}
  }

  $: if (folder) {
    viewMode = folder === 'published' ? 'all' : 'mine'
    loadFiles()
  }
  $: viewMode, applyFilter()
</script>

<div class="flex h-full overflow-hidden">
  <!-- Main list area -->
  <div class="flex flex-col flex-1 overflow-hidden">
    <!-- Tab bar -->
    <div class="flex items-center gap-1 px-5 pt-4 pb-0 shrink-0">
      {#each FOLDERS as f}
        <a
          href="/assets/{f}"
          class="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
          style="
            background: {folder === f ? 'var(--bg-surface)' : 'transparent'};
            color: {folder === f ? 'var(--text-primary)' : 'var(--text-muted)'};
            border: 1px solid {folder === f ? 'var(--border)' : 'transparent'};
            border-bottom: {folder === f ? '1px solid var(--bg-surface)' : '1px solid transparent'};
          "
        >
          {FOLDER_LABELS[f]}
        </a>
      {/each}
      <div class="flex-1"></div>
      {#if FILTERABLE_FOLDERS.has(folder)}
        <div class="flex rounded-lg overflow-hidden" style="border: 1px solid var(--border)">
          <button
            on:click={() => viewMode = 'mine'}
            class="flex items-center gap-1 px-2.5 py-1.5 text-xs transition-colors"
            style="background: {viewMode === 'mine' ? 'var(--accent-muted)' : 'transparent'}; color: {viewMode === 'mine' ? 'var(--accent-light)' : 'var(--text-muted)'}"
          >
            <UserIcon size={12} />
            Mine
          </button>
          <button
            on:click={() => viewMode = 'all'}
            class="flex items-center gap-1 px-2.5 py-1.5 text-xs transition-colors"
            style="background: {viewMode === 'all' ? 'var(--accent-muted)' : 'transparent'}; color: {viewMode === 'all' ? 'var(--accent-light)' : 'var(--text-muted)'}"
          >
            <Users size={12} />
            Team
          </button>
        </div>
      {/if}
      {#if folder === 'templates'}
        {#if showNewFile}
          <div class="flex items-center gap-1">
            <input
              bind:value={newFileName}
              placeholder="Template name"
              class="px-2.5 py-1.5 rounded-lg text-xs outline-none"
              style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
              on:keydown={(e) => { if (e.key === 'Enter') createFile(); if (e.key === 'Escape') { showNewFile = false; newFileName = '' } }}
              autofocus
            />
            <button on:click={createFile} class="px-2.5 py-1.5 rounded-lg text-xs font-medium" style="background: var(--accent); color: white">Create</button>
            <button on:click={() => { showNewFile = false; newFileName = '' }} class="px-2 py-1.5 rounded-lg text-xs" style="color: var(--text-muted)">Cancel</button>
          </div>
        {:else}
          <button
            on:click={() => showNewFile = true}
            class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style="background: var(--accent-muted); color: var(--accent-light)"
          >
            <Plus size={12} />
            New Template
          </button>
        {/if}
      {/if}
    </div>

    <div class="flex-1 overflow-y-auto p-5" style="background: var(--bg-surface); border-top: 1px solid var(--border)">
      {#if loading}
        <div class="flex items-center justify-center h-40"><Spinner /></div>
      {:else if files.length === 0}
        <div class="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <FileText size={32} style="color: var(--text-faint)" />
          <div>
            <p class="font-medium font-decorative" style="color: var(--text-secondary)">No files in {FOLDER_LABELS[folder]}</p>
            <p class="text-sm mt-1" style="color: var(--text-muted)">
              {folder === 'drafts' ? 'Use /write, /email, or /social to create your first draft' :
               folder === 'published' ? "Move drafts here when they're ready" :
               folder === 'campaigns' ? 'Use /campaign to build a campaign plan' :
               folder === 'templates' ? 'Create reusable templates — email formats, brief structures, campaign frameworks' :
               'Use /research or /competitor to generate research'}
            </p>
          </div>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {#each files as file}
            <div
              class="group glass rounded-xl p-4 transition-all cursor-pointer"
              style="box-shadow: var(--shadow-sm); border: 1px solid {panelFile?.name === file.name ? 'var(--accent)' : 'var(--border-subtle)'}"
              on:click={() => openPanel(file)}
              role="button"
              tabindex="0"
              on:keydown={(e) => e.key === 'Enter' && openPanel(file)}
            >
              <div class="flex items-start justify-between gap-2 mb-2">
                {#if renamingFile === file.name}
                  <input
                    bind:value={renameValue}
                    on:click|stopPropagation
                    on:keydown|stopPropagation={(e) => {
                      if (e.key === 'Enter') confirmRename(file.name)
                      if (e.key === 'Escape') renamingFile = null
                    }}
                    on:blur={() => confirmRename(file.name)}
                    class="font-medium text-sm flex-1 px-1.5 py-0.5 rounded outline-none"
                    style="background: var(--bg-input); border: 1px solid var(--accent); color: var(--text-primary)"
                    autofocus
                  />
                {:else}
                  <p class="font-medium text-sm truncate flex-1" style="color: var(--text-primary)">
                    {file.slug.replace(/-/g, ' ')}
                  </p>
                {/if}
                <Badge variant="default">{file.wordCount}w</Badge>
              </div>

              {#if file.preview}
                <p class="text-xs mb-3 line-clamp-2" style="color: var(--text-muted)">{file.preview}</p>
              {/if}

              <div class="flex items-center justify-between">
                <span class="text-xs" style="color: var(--text-faint)">
                  {formatDistanceToNow(parseISO(file.lastModified), { addSuffix: true })}
                </span>

                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    on:click|stopPropagation={() => openPanel(file, 'preview')}
                    title="Preview"
                    class="p-1.5 rounded hover:bg-[--bg-glass-hover]"
                    style="color: var(--text-muted)"
                  ><Eye size={14} /></button>
                  <button
                    on:click|stopPropagation={() => startRename(file)}
                    title="Rename"
                    class="p-1.5 rounded hover:bg-[--bg-glass-hover]"
                    style="color: var(--text-muted)"
                  ><Pencil size={14} /></button>
                  <button
                    on:click|stopPropagation={() => openPanel(file, 'edit')}
                    title="Edit in panel"
                    class="p-1.5 rounded hover:bg-[--bg-glass-hover]"
                    style="color: var(--text-muted)"
                  ><Edit2 size={14} /></button>
                  <button
                    on:click|stopPropagation={() => openInCanvas(file)}
                    title="Open in Canvas editor"
                    class="p-1.5 rounded hover:bg-[--bg-glass-hover]"
                    style="color: var(--accent-light)"
                  ><Columns2 size={14} /></button>
                  {#if folder === 'drafts'}
                    <button
                      on:click|stopPropagation={() => moveToPublished(file)}
                      title="Publish"
                      class="p-1.5 rounded hover:bg-[--bg-glass-hover]"
                      style="color: var(--color-success)"
                    ><Upload size={14} /></button>
                  {/if}
                  <button
                    on:click|stopPropagation={() => deleteFile(file)}
                    title="Delete"
                    class="p-1.5 rounded hover:bg-[--bg-glass-hover]"
                    style="color: var(--color-error)"
                  ><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Canvas-style slide-in panel -->
  {#if panelFile}
    <div
      class="flex flex-col shrink-0 overflow-hidden"
      style="width: min(520px, 48vw); border-left: 1px solid var(--border); background: var(--bg-surface); animation: slide-in-right 0.25s ease"
    >
      <!-- Panel header -->
      <div class="flex items-center justify-between px-4 py-3 shrink-0" style="border-bottom: 1px solid var(--border-subtle)">
        <div class="flex items-center gap-2 min-w-0">
          <FileText size={14} style="color: var(--accent-light); flex-shrink: 0" />
          {#if renamingPanel}
            <input
              bind:value={renamePanelValue}
              on:keydown={(e) => {
                if (e.key === 'Enter') confirmPanelRename()
                if (e.key === 'Escape') renamingPanel = false
              }}
              on:blur={confirmPanelRename}
              class="font-medium text-sm flex-1 px-1.5 py-0.5 rounded outline-none min-w-0"
              style="background: var(--bg-input); border: 1px solid var(--accent); color: var(--text-primary)"
              autofocus
            />
          {:else}
            <span class="font-medium text-sm truncate" style="color: var(--text-primary)">{panelFile.slug.replace(/-/g, ' ')}</span>
            <button
              on:click={startPanelRename}
              title="Rename"
              class="p-1 rounded hover:bg-[--bg-glass-hover] shrink-0"
              style="color: var(--text-muted)"
            ><Pencil size={12} /></button>
          {/if}
          <span class="text-xs px-1.5 py-0.5 rounded-full shrink-0" style="background: var(--bg-elevated); color: var(--text-faint)">{wordCount}w</span>
        </div>

        <div class="flex items-center gap-1 shrink-0 ml-2">
          <!-- Preview / Edit toggle -->
          <div class="flex rounded-lg overflow-hidden" style="border: 1px solid var(--border)">
            <button
              on:click={() => panelMode = 'preview'}
              class="px-2.5 py-1 text-xs transition-colors"
              style="background: {panelMode === 'preview' ? 'var(--accent-muted)' : 'transparent'}; color: {panelMode === 'preview' ? 'var(--accent-light)' : 'var(--text-muted)'}"
            >Preview</button>
            <button
              on:click={() => panelMode = 'edit'}
              class="px-2.5 py-1 text-xs transition-colors"
              style="background: {panelMode === 'edit' ? 'var(--accent-muted)' : 'transparent'}; color: {panelMode === 'edit' ? 'var(--accent-light)' : 'var(--text-muted)'}"
            >Edit</button>
          </div>

          <button
            on:click={copyContent}
            title="Copy content"
            class="p-1.5 rounded transition-colors hover:bg-[--bg-glass-hover]"
            style="color: {copied ? 'var(--color-success)' : 'var(--text-muted)'}"
          ><Copy size={14} /></button>

          <button
            on:click={closePanel}
            class="p-1.5 rounded transition-colors hover:bg-[--bg-glass-hover]"
            style="color: var(--text-muted)"
          ><X size={14} /></button>
        </div>
      </div>

      <!-- Panel body -->
      <div class="flex-1 overflow-y-auto">
        {#if panelMode === 'preview'}
          <div class="px-6 py-5">
            <MarkdownRenderer content={panelContent} />
          </div>
        {:else}
          <textarea
            bind:value={panelContent}
            class="w-full h-full p-5 text-sm font-mono resize-none outline-none"
            style="background: var(--bg-base); color: var(--text-primary); line-height: 1.6; min-height: 100%"
          ></textarea>
        {/if}
      </div>

      <!-- Panel footer -->
      <div class="px-4 py-3 shrink-0 flex items-center justify-between" style="border-top: 1px solid var(--border-subtle)">
        <div class="flex items-center gap-2">
          <button
            on:click={() => openInCanvas(panelFile)}
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
            style="background: var(--accent-muted); border: 1px solid var(--border); color: var(--accent-light)"
          >
            <Columns2 size={12} />
            Open in Canvas
          </button>
          {#if folder === 'drafts'}
            <button
              on:click={() => moveToPublished(panelFile)}
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
              style="background: var(--bg-elevated); border: 1px solid var(--border); color: var(--color-success)"
            >
              <Upload size={12} />
              Publish
            </button>
          {/if}
          <button
            on:click={() => deleteFile(panelFile)}
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
            style="background: var(--bg-elevated); border: 1px solid var(--border); color: var(--color-error)"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>

        {#if panelMode === 'edit'}
          <button
            on:click={saveEdit}
            disabled={saving}
            class="px-4 py-1.5 rounded-lg text-sm font-medium"
            style="background: var(--accent); color: white"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>
