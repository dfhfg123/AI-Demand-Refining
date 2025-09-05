<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";
  import { derived } from "svelte/store";
  import Sidebar from "$lib/components/Sidebar.svelte";
  // 确保 tailwind 全局生效

  const title = derived(page, ($p) => {
    const seg = $p.url.pathname.split("/").filter(Boolean).at(0) || "home";
    return seg === "home" ? "AI 工具集" : `AI 工具集 | ${seg}`;
  });
</script>

<svelte:head>
  <title>{$title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="min-h-screen grid grid-cols-[14rem_1fr]">
  <div>
    <Sidebar
      items={[
        { href: "/", label: "首页" },
        { href: "/summarizer", label: "需求提炼专家" },
        { href: "/prd", label: "PRD/BRD 生成器" },
        { href: "/meeting", label: "会议纪要行动清单" },
        { href: "/competitive", label: "竞品分析报告" },
        { href: "/tech-guide", label: "技术选型指南" },
        { href: "/interview", label: "面经助手" }
      ]} />
  </div>
  <main class="p-4">
    <slot />
  </main>
</div>

<style>
  :global(html, body) { margin:0; padding:0; }
</style>
