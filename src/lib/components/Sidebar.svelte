<script lang="ts">
  import { page } from "$app/stores";
  import { derived } from "svelte/store";

  type Nav = { href: string; label: string };
  export let items: Nav[] = [];
  const active = derived(page, ($p) => $p.url.pathname);
</script>

<nav class="h-full w-56 border-r bg-white/80 backdrop-blur p-3">
  <div class="text-lg font-semibold mb-3">AI 工具集</div>
  <ul class="space-y-1">
    {#each items as it}
      <li>
        <a class="block rounded px-3 py-2 hover:bg-gray-100 transition"
           class:font-semibold={$active.startsWith(it.href)}
           class:bg-gray-100={$active.startsWith(it.href)}
           href={it.href}>{it.label}</a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  /* 尽量少样式，主要交给 tailwind */
</style>


