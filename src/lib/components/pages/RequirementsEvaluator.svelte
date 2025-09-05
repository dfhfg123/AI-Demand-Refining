<script lang="ts">
  import PageTemplate from '$lib/components/PageTemplate.svelte';
  
  export let apiKey: string;
  
  let input = '';
  let output = '';
  let loading = false;
  
  const handleSubmit = async () => {
    if (!apiKey?.trim() || !input?.trim()) return;
    
    loading = true;
    try {
      // TODO: 实现需求排期评估的AI逻辑
      console.log('需求排期评估:', { apiKey, input });
      
      // 模拟处理
      await new Promise(resolve => setTimeout(resolve, 1000));
      output = '需求排期评估功能正在开发中...';
    } finally {
      loading = false;
    }
  };
</script>

<PageTemplate 
  title="需求排期快速评估器"
  description="基于项目需求快速评估开发排期和工作量分配，提供专业的时间估算建议。"
  {apiKey}
  bind:input
  bind:output
  bind:loading
  placeholder="请输入项目需求描述，包括功能点、技术要求、交付时间等信息..."
  buttonText="开始评估"
  loadingText="正在评估排期..."
  on:click={handleSubmit}
/>