<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { chat } from '$lib/stores/chat'
  import { botDisplayName } from '$lib/stores/auth'

  // Default verbs use the bot persona name
  $: defaultVerbs = [
    `${$botDisplayName} is thinking`,
    `${$botDisplayName} is composing`,
    `${$botDisplayName} is considering`,
    `${$botDisplayName} is crafting`
  ]

  const VERB_MAP: Record<string, string[]> = {
    editor: ['Editing', 'Refining', 'Polishing'],
    'seo-optimizer': ['Optimizing for SEO', 'Checking keywords', 'Analyzing search intent'],
    'meta-creator': ['Writing meta tags', 'Creating titles', 'Crafting descriptions'],
    'internal-linker': ['Finding links', 'Mapping internal links'],
    'content-analyzer': ['Analyzing content', 'Evaluating depth', 'Checking readability'],
    'cro-analyst': ['Analyzing conversions', 'Evaluating UX', 'Checking CTA placement'],
    'campaign-strategist': ['Planning campaign', 'Mapping channels', 'Building strategy'],
    'audience-analyst': ['Analyzing audience', 'Scoring fit', 'Evaluating segments'],
    'brand-strategist': ['Crafting positioning', 'Building narrative', 'Mapping differentiators'],
    'lifecycle-planner': ['Designing lifecycle', 'Mapping triggers', 'Building sequences'],
    'headline-generator': ['Writing headlines', 'Testing hooks', 'Crafting titles'],
    'landing-page-optimizer': ['Optimizing page', 'Checking layout', 'Analyzing flow'],
    performance: ['Reviewing performance', 'Analyzing metrics', 'Checking trends']
  }

  // Writing-specific verbs for content commands
  const WRITING_VERBS = ['Writing', 'Drafting', 'Creating', 'Generating']

  let currentVerb = 'Thinking'
  let verbIndex = 0
  let interval: ReturnType<typeof setInterval>

  function getVerbs(): string[] {
    const agent = $chat.activeAgent
    if (!agent) return defaultVerbs
    // Normalize agent slug
    const slug = agent.toLowerCase().replace(/\s+/g, '-')
    return VERB_MAP[slug] ?? defaultVerbs
  }

  function cycleVerb() {
    const verbs = getVerbs()
    verbIndex = (verbIndex + 1) % verbs.length
    currentVerb = verbs[verbIndex]
  }

  // Reset verb when agent changes
  $: if ($chat.activeAgent) {
    const verbs = getVerbs()
    verbIndex = 0
    currentVerb = verbs[0]
  }

  onMount(() => {
    interval = setInterval(cycleVerb, 3500)
  })

  onDestroy(() => {
    clearInterval(interval)
  })
</script>

<div class="flex items-center gap-3">
  <!-- Pulsing dot -->
  <div class="flex items-center gap-1.5">
    <span class="inline-block w-2 h-2 rounded-full animate-pulse" style="background: var(--accent)"></span>
    <span class="text-sm font-medium transition-opacity duration-300" style="color: var(--text-muted)">
      {currentVerb}...
    </span>
  </div>

  {#if $chat.activeAgent && $chat.agentSteps.length > 0}
    <span class="text-[10px] px-2 py-0.5 rounded-full font-medium" style="background: var(--accent-muted); color: var(--accent-light)">
      {$chat.activeAgent}
      {#if $chat.agentSteps.length > 1}
        ({$chat.agentSteps.length})
      {/if}
    </span>
  {/if}
</div>
