export type RoleType = 'frontend' | 'backend' | 'tester' | 'ui';

// 前端角色提示词
const buildFrontendPrompt = (doc: string): string => {
  return [
    '你是一个高级前端需求提炼专家。',
    '目标：从冗长的产品文档中，输出可直接给前端工程师/AI Coding 使用的精炼 Prompt。',
    '必须遵守：',
    '- 输出仅包含前端需要的内容：',
    '  - 接口清单：方法、路径、请求参数、返回体、错误码；',
    '  - UI/交互：页面、入口、按钮、弹窗、跳转、权限、禁用条件；',
    '  - 逻辑规则：显隐、启用、确认弹窗文案、计数器更新、联动校验；',
    '- 不要包含后端数据表设计、ORM、与前端无关实现细节。',
    '',
    '侧重：接口与UI都要完整覆盖，二者同等重要。',
    '',
    '输出格式要求：',
    '1) 接口：表格或条列，含路径、方法、请求字段、响应字段、示例；',
    '2) 页面与交互：逐页列出入口、组件、按钮、可见性与触发条件；',
    '3) 权限与状态：出现/禁用/隐藏条件；',
    '4) 边界与错误：返回为空、权限不足、配置缺失的提示与分支；',
    '5) 根据功能给出代表性用例（输入与预期输出简述）。',
    '',
    '以下是原始文档：',
    doc
  ].join('\n');
};

// 后端角色提示词
const buildBackendPrompt = (doc: string): string => {
  return [
    '你是一个高级后端需求提炼专家。',
    '目标：从产品文档中，输出可直接给后端工程师/AI Coding 使用的精炼开发指南。',
    '必须遵守：',
    '- 输出仅包含后端需要的内容：',
    '  - API设计：接口定义、请求响应格式、状态码、认证授权；',
    '  - 数据模型：表结构、字段类型、索引、关联关系；',
    '  - 业务逻辑：核心算法、数据处理流程、校验规则、异常处理；',
    '  - 性能要求：并发处理、缓存策略、数据库优化；',
    '- 不要包含前端UI细节、用户交互逻辑等与后端无关的内容。',
    '',
    '侧重：数据模型设计与API实现并重，注重系统稳定性。',
    '',
    '输出格式要求：',
    '1) API接口：详细的接口文档，包含请求响应示例、错误码说明；',
    '2) 数据模型：数据库表设计、字段定义、约束条件；',
    '3) 业务流程：核心业务逻辑的处理步骤和规则；',
    '4) 技术实现：涉及的技术选型、架构设计建议；',
    '5) 异常处理：各种边界情况和错误处理策略；',
    '6) 给出8条核心业务场景的实现要点。',
    '',
    '以下是原始文档：',
    doc
  ].join('\n');
};

// 测试角色提示词
const buildTesterPrompt = (doc: string): string => {
  return [
    '你是一个高级测试需求提炼专家。',
    '目标：从产品文档中，输出完整的测试策略和测试用例设计指南。',
    '必须遵守：',
    '- 输出仅包含测试需要的内容：',
    '  - 功能测试：核心功能点、业务流程、边界条件测试；',
    '  - 接口测试：API接口验证、参数校验、异常场景；',
    '  - 用户体验：页面交互、响应时间、易用性测试；',
    '  - 兼容性测试：浏览器、设备、操作系统兼容性；',
    '- 重点关注风险点识别和测试覆盖度。',
    '',
    '侧重：功能完整性验证与用户场景覆盖，确保质量。',
    '',
    '输出格式要求：',
    '1) 测试范围：明确测试的功能模块和优先级；',
    '2) 测试用例：详细的测试步骤、预期结果、验证点；',
    '3) 边界测试：异常输入、极限值、错误场景测试；',
    '4) 回归测试：重点回归的功能点和验证策略；',
    '5) 自动化建议：可自动化的测试场景和实现方案；',
    '6) 风险评估：潜在风险点和对应的测试策略；',
    '7) 给出15条核心测试用例（包含正常和异常场景）。',
    '',
    '以下是原始文档：',
    doc
  ].join('\n');
};

