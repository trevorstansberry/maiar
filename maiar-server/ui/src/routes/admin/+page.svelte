<script lang="ts">
  import { onMount } from 'svelte'
  import { admin } from '$lib/api/client'
  import { isAdmin } from '$lib/stores/auth'
  import { goto } from '$app/navigation'
  import Badge from '$lib/components/ui/Badge.svelte'
  import Spinner from '$lib/components/ui/Spinner.svelte'
  import { formatDistanceToNow } from 'date-fns'

  let clients: any[] = []
  let usage: any[] = []
  let loading = true
  let showCreateModal = false
  let creating = false
  let createError = ''

  let form = { email: '', password: '', clientSlug: '', displayName: '', role: 'client' }

  async function loadData() {
    loading = true
    try {
      [clients, usage] = await Promise.all([admin.listClients(), admin.getUsage()])
    } catch {}
    loading = false
  }

  async function toggleClient(id: string) {
    await admin.toggleClient(id)
    loadData()
  }

  async function createClient() {
    creating = true
    createError = ''
    try {
      await admin.createClient(form)
      showCreateModal = false
      form = { email: '', password: '', clientSlug: '', displayName: '', role: 'client' }
      loadData()
    } catch (err: any) {
      createError = err.message
    }
    creating = false
  }

  const getClientUsage = (slug: string) => usage.find(u => u.client_slug === slug)

  onMount(() => {
    if (!$isAdmin) goto('/chat')
    loadData()
  })
</script>

<svelte:head><title>Admin — Maiar</title></svelte:head>

<div class="h-full overflow-y-auto p-6">
  <div class="max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold" style="color: var(--text-primary)">Admin Dashboard</h1>
        <p class="text-sm mt-0.5" style="color: var(--text-muted)">Manage users, usage, and billing</p>
      </div>
      <div class="flex items-center gap-2">
        <a
          href={admin.getUsageCsvUrl()}
          class="px-3 py-1.5 rounded-lg text-sm"
          style="background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text-secondary)"
          download
        >
          Export CSV
        </a>
        <button
          on:click={() => showCreateModal = true}
          class="px-4 py-1.5 rounded-lg text-sm font-medium"
          style="background: var(--accent); color: white"
        >
          New user
        </button>
      </div>
    </div>

    {#if loading}
      <div class="flex justify-center pt-16"><Spinner size="lg" /></div>
    {:else}
      <!-- Usage summary cards -->
      <div class="grid grid-cols-4 gap-3 mb-6">
        <div class="glass rounded-xl p-4">
          <p class="text-xs" style="color: var(--text-muted)">Active clients</p>
          <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">{clients.filter(c => c.role === 'client' && c.active).length}</p>
        </div>
        <div class="glass rounded-xl p-4">
          <p class="text-xs" style="color: var(--text-muted)">Admins</p>
          <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">{clients.filter(c => c.role === 'admin').length}</p>
        </div>
        <div class="glass rounded-xl p-4">
          <p class="text-xs" style="color: var(--text-muted)">Requests this month</p>
          <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">
            {usage.reduce((a, u) => a + (u.request_count ?? 0), 0).toLocaleString()}
          </p>
        </div>
        <div class="glass rounded-xl p-4">
          <p class="text-xs" style="color: var(--text-muted)">Est. API cost (month)</p>
          <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">
            ${usage.reduce((a, u) => a + (u.est_cost_usd ?? 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      <!-- User table -->
      <div class="glass rounded-xl overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-subtle)">
              {#each ['User', 'Email', 'Role', 'Status', 'Requests', 'Est. Cost', 'Actions'] as col}
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--text-faint)">{col}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each clients as client}
              {@const u = getClientUsage(client.clientSlug)}
              <tr style="border-bottom: 1px solid var(--border-subtle)">
                <td class="px-4 py-3 font-mono text-xs" style="color: var(--text-secondary)">{client.clientSlug}</td>
                <td class="px-4 py-3" style="color: var(--text-secondary)">{client.email}</td>
                <td class="px-4 py-3">
                  <Badge variant={client.role === 'admin' ? 'accent' : 'default'}>
                    {client.role}
                  </Badge>
                </td>
                <td class="px-4 py-3">
                  <Badge variant={client.active ? 'success' : 'error'}>
                    {client.active ? 'Active' : 'Disabled'}
                  </Badge>
                </td>
                <td class="px-4 py-3" style="color: var(--text-secondary)">{(u?.request_count ?? 0).toLocaleString()}</td>
                <td class="px-4 py-3" style="color: var(--text-secondary)">${(u?.est_cost_usd ?? 0).toFixed(2)}</td>
                <td class="px-4 py-3">
                  <button
                    on:click={() => toggleClient(client.id)}
                    class="text-xs px-2 py-1 rounded"
                    style="color: {client.active ? 'var(--color-error)' : 'var(--color-success)'}; background: transparent; border: 1px solid currentColor"
                  >
                    {client.active ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<!-- Create user modal -->
{#if showCreateModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-6" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px)">
    <div class="w-full max-w-md rounded-2xl p-6" style="background: var(--bg-surface); border: 1px solid var(--border); box-shadow: var(--shadow-lg)">
      <h2 class="font-semibold mb-5" style="color: var(--text-primary)">Create new user</h2>

      <form on:submit|preventDefault={createClient} class="space-y-4">
        {#each [
          { label: 'Email', key: 'email', type: 'email', placeholder: 'client@company.com' },
          { label: 'Temp password', key: 'password', type: 'password', placeholder: '••••••••' },
          { label: 'Slug', key: 'clientSlug', type: 'text', placeholder: 'acme-corp' },
          { label: 'Display name', key: 'displayName', type: 'text', placeholder: 'Acme Corp' }
        ] as field}
          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">{field.label}</label>
            <input
              type={field.type}
              bind:value={form[field.key]}
              required={field.key !== 'displayName'}
              placeholder={field.placeholder}
              class="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
            />
          </div>
        {/each}

        <!-- Role selector -->
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Role</label>
          <div class="flex gap-2">
            {#each ['client', 'admin'] as r}
              <button
                type="button"
                on:click={() => form.role = r}
                class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                style="
                  background: {form.role === r ? 'var(--accent)' : 'var(--bg-elevated)'};
                  color: {form.role === r ? 'white' : 'var(--text-secondary)'};
                  border: 1px solid {form.role === r ? 'var(--accent)' : 'var(--border)'}
                "
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            {/each}
          </div>
          {#if form.role === 'admin'}
            <p class="text-xs mt-1.5" style="color: var(--color-warning)">Admin users can manage all clients and access the admin dashboard.</p>
          {/if}
        </div>

        {#if createError}
          <p class="text-xs px-3 py-2 rounded-lg" style="background: rgba(239,100,97,0.1); color: var(--color-error)">{createError}</p>
        {/if}

        <div class="flex gap-2 pt-1">
          <button type="submit" disabled={creating} class="flex-1 py-2.5 rounded-lg font-medium text-sm" style="background: var(--accent); color: white">
            {creating ? 'Creating...' : 'Create user'}
          </button>
          <button type="button" on:click={() => showCreateModal = false} class="px-4 py-2.5 rounded-lg text-sm" style="background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text-secondary)">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
