export interface Command {
  name: string
  args: string
  description: string
  displayName: string
  icon: string
  category: string
  producesContent: boolean
  agents: string[]
  skills: string[]
}

export const CATEGORY_ICONS: Record<string, string> = {
  Content: 'pen-line',
  Strategy: 'target',
  Research: 'search',
  Analysis: 'bar-chart-3',
  Email: 'mail',
  Setup: 'settings',
  Publish: 'upload'
}

export const COMMANDS: Command[] = [
  { name: '/write',      args: '[topic or type]',     description: 'Create any marketing content',         displayName: 'Write Content',         icon: 'pen-line',        category: 'Content',   producesContent: true,  agents: ['editor', 'seo-optimizer', 'meta-creator', 'internal-linker'], skills: ['copywriting', 'seo-audit'] },
  { name: '/research',   args: '[topic]',              description: 'SEO + market research brief',          displayName: 'Research Brief',        icon: 'search',          category: 'Research',  producesContent: true,  agents: ['seo-optimizer'], skills: ['seo-audit', 'programmatic-seo'] },
  { name: '/social',     args: '[platform] [topic]',   description: 'Platform-specific social content',     displayName: 'Social Post',           icon: 'share-2',         category: 'Content',   producesContent: true,  agents: ['editor'], skills: ['social-content', 'social-media-marketing'] },
  { name: '/email',      args: '[type]',               description: 'Write an email or full sequence',      displayName: 'Email & Sequences',     icon: 'mail',            category: 'Content',   producesContent: true,  agents: ['editor'], skills: ['email-marketing', 'email-sequence'] },
  { name: '/ads',        args: '[platform] [goal]',    description: 'Ad copy and strategy',                 displayName: 'Ad Copy',               icon: 'megaphone',       category: 'Content',   producesContent: true,  agents: ['cro-analyst'], skills: ['paid-ads', 'sem-ppc', 'marketing-psychology'] },
  { name: '/campaign',   args: '[type] [goal]',        description: 'Full campaign strategy document',      displayName: 'Campaign Plan',         icon: 'target',          category: 'Strategy',  producesContent: true,  agents: ['campaign-strategist'], skills: [] },
  { name: '/ideas',      args: '[topic or challenge]', description: 'Marketing ideation session',           displayName: 'Brainstorm Ideas',      icon: 'lightbulb',       category: 'Strategy',  producesContent: false, agents: [], skills: ['marketing-ideas', 'marketing-psychology'] },
  { name: '/strategy',   args: '[marketing-type]',     description: 'Strategy document for any discipline', displayName: 'Strategy Doc',          icon: 'compass',         category: 'Strategy',  producesContent: true,  agents: ['channel-selector'], skills: [] },
  { name: '/audit',      args: '[channel or url]',     description: 'Audit a marketing channel or content', displayName: 'Content Audit',         icon: 'clipboard-check', category: 'Analysis',  producesContent: false, agents: ['content-analyzer'], skills: ['seo-audit', 'page-cro', 'content-marketing', 'copy-editing'] },
  { name: '/analyze',    args: '[file or url]',        description: 'Analyze existing content or campaigns', displayName: 'Analyze Content',      icon: 'bar-chart-3',     category: 'Analysis', producesContent: false, agents: ['content-analyzer'], skills: ['competitor-alternatives', 'brand-marketing'] },
  { name: '/optimize',   args: '[file]',               description: 'Optimize for SEO, CRO, or engagement', displayName: 'Optimize Content',     icon: 'trending-up',     category: 'Analysis', producesContent: false, agents: ['seo-optimizer', 'cro-analyst', 'meta-creator'], skills: ['seo-audit', 'page-cro'] },
  { name: '/competitor', args: '[company]',            description: 'Competitive analysis report',          displayName: 'Competitor Analysis',   icon: 'swords',          category: 'Research',  producesContent: true,  agents: [], skills: ['competitor-alternatives'] },
  { name: '/persona',    args: '[role or segment]',    description: 'Detailed buyer persona card',          displayName: 'Buyer Persona',         icon: 'user-circle',     category: 'Research',  producesContent: true,  agents: [], skills: ['inbound-marketing', 'marketing-psychology'] },
  { name: '/lifecycle',  args: '[stage]',              description: 'Design lifecycle email sequences',      displayName: 'Lifecycle Sequence',   icon: 'repeat',          category: 'Email',     producesContent: true,  agents: ['lifecycle-planner'], skills: ['retention-lifecycle', 'email-marketing', 'email-sequence', 'onboarding-cro'] },
  { name: '/repurpose',  args: '[file] [format]',      description: 'Repurpose content across channels',    displayName: 'Repurpose Content',     icon: 'recycle',         category: 'Content',   producesContent: true,  agents: ['editor'], skills: ['social-content', 'copywriting'] },
  { name: '/abm',        args: '[account or list]',    description: 'ABM plan for target accounts',         displayName: 'ABM Plan',              icon: 'building',        category: 'Strategy',  producesContent: true,  agents: [], skills: ['abm', 'b2b-marketing', 'outbound-marketing'] },
  { name: '/influencer', args: '[topic or campaign]',  description: 'Influencer identification and brief',  displayName: 'Influencer Brief',      icon: 'star',            category: 'Strategy',  producesContent: true,  agents: [], skills: ['influencer-marketing', 'marketing-psychology', 'social-media-marketing'] },
  { name: '/publish',    args: '[file] [platform]',    description: 'Publish to a configured integration',  displayName: 'Publish',               icon: 'upload',          category: 'Publish',   producesContent: false, agents: ['publishing-adapter'], skills: [] },
  { name: '/brand-research',    args: '[url]',         description: 'Research brand and populate context',  displayName: 'Brand Research',        icon: 'globe',           category: 'Setup',     producesContent: true,  agents: ['brand-researcher'], skills: [] },
  { name: '/brand-positioning', args: '',              description: 'Positioning statement + message hierarchy', displayName: 'Brand Positioning', icon: 'flag',           category: 'Strategy', producesContent: true, agents: ['brand-strategist'], skills: ['brand-marketing', 'product-marketing', 'copywriting'] },
  { name: '/performance-review', args: '',             description: 'Data-driven content/channel review',  displayName: 'Performance Review',    icon: 'activity',        category: 'Analysis',  producesContent: false, agents: [], skills: ['performance-analytics'] },
]

// Commands that open the canvas split-pane (all content-producing commands)
export const CANVAS_COMMANDS = new Set(
  COMMANDS.filter(c => c.producesContent).map(c => c.name)
)

// Lookup agents for a command by name (e.g. "/write" → ['editor', 'seo-optimizer', ...])
export function getCommandAgents(message: string): string[] {
  const cmdMatch = message.match(/^\/([a-z-]+)/)
  if (!cmdMatch) return []
  const cmdName = '/' + cmdMatch[1]
  const cmd = COMMANDS.find(c => c.name === cmdName)
  return cmd?.agents ?? []
}

// Lookup skills for a command by name
export function getCommandSkills(message: string): string[] {
  const cmdMatch = message.match(/^\/([a-z-]+)/)
  if (!cmdMatch) return []
  const cmdName = '/' + cmdMatch[1]
  const cmd = COMMANDS.find(c => c.name === cmdName)
  return cmd?.skills ?? []
}

export function filterCommands(query: string): Command[] {
  const q = query.toLowerCase().replace(/^\//, '')
  if (!q) return COMMANDS
  return COMMANDS.filter(c =>
    c.name.includes(q) || c.description.toLowerCase().includes(q) || c.displayName.toLowerCase().includes(q)
  )
}
