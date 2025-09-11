<script lang="ts">
  import { base } from "$app/paths";

  // 处理带有基路径的href
  function getFullHref(href: string): string {
    return `${base}${href}`;
  }

  const features = [
    {
      icon: "📝",
      title: "需求提炼专家",
      description:
        "把冗杂的prd提炼出你需要的需求，告诉ai如何做，然后你去楼下喝咖啡吧！",
      href: "/summarizer",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: "📋",
      title: "PRD 生成器",
      description:
        "基于简单描述，自动生成完整的产品需求文档，交给ai帮你实现吧！",
      href: "/prd",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: "💼",
      title: "面经转八股",
      description: "一键把面经转为面试官想听的答案，狠狠背八股！",
      href: "/interview",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: "🎤",
      title: "面试表现分析",
      description:
        "上传面试录音，AI为你提供专业的表现分析和改进建议，助你面试无忧！",
      href: "/interview-analysis",
      color: "from-purple-500 to-pink-600",
    },
  ];
</script>

<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
  <!-- QQ群信息 - 右上角 -->
  <div class="fixed top-4 right-4 z-50 hidden lg:block">
    <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-soft border border-white/20 text-center">
      <p class="text-sm font-medium text-neutral-800 ">
        Prompt Hub摸鱼交流群
      </p>
       <div class="font-mono text-blue-600 mb-1">365469688</div>
      <div class="bg-white p-4 rounded-xl shadow-sm border border-neutral-200 flex items-center justify-center">
        <img 
          src="{base}/qq.png" 
          alt="QQ群二维码" 
          class="w-32 h-32 object-contain"
        />
      </div>
    </div>
  </div>

  <!-- 欢迎区域 -->
  <div class="text-center mb-12">
    <div
      class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-strong mb-6"
    >
      <img
        src="{base}/logo.png"
        alt="Prompt Hub Logo"
        class="w-10 h-10 object-contain"
      />
    </div>
    <h1 class="text-4xl sm:text-5xl font-bold text-neutral-800 mb-4">
      欢迎使用 <span
        class="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
      >
        Prompt Hub</span
      >
    </h1>
    <p class="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
      集成了多个 AI 驱动的生产力工具，帮你节省时间狠狠摸鱼！。
      <br />
      选择左侧功能或下方卡片开始体验。
    </p>
  </div>

  <!-- 功能卡片网格 -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
    {#each features as feature, index}
      <div
        class="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border border-white/20"
      >
        <!-- 渐变背景 -->
        <div
          class="absolute inset-0 bg-gradient-to-br {feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300"
        ></div>

        <!-- 内容 -->
        <div class="relative z-10">
          <!-- 图标 -->
          <div
            class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br {feature.color} rounded-xl mb-4 shadow-medium group-hover:scale-110 transition-transform duration-300"
          >
            <span class="text-white text-xl">{feature.icon}</span>
          </div>

          <!-- 标题和描述 -->
          <h3
            class="text-lg font-semibold text-neutral-800 mb-2 group-hover:text-primary-700 transition-colors"
          >
            {feature.title}
          </h3>
          <p class="text-neutral-600 text-sm leading-relaxed mb-4">
            {feature.description}
          </p>

          <!-- 行动按钮 -->
          <a
            href={getFullHref(feature.href)}
            class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            立即使用
            <svg
              class="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    {/each}
  </div>
</div>
