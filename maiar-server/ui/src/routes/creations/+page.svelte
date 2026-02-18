<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { assetRecords, campaignsApi } from '$lib/api/client'
  import { chat } from '$lib/stores/chat'
  import Badge from '$lib/components/ui/Badge.svelte'
  import Spinner from '$lib/components/ui/Spinner.svelte'
  import { Layers, FileText, MessageSquare, Target, X, ChevronRight } from 'lucide-svelte'
  import { formatDistanceToNow } from 'date-fns'

  let assets: any[] = []
  let campaigns: any[] = []
  let loading = true
  let selectedAsset: any = null
  let linkingCampaign = false

  const STATUS_VARIANT: Record<string, string> = {
    draft: 'default',
    published: 'success',
    archived: 'warning'
  }

  async function loadAssets() {
    loading = true
    try {
      assets = await assetRecords.list()
    } catch {}
    loading = false
  }

  async function loadCampaigns() {
    try {
      campaigns = await campaignsApi.list()
    } catch {}
  }

  function openInCanvas(asset: any) {
    const parts = asset.filePath.split('/')
    const folder = parts[0]
    const filename = parts.slice(1).join('/')
    chat.restoreCanvas(asset.filePath, '')
    goto('/chat')
  }

  function goToChat(conversationId: string) {
    goto(`/chat?convId=${conversationId}`)
  }

  async function linkToCampaign(assetId: string, campaignId: string) {
    try {
      await assetRecords.update(assetId, { campaignId })
      linkingCampaign = false
      await loadAssets()
      if (selectedAsset?.id === assetId) {
        selectedAsset = assets.find(a => a.id === assetId) ?? null
      }
    } catch {}
  }

  async function unlinkCampaign(assetId: string) {
    try {
      await assetRecords.update(assetId, { campaignId: null })
      await loadAssets()
      if (selectedAsset?.id === assetId) {
        selectedAsset = assets.find(a => a.id === assetId) ?? null
      }
    } catch {}
  }

  onMount(() => {
    loadAssets()
    loadCampaigns()
  })
</script>

