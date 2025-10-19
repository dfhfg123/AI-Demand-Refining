<script lang="ts">
  import ResultView from "$lib/components/ResultView.svelte";
  import { apiKeyStore } from "$lib/stores/api";
  import { requirementEvaluationStore } from '$lib/stores/api';
  import { useAIStream } from '$lib/hooks/useAIStream';

  // 表单数据
  let formData = {
    requirement: "",
    experience: "1-3年",
    workHours: "8-9小时",
    slackTime: "1小时"
  };
  
  $: formData = $requirementEvaluationStore;
  $: requirementEvaluationStore.set(formData);

  $: aiStream = useAIStream("requirement-evaluation");
  $: state = aiStream.state;
  $: ({ progress, status, result, error } = $state);
  $: statusTip = aiStream.statusTip;
  $: output = result || error || "";
  $: loading = status !== "done" && status !== "error" && status !== "idle";

  // 选项配置
  const experienceOptions = [
    { value: "0-1年", label: "0-1年" },
    { value: "1-3年", label: "1-3年" },
    { value: "3-5年", label: "3-5年" },
    { value: "5-10年", label: "5-10年" },
    { value: "10年以上", label: "10年以上" }
  ];

  const workHoursOptions = [
    { value: "0-3小时", label: "0-3小时" },
    { value: "3-5小时", label: "3-5小时" },
    { value: "6-7小时", label: "6-7小时" },
    { value: "8-9小时", label: "8-9小时" },
    { value: "9小时以上", label: "9小时以上" }
  ];

  const slackTimeOptions = [
    { value: "不摸鱼（0小时）", label: "不摸鱼（0小时）" },
    { value: "1小时", label: "1小时" },
    { value: "2小时", label: "2小时" },
    { value: "3小时", label: "3小时" },
    { value: "4小时", label: "4小时" },
    { value: "5小时", label: "5小时" }
  ];

  // 生成评估报告
  const generateEvaluation = async () => {
    const apiKey = $apiKeyStore;
    if (!apiKey) {
      alert("请先配置API Key");
      return;
    }

    if (!formData.requirement.trim()) {
      alert("请输入需求描述");
      return;
    }

    const prompt = `你是一位资深技术负责人，熟悉全栈开发、架构设计、AI 应用和项目排期评估。

你的任务是：根据输入的需求描述和开发者背景，快速生成一份简明的需求评估报告。

开发者背景：
- 工作经验：${formData.experience}
- 每天工作时间：${formData.workHours}
- 摸鱼时间：每天${formData.slackTime}

需求描述：
${formData.requirement}

排期参考标准（基于8小时工作日，实际开发时间约6小时）：
- 简单页面/组件：0.5-1天
- 中等复杂功能：1-3天  
- 复杂业务逻辑：3-5天
- 完整模块/系统：1-3周
- 大型项目：1-2个月

评估报告必须按以下格式输出：

## ✅ 技术可行性
简单回答一句话，“这个需求能做”或“这个需求做不了”，必须输出这两句话不能输出其他话

## 📅 总体排期
**建议排期：X天**（

## 📋 详细安排
[按功能模块拆分的具体时间安排]

## 🛠 主要技术方案
[涉及到的框架、库、AI模型、第三方工具]

要求：
- 时间评估要理性务实，基于实际开发经验
- 考虑开发者经验水平调整难度系数
- 考虑摸鱼时间对实际产出的影响
- 输出结构化，分标题分点
- 简明扼要，避免冗余描述`;

    await aiStream.invoke(prompt);
  };
</script>

<div class="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
  <!-- 页面头部 -->
  <div class="mb-6 sm:mb-8">
    <div class="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
      <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-medium flex-shrink-0">
        <span class="text-white text-lg sm:text-xl">🤔</span>
      </div>
      <div class="min-w-0">
        <h1 class="text-2xl sm:text-3xl font-bold text-neutral-800 truncate">这b需求能不能做</h1>
        <p class="text-sm sm:text-base text-neutral-600 mt-1">智能分析需求可行性，给出合理排期建议</p>
      </div>
    </div>

  </div>

  <!-- 主内容区域 -->
  <div class="space-y-8">
    <!-- 输入区域 -->
    <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden">
      <!-- 头部 -->
      <div class="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-neutral-100">
        <h3 class="text-lg font-semibold text-neutral-800 flex items-center">
          <span class="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
          需求信息
        </h3>
      </div>

      <!-- 表单内容 -->
      <div class="p-6 space-y-6">
        <!-- 需求描述 -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            需求描述 <span class="text-red-500">*</span>
          </label>
          <textarea
            bind:value={formData.requirement}
            placeholder="请详细描述你的需求，包括功能要求、技术栈偏好、预期效果等..."
            class="w-full h-32 px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200 placeholder-neutral-400"
          ></textarea>
        </div>

        <!-- 开发者信息 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 工作经验 -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              工作经验
            </label>
            <select
              bind:value={formData.experience}
              class="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            >
              {#each experienceOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          </div>

          <!-- 每天工作时间 -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              每天工作时间
            </label>
            <select
              bind:value={formData.workHours}
              class="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            >
              {#each workHoursOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          </div>

          <!-- 摸鱼时间 -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              摸鱼时间
            </label>
            <select
              bind:value={formData.slackTime}
              class="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            >
              {#each slackTimeOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          </div>
        </div>

        <!-- 生成按钮 -->
        <div class="flex justify-center pt-4">
          <button
            on:click={generateEvaluation}
            disabled={loading}
            class="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-red-700 focus:ring-4 focus:ring-orange-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {#if loading}
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>分析中...</span>
            {:else}
              <span>🚀</span>
              <span>开始评估</span>
            {/if}
          </button>
        </div>
      </div>
    </div>

    <!-- 结果区域 -->
    {#if output}
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden">
        <!-- 头部 -->
        <div class="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-neutral-100">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-neutral-800 flex items-center">
              <span class="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
              📊 需求评估报告
            </h3>
            {#if loading}
              <div class="text-xs text-orange-600 bg-orange-100 px-3 py-1 rounded-full flex items-center space-x-2">
                <div class="w-3 h-3 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                <span>{$statusTip}</span>
              </div>
            {/if}
          </div>
        </div>
        
        <!-- 内容区域 -->
        <div class="p-6">
          <ResultView text={output} />
        </div>
      </div>
    {/if}
  </div>
</div>