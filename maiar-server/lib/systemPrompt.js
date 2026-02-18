import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { config } from './config.js'
import { loadContext } from './contextLoader.js'

const CONTENT_TAG_INSTRUCTIONS = `# Response Format

When generating substantial content (blog posts, emails, landing pages, strategies, or any deliverable the user requested), wrap ONLY the deliverable in <content> tags. Put your brief approach description and any follow-up suggestions outside the tags.

Example:
I'll create a blog post targeting mid-funnel readers looking to reduce churn.

<content>
# 5 Proven Strategies to Reduce Customer Churn
...full content here...
</content>

This blog post targets product managers experiencing high churn. Consider A/B testing the headline with a more data-driven variant.

Rules:
- Only use <content> tags when producing a deliverable (not for short answers, questions, or conversational responses)
- Everything outside <content> tags appears in the chat
- Everything inside <content> tags appears in the editor/canvas
- Keep chat text brief (1-3 sentences before, 1-3 sentences after)
- Never nest <content> tags`

let cachedCommandDefs = null

function loadCommandDefinitions() {
  if (cachedCommandDefs) return cachedCommandDefs

  const commandsDir = join(config.maiarMaster, '.claude', 'commands')
  if (!existsSync(commandsDir)) return ''

  const parts = []
  for (const file of readdirSync(commandsDir).filter(f => f.endsWith('.md')).sort()) {
    try {
      const content = readFileSync(join(commandsDir, file), 'utf8')
      parts.push(content)
    } catch {}
  }

  cachedCommandDefs = parts.join('\n\n---\n\n')
  return cachedCommandDefs
}

function loadClaudeMd() {
  const claudeMd = join(config.maiarMaster, 'CLAUDE.md')
  if (!existsSync(claudeMd)) return ''
  return readFileSync(claudeMd, 'utf8')
}

/**
 * Load a single agent's markdown prompt.
 */
function loadAgentPrompt(agentSlug) {
  const agentPath = join(config.maiarMaster, '.claude', 'agents', `${agentSlug}.md`)
  if (!existsSync(agentPath)) return ''
  try {
    return readFileSync(agentPath, 'utf8')
  } catch {
    return ''
  }
}

/**
 * Load skill files by slug. Returns concatenated skill content.
 */
export function loadSkills(skillSlugs) {
  if (!skillSlugs?.length) return ''

  const parts = []
  for (const slug of skillSlugs) {
    const skillPath = join(config.maiarMaster, '.claude', 'skills', slug, 'SKILL.md')
    if (!existsSync(skillPath)) continue
    try {
      const content = readFileSync(skillPath, 'utf8')
      parts.push(content)
    } catch {}
  }
  return parts.join('\n\n---\n\n')
}

/**
 * Sanitize client context — strip prompt injection attempts.
 */
