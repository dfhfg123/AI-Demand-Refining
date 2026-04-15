<script lang="ts">
  import { fade } from 'svelte/transition';
  import MarkdownView from '$lib/components/MarkdownView.svelte';

  export let result: any;

  let activeTab = 'skill';
  let copySuccess = '';
  let installTarget = 'project'; // 'project' | 'user' | 'openclaw' | 'clawdbot'
  let showDownloadOptions = false;

  const installTargets = [
    { key: 'project', label: '项目级', path: '.agents/skills', desc: '仅当前项目生效' },
    { key: 'user', label: '用户级', path: '~/.agents/skills', desc: '所有项目生效' },
    { key: 'openclaw', label: 'OpenClaw', path: '~/.openclaw/skills', desc: 'OpenClaw Agent' },
    { key: 'clawdbot', label: 'Clawdbot', path: '~/.clawdbot/skills', desc: 'Clawdbot Agent' }
  ];

  const tabs = [
    { key: 'skill', label: 'SKILL.md' },
    { key: 'readme', label: 'README.md' },
    { key: 'usage', label: '使用指南' }
  ];

  const getInstallCommand = (): string => {
    const name = result.skillName || 'skill-name';
    const target = installTargets.find(t => t.key === installTarget);
    if (!target) return '';

    const path = target.path.replace('~', '$HOME');
    return `mkdir -p ${path}/${name} && cat > ${path}/${name}/SKILL.md << 'SKILL_EOF'\n${result.skillMd || ''}\nSKILL_EOF`;
  };

  const getTabContent = (key: string): string => {
    switch (key) {
      case 'skill': return result.skillMd || '';
      case 'readme': return result.fileStructure?.['README.md'] || '';
      case 'usage': return result.usageGuide || '';
      default: return '';
    }
  };

  const copyInstallCommand = async () => {
    const command = getInstallCommand();
    await navigator.clipboard?.writeText(command);
    copySuccess = 'install';
    setTimeout(() => { copySuccess = ''; }, 2000);
  };

  const copyContent = async (key: string) => {
    const content = getTabContent(key);
    await navigator.clipboard?.writeText(content);
    copySuccess = key;
    setTimeout(() => { copySuccess = ''; }, 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAsZip = async () => {
    const JSZip = await import('jszip');
    const zip = new JSZip.default();
    const skillName = result.skillName || 'skill';
    const folder = zip.folder(skillName);

    folder.file('SKILL.md', result.skillMd || '');
    if (result.fileStructure?.['README.md']) {
      folder.file('README.md', result.fileStructure['README.md']);
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${skillName}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };
</script>

<div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden">
  <!-- Header -->
  <div class="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-neutral-100">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-neutral-800 flex items-center">
        <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
        Skill 生成结果
      </h3>
      <div class="flex items-center space-x-2">
        <button
          on:click={() => { showDownloadOptions = !showDownloadOptions; }}
          class="px-3 py-1.5 text-xs font-medium bg-white hover:bg-neutral-50 text-neutral-600 rounded-lg border border-neutral-200 transition-colors duration-200"
        >
          {showDownloadOptions ? '隐藏下载' : '下载文件'}
        </button>
      </div>
    </div>
  </div>

  <!-- One-click Install Section -->
  <div class="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5 border-b border-neutral-100">
    <div class="flex items-center gap-2 mb-3">
      <span class="text-amber-600 text-lg">⚡</span>
      <h4 class="text-sm font-semibold text-neutral-800">一键安装</h4>
      <span class="text-xs text-neutral-500">复制命令到终端执行即可</span>
    </div>

    <!-- Install Target Selector -->
    <div class="flex flex-wrap gap-2 mb-4">
      {#each installTargets as target}
        <button
          class="px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200"
          class:bg-amber-500={installTarget === target.key}
          class:text-white={installTarget === target.key}
          class:border-amber-500={installTarget === target.key}
          class:bg-white={installTarget !== target.key}
          class:text-neutral-600={installTarget !== target.key}
          class:border-neutral-200={installTarget !== target.key}
          class:hover:border-amber-300={installTarget !== target.key}
          on:click={() => { installTarget = target.key; }}
          title="{target.desc}"
        >
          {target.label}
          <span class="opacity-60 ml-1">({target.path})</span>
        </button>
      {/each}
    </div>

    <!-- Install Command Display -->
    <div class="relative">
      <pre class="text-xs text-neutral-700 bg-neutral-900 rounded-lg p-4 pr-24 whitespace-pre-wrap break-all max-h-[120px] overflow-y-auto font-mono text-green-400">{getInstallCommand()}</pre>
      <button
        on:click={copyInstallCommand}
        class="absolute right-2 top-2 px-3 py-1.5 text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-1.5"
      >
        {#if copySuccess === 'install'}
          <span>✓</span>
          <span>已复制</span>
        {:else}
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>复制命令</span>
        {/if}
      </button>
    </div>
  </div>

  <!-- Download Options (Collapsible) -->
  {#if showDownloadOptions}
    <div class="bg-neutral-50 px-6 py-4 border-b border-neutral-100" transition:fade={{ duration: 200 }}>
      <div class="flex items-center justify-between">
        <span class="text-sm text-neutral-600">下载 Skill 文件</span>
        <div class="flex items-center space-x-2">
          <button
            on:click={() => downloadFile(`${result.skillName || 'skill'}/SKILL.md`, result.skillMd || '')}
            class="px-3 py-1.5 text-xs font-medium bg-white hover:bg-neutral-100 text-neutral-600 rounded-lg border border-neutral-200 transition-colors duration-200"
          >
            下载 SKILL.md
          </button>
          {#if result.fileStructure?.['README.md']}
            <button
              on:click={() => downloadFile(`${result.skillName || 'skill'}/README.md`, result.fileStructure['README.md'])}
              class="px-3 py-1.5 text-xs font-medium bg-white hover:bg-neutral-100 text-neutral-600 rounded-lg border border-neutral-200 transition-colors duration-200"
            >
              下载 README.md
            </button>
          {/if}
          <button
            on:click={downloadAsZip}
            class="px-3 py-1.5 text-xs font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
          >
            打包下载 ZIP
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Tabs -->
  <div class="border-b border-neutral-100 px-6">
    <div class="flex space-x-1">
      {#each tabs as tab}
        <button
          class="px-4 py-2.5 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px"
          class:border-amber-500={activeTab === tab.key}
          class:text-amber-600={activeTab === tab.key}
          class:border-transparent={activeTab !== tab.key}
          class:text-neutral-500={activeTab !== tab.key}
          class:hover:text-neutral-700={activeTab !== tab.key}
          on:click={() => { activeTab = tab.key; }}
        >
          {tab.label}
        </button>
      {/each}
    </div>
  </div>

  <!-- Content -->
  <div class="relative">
    <div class="p-6">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs text-neutral-500">
          {result.skillName}/{tabs.find(t => t.key === activeTab)?.label}
        </span>
        <button
          on:click={() => copyContent(activeTab)}
          class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors duration-200"
        >
          {#if copySuccess === activeTab}
            <span in:fade={{ duration: 200 }}>✓</span>
            <span>已复制</span>
          {:else}
            <span>复制</span>
          {/if}
        </button>
      </div>

      {#if activeTab === 'usage'}
        <div class="prose prose-sm max-w-none text-neutral-700">
          <MarkdownView source={getTabContent(activeTab)} />
        </div>
      {:else}
        <pre class="text-sm text-neutral-700 bg-neutral-50 rounded-xl p-4 whitespace-pre-wrap break-all max-h-[600px] overflow-y-auto font-mono">{getTabContent(activeTab)}</pre>
      {/if}
    </div>
  </div>
</div>
