<script lang="ts">
  export let onUpload: (file: File) => void;
  
  let fileInput: HTMLInputElement;
  let isDragOver = false;
  
  // 支持的音频格式
  const supportedFormats = ['.mp3', '.wav', '.m4a', '.ogg', '.webm'];
  
  const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && isValidAudioFile(file)) {
      onUpload(file);
    } else if (file) {
      alert('请选择有效的音频文件格式：' + supportedFormats.join(', '));
    }
  };
  
  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    isDragOver = false;
    
    const file = event.dataTransfer?.files[0];
    if (file && isValidAudioFile(file)) {
      onUpload(file);
    } else if (file) {
      alert('请选择有效的音频文件格式：' + supportedFormats.join(', '));
    }
  };
  
  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    isDragOver = true;
  };
  
  const handleDragLeave = () => {
    isDragOver = false;
  };
  
  const isValidAudioFile = (file: File): boolean => {
    return file.type.startsWith('audio/') || 
           supportedFormats.some(format => file.name.toLowerCase().endsWith(format));
  };
  
  const triggerFileSelect = () => {
    fileInput.click();
  };
</script>

<div 
  class="border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200"
  class:border-blue-400={isDragOver}
  class:bg-blue-50={isDragOver}
  class:border-neutral-300={!isDragOver}
  on:drop={handleDrop}
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  role="button"
  tabindex="0"
  on:click={triggerFileSelect}
  on:keydown={(e) => e.key === 'Enter' && triggerFileSelect()}
>
  <input 
    bind:this={fileInput}
    type="file" 
    accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm"
    on:change={handleFileSelect}
    class="hidden"
  />
  
  <div class="space-y-4">
    <div class="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
      <span class="text-white text-2xl">🎵</span>
    </div>
    
    <div>
      <p class="text-lg font-medium text-neutral-700 mb-2">
        拖拽音频文件到这里，或点击选择
      </p>
      <p class="text-sm text-neutral-500">
        支持格式：{supportedFormats.join(', ')}
      </p>
    </div>
    
    <button 
      type="button"
      class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      📁 选择文件
    </button>
  </div>
</div>