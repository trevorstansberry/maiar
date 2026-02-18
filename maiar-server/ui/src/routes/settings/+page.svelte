<script lang="ts">
  import { onMount } from 'svelte'
  import { profile as profileApi, auth as authApi, persona as personaApi } from '$lib/api/client'
  import { user, isClientAdmin } from '$lib/stores/auth'
  import { Camera, User, Building2, Lock, Check, AlertCircle, Bot, Sparkles, Search } from 'lucide-svelte'

  // All available skills grouped by category
  const SKILL_CATEGORIES: Array<{ name: string; skills: string[] }> = [
    { name: 'Conversion Optimization', skills: ['page-cro', 'form-cro', 'signup-flow-cro', 'onboarding-cro', 'paywall-upgrade-cro', 'popup-cro', 'ab-test-setup'] },
    { name: 'Content & Copy', skills: ['copywriting', 'copy-editing', 'content-strategy', 'content-marketing', 'social-content', 'video-marketing', 'podcast-marketing'] },
    { name: 'SEO & Discovery', skills: ['seo-audit', 'programmatic-seo', 'schema-markup', 'sem-ppc'] },
    { name: 'Email', skills: ['email-sequence', 'email-marketing'] },
    { name: 'Paid & Distribution', skills: ['paid-ads', 'affiliate-marketing', 'direct-mail'] },
    { name: 'Strategy & Growth', skills: ['marketing-ideas', 'marketing-psychology', 'launch-strategy', 'pricing-strategy', 'product-marketing-context', 'product-marketing', 'growth-marketing', 'performance-marketing', 'brand-marketing', 'growth-lead'] },
    { name: 'Inbound / Outbound', skills: ['inbound-marketing', 'outbound-marketing', 'referral-program', 'free-tool-strategy', 'competitor-alternatives'] },
    { name: 'Social & Community', skills: ['social-media-marketing', 'community-marketing', 'influencer-marketing', 'conversational-marketing'] },
    { name: 'B2B / Enterprise', skills: ['b2b-marketing', 'abm', 'partner-channel-marketing', 'field-marketing', 'events-experiential'] },
    { name: 'B2C / Consumer', skills: ['b2c-marketing', 'retention-lifecycle', 'cause-marketing', 'guerrilla-marketing'] },
    { name: 'Analytics', skills: ['analytics-tracking', 'performance-analytics'] }
  ]

  // Profile state
  let profileData = {
    name: '',
    email: '',
    avatarUrl: null as string | null,
    companyName: '',
    companyWebsite: '',
    companyLogo: null as string | null
  }
  let saving = false
  let saveSuccess = false

  // Password change state
  let currentPassword = ''
  let newPassword = ''
  let confirmPassword = ''
  let passwordSaving = false
  let passwordError = ''
  let passwordSuccess = false

  // Avatar state
  let avatarInput: HTMLInputElement
  let logoInput: HTMLInputElement
  let uploadingAvatar = false
  let uploadingLogo = false

  // Bot persona state
  let personaData = { botName: '', botPersonality: '' }
  let workspaceId = ''
  let personaSaving = false
  let personaSuccess = false

  // Priority skills state
  let selectedSkills: Set<string> = new Set()
  let skillSearch = ''
  let skillsSaving = false
  let skillsSuccess = false

  onMount(async () => {
    try {
      const data = await profileApi.get()
      profileData = {
        name: data.name ?? '',
        email: data.email ?? '',
        avatarUrl: data.avatarUrl,
        companyName: data.companyName ?? '',
        companyWebsite: data.companyWebsite ?? '',
        companyLogo: data.companyLogo
      }
    } catch {}

    // Load persona + priority skills for admin users
    if ($isClientAdmin) {
      try {
        const workspace = await personaApi.getMyWorkspace()
        workspaceId = workspace.id
        personaData = {
          botName: workspace.botName ?? '',
          botPersonality: workspace.botPersonality ?? ''
        }
        const skills = JSON.parse(workspace.prioritySkills ?? '[]')
        selectedSkills = new Set(skills)
      } catch {}
    }
  })

  async function saveProfile() {
    saving = true
    saveSuccess = false
    try {
      await profileApi.update({
        name: profileData.name,
        companyName: profileData.companyName,
        companyWebsite: profileData.companyWebsite
      })
      // Update session user store with new name
      user.update(u => u ? { ...u, name: profileData.name || null } : u)
      saveSuccess = true
      setTimeout(() => saveSuccess = false, 3000)
    } catch {}
    saving = false
  }

  async function changePassword() {
    passwordSaving = true
    passwordError = ''
    passwordSuccess = false

    if (newPassword !== confirmPassword) {
      passwordError = 'Passwords do not match'
      passwordSaving = false
      return
    }

    try {
      await authApi.changePassword(currentPassword, newPassword)
      passwordSuccess = true
      currentPassword = ''
      newPassword = ''
      confirmPassword = ''
      // Clear mustChangePassword banner
      user.update(u => u ? { ...u, mustChangePassword: false } : u)
      setTimeout(() => passwordSuccess = false, 3000)
    } catch (err: any) {
      passwordError = err.message
    }
    passwordSaving = false
  }

  async function savePersona() {
    personaSaving = true
    personaSuccess = false
    try {
      await personaApi.update(workspaceId, {
        botName: personaData.botName || undefined,
        botPersonality: personaData.botPersonality || undefined
      })
      // Update session user store so persona is reflected immediately
      user.update(u => u ? { ...u, botName: personaData.botName || null, botPersonality: personaData.botPersonality || null } : u)
      personaSuccess = true
      setTimeout(() => personaSuccess = false, 3000)
    } catch {}
    personaSaving = false
  }

  async function handleAvatarUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    uploadingAvatar = true
    try {
      const result = await profileApi.uploadAvatar(file)
      profileData.avatarUrl = result.avatarUrl + '?t=' + Date.now()
    } catch {}
    uploadingAvatar = false
  }

  async function handleLogoUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    uploadingLogo = true
    try {
      const result = await profileApi.uploadCompanyLogo(file)
      profileData.companyLogo = result.companyLogo + '?t=' + Date.now()
    } catch {}
    uploadingLogo = false
  }

  function passwordStrength(pw: string): { label: string; color: string } {
    if (!pw) return { label: '', color: '' }
    const score = [pw.length >= 8, pw.length >= 12, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^a-zA-Z0-9]/.test(pw)].filter(Boolean).length
    if (score <= 2) return { label: 'Weak', color: 'var(--color-error)' }
    if (score <= 3) return { label: 'Fair', color: 'var(--color-warning)' }
    return { label: 'Strong', color: 'var(--color-success)' }
  }

  $: strength = passwordStrength(newPassword)

  function toggleSkill(slug: string) {
    if (selectedSkills.has(slug)) {
      selectedSkills.delete(slug)
    } else {
      selectedSkills.add(slug)
    }
    selectedSkills = selectedSkills // trigger reactivity
  }

  $: filteredCategories = skillSearch
    ? SKILL_CATEGORIES.map(cat => ({
        ...cat,
        skills: cat.skills.filter(s => s.includes(skillSearch.toLowerCase()))
      })).filter(cat => cat.skills.length > 0)
    : SKILL_CATEGORIES

  function formatSkillName(slug: string): string {
    return slug.split('-').map(w => {
      const upper = w.toUpperCase()
      if (['seo', 'cro', 'abm', 'ppc', 'sem', 'b2b', 'b2c', 'ab'].includes(w)) return upper
      return w.charAt(0).toUpperCase() + w.slice(1)
    }).join(' ')
  }

  async function saveSkills() {
    skillsSaving = true
    skillsSuccess = false
    try {
      await personaApi.updateSkills([...selectedSkills])
      skillsSuccess = true
      setTimeout(() => skillsSuccess = false, 3000)
    } catch {}
    skillsSaving = false
  }
