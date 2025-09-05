<script lang="ts">
  
  const features = [
    {
      icon: "📝",
      title: "需求提炼专家",
      description: "自动提取PRD文档中的核心信息，生成精准的开发需求",
      href: "/summarizer",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: "📋",
      title: "PRD 生成器",
      description: "基于简单描述，自动生成完整的产品需求文档",
      href: "/prd",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: "📅",
      title: "会议纪要助手",
      description: "将会议内容转化为结构化的行动清单和跟进事项",
      href: "/meeting",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: "📊",
      title: "竞品分析报告",
      description: "全面分析竞品情况，生成专业的对比分析报告",
      href: "/competitive",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: "⚙️",
      title: "技术选型指南",
      description: "基于项目需求，推荐最适合的技术方案和架构设计",
      href: "/tech-guide",
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: "💼",
      title: "面经助手",
      description: "帮助准备技术面试，生成有针对性的面试题目和答案",
      href: "/interview",
      color: "from-indigo-500 to-purple-600"
    }
  ];
</script>

<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
  <!-- 欢迎区域 -->
  <div class="text-center mb-12">
    <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-strong mb-6">
      <span class="text-white text-2xl font-bold">AI</span>
    </div>
    <h1 class="text-4xl sm:text-5xl font-bold text-neutral-800 mb-4">
      欢迎使用 <span class="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">AI 工具集</span>
    </h1>
    <p class="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
      集成了多个 AI 驱动的生产力工具，帮助您高效处理文档、分析需求、生成报告。
      <br>
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
        <div class="absolute inset-0 bg-gradient-to-br {feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300"></div>
        
        <!-- 内容 -->
        <div class="relative z-10">
          <!-- 图标 -->
          <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br {feature.color} rounded-xl mb-4 shadow-medium group-hover:scale-110 transition-transform duration-300">
            <span class="text-white text-xl">{feature.icon}</span>
          </div>
          
          <!-- 标题和描述 -->
          <h3 class="text-lg font-semibold text-neutral-800 mb-2 group-hover:text-primary-700 transition-colors">
            {feature.title}
          </h3>
          <p class="text-neutral-600 text-sm leading-relaxed mb-4">
            {feature.description}
          </p>
          
          <!-- 行动按钮 -->
          <a 
            href={feature.href}
            class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            立即使用
            <svg class="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    {/each}
  </div>

  <!-- 底部信息 -->
  <div class="mt-16 text-center">
    <div class="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-soft border border-white/20">
      <h2 class="text-2xl font-bold text-neutral-800 mb-4">开始使用</h2>
      <p class="text-neutral-600 mb-6 max-w-2xl mx-auto">
        首次使用需要配置 API Key，请先选择任意功能页面进行配置。
        所有数据都在本地存储，无需担心隐私问题。
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <a href="/summarizer" class="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-medium transition-all duration-200 hover:-translate-y-0.5">
          开始体验
        </a>
        <a href="https://cloud.siliconflow.cn/me/account/ak" target="_blank" rel="noopener" class="bg-white text-primary-600 border border-primary-200 px-6 py-3 rounded-xl font-medium hover:bg-primary-50 transition-all duration-200">
          获取 API Key
        </a>
      </div>
    </div>
  </div>
</div>
