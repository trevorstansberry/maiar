<script lang="ts">
  import { marked } from 'marked'
  import hljs from 'highlight.js'
  import { onMount } from 'svelte'

  export let content: string

  marked.setOptions({
    highlight: (code, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value
      }
      return hljs.highlightAuto(code).value
    }
  } as any)

  $: html = marked(content) as string
</script>

<div class="markdown">{@html html}</div>
