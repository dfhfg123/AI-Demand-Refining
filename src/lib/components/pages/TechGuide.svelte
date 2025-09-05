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
      // TODO: 实现技术选型指南的AI逻辑
      console.log('技术选型指南生成:', { apiKey, input });
      
      // 模拟处理
      await new Promise(resolve => setTimeout(resolve, 1000));
      output = '技术选型指南生成功能正在开发中...';
    } finally {
      loading = false;
    }
  };
</script>

<PageTemplate 
  title="技术选型指南生成器"
  description="根据项目需求和技术场景，推荐最适合的技术栈和架构方案。"
  {apiKey}
  bind:input
  bind:output
  bind:loading
  placeholder="请描述项目需求，包括业务场景、技术要求、团队技能、性能指标等..."
  buttonText="生成选型指南"
  loadingText="正在分析技术方案..."
  on:click={handleSubmit}
/>