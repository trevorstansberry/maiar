<script lang="ts">
  import { auth } from '$lib/api/client'
  import WizardIcon from '$lib/components/ui/WizardIcon.svelte'

  let email = ''
  let loading = false
  let submitted = false

  async function handleSubmit() {
    loading = true
    try {
      await auth.forgotPassword(email)
    } catch {
      // Silently succeed — never reveal whether the email exists
    } finally {
      loading = false
      submitted = true
    }
  }
</script>

<svelte:head><title>Forgot password — Maiar</title></svelte:head>

<div
  class="min-h-screen flex items-center justify-center p-6"
  style="background: var(--bg-base)"
>
  <div
    class="fixed inset-0 pointer-events-none"
    style="background: radial-gradient(ellipse 60% 50% at 50% 10%, rgba(194,101,42,0.12) 0%, transparent 70%)"
  ></div>

  <div class="w-full max-w-sm relative">
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
          <p class="text-sm mt-0.5" style="color: var(--text-muted)">Reset your password</p>
        </div>
      </div>
    </div>

    <div
      class="glass rounded-2xl p-7"
      style="box-shadow: var(--shadow-lg)"
    >
      {#if submitted}
        <div class="text-center py-2">
          <p class="text-sm mb-1" style="color: var(--text-primary)">Check your inbox</p>
          <p class="text-xs" style="color: var(--text-muted)">
            If that email is registered, you'll receive a reset link shortly.
          </p>
        </div>
      {:else}
        <h2 class="text-base font-semibold mb-2" style="color: var(--text-primary)">Forgot password?</h2>
        <p class="text-xs mb-5" style="color: var(--text-muted)">
          Enter your email and we'll send you a link to reset your password.
        </p>

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

          <button
            type="submit"
            disabled={loading || !email}
            class="w-full py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
            style="background: var(--accent); color: white; box-shadow: var(--shadow-glow)"
          >
            {#if loading}
              <span class="inline-flex items-center gap-2">
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Sending...
              </span>
            {:else}
              Send reset link
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
