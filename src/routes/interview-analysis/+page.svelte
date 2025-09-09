<script lang="ts">
  import ApiKeyPanel from '$lib/components/ApiKeyPanel.svelte';
  import ResultView from '$lib/components/ResultView.svelte';
  import ModelSelect from '$lib/components/ModelSelect.svelte';
  import AudioUpload from '$lib/components/AudioUpload.svelte';
  import { apiKeyStore } from '$lib/stores/api';
  import { createAIService, invokeWithPrompt } from '$lib/utils/aiService';

  let audioFile: File | null = null;
  let transcribedText = '';
  let isTranscribing = false;
  let transcriptionProgress = 0;
  
  // 使用统一的AI服务
  const aiService = createAIService();
  
  // 响应式获取AI服务状态
  $: ({ loading, progress, status, result, error } = $aiService);
  $: output = result || error || '';

  // 面试表现分析提示词
  const buildInterviewAnalysisPrompt = (transcription: string): string => {
    return [
      '你是一位资深的面试官和职业发展顾问，擅长分析面试表现并提供专业建议。',
      '我会给你一段面试录音的文字转录，请你从以下几个维度进行深入分析：',
      '',
      '## 分析维度',
      '',
      '### 1. 语言表达能力',
      '- 语言流畅度和逻辑性',
      '- 专业术语使用是否准确',
      '- 表达是否清晰简洁',
      '',
      '### 2. 技术能力展现',
      '- 技术问题回答的准确性和深度',
      '- 是否展现了扎实的基础知识',
      '- 解决问题的思路是否清晰',
      '',
      '### 3. 沟通技巧',
      '- 是否能够有效回应面试官的问题',
      '- 互动质量和主动性',
      '- 是否展现了良好的职业素养',
      '',
      '### 4. 整体印象',
      '- 自信程度和专业形象',
      '- 对职位的理解和匹配度',
      '- 发展潜力评估',
      '',
      '## 输出要求',
      '',
      '请按照以上维度逐一分析，每个维度给出：',
      '1. 具体表现描述',
      '2. 优点和亮点',
      '3. 需要改进的地方',
      '4. 具体改进建议',
      '',
      '最后给出：',
      '- 总体评分（1-10分）',
      '- 核心优势总结',
      '- 关键改进建议',
      '- 后续面试准备重点',
      '',
      '以下是面试录音转录文本：',
      '',
      transcription
    ].join('\n');
  };

  // 处理音频上传
  const handleAudioUpload = (file: File) => {
    audioFile = file;
    transcribedText = '';
    aiService.reset();
  };

  // 开始转录
  const startTranscription = async () => {
    if (!audioFile) return;
    
    // 检查API Key
    const apiKey = $apiKeyStore;
    if (!apiKey) {
      alert('请先配置API Key');
      return;
    }
    
    isTranscribing = true;
    transcriptionProgress = 0;
    
    try {
      console.log('开始转录，音频文件信息:', {
        size: audioFile.size,
        type: audioFile.type,
        name: audioFile.name,
        lastModified: audioFile.lastModified
      });
      
      transcriptionProgress = 10;
      
      // 准备FormData
      const formData = new FormData();
      formData.append('model', 'FunAudioLLM/SenseVoiceSmall');
      formData.append('file', audioFile);
      
      transcriptionProgress = 30;
      
      // 调用SiliconFlow语音转文本API
      const response = await fetch('https://api.siliconflow.cn/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      });
      
      transcriptionProgress = 70;
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API请求失败 (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      console.log('转录结果:', data);
      
      transcriptionProgress = 90;
      
      // 提取转录文本
      transcribedText = data.text || '';
      
      transcriptionProgress = 100;
      
      console.log('最终转录文本:', transcribedText);
      
      if (!transcribedText.trim()) {
        alert(`未能识别到语音内容。\n音频信息：\n- 文件大小: ${(audioFile.size / 1024 / 1024).toFixed(2)} MB\n- 文件类型: ${audioFile.type}\n- 文件名: ${audioFile.name}\n\n请尝试：\n• 使用WAV或MP3格式\n• 确保音频清晰且音量适中\n• 检查音频时长不要太短`);
      }
      
    } catch (error) {
      console.error('转录失败:', error);
      let errorMessage = '转录失败，请检查：\n';
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes('401') || errorMsg.includes('403')) {
        errorMessage += '• API Key是否正确\n• API Key是否有效';
      } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
        errorMessage += '• 网络连接是否正常\n• 是否能访问SiliconFlow API';
      } else if (errorMsg.includes('format') || errorMsg.includes('file')) {
        errorMessage += '• 音频文件格式是否正确\n• 建议使用 MP3 或 WAV 格式';
      } else {
        errorMessage += `• 具体错误: ${errorMsg}`;
      }
      alert(errorMessage);
    } finally {
      isTranscribing = false;
    }
  };

  // 开始AI分析
  const startAnalysis = async () => {
    if (!transcribedText.trim()) {
      alert('请先上传音频并完成转录');
      return;
    }
    
    const prompt = buildInterviewAnalysisPrompt(transcribedText);
    await invokeWithPrompt(prompt, aiService);
  };
