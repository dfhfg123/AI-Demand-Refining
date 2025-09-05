<script lang="ts">
  import { apiKeyStore } from "$lib/stores/api";
  export let inline: boolean = false;
</script>

<div class={inline ? "flex items-center gap-2" : "space-y-2"}>
  <div class="flex items-center gap-2">
    <input class="flex-1 min-w-60 px-3 py-2 rounded border outline-none focus:ring"
           placeholder="填入 SiliconFlow API Key"
           bind:value={$apiKeyStore} />
    <a class="text-sm text-blue-600 hover:underline" href="https://cloud.siliconflow.cn/me/account/ak" target="_blank">获取</a>
  </div>
</div>


