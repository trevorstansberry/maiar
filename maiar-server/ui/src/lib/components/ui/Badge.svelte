<script lang="ts">
  export let variant: 'default' | 'success' | 'warning' | 'error' | 'accent' | 'info' = 'default'

  const styles: Record<string, string> = {
    default: 'color: var(--text-muted); background: var(--bg-elevated); border: 1px solid var(--border-subtle)',
    success: 'color: var(--color-success); background: rgba(76,175,129,0.12)',
    warning: 'color: var(--color-warning); background: rgba(245,166,35,0.12)',
    error:   'color: var(--color-error);   background: rgba(239,100,97,0.12)',
    accent:  'color: var(--accent-light);  background: var(--accent-muted)',
    info:    'color: var(--accent-light);  background: rgba(100,160,255,0.12)'
  }
</script>

<span
  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium {$$props.class ?? ''}"
  style={styles[variant]}
>
  <slot />
</span>
