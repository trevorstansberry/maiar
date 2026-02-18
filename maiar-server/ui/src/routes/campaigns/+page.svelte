<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { campaignsApi } from '$lib/api/client'
  import Badge from '$lib/components/ui/Badge.svelte'
  import Spinner from '$lib/components/ui/Spinner.svelte'
  import { Target, Plus } from 'lucide-svelte'
  import { formatDistanceToNow } from 'date-fns'

  let campaigns: any[] = []
  let loading = true

  const STATUS_VARIANT: Record<string, string> = {
    planning: 'default',
    active: 'success',
    completed: 'info',
    archived: 'warning'
  }

  async function loadCampaigns() {
    loading = true
    try {
      campaigns = await campaignsApi.list()
    } catch {}
    loading = false
  }

  function newCampaign() {
    goto('/chat?prefill=' + encodeURIComponent('/campaign '))
  }

  onMount(loadCampaigns)
</script>

<div class="flex flex-col h-full overflow-hidden">
  <!-- Header -->
  <div class="flex items-center justify-between px-6 py-4 shrink-0" style="border-bottom: 1px solid var(--border-subtle)">
    <div>
      <h1 class="font-semibold text-lg" style="color: var(--text-primary)">Campaigns</h1>
      <p class="text-xs mt-0.5" style="color: var(--text-muted)">Plan campaigns, track assets, link conversations</p>
    </div>
    <button
      on:click={newCampaign}
      class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      style="background: var(--accent); color: white"
    >
      <Plus size={14} />
      New Campaign
    </button>
  </div>

  <!-- Campaign grid -->
  <div class="flex-1 overflow-y-auto p-6">
    {#if loading}
      <div class="flex items-center justify-center h-40"><Spinner /></div>
    {:else if campaigns.length === 0}
      <div class="flex flex-col items-center justify-center h-64 gap-3 text-center">
        <Target size={32} style="color: var(--text-faint)" />
        <div>
          <p class="font-medium font-decorative" style="color: var(--text-secondary)">No campaigns yet</p>
          <p class="text-sm mt-1" style="color: var(--text-muted)">Use <span style="color: var(--accent-light)">/campaign</span> in chat to build a campaign plan</p>
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {#each campaigns as campaign}
          <a
            href="/campaigns/{campaign.id}"
            class="glass rounded-xl p-5 transition-all hover:shadow-lg group"
            style="border: 1px solid var(--border-subtle)"
          >
            <div class="flex items-start justify-between gap-2 mb-3">
              <h3 class="font-semibold text-sm" style="color: var(--text-primary)">{campaign.title}</h3>
              <Badge variant={STATUS_VARIANT[campaign.status] ?? 'default'}>{campaign.status}</Badge>
            </div>

            <div class="flex items-center gap-4 text-xs" style="color: var(--text-muted)">
              {#if campaign.assetCount > 0}
                <span>{campaign.completedAssets}/{campaign.assetCount} assets</span>
              {/if}
              {#if campaign.conversationCount > 0}
                <span>{campaign.conversationCount} chats</span>
              {/if}
              <span>{formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}</span>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>
