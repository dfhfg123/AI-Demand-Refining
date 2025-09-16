<script lang="ts">
    import { base } from "$app/paths";
    import { page } from "$app/stores";
    import { derived } from "svelte/store";
    import { slide } from 'svelte/transition';

    const qqNumber = "365469688";
    const qqUrl = "https://qm.qq.com/cgi-bin/qm/qr?k=eusCODc30Lp9vNzX1JlUeXPdTvt_NdS3&jump_from=webapi&authKey=BujGXUqD8suyhi0IM4gr2HDbgxVwtueZkh6Nffpus/2O3YvbDrgYwO+QGEm1Kymw";
    const isHome = derived(page, ($p) => {
      const path = $p.url.pathname.replace(base, "");
      return path === "/" || path === "";
    });
    let expanded = $isHome; // 初始化：首页展开，非首页收起
    let isManualToggle = false; // 标志变量，用于区分手动切换和自动设置

    // 响应式语句：仅在非手动切换且非首页时收起
    $: if (!$isHome && !isManualToggle) {
      expanded = false; // 非首页默认收起
    }

    $: if ($isHome) {
      expanded = true; // 非首页默认收起
      isManualToggle = false;
    }

    let showJoin = false;
    let imgRef: HTMLImageElement;

    function handleJoin() {
      window.open(qqUrl, "_blank");
    }

    function togglePanel() {
      isManualToggle = true; // 标记为手动切换
      expanded = !expanded; // 切换展开状态
      console.log("Toggle:", expanded);
    }
  </script>

  <div class="fixed top-4 right-4 z-50 hidden lg:block w-[210px]">
    <div class="bg-white/90 backdrop-blur-sm rounded-2xl pl-5 pr-5 pt-3 pb-3 shadow-soft border border-white/20 text-center">
      <div class="flex items-center justify-center cursor-pointer select-none">
        <span class="text-sm font-medium text-neutral-800">
          Prompt Hub 摸鱼群
        </span>
        <svg class="ml-2 w-4 h-4 transition-transform duration-200" style="transform: rotate({expanded ? 0 : 180}deg);" fill="none" stroke="currentColor" viewBox="0 0 24 24" on:click|stopPropagation={togglePanel}>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div class="font-mono text-blue-600 mb-1 relative inline-block">{qqNumber}</div>
      {#if expanded}
        <div transition:slide>
          <div
            class="bg-white p-4 rounded-xl shadow-sm border border-neutral-200 flex items-center justify-center relative mt-2"
            on:mouseenter={() => showJoin = true}
            on:mouseleave={() => showJoin = false}
            role="region"
            class:show-join={showJoin}
            style="width: 160px; height: 160px;"
          >
            <img
              bind:this={imgRef}
              src="/qq.png"
              alt="QQ群二维码"
              class="w-36 h-36 object-contain transition-all duration-200 {showJoin ? 'blur-sm' : ''}"
              draggable="false"
            />
            <div
              class="join-btn absolute inset-0 flex items-center justify-center text-white text-xl font-bold bg-black/40 rounded-xl cursor-pointer select-none"
              style="opacity: {showJoin ? 1 : 0}; pointer-events: {showJoin ? 'auto' : 'none'};"
              on:click={handleJoin}
            >
              加入
            </div>
          </div>
          {#if $isHome}
            <p class="text-sm text-neutral-800 mt-2">(✪ω✪)</p>
          {/if}
        </div>
      {/if}
    </div>
  </div>