function sanitizeContext(rawContext) {
  const injectionPattern = /^.*?(IGNORE PREVIOUS|IGNORE ALL|<\/?system>|<\/s>|\[SYSTEM|\[INST\]|###\s*SYSTEM)/im
  return rawContext
    .split('\n')
    .filter(line => !injectionPattern.test(line))
    .join('\n')
}

/**
 * Load a single command's markdown file.
 */
function loadSingleCommand(commandSlug) {
  // commandSlug comes as "/write" → strip leading slash for filename
  const filename = commandSlug.replace(/^\//, '') + '.md'
  const commandPath = join(config.maiarMaster, '.claude', 'commands', filename)
  if (!existsSync(commandPath)) return ''
  try {
    return readFileSync(commandPath, 'utf8')
  } catch {
    return ''
  }
}

/**
 * Build persona preamble for system prompt.
 * @param {object|null} persona - { botName, botPersonality }
 */
function buildPersonaSection(persona) {
  if (!persona?.botName) return ''
  const lines = [`# Your Identity\n\nYou are ${persona.botName}, a marketing assistant powered by specialized agents and skills.`]
  if (persona.botPersonality) {
    lines.push(persona.botPersonality)
  }
  lines.push('Maintain this personality throughout all interactions. Guide users naturally toward their goals. Never mention slash commands — the system handles routing automatically.')
  return lines.join(' ')
}

/**
 * Merge command-level skills with workspace priority skills, deduplicating.
 */
function mergeSkills(commandSkills = [], prioritySkills = []) {
  const seen = new Set(commandSkills)
  const merged = [...commandSkills]
  for (const slug of prioritySkills) {
    if (!seen.has(slug)) {
      merged.push(slug)
      seen.add(slug)
    }
  }
  return merged
}

const MAIAR_AGENT_IDENTITY = `# Your Role

You are the primary marketing assistant for this workspace. You are a seasoned marketing strategist with deep expertise across every discipline — content, SEO, email, social, paid, brand, growth, ABM, and more.

## How to Respond

**For questions and advice:** Answer directly and conversationally. Draw on your marketing expertise. Be specific, actionable, and opinionated — you're the expert. Do NOT produce long-form documents or open the editor for simple questions. Keep it in the chat.

**When you spot an opportunity to create something:** Propose it naturally. For example:
- "That's a great angle for a blog post. Want me to write one?"
- "I could put together a full campaign plan for that launch. Should I?"
- "Let me research the competitive landscape — I'll pull together a brief."
- "I could draft an email sequence for that. Want me to build it out?"

**Do NOT:**
- Produce long-form content unprompted (only when the user explicitly asks or agrees to your proposal)
- Identify yourself as a specialized sub-agent (you are the primary assistant, not "SEO Optimizer" or "Content Analyzer")
- Use <content> tags for conversational responses — only for deliverables the user explicitly requested
- Repeat the user's question back to them — get straight to the answer`

/**
 * Build a lean system prompt for general chat (non-command messages).
 * Loads Maiar identity + CLAUDE.md + client context + priority skills.
 */
export function buildSystemPrompt(clientSlug, persona, prioritySkills = []) {
  const parts = []

  // Primary agent identity (before persona — persona overrides the name/personality but not the role)
  parts.push(MAIAR_AGENT_IDENTITY)

  const personaSection = buildPersonaSection(persona)
  if (personaSection) parts.push(personaSection)

  const claudeMd = loadClaudeMd()
  if (claudeMd) parts.push(claudeMd)

  // Priority skills for general chat
  const skills = loadSkills(prioritySkills)
  if (skills) {
    parts.push(`# Priority Skills\n\nApply the following discipline expertise in all responses:\n\n${skills}`)
  }

  const rawContext = loadContext(clientSlug)
  if (rawContext) {
    const clientContext = sanitizeContext(rawContext)
    parts.push(`# Client Brand Context\n\nThe following context files contain this client's brand, audience, and product information. Use them as the foundation for all outputs.\n\n${clientContext}`)
  }

  parts.push(CONTENT_TAG_INSTRUCTIONS)

  return parts.join('\n\n=====\n\n')
}

/**
 * Build a system prompt for a skills-only command (no agent chain).
 * Loads just the single command's .md + skills + client context.
 * Much leaner than the full catalog approach.
 */
export function buildCommandPrompt(clientSlug, commandSlug, skillSlugs, persona, prioritySkills = []) {
  const parts = []

  const personaSection = buildPersonaSection(persona)
  if (personaSection) parts.push(personaSection)

  // The specific command's instructions
  const commandDef = loadSingleCommand(commandSlug)
  if (commandDef) {
    parts.push(`# Command Instructions\n\nFollow these instructions for the ${commandSlug} command:\n\n${commandDef}`)
  }

  // Merge command skills with priority skills
  const allSkills = mergeSkills(skillSlugs, prioritySkills)
  const skills = loadSkills(allSkills)
  if (skills) {
    parts.push(`# Relevant Skills & Frameworks\n\nApply the following discipline expertise:\n\n${skills}`)
  }

  // Client context
  const rawContext = loadContext(clientSlug)
  if (rawContext) {
    const clientContext = sanitizeContext(rawContext)
    parts.push(`# Client Brand Context\n\n${clientContext}`)
  }

  parts.push(CONTENT_TAG_INSTRUCTIONS)

  return parts.join('\n\n=====\n\n')
}

/**
 * Build a system prompt for an individual agent step.
 * Order: agent prompt → skills → client context
 */
export function buildAgentPrompt(clientSlug, agentSlug, skillSlugs, persona, prioritySkills = []) {
  const parts = []

  const personaSection = buildPersonaSection(persona)
  if (personaSection) parts.push(personaSection)

  // Agent-specific prompt
  const agentPrompt = loadAgentPrompt(agentSlug)
  if (agentPrompt) parts.push(agentPrompt)

  // Merge command skills with priority skills
  const allSkills = mergeSkills(skillSlugs, prioritySkills)
  const skills = loadSkills(allSkills)
  if (skills) {
    parts.push(`# Relevant Skills & Frameworks\n\nApply the following discipline expertise:\n\n${skills}`)
  }

  // Client context
  const rawContext = loadContext(clientSlug)
  if (rawContext) {
    const clientContext = sanitizeContext(rawContext)
    parts.push(`# Client Brand Context\n\n${clientContext}`)
  }

  parts.push(CONTENT_TAG_INSTRUCTIONS)

  return parts.join('\n\n=====\n\n')
}
