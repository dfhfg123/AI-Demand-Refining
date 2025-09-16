<script lang="ts">
  import ApiKeyPanel from '$lib/components/ApiKeyPanel.svelte';
  import ResultView from '$lib/components/ResultView.svelte';
  import ModelSelect from '$lib/components/ModelSelect.svelte';
  import { apiKeyStore } from '$lib/stores/api';
  import { createAIService, invokeWithPrompt } from '$lib/utils/aiService';
  import { buildInterviewPrompt ,buildInterviewPromptBroad} from '@prompt-hub/prompt';

  let input = '';
  let isDeepMode = true; // 默认深度模式

  // 使用统一的AI服务
  const aiService = createAIService();

  // 响应式获取AI服务状态
  $: ({ loading, progress, status, result, error } = $aiService);
  $: output = result || error || '';



  // 生成面试答案
  const generateAnswer = async () => {
    if (!$apiKeyStore) return;
    if (!input.trim()) {
      alert('输入面经');
      return;
    }

    // 根据模式选择不同的提示词
    const prompt = isDeepMode
      ? buildInterviewPrompt(input.trim())
      : buildInterviewPromptBroad(input.trim());

    await invokeWithPrompt(prompt, aiService);
  };

  // 重置
  const resetAll = () => {
    input = '';
    aiService.reset();
  };
</script>

<svelte:head>
  <title>面经生成助手 - Prompt Hub</title>
  <meta name="description" content="输入面试经历，生成专业的满分答案" />
</svelte:head>

<div class="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
  <!-- 页面头部 -->
  <div class="mb-8">
    <div class="flex items-center space-x-4 mb-6">
      <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-medium">
        <span class="text-white text-xl">💼</span>
      </div>
      <div>
        <h1 class="text-3xl font-bold text-neutral-800">面经转八股</h1>
        <p class="text-neutral-600">输入面经，生成专业的满分答案</p>
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

        <!-- 模式选择下拉框 -->
        <div class="flex-shrink-0">
          <select
            bind:value={isDeepMode}
            class="w-full sm:w-40 px-3 py-1.5 text-sm border border-neutral-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value={true}>🔍 深度模式</option>
            <option value={false}>🚀 广度模式</option>
          </select>
        </div>

        <!-- 操作按钮 -->
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-3">
          <button
            class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-neutral-300 disabled:to-neutral-400 text-white font-medium py-3 px-6 rounded-xl shadow-medium hover:shadow-strong disabled:shadow-none transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed relative overflow-hidden w-full sm:w-auto"
            on:click={generateAnswer}
            disabled={!$apiKeyStore || loading}
          >
            <!-- 进度条背景 -->
            {#if loading && progress > 0}
              <div
                class="absolute inset-0 bg-indigo-400/30 transition-all duration-300 ease-out"
                style="width: {progress}%"
              ></div>
            {/if}

            <span class="flex items-center justify-center space-x-2 relative z-10">
              {#if loading}
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm">{status || '处理中...'}</span>
              {:else}
                <span>🎯</span>
                <span>生成结果</span>
              {/if}
            </span>
          </button>

          <button
            on:click={resetAll}
            class="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-xl transition-colors duration-200 w-full sm:w-auto"
          >
            重置
          </button>
        </div>
      </div>

      <!-- 简化的进度信息 -->
      {#if loading && status}
        <div class="mt-3 text-center">
          <div class="text-xs text-neutral-500">
            {status} {progress}%
          </div>
        </div>
      {/if}
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- 左侧：输入区域 -->
    <div class="space-y-6">
      <!-- 输入框 -->
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-neutral-800 flex items-center">
            <span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
            面经 <span class="text-red-500 ml-1">*</span>
          </h3>

          <!-- 模式说明 -->
          <div class="text-xs text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-full">
            当前模式：{isDeepMode ? '🔍 深度模式' : '🚀 广度模式'}
          </div>
        </div>
        <div>
          <textarea
            bind:value={input}
            class="w-full h-96 p-4 border border-neutral-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            placeholder="输入一份面经，我会告诉你满分回答，快拿去背吧！"
          ></textarea>
        </div>
      </div>

      <!-- 模式说明 -->
      <!-- <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-soft border border-blue-200/30">
        <h3 class="text-lg font-semibold text-blue-800 mb-3 flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          💡 模式说明
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="bg-white/60 rounded-lg p-4">
            <div class="flex items-center mb-2">
              <span class="text-lg mr-2">🔍</span>
              <span class="font-semibold text-blue-700">深度模式</span>
            </div>
            <ul class="text-blue-600 space-y-1">
              <li>• 详细分析底层原理</li>
              <li>• 提供完整代码实现</li>
              <li>• 包含多种解法对比</li>
              <li>• 适合深入学习和理解</li>
            </ul>
          </div>
          <div class="bg-white/60 rounded-lg p-4">
            <div class="flex items-center mb-2">
              <span class="text-lg mr-2">🚀</span>
              <span class="font-semibold text-blue-700">广度模式</span>
            </div>
            <ul class="text-blue-600 space-y-1">
              <li>• 快速覆盖核心知识点</li>
              <li>• 结论先行，简洁高效</li>
              <li>• 突出面试采分点</li>
              <li>• 适合快速复习和应试</li>
            </ul>
          </div>
        </div>
      </div> -->

      <!-- 使用提示 -->
      <!-- <div class="bg-blue-50/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-blue-200/20">
        <h3 class="text-lg font-semibold text-blue-800 mb-3 flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          💡 使用提示
        </h3>
        <ul class="text-blue-700 text-sm space-y-2">
          <li>• 详细描述面试问题，包括技术问题、项目经验、算法题等</li>
          <li>• 可以包含多个问题，AI会自动识别并逐一回答</li>
          <li>• 生成的答案会包含核心结论、详细解析和延伸思考</li>
          <li>• 算法题会提供思路分析、复杂度说明和代码示例</li>
          <li>• 项目问题会给出背景、方案对比和解决方案</li>
        </ul>
      </div> -->
    </div>

    <!-- 右侧：输出区域 -->
    <div>
      <ResultView text={output} />
    </div>
  </div>
</div>


