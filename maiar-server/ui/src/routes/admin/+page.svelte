<script lang="ts">
  import { onMount } from 'svelte'
  import { admin } from '$lib/api/client'
  import { isAdmin, isClientAdmin, user } from '$lib/stores/auth'
  import { goto } from '$app/navigation'
  import Badge from '$lib/components/ui/Badge.svelte'
  import Spinner from '$lib/components/ui/Spinner.svelte'
  import { Building2, Users as UsersIcon, BarChart3, Plus, ChevronDown, ChevronRight, Pencil, Mail, Key, Trash2 } from 'lucide-svelte'

  // Reactive role guard — prevent non-admin users from seeing this page
  $: if ($user !== null && !$isClientAdmin) goto('/chat')

  type Tab = 'workspaces' | 'users' | 'usage'
  let activeTab: Tab = $isAdmin ? 'workspaces' : 'users'

  let workspaces: any[] = []
  let clients: any[] = []
  let usage: any[] = []
  let loading = true

  // Workspace expand state
  let expandedWorkspace: string | null = null
  let workspaceUsers: any[] = []
  let loadingUsers = false

  // Create modals
  let showCreateWorkspace = false
  let showCreateUser = false
  let creating = false
  let createError = ''

  let wsForm = { slug: '', displayName: '' }
  let userForm = { email: '', password: '', clientSlug: '', displayName: '', role: 'client' }

  // Edit user modal
  let showEditUser = false
  let editTarget: any = null
  let editForm = { name: '', email: '', role: 'client' }
  let editSaving = false
  let editError = ''

  // Set password modal
  let showSetPassword = false
  let setPasswordTarget: any = null
  let setPasswordValue = ''
  let setPasswordSaving = false
  let setPasswordError = ''

  // Delete confirmation
  let showDeleteConfirm = false
  let deleteTarget: any = null
  let deleting = false

  // Toast
  let toastMessage = ''
  let toastTimeout: ReturnType<typeof setTimeout> | null = null

  function showToast(msg: string) {
    toastMessage = msg
    if (toastTimeout) clearTimeout(toastTimeout)
    toastTimeout = setTimeout(() => { toastMessage = '' }, 3000)
  }

  async function loadData() {
    loading = true
    try {
      if ($isAdmin) {
        [workspaces, clients, usage] = await Promise.all([
          admin.listWorkspaces(),
          admin.listClients(),
          admin.getUsage()
        ])
      } else {
        [clients, usage] = await Promise.all([admin.listMyUsers(), admin.getMyUsage()])
      }
    } catch {}
    loading = false
  }

  async function toggleWorkspace(id: string, event: Event) {
    event.stopPropagation()
    if (expandedWorkspace === id) {
      expandedWorkspace = null
      return
    }
    expandedWorkspace = id
    loadingUsers = true
    try {
      workspaceUsers = await admin.getWorkspaceUsers(id)
    } catch {
      workspaceUsers = []
    }
    loadingUsers = false
  }

  async function toggleClient(id: string) {
    if ($isAdmin) {
      await admin.toggleClient(id)
    } else {
      await admin.toggleMyUser(id)
    }
    loadData()
  }

  async function createWorkspace() {
    creating = true
    createError = ''
    try {
      await admin.createWorkspace(wsForm)
      showCreateWorkspace = false
      wsForm = { slug: '', displayName: '' }
      loadData()
    } catch (err: any) {
      createError = err.message
    }
    creating = false
  }

  async function createUser() {
    creating = true
    createError = ''
    try {
      if ($isAdmin) {
        await admin.createClient(userForm)
      } else {
        await admin.createMyUser({ email: userForm.email, password: userForm.password, displayName: userForm.displayName })
      }
      showCreateUser = false
      userForm = { email: '', password: '', clientSlug: '', displayName: '', role: 'client' }
      loadData()
    } catch (err: any) {
      createError = err.message
    }
    creating = false
  }

  // Edit user
  function openEditUser(client: any) {
    editTarget = client
    editForm = { name: client.name ?? '', email: client.email, role: client.role }
    editError = ''
    showEditUser = true
  }

  async function saveEditUser() {
    if (!editTarget) return
    editSaving = true
    editError = ''
    try {
      const data: any = { name: editForm.name || null }
      if ($isAdmin) {
        data.email = editForm.email
        data.role = editForm.role
      }
      await admin.editUser(editTarget.id, data)
      showEditUser = false
      showToast('User updated')
      loadData()
    } catch (err: any) {
      editError = err.message
    }
    editSaving = false
  }

  // Send reset link
  async function sendResetLink(client: any) {
    try {
      if ($isAdmin) {
        await admin.sendResetLink(client.id)
      } else {
        await admin.sendMyUserResetLink(client.id)
      }
      showToast(`Reset link sent to ${client.email}`)
    } catch (err: any) {
      showToast(`Failed: ${err.message}`)
    }
  }

  // Set password (super admin only)
  function openSetPassword(client: any) {
    setPasswordTarget = client
    setPasswordValue = ''
    setPasswordError = ''
    showSetPassword = true
  }

  async function doSetPassword() {
    if (!setPasswordTarget || !setPasswordValue) return
    setPasswordSaving = true
    setPasswordError = ''
    try {
      await admin.setPassword(setPasswordTarget.id, setPasswordValue)
      showSetPassword = false
      showToast(`Password set for ${setPasswordTarget.email}. They'll be prompted to change it.`)
    } catch (err: any) {
      setPasswordError = err.message
    }
    setPasswordSaving = false
  }

  // Delete user (super admin only)
  function openDeleteConfirm(client: any) {
    deleteTarget = client
    showDeleteConfirm = true
  }

  async function doDeleteUser() {
    if (!deleteTarget) return
    deleting = true
    try {
      await admin.deleteUser(deleteTarget.id)
      showDeleteConfirm = false
      showToast(`${deleteTarget.email} deleted`)
      loadData()
    } catch (err: any) {
      showToast(`Delete failed: ${err.message}`)
    }
    deleting = false
  }

  const getClientUsage = (id: string) => usage.find(u => u.id === id)

  function roleLabel(role: string): string {
    if (role === 'super_admin') return 'Super Admin'
    if (role === 'client_admin') return 'Client Admin'
    return 'Client'
  }

  function roleBadgeVariant(role: string): string {
    if (role === 'super_admin') return 'accent'
    if (role === 'client_admin') return 'warning'
    return 'default'
  }

  onMount(() => {
    if (!$isClientAdmin) goto('/chat')
    loadData()
  })
