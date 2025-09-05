export type ChatMessage = { 
  role: 'user' | 'assistant' | 'system'; 
  content: string; 
};

export type AIProvider = 'siliconflow';

export interface AIServiceConfig {
  apiKey: string;
  model?: string;
  provider?: AIProvider;
}

export interface AIResponse {
  success: boolean;
  content: string;
  error?: string;
}

// SiliconFlow API 配置
const SILICONFLOW_CONFIG = {
  baseUrl: 'https://api.siliconflow.cn/v1/chat/completions',
  defaultModel: 'zai-org/GLM-4.5V'
};

// 核心AI请求服务
export class AIService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = {
      provider: 'siliconflow',
      model: SILICONFLOW_CONFIG.defaultModel,
      ...config
    };
  }

  // 发送AI请求
  async chat(messages: ChatMessage[]): Promise<AIResponse> {
    try {
      if (!this.config.apiKey?.trim()) {
        return { success: false, content: '', error: 'API Key 不能为空' };
      }

      switch (this.config.provider) {
        case 'siliconflow':
          return await this.callSiliconFlow(messages);
        default:
          return { success: false, content: '', error: '不支持的AI提供商' };
      }
    } catch (error) {
      return { 
        success: false, 
        content: '', 
        error: error instanceof Error ? error.message : '请求失败' 
      };
    }
  }

  // SiliconFlow API 调用
  private async callSiliconFlow(messages: ChatMessage[]): Promise<AIResponse> {
    const response = await fetch(SILICONFLOW_CONFIG.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.config.model,
        messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { 
        success: false, 
        content: '', 
        error: `HTTP ${response.status}: ${errorText}` 
      };
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';
    
    return { success: true, content };
  }

  // 更新配置
  updateConfig(newConfig: Partial<AIServiceConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

// 创建AI服务实例的工厂函数
export const createAIService = (config: AIServiceConfig): AIService => {
  return new AIService(config);
};

// 便捷的单次请求函数
export const sendAIRequest = async (
  apiKey: string, 
  prompt: string, 
  options?: { model?: string; provider?: AIProvider }
): Promise<AIResponse> => {
  const service = createAIService({ 
    apiKey, 
    model: options?.model,
    provider: options?.provider 
  });
  
  const messages: ChatMessage[] = [{ role: 'user', content: prompt }];
  return await service.chat(messages);
};