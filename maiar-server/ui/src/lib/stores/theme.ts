import { writable } from 'svelte/store'
import { browser } from '$app/environment'

type Theme = 'dark' | 'light'

const stored: Theme = browser
  ? (localStorage.getItem('maiar:theme') as Theme) ?? 'dark'
  : 'dark'

export const theme = writable<Theme>(stored)

if (browser) {
  theme.subscribe(value => {
    localStorage.setItem('maiar:theme', value)
    document.documentElement.setAttribute('data-theme', value)
  })
}

export function toggleTheme() {
  theme.update(t => (t === 'dark' ? 'light' : 'dark'))
}
