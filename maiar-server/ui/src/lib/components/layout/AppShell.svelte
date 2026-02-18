<script lang="ts">
  import Sidebar from './Sidebar.svelte'
  import { Menu, AlertTriangle } from 'lucide-svelte'
  import { user } from '$lib/stores/auth'

  let sidebarOpen = false
</script>

<div class="flex h-screen overflow-hidden" style="background: var(--bg-base)">
  <!-- Desktop sidebar (always visible) -->
  <div class="hidden lg:block">
    <Sidebar />
  </div>

  <!-- Mobile overlay sidebar -->
  {#if sidebarOpen}
    <div class="fixed inset-0 z-50 lg:hidden">
      <button
        class="absolute inset-0 bg-black/50"
        on:click={() => sidebarOpen = false}
        aria-label="Close sidebar"
      ></button>
      <div class="relative z-10 h-full" style="width: var(--sidebar-width, 240px)">
        <Sidebar onClose={() => sidebarOpen = false} />
      </div>
    </div>
  {/if}

  <main class="flex-1 flex flex-col overflow-hidden" style="background: var(--bg-base)">
    <!-- Mobile top bar -->
    <div class="flex items-center gap-3 px-4 h-12 shrink-0 lg:hidden" style="border-bottom: 1px solid var(--border-subtle)">
      <button
        on:click={() => sidebarOpen = true}
        class="p-1.5 rounded-lg"
        style="color: var(--text-secondary)"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>
      <span class="text-sm font-decorative" style="color: var(--text-primary)">Maiar</span>
    </div>
    {#if $user?.mustChangePassword}
      <div class="px-4 py-2.5 flex items-center gap-2 text-sm shrink-0" style="background: rgba(245,166,35,0.15); border-bottom: 1px solid rgba(245,166,35,0.3); color: var(--text-primary)">
        <AlertTriangle size={15} style="color: var(--accent); flex-shrink: 0" />
        <span>Your password was set by an admin. <a href="/settings" class="underline font-medium" style="color: var(--accent-light)">Change it now</a> for security.</span>
      </div>
    {/if}
    <slot />
  </main>
</div>
