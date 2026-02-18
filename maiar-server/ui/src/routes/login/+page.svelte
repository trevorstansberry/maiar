<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { user } from '$lib/stores/auth'
  import { auth } from '$lib/api/client'
  import WizardIcon from '$lib/components/ui/WizardIcon.svelte'

  let email = ''
  let password = ''
  let loading = false
  let error = ''
  let showPassword = false

  $: resetSuccess = $page.url.searchParams.get('reset') === 'true'

  async function handleSubmit() {
    loading = true
    error = ''
    try {
      const { user: u } = await auth.login(email, password) as any
      user.set(u)
      goto('/chat')
    } catch (err: any) {
      error = err.message ?? 'Invalid credentials'
    } finally {
      loading = false
    }
  }
</script>

<svelte:head><title>Sign in — Maiar</title></svelte:head>

<div
  class="min-h-screen flex items-center justify-center p-6"
  style="background: var(--bg-base)"
>
  <!-- Background gradient orb -->
  <div
    class="fixed inset-0 pointer-events-none"
    style="background: radial-gradient(ellipse 60% 50% at 50% 10%, rgba(194,101,42,0.12) 0%, transparent 70%)"
  />

  <div class="w-full max-w-sm relative">
    <!-- Logo -->
    <div class="flex justify-center mb-8">
      <div class="flex flex-col items-center gap-3">
        <div
          class="w-12 h-12 rounded-2xl flex items-center justify-center"
          style="background: var(--accent); box-shadow: var(--shadow-glow)"
        >
          <WizardIcon size={22} />
        </div>
        <div class="text-center">
          <h1 class="text-xl font-semibold" style="color: var(--text-primary)">Maiar</h1>
          <p class="text-sm mt-0.5 font-decorative" style="color: var(--text-muted)">Your AI marketing workspace</p>
        </div>
      </div>
    </div>

    <!-- Card -->
    <div
      class="glass rounded-2xl p-7"
      style="box-shadow: var(--shadow-lg)"
    >
      {#if resetSuccess}
        <p class="text-xs px-3 py-2 rounded-lg mb-4" style="background: rgba(34,197,94,0.1); color: #22c55e">
          Password reset successfully. Sign in with your new password.
        </p>
      {/if}

      <h2 class="text-base font-semibold mb-5" style="color: var(--text-primary)">Sign in</h2>

      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Email</label>
          <input
            type="email"
            bind:value={email}
            required
            autocomplete="email"
            class="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
            style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Password</label>
          <div class="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              bind:value={password}
              required
              autocomplete="current-password"
              class="w-full px-3 py-2.5 pr-10 rounded-lg text-sm outline-none transition-all"
              style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
              placeholder="••••••••"
            />
            <button
              type="button"
              on:click={() => showPassword = !showPassword}
              class="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded opacity-50 hover:opacity-100 transition-opacity"
              style="color: var(--text-muted)"
              tabindex="-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {#if showPassword}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {/if}
            </button>
          </div>
        </div>

        {#if error}
          <p class="text-xs px-3 py-2 rounded-lg" style="background: rgba(239,100,97,0.1); color: var(--color-error)">
            {error}
          </p>
        {/if}

        <button
          type="submit"
          disabled={loading || !email || !password}
          class="w-full py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
          style="background: var(--accent); color: white; box-shadow: var(--shadow-glow)"
        >
          {#if loading}
            <span class="inline-flex items-center gap-2">
              <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Signing in...
            </span>
          {:else}
            Sign in
          {/if}
        </button>
      </form>
    </div>

    <p class="text-center text-xs mt-4" style="color: var(--text-faint)">
      <a href="/forgot-password" class="hover:underline" style="color: var(--text-muted)">Forgot password?</a>
      <span class="mx-1.5">&middot;</span>
      Access is by invitation only.
    </p>
  </div>
</div>