// UI设计角色提示词
const buildUIPrompt = (doc: string): string => {
  return [
    '你是一个高级UI设计需求提炼专家。',
    '目标：从产品文档中，输出完整的UI设计规范和视觉设计指南。',
    '必须遵守：',
    '- 输出仅包含UI设计需要的内容：',
    '  - 页面结构：布局设计、组件层级、信息架构；',
    '  - 交互设计：用户流程、操作反馈、状态变化；',
    '  - 视觉规范：色彩方案、字体规范、间距标准；',
    '  - 响应式设计：多端适配、断点设置、布局调整；',
    '- 不要包含技术实现细节，专注于用户体验和视觉表现。',
    '',
    '侧重：用户体验优先，兼顾视觉美观与功能实用。',
    '',
    '输出格式要求：',
    '1) 页面设计：每个页面的布局结构、组件说明；',
    '2) 交互流程：用户操作路径、页面跳转、状态反馈；',
    '3) 组件规范：通用组件的设计规则和使用场景；',
    '4) 视觉风格：配色方案、字体层级、图标风格；',
    '5) 响应式规则：不同屏幕尺寸的适配策略；',
    '6) 可访问性：无障碍设计考虑和实现建议；',
    '7) 给出关键页面的设计要点和注意事项。',
    '',
    '以下是原始文档：',
    doc
  ].join('\n');
};

// 提示词优化专家提示词
const buildPromptOptimizerPrompt = (userPrompt: string): string => {
  return [
    'You are a master-level AI prompt optimization specialist. Your mission: transform any user input into precision-crafted, richly detailed prompts that unlock AI\'s full potential.',
    '',
    '🎯 CORE PRINCIPLES:',
    '1. **RICH & DETAILED**: Generate comprehensive, professional-grade prompts with clear structure',
    '2. **PRESERVE INTENT**: Use ONLY information the user explicitly provided',
    '3. **SMART PLACEHOLDERS**: For missing critical info, use simple format [FILL: description]',
    '4. **PROFESSIONAL FRAMEWORK**: Add role, structure, constraints, output specs—but keep user\'s core content intact',
    '',
    '📋 THE 4-D METHODOLOGY:',
    '',
    '1. DECONSTRUCT',
    '   - Extract the core task and any specifics user provided',
    '   - Identify what IS clear vs what\'s MISSING',
    '   - Determine task type (creative/technical/analytical/etc.)',
    '',
    '2. DIAGNOSE',
    '   - Assess completeness: topic, format, length, style, audience, constraints',
    '   - Check for ambiguity that needs clarification',
    '   - Evaluate complexity needs',
    '',
    '3. DEVELOP (KEY STEP)',
    '   - Build a RICH framework with:',
    '     * Appropriate expert role assignment',
    '     * Detailed task structure (introduction → body → conclusion)',
    '     * Specific output requirements (format, length, style)',
    '     * Quality constraints and criteria',
    '     * Clear section organization',
    '   ',
    '   - For missing specifics, use clean placeholders: [FILL: clear description]',
    '     * If no topic given → [FILL: 具体主题]',
    '     * If no word count → [FILL: 目标字数]',
    '     * If no style → [FILL: 写作风格]',
    '     * If no audience → [FILL: 目标读者]',
    '     * Keep descriptions concise and clear—NO examples in placeholders',
    '',
    '4. DELIVER',
    '   - Output a COMPLETE, professional prompt with:',
    '     【Role】Expert identity and credentials',
    '     【Task】Clear objective with [FILL: ...] for user-specific details',
    '     【Requirements】Detailed criteria (structure, style, constraints, length)',
    '     【Format】Specific output specifications',
    '     【Quality Standards】What makes output excellent',
    '   ',
    '   - Make it production-ready—user just needs to fill in [FILL: ...] placeholders',
    '',
    '⚠️ CRITICAL RULES:',
    '- ✅ DO: Create rich, detailed frameworks with roles, structure, and constraints',
    '- ✅ DO: Use [FILL: description] format for ANY content user didn\'t specify',
    '- ✅ DO: Keep placeholder descriptions concise—just what to fill, NO examples',
    '- ❌ DON\'T: Invent specific topics, themes, data, or examples user didn\'t mention',
    '- ❌ DON\'T: Add example options inside [FILL: ...] brackets',
    '- ❌ DON\'T: Assume preferences—let user choose via clean [FILL: ...]',
    '',
    '✨ OPTIMIZATION TECHNIQUES TO APPLY:',
    '- **Role-playing**: "You are a [specific expert with credentials]..."',
    '- **Structured decomposition**: Break task into clear phases/sections',
    '- **Output specifications**: Define length, format, tone, style explicitly',
    '- **Constraint-based**: "Must include X, must avoid Y, use exactly Z..."',
    '- **Quality criteria**: "Excellent output will have characteristics A, B, C"',
    '- **Examples/Templates**: Show format structure (but use [FILL: ...] for content)',
    '- **Chain-of-thought**: "First analyze..., then develop..., finally refine..."',
    '',
    '📝 EXAMPLES:',
    '',
    'User: "帮我写一篇文章"',
    'Output: 【角色】你是资深内容创作者，擅长 [FILL: 领域]',
    '【任务】撰写一篇关于 [FILL: 具体主题] 的文章',
    '【要求】字数：[FILL: 目标字数]，风格：[FILL: 写作风格]，面向 [FILL: 目标读者]...',
    '',
    'User: "帮我写代码"',
    'Output: 【角色】你是精通 [FILL: 编程语言] 的资深工程师',
    '【任务】实现 [FILL: 功能描述]，要求 [FILL: 具体要求]...',
    '',
    'The output language should ALWAYS match the user\'s input language.',
    '',
    '📝 Now optimize this prompt (output ONLY the optimized version, no explanations):',
    '',
    userPrompt
  ].join('\n');
};

