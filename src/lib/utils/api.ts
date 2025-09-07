export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

import { httpJson } from './http';

const BASE_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const DEFAULT_MODEL = 'zai-org/GLM-4.5V';

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
    temperature: 0.3,
    max_tokens: 39999
  };

  // 开始模拟进度
  let progress = 0;
  let progressInterval: any;
  let isCompleted = false;
  
  // 生成随机的进度阶段参数
  const randomParams = {
    phase1Speed: 0.8 + Math.random() * 0.4, // 0.8-1.2倍速
    phase2Speed: 0.6 + Math.random() * 0.8, // 0.6-1.4倍速
    phase3Speed: 0.4 + Math.random() * 0.6, // 0.4-1.0倍速
    fluctuation: 0.3 + Math.random() * 0.4, // 0.3-0.7的波动幅度
    intervalBase: 200 + Math.random() * 300 // 200-500ms基础间隔
  };

  const simulateProgress = () => {
    progressInterval = setInterval(() => {
      if (isCompleted) return;
      
      let increment = 0;
      let currentInterval = randomParams.intervalBase;
      
      // 根据当前进度阶段调整增长速度
      if (progress < 30) {
        // 第一阶段：0-30%，中等速度启动
        increment = (1.5 + Math.random() * 1.5) * randomParams.phase1Speed;
        currentInterval *= 1.2;
      } else if (progress < 60) {
        // 第二阶段：30-60%，较快速度
        increment = (2 + Math.random() * 2) * randomParams.phase2Speed;
        currentInterval *= 1.0;
      } else if (progress < 85) {
        // 第三阶段：60-85%，逐渐放缓
        const slowDownFactor = 1 - (progress - 60) / 50; // 从1逐渐减少到0.5
        increment = (1 + Math.random() * 1.5) * randomParams.phase3Speed * slowDownFactor;
        currentInterval *= 1.3;
      } else if (progress < 95) {
        // 第四阶段：85-95%，继续缓慢增长但不停止
        increment = (0.3 + Math.random() * 0.7) * 0.8;
        currentInterval *= 1.8;
      } else {
        // 95%以上，极小幅度增长，等待完成
        increment = Math.random() * 0.3;
        currentInterval *= 2.5;
      }
      
      // 添加随机波动
      const fluctuation = (Math.random() - 0.5) * randomParams.fluctuation;
      increment = Math.max(0.1, increment + fluctuation);
      
      // 更新进度，确保不超过目标值
      const targetProgress = isCompleted ? 100 : (progress < 95 ? 99 : 99.5);
      progress = Math.min(progress + increment, targetProgress);
      
      // 根据进度更新状态文字
      let status = '正在生成中...';
      if (progress < 20) {
        status = '正在分析输入...';
      } else if (progress < 40) {
        status = '正在构建响应...';
      } else if (progress < 70) {
        status = '正在生成内容...';
      } else if (progress < 90) {
        status = '正在优化结果...';
      } else {
        status = '即将完成...';
      }
      
      onProgress(Math.round(progress), status);
      
      // 动态调整下次更新间隔
      if (progressInterval) {
        clearInterval(progressInterval);
        setTimeout(() => {
          if (!isCompleted) {
            simulateProgress();
          }
        }, currentInterval);
      }
    }, randomParams.intervalBase);
  };

  try {
    // 初始状态
    onProgress(0, '正在连接AI服务...');
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
    
    onProgress(5 + Math.random() * 5, '正在处理请求...');
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    
    // 开始模拟进度
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
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    
    // 快速完成最后阶段
    const finalSteps = [95, 98, 100];
    const finalMessages = ['正在整理结果...', '正在格式化...', '生成完成'];
    
    for (let i = 0; i < finalSteps.length; i++) {
      onProgress(finalSteps[i], finalMessages[i]);
      if (i < finalSteps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 200));
      }
    }
    
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

