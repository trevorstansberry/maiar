const BASE = '/api'

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? `HTTP ${res.status}`)
  }

  return res.json()
}

// Auth
export const auth = {
  login: (email: string, password: string) => req('POST', '/auth/login', { email, password }),
  logout: () => req('POST', '/auth/logout'),
  session: () => req('GET', '/auth/session'),
  forgotPassword: (email: string) => req('POST', '/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => req('POST', '/auth/reset-password', { token, password }),
  changePassword: (currentPassword: string, newPassword: string) => req('POST', '/auth/change-password', { currentPassword, newPassword })
}

// Conversations
export const conversations = {
  list: () => req<any[]>('GET', '/chat/conversations'),
  get: (id: string) => req<any>('GET', `/chat/conversations/${id}`),
  rename: (id: string, title: string) => req('PATCH', `/chat/conversations/${id}`, { title }),
  delete: (id: string) => req('DELETE', `/chat/conversations/${id}`)
}

// Campaigns
export const campaignsApi = {
  list: () => req<any[]>('GET', '/campaigns'),
  get: (id: string) => req<any>('GET', `/campaigns/${id}`),
  create: (data: { title: string; planPath?: string; assetPlan?: any[] }) =>
    req<{ id: string }>('POST', '/campaigns', data),
  update: (id: string, data: { title?: string; status?: string; assetPlan?: any[] }) =>
    req('PATCH', `/campaigns/${id}`, data),
  delete: (id: string) => req('DELETE', `/campaigns/${id}`),
  linkConversation: (id: string, conversationId: string) =>
    req('POST', `/campaigns/${id}/conversations`, { conversationId }),
  unlinkConversation: (id: string, convId: string) =>
    req('DELETE', `/campaigns/${id}/conversations/${convId}`)
}

// Context
export const context = {
  status: () => req<{ ready: boolean }>('GET', '/context/status'),
  list: () => req<any>('GET', '/context'),
  getProducts: () => req<any>('GET', '/context/products'),
  getFile: (section: string, filename: string) => req<any>('GET', `/context/${section}/${filename}`),
  saveFile: (section: string, filename: string, content: string) =>
    req('PUT', `/context/${section}/${filename}`, { content }),
  createProduct: (slug: string, displayName: string) =>
    req('POST', '/context/products', { slug, displayName })
}

// Assets
export const assets = {
  list: (folder: string) => req<any[]>('GET', `/assets/${folder}`),
  get: (folder: string, filename: string) => req<any>('GET', `/assets/${folder}/${filename}`),
  save: (folder: string, filename: string, content: string) =>
    req('POST', `/assets/${folder}`, { filename, content }),
  update: (folder: string, filename: string, content: string) =>
    req('PUT', `/assets/${folder}/${filename}`, { content }),
  delete: (folder: string, filename: string) =>
    req('DELETE', `/assets/${folder}/${filename}`),
  move: (folder: string, filename: string, targetFolder: string) =>
    req('POST', `/assets/${folder}/${filename}/move`, { targetFolder }),
  rename: (folder: string, filename: string, newFilename: string) =>
    req('POST', `/assets/${folder}/${filename}/rename`, { newFilename })
}

// Persona
export const persona = {
  getMyWorkspace: () => req<any>('GET', '/admin/my/workspace'),
  update: (workspaceId: string, data: { botName?: string; botPersonality?: string; botAvatarUrl?: string }) =>
    req('PATCH', `/admin/workspaces/${workspaceId}/persona`, data),
  updateSkills: (prioritySkills: string[]) =>
    req('PATCH', '/admin/my/workspace/skills', { prioritySkills })
}

// Admin (super admin)
export const admin = {
  listClients: () => req<any[]>('GET', '/admin/clients'),
  createClient: (data: { email: string; password: string; clientSlug: string; displayName?: string; role?: string }) =>
    req('POST', '/admin/clients', data),
  toggleClient: (id: string) => req('POST', `/admin/clients/${id}/toggle`),
  getUsage: () => req<any[]>('GET', '/admin/usage'),
  getUsageCsvUrl: () => `${BASE}/admin/usage.csv`,
  // Workspaces
  listWorkspaces: () => req<any[]>('GET', '/admin/workspaces'),
  createWorkspace: (data: { slug: string; displayName: string }) =>
    req('POST', '/admin/workspaces', data),
  updateWorkspace: (id: string, data: { displayName?: string; active?: boolean; prioritySkills?: string[] }) =>
    req('PATCH', `/admin/workspaces/${id}`, data),
  getWorkspaceUsers: (id: string) => req<any[]>('GET', `/admin/workspaces/${id}/users`),
  // User management
  editUser: (id: string, data: { name?: string; email?: string; role?: string }) =>
    req('PATCH', `/admin/clients/${id}`, data),
  sendResetLink: (id: string) =>
    req('POST', `/admin/clients/${id}/send-reset-link`),
  setPassword: (id: string, password: string) =>
    req<{ ok: boolean }>('POST', `/admin/clients/${id}/set-password`, { password }),
  deleteUser: (id: string) =>
    req('DELETE', `/admin/clients/${id}`),
  // Client admin (scoped to own workspace)
  listMyUsers: () => req<any[]>('GET', '/admin/my/users'),
  createMyUser: (data: { email: string; password: string; displayName?: string }) =>
    req('POST', '/admin/my/users', data),
  getMyUsage: () => req<any[]>('GET', '/admin/my/usage'),
  toggleMyUser: (id: string) => req('POST', `/admin/my/users/${id}/toggle`),
  sendMyUserResetLink: (id: string) => req('POST', `/admin/my/users/${id}/send-reset-link`)
}

// Profile
export const profile = {
  get: () => req<any>('GET', '/profile'),
  update: (data: { name?: string; companyName?: string; companyWebsite?: string }) =>
    req('PATCH', '/profile', data),
  uploadAvatar: async (file: File) => {
    const form = new FormData()
    form.append('avatar', file)
    const res = await fetch(`${BASE}/profile/avatar`, {
      method: 'POST',
      credentials: 'include',
      body: form
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error(err.error ?? `HTTP ${res.status}`)
    }
    return res.json()
  },
  uploadCompanyLogo: async (file: File) => {
    const form = new FormData()
    form.append('logo', file)
    const res = await fetch(`${BASE}/profile/company-logo`, {
      method: 'POST',
      credentials: 'include',
      body: form
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error(err.error ?? `HTTP ${res.status}`)
    }
    return res.json()
  }
}

// Asset Records (DB-tracked assets with relationships)
export const assetRecords = {
  list: (params?: { conversationId?: string; campaignId?: string; folder?: string; mine?: string }) => {
    const entries = params ? Object.entries(params).filter(([, v]) => v) : []
    const qs = entries.length ? '?' + new URLSearchParams(entries as [string, string][]).toString() : ''
    return req<any[]>('GET', `/asset-records${qs}`)
  },
  get: (id: string) => req<any>('GET', `/asset-records/${id}`),
  update: (id: string, data: { title?: string; status?: string; campaignId?: string | null }) =>
    req('PATCH', `/asset-records/${id}`, data),
  delete: (id: string) => req('DELETE', `/asset-records/${id}`)
}

// Onboarding
export const onboarding = {
  complete: () => req('POST', '/onboarding/complete')
}

// System
export const system = {
  status: () => req<any>('GET', '/system/status')
}

/**
 * Stream a chat message via SSE.
 * Returns an async generator of events.
 */
export async function* streamChat(
  message: string,
  history: Array<{ role: string; content: string }>,
  conversationId: string | null,
  campaignId?: string | null,
  signal?: AbortSignal,
  images?: Array<{ base64: string; mediaType: string }>
): AsyncGenerator<{ type: string; [key: string]: any }> {
  const body: any = { message, history, conversationId }
  if (campaignId) body.campaignId = campaignId
  if (images?.length) body.images = images

  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    signal,
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? `HTTP ${res.status}`)
  }

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    if (signal?.aborted) break
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          yield JSON.parse(line.slice(6))
        } catch (e) {
          console.warn('[sse] Parse failed:', line, e)
        }
      }
    }
  }

  // Flush any remaining data in buffer (handles case where stream ends without trailing newline)
  if (buffer.trim().startsWith('data: ')) {
    try {
      yield JSON.parse(buffer.trim().slice(6))
    } catch (e) {
      console.warn('[sse] Flush parse failed:', buffer.trim(), e)
    }
  }
}
