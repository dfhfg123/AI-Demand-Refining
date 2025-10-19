<script lang="ts">
  import { apiKeyStore, selectedModelStore, availableModels, DEFAULT_API_KEY, DEFAULT_MODEL, isUsingDefaultConfig } from "$lib/stores/api";
  import { clickOutside } from "$lib/utils/clickOutside";
  import Close from "~icons/i/Close";

  export let isOpen = false;

  let localApiKey = $apiKeyStore;
  let localSelectedModel = $selectedModelStore;
  let showKey = false;

  // 当模态框打开时，同步本地状态
  $: if (isOpen) {
    // 如果是默认 API Key，显示为空（不暴露默认 key）
    if ($apiKeyStore === DEFAULT_API_KEY) {
      localApiKey = '';
    } else {
      localApiKey = $apiKeyStore;
    }
    localSelectedModel = $selectedModelStore;
  }
  
  // 判断是否输入了自定义 API Key（输入框不为空）
  $: hasCustomApiKey = localApiKey.trim().length > 0;
  
  // 如果使用默认配置，强制使用默认模型
  $: if (!hasCustomApiKey) {
    localSelectedModel = DEFAULT_MODEL;
  }

  function toggleKeyVisibility() {
    showKey = !showKey;
  }

  function handleSave() {
    // 如果用户没有输入自定义 key，使用默认的
    if (!localApiKey.trim()) {
      apiKeyStore.set(DEFAULT_API_KEY);
      selectedModelStore.set(DEFAULT_MODEL);
    } else {
      apiKeyStore.set(localApiKey);
      selectedModelStore.set(localSelectedModel);
    }
    isOpen = false;
  }

  function handleCancel() {
    if ($apiKeyStore === DEFAULT_API_KEY) {
      localApiKey = '';
    } else {
      localApiKey = $apiKeyStore;
    }
    localSelectedModel = $selectedModelStore;
    isOpen = false;
  }

  function handleResetToDefault() {
    localApiKey = '';
    localSelectedModel = DEFAULT_MODEL;
  }
</script>

{#if isOpen}
  <!-- 背景遮罩 -->
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] flex items-center justify-center p-4">
    <!-- 模态框 -->
    <div
      use:clickOutside={handleCancel}
      class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
    >
      <!-- 头部 -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-neutral-800">高级设置</h2>
            <p class="text-sm text-neutral-500">配置自定义 API Key 和模型</p>
          </div>
        </div>
        <button
          on:click={handleCancel}
          class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <Close className="w-5 h-5 text-neutral-500" />
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <!-- API Key 配置 -->
        <div class="space-y-3">
          <label for="api-key-input" class="block text-sm font-semibold text-neutral-700">
            API Key
          </label>
          
          <!-- API Key 输入框 -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <input
              id="api-key-input"
              type="password"
              bind:value={localApiKey}
              class="w-full pl-10 pr-12 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-neutral-400 text-sm font-mono"
              class:hidden={showKey}
              placeholder="留空使用系统默认配置，或填入自己的 API Key"
            />
            <input
              id="api-key-input-text"
              type="text"
              bind:value={localApiKey}
              class="w-full pl-10 pr-12 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-neutral-400 text-sm font-mono"
              class:hidden={!showKey}
              placeholder="留空使用系统默认配置，或填入自己的 API Key"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
              on:click={toggleKeyVisibility}
            >
              {#if showKey}
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L7.05 7.05M9.878 9.878a3 3 0 105.304-.018m0 0L17.025 7.05M20.95 7.05A9.969 9.969 0 0112 5c-4.478 0-8.268 2.943-9.543 7a10.025 10.025 0 002.147 2.971m6.967-6.967l2.829-2.829" />
                </svg>
              {:else}
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              {/if}
            </button>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-xs text-neutral-500">
              {#if !hasCustomApiKey}
                <span class="inline-flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  使用系统默认配置
                </span>
              {:else}
                <span class="inline-flex items-center text-blue-600">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  使用自定义配置
                </span>
              {/if}
            </p>
            <a
              class="text-xs text-primary-600 hover:text-primary-700 font-medium"
              href="https://cloud.siliconflow.cn/me/account/ak"
              target="_blank"
              rel="noopener noreferrer"
            >
              获取 API Key →
            </a>
          </div>
        </div>

        <!-- 模型选择 -->
        <div class="space-y-3">
          <label for="model-select" class="block text-sm font-semibold text-neutral-700">
            选择模型
          </label>
          <select
            id="model-select"
            bind:value={localSelectedModel}
            disabled={!hasCustomApiKey}
            class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#each availableModels as model}
              <option value={model.id}>{model.name}</option>
            {/each}
          </select>
          <p class="text-xs text-neutral-500">
            {#if !hasCustomApiKey}
              <span class="text-orange-600">
                ⚠️ 使用默认配置时，固定使用 {DEFAULT_MODEL} 模型
              </span>
            {:else}
              可选择不同的模型
            {/if}
          </p>
        </div>

        <!-- 说明信息 -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div class="flex">
            <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-blue-900">关于配置</h4>
              <div class="text-xs text-blue-700 mt-1 space-y-1">
                <p>• <strong>留空</strong>：使用系统默认配置和 GLM-Z1-9B-0414 模型</p>
                <p>• <strong>填入自己的 API Key</strong>：使用自己的额度，可切换其他模型</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
        <button
          on:click={handleResetToDefault}
          class="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          恢复默认
        </button>
        <div class="flex space-x-3">
          <button
            on:click={handleCancel}
            class="px-6 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            on:click={handleSave}
            class="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-medium rounded-lg shadow-medium transition-all duration-200"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

