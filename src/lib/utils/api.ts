export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

import { httpJson } from './http';

const BASE_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const DEFAULT_MODEL = 'moonshotai/Kimi-K2-Instruct';

type CreateChatBody = { 
  model: string; 
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
};

// 进度回调函数类型
export type ProgressCallback = (progress: number, status: string) => void;

// 流式内容回调函数类型
export type StreamCallback = (chunk: string) => void;

// SSE流式AI调用服务（带降级机制）
export const invokeSiliconFlowWithProgress = async (
  apiKey: string, 
  messages: ChatMessage[], 
  onProgress: ProgressCallback,
  model = DEFAULT_MODEL,
  onStream?: StreamCallback
): Promise<string> => {
  // 首先尝试流式输出
  const streamBody = { 
    model, 
    messages,
    temperature: 0.3,
    max_tokens: 39999,
    stream: true
  };

  onProgress(0, '正在连接AI服务...');
  
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(streamBody)
  });

  if (!response.ok) {
    // 如果流式请求失败，尝试降级到非流式
    if (response.status === 400 || response.status === 422) {
      console.warn('流式输出不支持，降级到非流式模式');
      return await fallbackToNonStream(apiKey, messages, onProgress, model);
    }
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  if (!response.body) {
    console.warn('响应体为空，降级到非流式模式');
    return await fallbackToNonStream(apiKey, messages, onProgress, model);
  }

  onProgress(10, '开始接收数据...');
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullContent = '';
  let progress = 10;
  
  while (true) {
    const { done, value } = await reader.read();
    
    if (done) {
      onProgress(100, '生成完成');
      break;
    }
    
    const chunk = decoder.decode(value, { stream: true });
    buffer += chunk;
    
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();
        
        if (data === '[DONE]') {
          onProgress(100, '生成完成');
          return fullContent;
        }
        
        if (data) {
          const parsed = JSON.parse(data);
          const content = parsed?.choices?.[0]?.delta?.content || '';
          
          if (content) {
            fullContent += content;
            onStream?.(content);
            
            progress = Math.min(90, 10 + Math.floor(fullContent.length / 10));
            onProgress(progress, '正在生成内容...');
          }
        }
      }
    }
  }
  
  return fullContent;
};

// 降级到非流式模式
const fallbackToNonStream = async (
  apiKey: string,
  messages: ChatMessage[],
  onProgress: ProgressCallback,
  model: string
): Promise<string> => {
  const body = {
    model,
    messages,
    temperature: 0.3,
    max_tokens: 39999,
    stream: false
  };

  onProgress(20, '使用非流式模式...');
  
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  onProgress(80, '正在处理响应...');
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || '';
  
  onProgress(100, '生成完成');
  return content;
};

// 保留原有的非进度接口，供不需要进度的场景使用
export const invokeSiliconFlow = (apiKey: string, messages: ChatMessage[], model = DEFAULT_MODEL): Promise<any> => {
  const body: CreateChatBody = { model, messages };
  return httpJson<any>(BASE_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body
  });
};

export const getChoiceText = (resp: any): string => resp?.choices?.[0]?.message?.content || '';

