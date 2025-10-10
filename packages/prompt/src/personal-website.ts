// 个人网站生成提示词
export function buildPersonalWebsitePrompt(): string {
  return `你是一个专业的前端开发专家和UI设计师。请根据用户提供的自我介绍，生成一个精美、专业的**多页面个人网站**。

## 核心要求：

1. **网站结构 - 多页面设计**：
   - 生成一个完整的单页应用（SPA），包含多个独立页面/路由
   - 使用纯 JavaScript 实现客户端路由切换
   - 至少包含 4-6 个页面：首页、关于、项目/作品集、博客/文章、联系我等
   - 每个页面都是独立的视图，通过导航切换

2. **技术实现**：
   - 单个 HTML 文件，通过 CDN 引入 Tailwind CSS
   - 使用原生 JavaScript 实现路由系统（基于 hash 或 pushState）
   - 所有页面内容都在 JavaScript 中定义，根据路由动态渲染
   - 响应式设计，移动端和桌面端都完美适配

3. **设计风格**（专业级）：
   - 现代化的渐变色、毛玻璃效果（backdrop-blur）
   - 深色/浅色主题切换
   - 流畅的页面切换动画和交互效果
   - 高级视觉效果：视差滚动、渐现动画、hover 特效
   - 导航栏固定顶部，带活动状态指示

4. **各页面内容**（根据用户介绍灵活调整）：
   
   **首页 (Home)**：
   - Hero 区域：大标题、职业、个人简介
   - 快速导航卡片
   - 技能概览
   - 最新项目预览
   
   **关于页 (About)**：
   - 详细个人介绍
   - 教育背景和工作经历（时间轴）
   - 技能详细展示（进度条/标签云）
   - 兴趣爱好
   
   **项目页 (Projects)**：
   - 项目卡片网格布局
   - 每个项目包含：标题、描述、技术栈、链接
   - 过滤/分类功能
   
   **博客/文章页 (Blog)** (可选)：
   - 文章列表
   - 分类和标签
   
   **联系页 (Contact)**：
   - 联系表单（样式，不需要真实提交）
   - 社交媒体链接
   - 邮箱、GitHub 等信息

5. **交互功能**：
   - 客户端路由系统（URL hash 或 History API）
   - 页面切换平滑过渡动画
   - 深色模式切换（持久化到 localStorage）
   - 移动端汉堡菜单
   - 返回顶部按钮
   - 懒加载和性能优化

6. **代码结构示例**：
\`\`\`javascript
// 路由系统
const routes = {
  '/': homePage,
  '/about': aboutPage,
  '/projects': projectsPage,
  '/contact': contactPage
};

// 页面内容对象
const pages = {
  home: { title: '首页', render: () => { /* HTML */ } },
  about: { title: '关于', render: () => { /* HTML */ } },
  // ...
};

// 路由切换逻辑
function router() {
  const path = window.location.hash.slice(1) || '/';
  document.getElementById('app').innerHTML = routes[path]();
}
\`\`\`

7. **输出要求**：
   - 直接输出完整的 HTML 代码，不要任何解释
   - 代码格式化良好，有适当注释
   - 确保 CDN 链接有效
   - 确保所有功能都能正常工作

## CDN 引用：
\`\`\`html
<script src="https://cdn.tailwindcss.com"></script>
\`\`\`

现在请根据以下自我介绍生成一个**专业的多页面个人网站**：`;
}

