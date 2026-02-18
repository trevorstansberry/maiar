<script lang="ts">
  import { marked } from 'marked'
  import DOMPurify from 'dompurify'
  import hljs from 'highlight.js'
  import { afterUpdate } from 'svelte'

  export let content: string

  let container: HTMLElement

  marked.setOptions({
    highlight: (code, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value
      }
      return hljs.highlightAuto(code).value
    }
  } as any)

  $: html = DOMPurify.sanitize(marked(content) as string)

  afterUpdate(() => {
    if (!container) return
    container.querySelectorAll('pre').forEach(pre => {
      if (pre.querySelector('.code-copy-btn')) return
      const btn = document.createElement('button')
      btn.className = 'code-copy-btn'
      btn.textContent = 'Copy'
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code')
        if (code) {
          navigator.clipboard.writeText(code.textContent || '')
          btn.textContent = 'Copied!'
          setTimeout(() => { btn.textContent = 'Copy' }, 2000)
        }
      })
      pre.style.position = 'relative'
      pre.appendChild(btn)
    })
  })
</script>

<style>
  .markdown :global(.code-copy-btn) {
    position: absolute;
    top: 6px;
    right: 6px;
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s;
    background: var(--bg-elevated);
    color: var(--text-muted);
    border: 1px solid var(--border-subtle);
  }
  .markdown :global(pre:hover .code-copy-btn) {
    opacity: 0.8;
  }
  .markdown :global(.code-copy-btn:hover) {
    opacity: 1 !important;
  }
</style>

<div class="markdown" bind:this={container}>{@html html}</div>
