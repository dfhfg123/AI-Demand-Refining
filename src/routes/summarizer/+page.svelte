<script lang="ts">
  import ResultView from "$lib/components/ResultView.svelte";
  import { buildPrompt } from "$lib/utils/prompt";
  import { invokeSiliconFlow, getChoiceText, type ChatMessage } from "$lib/utils/api";
  import { load, save, clear } from "$lib/utils/storage";
  import ApiKeyPanel from "$lib/components/ApiKeyPanel.svelte";
  import { apiKeyStore } from "$lib/stores/api";

  let input = load()?.input || "";
  let output = load()?.output || "";
  let loading = false;

  const summarize = async () => {
    const apiKey = $apiKeyStore?.trim();
    if (!apiKey || !input?.trim()) return;
    loading = true;
    save({ input });
    const prompt = buildPrompt(input);
    const messages: ChatMessage[] = [{ role: "user", content: prompt }];
    try {
      const resp = await invokeSiliconFlow(apiKey, messages);
      output = getChoiceText(resp) || "";
      save({ output });
    } finally { loading = false; }
  };

  const resetAll = () => { input = ""; output = ""; clear(); };
</script>

<div class="max-w-5xl mx-auto p-4">
  <h2 class="text-xl font-semibold mb-2">AI 需求提炼助手</h2>
  <ApiKeyPanel inline={true} />

  <div class="mt-3">
    <div class="flex items-center justify-between mb-2">
      <strong>输入文档</strong>
      <span class="text-xs text-gray-500 flex items-center gap-2"><small>可直接粘贴产品文档</small><button class="px-2 py-1 border rounded" on:click={resetAll}>清空</button></span>
    </div>
    <textarea bind:value={input} class="w-full h-72 p-3 box-border border rounded whitespace-pre-line" placeholder={`粘贴文档到此处...`}></textarea>
  </div>

  <div class="my-4 flex gap-2">
    <button class="px-3 py-2 rounded bg-black text-white disabled:opacity-50" on:click={summarize} disabled={!$apiKeyStore || !input || loading}>{loading ? "处理中..." : "生成总结"}</button>
  </div>

  <ResultView text={output} />
</div>


