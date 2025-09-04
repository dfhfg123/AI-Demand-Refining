<script lang="ts">
  import { marked } from 'marked';
  export let source: string = '';
  $: html = marked.parse(source || '');
</script>

<div class="md">{@html html}</div>

<style>
  .md { line-height: 1.65; }
  .md h1, .md h2, .md h3 { margin: 12px 0 8px; }
  .md p { margin: 8px 0; }
  .md code { background: #f6f8fa; padding: 0 4px; border-radius: 3px; }
  .md pre { background: #0b1020; color: #eaeef2; padding: 12px; overflow: auto; border-radius: 6px; }
  .md table { border-collapse: collapse; width: 100%; }
  .md th, .md td { border: 1px solid #e5e7eb; padding: 6px 8px; text-align: left; }
</style>

