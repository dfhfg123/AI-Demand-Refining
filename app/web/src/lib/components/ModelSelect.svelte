<script lang="ts">
  import { onMount } from "svelte";
  import { availableModels, selectedModelStore } from "$lib/stores/api";
  import ArrowDown from "~icons/i/ArrowDown";

  export let inline: boolean = false;

  // 确保组件挂载时有正确的默认值
  onMount(() => {
    if (!$selectedModelStore || $selectedModelStore === "") {
      selectedModelStore.set("moonshotai/Kimi-K2-Instruct");
    }
  });

  // 响应式检查，确保值的有效性
  $: if (
    $selectedModelStore &&
    !availableModels.some((model) => model.id === $selectedModelStore)
  ) {
    selectedModelStore.set("moonshotai/Kimi-K2-Instruct");
  }
</script>

<div
  class={inline
    ? "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
    : "space-y-2"}
>
  {#if !inline}
    <label
      for="model-select"
      class="block text-sm font-medium text-neutral-700"
    >
      选择模型
    </label>
  {/if}

  <div class="relative">
    <select
      id="model-select"
      bind:value={$selectedModelStore}
      class="w-full sm:w-48 px-2 py-1.5 text-sm border border-neutral-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none pr-6"
    >
      {#each availableModels as model}
        <option value={model.id}>{model.name}</option>
      {/each}
    </select>

    <!-- 下拉箭头 -->
    <div
      class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
    >
      <ArrowDown className="w-4 h-4 text-neutral-400" />
    </div>
  </div>

  {#if inline}
    <span
      class="text-sm font-medium text-neutral-600 whitespace-nowrap mt-1 sm:mt-0"
    >
      切换模型
    </span>
  {/if}
</div>