export const buildPrompt = (doc: string, role: RoleType = 'frontend'): string => {
  const condensedDoc = doc?.trim() || '';
  
  switch (role) {
    case 'frontend':
      return buildFrontendPrompt(condensedDoc);
    case 'backend':
      return buildBackendPrompt(condensedDoc);
    case 'tester':
      return buildTesterPrompt(condensedDoc);
    case 'ui':
      return buildUIPrompt(condensedDoc);
    default:
      return buildFrontendPrompt(condensedDoc);
  }
};

export const buildPromptOptimizer = (userPrompt: string): string => {
  return buildPromptOptimizerPrompt(userPrompt?.trim() || '');
};

// PR Review 提示词构建
export const buildPRReviewPrompt = (prInfo: any, template: string): string => {
  const baseContext = [
    '你是一位资深代码审查专家，擅长发现代码问题并提供建设性建议。',
    '',
    `### PR 基本信息`,
    `- 标题：${prInfo.title}`,
    `- 作者：${prInfo.author}`,
    `- 变更统计：${prInfo.changedFiles} 个文件，+${prInfo.additions}/-${prInfo.deletions} 行`,
    '',
    `### PR 描述`,
    prInfo.description,
    '',
  ].join('\n');

  // 构建文件变更详情
  const filesDetail = prInfo.files
    .map((file: any, index: number) => {
      return [
        `### 文件 ${index + 1}: ${file.filename}`,
        `状态：${file.status}`,
        `变更：+${file.additions}/-${file.deletions}`,
        '',
        '```diff',
        file.patch || '(二进制文件或无变更内容)',
        '```',
        ''
      ].join('\n');
    })
    .join('\n');

  // 根据不同模板生成不同的审查重点
  const templateInstructions = getReviewTemplateInstructions(template);

  return [
    baseContext,
    filesDetail,
    '',
    '### 审查要求',
    templateInstructions,
    '',
    '### 输出格式',
    '请按照以下结构输出审查意见：',
    '',
    '## 📋 审查总结',
    '用1-2句话总结这个PR的主要变更和整体质量。',
    '',
    '## ⭐ 亮点',
    '列出代码中做得好的地方（如果有）。',
    '',
    '## ⚠️ 问题和建议',
    '按优先级列出发现的问题和改进建议，格式：',
    '- **[严重/重要/建议]** `文件名:行号` - 问题描述及建议',
    '',
    '## ✅ 审查结论',
    '给出明确的结论：',
    '- ✅ **建议合并** - 代码质量良好，可以合并',
    '- ⚠️ **建议修改后合并** - 有一些需要优化的地方',
    '- ❌ **不建议合并** - 存在严重问题，需要重大修改',
    '',
    '请用中文输出，保持专业、客观、建设性的态度。'
  ].join('\n');
};

// 简历优化提示词

