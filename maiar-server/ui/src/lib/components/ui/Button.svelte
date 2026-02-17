<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary'
  export let size: 'sm' | 'md' | 'lg' = 'md'
  export let disabled = false
  export let loading = false
  export let type: 'button' | 'submit' | 'reset' = 'button'

  const variants = {
    primary:   'text-white',
    secondary: 'text-[--text-primary]',
    ghost:     'text-[--text-secondary]',
    danger:    'text-white'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-[--radius-sm]',
    md: 'px-4 py-2 text-sm rounded-[--radius-md]',
    lg: 'px-6 py-3 text-base rounded-[--radius-md]'
  }
</script>

<button
  {type}
  {disabled}
  on:click
  class="inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--accent] {sizes[size]} {variants[variant]} {$$props.class ?? ''}"
  style="
    {variant === 'primary'   ? 'background: var(--accent); &:hover { background: var(--accent-dark) }' : ''}
    {variant === 'secondary' ? 'background: var(--bg-elevated); border: 1px solid var(--border);' : ''}
    {variant === 'ghost'     ? 'background: transparent;' : ''}
    {variant === 'danger'    ? 'background: var(--color-error);' : ''}
  "
>
  {#if loading}
    <span class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  {/if}
  <slot />
</button>
