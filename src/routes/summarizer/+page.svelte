<script lang="ts">
  import { tick } from 'svelte';
  import ApiKeyPanel from '$lib/components/ApiKeyPanel.svelte';
  import ResultView from '$lib/components/ResultView.svelte';
  import ModelSelect from '$lib/components/ModelSelect.svelte';
  import { apiKeyStore } from '$lib/stores/api';
  import { createAIService, invokeWithPrompt } from '$lib/utils/aiService';
  import { buildPrompt } from '$lib/utils/prompt';

  let input = '';
  let previousLoading = false;
  let hasGeneratedResult = false;
  
  // 使用统一的AI服务
  const aiService = createAIService();
  
  // 响应式获取AI服务状态
  $: ({ loading, progress, status, result, error } = $aiService);
  $: output = result || error || '';
  
  // 监听加载状态变化，生成完成后自动滚动到底部
  $: {
    // 检测从加载中到加载完成，且有结果或错误
    const justFinished = previousLoading && !loading;
    const hasNewResult = (result && result.length > 0) || (error && error.length > 0);
    
    if (justFinished && hasNewResult && !hasGeneratedResult) {
      hasGeneratedResult = true;
      console.log('检测到AI生成完成，开始滚动');
      
      // AI生成完成，延迟一点时间确保DOM更新完成后再滚动
      tick().then(() => {
        setTimeout(() => {
          const currentHeight = document.documentElement.scrollHeight;
          console.log('当前页面高度:', currentHeight);
          
          window.scrollTo({
            top: currentHeight,
            behavior: 'smooth'
          });
        }, 300); // 增加延迟时间确保ResultView组件完全渲染
      });
    }
    
    previousLoading = loading;
  }

  const summarize = async () => {
    if (!input || !$apiKeyStore) return;
    
    hasGeneratedResult = false; // 重置滚动标志，准备新的生成
    const prompt = buildPrompt(input);
    await invokeWithPrompt(prompt, aiService);
  };

  const resetAll = () => {
    input = '';
    hasGeneratedResult = false; // 重置滚动标志
    aiService.reset();
  };
</script>

<svelte:head>
  <title>AI 需求提炼专家 - Prompt Hub</title>
  <meta name="description" content="自动提取文档中的核心信息，生成精准的开发需求" />
</svelte:head>

<div class="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
  <!-- 页面头部 -->
  <div class="mb-8">
    <div class="flex items-center space-x-4 mb-6">
      <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-medium">
        <span class="text-white text-xl">📝</span>
      </div>
      <div>
        <h1 class="text-3xl font-bold text-neutral-800">AI 需求提炼专家</h1>
        <p class="text-neutral-600">自动提取文档中的核心信息，生成精准的开发需求</p>
      </div>
    </div>
    
    <!-- API Key 配置区域 -->
    <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20">
      <!-- 标题 -->
      <h3 class="text-lg font-semibold text-neutral-800 flex items-center mb-4">
        <span class="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
        API 配置
      </h3>
      
      <!-- 配置内容 - 移动端垂直布局，桌面端水平布局 -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <!-- API Key 输入 -->
        <div class="flex-1 sm:max-w-md">
          <ApiKeyPanel inline={true} />
        </div>
        
        <!-- 模型选择 -->
        <div class="flex-shrink-0">
          <ModelSelect inline={true} />
        </div>
      </div>
    </div>
  </div>

  <!-- 主内容区域 -->
  <div class="space-y-8">
    <!-- 输入区域 -->
    <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden">
      <!-- 头部 -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-neutral-100">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-neutral-800 flex items-center">
            <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            输入文档
          </h3>
          <div class="flex items-center space-x-3">
            <span class="text-xs text-neutral-500 bg-white/50 px-3 py-1 rounded-full">
              可直接粘贴产品文档
            </span>
            <button 
              on:click={resetAll}
              class="px-3 py-1 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors duration-200"
            >
              清空
            </button>
          </div>
        </div>
      </div>
      
      <!-- 输入框 -->
      <div class="p-6">
        <textarea 
          bind:value={input} 
          class="w-full h-80 p-4 bg-neutral-50 border border-neutral-200 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-neutral-400"
          placeholder={`你有没有想过直接把产品的PRD文档给cursor或者claude code就可以直接完成需求自己只需要喝咖啡等待呢。
          
但是，你一定常看到过相当冗长的产品需求文档，其中包含大量你看不懂或者你根本不关心的逻辑。
作为一个前端，我只想知道给了我几个接口,改动的有哪些页面不有哪些交互逻辑，但了解这些往往却需要要画大量时间看你完全不需要懂的逻辑。

并且如果直接把这个繁琐的prd给大模型，由于过多的无用上下文干扰，以及召回率影响，生成代码质量相当差。

那么,如果直接把文档粘贴到这里，会有你想要的答案！把输出的内容作为prompt给ai编辑器你就可以去喝咖啡了!
          `}
        ></textarea>
      </div>
      
      <!-- 操作按钮 -->
      <div class="px-6 pb-6">
        <button 
          class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-neutral-300 disabled:to-neutral-400 text-white font-medium py-4 px-6 rounded-xl shadow-medium hover:shadow-strong disabled:shadow-none transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed relative overflow-hidden"
          on:click={summarize} 
          disabled={!$apiKeyStore || !input || loading}
        >
          <!-- 进度条背景 -->
          {#if loading && progress > 0}
            <div 
              class="absolute inset-0 bg-primary-400/30 transition-all duration-300 ease-out"
              style="width: {progress}%"
            ></div>
          {/if}
          
          <span class="flex items-center justify-center space-x-2 relative z-10">
            {#if loading}
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{status || '正在处理...'} {progress}%</span>
            {:else}
              <span>🤖</span>
              <span>生成总结</span>
            {/if}
          </span>
        </button>
        
        <!-- 简化的进度信息 -->
        {#if loading && status}
          <div class="mt-3 text-center">
            <div class="text-xs text-neutral-500">
              {status}
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- 输出区域 -->
    <div>
      <ResultView text={output} />
    </div>
  </div>
</div>