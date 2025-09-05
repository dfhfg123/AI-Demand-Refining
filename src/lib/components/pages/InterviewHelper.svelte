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
      // TODO: 实现面经生成的AI逻辑
      console.log('面经生成:', { apiKey, input });
      
      // 模拟处理
      await new Promise(resolve => setTimeout(resolve, 1000));
      output = '面经生成助手功能正在开发中...';
    } finally {
      loading = false;
    }
  };
</script>

<PageTemplate 
  title="面经生成助手"
  description="根据岗位要求和技能点，生成针对性的面试题目和标准答案要点。"
  {apiKey}
  bind:input
  bind:output
  bind:loading
  placeholder="请输入岗位描述、技能要求、面试重点等信息..."
  buttonText="生成面经"
  loadingText="正在生成面试题目..."
  on:click={handleSubmit}
/>