</script>

<svelte:head><title>Settings — Maiar</title></svelte:head>

<div class="h-full overflow-y-auto p-6">
  <div class="max-w-2xl mx-auto space-y-6">
    <h1 class="text-xl font-semibold" style="color: var(--text-primary)">Settings</h1>

    <!-- Personal section -->
    <section class="glass rounded-xl p-6">
      <div class="flex items-center gap-2 mb-5">
        <User size={16} style="color: var(--accent-light)" />
        <h2 class="text-sm font-semibold uppercase tracking-wider" style="color: var(--text-faint)">Personal</h2>
      </div>

      <!-- Avatar -->
      <div class="flex items-center gap-4 mb-5">
        <button
          on:click={() => avatarInput.click()}
          class="relative w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shrink-0 group"
          style="background: var(--accent-muted); border: 2px solid var(--border)"
          disabled={uploadingAvatar}
        >
          {#if profileData.avatarUrl}
            <img src={profileData.avatarUrl} alt="Avatar" class="w-full h-full object-cover" />
          {:else}
            <span class="text-xl font-bold" style="color: var(--accent-light)">
              {(profileData.name || profileData.email || '?')[0].toUpperCase()}
            </span>
          {/if}
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style="background: rgba(0,0,0,0.5)">
            <Camera size={18} color="white" />
          </div>
        </button>
        <input bind:this={avatarInput} type="file" accept="image/jpeg,image/png,image/webp" on:change={handleAvatarUpload} class="hidden" />
        <div class="text-xs" style="color: var(--text-muted)">
          {uploadingAvatar ? 'Uploading...' : 'Click to upload (JPEG, PNG, or WebP, max 2MB)'}
        </div>
      </div>

      <!-- Name + Email -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Name</label>
          <input
            type="text"
            bind:value={profileData.name}
            placeholder="Your name"
            class="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
          />
        </div>
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Email</label>
          <input
            type="email"
            value={profileData.email}
            disabled
            class="w-full px-3 py-2.5 rounded-lg text-sm outline-none opacity-60"
            style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
          />
        </div>
      </div>

      <!-- Save -->
      <div class="flex items-center gap-3">
        <button
          on:click={saveProfile}
          disabled={saving}
          class="px-4 py-2 rounded-lg text-sm font-medium"
          style="background: var(--accent); color: white"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
        {#if saveSuccess}
          <span class="flex items-center gap-1 text-xs" style="color: var(--color-success)">
            <Check size={14} />
            Saved
          </span>
        {/if}
      </div>
    </section>

    <!-- Change Password section -->
    <section class="glass rounded-xl p-6">
      <div class="flex items-center gap-2 mb-5">
        <Lock size={16} style="color: var(--accent-light)" />
        <h2 class="text-sm font-semibold uppercase tracking-wider" style="color: var(--text-faint)">Change Password</h2>
      </div>

      <div class="space-y-4 max-w-sm">
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="text-xs font-medium" style="color: var(--text-secondary)">Current password</label>
            <a href="/forgot-password" class="text-[11px]" style="color: var(--accent-light)">Forgot password?</a>
          </div>
          <input
            type="password"
            bind:value={currentPassword}
            class="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
          />
        </div>
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">New password</label>
          <input
            type="password"
            bind:value={newPassword}
            class="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
          />
          {#if strength.label}
            <div class="flex items-center gap-2 mt-1.5">
              <div class="h-1 flex-1 rounded-full overflow-hidden" style="background: var(--bg-elevated)">
                <div
                  class="h-full rounded-full transition-all"
                  style="background: {strength.color}; width: {strength.label === 'Weak' ? '33%' : strength.label === 'Fair' ? '66%' : '100%'}"
                ></div>
              </div>
              <span class="text-[10px] font-medium" style="color: {strength.color}">{strength.label}</span>
            </div>
          {/if}
        </div>
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Confirm new password</label>
          <input
            type="password"
            bind:value={confirmPassword}
            class="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
          />
        </div>

        {#if passwordError}
          <p class="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg" style="background: rgba(239,100,97,0.1); color: var(--color-error)">
            <AlertCircle size={12} />
            {passwordError}
          </p>
        {/if}

        <div class="flex items-center gap-3">
          <button
            on:click={changePassword}
            disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
            class="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
            style="background: var(--accent); color: white"
          >
            {passwordSaving ? 'Changing...' : 'Change password'}
          </button>
          {#if passwordSuccess}
            <span class="flex items-center gap-1 text-xs" style="color: var(--color-success)">
              <Check size={14} />
              Password changed
            </span>
          {/if}
        </div>
      </div>
    </section>

    <!-- Assistant Persona section (admin only) -->
    {#if $isClientAdmin}
    <section class="glass rounded-xl p-6">
      <div class="flex items-center gap-2 mb-5">
        <Bot size={16} style="color: var(--accent-light)" />
        <h2 class="text-sm font-semibold uppercase tracking-wider" style="color: var(--text-faint)">Assistant Persona</h2>
      </div>

      <p class="text-xs mb-4" style="color: var(--text-muted)">
        Customize how the assistant introduces itself and responds in chat. All users in this workspace will see this persona.
      </p>

      <div class="space-y-4 mb-4">
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Assistant name</label>
          <input
            type="text"
            bind:value={personaData.botName}
            placeholder="Maiar"
            class="w-full px-3 py-2.5 rounded-lg text-sm outline-none max-w-xs"
            style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
          />
        </div>
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Personality</label>
          <textarea
            bind:value={personaData.botPersonality}
            placeholder="A friendly, knowledgeable marketing strategist who speaks with warmth and confidence..."
            rows={3}
            class="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
            style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
          ></textarea>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          on:click={savePersona}
          disabled={personaSaving}
          class="px-4 py-2 rounded-lg text-sm font-medium"
          style="background: var(--accent); color: white"
        >
          {personaSaving ? 'Saving...' : 'Save persona'}
        </button>
        {#if personaSuccess}
          <span class="flex items-center gap-1 text-xs" style="color: var(--color-success)">
            <Check size={14} />
            Saved
          </span>
        {/if}
      </div>
    </section>
    {/if}

    <!-- Priority Skills section (admin only) -->
    {#if $isClientAdmin}
    <section class="glass rounded-xl p-6">
      <div class="flex items-center gap-2 mb-2">
        <Sparkles size={16} style="color: var(--accent-light)" />
        <h2 class="text-sm font-semibold uppercase tracking-wider" style="color: var(--text-faint)">Priority Skills</h2>
      </div>

      <p class="text-xs mb-4" style="color: var(--text-muted)">
        Skills selected here are always active in every conversation, even without a slash command. They complement command-specific skills.
      </p>

      {#if selectedSkills.size > 0}
        <div class="flex items-center gap-1.5 flex-wrap mb-4">
          <span class="text-[10px] font-semibold uppercase tracking-wider" style="color: var(--text-faint)">{selectedSkills.size} active</span>
          {#each [...selectedSkills] as slug}
            <button
              on:click={() => toggleSkill(slug)}
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors hover:opacity-80"
              style="background: var(--accent-muted); color: var(--accent-light); border: 1px solid var(--accent)"
            >
              {formatSkillName(slug)}
              <span class="ml-0.5 opacity-60">x</span>
            </button>
          {/each}
        </div>
      {/if}

      <!-- Search -->
      <div class="relative mb-3">
        <Search size={14} class="absolute left-3 top-1/2 -translate-y-1/2" style="color: var(--text-faint)" />
        <input
          type="text"
          bind:value={skillSearch}
          placeholder="Search skills..."
          class="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
          style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
        />
      </div>

      <!-- Grouped skill checkboxes -->
      <div class="max-h-64 overflow-y-auto space-y-3 mb-4" style="scrollbar-width: thin">
        {#each filteredCategories as category}
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wider mb-1.5 px-1" style="color: var(--text-faint)">{category.name}</p>
            <div class="flex flex-wrap gap-1.5">
              {#each category.skills as skill}
                <button
                  on:click={() => toggleSkill(skill)}
                  class="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all"
                  style="
                    background: {selectedSkills.has(skill) ? 'var(--accent-muted)' : 'var(--bg-elevated)'};
                    border: 1px solid {selectedSkills.has(skill) ? 'var(--accent)' : 'var(--border-subtle)'};
                    color: {selectedSkills.has(skill) ? 'var(--accent-light)' : 'var(--text-muted)'}
                  "
                >
                  {formatSkillName(skill)}
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <div class="flex items-center gap-3">
        <button
          on:click={saveSkills}
          disabled={skillsSaving}
          class="px-4 py-2 rounded-lg text-sm font-medium"
          style="background: var(--accent); color: white"
        >
          {skillsSaving ? 'Saving...' : 'Save skills'}
        </button>
        {#if skillsSuccess}
          <span class="flex items-center gap-1 text-xs" style="color: var(--color-success)">
            <Check size={14} />
            Saved
          </span>
        {/if}
      </div>
    </section>
    {/if}

    <!-- Company section -->
    <section class="glass rounded-xl p-6">
      <div class="flex items-center gap-2 mb-5">
        <Building2 size={16} style="color: var(--accent-light)" />
        <h2 class="text-sm font-semibold uppercase tracking-wider" style="color: var(--text-faint)">Company</h2>
      </div>

      <!-- Company logo -->
      <div class="flex items-center gap-4 mb-5">
        <button
          on:click={() => logoInput.click()}
          class="relative w-14 h-14 rounded-lg overflow-hidden flex items-center justify-center shrink-0 group"
          style="background: var(--bg-elevated); border: 2px solid var(--border)"
          disabled={uploadingLogo}
        >
          {#if profileData.companyLogo}
            <img src={profileData.companyLogo} alt="Company logo" class="w-full h-full object-cover" />
          {:else}
            <Building2 size={20} style="color: var(--text-faint)" />
          {/if}
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style="background: rgba(0,0,0,0.5)">
            <Camera size={16} color="white" />
          </div>
        </button>
        <input bind:this={logoInput} type="file" accept="image/jpeg,image/png,image/webp" on:change={handleLogoUpload} class="hidden" />
        <div class="text-xs" style="color: var(--text-muted)">
          {uploadingLogo ? 'Uploading...' : 'Company logo'}
        </div>
      </div>

      <!-- Company fields -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Company name</label>
          <input
            type="text"
            bind:value={profileData.companyName}
            placeholder="Acme Corp"
            class="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
          />
        </div>
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color: var(--text-secondary)">Website</label>
          <input
            type="url"
            bind:value={profileData.companyWebsite}
            placeholder="https://acme.com"
            class="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary)"
          />
        </div>
      </div>

      <!-- Save (shared with personal save) -->
      <button
        on:click={saveProfile}
        disabled={saving}
        class="px-4 py-2 rounded-lg text-sm font-medium"
        style="background: var(--accent); color: white"
      >
        {saving ? 'Saving...' : 'Save changes'}
      </button>
    </section>
  </div>
</div>
