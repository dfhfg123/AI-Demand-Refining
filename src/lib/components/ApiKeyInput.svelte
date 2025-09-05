<script lang="ts">
  import { load, save } from '$lib/utils/storage';
  
  export let apiKey: string = '';
  
  // 初始化API Key
  const init = () => {
    const persisted = load();
    apiKey = persisted?.apiKey || '';
  };
  
  // 保存API Key
  const saveApiKey = () => {
    save({ apiKey });
  };
  
  // 组件挂载时初始化
  init();
  
  // 响应式保存API Key
  $: if (apiKey) saveApiKey();
</script>

<div class="flex items-center gap-4 flex-wrap">
  <div class="flex-1 min-w-64">
    <input
      bind:value={apiKey}
      placeholder="请填入 SiliconFlow API Key"
      type="password"
      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
    />
  </div>
  <div class="flex items-center gap-2 text-sm text-gray-600">
    <span>获取 API Key：</span>
    <a 
      href="https://cloud.siliconflow.cn/me/account/ak" 
      target="_blank" 
      class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
    >
      点击获取
    </a>
  </div>
</div>