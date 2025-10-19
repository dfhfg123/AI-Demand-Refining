import { writable } from 'svelte/store';
import { load, save } from '$lib/utils/storage';

// 从环境变量读取默认配置（如果没有配置则使用备用值）
export const DEFAULT_API_KEY = import.meta.env.VITE_DEFAULT_API_KEY || 'sk-meqzvmrcmgxjhxebksqgplqhtknrszbzvevqtomdmviudafv';
export const DEFAULT_MODEL = import.meta.env.VITE_DEFAULT_MODEL || 'THUDM/GLM-Z1-9B-0414';

// 遮蔽 API Key 显示（用于 UI 展示）
export function maskApiKey(apiKey: string): string {
  if (!apiKey) return '';
  if (apiKey.length <= 8) return '****';
  return `${apiKey.substring(0, 7)}${'*'.repeat(Math.max(20, apiKey.length - 14))}${apiKey.substring(apiKey.length - 7)}`;
}

// 检查是否是默认 API Key
export function isDefaultApiKey(apiKey: string): boolean {
  return apiKey === DEFAULT_API_KEY;
}

// 可选模型列表
export const availableModels = [
  { id: 'THUDM/GLM-Z1-9B-0414', name: 'THUDM/GLM-Z1-9B-0414' },
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

// 如果用户没有设置自定义的 API Key，使用默认的
export const apiKeyStore = writable<string>(persisted?.apiKey || DEFAULT_API_KEY);

// 如果使用默认 API Key，强制使用默认模型；否则使用保存的模型
const initialModel = persisted?.apiKey ? (persisted?.selectedModel || DEFAULT_MODEL) : DEFAULT_MODEL;
export const selectedModelStore = writable<string>(initialModel);

// 判断是否在使用默认配置
export const isUsingDefaultConfig = writable<boolean>(!persisted?.apiKey);
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

// 订阅状态变化，自动保存到本地存储
apiKeyStore.subscribe((apiKey) => {
  const current = load();
  // 只有当用户设置了自定义 API Key 时才保存
  if (apiKey && apiKey !== DEFAULT_API_KEY) {
    save({ ...current, apiKey });
    isUsingDefaultConfig.set(false);
  } else if (apiKey === DEFAULT_API_KEY) {
    // 如果使用默认 API Key，强制使用默认模型
    isUsingDefaultConfig.set(true);
    selectedModelStore.set(DEFAULT_MODEL);
    // 清除存储的自定义 API Key
    const stored = load();
    if (stored?.apiKey) {
      save({ ...stored, apiKey: undefined });
    }
  }
});

selectedModelStore.subscribe((selectedModel) => {
  // 只有当模型真正改变且不是使用默认配置时才保存
  if (selectedModel && selectedModel !== '') {
    const current = load();
    const currentApiKey = apiKeyStore;
    // 只有在使用自定义 API Key 时才保存模型选择
    if (currentApiKey && typeof currentApiKey === 'object' && 'subscribe' in currentApiKey) {
      // 这是一个 store，我们需要获取其值
      let apiKeyValue = DEFAULT_API_KEY;
      const unsubscribe = currentApiKey.subscribe(value => { apiKeyValue = value; });
      unsubscribe();
      
      if (apiKeyValue !== DEFAULT_API_KEY) {
        save({ ...current, selectedModel });
      }
    }
  }
});


