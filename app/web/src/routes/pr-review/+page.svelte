<script lang="ts">
  import { tick } from 'svelte';
  import ResultView from '$lib/components/ResultView.svelte';
  import { apiKeyStore } from '$lib/stores/api';
  import { buildPRReviewPrompt } from '$lib/utils/prompt';
  import { useAIStream } from '$lib/hooks/useAIStream';

  let prUrl = '';
  let reviewTemplate = 'comprehensive';
  let isLoading = false;
  let parseError = '';
  let prInfo: any = null;
  let previousLoading = false;
  let hasGeneratedResult = false;

  $: aiStream = useAIStream("pr-review");
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

  const reviewTemplates = [
    { value: 'comprehensive', label: '全面审查', icon: '🔍' },
    { value: 'security', label: '安全审查', icon: '🔒' },
    { value: 'performance', label: '性能优化', icon: '⚡' },
    { value: 'code-style', label: '代码规范', icon: '📐' },
    { value: 'business-logic', label: '业务逻辑', icon: '💼' }
  ];

  // 解析GitHub PR URL
  function parsePRUrl(url: string): { owner: string; repo: string; prNumber: string } | null {
    // 支持多种格式：
    // https://github.com/owner/repo/pull/123
    // https://github.com/owner/repo/pull/123/files
    const regex = /github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/;
    const match = url.match(regex);
    
    if (!match) {
      return null;
    }
    
    return {
      owner: match[1],
      repo: match[2],
      prNumber: match[3]
    };
  }

  // 获取PR信息
  async function fetchPRInfo(owner: string, repo: string, prNumber: string) {
    // 获取PR基本信息
    const prResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`
    );
    
    if (!prResponse.ok) {
      throw new Error(`获取PR信息失败: ${prResponse.status} ${prResponse.statusText}`);
    }
    
    const prData = await prResponse.json();
    
    // 获取文件变更
    const filesResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`
    );
    
    if (!filesResponse.ok) {
      throw new Error(`获取文件变更失败: ${filesResponse.status} ${filesResponse.statusText}`);
    }
    
    const filesData = await filesResponse.json();
    
    return {
      title: prData.title,
      description: prData.body || '无描述',
      author: prData.user.login,
      state: prData.state,
      additions: prData.additions,
      deletions: prData.deletions,
      changedFiles: prData.changed_files,
      files: filesData.map((file: any) => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch || ''
      }))
    };
  }

  // 开始Review
  async function startReview() {
    if (!prUrl || !$apiKeyStore) return;

    parseError = '';
    prInfo = null;
    hasGeneratedResult = false;
    
    const parsed = parsePRUrl(prUrl);
    if (!parsed) {
      parseError = 'PR URL格式不正确，请输入正确的GitHub PR链接';
      return;
    }

    isLoading = true;
    
    try {
      // 获取PR信息
      prInfo = await fetchPRInfo(parsed.owner, parsed.repo, parsed.prNumber);
      
      // 构建提示词
      const prompt = buildPRReviewPrompt(prInfo, reviewTemplate);
      
      // 调用AI
      await aiStream.invoke(prompt);
      
    } catch (err) {
      console.error('获取PR信息失败:', err);
      parseError = err instanceof Error ? err.message : '获取PR信息失败，请检查URL是否正确或仓库是否为公开';
    } finally {
      isLoading = false;
    }
  }

  const resetAll = () => {
    prUrl = '';
    prInfo = null;
    parseError = '';
    hasGeneratedResult = false;
    aiStream.reset();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      startReview();
    }
  };
</script>

<svelte:head>
  <title>PR Review 助手 - Prompt Hub</title>
  <meta name="description" content="智能分析GitHub PR，自动生成代码审查意见" />
</svelte:head>