// 阶段1：结构化解析
export const buildResumeParsePrompt = (resumeText: string): string => {
  return `你是一位资深HR与简历解析专家。

【任务】
从下面的简历原始文本中，提取关键信息。**重点提取工作经历和项目经历的详细内容，其他信息简要提取即可。**

【输出要求】
必须严格按照以下JSON格式输出，不要添加任何其他文字：

\`\`\`json
{
  "basicInfo": {
    "name": "姓名",
  },
  "workExperience": [
    {
      "company": "公司名称",
      "position": "职位",
      "period": "时间段",
      "location": "地点",
      "responsibilities": ["职责1", "职责2"],
      "achievements": ["成就1", "成就2"]
    }
  ],
  "projects": [
    {
      "name": "项目名称",
      "role": "角色",
      "period": "时间段",
      "description": "项目描述",
      "technologies": ["技术1", "技术2"],
      "achievements": ["成就1", "成就2"]
    }
  ],
  "otherSections": "教育背景、技能、证书、荣誉等其他所有内容（保持原文，包括格式）"
}
\`\`\`

【解析规则】
1. **工作经历和项目经历**：详细提取，职责和成就分开，数字、百分比、指标完整保留
2. **基本信息**：只提取姓名
3. **其他内容**：教育背景、技能、证书、荣誉等所有其他内容直接复制原文到 otherSections 字段，保持原有格式
4. 时间段统一格式：YYYY.MM - YYYY.MM 或 YYYY.MM - 至今
5. 如果某个字段不存在，使用空字符串""或空数组[]

【简历原文】
${resumeText}

请直接输出JSON，不要有任何解释或额外文字。`;
};

// 阶段2：诊断分析
export const buildResumeAnalyzePrompt = (parsedResume: string): string => {
  return `你是世界顶级的简历优化专家，曾帮助数千人进入FAANG等顶级公司。

【任务】
基于以下结构化简历数据，深度分析存在的问题和优化空间。

【输出格式】
严格按照以下Markdown格式输出：

## 📊 简历诊断报告

### ⚠️ 关键问题（按优先级排序）

#### 🔴 严重问题
1. **[具体问题]** - [影响说明]
2. ...

#### 🟡 需要改进
1. **[具体问题]** - [改进方向]
2. ...

#### 🟢 优化建议
1. **[优化点]** - [预期效果]
2. ...

### 💡 优化策略

#### 关键词优化
- 缺失的行业关键词：[列表]
- 建议增加的技术栈：[列表]

#### 量化指标
- 当前量化比例：XX%
- 可量化的经历：[列表]
- 建议补充的数据维度：[列表]

#### 成就突出
- 高价值但表述不足的项目：[列表]
- 建议使用的强动词：[列表]

【简历数据】
${parsedResume}

请按格式输出完整的诊断报告。`;
};

// 阶段2：优化重写（仅优化项目经历和工作经历）
export const buildResumeOptimizePrompt = (parsedResume: string): string => {
  return `你是顶级简历优化大师，精通ATS系统规则、FAANG招聘标准和HR心理学。

【任务说明】
基于提供的简历结构化数据，**只深度优化项目经历和工作/实习经历**部分。其他所有内容（姓名、联系方式、教育背景、技能、证书、自我评价等）必须原样输出，不做任何改动。

【核心原则】
1. **ATS优先** - 确保机器可解析，关键词密度合理
2. **量化至上** - 每个成就必须有数字/百分比/指标
3. **价值导向** - 强调业务影响而非工作内容
4. **STAR法则** - Situation/Task/Action/Result结构
5. **动作动词** - 使用强有力的行为动词开头
6. **简洁有力** - 每条不超过2行，避免冗余

【优化规则库】

**强动作动词表**（必须使用）：
- 领导类：主导、推动、领导、统筹、协调
- 技术类：设计、开发、优化、重构、实现、架构
- 成果类：提升、降低、增长、缩短、节省、突破
- 创新类：创建、引入、开创、探索、研发

**量化模板**：
- "优化XX，使YY提升ZZ%"
- "主导XX项目，服务ZZ万用户，日活YY万"
- "设计XX架构，支撑QPS从AA提升到BB，性能提升CC%"
- "重构XX模块，代码量减少YY%，bug率降低ZZ%"

**禁止事项**：
- ❌ 禁用"负责"、"参与"、"协助"等弱动词
- ❌ 禁止无量化的主观描述（"熟悉"、"了解"）
- ❌ 禁止过长的句子（超过2行）
- ❌ 禁止技术名词拼写错误
- ❌ 禁止时间倒序错误

【输出格式】
直接输出 Markdown 内容，不要使用代码块包裹。严格按以下结构：

# {姓名（从 basicInfo.name 获取）}

{联系方式（从 basicInfo.contact 获取，保持原样）}

---

## 🏢 工作经历

{如果 workExperience 数组为空，输出：（暂无工作经历）}
{如果有工作经历，对每段进行深度优化：}

### {公司名称} | {职位} | {地点}
**{开始时间} - {结束时间}**

- {强动词} {具体工作}，{量化成果}（提升XX%/服务XX万用户/节省XX成本）
- {强动词} {技术方案}，{业务价值}（性能提升XX%/错误率降低XX%）
- {强动词} {团队协作}，{影响范围}（推广到XX个团队/覆盖XX个项目）

---

## 🚀 项目经历

{如果 projects 数组为空，输出：（暂无项目经历）}
{如果有项目，对每个项目进行深度优化：}

### {项目名称} | {角色}
**{时间段}** | 技术栈：{Tech1}、{Tech2}、{Tech3}

**项目背景**：{一句话说明项目背景和目标}

**核心职责与成就**：
- {强动词} {技术设计}，{性能指标}（QPS提升XX/响应时间降低XX%）
- {强动词} {功能实现}，{业务价值}（转化率提升XX%/用户增长XX万）
- {强动词} {技术难点}，{解决方案}（攻克XX问题/创新XX方案）

---

{这里直接完整输出 otherSections 的内容，一个字都不要改动，包括所有的教育背景、技能、证书、荣誉、自我评价等}

【输入数据】
${parsedResume}

【重要提醒】
1. **只优化**：工作经历和项目经历的描述内容
2. **完全保持原样**：姓名、联系方式、教育背景、技能、证书、自我评价等所有 otherSections 的内容
3. **不要添加**：专业概要、个人总结等原文没有的新章节
4. **不要重复**：输出一次完整简历即可，不要在末尾重复输出

【质量检查】
- [ ] 工作和项目经历用强动词+量化成果
- [ ] otherSections 内容完整保留，未做任何改动
- [ ] 没有添加专业概要等新章节
- [ ] 没有重复输出内容
- [ ] 输出完整且格式正确

直接开始输出优化后的简历，不要有任何前缀或解释：`;
};

