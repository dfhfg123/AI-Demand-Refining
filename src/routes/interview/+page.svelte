<script lang="ts">
  import ApiKeyPanel from '$lib/components/ApiKeyPanel.svelte';
  import ResultView from '$lib/components/ResultView.svelte';
  import ModelSelect from '$lib/components/ModelSelect.svelte';
  import { apiKeyStore } from '$lib/stores/api';
  import { createAIService, invokeWithPrompt } from '$lib/utils/aiService';

  let input = '';
  
  // 使用统一的AI服务
  const aiService = createAIService();
  
  // 响应式获取AI服务状态
  $: ({ loading, progress, status, result, error } = $aiService);
  $: output = result || error || '';

  // 面试官提示词
  const buildInterviewPrompt = (doc: string): string => {
    return [
      '你是一位资深技术面试官，深谙计算机体系结构、网络协议、前端工程化、浏览器原理、算法与系统设计。',
      '我会给你一份候选人的面试题，其中包含多个问题。',
      '',
      '你的任务是：',
      '',
      '自动识别并逐条回答这些问题。回答时按顺序标好原题和序号',
      '',
      '每个回答都要做到：',
      '',
      '完整：覆盖核心流程，不遗漏关键步骤。',
        '• 覆盖「核心流程/关键原理/最佳实践/常见陷阱/度量与优化」等面试官关心点；',
  '• 采用轻结构：短段落 + 列表 + 必要代码块/示意；避免整段大段文字堆砌；',
  '• 具体可操作：给出明确名词、机制、关键参数、常见配置或示例；',
   '• 对于经典题目（如“URL→页面渲染、http三次握手、css布局等”），要回答的尽量全面完善，包含尽量多的细节',
      '',
      '深入：展开到关键的底层原理（例如协议交互细节、操作系统机制、浏览器内部实现等）。',
      '',
      '面试官视角：回答要精准切中面试官考察点，避免泛泛而谈。',
      '',
      '可能的追问：主动补充面试中可能被追问的延伸问题，展示思考深度。',
      '',
      '回答时直入主题，不要输出任何提示性话语（例如"以下是解答""最优答案"），只输出答案。',
      '',
      '算法题：提供思路分析 + 时间复杂度 + 可运行的 TypeScript/JavaScript 代码。如果有多种解法，一一列出，并分析面试官更喜欢哪种。',
      '',
      '项目/架构题：说明背景、选型原因、实现难点、解决方案及效果。',
      '',
      '输出的答案保持格式清晰易读',
      '',
      '以下是候选人的面经：',
      '',
      doc
    ].join('\n');
  };

  // 生成面试答案
  const generateAnswer = async () => {
    if (!$apiKeyStore) return;
    if (!input.trim()) {
      alert('输出面经');
      return;
    }
    
    const prompt = buildInterviewPrompt(input.trim());
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
        <h3 class="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
          <span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          面经 <span class="text-red-500 ml-1">*</span>
        </h3>
        <div>
          <textarea 
            bind:value={input}
            class="w-full h-96 p-4 border border-neutral-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            placeholder="输入一份面经，我会告诉你满分回答，快拿去背吧！"
          ></textarea>
        </div>
      </div>

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


