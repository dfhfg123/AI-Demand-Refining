<script lang="ts">
  import ApiKeyPanel from "$lib/components/ApiKeyPanel.svelte";
  
  export let title: string;
  export let description: string;
  export let icon: string;
  export let iconColor: string = "from-blue-500 to-indigo-600";
</script>

<div class="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
  <!-- 页面头部 -->
  <div class="mb-6 sm:mb-8">
    <div class="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
      <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br {iconColor} rounded-xl flex items-center justify-center shadow-medium flex-shrink-0">
        <span class="text-white text-lg sm:text-xl">{icon}</span>
      </div>
      <div class="min-w-0">
        <h1 class="text-2xl sm:text-3xl font-bold text-neutral-800 truncate">{title}</h1>
        <p class="text-sm sm:text-base text-neutral-600 mt-1">{description}</p>
      </div>
    </div>
    
    <!-- API Key 配置区域 -->
    <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-soft border border-white/20">
      <h3 class="text-base sm:text-lg font-semibold text-neutral-800 mb-3 sm:mb-4 flex items-center">
        <span class="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
        API 配置
      </h3>
      <ApiKeyPanel inline={true} />
    </div>
  </div>

  <!-- 开发中提示 -->
  <div class="bg-white/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-soft border border-white/20 text-center">
    <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br {iconColor.replace('500', '100').replace('600', '100')} rounded-2xl flex items-center justify-center">
      <svg class="h-8 w-8 sm:h-10 sm:w-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
      </svg>
    </div>
    <h2 class="text-xl sm:text-2xl font-bold text-neutral-800 mb-3 sm:mb-4">功能开发中</h2>
    <p class="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto mb-4 sm:mb-6 leading-relaxed">
      此功能正在紧张开发中，将为您提供更智能、更便捷的AI助手体验。
      敬请期待！
    </p>
    <div class="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
      <a href="/summarizer" class="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium hover:shadow-medium transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base">
        体验其他功能
      </a>
      <a href="/" class="bg-white text-primary-600 border border-primary-200 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium hover:bg-primary-50 transition-all duration-200 text-sm sm:text-base">
        返回首页
      </a>
    </div>
  </div>
</div>