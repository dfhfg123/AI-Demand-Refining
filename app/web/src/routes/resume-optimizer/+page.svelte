<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { browser } from '$app/environment';
  import ResultView from '$lib/components/ResultView.svelte';
  import { apiKeyStore } from '$lib/stores/api';
  import { buildResumeParsePrompt, buildResumeAnalyzePrompt, buildResumeOptimizePrompt } from '$lib/utils/prompt';
  import { useAIStream } from '$lib/hooks/useAIStream';

  let pdfjsLib: any = null;
  let pdfLibLoading = true;
  let pdfLibError = '';

  // 只在客户端加载 pdfjs-dist
  onMount(async () => {
    if (browser) {
      try {
        pdfjsLib = await import('pdfjs-dist');
        // 使用 unpkg CDN，更稳定
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        pdfLibLoading = false;
      } catch (error) {
        console.error('PDF库加载失败:', error);
        pdfLibError = 'PDF库加载失败，请刷新页面重试';
        pdfLibLoading = false;
      }
    }
  });

  let fileInput: HTMLInputElement;
  let selectedFile: File | null = null;
  let extractedText = '';
  let isExtracting = false;
  let extractError = '';
  
  // 三个阶段的AI流
  let currentStage: 'parse' | 'analyze' | 'optimize' | 'idle' = 'idle';
  let parsedData = '';
  let analysisReport = '';
  let optimizedResume = '';
  
  let previousLoading = false;
  let hasGeneratedResult = false;

  $: parseStream = useAIStream("resume-parse");
  $: analyzeStream = useAIStream("resume-analyze");
  $: optimizeStream = useAIStream("resume-optimize");

  $: parseState = parseStream.state;
  $: analyzeState = analyzeStream.state;
  $: optimizeState = optimizeStream.state;

  $: currentStream = 
    currentStage === 'parse' ? parseStream :
    currentStage === 'analyze' ? analyzeStream :
    currentStage === 'optimize' ? optimizeStream : null;

  $: loading = 
    $parseState.status !== "done" && $parseState.status !== "error" && $parseState.status !== "idle" ||
    $analyzeState.status !== "done" && $analyzeState.status !== "error" && $analyzeState.status !== "idle" ||
    $optimizeState.status !== "done" && $optimizeState.status !== "error" && $optimizeState.status !== "idle";

  // 提取PDF文本
  async function extractTextFromPDF(file: File): Promise<string> {
    isExtracting = true;
    extractError = '';
    
    try {
      if (!pdfjsLib) {
        throw new Error('PDF库尚未加载完成，请稍后再试');
      }
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }
      
      return fullText.trim();
    } catch (error) {
      console.error('PDF提取错误:', error);
      throw new Error('PDF文本提取失败，请确保文件格式正确');
    } finally {
      isExtracting = false;
    }
  }

  // 文件选择处理
  async function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      extractError = '请上传PDF格式的简历文件';
      return;
    }
    
    selectedFile = file;
    
    try {
      extractedText = await extractTextFromPDF(file);
      extractError = '';
    } catch (error) {
      extractError = error instanceof Error ? error.message : '文件提取失败';
      extractedText = '';
    }
  }

  // 开始优化流程
  async function startOptimization() {
    if (!extractedText || !$apiKeyStore) return;
    
    // 重置所有状态
    parsedData = '';
    analysisReport = '';
    optimizedResume = '';
    hasGeneratedResult = false;
    
    parseStream.reset();
    analyzeStream.reset();
    optimizeStream.reset();

    try {
      // 阶段1：结构化解析
      currentStage = 'parse';
      const parsePrompt = buildResumeParsePrompt(extractedText);
      await parseStream.invoke(parsePrompt);
      parsedData = $parseState.result;

      if (!parsedData || $parseState.error) {
        throw new Error('简历解析失败');
      }

      // 等待一下确保状态更新
      await tick();
      await new Promise(resolve => setTimeout(resolve, 500));

      // 阶段2：诊断分析
      currentStage = 'analyze';
      const analyzePrompt = buildResumeAnalyzePrompt(parsedData);
      await analyzeStream.invoke(analyzePrompt);
      analysisReport = $analyzeState.result;

      if (!analysisReport || $analyzeState.error) {
        throw new Error('简历诊断失败');
      }

      // 等待一下
      await tick();
      await new Promise(resolve => setTimeout(resolve, 500));

      // 阶段3：优化重写
      currentStage = 'optimize';
      const optimizePrompt = buildResumeOptimizePrompt(parsedData, analysisReport);
      await optimizeStream.invoke(optimizePrompt);
      optimizedResume = $optimizeState.result;

      if (optimizedResume) {
        hasGeneratedResult = true;
        // 滚动到结果
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

      currentStage = 'idle';
    } catch (error) {
      console.error('优化流程错误:', error);
      currentStage = 'idle';
    }
  }

  // 重置所有
  function resetAll() {
    selectedFile = null;
    extractedText = '';
    extractError = '';
    parsedData = '';
    analysisReport = '';
    optimizedResume = '';
    hasGeneratedResult = false;
    currentStage = 'idle';
    
    parseStream.reset();
    analyzeStream.reset();
    optimizeStream.reset();
    
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // 复制结果
  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert('已复制到剪贴板');
    } catch (error) {
      alert('复制失败，请手动复制');
    }
  }

  // 下载为Markdown文件
  function downloadAsMarkdown(text: string, filename: string) {
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // 获取当前状态提示
  $: statusMessage = 
    currentStage === 'parse' ? '🔍 正在解析简历结构...' :
    currentStage === 'analyze' ? '📊 正在诊断问题和优化空间...' :
    currentStage === 'optimize' ? '✨ 正在重写优化简历...' :
    isExtracting ? '📄 正在提取PDF文本...' : '';
</script>

<svelte:head>
  <title>简历优化助手 - Prompt Hub</title>
  <meta name="description" content="上传简历PDF，AI自动优化为ATS友好、量化成果突出的专业简历" />
</svelte:head>

<div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
  <!-- 页面头部 -->
  <div class="mb-8">
    <div class="flex items-center space-x-4 mb-6">
      <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-medium">
        <span class="text-white text-xl">📄</span>
      </div>
      <div>
        <h1 class="text-3xl font-bold text-neutral-800">简历优化助手</h1>
        <p class="text-neutral-600">上传PDF简历，AI三步优化：结构化解析 → 深度诊断 → ATS友好重写</p>
      </div>
    </div>
  </div>

  <!-- 主内容区域 -->
  <div class="space-y-8">
    <!-- 上传区域 -->
    <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden">
      <div class="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-neutral-100">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-neutral-800 flex items-center">
            <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
            上传简历
          </h3>
          <button
            on:click={resetAll}
            class="px-3 py-1 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors duration-200"
          >
            清空重置
          </button>
        </div>
      </div>

      <div class="p-6 space-y-6">
        <!-- 文件上传 -->
        <div>
          <label for="resume-upload" class="block text-sm font-medium text-neutral-700 mb-3">
            选择PDF简历文件
          </label>
          <div class="flex items-center space-x-4">
            <input
              id="resume-upload"
              type="file"
              accept=".pdf"
              bind:this={fileInput}
              on:change={handleFileSelect}
              class="hidden"
            />
            <button
              on:click={() => fileInput?.click()}
              disabled={isExtracting || loading || pdfLibLoading || !!pdfLibError}
              class="px-6 py-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>📁</span>
              <span>
                {#if pdfLibError}
                  {pdfLibError}
                {:else if pdfLibLoading}
                  初始化中...
                {:else if selectedFile}
                  重新选择文件
                {:else}
                  选择PDF文件
                {/if}
              </span>
            </button>
            {#if selectedFile}
              <div class="flex items-center space-x-2 text-sm text-neutral-600">
                <span>✓</span>
                <span class="font-medium">{selectedFile.name}</span>
                <span class="text-neutral-400">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            {/if}
          </div>
          <p class="mt-2 text-xs text-neutral-500">
            💡 支持标准PDF格式简历，建议文件大小不超过5MB
          </p>
          {#if extractError}
            <p class="mt-2 text-sm text-red-600 flex items-center">
              <span class="mr-1">⚠️</span>
              {extractError}
            </p>
          {/if}
        </div>

        <!-- 提取的文本预览 -->
        {#if extractedText}
          <div>
            <h4 class="text-sm font-medium text-neutral-700 mb-2">提取的文本预览</h4>
            <div class="bg-neutral-50 rounded-lg p-4 max-h-48 overflow-y-auto border border-neutral-200">
              <pre class="text-xs text-neutral-600 whitespace-pre-wrap font-mono">{extractedText.substring(0, 500)}...</pre>
            </div>
            <p class="mt-2 text-xs text-neutral-500">
              共提取 {extractedText.length} 个字符
            </p>
          </div>
        {/if}

        <!-- 开始优化按钮 -->
        <div class="flex justify-center pt-4">
          <button
            on:click={startOptimization}
            disabled={!extractedText || !$apiKeyStore || loading}
            class="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-neutral-300 disabled:to-neutral-400 text-white font-medium py-4 px-8 rounded-xl shadow-medium hover:shadow-strong disabled:shadow-none transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {#if loading}
              <div class="absolute inset-0 bg-indigo-400/20 animate-pulse"></div>
            {/if}
            <span class="flex items-center justify-center space-x-2 relative z-10">
              {#if loading}
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{statusMessage}</span>
              {:else}
                <span>✨</span>
                <span>开始AI优化</span>
              {/if}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- 优化进度 -->
    {#if loading}
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
        <h3 class="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
          <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
          优化进度
        </h3>
        <div class="space-y-3">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center {currentStage === 'parse' ? 'bg-indigo-100 text-indigo-600' : parsedData ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-400'}">
              {parsedData ? '✓' : currentStage === 'parse' ? '⋯' : '1'}
            </div>
            <div class="flex-1">
              <div class="text-sm font-medium">阶段1：结构化解析</div>
              <div class="text-xs text-neutral-500">提取姓名、教育、工作经历、项目、技能等信息</div>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center {currentStage === 'analyze' ? 'bg-indigo-100 text-indigo-600' : analysisReport ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-400'}">
              {analysisReport ? '✓' : currentStage === 'analyze' ? '⋯' : '2'}
            </div>
            <div class="flex-1">
              <div class="text-sm font-medium">阶段2：深度诊断</div>
              <div class="text-xs text-neutral-500">分析问题、识别优化空间、制定优化策略</div>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center {currentStage === 'optimize' ? 'bg-indigo-100 text-indigo-600' : optimizedResume ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-400'}">
              {optimizedResume ? '✓' : currentStage === 'optimize' ? '⋯' : '3'}
            </div>
            <div class="flex-1">
              <div class="text-sm font-medium">阶段3：优化重写</div>
              <div class="text-xs text-neutral-500">ATS友好、量化成果、强动词、STAR法则</div>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- 诊断报告 -->
    {#if analysisReport}
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden">
        <div class="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-neutral-100">
          <h3 class="text-lg font-semibold text-neutral-800 flex items-center">
            <span class="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
            📊 诊断报告
          </h3>
        </div>
        <div class="p-6">
          <ResultView text={analysisReport} />
        </div>
      </div>
    {/if}

    <!-- 优化后的简历 -->
    {#if optimizedResume}
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden">
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-neutral-100">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-neutral-800 flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              ✨ 优化后的简历
            </h3>
            <div class="flex items-center space-x-2">
              <button
                on:click={() => copyToClipboard(optimizedResume)}
                class="px-3 py-1.5 text-xs font-medium bg-white hover:bg-neutral-50 text-neutral-700 rounded-lg transition-colors border border-neutral-200"
              >
                📋 复制
              </button>
              <button
                on:click={() => downloadAsMarkdown(optimizedResume, 'optimized_resume.md')}
                class="px-3 py-1.5 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                💾 下载
              </button>
            </div>
          </div>
        </div>
        <div class="p-6">
          <ResultView text={optimizedResume} />
        </div>
      </div>
    {/if}
  </div>
</div>

