<script lang="ts">
  import { base } from "$app/paths";
  import ArrowRight from '~icons/i/ArrowRight';

  // 处理带有基路径的href
  function getFullHref(href: string): string {
    return `${base}${href}`;
  }

  const features = [
    {
      icon: "⚡",
      title: "Skill 转换器",
      description:
        "输入 Prompt 或能力描述，一键生成 Agent Skill 配置包，直接在 Cursor/Claude Code 中使用！",
      href: "/skill-converter",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: "✨",
      title: "提示词优化专家",
      description:
        "输入任何提示词，AI会根据4-D方法论为你优化，让AI更懂你的意图！",
      href: "/prompt-optimizer",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: "🔍",
      title: "PR Review 助手",
      description:
        "输入GitHub PR链接，AI自动分析代码变更，生成专业的审查意见和改进建议！",
      href: "/pr-review",
      color: "from-green-500 to-teal-600",
    },
    {
      icon: "📄",
      title: "简历优化助手",
      description:
        "上传PDF简历，AI三步优化：结构化解析→深度诊断→ATS友好重写，量化成果突出！",
      href: "/resume-optimizer",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: "📝",
      title: "需求提炼专家",
      description:
        "把冗杂的prd提炼出你需要的需求，告诉ai如何做，然后你去楼下喝咖啡吧！",
      href: "/summarizer",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: "🤔",
      title: "这b需求能不能做",
      description:
        "智能分析需求可行性，结合你的经验和摸鱼时间，给出靠谱的排期建议！",
      href: "/requirement-evaluation",
      color: "from-orange-500 to-red-600",
    },
    {
      icon: "🎤",
      title: "面试表现评估",
      description:
        "上传面试录音，帮你转为面经，并分析面试表现、改进建议、评估面试通过率！",
      href: "/interview-analysis",
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
      icon: "📋",
      title: "PRD 生成器",
      description:
        "基于简单描述，自动生成完整的产品需求文档，交给ai帮你实现吧！",
      href: "/prd",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: "🌐",
      title: "个人网站生成器",
      description:
        "输入自我介绍，AI 生成专业的多页面个人网站（含路由），实时查看代码和预览，一键部署！",
      href: "/personal-website",
      color: "from-cyan-500 to-blue-600",
    },
  ];
</script>

<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">


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
       <span
        class="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
      >
        Prompt Hub</span
      >
    </h1>
    <p class="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
      准备八股、面试复盘、工作提效、狠狠摸鱼！
      <br />
      <!-- 点击下方卡片或左侧导航栏试试吧！ -->
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
            <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    {/each}
  </div>
</div>
