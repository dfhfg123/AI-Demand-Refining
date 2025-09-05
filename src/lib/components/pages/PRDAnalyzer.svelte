<script lang="ts">
  import { buildPrompt, type RoleType } from '$lib/utils/prompt';
  import { sendAIRequest } from '$lib/services/aiService';
  import { save, load } from '$lib/utils/storage';
  import ResultView from '$lib/components/ResultView.svelte';
  
  export let apiKey: string;
  
  let input = '';
  let output = '';
  let selectedRole: RoleType = 'frontend';
  let loading = false;
  
  // 角色配置
  const roleOptions = [
    { 
      value: 'frontend' as RoleType, 
      label: '前端开发', 
      icon: '🎨',
      description: '生成前端开发所需的接口、UI交互和逻辑规则',
      placeholder: `你是否经常看到冗长的产品需求文档，其中包含大量你看不懂或者你根本不关心的逻辑？
作为一个前端开发者，你只想知道：
• 给了我几个接口？请求参数和返回数据是什么？
• 改动了哪些页面？有哪些交互逻辑？
• 什么时候显示/隐藏组件？按钮什么时候禁用？
• 有哪些权限控制和异常处理？

直接把PRD文档粘贴到这里，AI会帮你提炼出前端开发需要的所有信息！
再把输出的内容作为prompt给AI编辑器就可以直接帮你完成代码！`
    },
    { 
      value: 'backend' as RoleType, 
      label: '后端开发', 
      icon: '⚙️',
      description: '生成API设计、数据模型和业务逻辑实现',
      placeholder: `作为后端开发者，面对复杂的PRD文档，你最关心的是：
• 需要设计哪些API接口？参数和响应格式是什么？
• 数据库表结构如何设计？字段类型和关联关系？
• 核心业务逻辑是什么？算法和处理流程？
• 需要考虑哪些性能优化和异常处理？
• 权限控制和安全策略如何实现？

把PRD文档粘贴进来，AI会从后端视角帮你梳理出：
✓ 完整的API接口文档
✓ 数据模型设计方案
✓ 业务逻辑实现要点
✓ 技术架构建议`
    },
    { 
      value: 'tester' as RoleType, 
      label: '测试工程师', 
      icon: '🧪',
      description: '生成测试策略、测试用例和质量保障方案',
      placeholder: `作为测试工程师，你需要从PRD中挖掘出：
• 有哪些核心功能需要测试？测试范围是什么？
• 正常流程如何验证？异常场景如何覆盖？
• 接口测试要验证哪些参数和返回值？
• 用户体验测试的关键点在哪里？
• 兼容性测试需要考虑哪些环境？
• 性能测试的指标和边界条件？

粘贴PRD文档，AI会帮你生成：
✓ 完整的测试计划和策略
✓ 详细的功能测试用例
✓ 边界和异常场景测试
✓ 自动化测试建议
✓ 风险评估和质量标准`
    },
    { 
      value: 'ui' as RoleType, 
      label: 'UI设计师', 
      icon: '🎨',
      description: '生成页面设计、交互流程和视觉规范',
      placeholder: `作为UI设计师，你需要从PRD中理解：
• 有哪些页面需要设计？页面结构和布局如何？
• 用户操作流程是什么？页面间如何跳转？
• 交互反馈如何设计？状态变化如何呈现？
• 不同屏幕尺寸如何适配？响应式设计要点？
• 视觉风格和设计规范有什么要求？
• 无障碍设计需要考虑哪些因素？

粘贴PRD文档，AI会从设计视角帮你整理：
✓ 页面结构和布局设计要点
✓ 用户交互流程和状态设计
✓ 组件设计规范和使用场景
✓ 视觉风格和设计系统建议
✓ 响应式设计和适配策略`
    }
  ];
  
  // 获取当前角色的placeholder
  $: currentPlaceholder = roleOptions.find(role => role.value === selectedRole)?.placeholder || roleOptions[0].placeholder;
  $: currentRole = roleOptions.find(role => role.value === selectedRole) || roleOptions[0];
  
  const init = () => {
    const persisted = load();
    input = persisted?.input || '';
    output = persisted?.output || '';
    selectedRole = persisted?.role || 'frontend';
  };
  
  init();
  
  const handleSubmit = async () => {
    if (!apiKey?.trim() || !input?.trim()) return;
    
    loading = true;
    save({ apiKey, input, role: selectedRole });
    
    try {
      const prompt = buildPrompt(input, selectedRole);
      const response = await sendAIRequest(apiKey, prompt);
      
      if (response.success) {
        output = response.content;
        save({ output });
      } else {
        output = `生成失败：${response.error}`;
      }
    } catch (error) {
      output = `请求出错：${error instanceof Error ? error.message : '未知错误'}`;
    } finally {
      loading = false;
    }
  };
  
  const clearContent = () => {
    input = '';
    output = '';
  };
</script>

<div class="space-y-6">
  <!-- 角色选择 -->
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">选择角色视角</h3>
        <p class="text-sm text-gray-500 mt-1">不同角色将从不同维度分析需求文档</p>
      </div>
    </div>
    
    <div class="flex items-center gap-4">
      <div class="flex-1 max-w-xs">
        <select 
          bind:value={selectedRole}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        >
          {#each roleOptions as role}
            <option value={role.value}>{role.icon} {role.label}</option>
          {/each}
        </select>
      </div>
      <div class="flex-1">
        <p class="text-sm text-gray-600">{currentRole.description}</p>
      </div>
    </div>
  </div>
  
  <!-- 输入区域 -->
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">输入需求文档</h3>
      <button 
        class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
        on:click={clearContent}
      >
        清空
      </button>
    </div>
    <textarea
      bind:value={input}
      placeholder={currentPlaceholder}
      class="w-full h-80 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
    ></textarea>
  </div>
  
  <!-- 操作按钮 -->
  <div class="flex justify-center">
    <button
      class="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      disabled={!apiKey || !input || loading}
      on:click={handleSubmit}
    >
      {loading ? `正在以${currentRole.label}视角分析...` : `生成${currentRole.label}版本`}
    </button>
  </div>
  
  <!-- 结果展示 -->
  {#if output}
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">生成结果</h3>
      <ResultView text={output} />
    </div>
  {/if}
</div>