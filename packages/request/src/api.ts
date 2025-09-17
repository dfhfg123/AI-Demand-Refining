export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};
// 进度回调函数类型
export type ProgressCallback = (progress: number, status: string) => void;

// 流式内容回调函数类型
export type StreamCallback = (chunk: string) => void;

export const getChoiceText = (resp: any): string =>
  resp?.choices?.[0]?.message?.content || "";

export type AIStreamStatus =
  | "idle"
  | "connecting"
  | "streaming"
  | "nonstreaming"
  | "done"
  | "error";

interface InvokeOptions {
  baseURL: string;
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  onProgress?: (progress: number, status: AIStreamStatus) => void;
  onStream?: StreamCallback;
  onFinished?: () => void;
  extra?: Record<string, any>;
  bodyExtra?: Record<string, any>;
}

const DEFAULT_TEMPERATURE = 0.3;
const DEFAULT_MAX_TOKEN = 39999;

export const invokeSiliconFlow = async (
  options: InvokeOptions
): Promise<any> => {
  const { baseURL, apiKey, model, messages } = options;
  const streamBody = {
    model,
    messages,
    temperature: DEFAULT_TEMPERATURE,
    max_tokens: DEFAULT_MAX_TOKEN,
    stream: true,
    ...(options.bodyExtra ?? {}),
  };

  options.onProgress?.(0, "connecting");

  const response = await fetch(baseURL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(streamBody),
    ...(options.extra ?? {}),
  });

  if (!response.ok) {
    // 如果流式请求失败，尝试降级到非流式
    if (response.status === 400 || response.status === 422) {
      console.warn("流式输出不支持，降级到非流式模式");
      return await fallbackToNonStream(options);
    }
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  if (!response.body) {
    console.warn("响应体为空，降级到非流式模式");
    return await fallbackToNonStream(options);
  }

  options.onProgress?.(10, "streaming");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullContent = "";
  let progress = 10;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      options.onProgress?.(100, "done");
      options.onFinished?.();
      break;
    }

    const chunk = decoder.decode(value, { stream: true });
    buffer += chunk;

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim();

        if (data === "[DONE]") {
          options.onProgress?.(100, "done");
          options.onFinished?.();
          return fullContent;
        }

        if (data) {
          const parsed = JSON.parse(data);
          const content = parsed?.choices?.[0]?.delta?.content || "";

          if (content) {
            fullContent += content;
            options.onStream?.(content);

            progress = Math.min(90, 10 + Math.floor(fullContent.length / 10));
            options.onProgress?.(progress, "streaming");
          }
        }
      }
    }
  }

  return fullContent;
};


// 降级到非流式模式
const fallbackToNonStream = async (options: InvokeOptions): Promise<string> => {
    const { baseURL, apiKey, model, messages } = options;
    const body = {
      model,
      messages,
      temperature: DEFAULT_TEMPERATURE,
      max_tokens: DEFAULT_MAX_TOKEN,
      stream: false,
      ...(options.bodyExtra ?? {}),
    };

    options.onProgress?.(20, 'nonstreaming');

    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    options.onProgress?.(80, 'nonstreaming');
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";

    options.onProgress?.(100, 'done');
    return content;
  };