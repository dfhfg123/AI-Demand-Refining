<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";
  import { derived } from "svelte/store";
  import Sidebar from "$lib/components/Sidebar.svelte";
  // 确保 tailwind 全局生效

  const title = derived(page, ($p) => {
    const seg = $p.url.pathname.split("/").filter(Boolean).at(0) || "home";
    return seg === "home" ? "AI 工具集" : `AI 工具集 | ${seg}`;
  });
  
  const active = derived(page, ($p) => $p.url.pathname);
</script>

<svelte:head>
  <title>{$title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
  <!-- 响应式布局容器 -->
  <div class="flex h-screen overflow-hidden">
    <!-- 侧边栏区域 - 桌面端显示 -->
    <div class="hidden md:flex md:flex-shrink-0">
      <div class="flex flex-col w-64">
        <Sidebar
          items={[
            { href: "/", label: "首页" },
            { href: "/summarizer", label: "需求提炼专家" },
            { href: "/prd", label: "PRD生成器" },
            { href: "/meeting", label: "会议纪要行动清单" },
            { href: "/competitive", label: "竞品分析报告" },
            { href: "/tech-guide", label: "技术选型指南" },
            { href: "/interview", label: "面经助手" }
          ]} />
      </div>
    </div>
    
    <!-- 主内容区域 -->
    <div class="flex-1 overflow-hidden">
      <main class="h-full overflow-y-auto pb-16 md:pb-0">
        <div class="p-4 lg:p-6 xl:p-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
  
  <!-- 移动端底部导航 -->
  <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-2 py-2 z-50">
    <div class="flex justify-around items-center max-w-sm mx-auto">
      <a href="/" class="flex flex-col items-center p-2 text-xs text-center min-w-0"
         class:text-primary-600={$active === '/'}
         class:text-neutral-500={$active !== '/'}>
        <div class="w-6 h-6 mb-1 bg-current rounded opacity-20"></div>
        <span class="truncate">首页</span>
      </a>
      <a href="/summarizer" class="flex flex-col items-center p-2 text-xs text-center min-w-0"
         class:text-primary-600={$active.startsWith('/summarizer')}
         class:text-neutral-500={!$active.startsWith('/summarizer')}>
        <div class="w-6 h-6 mb-1 bg-current rounded opacity-20"></div>
        <span class="truncate">提炼</span>
      </a>
      <a href="/prd" class="flex flex-col items-center p-2 text-xs text-center min-w-0"
         class:text-primary-600={$active.startsWith('/prd')}
         class:text-neutral-500={!$active.startsWith('/prd')}>
        <div class="w-6 h-6 mb-1 bg-current rounded opacity-20"></div>
        <span class="truncate">PRD</span>
      </a>
      <a href="/meeting" class="flex flex-col items-center p-2 text-xs text-center min-w-0"
         class:text-primary-600={$active.startsWith('/meeting')}
         class:text-neutral-500={!$active.startsWith('/meeting')}>
        <div class="w-6 h-6 mb-1 bg-current rounded opacity-20"></div>
        <span class="truncate">会议</span>
      </a>
      <a href="/competitive" class="flex flex-col items-center p-2 text-xs text-center min-w-0"
         class:text-primary-600={$active.startsWith('/competitive')}
         class:text-neutral-500={!$active.startsWith('/competitive')}>
        <div class="w-6 h-6 mb-1 bg-current rounded opacity-20"></div>
        <span class="truncate">竞品</span>
      </a>
    </div>
  </div>
</div>

<style>
  :global(html, body) { margin:0; padding:0; }
</style>