</script>

<svelte:head><title>Admin — Maiar</title></svelte:head>

<!-- Toast -->
{#if toastMessage}
  <div class="fixed top-4 right-4 z-[60] px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg fade-in"
    style="background: var(--bg-surface); border: 1px solid var(--border); color: var(--text-primary)">
    {toastMessage}
  </div>
{/if}

<div class="h-full overflow-y-auto p-6">
  <div class="max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold" style="color: var(--text-primary)">
          {$isAdmin ? 'Admin Dashboard' : 'Team Management'}
        </h1>
        <p class="text-sm mt-0.5" style="color: var(--text-muted)">
          {$isAdmin ? 'Manage workspaces, users, and usage' : 'Manage your team and view usage'}
        </p>
      </div>
      <div class="flex items-center gap-2">
        {#if $isAdmin && activeTab === 'usage'}
          <a
            href={admin.getUsageCsvUrl()}
            class="px-3 py-1.5 rounded-lg text-sm"
            style="background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text-secondary)"
            download
          >
            Export CSV
          </a>
        {/if}
        {#if $isAdmin && activeTab === 'workspaces'}
          <button
            on:click={() => { showCreateWorkspace = true; createError = '' }}
            class="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium"
            style="background: var(--accent); color: white"
          >
            <Plus size={14} />
            New workspace
          </button>
        {/if}
        {#if activeTab === 'users'}
          <button
            on:click={() => { showCreateUser = true; createError = '' }}
            class="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium"
            style="background: var(--accent); color: white"
          >
            <Plus size={14} />
            New user
          </button>
        {/if}
      </div>
    </div>

    <!-- Tabs (super admin only — client admins see users + usage) -->
    {#if $isAdmin}
      <div class="flex gap-1 mb-5 p-1 rounded-lg" style="background: var(--bg-elevated)">
        {#each [
          { id: 'workspaces', label: 'Workspaces', icon: Building2 },
          { id: 'users', label: 'Users', icon: UsersIcon },
          { id: 'usage', label: 'Usage', icon: BarChart3 }
        ] as tab}
          <button
            on:click={() => activeTab = tab.id}
            class="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center"
            style="
              background: {activeTab === tab.id ? 'var(--bg-surface)' : 'transparent'};
              color: {activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)'};
              box-shadow: {activeTab === tab.id ? 'var(--shadow-sm)' : 'none'};
            "
          >
            <svelte:component this={tab.icon} size={14} />
            {tab.label}
          </button>
        {/each}
      </div>
    {/if}

    {#if loading}
      <div class="flex justify-center pt-16"><Spinner size="lg" /></div>
    {:else}

      <!-- ═══ WORKSPACES TAB ═══ -->
      {#if activeTab === 'workspaces' && $isAdmin}
        <div class="space-y-3">
          {#each workspaces as ws}
            <div class="glass rounded-xl overflow-hidden" style="border: 1px solid var(--border-subtle)">
              <button
                on:click={(e) => toggleWorkspace(ws.id, e)}
                class="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-[--bg-glass-hover]"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background: var(--accent-muted); color: var(--accent-light)">
                    <Building2 size={16} />
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-sm" style="color: var(--text-primary)">{ws.displayName}</span>
                      <Badge variant={ws.active ? 'success' : 'error'}>{ws.active ? 'Active' : 'Disabled'}</Badge>
                    </div>
                    <span class="text-xs" style="color: var(--text-faint)">{ws.slug}</span>
                  </div>
                </div>

                <div class="flex items-center gap-6 shrink-0">
                  <div class="text-right">
                    <p class="text-xs font-medium" style="color: var(--text-secondary)">{ws.userCount} user{ws.userCount !== 1 ? 's' : ''}</p>
                    <p class="text-xs" style="color: var(--text-faint)">{ws.requestCount.toLocaleString()} requests</p>
                  </div>
                  {#if expandedWorkspace === ws.id}
                    <ChevronDown size={14} style="color: var(--text-muted)" />
                  {:else}
                    <ChevronRight size={14} style="color: var(--text-muted)" />
                  {/if}
                </div>
              </button>

              {#if expandedWorkspace === ws.id}
                <div style="border-top: 1px solid var(--border-subtle)">
                  {#if loadingUsers}
                    <div class="flex justify-center py-4"><Spinner /></div>
                  {:else if workspaceUsers.length === 0}
                    <p class="text-xs py-4 text-center" style="color: var(--text-faint)">No users in this workspace</p>
                  {:else}
                    <table class="w-full text-sm">
                      <thead>
                        <tr style="border-bottom: 1px solid var(--border-subtle)">
                          {#each ['Name', 'Email', 'Role', 'Status'] as col}
                            <th class="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--text-faint)">{col}</th>
                          {/each}
                        </tr>
                      </thead>
                      <tbody>
                        {#each workspaceUsers as u}
                          <tr style="border-bottom: 1px solid var(--border-subtle)">
                            <td class="px-4 py-2" style="color: var(--text-primary)">{u.name ?? '—'}</td>
                            <td class="px-4 py-2" style="color: var(--text-secondary)">{u.email}</td>
                            <td class="px-4 py-2"><Badge variant={roleBadgeVariant(u.role)}>{roleLabel(u.role)}</Badge></td>
                            <td class="px-4 py-2"><Badge variant={u.active ? 'success' : 'error'}>{u.active ? 'Active' : 'Disabled'}</Badge></td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  {/if}
                </div>
              {/if}
            </div>
          {/each}

          {#if workspaces.length === 0}
            <div class="flex flex-col items-center justify-center h-40 gap-2">
              <Building2 size={24} style="color: var(--text-faint)" />
              <p class="text-sm" style="color: var(--text-muted)">No workspaces yet</p>
            </div>
          {/if}
        </div>

      <!-- ═══ USERS TAB ═══ -->
      {:else if activeTab === 'users'}
        <!-- Summary cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div class="glass rounded-xl p-4">
            <p class="text-xs" style="color: var(--text-muted)">Total users</p>
            <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">{clients.length}</p>
          </div>
          <div class="glass rounded-xl p-4">
            <p class="text-xs" style="color: var(--text-muted)">Active</p>
            <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">{clients.filter(c => c.active).length}</p>
          </div>
          {#if $isAdmin}
            <div class="glass rounded-xl p-4">
              <p class="text-xs" style="color: var(--text-muted)">Workspaces</p>
              <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">{new Set(clients.map(c => c.clientSlug)).size}</p>
            </div>
            <div class="glass rounded-xl p-4">
              <p class="text-xs" style="color: var(--text-muted)">Admins</p>
              <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">{clients.filter(c => c.role !== 'client').length}</p>
            </div>
          {/if}
        </div>

        <!-- User table -->
        <div class="glass rounded-xl overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-subtle)">
                {#each ['Name', 'Email', ...($isAdmin ? ['Workspace'] : []), 'Role', 'Status', 'Actions'] as col}
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--text-faint)">{col}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each clients as client}
                <tr style="border-bottom: 1px solid var(--border-subtle)">
                  <td class="px-4 py-3" style="color: var(--text-primary)">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0" style="background: var(--accent-muted); color: var(--accent-light)">
                        {(client.name || client.email || '?')[0].toUpperCase()}
                      </div>
                      <span class="truncate">{client.name ?? '—'}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3" style="color: var(--text-secondary)">{client.email}</td>
                  {#if $isAdmin}
                    <td class="px-4 py-3">
                      <span class="text-xs px-2 py-0.5 rounded-full" style="background: var(--bg-elevated); color: var(--text-muted)">{client.clientSlug}</span>
                    </td>
                  {/if}
                  <td class="px-4 py-3">
                    <Badge variant={roleBadgeVariant(client.role)}>{roleLabel(client.role)}</Badge>
                  </td>
                  <td class="px-4 py-3">
                    <Badge variant={client.active ? 'success' : 'error'}>{client.active ? 'Active' : 'Disabled'}</Badge>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-1">
                      <button
                        on:click={() => toggleClient(client.id)}
                        class="text-[11px] px-2 py-1 rounded transition-colors"
                        style="color: {client.active ? 'var(--color-error)' : 'var(--color-success)'}; background: transparent; border: 1px solid currentColor"
                        title={client.active ? 'Disable user' : 'Enable user'}
                      >
                        {client.active ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        on:click={() => openEditUser(client)}
                        class="p-1.5 rounded transition-colors hover:bg-[--bg-glass-hover]"
                        style="color: var(--text-muted)"
                        title="Edit user"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        on:click={() => sendResetLink(client)}
                        class="p-1.5 rounded transition-colors hover:bg-[--bg-glass-hover]"
                        style="color: var(--text-muted)"
                        title="Send password reset link"
                      >
                        <Mail size={13} />
                      </button>
                      {#if $isAdmin}
                        <button
                          on:click={() => openSetPassword(client)}
                          class="p-1.5 rounded transition-colors hover:bg-[--bg-glass-hover]"
                          style="color: var(--text-muted)"
                          title="Set temp password"
                        >
                          <Key size={13} />
                        </button>
                        {#if client.id !== $user?.id}
                          <button
                            on:click={() => openDeleteConfirm(client)}
                            class="p-1.5 rounded transition-colors hover:bg-[--bg-glass-hover]"
                            style="color: var(--color-error, #dc2626)"
                            title="Delete user"
                          >
                            <Trash2 size={13} />
                          </button>
                        {/if}
                      {/if}
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

      <!-- ═══ USAGE TAB ═══ -->
      {:else if activeTab === 'usage'}
        <!-- Summary cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div class="glass rounded-xl p-4">
            <p class="text-xs" style="color: var(--text-muted)">Total requests</p>
            <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">
              {usage.reduce((a, u) => a + (u.request_count ?? 0), 0).toLocaleString()}
            </p>
          </div>
          <div class="glass rounded-xl p-4">
            <p class="text-xs" style="color: var(--text-muted)">Input tokens</p>
            <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">
              {usage.reduce((a, u) => a + (u.total_input ?? 0), 0).toLocaleString()}
            </p>
          </div>
          <div class="glass rounded-xl p-4">
            <p class="text-xs" style="color: var(--text-muted)">Output tokens</p>
            <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">
              {usage.reduce((a, u) => a + (u.total_output ?? 0), 0).toLocaleString()}
            </p>
          </div>
          <div class="glass rounded-xl p-4">
            <p class="text-xs" style="color: var(--text-muted)">Est. cost (month)</p>
            <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">
              ${usage.reduce((a, u) => a + (u.est_cost_usd ?? 0), 0).toFixed(2)}
            </p>
          </div>
        </div>

        <!-- Usage table -->
        <div class="glass rounded-xl overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-subtle)">
                {#each ['User', ...($isAdmin ? ['Workspace'] : []), 'Requests', 'Input', 'Output', 'Est. Cost'] as col}
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--text-faint)">{col}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each usage as u}
                <tr style="border-bottom: 1px solid var(--border-subtle)">
                  <td class="px-4 py-3" style="color: var(--text-primary)">{u.email}</td>
                  {#if $isAdmin}
                    <td class="px-4 py-3">
                      <span class="text-xs px-2 py-0.5 rounded-full" style="background: var(--bg-elevated); color: var(--text-muted)">{u.client_slug}</span>
                    </td>
                  {/if}
                  <td class="px-4 py-3" style="color: var(--text-secondary)">{(u.request_count ?? 0).toLocaleString()}</td>
                  <td class="px-4 py-3" style="color: var(--text-secondary)">{(u.total_input ?? 0).toLocaleString()}</td>
                  <td class="px-4 py-3" style="color: var(--text-secondary)">{(u.total_output ?? 0).toLocaleString()}</td>
                  <td class="px-4 py-3" style="color: var(--text-secondary)">${(u.est_cost_usd ?? 0).toFixed(2)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}

    {/if}
  </div>
</div>

<!-- Create workspace modal -->
{#if showCreateWorkspace}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-6" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px)">
    <div class="w-full max-w-md rounded-2xl p-6" style="background: var(--bg-surface); border: 1px solid var(--border); box-shadow: var(--shadow-lg)">
      <h2 class="font-semibold mb-5" style="color: var(--text-primary)">Create workspace</h2>

      <form on:submit|preventDefault={createWorkspace} class="space-y-4">
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Display name</label>
          <input
            type="text"
            bind:value={wsForm.displayName}
            required
            placeholder="Acme Corp"
            class="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
          />
        </div>
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Slug</label>
          <input
            type="text"
            bind:value={wsForm.slug}
            required
            placeholder="acme-corp"
            pattern="[a-z0-9][a-z0-9-]*[a-z0-9]"
            class="w-full px-3 py-2.5 rounded-lg text-sm outline-none font-mono"
            style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
          />
          <p class="text-xs mt-1" style="color: var(--text-faint)">Lowercase letters, numbers, and hyphens. Used for workspace directory.</p>
        </div>

        {#if createError}
          <p class="text-xs px-3 py-2 rounded-lg" style="background: rgba(239,100,97,0.1); color: var(--color-error)">{createError}</p>
        {/if}

        <div class="flex gap-2 pt-1">
          <button type="submit" disabled={creating} class="flex-1 py-2.5 rounded-lg font-medium text-sm" style="background: var(--accent); color: white">
            {creating ? 'Creating...' : 'Create workspace'}
          </button>
          <button type="button" on:click={() => showCreateWorkspace = false} class="px-4 py-2.5 rounded-lg text-sm" style="background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text-secondary)">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Create user modal -->
{#if showCreateUser}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-6" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px)">
    <div class="w-full max-w-md rounded-2xl p-6" style="background: var(--bg-surface); border: 1px solid var(--border); box-shadow: var(--shadow-lg)">
      <h2 class="font-semibold mb-5" style="color: var(--text-primary)">Create new user</h2>

      <form on:submit|preventDefault={createUser} class="space-y-4">
        {#each [
          { label: 'Email', key: 'email', type: 'email', placeholder: 'user@company.com' },
          { label: 'Temp password', key: 'password', type: 'password', placeholder: '••••••••' },
          { label: 'Display name', key: 'displayName', type: 'text', placeholder: 'Jane Smith' },
          ...($isAdmin ? [{ label: 'Workspace slug', key: 'clientSlug', type: 'text', placeholder: 'acme-corp' }] : [])
        ] as field}
          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">{field.label}</label>
            <input
              type={field.type}
              bind:value={userForm[field.key]}
              required={field.key !== 'displayName'}
              placeholder={field.placeholder}
              class="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
            />
          </div>
        {/each}

        <!-- Role selector (super admin only) -->
        {#if $isAdmin}
          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Role</label>
            <div class="flex gap-2">
              {#each [{ value: 'client', label: 'Client' }, { value: 'client_admin', label: 'Client Admin' }, { value: 'super_admin', label: 'Super Admin' }] as r}
                <button
                  type="button"
                  on:click={() => userForm.role = r.value}
                  class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                  style="
                    background: {userForm.role === r.value ? 'var(--accent)' : 'var(--bg-elevated)'};
                    color: {userForm.role === r.value ? 'white' : 'var(--text-secondary)'};
                    border: 1px solid {userForm.role === r.value ? 'var(--accent)' : 'var(--border)'}
                  "
                >
                  {r.label}
                </button>
              {/each}
            </div>
          </div>
        {/if}

        {#if createError}
          <p class="text-xs px-3 py-2 rounded-lg" style="background: rgba(239,100,97,0.1); color: var(--color-error)">{createError}</p>
        {/if}

        <div class="flex gap-2 pt-1">
          <button type="submit" disabled={creating} class="flex-1 py-2.5 rounded-lg font-medium text-sm" style="background: var(--accent); color: white">
            {creating ? 'Creating...' : 'Create user'}
          </button>
          <button type="button" on:click={() => showCreateUser = false} class="px-4 py-2.5 rounded-lg text-sm" style="background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text-secondary)">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Edit user modal -->
{#if showEditUser && editTarget}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-6" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px)">
    <div class="w-full max-w-md rounded-2xl p-6" style="background: var(--bg-surface); border: 1px solid var(--border); box-shadow: var(--shadow-lg)">
      <h2 class="font-semibold mb-5" style="color: var(--text-primary)">Edit user</h2>

      <form on:submit|preventDefault={saveEditUser} class="space-y-4">
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Name</label>
          <input
            type="text"
            bind:value={editForm.name}
            placeholder="Jane Smith"
            class="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
          />
        </div>

        {#if $isAdmin}
          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Email</label>
            <input
              type="email"
              bind:value={editForm.email}
              required
              class="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
            />
          </div>
          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Role</label>
            <div class="flex gap-2">
              {#each [{ value: 'client', label: 'Client' }, { value: 'client_admin', label: 'Client Admin' }, { value: 'super_admin', label: 'Super Admin' }] as r}
                <button
                  type="button"
                  on:click={() => editForm.role = r.value}
                  class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                  style="
                    background: {editForm.role === r.value ? 'var(--accent)' : 'var(--bg-elevated)'};
                    color: {editForm.role === r.value ? 'white' : 'var(--text-secondary)'};
                    border: 1px solid {editForm.role === r.value ? 'var(--accent)' : 'var(--border)'}
                  "
                >
                  {r.label}
                </button>
              {/each}
            </div>
          </div>
        {/if}

        {#if editError}
          <p class="text-xs px-3 py-2 rounded-lg" style="background: rgba(239,100,97,0.1); color: var(--color-error)">{editError}</p>
        {/if}

        <div class="flex gap-2 pt-1">
          <button type="submit" disabled={editSaving} class="flex-1 py-2.5 rounded-lg font-medium text-sm" style="background: var(--accent); color: white">
            {editSaving ? 'Saving...' : 'Save changes'}
          </button>
          <button type="button" on:click={() => showEditUser = false} class="px-4 py-2.5 rounded-lg text-sm" style="background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text-secondary)">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Set password modal (super admin) -->
{#if showSetPassword && setPasswordTarget}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-6" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px)">
    <div class="w-full max-w-md rounded-2xl p-6" style="background: var(--bg-surface); border: 1px solid var(--border); box-shadow: var(--shadow-lg)">
      <h2 class="font-semibold mb-1" style="color: var(--text-primary)">Set password</h2>
      <p class="text-sm mb-5" style="color: var(--text-muted)">for {setPasswordTarget.email}</p>

      <form on:submit|preventDefault={doSetPassword} class="space-y-4">
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">New password</label>
          <input
            type="text"
            bind:value={setPasswordValue}
            required
            minlength="8"
            placeholder="Temporary password"
            class="w-full px-3 py-2.5 rounded-lg text-sm outline-none font-mono"
            style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
          />
          <p class="text-xs mt-1" style="color: var(--text-faint)">User will be prompted to change this on next login.</p>
        </div>

        {#if setPasswordError}
          <p class="text-xs px-3 py-2 rounded-lg" style="background: rgba(239,100,97,0.1); color: var(--color-error)">{setPasswordError}</p>
        {/if}

        <div class="flex gap-2 pt-1">
          <button type="submit" disabled={setPasswordSaving} class="flex-1 py-2.5 rounded-lg font-medium text-sm" style="background: var(--accent); color: white">
            {setPasswordSaving ? 'Setting...' : 'Set password'}
          </button>
          <button type="button" on:click={() => showSetPassword = false} class="px-4 py-2.5 rounded-lg text-sm" style="background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text-secondary)">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Delete confirmation -->
{#if showDeleteConfirm && deleteTarget}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-6" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px)">
    <div class="w-full max-w-sm rounded-2xl p-6" style="background: var(--bg-surface); border: 1px solid var(--border); box-shadow: var(--shadow-lg)">
      <h2 class="font-semibold mb-2" style="color: var(--text-primary)">Delete user?</h2>
      <p class="text-sm mb-5" style="color: var(--text-muted)">
        This will permanently delete <strong>{deleteTarget.email}</strong> and all their sessions. This cannot be undone.
      </p>

      <div class="flex gap-2">
        <button
          on:click={doDeleteUser}
          disabled={deleting}
          class="flex-1 py-2.5 rounded-lg font-medium text-sm"
          style="background: var(--color-error, #dc2626); color: white"
        >
          {deleting ? 'Deleting...' : 'Delete user'}
        </button>
        <button
          on:click={() => showDeleteConfirm = false}
          class="px-4 py-2.5 rounded-lg text-sm"
          style="background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text-secondary)"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
{/if}
