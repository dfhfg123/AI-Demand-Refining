# 部署说明

## 方案一：GitHub Pages (推荐 - 国内访问稳定)

### 步骤：

1. **推送代码到GitHub**
   ```bash
   git add .
   git commit -m "配置GitHub Pages部署"
   git push origin main
   ```

2. **启用GitHub Pages**
   - 进入你的GitHub仓库
   - 点击 `Settings` → `Pages`
   - 在 `Source` 选择 `GitHub Actions`
   - 保存设置

3. **自动部署**
   - 每次推送到 `main` 分支时，GitHub Actions会自动构建和部署
   - 部署完成后，你的网站地址为：`https://你的用户名.github.io/AI-Demand-Refining`
   - 所有页面路由将正确工作：
     - 首页：`https://你的用户名.github.io/AI-Demand-Refining/`
     - 需求提炼：`https://你的用户名.github.io/AI-Demand-Refining/summarizer`
     - PRD生成器：`https://你的用户名.github.io/AI-Demand-Refining/prd`
     - 面经助手：`https://你的用户名.github.io/AI-Demand-Refining/interview`

## 方案二：Gitee Pages (国内访问最快)

### 步骤：

1. **同步代码到Gitee**
   - 在Gitee创建新仓库
   - 推送代码到Gitee

2. **启用Gitee Pages**
   - 进入仓库 → `服务` → `Gitee Pages`
   - 选择 `master` 分支，点击 `启动`
   - 网站地址：`https://你的用户名.gitee.io/ai-req-summarizer`

## 方案三：Netlify (备选方案)

### 步骤：

1. **修改适配器**
   ```bash
   npm uninstall @sveltejs/adapter-static
   npm install @sveltejs/adapter-netlify --save-dev
   ```

2. **修改 svelte.config.js**
   ```javascript
   import adapter from '@sveltejs/adapter-netlify';
   ```

3. **连接Netlify**
   - 访问 [netlify.com](https://netlify.com)
   - 连接GitHub仓库
   - 自动部署

## 本地测试

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## 注意事项

- GitHub Pages 在国内访问相对稳定
- 如果使用自定义域名，需要配置 CNAME 文件
- 静态部署不支持服务端功能，所有逻辑都在客户端执行

## 路由问题排查

如果遇到 404 错误，请检查：

1. **确认 GitHub Pages 设置**
   - 在仓库设置中确保选择了 "GitHub Actions" 作为源
   - 不要选择 "Deploy from a branch"

2. **检查部署状态**
   - 在 Actions 页面查看最新的部署是否成功
   - 如果失败，查看错误日志

3. **正确的URL格式**
   - 首页：`https://用户名.github.io/AI-Demand-Refining/`
   - 子页面：`https://用户名.github.io/AI-Demand-Refining/页面名`
   - 注意：不是 `https://用户名.github.io/页面名`

4. **重新部署**
   ```bash
   git add .
   git commit -m "fix: update deployment configuration"
   git push origin main
   ```

5. **等待部署完成**
   - GitHub Pages 部署可能需要 5-10 分钟
   - 在 Actions 页面可以查看进度
