<script lang="ts">
  import { marked } from 'marked';
  export let source: string = '';
  $: html = marked.parse(source || '');
</script>

<div class="prose prose-sm max-w-none text-gray-800">{@html html}</div>

<style>
  :global(.prose h1, .prose h2, .prose h3) {
    @apply font-semibold text-gray-900 mt-6 mb-3;
  }
  :global(.prose h1) {
    @apply text-xl;
  }
  :global(.prose h2) {
    @apply text-lg;
  }
  :global(.prose h3) {
    @apply text-base;
  }
  :global(.prose p) {
    @apply my-3 leading-relaxed;
  }
  :global(.prose code) {
    @apply bg-gray-100 px-1.5 py-0.5 rounded text-sm;
  }
  :global(.prose pre) {
    @apply bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto;
  }
  :global(.prose table) {
    @apply w-full border-collapse;
  }
  :global(.prose th, .prose td) {
    @apply border border-gray-300 px-3 py-2 text-left;
  }
  :global(.prose th) {
    @apply bg-gray-50 font-medium;
  }
  :global(.prose ul, .prose ol) {
    @apply my-3 pl-6;
  }
  :global(.prose li) {
    @apply my-1;
  }
</style>

