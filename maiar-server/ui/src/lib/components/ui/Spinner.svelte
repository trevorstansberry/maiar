<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' = 'md'
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
</script>

<span
  class="inline-block rounded-full border-2 border-t-transparent animate-spin {sizes[size]} {$$props.class ?? ''}"
  style="border-color: var(--border-strong); border-top-color: var(--accent)"
/>
