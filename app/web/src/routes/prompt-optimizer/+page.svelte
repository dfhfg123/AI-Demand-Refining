<script lang="ts">
  import { tick } from 'svelte';
  import ApiKeyPanel from '$lib/components/ApiKeyPanel.svelte';
  import ResultView from '$lib/components/ResultView.svelte';
  import ModelSelect from '$lib/components/ModelSelect.svelte';
  import { apiKeyStore } from '$lib/stores/api';
  import { buildPromptOptimizer } from '$lib/utils/prompt';
  import { useAIStream } from '$lib/hooks/useAIStream';

  let input = '';
  let previousLoading = false;
  let hasGeneratedResult = false;

  $: aiStream = useAIStream("prompt-optimizer");
  $: state = aiStream.state;
  $: ({ progress, status, result, error } = $state);
  $: statusTip = aiStream.statusTip;
  $: output = result || error || "";
  $: loading = status !== "done" && status !== "error" && status !== "idle";
  
  // 监听加载状态变化，生成完成后自动滚动到底部
  $: {
    const justFinished = previousLoading && !loading;
    const hasNewResult = (result && result.length > 0) || (error && error.length > 0);

    if (justFinished && hasNewResult && !hasGeneratedResult) {
      hasGeneratedResult = true;
      tick().then(() => {
        setTimeout(() => {
          const currentHeight = document.documentElement.scrollHeight;
          window.scrollTo({
            top: currentHeight,
            behavior: 'smooth'
          });
        }, 300);
      });
    }

    previousLoading = loading;
  }

  const optimize = async () => {
    if (!input || !$apiKeyStore) return;

    hasGeneratedResult = false;
    const prompt = buildPromptOptimizer(input);
    await aiStream.invoke(prompt);
  };

  const resetAll = () => {
    input = '';
    hasGeneratedResult = false;
    aiStream.reset();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl+Enter 或 Cmd+Enter 触发生成
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      optimize();
    }
  };
</script>

<svelte:head>
  <title>AI 提示词优化专家 - Prompt Hub</title>
  <meta name="description" content="使用AI优化你的提示词，提升AI响应质量" />
</svelte:head>

<div class="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
  <!-- 页面头部 -->
  <div class="mb-8">
    <div class="flex items-center space-x-4 mb-6">
      <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-medium">
        <span class="text-white text-xl">✨</span>
      </div>
      <div>
        <h1 class="text-3xl font-bold text-neutral-800">AI 提示词优化专家</h1>
        <p class="text-neutral-600">输入你的提示词，AI会帮你优化成更精准、更有效的版本</p>
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
      <div class="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-neutral-100">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-neutral-800 flex items-center">
            <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
            输入提示词
          </h3>
          <div class="flex items-center space-x-3">
            <span class="text-xs text-neutral-500 bg-white/50 px-3 py-1 rounded-full">
              支持 Ctrl+Enter 快速生成
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
        <input
          type="text"
          bind:value={input}
          on:keydown={handleKeyDown}
          class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-neutral-400"
          placeholder="输入你想优化的提示词，例如：帮我写一篇文章"
        />
        <p class="mt-2 text-xs text-neutral-500">
          提示：输入任何提示词，AI会根据4-D方法论（解构、诊断、开发、交付）为你优化
        </p>
      </div>

      <!-- 操作按钮 -->
      <div class="px-6 pb-6">
        <button
          class="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-neutral-300 disabled:to-neutral-400 text-white font-medium py-4 px-6 rounded-xl shadow-medium hover:shadow-strong disabled:shadow-none transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed relative overflow-hidden"
          on:click={optimize}
          disabled={!$apiKeyStore || !input || loading}
        >
          <!-- 进度条背景 - 仅在思考阶段显示 -->
          {#if loading && (!result || result.length === 0)}
            <div class="absolute inset-0 bg-purple-400/20 animate-pulse"></div>
          {/if}

          <span class="flex items-center justify-center space-x-2 relative z-10">
            {#if loading}
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>
                {#if result && result.length > 0}
                  正在优化提示词...
                {:else}
                  正在分析提示词...
                {/if}
              </span>
            {:else}
              <span>✨</span>
              <span>优化提示词</span>
            {/if}
          </span>
        </button>

        <!-- 状态信息 -->
        {#if loading}
          <div class="mt-3 text-center">
            <div class="text-xs text-neutral-500">
              {#if result && result.length > 0}
                正在实时生成优化后的提示词，请查看下方结果区域
              {:else}
                正在连接AI服务并分析提示词...
              {/if}
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

