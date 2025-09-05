export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

import { httpJson } from './http';

const BASE_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const DEFAULT_MODEL = 'Qwen/QwQ-32B';

type CreateChatBody = { 
  model: string; 
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
};

// 进度回调函数类型
export type ProgressCallback = (progress: number, status: string) => void;

// 统一的AI调用服务，支持模拟进度
export const invokeSiliconFlowWithProgress = async (
  apiKey: string, 
  messages: ChatMessage[], 
  onProgress: ProgressCallback,
  model = DEFAULT_MODEL
): Promise<string> => {
  const body: CreateChatBody = { 
    model, 
    messages,
    temperature: 0.7,
    max_tokens: 2000
  };

  // 开始模拟进度
  let progress = 0;
  let progressInterval: any;
  let isCompleted = false;

  const simulateProgress = () => {
    progressInterval = setInterval(() => {
      if (!isCompleted && progress < 85) {
        // 随机增长，越接近85%增长越慢
        const increment = Math.random() * (90 - progress) * 0.1;
        progress = Math.min(progress + increment, 85);
        onProgress(Math.round(progress), '正在生成中...');
      }
    }, 300 + Math.random() * 400); // 300-700ms随机间隔
  };

  try {
    // 初始状态
    onProgress(0, '正在连接AI服务...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onProgress(10, '正在处理请求...');
    simulateProgress();

    // 发起实际请求
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

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';
    
    // 完成处理
    isCompleted = true;
    clearInterval(progressInterval);
    
    // 快速完成进度
    onProgress(95, '正在整理结果...');
    await new Promise(resolve => setTimeout(resolve, 500));
    onProgress(100, '生成完成');
    
    return content;
    
  } catch (error) {
    // 错误处理
    isCompleted = true;
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    throw error;
  }
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

