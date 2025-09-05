export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

import { httpJson } from './http';

const BASE_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const DEFAULT_MODEL = 'zai-org/GLM-4.5V';

type CreateChatBody = { model: string; messages: ChatMessage[] };

export const invokeSiliconFlow = (apiKey: string, messages: ChatMessage[], model = DEFAULT_MODEL): Promise<any> => {
  const body: CreateChatBody = { model, messages };
  return httpJson<any>(BASE_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body
  });
};

export const getChoiceText = (resp: any): string => resp?.choices?.[0]?.message?.content || '';

