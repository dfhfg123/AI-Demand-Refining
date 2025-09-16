const KEY = 'ai-req-summarizer';

export type PersistUserData = {
  apiKey?: string;
  selectedModel?: string;
  mode?: 'frontend' | 'api' | 'ui';
  input?: string;
  output?: string;
};

export const save = (data: PersistUserData) => {
  try {
    const prev = load();
    const merged = { ...(prev || {}), ...(data || {}) };
    localStorage.setItem(KEY, JSON.stringify(merged));
  } catch (_) {}
};

export const load = (): PersistUserData | undefined => {
  try {
    const raw = localStorage.getItem(KEY) || '';
    return raw ? (JSON.parse(raw) as PersistUserData) : undefined;
  } catch (_) {
    return undefined;
  }
};

export const clear = () => {
  try { localStorage.removeItem(KEY); } catch (_) {}
};

