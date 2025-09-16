<script lang="ts">
  import { marked } from 'marked';
  export let source: string = '';
  $: html = marked.parse(source || '');
</script>

<div class="prose prose-neutral max-w-none">{@html html}</div>

<style>
  :global(.prose) {
    line-height: 1.7;
    color: #374151;
  }
  
  /* 标题样式 */
  :global(.prose h1) {
    @apply text-2xl font-bold text-neutral-800 mt-8 mb-4 pb-2 border-b border-neutral-200;
  }
  
  :global(.prose h2) {
    @apply text-xl font-semibold text-neutral-800 mt-6 mb-3;
  }
  
  :global(.prose h3) {
    @apply text-lg font-medium text-neutral-700 mt-5 mb-2;
  }
  
  :global(.prose h4) {
    @apply text-base font-medium text-neutral-700 mt-4 mb-2;
  }
  
  /* 段落样式 */
  :global(.prose p) {
    @apply mb-4 text-neutral-600 leading-relaxed;
  }
  
  /* 列表样式 */
  :global(.prose ul) {
    @apply mb-4 pl-6 space-y-1;
  }
  
  :global(.prose ol) {
    @apply mb-4 pl-6 space-y-1;
  }
  
  :global(.prose li) {
    @apply text-neutral-600 leading-relaxed;
  }
  
  :global(.prose ul li) {
    @apply relative;
  }
  
  :global(.prose ul li::before) {
    content: '';
    @apply absolute -left-4 top-2 w-1.5 h-1.5 bg-primary-500 rounded-full;
  }
  
  /* 代码样式 */
  :global(.prose code) {
    @apply bg-neutral-100 text-primary-700 px-2 py-1 rounded-md text-sm font-mono;
  }
  
  :global(.prose pre) {
    @apply bg-neutral-900 text-neutral-100 p-4 rounded-xl overflow-x-auto mb-4 shadow-medium;
  }
  
  :global(.prose pre code) {
    @apply bg-transparent text-neutral-100 p-0;
  }
  
  /* 表格样式 */
  :global(.prose table) {
    @apply w-full border-collapse mb-4 bg-white rounded-lg overflow-hidden shadow-soft;
  }
  
  :global(.prose th) {
    @apply bg-gradient-to-r from-neutral-50 to-neutral-100 text-neutral-700 font-semibold px-4 py-3 text-left border-b border-neutral-200;
  }
  
  :global(.prose td) {
    @apply px-4 py-3 border-b border-neutral-100 text-neutral-600;
  }
  
  :global(.prose tr:hover) {
    @apply bg-neutral-50;
  }
  
  /* 引用样式 */
  :global(.prose blockquote) {
    @apply border-l-4 border-primary-500 pl-4 py-2 mb-4 bg-primary-50 rounded-r-lg;
  }
  
  :global(.prose blockquote p) {
    @apply text-neutral-700 italic mb-0;
  }
  
  /* 分割线 */
  :global(.prose hr) {
    @apply my-8 border-0 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent;
  }
  
  /* 强调样式 */
  :global(.prose strong) {
    @apply font-semibold text-neutral-800;
  }
  
  :global(.prose em) {
    @apply italic text-neutral-700;
  }
</style>

