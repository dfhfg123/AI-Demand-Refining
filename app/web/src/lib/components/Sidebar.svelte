<script lang="ts">
  import { page } from "$app/stores";
  import { base } from "$app/paths";
  import { derived } from "svelte/store";
  import SettingsModal from "$lib/components/SettingsModal.svelte";

  type Nav = { href: string; label: string; icon?: string };
  export let items: Nav[] = [];
  
  let isSettingsOpen = false;
  // 获取相对于基路径的当前路径
  const active = derived(page, ($p) => {
    const pathname = $p.url.pathname;
    // 移除基路径，获取相对路径
    return pathname.replace(base, '') || '/';
  });
  
  // 添加图标映射
  const iconMap: Record<string, string> = {
    "/": "🏠",
    "/prompt-optimizer": "✨",
    "/pr-review": "🔍",
    "/resume-optimizer": "📄",
    "/requirement-evaluation": "🤔",
    "/summarizer": "📝",
    "/prd": "📋",
    "/interview": "💼",
    "/interview-analysis": "🎤",
    "/personal-website": "🌐"
  };
  
  // 处理带有基路径的href
  function getFullHref(href: string): string {
    return `${base}${href}`;
  }
</script>

<nav class="h-full w-64 bg-white/80 backdrop-blur-lg border-r border-white/20 shadow-soft flex flex-col">
  <!-- 标题区域 -->
  <div class="p-6 border-b border-neutral-100">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center shadow-medium">
        <img 
          src="{base}/logo.png" 
          alt="Prompt Hub Logo" 
          class="w-10 h-10 object-contain rounded-xl"
        />
      </div>
      <div>
        <h1 class="text-xl font-bold text-neutral-800">Prompt Hub</h1>
        <p class="text-xs text-neutral-500">准备面试、工作提效</p>
      </div>
    </div>
  </div>
  
  <!-- 导航菜单 -->
  <div class="flex-1 p-4 space-y-2">
    {#each items as item}
      {@const isActive = $active === item.href || ($active !== '/' && item.href !== '/' && item.href !== '/interview' && $active.startsWith(item.href)) || (item.href === '/interview' && $active === '/interview')}
      <a 
        href={getFullHref(item.href)}
        class="group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-primary-50 hover:shadow-soft"
        class:bg-gradient-to-r={isActive}
        class:from-primary-500={isActive}
        class:to-primary-600={isActive}
        class:text-white={isActive}
        class:shadow-medium={isActive}
        class:text-neutral-700={!isActive}
      >
        <!-- 图标 -->
        <span class="text-xl transition-transform duration-200 group-hover:scale-110">
          {iconMap[item.href] || "📄"}
        </span>
        
        <!-- 文字 -->
        <span class="font-medium text-sm leading-5 truncate flex-1">
          {item.label}
        </span>
        
        <!-- 活跃指示器 -->
        {#if isActive}
          <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        {/if}
        
        <!-- hover 效果 -->
        <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/10 group-hover:to-primary-600/5 transition-all duration-200"></div>
      </a>
    {/each}
  </div>
  
  <!-- 底部信息 -->
  <div class="p-4 border-t border-neutral-100 space-y-3">
    <!-- 配置按钮 -->
    <button
      on:click={() => isSettingsOpen = true}
      class="w-full px-4 py-3 bg-gradient-to-r from-neutral-100 to-neutral-50 hover:from-primary-50 hover:to-primary-100 border border-neutral-200 hover:border-primary-300 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
    >
      <svg class="w-5 h-5 text-neutral-600 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span class="text-sm font-medium text-neutral-700 group-hover:text-primary-600 transition-colors">高级设置</span>
    </button>
    
    <div class="text-xs text-neutral-400 text-center">
      <p>版本 v1.0.0</p>
      <p class="mt-1">由 AI 驱动的生产力工具</p>
    </div>
  </div>
</nav>

<!-- 设置模态框 -->
<SettingsModal bind:isOpen={isSettingsOpen} />

<style>
  /* 尽量少样式，主要交给 tailwind */
</style>


