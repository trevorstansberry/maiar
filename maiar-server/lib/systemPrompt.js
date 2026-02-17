import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { config } from './config.js'
import { loadContext } from './contextLoader.js'

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
 * Build the full system prompt for a client chat request.
 * Order: CLAUDE.md → client context → command definitions
 */
export function buildSystemPrompt(clientSlug) {
  const parts = []

  const claudeMd = loadClaudeMd()
  if (claudeMd) parts.push(claudeMd)

  const rawContext = loadContext(clientSlug)
  if (rawContext) {
    // M1: Strip lines that look like prompt injection attempts
    const injectionPattern = /^.*?(IGNORE PREVIOUS|IGNORE ALL|<\/?system>|<\/s>|\[SYSTEM|\[INST\]|###\s*SYSTEM)/im
    const clientContext = rawContext
      .split('\n')
      .filter(line => !injectionPattern.test(line))
      .join('\n')
    parts.push(`# Client Brand Context\n\nThe following context files contain this client's brand, audience, and product information. Use them as the foundation for all outputs.\n\n${clientContext}`)
  }

  const commandDefs = loadCommandDefinitions()
  if (commandDefs) {
    parts.push(`# Available Commands\n\nWhen the user invokes a command (e.g. /write, /email), follow the instructions below for that command.\n\n${commandDefs}`)
  }

  return parts.join('\n\n=====\n\n')
}
