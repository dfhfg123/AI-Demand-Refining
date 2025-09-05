<script lang="ts">
  import MarkdownView from './MarkdownView.svelte';
  import { fade } from 'svelte/transition';
  
  export let text: string = '';
  
  let copySuccess = false;
  
  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(text || '');
      copySuccess = true;
      setTimeout(() => {
        copySuccess = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
</script>

<div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden">
  <!-- 头部 -->
  <div class="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-neutral-100">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-neutral-800 flex items-center">
        <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
        输出结果
      </h3>
      
      <!-- 操作按钮 -->
      <div class="flex items-center space-x-2">
        {#if text}
          <div class="text-xs text-neutral-500 bg-white/50 px-3 py-1 rounded-full">
            {text.length} 字符
          </div>
        {/if}
        
        <button 
          on:click={copy} 
          disabled={!text}
          class="group relative inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white text-sm font-medium rounded-lg shadow-medium hover:shadow-strong disabled:shadow-none transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed"
        >
          {#if copySuccess}
            <svg class="h-4 w-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" in:fade={{ duration: 200 }}>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>已复制</span>
          {:else}
            <svg class="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>复制</span>
          {/if}
        </button>
      </div>
    </div>
  </div>
  
  <!-- 内容区域 -->
  <div class="relative">
    {#if text}
      <div class="p-6 h-96 overflow-y-auto bg-gradient-to-b from-neutral-50/50 to-white/50">
        <MarkdownView source={text} />
      </div>
    {:else}
      <!-- 空状态 -->
      <div class="p-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl flex items-center justify-center">
          <svg class="h-8 w-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h4 class="text-lg font-medium text-neutral-600 mb-2">等待生成结果</h4>
        <p class="text-sm text-neutral-500 max-w-sm mx-auto">
          请在左侧输入框中粘贴您的文档内容，然后点击“生成总结”按钮开始处理。
        </p>
      </div>
    {/if}
    
    <!-- 加载状态遮罩（如果需要） -->
    <!-- 可以在未来添加加载状态 -->
  </div>
</div>

