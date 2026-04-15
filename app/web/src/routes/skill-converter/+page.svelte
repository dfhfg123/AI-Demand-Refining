<script lang="ts">
  import { tick } from 'svelte';
  import SkillOutput from './SkillOutput.svelte';
  import { apiKeyStore } from '$lib/stores/api';
  import { buildSkillConverterPrompt } from '$lib/utils/prompt';
  import { useAIStream } from '$lib/hooks/useAIStream';

  let input = '';
  let previousLoading = false;
  let hasGeneratedResult = false;
  let parsedResult: any = null;
  let parseError = '';

  $: aiStream = useAIStream("skill-converter");
  $: state = aiStream.state;
  $: ({ status, result, error } = $state);
  $: loading = status !== "done" && status !== "error" && status !== "idle";

  $: {
    const justFinished = previousLoading && !loading;
    const hasNewResult = (result && result.length > 0) || (error && error.length > 0);

    if (justFinished && hasNewResult && !hasGeneratedResult) {
      hasGeneratedResult = true;
      tick().then(() => {
        setTimeout(() => {
          const currentHeight = document.documentElement.scrollHeight;
          window.scrollTo({ top: currentHeight, behavior: 'smooth' });
        }, 300);
      });
    }

    previousLoading = loading;
  }

  const parseSectionFormat = (raw: string): any | null => {
    if (!raw.includes('===SECTION:')) return null;

    const sections: Record<string, string> = {};
    const regex = /===SECTION:(\w+)===\n([\s\S]*?)(?====SECTION:|===END===|$)/g;
    let match;
    while ((match = regex.exec(raw)) !== null) {
      sections[match[1]] = match[2].trim();
    }

    if (!sections.skillName || !sections.skillMd) return null;

    return {
      skillName: sections.skillName,
      skillMd: sections.skillMd,
      usageGuide: sections.usageGuide || '',
      fileStructure: {
        'SKILL.md': sections.skillMd,
        'README.md': sections.readme || ''
      }
    };
  };

  const parseAIResult = (raw: string) => {
    parseError = '';
    parsedResult = null;

    const sectionResult = parseSectionFormat(raw);
    if (sectionResult) {
      parsedResult = sectionResult;
      return;
    }

    let jsonStr = raw.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      parseError = 'AI 返回的结果格式异常，请重试';
      return;
    }

    if (!parsed.skillName || !parsed.skillMd) {
      parseError = 'AI 返回的结果缺少必要字段，请重试';
      return;
    }

    parsedResult = parsed;
  };

  $: if (status === 'done' && result) {
    parseAIResult(result);
  }

  const convert = async () => {
    if (!input || !$apiKeyStore) return;

    hasGeneratedResult = false;
    parsedResult = null;
    parseError = '';
    const prompt = buildSkillConverterPrompt(input);
    await aiStream.invoke(prompt);
  };

  const resetAll = () => {
    input = '';
    hasGeneratedResult = false;
    parsedResult = null;
    parseError = '';
    aiStream.reset();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      convert();
    }
  };
</script>

<svelte:head>
  <title>Prompt → Skill 转换器 - Prompt Hub</title>
  <meta name="description" content="将 Prompt 转换为可复用的 Agent Skill 配置文件" />
</svelte:head>

<div class="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
  <div class="mb-8">
    <div class="flex items-center space-x-4 mb-6">
      <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-medium">
        <span class="text-white text-xl">⚡</span>
      </div>
      <div>
        <h1 class="text-3xl font-bold text-neutral-800">Prompt → Skill 转换器</h1>
        <p class="text-neutral-600">输入 Prompt 或能力描述，一键生成 Agent Skill 配置包</p>
      </div>
    </div>
  </div>

  <div class="space-y-8">
    <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden">
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-neutral-100">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-neutral-800 flex items-center">
            <span class="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
            输入 Prompt 或能力描述
          </h3>
          <div class="flex items-center space-x-3">
            <span class="text-xs text-neutral-500 bg-white/50 px-3 py-1 rounded-full">
              Ctrl+Enter 快速转换
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

      <div class="p-6">
        <textarea
          bind:value={input}
          on:keydown={handleKeyDown}
          rows="5"
          class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 placeholder-neutral-400 resize-none"
          placeholder="描述你想要的 Agent 能力，例如：&#10;- 帮我审查 GitHub PR，关注安全漏洞和性能问题&#10;- 自动分析竞品网站并生成市场报告&#10;- 将面试经验转换为八股文知识点"
        ></textarea>
        <p class="mt-2 text-xs text-neutral-500">
          提示：描述越具体，生成的 Skill 越精准。支持中文和英文输入。
        </p>
      </div>

      <div class="px-6 pb-6">
        <button
          class="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-neutral-300 disabled:to-neutral-400 text-white font-medium py-4 px-6 rounded-xl shadow-medium hover:shadow-strong disabled:shadow-none transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed relative overflow-hidden"
          on:click={convert}
          disabled={!$apiKeyStore || !input || loading}
        >
          {#if loading && (!result || result.length === 0)}
            <div class="absolute inset-0 bg-amber-400/20 animate-pulse"></div>
          {/if}

          <span class="flex items-center justify-center space-x-2 relative z-10">
            {#if loading}
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>
                {#if result && result.length > 0}
                  正在生成 Skill 配置...
                {:else}
                  正在分析并构建 Skill...
                {/if}
              </span>
            {:else}
              <span>⚡</span>
              <span>转换为 Skill</span>
            {/if}
          </span>
        </button>

        {#if loading}
          <div class="mt-3 text-center">
            <div class="text-xs text-neutral-500">
              {#if result && result.length > 0}
                正在实时生成 Skill 配置，请查看下方结果
              {:else}
                正在连接 AI 服务并分析能力描述...
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>

    {#if parseError}
      <div class="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
        {parseError}
      </div>
    {/if}

    {#if parsedResult}
      <SkillOutput result={parsedResult} />
    {:else if loading && result}
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden">
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-neutral-100">
          <h3 class="text-lg font-semibold text-neutral-800 flex items-center">
            <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
            正在生成...
          </h3>
        </div>
        <div class="p-6">
          <pre class="text-sm text-neutral-600 whitespace-pre-wrap break-all max-h-[400px] overflow-y-auto">{result}</pre>
        </div>
      </div>
    {/if}
  </div>
</div>
