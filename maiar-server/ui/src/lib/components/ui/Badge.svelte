<script lang="ts">
  export let variant: 'default' | 'success' | 'warning' | 'error' | 'accent' = 'default'

  const styles = {
    default: 'color: var(--text-muted); background: var(--bg-elevated); border: 1px solid var(--border-subtle)',
    success: 'color: var(--color-success); background: rgba(76,175,129,0.12)',
    warning: 'color: var(--color-warning); background: rgba(245,166,35,0.12)',
    error:   'color: var(--color-error);   background: rgba(239,100,97,0.12)',
    accent:  'color: var(--accent-light);  background: var(--accent-muted)'
  }
</script>

<span
  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium {$$props.class ?? ''}"
  style={styles[variant]}
>
  <slot />
</span>