function getReviewTemplateInstructions(template: string): string {
  switch (template) {
    case 'security':
      return [
        '请重点关注以下安全问题：',
        '1. SQL注入、XSS、CSRF等常见安全漏洞',
        '2. 敏感信息泄露（密码、token、密钥等）',
        '3. 权限验证和访问控制',
        '4. 输入验证和数据清洗',
        '5. 加密算法使用是否恰当',
        '6. 依赖包的安全性'
      ].join('\n');
    
    case 'performance':
      return [
        '请重点关注以下性能问题：',
        '1. 算法复杂度和时间复杂度',
        '2. 数据库查询优化（N+1问题、索引使用等）',
        '3. 内存泄漏风险',
        '4. 循环和递归的效率',
        '5. 缓存策略',
        '6. 资源加载和打包优化',
        '7. 异步处理和并发控制'
      ].join('\n');
    
    case 'code-style':
      return [
        '请重点关注以下代码规范问题：',
        '1. 命名规范（变量、函数、类等）',
        '2. 代码格式和缩进',
        '3. 注释的完整性和准确性',
        '4. 代码重复（DRY原则）',
        '5. 函数长度和复杂度',
        '6. 模块化和文件组织',
        '7. 类型定义（如TypeScript）',
        '8. 代码可读性'
      ].join('\n');
    
    case 'business-logic':
      return [
        '请重点关注以下业务逻辑问题：',
        '1. 业务流程的完整性',
        '2. 边界条件和异常处理',
        '3. 数据一致性',
        '4. 状态管理',
        '5. 并发场景下的正确性',
        '6. 回滚和补偿机制',
        '7. 业务规则的实现是否准确'
      ].join('\n');
    
    case 'comprehensive':
    default:
      return [
        '请进行全面的代码审查，关注：',
        '',
        '**功能正确性**',
        '- 代码逻辑是否正确',
        '- 是否满足需求',
        '- 边界条件处理',
        '',
        '**代码质量**',
        '- 命名规范',
        '- 代码可读性',
        '- 注释完整性',
        '- 代码重复',
        '',
        '**性能**',
        '- 算法效率',
        '- 数据库查询优化',
        '- 资源使用',
        '',
        '**安全性**',
        '- 常见安全漏洞',
        '- 权限控制',
        '- 数据验证',
        '',
        '**可维护性**',
        '- 代码结构',
        '- 模块化程度',
        '- 测试覆盖',
        '',
        '**最佳实践**',
        '- 设计模式应用',
        '- 框架使用规范',
        '- 错误处理'
      ].join('\n');
  }
}
