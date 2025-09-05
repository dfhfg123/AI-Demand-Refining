import { writable } from 'svelte/store';
import { invokeSiliconFlowWithProgress, type ChatMessage, type ProgressCallback } from './api';
import { get } from 'svelte/store';
import { apiKeyStore } from '../stores/api';

// AI请求状态接口
export interface AIRequestState {
  loading: boolean;
  progress: number;
  status: string;
  result: string;
  error: string | null;
}

// 创建AI请求状态store
export const createAIService = () => {
  const initialState: AIRequestState = {
    loading: false,
    progress: 0,
    status: '',
    result: '',
    error: null
  };

  const { subscribe, set, update } = writable(initialState);

  // 进度回调函数
  const onProgress: ProgressCallback = (progress: number, status: string) => {
    update(state => ({ ...state, progress, status }));
  };

  // 发起AI请求
  const invoke = async (messages: ChatMessage[], model?: string): Promise<void> => {
    const apiKey = get(apiKeyStore);
    if (!apiKey) {
      update(state => ({ ...state, error: '请先配置API Key' }));
      return;
    }

    // 重置状态
    set({ loading: true, progress: 0, status: '', result: '', error: null });

    try {
      const result = await invokeSiliconFlowWithProgress(
        apiKey,
        messages,
        onProgress,
        model
      );
      
      update(state => ({ 
        ...state, 
        loading: false, 
        result, 
        progress: 100, 
        status: '完成' 
      }));
    } catch (error) {
      console.error('AI service error:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      update(state => ({ 
        ...state, 
        loading: false, 
        error: `生成失败：${errorMessage}\n\n请检查：\n1. API Key是否正确\n2. 网络连接是否正常\n3. 输入内容是否过长`,
        progress: 0,
        status: ''
      }));
    }
  };

  // 重置状态
  const reset = () => {
    set(initialState);
  };

  return {
    subscribe,
    invoke,
    reset
  };
};

// 快捷函数：发送单个用户消息
export const invokeWithPrompt = async (
  prompt: string, 
  aiService: ReturnType<typeof createAIService>
): Promise<void> => {
  const messages: ChatMessage[] = [{ role: 'user', content: prompt }];
  return aiService.invoke(messages);
};