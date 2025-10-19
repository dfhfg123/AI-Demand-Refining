// 简单的字符串混淆工具，用于在前端代码中对敏感信息进行基本混淆
// 注意：这不是真正的加密，只是让API Key不那么明显

/**
 * 对字符串进行Base64编码并添加额外的混淆
 */
function encode(str: string): string {
  // 将字符串分成多个部分
  const parts = str.split('.');
  if (parts.length !== 2) return btoa(str);
  
  // 对每部分进行Base64编码
  const encoded = parts.map(p => btoa(p));
  return encoded.join(':');
}

/**
 * 解码混淆后的字符串
 */
function decode(encoded: string): string {
  try {
    const parts = encoded.split(':');
    if (parts.length !== 2) return atob(encoded);
    
    // 解码每个部分
    const decoded = parts.map(p => atob(p));
    return decoded.join('.');
  } catch {
    return '';
  }
}

// 预先混淆的API Key
// 原始: cbc27eeaa33c49fc853247297c857baf.o8O2Bn87da8cJeTt
const ENCODED_API_KEY = 'Y2JjMjdlZWFhMzNjNDlmYzg1MzI0NzI5N2M4NTdiYWY=:bzhPMkJuODdkYThjSmVUdA==';

/**
 * 获取解密后的API Key
 */
export function getApiKey(): string {
  return decode(ENCODED_API_KEY);
}

/**
 * 用于在开发时生成混淆后的字符串（不会在生产代码中使用）
 */
export function encodeString(str: string): string {
  return encode(str);
}



