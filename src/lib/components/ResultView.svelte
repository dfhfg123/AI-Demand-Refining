<script lang="ts">
  import MarkdownView from './MarkdownView.svelte';
  export let text: string = '';
  const copy = async () => navigator.clipboard?.writeText(text || '')
    .catch(() => {});
</script>

<div>
  <div style="display:flex;align-items:center;justify-content:space-between;margin:8px 0;">
    <strong>输出</strong>
    <button on:click={copy} disabled={!text}>复制</button>
  </div>
  <div style="border:1px solid #e5e7eb;border-radius:8px;padding:12px;height:420px;overflow:auto;background:#fafafa;">
    <MarkdownView source={text} />
  </div>
</div>

