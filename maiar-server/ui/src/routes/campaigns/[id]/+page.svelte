<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { campaignsApi, assets, assetRecords } from '$lib/api/client'
  import Badge from '$lib/components/ui/Badge.svelte'
  import Spinner from '$lib/components/ui/Spinner.svelte'
  import MarkdownRenderer from '$lib/components/chat/MarkdownRenderer.svelte'
  import { ArrowLeft, MessageSquare, FileText, Check, Circle, Trash2, Link, Unlink, Layers } from 'lucide-svelte'
  import { formatDistanceToNow } from 'date-fns'

  let campaign: any = null
  let planContent = ''
  let loading = true
  let editingTitle = false
  let titleValue = ''
  let campaignAssets: any[] = []

  const STATUSES = ['planning', 'active', 'completed', 'archived']
  const STATUS_VARIANT: Record<string, string> = {
    planning: 'default',
    active: 'success',
    completed: 'info',
    archived: 'warning'
  }

  $: campaignId = $page.params.id

  async function loadCampaign() {
    loading = true
    try {
      campaign = await campaignsApi.get(campaignId)
      titleValue = campaign.title

      // Load plan content from disk if planPath exists
      if (campaign.planPath) {
        try {
          const parts = campaign.planPath.split('/')
          const folder = parts[0]
          const filename = parts.slice(1).join('/')
          const { content } = await assets.get(folder, filename) as any
          planContent = content
        } catch {
          planContent = ''
        }
      }
      // Load linked assets
      try {
        campaignAssets = await assetRecords.list({ campaignId })
      } catch {
        campaignAssets = []
      }
    } catch {
      campaign = null
    }
    loading = false
  }

  async function updateStatus(status: string) {
    await campaignsApi.update(campaignId, { status })
    campaign.status = status
  }

  async function saveTitle() {
    if (!titleValue.trim()) {
      editingTitle = false
      return
    }
    await campaignsApi.update(campaignId, { title: titleValue.trim() })
    campaign.title = titleValue.trim()
    editingTitle = false
  }

  async function updateAssetStatus(index: number, status: string) {
    const plan = [...(campaign.assetPlan ?? [])]
    plan[index] = { ...plan[index], status }
    await campaignsApi.update(campaignId, { assetPlan: plan })
    campaign.assetPlan = plan
  }

  function createAsset(asset: any) {
    const cmd = asset.command || '/write'
    const topic = asset.topic || asset.title || ''
    goto(`/chat?prefill=${encodeURIComponent(`${cmd} ${topic}`)}&campaignId=${campaignId}`)
  }

  async function unlinkConversation(convId: string) {
    await campaignsApi.unlinkConversation(campaignId, convId)
    campaign.conversations = campaign.conversations.filter((c: any) => c.id !== convId)
  }

  async function deleteCampaign() {
    if (!confirm('Delete this campaign? Conversations will be unlinked but not deleted.')) return
    await campaignsApi.delete(campaignId)
    goto('/campaigns')
  }

  onMount(loadCampaign)
</script>

