import { writable, derived } from 'svelte/store'

export interface SessionUser {
  id: string
  email: string
  name: string | null
  clientSlug: string
  role: 'client' | 'client_admin' | 'super_admin'
  active: boolean
  onboardingComplete: boolean
  mustChangePassword: boolean
  botName: string | null
  botPersonality: string | null
  botAvatarUrl: string | null
}

export const user = writable<SessionUser | null>(null)
export const isAdmin = derived(user, $u => $u?.role === 'super_admin')
export const isClientAdmin = derived(user, $u => $u?.role === 'client_admin' || $u?.role === 'super_admin')
export const isLoggedIn = derived(user, $u => $u !== null)
export const botDisplayName = derived(user, $u => $u?.botName || 'Maiar')
export const botPersonalityText = derived(user, $u => $u?.botPersonality || null)
