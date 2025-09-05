<script lang="ts">
  import { onMount } from 'svelte';
  import ApiKeyInput from '$lib/components/ApiKeyInput.svelte';
  
  export let activeTab: string = 'prd-analyzer';
  export let apiKey: string = '';
  
  // 定义所有功能页面
  const tabs = [
    { 
      id: 'prd-analyzer', 
      label: 'PRD/BRD 生成器', 
      icon: '📋',
      description: '智能提炼需求文档'
    },
    { 
      id: 'requirements-evaluator', 
      label: '排期评估器', 
      icon: '⏱️',
      description: '快速评估项目排期'
    },
    { 
      id: 'meeting-generator', 
      label: '会议纪要生成器', 
      icon: '📝',
      description: '转换会议记录为行动清单'
    },
    { 
      id: 'competitor-analyzer', 
      label: '竞品分析生成器', 
      icon: '📊',
      description: '生成专业竞品分析'
    },
    { 
      id: 'tech-guide', 
      label: '技术选型指南', 
      icon: '🔧',
      description: '智能技术栈推荐'
    },
    { 
      id: 'interview-helper', 
      label: '面经生成助手', 
      icon: '💼',
      description: '生成面试题目和答案'
    }
  ];
  
  // 移动端侧边栏控制
  let sidebarOpen = false;
  
  // 切换标签页
  const switchTab = (tabId: string) => {
    activeTab = tabId;
    // 移动端切换后关闭侧边栏
    if (window.innerWidth < 768) {
      sidebarOpen = false;
    }
  };
  
  // 获取当前活动标签的信息
  $: currentTab = tabs.find(tab => tab.id === activeTab) || tabs[0];
  
  onMount(() => {
    // 组件挂载时的初始化逻辑
  });
</script>

<div class="h-screen flex bg-gray-50">
  <!-- 移动端遮罩层 -->
  {#if sidebarOpen}
    <div class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" on:click={() => sidebarOpen = false}></div>
  {/if}
  
  <!-- 左侧导航栏 -->
  <aside class="{sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
    <!-- 头部 -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🤖</span>
        <div>
          <h1 class="text-lg font-bold text-gray-900">AI 智能工具集</h1>
          <p class="text-sm text-gray-500">提升工作效率</p>
        </div>
      </div>
    </div>
    
    <!-- 导航菜单 -->
    <nav class="p-4 space-y-2">
      {#each tabs as tab}
        <button
          class="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors {activeTab === tab.id ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500' : 'text-gray-700 hover:bg-gray-50'}"
          on:click={() => switchTab(tab.id)}
        >
          <span class="text-xl">{tab.icon}</span>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium truncate">{tab.label}</div>
            <div class="text-xs text-gray-500 truncate">{tab.description}</div>
          </div>
        </button>
      {/each}
    </nav>
  </aside>
  
  <!-- 主内容区域 -->
  <div class="flex-1 flex flex-col min-w-0">
    <!-- 顶部栏 -->
    <header class="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- 移动端菜单按钮 -->
          <button 
            class="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            on:click={() => sidebarOpen = !sidebarOpen}
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
          <!-- 当前页面标题 -->
          <div class="flex items-center gap-3">
            <span class="text-2xl">{currentTab.icon}</span>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">{currentTab.label}</h2>
              <p class="text-sm text-gray-500">{currentTab.description}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <!-- API Key 输入区域 -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <ApiKeyInput bind:apiKey />
    </div>
    
    <!-- 页面内容 -->
    <main class="flex-1 p-6 overflow-auto">
      <div class="max-w-6xl mx-auto">
        <slot {activeTab} {apiKey} />
      </div>
    </main>
  </div>
</div>