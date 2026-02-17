<script lang="ts">
  import Sidebar from './Sidebar.svelte'
</script>

<div class="flex h-screen overflow-hidden" style="background: var(--bg-base)">
  <Sidebar />
  <main class="flex-1 flex flex-col overflow-hidden" style="background: var(--bg-base)">
    <slot />
  </main>
</div>

<style>
  @media (max-width: 768px) {
    :global(aside) {
      display: none;
    }
  }
</style>
