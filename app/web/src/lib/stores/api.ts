import { writable } from 'svelte/store';
import { load, save } from '$lib/utils/storage';

// 可选模型列表
export const availableModels = [
  { id: 'moonshotai/Kimi-K2-Instruct', name: 'moonshotai/Kimi-K2-Instruct' },
  { id: 'deepseek-ai/DeepSeek-V3.1', name: 'deepseek-ai/DeepSeek-V3.1' },
  { id: 'Pro/deepseek-ai/DeepSeek-V3.2-Exp', name: 'Pro/deepseek-ai/DeepSeek-V3.2-Exp' },
  { id: 'deepseek-ai/DeepSeek-V3.1-Terminus', name: 'deepseek-ai/DeepSeek-V3.1-Terminus' },
  { id: 'deepseek-ai/DeepSeek-V3.2-Exp', name: 'deepseek-ai/DeepSeek-V3.2-Exp' },
  { id: 'inclusionAI/Ring-1T', name: 'inclusionAI/Ring-1T' },
  { id: 'zai-org/GLM-4.5V', name: 'zai-org/GLM-4.5V' },
  { id: 'zai-org/GLM-4.6', name: 'zai-org/GLM-4.6' },
  { id: 'ByteDance-Seed/Seed-OSS-36B-Instruct', name: 'ByteDance-Seed/Seed-OSS-36B-Instruct' },

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
export const requirementEvaluationStore = writable({
  requirement: '',
  experience: '1-3年',
  workHours: '8-9小时',
  slackTime: '1小时'
});

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


