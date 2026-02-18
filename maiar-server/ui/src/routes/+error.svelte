<script>
  import { page } from '$app/stores'
</script>

<div class="error-page">
  <div class="error-content">
    <div class="error-icon">
      <svg width="32" height="32" viewBox="0 0 640 640" fill="currentColor">
        <path d="M320 0C143.2 0 0 143.2 0 320s143.2 320 320 320 320-143.2 320-320S496.8 0 320 0zm0 96c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zm64 384H256v-32h32V288h-32v-32h96v192h32v32z"/>
      </svg>
    </div>
    <h1 class="error-code">{$page.status}</h1>
    <p class="error-message">
      {#if $page.status === 404}
        This page doesn't exist.
      {:else}
        {$page.error?.message ?? 'Something went wrong.'}
      {/if}
    </p>
    <a href="/chat" class="back-link">Back to Chat</a>
  </div>
</div>

<style>
  .error-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: var(--bg-base, #0a0b14);
    color: var(--text-primary, #e8e6e3);
  }

  .error-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .error-icon {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--accent-muted, rgba(194, 101, 42, 0.12));
    color: var(--accent-light, #d4845a);
  }

  .error-code {
    font-size: 4rem;
    font-weight: 700;
    line-height: 1;
    color: var(--accent, #c2652a);
    margin: 0;
  }

  .error-message {
    font-size: 1.1rem;
    color: var(--text-secondary, #a09c97);
    margin: 0;
  }

  .back-link {
    display: inline-block;
    margin-top: 0.5rem;
    padding: 0.6rem 1.5rem;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    background: var(--accent, #c2652a);
    color: white;
    text-decoration: none;
    transition: opacity 0.15s;
  }

  .back-link:hover {
    opacity: 0.85;
  }
</style>
