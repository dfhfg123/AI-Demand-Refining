export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

const BASE_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const DEFAULT_MODEL = 'zai-org/GLM-4.5V';

type CreateChatBody = {
  model: string;
  messages: ChatMessage[];
};

export const invokeSiliconFlow = async (apiKey: string, messages: ChatMessage[], model = DEFAULT_MODEL): Promise<any> => {
  const body: CreateChatBody = { model, messages };
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) return Promise.reject(new Error(`HTTP ${res.status}`));
  return res.json();
};

export const getChoiceText = (resp: any): string => resp?.choices?.[0]?.message?.content || '';