<div class="flex flex-col h-full overflow-hidden">
  <!-- Header -->
  <div class="flex items-center justify-between px-6 py-4 shrink-0" style="border-bottom: 1px solid var(--border-subtle)">
    <div>
      <h1 class="font-semibold text-lg" style="color: var(--text-primary)">Assets</h1>
      <p class="text-xs mt-0.5" style="color: var(--text-muted)">All content assets with linked chats and campaigns</p>
    </div>
  </div>

  <div class="flex flex-1 overflow-hidden">
    <!-- Asset grid -->
    <div class="flex-1 overflow-y-auto p-6" class:pr-0={selectedAsset}>
      {#if loading}
        <div class="flex items-center justify-center h-40"><Spinner /></div>
      {:else if assets.length === 0}
        <div class="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <Layers size={32} style="color: var(--text-faint)" />
          <div>
            <p class="font-medium font-decorative" style="color: var(--text-secondary)">No assets yet</p>
            <p class="text-sm mt-1" style="color: var(--text-muted)">Use <span style="color: var(--accent-light)">/write</span> or other commands in chat to create content</p>
          </div>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {#each assets as asset}
            <button
              on:click={() => selectedAsset = (selectedAsset?.id === asset.id ? null : asset)}
              class="glass rounded-xl p-5 transition-all hover:shadow-lg text-left w-full"
              style="border: 1px solid {selectedAsset?.id === asset.id ? 'var(--accent)' : 'var(--border-subtle)'}"
            >
              <div class="flex items-start justify-between gap-2 mb-2">
                <h3 class="font-semibold text-sm capitalize" style="color: var(--text-primary)">{asset.title}</h3>
                <Badge variant={STATUS_VARIANT[asset.status] ?? 'default'}>{asset.status}</Badge>
              </div>

              <p class="text-xs mb-3 truncate" style="color: var(--text-faint)">
                <FileText size={10} class="inline mr-1" />{asset.filePath}
              </p>

              <div class="flex flex-wrap gap-2 mb-2">
                {#if asset.conversationTitle}
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style="background: var(--accent-muted); color: var(--accent-light)">
                    <MessageSquare size={9} />
                    {asset.conversationTitle}
                  </span>
                {/if}
                {#if asset.campaignTitle}
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style="background: rgba(139, 92, 246, 0.15); color: rgb(167, 139, 250)">
                    <Target size={9} />
                    {asset.campaignTitle}
                  </span>
                {/if}
              </div>

              <div class="text-xs" style="color: var(--text-muted)">
                {formatDistanceToNow(new Date(asset.createdAt), { addSuffix: true })}
              </div>
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Detail panel -->
    {#if selectedAsset}
      <div
        class="w-96 shrink-0 overflow-y-auto glass"
        style="border-left: 1px solid var(--border-subtle)"
      >
        <!-- Panel header -->
        <div class="flex items-center justify-between px-5 py-4" style="border-bottom: 1px solid var(--border-subtle)">
          <h2 class="font-semibold text-sm capitalize truncate" style="color: var(--text-primary)">{selectedAsset.title}</h2>
          <button on:click={() => selectedAsset = null} class="p-1 rounded" style="color: var(--text-muted)">
            <X size={14} />
          </button>
        </div>

        <div class="p-5 space-y-5">
          <!-- Status -->
          <div>
            <p class="text-xs font-medium mb-1.5" style="color: var(--text-faint)">Status</p>
            <Badge variant={STATUS_VARIANT[selectedAsset.status] ?? 'default'}>{selectedAsset.status}</Badge>
          </div>

          <!-- File path -->
          <div>
            <p class="text-xs font-medium mb-1.5" style="color: var(--text-faint)">File</p>
            <p class="text-sm" style="color: var(--text-secondary)">{selectedAsset.filePath}</p>
          </div>

          <!-- Linked chat -->
          <div>
            <p class="text-xs font-medium mb-1.5" style="color: var(--text-faint)">Linked Chat</p>
            {#if selectedAsset.conversationId}
              <button
                on:click={() => goToChat(selectedAsset.conversationId)}
                class="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors"
                style="background: var(--bg-tertiary); color: var(--text-secondary)"
              >
                <MessageSquare size={13} />
                <span class="truncate">{selectedAsset.conversationTitle ?? 'Conversation'}</span>
                <ChevronRight size={12} class="ml-auto shrink-0" style="color: var(--text-faint)" />
              </button>
            {:else}
              <p class="text-sm" style="color: var(--text-muted)">No linked conversation</p>
            {/if}
          </div>

          <!-- Linked campaign -->
          <div>
            <p class="text-xs font-medium mb-1.5" style="color: var(--text-faint)">Campaign</p>
            {#if selectedAsset.campaignId}
              <div class="flex items-center gap-2">
                <a
                  href="/campaigns/{selectedAsset.campaignId}"
                  class="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg text-sm transition-colors"
                  style="background: var(--bg-tertiary); color: var(--text-secondary)"
                >
                  <Target size={13} />
                  <span class="truncate">{selectedAsset.campaignTitle ?? 'Campaign'}</span>
                  <ChevronRight size={12} class="ml-auto shrink-0" style="color: var(--text-faint)" />
                </a>
                <button
                  on:click={() => unlinkCampaign(selectedAsset.id)}
                  class="p-1.5 rounded"
                  style="color: var(--text-muted)"
                  title="Unlink campaign"
                >
                  <X size={12} />
                </button>
              </div>
            {:else if linkingCampaign}
              <div class="space-y-1.5">
                {#each campaigns as camp}
                  <button
                    on:click={() => linkToCampaign(selectedAsset.id, camp.id)}
                    class="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors text-left"
                    style="background: var(--bg-tertiary); color: var(--text-secondary)"
                  >
                    <Target size={13} />
                    <span class="truncate">{camp.title}</span>
                  </button>
                {/each}
                {#if campaigns.length === 0}
                  <p class="text-xs" style="color: var(--text-muted)">No campaigns to link</p>
                {/if}
                <button
                  on:click={() => linkingCampaign = false}
                  class="text-xs" style="color: var(--text-muted)"
                >Cancel</button>
              </div>
            {:else}
              <button
                on:click={() => linkingCampaign = true}
                class="text-sm" style="color: var(--accent-light)"
              >Link to campaign...</button>
            {/if}
          </div>

          <!-- Timestamps -->
          <div>
            <p class="text-xs font-medium mb-1.5" style="color: var(--text-faint)">Created</p>
            <p class="text-sm" style="color: var(--text-muted)">
              {formatDistanceToNow(new Date(selectedAsset.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        <!-- Panel footer -->
        <div class="px-5 py-4 space-y-2" style="border-top: 1px solid var(--border-subtle)">
          <button
            on:click={() => openInCanvas(selectedAsset)}
            class="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style="background: var(--accent); color: white"
          >
            Open in Canvas
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>
