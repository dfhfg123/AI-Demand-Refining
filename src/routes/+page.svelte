<script lang="ts">
  import ResultView from "$lib/components/ResultView.svelte";
  import { buildPrompt } from "$lib/utils/prompt";
  import { invokeSiliconFlow, getChoiceText } from "$lib/utils/api";
  import { load, save, clear } from "$lib/utils/storage";
  // 输入不再渲染 markdown

  type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

  let apiKey = "";
  let input = "";
  let output = "";
  let mode = "unified";
  let loading = false;

  const init = () => {
    const persisted = load();
    apiKey = persisted?.apiKey || "";
    input = persisted?.input || "";
    output = persisted?.output || "";
    // 统一模式，不再区分
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
    save({ apiKey, input });
    const prompt = buildPrompt(input);
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
  <h2 style="margin:8px 0;">AI 需求提炼助手</h2>

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
      <!-- <small>可直接粘贴产品文档</small> -->
      <span>
        <!-- <span>可直接粘贴产品文档</span> -->
              <small>可直接粘贴产品文档</small>
        <button on:click={resetAll}>清空</button></span
      >
    </div>
    <textarea
    bind:value={input}
    placeholder={`你是否经常看到冗长的产品需求文档，其中包含大量你看不懂或者你根本不关心的逻辑。
  作为一个前端，你只想知道给了我几个接口，改动的有哪些页面有哪些交互逻辑。而知道这些要画大量时间看完你不了解的逻辑。
  那么，直接把文档粘贴到这里，会有你想要的答案`}
    style="width:100%;height:300px;padding:12px;box-sizing:border-box;border:1px solid #e5e7eb;border-radius:8px;white-space: pre-line;"
  ></textarea>
  
  </div>

  <div style="margin:16px 0;display:flex;gap:8px;">
    <button
      on:click={summarize}
      disabled={!apiKey || !input || loading}
      style="padding:10px 14px;border-radius:8px;"
      >{loading ? "处理中..." : "生成总结"}</button
    >
  </div>

  <ResultView text={output} />
</div>
