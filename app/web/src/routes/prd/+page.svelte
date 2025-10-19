<script lang="ts">
  import ResultView from "$lib/components/ResultView.svelte";
  import MultiSelect from "$lib/components/MultiSelect.svelte";
  import { apiKeyStore } from "$lib/stores/api";
  import { prdFormStore } from '$lib/stores/api';
  import {buildPRDPrompt as getPRDPrompt } from '@prompt-hub/prompt';
  import {  useAIStream } from '$lib/hooks/useAIStream';

  // 表单数据
  let formData = {
    productDescription: "",
    productType: [] as string[],
    customProductType: "",
    targetUser: [] as string[],
    customTargetUser: "",
    keyFeatures: [] as string[],
    customFeatures: "",
    productGoal: [] as string[],
    customProductGoal: "",
    techStack: [] as string[],
    customTechStack: "",
    businessModel: [] as string[],
    customBusinessModel: "",
    competitors: "",
  };
  $: formData = $prdFormStore;
  $: prdFormStore.set(formData);

  $: aiStream = useAIStream("prd");
  $: state = aiStream.state;
  $: ({ progress, status, result, error } = $state);
  $: statusTip = aiStream.statusTip;
  $: output = result || error || "";
  $: loading = status !== "done" && status !== "error" && status !== "idle";

  // 预设选项
  const productTypes = [
    "Web 应用",
    "移动应用（iOS/Android）",
    "桌面软件（Windows/Mac）",
    "小程序 / H5",
  ];

  const targetUsers = [
    "C 端个人用户",
    "B 端企业用户",
    "教育行业用户",
    "医疗行业用户",
    "金融行业用户",
  ];

  const keyFeatureOptions = [
    "用户注册登录",
    "数据存储与同步",
    "权限与角色管理",
    "支付/订阅",
    "消息通知",
    "数据分析与报表",
    "搜索功能",
    "实时通讯",
    "文件上传下载",
    "第三方集成",
  ];

  const productGoals = [
    "提高效率",
    "增加收入",
    "降低成本",
    "提升用户体验",
    "扩大市场份额",
  ];

  const techStackOptions = [
    "React",
    "Vue.js",
    "Angular",
    "Flutter",
    "React Native",
    "Swift",
    "Kotlin",
    "Java",
    "Python",
    "Node.js",
    "Go",
    "PHP",
  ];

  const businessModels = [
    "免费 + 广告",
    "订阅制",
    "一次性付费",
    "增值服务",
    "B2B 企业服务",
    "平台佣金",
  ];

  // 构建PRD提示词
  const buildPRDPrompt = (): string => {
    let prompt = getPRDPrompt();

    // 产品描述（最重要）
    if (formData.productDescription) {
      prompt += `## 产品描述与需求\n${formData.productDescription}\n\n`;
    }

    // 产品形态
    const productTypes = [...formData.productType];
    if (formData.customProductType) {
      productTypes.push(formData.customProductType);
    }
    if (productTypes.length > 0) {
      prompt += `## 产品形态\n${productTypes.join("、")}\n\n`;
    }

    // 目标用户
    const targetUsers = [...formData.targetUser];
    if (formData.customTargetUser) {
      targetUsers.push(formData.customTargetUser);
    }
    if (targetUsers.length > 0) {
      prompt += `## 目标用户\n${targetUsers.join("、")}\n\n`;
    }

    // 关键功能需求
    if (formData.keyFeatures.length > 0 || formData.customFeatures) {
      prompt += `## 关键功能需求\n`;
      formData.keyFeatures.forEach((feature) => {
        prompt += `- ${feature}\n`;
      });
      if (formData.customFeatures) {
        prompt += `- ${formData.customFeatures}\n`;
      }
      prompt += `\n`;
    }

    // 产品目标
    const productGoals = [...formData.productGoal];
    if (formData.customProductGoal) {
      productGoals.push(formData.customProductGoal);
    }
    if (productGoals.length > 0) {
      prompt += `## 产品目标\n${productGoals.join("、")}\n\n`;
    }

    // 技术栈
    const techStacks = [...formData.techStack];
    if (formData.customTechStack) {
      techStacks.push(formData.customTechStack);
    }
    if (techStacks.length > 0) {
      prompt += `## 技术栈偏好\n${techStacks.join("、")}\n\n`;
    }

    // 商业模式
    const businessModels = [...formData.businessModel];
    if (formData.customBusinessModel) {
      businessModels.push(formData.customBusinessModel);
    }
    if (businessModels.length > 0) {
      prompt += `## 商业模式\n${businessModels.join("、")}\n\n`;
    }

    // 竞品参考
    if (formData.competitors) {
      prompt += `## 竞品参考\n${formData.competitors}\n\n`;
    }

    prompt += `请基于以上信息生成完整的PRD文档。`;

    return prompt;
  };

  // 生成PRD
  const generatePRD = async () => {
    if (!$apiKeyStore) return;

    // 验证必填项
    if (
      !formData.productDescription.trim() ||
      formData.productType.length === 0 ||
      formData.targetUser.length === 0 ||
      formData.keyFeatures.length === 0
    ) {
      alert("请填写所有必填项：产品描述、产品形态、目标用户、关键功能需求");
      return;
    }

    const prompt = buildPRDPrompt();
    await aiStream.invoke(prompt);
  };

  // 重置表单
  const resetAll = () => {
    formData = {
      productDescription: "",
      productType: [],
      customProductType: "",
      targetUser: [],
      customTargetUser: "",
      keyFeatures: [],
      customFeatures: "",
      productGoal: [],
      customProductGoal: "",
      techStack: [],
      customTechStack: "",
      businessModel: [],
      customBusinessModel: "",
      competitors: "",
    };
    prdFormStore.set(formData);
    aiStream.reset();
  };
