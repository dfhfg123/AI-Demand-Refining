<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { clickOutside } from '$lib/utils/clickOutside';

  // 组件属性
  export let options: string[] = []; // 选项列表
  export let selected: string[] = []; // 已选项
  export let placeholder = '请选择'; // 占位文本
  export let customInput = false; // 是否允许自定义输入
  export let customPlaceholder = '添加自定义选项...'; // 自定义输入占位文本
  export let multiple = true; // 是否多选
  export let size = 'default'; // 尺寸：small, default, large
  export let disabled = false; // 是否禁用
  export let maxHeight = '250px'; // 下拉菜单最大高度

  // 内部状态
  let isOpen = false; // 下拉菜单是否打开
  let customValue = ''; // 自定义输入值
  let inputElement: HTMLInputElement; // 输入框元素引用
  let searchValue = ''; // 搜索值
  let filteredOptions: string[] = []; // 过滤后的选项
  let highlightedIndex = -1; // 高亮选项索引

  // 事件分发器
  const dispatch = createEventDispatcher();

  // 响应式更新过滤选项
  $: {
    if (searchValue) {
      filteredOptions = options.filter(option => 
        option.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else {
      filteredOptions = [...options];
    }
  }

  // 点击选项
  function toggleOption(option: string) {
    if (disabled) return;
    
    if (multiple) {
      // 多选模式
      const index = selected.indexOf(option);
      if (index === -1) {
        selected = [...selected, option];
      } else {
        selected = selected.filter(item => item !== option);
      }
    } else {
      // 单选模式
      selected = [option];
      closeDropdown();
    }
    
    dispatch('change', { selected });
  }

  // 添加自定义选项
  function addCustomOption() {
    if (!customValue.trim()) return;
    
    // 检查是否已存在该选项
    if (!options.includes(customValue) && !selected.includes(customValue)) {
      if (multiple) {
        selected = [...selected, customValue];
      } else {
        selected = [customValue];
        closeDropdown();
      }
      dispatch('addCustom', { value: customValue, selected });
      dispatch('change', { selected });
    }
    
    customValue = '';
  }

  // 移除已选项
  function removeSelected(option: string) {
    if (disabled) return;
    selected = selected.filter(item => item !== option);
    dispatch('change', { selected });
  }

  // 切换下拉菜单
  function toggleDropdown() {
    if (disabled) return;
    isOpen = !isOpen;
    if (isOpen) {
      setTimeout(() => {
        if (inputElement) {
          inputElement.focus();
        }
      }, 0);
    }
  }

  // 关闭下拉菜单
  function closeDropdown() {
    isOpen = false;
    searchValue = '';
    highlightedIndex = -1;
  }

  // 处理键盘事件
  function handleKeydown(event: KeyboardEvent) {
    if (disabled) return;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          isOpen = true;
        } else {
          highlightedIndex = Math.min(highlightedIndex + 1, filteredOptions.length - 1);
        }
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, -1);
        break;
        
      case 'Enter':
        event.preventDefault();
        if (isOpen) {
          if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
            toggleOption(filteredOptions[highlightedIndex]);
          } else if (customInput && customValue.trim()) {
            addCustomOption();
          }
        } else {
          isOpen = true;
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        closeDropdown();
        break;
        
      case 'Tab':
        closeDropdown();
        break;
    }
  }

  // 计算样式类
  $: sizeClass = {
    'small': 'text-xs py-1 px-2',
    'default': 'text-sm py-2 px-3',
    'large': 'text-base py-3 px-4'
  }[size] || 'text-sm py-2 px-3';

  // 组件挂载后初始化
  onMount(() => {
    // 初始化过滤选项
    filteredOptions = [...options];
  });
</script>

<div 
  class="relative w-full" 
  use:clickOutside={() => closeDropdown()}
>
  <!-- 选择器触发区域 -->
  <div 
    class="flex flex-wrap items-center w-full border rounded-lg cursor-pointer transition-colors {sizeClass} {isOpen ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-neutral-300 hover:border-neutral-400'} {disabled ? 'bg-neutral-100 cursor-not-allowed opacity-70' : 'bg-white'}"
    on:click={toggleDropdown}
    role="combobox"
    aria-expanded={isOpen}
    aria-haspopup="listbox"
    tabindex="0"
  >
    <!-- 已选项标签 -->
    {#if selected.length > 0}
      <div class="flex flex-wrap gap-1 max-w-full">
        {#each selected as item}
          <div class="flex items-center bg-purple-100 text-purple-800 rounded px-2 py-0.5 text-xs max-w-full truncate">
            <span class="truncate">{item}</span>
            {#if !disabled}
              <button 
                type="button"
                class="ml-1 text-purple-600 hover:text-purple-800 focus:outline-none"
                on:click|stopPropagation={() => removeSelected(item)}
                aria-label={`移除 ${item}`}
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
    
    <!-- 占位文本 -->
    {#if selected.length === 0}
      <span class="text-neutral-400 truncate">{placeholder}</span>
    {/if}
    
    <!-- 下拉箭头 -->
    <div class="ml-auto pl-2">
      <svg class="w-4 h-4 text-neutral-400 transition-transform {isOpen ? 'transform rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
  
  <!-- 下拉菜单 -->
  {#if isOpen}
    <div 
      class="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden animate-fade-in"
      style="max-height: {maxHeight};"
    >
      <!-- 搜索框 -->
      <div class="p-2 border-b border-neutral-100">
        <input
          bind:this={inputElement}
          bind:value={searchValue}
          on:keydown={handleKeydown}
          class="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="搜索..."
          autocomplete="off"
        />
      </div>
      
      <!-- 选项列表 -->
      <div class="overflow-y-auto" style="max-height: calc({maxHeight} - 60px);">
        {#if filteredOptions.length > 0}
          <ul role="listbox" class="py-1">
            {#each filteredOptions as option, i}
              <li
                role="option"
                aria-selected={selected.includes(option)}
                class="px-3 py-2 cursor-pointer flex items-center text-sm hover:bg-purple-50 {highlightedIndex === i ? 'bg-purple-50' : ''} {selected.includes(option) ? 'bg-purple-100' : ''}"
                on:click|stopPropagation={() => toggleOption(option)}
              >
                <!-- 选中状态图标 -->
                <div class="w-5 h-5 mr-2 flex-shrink-0">
                  {#if selected.includes(option)}
                    <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  {/if}
                </div>
                <span class="truncate">{option}</span>
              </li>
            {/each}
          </ul>
        {:else}
          <div class="px-3 py-2 text-sm text-neutral-500 text-center">
            未找到匹配项
          </div>
        {/if}
        
        <!-- 自定义输入选项 -->
        {#if customInput}
          <div class="px-3 py-2 border-t border-neutral-100">
            <div class="flex items-center">
              <input
                bind:value={customValue}
                on:keydown={(e) => e.key === 'Enter' && addCustomOption()}
                class="flex-1 px-3 py-2 text-sm border border-neutral-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={customPlaceholder}
              />
              <button
                on:click|stopPropagation={addCustomOption}
                class="px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-r-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!customValue.trim()}
              >
                添加
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>