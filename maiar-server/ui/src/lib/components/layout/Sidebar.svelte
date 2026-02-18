<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import ParticleField from '$lib/components/ui/ParticleField.svelte'
  import Toggle from '$lib/components/ui/Toggle.svelte'
  import { user, isAdmin, isClientAdmin } from '$lib/stores/auth'
  import { auth } from '$lib/api/client'
  import {
    MessageSquare, FileText, Send, BookOpen, Target,
    Microscope, Layout, Settings, LogOut, Shield, Layers
  } from 'lucide-svelte'
  import WizardIcon from '$lib/components/ui/WizardIcon.svelte'

  export let onClose: (() => void) | null = null

  const navItems = [
    { label: 'Chat',      href: '/chat',              icon: MessageSquare, section: 'workspace' },
    { label: 'Drafts',    href: '/assets/drafts',     icon: FileText,      section: 'work' },
    { label: 'Published', href: '/assets/published',  icon: Send,          section: 'work' },
    { label: 'Assets',    href: '/creations',         icon: Layers,        section: 'creations' },
    { label: 'Campaigns', href: '/campaigns',          icon: Target,        section: 'creations' },
    { label: 'Research',  href: '/assets/research',   icon: Microscope,    section: 'creations' },
    { label: 'Templates', href: '/assets/templates',  icon: Layout,        section: 'context' },
    { label: 'Context',   href: '/context',           icon: BookOpen,      section: 'context' },
    { label: 'Settings',  href: '/settings',          icon: Settings,      section: 'account' },
  ]

  const sectionLabels: Record<string, string> = {
    work: 'Work',
    creations: 'Creations',
    context: 'My Business',
    account: 'Account'
  }

  async function handleLogout() {
    onClose?.()
    await auth.logout()
    user.set(null)
    goto('/login')
  }
</script>

<aside
  class="relative flex flex-col h-full overflow-hidden select-none"
  style="width: var(--sidebar-width); background: var(--bg-surface); border-right: 1px solid var(--border-subtle); flex-shrink: 0"
>
  <!-- Particle background -->
  <ParticleField />

  <!-- Logo -->
  <div class="relative z-10 px-5 pt-5 pb-4" style="border-bottom: 1px solid var(--border-subtle)">
    <div class="flex items-center gap-2.5">
      <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background: var(--accent); box-shadow: var(--shadow-glow)">
        <WizardIcon size={15} />
      </div>
      <span class="font-decorative tracking-tight" style="color: var(--text-primary); font-size: 1.05rem">Maiar</span>
      <span class="text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider" style="background: var(--accent-muted); color: var(--accent-light)">Beta</span>
    </div>
  </div>

  <!-- Navigation -->
  <nav class="relative z-10 flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
    {#each ['workspace', 'work', 'creations', 'context', 'account'] as section}
      {@const sectionItems = navItems.filter(i => i.section === section)}
      {#if section !== 'workspace'}
        <div class="px-2 pt-3 pb-1">
          <span class="text-xs font-semibold uppercase tracking-wider" style="color: var(--text-faint)">
            {sectionLabels[section] ?? section}
          </span>
        </div>
      {/if}
      {#each sectionItems as item}
        {@const active = $page.url.pathname === item.href || $page.url.pathname.startsWith(item.href + '/')}
        <a
          href={item.href}
          on:click={() => onClose?.()}
          class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150 group"
          style="
            background: {active ? 'var(--accent-muted)' : 'transparent'};
            color: {active ? 'var(--accent-light)' : 'var(--text-secondary)'};
            border-left: 2px solid {active ? 'var(--accent)' : 'transparent'};
          "
        >
          <svelte:component this={item.icon} size={16} />
          <span class="text-sm font-medium">{item.label}</span>
        </a>
      {/each}
    {/each}

    {#if $isClientAdmin}
      <div class="px-2 pt-3 pb-1">
        <span class="text-xs font-semibold uppercase tracking-wider" style="color: var(--text-faint)">Admin</span>
      </div>
      <a
        href="/admin"
        on:click={() => onClose?.()}
        class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150"
        style="color: var(--text-secondary)"
      >
        <Shield size={16} />
        <span class="text-sm font-medium">{$isAdmin ? 'Dashboard' : 'Team'}</span>
      </a>
    {/if}
  </nav>

  <!-- Bottom bar -->
  <div class="relative z-10 px-3 py-3 space-y-2" style="border-top: 1px solid var(--border-subtle)">
    <Toggle />
    <div class="flex items-center justify-between px-1">
      <div class="flex items-center gap-2 min-w-0">
        <div class="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-semibold" style="background: var(--accent-muted); color: var(--accent-light)">
          {($user?.name || $user?.email || '?')[0].toUpperCase()}
        </div>
        <span class="text-xs truncate" style="color: var(--text-faint)">
          {$user?.name || $user?.email}
        </span>
      </div>
      <button
        on:click={handleLogout}
        class="p-1 rounded transition-colors"
        style="color: var(--text-muted)"
        title="Log out"
      >
        <LogOut size={14} />
      </button>
    </div>
  </div>
</aside>