</script>

<svelte:head>
  <title>PRD 生成器 - Prompt Hub</title>
  <meta name="description" content="填写产品信息，自动生成专业的产品需求文档" />
</svelte:head>

<div class="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
  <!-- 页面头部 -->
  <div class="mb-8">
    <div class="flex items-center space-x-4 mb-6">
      <div
        class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-medium"
      >
        <span class="text-white text-xl">📋</span>
      </div>
      <div>
        <h1 class="text-3xl font-bold text-neutral-800">PRD 生成器</h1>
        <p class="text-neutral-600">填写产品信息，自动生成专业的产品需求文档</p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- 左侧：表单区域 -->
    <div class="space-y-6">
      <!-- 1. 产品描述（必填） -->
      <div
        class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20"
      >
        <h3
          class="text-lg font-semibold text-neutral-800 mb-4 flex items-center"
        >
          <span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          产品描述 <span class="text-red-500 ml-1">*</span>
        </h3>
        <div>
          <textarea
            bind:value={formData.productDescription}
            class="w-full h-32 p-4 border border-neutral-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            placeholder="描述您想要开发的产品或功能"
          ></textarea>
        </div>
      </div>

      <!-- 2. 产品形态（必填） -->
      <div
        class="bg-white/70 rounded-2xl p-6 shadow-soft border border-white/20"
      >
        <h3
          class="text-lg font-semibold text-neutral-800 mb-4 flex items-center"
        >
          <span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          产品形态 <span class="text-red-500 ml-1">*</span>
        </h3>
        <div>
          <MultiSelect
            bind:selected={formData.productType}
            options={productTypes}
            placeholder="请选择产品形态"
            customInput={true}
            customPlaceholder="添加其他产品形态..."
            on:addCustom={({ detail }) =>
              (formData.customProductType = detail.value)}
          />
        </div>
      </div>

      <!-- 3. 目标用户（必填） -->
      <div
        class="bg-white/70 rounded-2xl p-6 shadow-soft border border-white/20"
      >
        <h3
          class="text-lg font-semibold text-neutral-800 mb-4 flex items-center"
        >
          <span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          目标用户 <span class="text-red-500 ml-1">*</span>
        </h3>
        <div>
          <MultiSelect
            bind:selected={formData.targetUser}
            options={targetUsers}
            placeholder="请选择目标用户"
            customInput={true}
            customPlaceholder="添加其他目标用户..."
            on:addCustom={({ detail }) =>
              (formData.customTargetUser = detail.value)}
          />
        </div>
      </div>

      <!-- 4. 关键功能需求（必填） -->
      <div
        class="bg-white/70 rounded-2xl p-6 shadow-soft border border-white/20"
      >
        <h3
          class="text-lg font-semibold text-neutral-800 mb-4 flex items-center"
        >
          <span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          关键功能需求 <span class="text-red-500 ml-1">*</span>
        </h3>
        <div>
          <MultiSelect
            bind:selected={formData.keyFeatures}
            options={keyFeatureOptions}
            placeholder="请选择关键功能需求"
            customInput={true}
            customPlaceholder="添加其他功能需求..."
            on:addCustom={({ detail }) =>
              (formData.customFeatures = detail.value)}
            maxHeight="300px"
          />
        </div>
      </div>

      <!-- 5. 产品目标（可选） -->
      <div
        class="bg-white/70 rounded-2xl p-6 shadow-soft border border-white/20"
      >
        <h3
          class="text-lg font-semibold text-neutral-800 mb-4 flex items-center"
        >
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          产品目标
        </h3>
        <div>
          <MultiSelect
            bind:selected={formData.productGoal}
            options={productGoals}
            placeholder="请选择产品目标"
            customInput={true}
            customPlaceholder="添加其他产品目标..."
            on:addCustom={({ detail }) =>
              (formData.customProductGoal = detail.value)}
          />
        </div>
      </div>
    </div>

    <!-- 右侧：表单区域继续 -->
    <div class="space-y-6">
      <!-- 6. 技术栈（可选） -->
      <div
        class="bg-white/70 rounded-2xl p-6 shadow-soft border border-white/20"
      >
        <h3
          class="text-lg font-semibold text-neutral-800 mb-4 flex items-center"
        >
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          技术栈/开发语言
        </h3>
        <div>
          <MultiSelect
            bind:selected={formData.techStack}
            options={techStackOptions}
            placeholder="请选择技术栈/开发语言"
            customInput={true}
            customPlaceholder="添加其他技术要求..."
            on:addCustom={({ detail }) =>
              (formData.customTechStack = detail.value)}
            maxHeight="300px"
          />
        </div>
      </div>

      <!-- 7. 商业模式（可选） -->
      <div
        class="bg-white/70 rounded-2xl p-6 shadow-soft border border-white/20"
      >
        <h3
          class="text-lg font-semibold text-neutral-800 mb-4 flex items-center"
        >
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          商业模式
        </h3>
        <div>
          <MultiSelect
            bind:selected={formData.businessModel}
            options={businessModels}
            placeholder="请选择商业模式"
            customInput={true}
            customPlaceholder="添加其他商业模式..."
            on:addCustom={({ detail }) =>
              (formData.customBusinessModel = detail.value)}
          />
        </div>
      </div>

      <!-- 8. 竞品参考（可选） -->
      <div
        class="bg-white/70 rounded-2xl p-6 shadow-soft border border-white/20"
      >
        <h3
          class="text-lg font-semibold text-neutral-800 mb-4 flex items-center"
        >
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          竞品参考
        </h3>
        <div>
          <textarea
            bind:value={formData.competitors}
            class="w-full h-24 p-3 border border-neutral-300 rounded-md text-sm resize-none"
            placeholder="请输入竞品名称，多个竞品请换行输入，例如：&#10;微信&#10;支付宝&#10;Slack"
          ></textarea>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div
        class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20"
      >
        <div class="flex space-x-4">
          <button
            class="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-neutral-300 disabled:to-neutral-400 text-white font-medium py-4 px-6 rounded-xl shadow-medium hover:shadow-strong disabled:shadow-none transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed relative overflow-hidden"
            on:click={generatePRD}
            disabled={!$apiKeyStore || loading}
          >
            <!-- 进度条背景 -->
            {#if loading && progress > 0}
              <div
                class="absolute inset-0 bg-purple-400/30 transition-all duration-300 ease-out"
                style="width: {progress}%"
              ></div>
            {/if}

            <span
              class="flex items-center justify-center space-x-2 relative z-10"
            >
              {#if loading}
                <svg
                  class="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>{status || "正在处理..."} {progress}%</span>
              {:else}
                <span>📝</span>
                <span>生成PRD文档</span>
              {/if}
            </span>
          </button>

          <button
            on:click={resetAll}
            class="px-6 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-xl transition-colors duration-200"
          >
            重置
          </button>
        </div>

        <!-- 简化的进度信息 -->
        {#if loading && status}
          <div class="mt-3 text-center">
            <div class="text-xs text-neutral-500">
              {statusTip}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- 输出区域 -->
  <div class="mt-8">
    <ResultView text={output} />
  </div>
</div>