</script>

<svelte:head>
  <title>面试表现分析 - Prompt Hub</title>
</svelte:head>

<div class="max-w-7xl mx-auto py-6">
  <!-- 页面标题 -->
  <div class="text-center mb-8">
    <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-strong mb-4">
      <span class="text-white text-2xl">🎤</span>
    </div>
    <h1 class="text-3xl font-bold text-neutral-800 mb-2">面试表现分析</h1>
    <p class="text-neutral-600 max-w-2xl mx-auto">
      上传面试录音，将为你提供专业的表现分析和改进建议
    </p>
  </div>

  <!-- API Key 配置和控制按钮 -->
  <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20 mb-6">
    <h3 class="text-lg font-semibold text-neutral-800 flex items-center mb-4">
      <span class="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
      配置与控制
    </h3>
    
    <!-- 第一行：API Key -->
    <div class="mb-4">
      <ApiKeyPanel inline={true} />
    </div>
    
    <!-- 第二行：模型选择、转录按钮、分析按钮 -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
      <!-- 模型选择 -->
      <div class="flex-1 sm:max-w-xs">
        <ModelSelect inline={true} />
      </div>
      
      <!-- 转录按钮 -->
      <div class="flex-shrink-0">
        <button 
          on:click={startTranscription}
          disabled={!audioFile || isTranscribing}
          class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
        >
          {#if isTranscribing}
            转录中... ({transcriptionProgress}%)
          {:else}
            开始转录
          {/if}
        </button>
      </div>
      
      <!-- 分析按钮 -->
      <div class="flex-shrink-0">
        <button 
          on:click={startAnalysis}
          disabled={!transcribedText.trim() || loading}
          class="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
        >
          {#if loading}
            分析中... ({progress}%)
          {:else}
            开始分析
          {/if}
        </button>
      </div>
    </div>
    
    <!-- 进度条 -->
    {#if isTranscribing}
      <div class="mt-4">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: {transcriptionProgress}%"></div>
        </div>
      </div>
    {/if}
    
    {#if loading && status}
      <div class="mt-4 text-sm text-blue-600">
        {status}
      </div>
    {/if}
  </div>

  <!-- 主要内容区域 -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- 左侧：音频上传和转录 -->
    <div class="space-y-6">
                  {#if transcribedText}
        <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20">
          <h3 class="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
            <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            🔄 转录结果
          </h3>
          <textarea 
            bind:value={transcribedText}
            class="w-full h-40 p-3 border border-neutral-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="转录的文本将显示在这里..."
          ></textarea>
        </div>
      {/if}
      <!-- 音频上传 -->
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20">
        <h3 class="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
          <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
          📁 上传音频文件
        </h3>
        <AudioUpload onUpload={handleAudioUpload} />
        
        {#if audioFile}
          <div class="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p class="text-green-700 text-sm">
              ✅ 已选择文件: {audioFile.name}
            </p>
          </div>
        {/if}
      </div>

      <!-- 转录结果 -->

    </div>

    <!-- 右侧：分析结果 -->
    <div>
      <ResultView text={output} />
    </div>
  </div>
</div>