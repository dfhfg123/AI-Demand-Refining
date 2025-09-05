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
      // TODO: 实现竞品分析的AI逻辑
      console.log('竞品分析生成:', { apiKey, input });
      
      // 模拟处理
      await new Promise(resolve => setTimeout(resolve, 1000));
      output = '竞品分析报告生成功能正在开发中...';
    } finally {
      loading = false;
    }
  };
</script>

<PageTemplate 
  title="竞品分析报告生成器"
  description="基于产品信息和市场数据，生成专业的竞品分析报告，洞察市场趋势和竞争优势。"
  {apiKey}
  bind:input
  bind:output
  bind:loading
  placeholder="请输入产品信息和竞品资料，包括功能对比、市场定位、用户群体等..."
  buttonText="生成分析报告"
  loadingText="正在分析竞品..."
  on:click={handleSubmit}
/>