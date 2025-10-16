<script lang="ts">
  import { onMount, tick } from "svelte";
  import { availableModels, selectedModelStore } from "$lib/stores/api";
  import { clickOutside } from "$lib/utils/clickOutside";
  import ArrowDown from "~icons/i/ArrowDown";
  import Check from "~icons/i/Check";

  export let inline: boolean = false;

  let isOpen = false;
  let searchValue = "";
  let filteredModels = [...availableModels];
  let highlightedIndex = -1;
  let inputElement: HTMLInputElement;
  let buttonElement: HTMLButtonElement;
  let dropdownElement: HTMLDivElement;
  let portalTarget: HTMLDivElement;

  // 确保组件挂载时有正确的默认值
  onMount(() => {
    if (!$selectedModelStore || $selectedModelStore === "") {
      selectedModelStore.set("moonshotai/Kimi-K2-Instruct");
    }

    // 创建 portal 容器
    portalTarget = document.createElement('div');
    portalTarget.style.position = 'fixed';
    portalTarget.style.zIndex = '99999';
    portalTarget.style.top = '0';
    portalTarget.style.left = '0';
    document.body.appendChild(portalTarget);

    return () => {
      // 清理 portal 容器
      if (portalTarget && portalTarget.parentNode) {
        portalTarget.parentNode.removeChild(portalTarget);
      }
    };
  });

  // 响应式检查，确保值的有效性
  $: if (
    $selectedModelStore &&
    !availableModels.some((model) => model.id === $selectedModelStore)
  ) {
    selectedModelStore.set("moonshotai/Kimi-K2-Instruct");
  }

  // 响应式更新过滤模型
  $: {
    if (searchValue) {
      filteredModels = availableModels.filter((model) =>
        model.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else {
      filteredModels = [...availableModels];
    }
  }

  // 获取当前选中的模型名称
  $: selectedModelName =
    availableModels.find((m) => m.id === $selectedModelStore)?.name ||
    "选择模型";

  // 更新下拉菜单位置
  function updateDropdownPosition() {
    if (buttonElement && dropdownElement) {
      const rect = buttonElement.getBoundingClientRect();
      dropdownElement.style.top = `${rect.bottom + 4}px`;
      dropdownElement.style.left = `${rect.left}px`;
      dropdownElement.style.width = `${Math.max(rect.width, 320)}px`;
    }
  }

  // 切换下拉菜单
  async function toggleDropdown() {
    isOpen = !isOpen;
    if (isOpen) {
      await tick();
      updateDropdownPosition();
      setTimeout(() => {
        if (inputElement) {
          inputElement.focus();
        }
      }, 0);
      
      // 监听滚动和窗口大小变化，更新位置
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
    } else {
      searchValue = "";
      highlightedIndex = -1;
      window.removeEventListener('scroll', updateDropdownPosition, true);
      window.removeEventListener('resize', updateDropdownPosition);
    }
  }

  // 关闭下拉菜单
  function closeDropdown() {
    isOpen = false;
    searchValue = "";
    highlightedIndex = -1;
    window.removeEventListener('scroll', updateDropdownPosition, true);
    window.removeEventListener('resize', updateDropdownPosition);
  }

  // 选择模型
  function selectModel(modelId: string) {
    selectedModelStore.set(modelId);
    closeDropdown();
  }

  // 处理键盘事件
  function handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          isOpen = true;
        } else {
          highlightedIndex = Math.min(
            highlightedIndex + 1,
            filteredModels.length - 1
          );
        }
        break;

      case "ArrowUp":
        event.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, 0);
        break;

      case "Enter":
        event.preventDefault();
        if (isOpen) {
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredModels.length
          ) {
            selectModel(filteredModels[highlightedIndex].id);
          }
        } else {
          isOpen = true;
        }
        break;

      case "Escape":
        event.preventDefault();
        closeDropdown();
        break;

      case "Tab":
        closeDropdown();
        break;
    }
  }

  // Portal action - 将元素移动到 portal 容器中
  function portal(node: HTMLElement) {
    if (portalTarget) {
      portalTarget.appendChild(node);
      dropdownElement = node as HTMLDivElement;
      updateDropdownPosition();
    }
    
    return {
      destroy() {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }
    };
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

  <div class="relative z-[100]">
    <!-- 选择器触发按钮 -->
    <button
      bind:this={buttonElement}
      type="button"
      id="model-select"
      on:click={toggleDropdown}
      class="w-full sm:w-64 px-3 py-2 text-sm border rounded-lg bg-white transition-all flex items-center justify-between {isOpen
        ? 'border-purple-500 ring-2 ring-purple-500/20'
        : 'border-neutral-300 hover:border-neutral-400'}"
    >
      <span class="truncate text-left flex-1">{selectedModelName}</span>
      <ArrowDown
        className="w-4 h-4 text-neutral-400 ml-2 flex-shrink-0 transition-transform {isOpen
          ? 'transform rotate-180'
          : ''}"
      />
    </button>
  </div>

  {#if inline}
    <span
      class="text-sm font-medium text-neutral-600 whitespace-nowrap mt-1 sm:mt-0"
    >
      切换模型
    </span>
  {/if}
</div>

<!-- 下拉菜单 - 通过 Portal 渲染到 body -->
{#if isOpen}
  <div
    use:portal
    use:clickOutside={() => closeDropdown()}
    class="bg-white border border-neutral-200 rounded-lg shadow-xl overflow-hidden"
    style="box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); position: fixed;"
  >
        <!-- 搜索框 -->
        <div class="p-2 border-b border-neutral-100">
          <input
            bind:this={inputElement}
            bind:value={searchValue}
            on:keydown={handleKeydown}
            class="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="搜索模型..."
            autocomplete="off"
          />
        </div>

        <!-- 选项列表 -->
        <div class="overflow-y-auto max-h-60">
          {#if filteredModels.length > 0}
            <ul role="listbox" class="py-1">
              {#each filteredModels as model, i}
                <li
                  role="option"
                  aria-selected={$selectedModelStore === model.id}
                  class="px-3 py-2.5 cursor-pointer flex items-center text-sm transition-colors {highlightedIndex ===
                  i
                    ? 'bg-purple-50'
                    : ''} {$selectedModelStore === model.id
                    ? 'bg-purple-50 text-purple-700'
                    : 'hover:bg-neutral-50'}"
                  on:click|stopPropagation={() => selectModel(model.id)}
                  on:mouseenter={() => (highlightedIndex = i)}
                >
                  <!-- 选中状态图标 -->
                  <div class="w-5 h-5 mr-2 flex-shrink-0">
                    {#if $selectedModelStore === model.id}
                      <Check className="w-5 h-5 text-purple-600" />
                    {/if}
                  </div>
                  <span class="truncate">{model.name}</span>
                </li>
              {/each}
            </ul>
          {:else}
            <div class="px-3 py-8 text-sm text-neutral-500 text-center">
              未找到匹配的模型
            </div>
          {/if}
        </div>
      </div>
{/if}
