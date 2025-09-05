<script lang="ts">
  import MarkdownView from './MarkdownView.svelte';
  export let text: string = '';
  const copy = async () => navigator.clipboard?.writeText(text || '')
    .catch(() => {});
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h4 class="text-lg font-semibold text-gray-900">输出结果</h4>
    <button 
      on:click={copy} 
      disabled={!text}
      class="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      复制
    </button>
  </div>
  <div class="border border-gray-200 rounded-lg p-4 h-96 overflow-auto bg-gray-50">
    <MarkdownView source={text} />
  </div>
</div>

