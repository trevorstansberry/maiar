export interface Command {
  name: string
  args: string
  description: string
  category: string
  producesContent: boolean
}

export const COMMANDS: Command[] = [
  { name: '/write',      args: '[topic or type]',     description: 'Create any marketing content',         category: 'Content',   producesContent: true  },
  { name: '/research',   args: '[topic]',              description: 'SEO + market research brief',          category: 'Research',  producesContent: true  },
  { name: '/social',     args: '[platform] [topic]',   description: 'Platform-specific social content',     category: 'Content',   producesContent: true  },
  { name: '/email',      args: '[type]',               description: 'Write an email or full sequence',      category: 'Content',   producesContent: true  },
  { name: '/ads',        args: '[platform] [goal]',    description: 'Ad copy and strategy',                 category: 'Content',   producesContent: true  },
  { name: '/campaign',   args: '[type] [goal]',        description: 'Full campaign strategy document',      category: 'Strategy',  producesContent: true  },
  { name: '/ideas',      args: '[topic or challenge]', description: 'Marketing ideation session',           category: 'Strategy',  producesContent: false },
  { name: '/strategy',   args: '[marketing-type]',     description: 'Strategy document for any discipline', category: 'Strategy',  producesContent: true  },
  { name: '/audit',      args: '[channel or url]',     description: 'Audit a marketing channel or content', category: 'Analysis',  producesContent: false },
  { name: '/analyze',    args: '[file or url]',        description: 'Analyze existing content or campaigns', category: 'Analysis', producesContent: false },
  { name: '/optimize',   args: '[file]',               description: 'Optimize for SEO, CRO, or engagement', category: 'Analysis', producesContent: false },
  { name: '/competitor', args: '[company]',            description: 'Competitive analysis report',          category: 'Research',  producesContent: true  },
  { name: '/persona',    args: '[role or segment]',    description: 'Detailed buyer persona card',          category: 'Research',  producesContent: true  },
  { name: '/lifecycle',  args: '[stage]',              description: 'Design lifecycle email sequences',      category: 'Email',     producesContent: true  },
  { name: '/repurpose',  args: '[file] [format]',      description: 'Repurpose content across channels',    category: 'Content',   producesContent: true  },
  { name: '/abm',        args: '[account or list]',    description: 'ABM plan for target accounts',         category: 'Strategy',  producesContent: true  },
  { name: '/influencer', args: '[topic or campaign]',  description: 'Influencer identification and brief',  category: 'Strategy',  producesContent: true  },
  { name: '/publish',    args: '[file] [platform]',    description: 'Publish to a configured integration',  category: 'Publish',   producesContent: false },
  { name: '/brand-research',    args: '[url]',         description: 'Research brand and populate context',  category: 'Setup',     producesContent: false },
  { name: '/brand-positioning', args: '',              description: 'Positioning statement + message hierarchy', category: 'Strategy', producesContent: true },
  { name: '/performance-review', args: '',             description: 'Data-driven content/channel review',  category: 'Analysis',  producesContent: false },
]

// Commands that open the canvas split-pane (all content-producing commands)
export const CANVAS_COMMANDS = new Set(
  COMMANDS.filter(c => c.producesContent).map(c => c.name)
)

export function filterCommands(query: string): Command[] {
  const q = query.toLowerCase().replace(/^\//, '')
  if (!q) return COMMANDS
  return COMMANDS.filter(c =>
    c.name.includes(q) || c.description.toLowerCase().includes(q)
  )
}
