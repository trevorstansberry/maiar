<script lang="ts">
  import { theme, toggleTheme } from '$lib/stores/theme'
  import { Sun, Moon } from 'lucide-svelte'
</script>

<button
  on:click={toggleTheme}
  class="relative flex items-center gap-1.5 px-2 py-1.5 rounded-full transition-colors duration-200"
  style="background: var(--bg-elevated); border: 1px solid var(--border);"
  title="Toggle theme"
  aria-label="Toggle dark/light mode"
>
  <Moon size={14} class="transition-opacity" style="color: var(--text-muted); opacity: {$theme === 'dark' ? '1' : '0.4'}" />

  <div
    class="relative w-8 h-4 rounded-full transition-colors duration-200"
    style="background: {$theme === 'light' ? 'var(--accent)' : 'var(--bg-glass)'}"
  >
    <div
      class="absolute top-0.5 w-3 h-3 rounded-full transition-transform duration-200"
      style="background: white; transform: translateX({$theme === 'light' ? '17px' : '2px'}); box-shadow: 0 1px 3px rgba(0,0,0,0.3)"
    />
  </div>

  <Sun size={14} class="transition-opacity" style="color: var(--text-muted); opacity: {$theme === 'light' ? '1' : '0.4'}" />
</button>
