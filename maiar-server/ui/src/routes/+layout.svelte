<script lang="ts">
  import '../app.css'
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { user } from '$lib/stores/auth'
  import { auth } from '$lib/api/client'
  import AppShell from '$lib/components/layout/AppShell.svelte'

  let loaded = false

  onMount(async () => {
    const publicRoutes = ['/login']
    const isPublic = publicRoutes.some(r => $page.url.pathname.startsWith(r))

    try {
      const { user: u } = await auth.session() as any
      user.set(u)

      if ($page.url.pathname === '/' || $page.url.pathname === '') {
        goto('/chat')
      }
    } catch {
      user.set(null)
      if (!isPublic) {
        goto('/login')
      }
    }

    loaded = true
  })
</script>

{#if loaded}
  {#if $user}
    <AppShell>
      <slot />
    </AppShell>
  {:else if $page.url.pathname.startsWith('/login')}
    <slot />
  {/if}
{/if}
