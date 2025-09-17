import { writable } from 'svelte/store';
import { load, save } from '$lib/utils/storage';

// 可选模型列表
export const availableModels = [
  { id: 'zai-org/GLM-4.5V', name: 'zai-org/GLM-4.5V' },
  { id: 'Qwen/Qwen3-235B-A22B-Thinking-2507', name: 'Qwen/Qwen3-235B-A22B-Thinking-2507' },
  { id: 'deepseek-ai/DeepSeek-V3.1', name: 'deepseek-ai/DeepSeek-V3.1' },
  { id: 'ByteDance-Seed/Seed-OSS-36B-Instruct', name: 'ByteDance-Seed/Seed-OSS-36B-Instruct' },
  { id: 'moonshotai/Kimi-K2-Instruct', name: 'moonshotai/Kimi-K2-Instruct' },
  { id: 'MiniMaxAI/MiniMax-M1-80k', name: 'MiniMaxAI/MiniMax-M1-80k' }
];

const persisted = load();
const defaultModel = 'moonshotai/Kimi-K2-Instruct';

export const apiKeyStore = writable<string>(persisted?.apiKey || '');
export const selectedModelStore = writable<string>(persisted?.selectedModel || defaultModel);
export const interviewInputStore = writable('');
export const summarizerInputStore = writable('');
export const prdFormStore = writable({
  productDescription: '',
  productType: [],
  customProductType: '',
  targetUser: [],
  customTargetUser: '',
  keyFeatures: [],
  customFeatures: '',
  productGoal: [],
  customProductGoal: '',
  techStack: [],
  customTechStack: '',
  businessModel: [],
  customBusinessModel: '',
  competitors: ''
});
export const interviewAnalysisInputStore = writable('');

// 确保默认模型被正确保存
if (!persisted?.selectedModel) {
  save({ selectedModel: defaultModel });
}

// 订阅状态变化，自动保存到本地存储
apiKeyStore.subscribe((apiKey) => {
  const current = load();
  save({ ...current, apiKey });
});

selectedModelStore.subscribe((selectedModel) => {
  // 只有当模型真正改变时才保存，避免初始化时的重复保存
  if (selectedModel && selectedModel !== '') {
    const current = load();
    save({ ...current, selectedModel });
  }
});


