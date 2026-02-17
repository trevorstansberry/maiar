<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { auth } from '$lib/api/client'
  import { Activity } from 'lucide-svelte'

  let password = ''
  let confirmPassword = ''
  let loading = false
  let error = ''

  $: token = $page.url.searchParams.get('token') ?? ''
  $: validToken = /^[a-f0-9]{64}$/.test(token)

  // Password strength indicator
  $: hasLength = password.length >= 8
  $: hasLetter = /[a-zA-Z]/.test(password)
  $: hasNumber = /[0-9]/.test(password)
  $: meetsMinimum = hasLength && hasLetter && hasNumber
  $: isStrong = password.length >= 12 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)
  $: strengthLabel = !password ? '' : !meetsMinimum ? 'Weak' : isStrong ? 'Strong' : 'Fair'
  $: strengthColor = !password ? '' : !meetsMinimum ? 'var(--color-error, #ef6461)' : isStrong ? '#22c55e' : 'var(--accent, #ff630f)'

  $: passwordsMatch = confirmPassword && password === confirmPassword
  $: canSubmit = meetsMinimum && passwordsMatch && !loading

  async function handleSubmit() {
    if (!canSubmit) return
    loading = true
    error = ''
    try {
      await auth.resetPassword(token, password)
      goto('/login?reset=true')
    } catch (err: any) {
      error = err.message ?? 'Something went wrong'
    } finally {
      loading = false
    }
  }
</script>

<svelte:head><title>Reset password — Maiar</title></svelte:head>

<div
  class="min-h-screen flex items-center justify-center p-6"
  style="background: var(--bg-base)"
>
  <div
    class="fixed inset-0 pointer-events-none"
    style="background: radial-gradient(ellipse 60% 50% at 50% 10%, rgba(255,99,15,0.12) 0%, transparent 70%)"
  ></div>

  <div class="w-full max-w-sm relative">
    <div class="flex justify-center mb-8">
      <div class="flex flex-col items-center gap-3">
        <div
          class="w-12 h-12 rounded-2xl flex items-center justify-center"
          style="background: var(--accent); box-shadow: var(--shadow-glow)"
        >
          <Activity size={22} color="white" />
        </div>
        <div class="text-center">
          <h1 class="text-xl font-semibold" style="color: var(--text-primary)">Maiar</h1>
          <p class="text-sm mt-0.5" style="color: var(--text-muted)">Set a new password</p>
        </div>
      </div>
    </div>

    <div
      class="glass rounded-2xl p-7"
      style="box-shadow: var(--shadow-lg)"
    >
      {#if !validToken}
        <div class="text-center py-2">
          <p class="text-sm mb-1" style="color: var(--color-error, #ef6461)">Invalid reset link</p>
          <p class="text-xs" style="color: var(--text-muted)">
            This link may have expired or already been used.
          </p>
        </div>
      {:else}
        <h2 class="text-base font-semibold mb-5" style="color: var(--text-primary)">New password</h2>

        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Password</label>
            <input
              type="password"
              bind:value={password}
              required
              autocomplete="new-password"
              class="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
              style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
              placeholder="Min 8 characters"
            />
            {#if password}
              <div class="flex items-center gap-2 mt-2">
                <div class="flex-1 h-1 rounded-full" style="background: var(--border)">
                  <div
                    class="h-full rounded-full transition-all"
                    style="width: {!meetsMinimum ? '33%' : isStrong ? '100%' : '66%'}; background: {strengthColor}"
                  ></div>
                </div>
                <span class="text-xs font-medium" style="color: {strengthColor}">{strengthLabel}</span>
              </div>
            {/if}
          </div>

          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Confirm password</label>
            <input
              type="password"
              bind:value={confirmPassword}
              required
              autocomplete="new-password"
              class="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
              style="background: var(--bg-input); border: 1px solid {confirmPassword && !passwordsMatch ? 'var(--color-error, #ef6461)' : 'var(--border)'}; color: var(--text-primary)"
              placeholder="Re-enter password"
            />
            {#if confirmPassword && !passwordsMatch}
              <p class="text-xs mt-1" style="color: var(--color-error, #ef6461)">Passwords don't match</p>
            {/if}
          </div>

          {#if error}
            <p class="text-xs px-3 py-2 rounded-lg" style="background: rgba(239,100,97,0.1); color: var(--color-error, #ef6461)">
              {error}
            </p>
          {/if}

          <button
            type="submit"
            disabled={!canSubmit}
            class="w-full py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
            style="background: var(--accent); color: white; box-shadow: var(--shadow-glow)"
          >
            {#if loading}
              <span class="inline-flex items-center gap-2">
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Resetting...
              </span>
            {:else}
              Reset password
            {/if}
          </button>
        </form>
      {/if}
    </div>

    <p class="text-center text-xs mt-4">
      <a href="/login" style="color: var(--text-muted)" class="hover:underline">
        &larr; Back to sign in
      </a>
    </p>
  </div>
</div>
