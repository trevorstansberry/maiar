import { writable, derived } from 'svelte/store'

export interface SessionUser {
  id: string
  email: string
  clientSlug: string
  role: 'client' | 'admin'
  active: boolean
  onboardingComplete: boolean
}

export const user = writable<SessionUser | null>(null)
export const isAdmin = derived(user, $u => $u?.role === 'admin')
export const isLoggedIn = derived(user, $u => $u !== null)
