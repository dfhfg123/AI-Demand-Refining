<script lang="ts">
  export let title: string;
  export let description: string;
  export let apiKey: string;
  export let input: string = '';
  export let output: string = '';
  export let loading: boolean = false;
  export let placeholder: string = '';
  export let buttonText: string = '开始生成';
  export let loadingText: string = '正在处理...';
  
  const clearContent = () => {
    input = '';
    output = '';
  };
</script>

<div class="space-y-6">
  <!-- 页面头部 -->
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900">{title}</h3>
    <p class="text-sm text-gray-600 mt-2">{description}</p>
  </div>
  
  <!-- 输入区域 -->
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">输入内容</h3>
      <button 
        class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
        on:click={clearContent}
      >
        清空
      </button>
    </div>
    <textarea
      bind:value={input}
      {placeholder}
      class="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
    ></textarea>
  </div>
  
  <!-- 操作按钮 -->
  <div class="flex justify-center">
    <button
      class="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      disabled={!apiKey || !input || loading}
      on:click
    >
      {loading ? loadingText : buttonText}
    </button>
  </div>
  
  <!-- 结果展示 -->
  {#if output}
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">生成结果</h3>
      <div class="prose max-w-none">
        <div class="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-sm text-gray-800">{output}</div>
      </div>
    </div>
  {/if}
</div>