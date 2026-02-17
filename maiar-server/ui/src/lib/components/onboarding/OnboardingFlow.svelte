<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { user } from '$lib/stores/auth'
  import { onboarding } from '$lib/api/client'

  const dispatch = createEventDispatcher<{ start: string }>()

  let step = 1
  let brandUrl = ''
  let productStructure: 'single' | 'multi' | null = null
  let urlError = ''

  function validateUrl(val: string): boolean {
    try {
      const u = new URL(val.startsWith('http') ? val : `https://${val}`)
      return u.hostname.includes('.')
    } catch {
      return false
    }
  }

  function handleUrlSubmit() {
    const normalised = brandUrl.trim().startsWith('http')
      ? brandUrl.trim()
      : `https://${brandUrl.trim()}`

    if (!validateUrl(normalised)) {
      urlError = 'Please enter a valid website URL'
      return
    }
    brandUrl = normalised
    urlError = ''
    step = 3
  }

  async function handleStructureSelect(structure: 'single' | 'multi') {
    productStructure = structure

    const structureNote =
      structure === 'single'
        ? '(single product)'
        : '(multi-product business — I have multiple products or lines)'

    // Mark onboarding complete immediately
    await onboarding.complete().catch(() => {})

    // Update the local user store so the wizard dismisses without a page reload
    if ($user) {
      user.set({ ...$user, onboardingComplete: true })
    }

    // Fire the chat message
    dispatch('start', `/brand-research ${brandUrl} ${structureNote}`)
  }

  async function handleSkip() {
    await onboarding.complete().catch(() => {})
    if ($user) {
      user.set({ ...$user, onboardingComplete: true })
    }
  }
</script>

<div class="flex flex-col items-center justify-center h-full gap-6 text-center px-4">
  {#if step === 1}
    <!-- Welcome -->
    <div class="flex flex-col items-center gap-5 max-w-md fade-in-up">
      <div
        class="w-16 h-16 rounded-2xl flex items-center justify-center"
        style="background: var(--accent-muted); border: 1px solid var(--border)"
      >
        <span style="font-size: 2rem">✦</span>
      </div>

      <div>
        <p class="text-2xl font-semibold mb-2" style="color: var(--text-primary)">
          Let's set up your brand
        </p>
        <p class="text-sm leading-relaxed" style="color: var(--text-muted)">
          Maiar works best when it knows your brand voice, audience, and goals.<br />
          Setup takes about 2 minutes and everything is saved for every session.
        </p>
      </div>

      <div class="flex flex-col gap-2 w-full max-w-xs">
        <button
          on:click={() => (step = 2)}
          class="w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          style="background: var(--accent); color: white; box-shadow: 0 0 20px rgba(108,99,255,0.3)"
        >
          Get Started →
        </button>
        <button
          on:click={handleSkip}
          class="text-xs transition-colors"
          style="color: var(--text-faint)"
        >
          Skip for now — I'll set this up later
        </button>
      </div>
    </div>

  {:else if step === 2}
    <!-- Brand URL -->
    <div class="flex flex-col items-center gap-5 max-w-md fade-in-up w-full">
      <div>
        <p class="text-xl font-semibold mb-1" style="color: var(--text-primary)">
          What's your website?
        </p>
        <p class="text-sm" style="color: var(--text-muted)">
          Maiar will research your brand and pre-fill your context files automatically.
        </p>
      </div>

      <div class="w-full max-w-sm flex flex-col gap-2">
        <input
          bind:value={brandUrl}
          type="text"
          placeholder="https://yourcompany.com"
          on:keydown={(e) => e.key === 'Enter' && handleUrlSubmit()}
          class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
          style="
            background: var(--bg-elevated);
            border: 1px solid {urlError ? 'var(--color-error)' : 'var(--border)'};
            color: var(--text-primary);
          "
          autofocus
        />
        {#if urlError}
          <p class="text-xs text-left" style="color: var(--color-error)">{urlError}</p>
        {/if}
      </div>

      <div class="flex flex-col gap-2 w-full max-w-sm">
        <button
          on:click={handleUrlSubmit}
          disabled={!brandUrl.trim()}
          class="w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          style="background: var(--accent); color: white"
        >
          Analyze my brand →
        </button>
        <button
          on:click={() => (step = 1)}
          class="text-xs transition-colors"
          style="color: var(--text-faint)"
        >
          ← Back
        </button>
      </div>
    </div>

  {:else if step === 3}
    <!-- Product structure -->
    <div class="flex flex-col items-center gap-5 max-w-md fade-in-up">
      <div>
        <p class="text-xl font-semibold mb-1" style="color: var(--text-primary)">
          How is your product structured?
        </p>
        <p class="text-sm" style="color: var(--text-muted)">
          This helps Maiar organise your context the right way from the start.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-3 w-full max-w-sm">
        <button
          on:click={() => handleStructureSelect('single')}
          class="flex flex-col items-center gap-2 p-5 rounded-xl text-sm text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
          style="background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text-primary)"
        >
          <span style="font-size: 1.75rem">◈</span>
          <span class="font-semibold">One product</span>
          <span class="text-xs" style="color: var(--text-muted)">Single offering or service</span>
        </button>

        <button
          on:click={() => handleStructureSelect('multi')}
          class="flex flex-col items-center gap-2 p-5 rounded-xl text-sm text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
          style="background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text-primary)"
        >
          <span style="font-size: 1.75rem">⊞</span>
          <span class="font-semibold">Multiple products</span>
          <span class="text-xs" style="color: var(--text-muted)">Separate lines or offerings</span>
        </button>
      </div>

      <button
        on:click={() => (step = 2)}
        class="text-xs transition-colors"
        style="color: var(--text-faint)"
      >
        ← Back
      </button>
    </div>
  {/if}
</div>