{#if loading}
  <div class="flex items-center justify-center h-full"><Spinner /></div>
{:else if !campaign}
  <div class="flex flex-col items-center justify-center h-full gap-3">
    <p style="color: var(--text-muted)">Campaign not found</p>
    <a href="/campaigns" class="text-sm" style="color: var(--accent-light)">Back to campaigns</a>
  </div>
{:else}
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 shrink-0" style="border-bottom: 1px solid var(--border-subtle)">
      <div class="flex items-center gap-3 min-w-0">
        <a href="/campaigns" class="p-1.5 rounded-lg hover:bg-[--bg-glass-hover]" style="color: var(--text-muted)">
          <ArrowLeft size={16} />
        </a>
        {#if editingTitle}
          <input
            bind:value={titleValue}
            on:keydown={(e) => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') editingTitle = false }}
            on:blur={saveTitle}
            class="font-semibold text-lg px-2 py-1 rounded outline-none min-w-0"
            style="background: var(--bg-input); border: 1px solid var(--accent); color: var(--text-primary)"
            autofocus
          />
        {:else}
          <h1
            class="font-semibold text-lg cursor-pointer"
            style="color: var(--text-primary)"
            on:dblclick={() => editingTitle = true}
            title="Double-click to rename"
          >{campaign.title}</h1>
        {/if}

        <!-- Status dropdown -->
        <select
          value={campaign.status}
          on:change={(e) => updateStatus(e.currentTarget.value)}
          class="text-xs px-2 py-1 rounded-lg outline-none cursor-pointer"
          style="background: var(--bg-elevated); color: var(--text-secondary); border: 1px solid var(--border)"
        >
          {#each STATUSES as s}
            <option value={s}>{s}</option>
          {/each}
        </select>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs" style="color: var(--text-faint)">
          Created {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
        </span>
        <button
          on:click={deleteCampaign}
          class="p-1.5 rounded-lg hover:bg-[--bg-glass-hover]"
          style="color: var(--color-error)"
          title="Delete campaign"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>

    <!-- Content: plan + sidebar -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left: Campaign plan -->
      <div class="flex-1 overflow-y-auto p-6">
        {#if planContent}
          <MarkdownRenderer content={planContent} />
        {:else}
          <div class="flex flex-col items-center justify-center h-64 gap-3 text-center">
            <FileText size={32} style="color: var(--text-faint)" />
            <div>
              <p class="font-medium" style="color: var(--text-secondary)">No campaign plan yet</p>
              <p class="text-sm mt-1" style="color: var(--text-muted)">Run <span style="color: var(--accent-light)">/campaign</span> in chat to generate a plan</p>
            </div>
          </div>
        {/if}
      </div>

      <!-- Right: Asset checklist + conversations -->
      <div class="w-80 shrink-0 overflow-y-auto" style="border-left: 1px solid var(--border-subtle)">
        <!-- Asset Checklist -->
        <div class="p-4" style="border-bottom: 1px solid var(--border-subtle)">
          <h2 class="text-xs font-semibold uppercase tracking-wider mb-3" style="color: var(--text-faint)">Asset Checklist</h2>
          {#if campaign.assetPlan?.length > 0}
            <div class="space-y-2">
              {#each campaign.assetPlan as asset, i}
                <div class="flex items-start gap-2 p-2 rounded-lg" style="background: var(--bg-elevated)">
                  <button
                    on:click={() => updateAssetStatus(i, asset.status === 'done' ? 'pending' : 'done')}
                    class="mt-0.5 shrink-0"
                    style="color: {asset.status === 'done' ? 'var(--color-success)' : 'var(--text-faint)'}"
                  >
                    {#if asset.status === 'done'}
                      <Check size={14} />
                    {:else}
                      <Circle size={14} />
                    {/if}
                  </button>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-medium" style="color: var(--text-primary); text-decoration: {asset.status === 'done' ? 'line-through' : 'none'}">
                      {asset.title ?? asset.topic ?? 'Untitled'}
                    </p>
                    {#if asset.command}
                      <span class="text-[10px]" style="color: var(--accent-light)">{asset.command}</span>
                    {/if}
                  </div>
                  {#if asset.status !== 'done'}
                    <button
                      on:click={() => createAsset(asset)}
                      class="text-[10px] px-2 py-0.5 rounded shrink-0"
                      style="background: var(--accent-muted); color: var(--accent-light)"
                    >Create</button>
                  {/if}
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-xs" style="color: var(--text-faint)">No assets planned yet</p>
          {/if}
        </div>

        <!-- Linked Assets -->
        <div class="p-4" style="border-bottom: 1px solid var(--border-subtle)">
          <h2 class="text-xs font-semibold uppercase tracking-wider mb-3" style="color: var(--text-faint)">Linked Assets</h2>
          {#if campaignAssets.length > 0}
            <div class="space-y-1.5">
              {#each campaignAssets as asset}
                <a
                  href="/creations"
                  class="flex items-center gap-2 p-2 rounded-lg"
                  style="background: var(--bg-elevated); color: var(--text-secondary)"
                >
                  <Layers size={12} style="color: var(--accent-light)" />
                  <span class="flex-1 text-xs truncate capitalize">{asset.title}</span>
                  <Badge variant={asset.status === 'published' ? 'success' : 'default'}>{asset.status}</Badge>
                </a>
              {/each}
            </div>
          {:else}
            <p class="text-xs" style="color: var(--text-faint)">No assets linked yet</p>
          {/if}
        </div>

        <!-- Affiliated Conversations -->
        <div class="p-4">
          <h2 class="text-xs font-semibold uppercase tracking-wider mb-3" style="color: var(--text-faint)">Linked Chats</h2>
          {#if campaign.conversations?.length > 0}
            <div class="space-y-1.5">
              {#each campaign.conversations as conv}
                <div class="flex items-center gap-2 p-2 rounded-lg group" style="background: var(--bg-elevated)">
                  <MessageSquare size={12} style="color: var(--text-muted)" />
                  <a
                    href="/chat?convId={conv.id}"
                    class="flex-1 text-xs truncate"
                    style="color: var(--text-secondary)"
                  >{conv.title}</a>
                  <button
                    on:click|preventDefault={() => unlinkConversation(conv.id)}
                    class="opacity-0 group-hover:opacity-100 p-0.5 rounded"
                    style="color: var(--text-faint)"
                    title="Unlink"
                  >
                    <Unlink size={10} />
                  </button>
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-xs" style="color: var(--text-faint)">No conversations linked yet</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
