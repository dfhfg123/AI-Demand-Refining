<script lang="ts">
  import { apiKeyStore } from "$lib/stores/api";
  export let inline: boolean = false;
  
  let showKey = false;
  const toggleKeyVisibility = () => {
    showKey = !showKey;
  };
</script>

<div class={inline ? "flex flex-col sm:flex-row sm:items-center gap-3" : "space-y-3"}>
  <div class="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
    <!-- API Key 输入区域 -->
    <div class="relative flex-1 max-w-full sm:max-w-md">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-4 w-4 sm:h-5 sm:w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      </div>
      <input 
        type="password"
        class="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 bg-white/80 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-neutral-400 text-xs sm:text-sm font-mono"
        placeholder="填入 硅基流动 API Key"
        bind:value={$apiKeyStore}
        class:hidden={showKey}
      />
      <input 
        type="text"
        class="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 bg-white/80 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-neutral-400 text-xs sm:text-sm font-mono"
        placeholder="填入 硅基流动 API Key"
        bind:value={$apiKeyStore}
        class:hidden={!showKey}
      />
      <!-- 显示/隐藏按钮 -->
      <button 
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
        on:click={toggleKeyVisibility}
      >
        {#if showKey}
          <svg class="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L7.05 7.05M9.878 9.878a3 3 0 105.304-.018m0 0L17.025 7.05M20.95 7.05A9.969 9.969 0 0112 5c-4.478 0-8.268 2.943-9.543 7a10.025 10.025 0 002.147 2.971m6.967-6.967l2.829-2.829" />
          </svg>
        {:else}
          <svg class="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        {/if}
      </button>
    </div>
    
    <!-- 获取链接 -->
    <a 
      class="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white text-xs sm:text-sm font-medium rounded-xl shadow-medium hover:shadow-strong transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap flex-shrink-0"
      href="https://cloud.siliconflow.cn/me/account/ak" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <svg class="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      <span class="hidden sm:inline">免费获取 API Key</span>
      <span class="sm:hidden">获取</span>
    </a>
  </div>

</div>