<div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
  <!-- 页面头部 -->
  <div class="mb-8">
    <div class="flex items-center space-x-4 mb-6">
      <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-medium">
        <span class="text-white text-xl">🔍</span>
      </div>
      <div>
        <h1 class="text-3xl font-bold text-neutral-800">PR Review 助手</h1>
        <p class="text-neutral-600">输入GitHub PR链接，AI自动分析代码变更并生成审查意见</p>
      </div>
    </div>
  </div>

  <!-- 主内容区域 -->
  <div class="space-y-8">
    <!-- 输入区域 -->
    <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden">
      <!-- 头部 -->
      <div class="bg-gradient-to-r from-green-50 to-teal-50 px-6 py-4 border-b border-neutral-100">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-neutral-800 flex items-center">
            <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
            输入PR信息
          </h3>
          <button
            on:click={resetAll}
            class="px-3 py-1 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors duration-200"
          >
            清空
          </button>
        </div>
      </div>

      <!-- 输入表单 -->
      <div class="p-6 space-y-6">
        <!-- PR URL输入 -->
        <div>
          <label for="pr-url-input" class="block text-sm font-medium text-neutral-700 mb-2">
            GitHub PR 链接 <span class="text-red-500">*</span>
          </label>
          <input
            id="pr-url-input"
            type="text"
            bind:value={prUrl}
            on:keydown={handleKeyDown}
            class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-neutral-400"
            placeholder="例如: https://github.com/owner/repo/pull/123"
          />
          <p class="mt-2 text-xs text-neutral-500">
            💡 提示：支持公开仓库的PR链接，按 Ctrl+Enter 快速开始审查
          </p>
          {#if parseError}
            <p class="mt-2 text-sm text-red-600 flex items-center">
              <span class="mr-1">⚠️</span>
              {parseError}
            </p>
          {/if}
        </div>

        <!-- Review模板选择 -->
        <div>
          <div class="block text-sm font-medium text-neutral-700 mb-3">
            审查模板
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {#each reviewTemplates as template}
              <button
                on:click={() => reviewTemplate = template.value}
                class="relative px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left {reviewTemplate === template.value 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-neutral-200 bg-white hover:border-green-300'}"
              >
                <div class="flex items-center space-x-2">
                  <span class="text-xl">{template.icon}</span>
                  <span class="text-sm font-medium text-neutral-700">{template.label}</span>
                </div>
                {#if reviewTemplate === template.value}
                  <div class="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs">✓</span>
                  </div>
                {/if}
              </button>
            {/each}
          </div>
        </div>

        <!-- 开始审查按钮 -->
        <div class="flex justify-center pt-4">
          <button
            class="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-neutral-300 disabled:to-neutral-400 text-white font-medium py-4 px-8 rounded-xl shadow-medium hover:shadow-strong disabled:shadow-none transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed relative overflow-hidden"
            on:click={startReview}
            disabled={!$apiKeyStore || !prUrl || loading || isLoading}
          >
            {#if isLoading}
              <div class="absolute inset-0 bg-green-400/20 animate-pulse"></div>
            {/if}
            <span class="flex items-center justify-center space-x-2 relative z-10">
              {#if isLoading}
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>正在获取PR信息...</span>
              {:else if loading}
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>AI正在审查代码...</span>
              {:else}
                <span>🔍</span>
                <span>开始审查</span>
              {/if}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- PR信息预览 -->
    {#if prInfo}
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-neutral-100">
          <h3 class="text-lg font-semibold text-neutral-800 flex items-center">
            <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            📊 PR 信息
          </h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium text-neutral-500 mb-1">标题</h4>
              <p class="text-neutral-800">{prInfo.title}</p>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <h4 class="text-sm font-medium text-neutral-500 mb-1">作者</h4>
                <p class="text-neutral-800">{prInfo.author}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-neutral-500 mb-1">变更文件</h4>
                <p class="text-neutral-800">{prInfo.changedFiles} 个</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-neutral-500 mb-1">新增行数</h4>
                <p class="text-green-600 font-medium">+{prInfo.additions}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-neutral-500 mb-1">删除行数</h4>
                <p class="text-red-600 font-medium">-{prInfo.deletions}</p>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-neutral-500 mb-2">变更文件列表</h4>
              <div class="bg-neutral-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                {#each prInfo.files as file}
                  <div class="flex items-center justify-between py-1 text-sm">
                    <span class="text-neutral-700 font-mono text-xs">{file.filename}</span>
                    <span class="text-neutral-500 text-xs">
                      <span class="text-green-600">+{file.additions}</span>
                      <span class="mx-1">|</span>
                      <span class="text-red-600">-{file.deletions}</span>
                    </span>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- 输出区域 -->
    {#if output}
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden">
        <div class="bg-gradient-to-r from-green-50 to-teal-50 px-6 py-4 border-b border-neutral-100">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-neutral-800 flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              📝 审查结果
            </h3>
            {#if loading}
              <div class="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center space-x-2">
                <div class="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <span>{$statusTip}</span>
              </div>
            {/if}
          </div>
        </div>
        <div class="p-6">
          <ResultView text={output} />
        </div>
      </div>
    {/if}
  </div>
</div>

