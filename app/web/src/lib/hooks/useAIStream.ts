import { apiKeyStore, selectedModelStore } from "$lib/stores/api";
import { invokeSiliconFlow, type AIStreamStatus } from "@prompt-hub/request";
import { derived, get, writable, type Readable, type Writable } from "svelte/store";

interface AIStreamState {
  progress: number;
  status: AIStreamStatus;
  result: string;
  error: string | null;
}

interface AIStream {
  id: string;
  state: Writable<AIStreamState>;
  statusTip:Readable<ReturnType<typeof getMessageTip>>
  invoke: (prompt: string) => Promise<void>;
  cancelRequest: () => void;
  reset: () => void;
}

export const baseConfig = {
  baseURL: "https://api.siliconflow.cn/v1/chat/completions",
  defaultModel: "moonshotai/Kimi-K2-Instruct",
};

// 存储当前未完成的stream，使得切换页面组件卸载重装后可以找回来
export const streamMap = new Map<string, AIStream>();

export function useAIStream(id: string): AIStream {
  if (streamMap.has(id)) return streamMap.get(id);

  const initialState = {
    progress: 0,
    status: "idle",
    result: "",
    error: null,
  } as AIStreamState;

  const state = writable<AIStreamState>(initialState);

  let abortController: AbortController;


  const cancelRequest = () => {
    abortController?.abort();
    state.update((s) => ({ ...s, loading: false, status: "idle" }));
  };

  const reset = () => {
    state.set(initialState);
    cancelRequest();
  };


  const invoke = async (prompt: string) => {
    const apiKey = get(apiKeyStore);
    if (!apiKey) {
      state.update((state) => ({ ...state, error: "请先配置API Key" }));
      return;
    }

    reset();
    abortController = new AbortController();

    const onProgress = (progress: number, status: AIStreamStatus) =>
      state.update((state) => ({ ...state, progress, status }));
    const onStream = (chunk: string) =>
      state.update((state) => ({ ...state, result: state.result + chunk }));

    try {
      await invokeSiliconFlow({
        baseURL: baseConfig.baseURL,
        apiKey,
        model: get(selectedModelStore) ?? baseConfig.defaultModel,
        messages: [{ role: "user", content: prompt }],
        onProgress,
        onStream,
        extra: {
          signal: abortController.signal,
        },
      });
    } catch (err) {
      console.log("AI service error: ", err);
      const errorMessage = err instanceof Error ? err.message : "未知错误";
      state.update((state) => ({
        ...state,
        error: `生成失败：${errorMessage}\n\n请检查：\n1. API Key是否正确\n2. 网络连接是否正常\n3. 输入内容是否过长`,
        progress: 0,
        status: "error",
      }));
    }
  };

  const statusTip = derived(state,($s)=>getMessageTip($s.status))

  const res: AIStream = {
    id,
    state,
    invoke,
    cancelRequest,
    reset,
    statusTip
  };

  streamMap.set(id, res);

  return res;
}

export const getMessageTip = (status: AIStreamStatus) => {
  switch (status) {
    case "idle":
      return "空闲中";
    case "connecting":
      return "正在连接";
    case "streaming":
      return "数据流传输中";
    case "nonstreaming":
      return "非流式传输";
    case "done":
      return "操作已完成";
    case "error":
      return "发生错误，请重试";
    default:
      return "未知状态";
  }
};
