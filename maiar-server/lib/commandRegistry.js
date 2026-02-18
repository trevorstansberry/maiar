/**
 * Command Registry — maps slash commands to their agent chains and required skills.
 *
 * Each command defines:
 *   agents: ordered list of agents to run in sequence
 *   skills: skill slugs to load into system prompt
 *   producesContent: whether the output should be auto-saved to disk
 */

export const commandRegistry = {
  '/write': {
    agents: ['editor', 'seo-optimizer', 'meta-creator', 'internal-linker'],
    skills: ['copywriting', 'seo-audit'],
    producesContent: true
  },
  '/email': {
    agents: ['editor'],
    skills: ['email-marketing', 'email-sequence'],
    producesContent: true
  },
  '/social': {
    agents: ['editor'],
    skills: ['social-content', 'social-media-marketing'],
    producesContent: true
  },
  '/ads': {
    agents: ['cro-analyst'],
    skills: ['paid-ads', 'sem-ppc', 'marketing-psychology'],
    producesContent: true
  },
  '/research': {
    agents: ['seo-optimizer'],
    skills: ['seo-audit', 'programmatic-seo'],
    producesContent: true
  },
  '/audit': {
    agents: ['content-analyzer'],
    skills: ['seo-audit', 'page-cro', 'content-marketing', 'copy-editing'],
    producesContent: false
  },
  '/strategy': {
    agents: ['channel-selector'],
    skills: [],
    producesContent: true
  },
  '/analyze': {
    agents: ['content-analyzer'],
    skills: ['competitor-alternatives', 'brand-marketing'],
    producesContent: false
  },
  '/optimize': {
    agents: ['seo-optimizer', 'cro-analyst', 'meta-creator'],
    skills: ['seo-audit', 'page-cro'],
    producesContent: false
  },
  '/publish': {
    agents: ['publishing-adapter'],
    skills: [],
    producesContent: false
  },
  '/performance-review': {
    agents: [],
    skills: ['performance-analytics'],
    producesContent: false
  },
  '/competitor': {
    agents: [],
    skills: ['competitor-alternatives'],
    producesContent: true
  },
  '/ideas': {
    agents: [],
    skills: ['marketing-ideas', 'marketing-psychology'],
    producesContent: false
  },
  '/abm': {
    agents: [],
    skills: ['abm', 'b2b-marketing', 'outbound-marketing'],
    producesContent: true
  },
  '/influencer': {
    agents: [],
    skills: ['influencer-marketing', 'marketing-psychology', 'social-media-marketing'],
    producesContent: true
  },
  '/repurpose': {
    agents: ['editor'],
    skills: ['social-content', 'copywriting'],
    producesContent: true
  },
  '/campaign': {
    agents: ['campaign-strategist'],
    skills: [],
    producesContent: true
  },
  '/lifecycle': {
    agents: ['lifecycle-planner'],
    skills: ['retention-lifecycle', 'email-marketing', 'email-sequence', 'onboarding-cro'],
    producesContent: true
  },
  '/brand-positioning': {
    agents: ['brand-strategist'],
    skills: ['brand-marketing', 'product-marketing', 'copywriting'],
    producesContent: true
  },
  '/persona': {
    agents: [],
    skills: ['inbound-marketing', 'marketing-psychology'],
    producesContent: true
  },
  '/brand-research': {
    agents: ['brand-researcher'],
    skills: [],
    producesContent: true
  }
}

/**
 * Look up a command from user input.
 * Returns { command, config } or null if not a recognized command.
 */
export function resolveCommand(message) {
  const firstWord = message.trim().split(/\s+/)[0].toLowerCase()
  const config = commandRegistry[firstWord]
  if (!config) return null
  return { command: firstWord, config }
}

/**
 * Resolve an intent classification to a command config.
 * Constructs a virtual command message from the intent + topic.
 * @param {string} commandSlash - The slash command (e.g., '/write')
 * @param {string} topic - The extracted topic from the user's message
 * @returns {{ command: string, config: object, virtualMessage: string } | null}
 */
export function resolveIntent(commandSlash, topic) {
  const config = commandRegistry[commandSlash]
  if (!config) return null
  const virtualMessage = topic ? `${commandSlash} ${topic}` : commandSlash
  return { command: commandSlash, config, virtualMessage }
}
