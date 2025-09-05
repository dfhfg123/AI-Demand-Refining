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
      // TODO: 实现会议纪要生成的AI逻辑
      console.log('会议纪要生成:', { apiKey, input });
      
      // 模拟处理
      await new Promise(resolve => setTimeout(resolve, 1000));
      output = '会议纪要行动清单生成功能正在开发中...';
    } finally {
      loading = false;
    }
  };
</script>

<PageTemplate 
  title="会议纪要行动清单生成器"
  description="将冗长的会议记录转换为结构化的行动清单，明确责任人和截止时间。"
  {apiKey}
  bind:input
  bind:output
  bind:loading
  placeholder="请输入会议记录内容，包括讨论要点、决策事项、待办任务等..."
  buttonText="生成行动清单"
  loadingText="正在生成行动清单..."
  on:click={handleSubmit}
/>