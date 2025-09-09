<script lang="ts">
  import { page } from "$app/stores";
  import { base } from "$app/paths";
  import { derived } from "svelte/store";

  type Nav = { href: string; label: string; icon?: string };
  export let items: Nav[] = [];
  // 获取相对于基路径的当前路径
  const active = derived(page, ($p) => {
    const pathname = $p.url.pathname;
    // 移除基路径，获取相对路径
    return pathname.replace(base, '') || '/';
  });
  
  // 添加图标映射
  const iconMap: Record<string, string> = {
    "/": "🏠",
    "/summarizer": "📝",
    "/prd": "📋",
    "/interview": "💼",
    "/interview-analysis": "🎤"
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
      <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-medium">
        <span class="text-white font-bold text-lg">AI</span>
      </div>
      <div>
        <h1 class="text-xl font-bold text-neutral-800">Prompt Hub</h1>
        <p class="text-xs text-neutral-500">程序员的摸鱼助手</p>
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
  <div class="p-4 border-t border-neutral-100">
    <div class="text-xs text-neutral-400 text-center">
      <p>版本 v1.0.0</p>
      <p class="mt-1">由 AI 驱动的生产力工具</p>
    </div>
  </div>
</nav>

<style>
  /* 尽量少样式，主要交给 tailwind */
</style>


