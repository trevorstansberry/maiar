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
  delete: (id: string) => req('DELETE', `/chat/conversations/${id}`)
}

// Context
export const context = {
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
    req('POST', `/assets/${folder}/${filename}/move`, { targetFolder })
}

// Admin
export const admin = {
  listClients: () => req<any[]>('GET', '/admin/clients'),
  createClient: (data: { email: string; password: string; clientSlug: string; displayName?: string; role?: string }) =>
    req('POST', '/admin/clients', data),
  toggleClient: (id: string) => req('POST', `/admin/clients/${id}/toggle`),
  getUsage: () => req<any[]>('GET', '/admin/usage'),
  getUsageCsvUrl: () => `${BASE}/admin/usage.csv`
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
  conversationId: string | null
): AsyncGenerator<{ type: string; [key: string]: any }> {
  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ message, history, conversationId })
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? `HTTP ${res.status}`)
  }

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          yield JSON.parse(line.slice(6))
        } catch {}
      }
    }
  }
}
