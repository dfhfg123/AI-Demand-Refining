<script lang="ts">
  import ResultView from "$lib/components/ResultView.svelte";
  import { buildPrompt, type RoleType } from "$lib/utils/prompt";
  import { invokeSiliconFlow, getChoiceText } from "$lib/utils/api";
  import { load, save, clear } from "$lib/utils/storage";
  // 输入不再渲染 markdown

  type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

  let apiKey = "";
  let input = "";
  let output = "";
  let selectedRole: RoleType = "frontend";
  let loading = false;

  // 角色配置
  const roleOptions = [
    { 
      value: 'frontend' as RoleType, 
      label: '前端开发', 
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

  // 获取当前角色的placeholder - 使用响应式语句
  $: currentPlaceholder = roleOptions.find(role => role.value === selectedRole)?.placeholder || roleOptions[0].placeholder;

  const init = () => {
    const persisted = load();
    apiKey = persisted?.apiKey || "";
    input = persisted?.input || "";
    output = persisted?.output || "";
    selectedRole = persisted?.role || "frontend";
  };

  init();

  // const fillExample = async () => {
  //   const res = await fetch('/example.md');
  //   input = await res.text();
  //   save({ input });
  // };

  const summarize = async () => {
    if (!apiKey?.trim() || !input?.trim()) return;
    loading = true;
    save({ apiKey, input, role: selectedRole });
    const prompt = buildPrompt(input, selectedRole);
    const messages: ChatMessage[] = [{ role: "user", content: prompt }];
    try {
      const resp = await invokeSiliconFlow(apiKey, messages);
      output = getChoiceText(resp) || "";
      save({ output });
    } finally {
      loading = false;
    }
  };

  const resetAll = () => {
    input = "";
    output = "";
    clear();
  };
</script>

<div style="max-width:1080px;margin:0 auto;padding:16px;">
  <h2 style="margin:8px 0;">🤖 AI 多角色需求提炼助手</h2>
  <p style="color:#666;font-size:14px;margin:8px 0;">根据不同角色视角，从产品文档中提炼专业的开发指南</p>

  <!-- 角色选择器 -->
  <div style="margin:16px 0;">
    <h3 style="margin:8px 0 12px 0;font-size:16px;">选择角色视角</h3>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;margin-bottom:16px;">
      {#each roleOptions as role}
        <label 
          class="role-card" 
          class:selected={selectedRole === role.value}
          style="
            display:flex;
            flex-direction:column;
            padding:12px;
            border:2px solid {selectedRole === role.value ? '#3b82f6' : '#e5e7eb'};
            border-radius:8px;
            cursor:pointer;
            transition:all 0.2s ease;
            background:{selectedRole === role.value ? '#f0f9ff' : '#fff'};
          "
        >
          <input 
            type="radio" 
            bind:group={selectedRole} 
            value={role.value} 
            style="display:none;"
          />
          <div style="font-weight:600;margin-bottom:4px;color:{selectedRole === role.value ? '#1d4ed8' : '#374151'};">
            {role.label}
          </div>
          <div style="font-size:13px;color:#6b7280;line-height:1.4;">
            {role.description}
          </div>
        </label>
      {/each}
    </div>
  </div>

  <div
    style="display:flex;gap:8px;align-items:center;margin:8px 0;flex-wrap:wrap;"
  >
    <input
      placeholder="请填入SiliconFlow API Key"
      bind:value={apiKey}
      style="flex:1;min-width:260px;padding:8px;border-radius:8px;border:1px solid #e5e7eb;"
    />
    <!-- <button on:click={fillExample}>填充示例</button> -->
  </div>
  <div>获取API Key：
    <a href="https://cloud.siliconflow.cn/me/account/ak" target="_blank">点击获取</a>

  </div>

  <div>
    <div
      style="display:flex;align-items:center;justify-content:space-between;margin:8px 0;"
    >
      <strong>输入文档</strong>
      <span>
              <small>可直接粘贴PRD文档</small>
        <button on:click={resetAll}>清空</button></span
      >
    </div>
    <textarea
    bind:value={input}
    placeholder={currentPlaceholder}
    style="width:100%;height:300px;padding:12px;box-sizing:border-box;border:1px solid #e5e7eb;border-radius:8px;white-space: pre-line;"
  ></textarea>
  
  </div>

  <div style="margin:16px 0;display:flex;gap:8px;">
    <button
      on:click={summarize}
      disabled={!apiKey || !input || loading}
      style="padding:10px 14px;border-radius:8px;background:{!apiKey || !input || loading ? '#f3f4f6' : '#3b82f6'};color:{!apiKey || !input || loading ? '#9ca3af' : 'white'};border:none;cursor:{!apiKey || !input || loading ? 'not-allowed' : 'pointer'};"
      >{loading ? `正在以${roleOptions.find(r => r.value === selectedRole)?.label}视角分析...` : `生成${roleOptions.find(r => r.value === selectedRole)?.label}版本`}</button
    >
  </div>

  <ResultView text={output} />
</div>
