/**
 * Guided Flows — multi-step choice menus for high-level intents.
 *
 * When the intent classifier returns a broad category (e.g., "create"),
 * these flows present the user with specific options to narrow down.
 */

export const GUIDED_FLOWS = {
  create: {
    prompt: 'What would you like to create?',
    layout: 'cards',
    choices: [
      { id: 'blog', label: 'Blog Post', description: 'Long-form SEO content', icon: 'pen-line', mapTo: '/write blog post' },
      { id: 'email', label: 'Email', description: 'Single email or sequence', icon: 'mail', mapTo: '/email' },
      { id: 'social', label: 'Social Post', description: 'Platform-specific content', icon: 'share', mapTo: '/social' },
      { id: 'ads', label: 'Ad Copy', description: 'Paid ad creative', icon: 'megaphone', mapTo: '/ads' },
      { id: 'landing', label: 'Landing Page', description: 'Conversion-focused page', icon: 'file-text', mapTo: '/write landing page' },
      { id: 'case-study', label: 'Case Study', description: 'Customer success story', icon: 'file-text', mapTo: '/write case study' },
    ]
  },

  plan: {
    prompt: 'What would you like to plan?',
    layout: 'cards',
    choices: [
      { id: 'campaign', label: 'Campaign', description: 'Multi-channel marketing campaign', icon: 'target', mapTo: '/campaign' },
      { id: 'strategy', label: 'Strategy', description: 'Marketing strategy document', icon: 'lightbulb', mapTo: '/strategy' },
      { id: 'lifecycle', label: 'Lifecycle', description: 'Customer lifecycle sequences', icon: 'zap', mapTo: '/lifecycle' },
      { id: 'abm', label: 'ABM Plan', description: 'Account-based marketing', icon: 'target', mapTo: '/abm' },
    ]
  }
}

/**
 * Map an intent to the corresponding command string.
 * Returns the slash command if intent maps directly, or null for categories/general.
 */
export const INTENT_TO_COMMAND = {
  'write': '/write',
  'email': '/email',
  'social': '/social',
  'ads': '/ads',
  'campaign': '/campaign',
  'research': '/research',
  'audit': '/audit',
  'analyze': '/analyze',
  'optimize': '/optimize',
  'strategy': '/strategy',
  'ideas': '/ideas',
  'competitor': '/competitor',
  'persona': '/persona',
  'lifecycle': '/lifecycle',
  'abm': '/abm',
  'influencer': '/influencer',
  'repurpose': '/repurpose',
  'brand-positioning': '/brand-positioning',
  'brand-research': '/brand-research',
  'performance-review': '/performance-review',
  'publish': '/publish'
}
