<script lang="ts">
  import { chat } from '$lib/stores/chat'
  import { botDisplayName } from '$lib/stores/auth'
  import { COMMANDS } from '$lib/utils/commandList'
  import { Bot, Zap, Check, Circle } from 'lucide-svelte'
  import ThinkingIndicator from './ThinkingIndicator.svelte'

  // --- Streaming mode: show the full agent chain timeline ---
  $: isStreaming = $chat.streaming
  $: chain = $chat.agentChain
  $: streamingSkills = $chat.activeSkills

  // --- Post-completion: collect unique agents + skills from all messages ---
  // Only recompute when streaming stops (not on every delta during streaming)
  let sessionAgents: Array<{ name: string; slug: string }> = []
  let sessionSkills: string[] = []
  let lastMessageCount = 0

  $: if (!isStreaming && $chat.messages.length !== lastMessageCount) {
    lastMessageCount = $chat.messages.length
    const seenAgents = new Set<string>()
    const agents: Array<{ name: string; slug: string }> = []
    const seenSkills = new Set<string>()
    const skills: string[] = []
    for (const msg of $chat.messages) {
      if (msg.agentSteps) {
        for (const step of msg.agentSteps) {
          const key = step.agentSlug ?? step.name
          if (!seenAgents.has(key)) {
            seenAgents.add(key)
            agents.push({ name: step.name, slug: step.agentSlug ?? '' })
          }
        }
      }
      if (msg.role === 'user') {
        const cmdMatch = msg.content.match(/^\/([a-z-]+)/)
        if (cmdMatch) {
          const cmdName = '/' + cmdMatch[1]
          const cmd = COMMANDS.find(c => c.name === cmdName)
          if (cmd) {
            for (const skill of cmd.skills) {
              if (!seenSkills.has(skill)) {
                seenSkills.add(skill)
                skills.push(skill)
              }
            }
          }
        }
      }
    }
    sessionAgents = agents
    sessionSkills = skills
  }

  $: hasStreamingChain = isStreaming && chain && chain.length > 0
  $: hasSessionTools = !isStreaming && (sessionAgents.length > 0 || sessionSkills.length > 0)
  $: showPanel = hasStreamingChain || hasSessionTools
</script>

{#if showPanel}
  <div class="px-4 pb-3 pt-1 shrink-0">
    {#if hasStreamingChain}
      <!-- Streaming: Full agent chain timeline -->
      <div class="flex flex-col gap-1.5 rounded-lg px-3 py-2.5" style="background: var(--bg-elevated); border: 1px solid var(--border-subtle)">
        <!-- Agent timeline -->
        <div class="flex flex-col gap-1">
          {#each chain as entry}
            <div class="flex items-center gap-2 py-0.5">
              {#if entry.status === 'complete'}
                <Check size={12} style="color: var(--accent-light); opacity: 0.7" />
                <span class="text-[11px] font-medium" style="color: var(--text-muted)">{entry.name}</span>
              {:else if entry.status === 'active'}
                <span class="inline-block w-2.5 h-2.5 rounded-full animate-pulse" style="background: var(--accent)"></span>
                <span class="text-[11px] font-semibold" style="color: var(--accent-light)">{entry.name}</span>
                <span class="text-[10px]" style="color: var(--text-faint)">
                  <ThinkingIndicator />
                </span>
              {:else}
                <Circle size={10} style="color: var(--text-faint); opacity: 0.4" />
                <span class="text-[11px]" style="color: var(--text-faint)">{entry.name}</span>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Skills strip -->
        {#if streamingSkills.length > 0}
          <div class="flex items-center gap-1.5 flex-wrap pt-1" style="border-top: 1px solid var(--border-subtle)">
            <span class="text-[9px] uppercase tracking-wider font-semibold" style="color: var(--text-faint)">Skills</span>
            {#each streamingSkills as skill}
              <span
                class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium"
                style="background: rgba(91,192,235,0.08); color: rgba(91,192,235,0.8)"
              >
                <Zap size={8} />
                {skill}
              </span>
            {/each}
          </div>
        {/if}
      </div>

    {:else if hasSessionTools}
      <!-- Post-completion: compact chip strip -->
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-[10px] uppercase tracking-wider font-semibold" style="color: var(--text-faint)">
          Session tools
        </span>
        {#each sessionAgents as agent}
          <span
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
            style="background: var(--accent-muted); border: 1px solid var(--border); color: var(--accent-light)"
          >
            <Bot size={9} />
            {agent.name}
          </span>
        {/each}
        {#each sessionSkills as skill}
          <span
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
            style="background: rgba(91,192,235,0.08); border: 1px solid rgba(91,192,235,0.15); color: rgba(91,192,235,0.8)"
          >
            <Zap size={9} />
            {skill}
          </span>
        {/each}
      </div>
    {/if}
  </div>
{/if}
