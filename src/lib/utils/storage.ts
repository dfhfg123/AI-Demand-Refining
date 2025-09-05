import type { RoleType } from './prompt';

const KEY = 'ai-req-summarizer';

export type PersistData = {
  apiKey?: string;
  role?: RoleType;
  input?: string;
  output?: string;
};

export const save = (data: PersistData) => {
  try {
    const prev = load();
    const merged = { ...(prev || {}), ...(data || {}) };
    localStorage.setItem(KEY, JSON.stringify(merged));
  } catch (_) {}
};

export const load = (): PersistData | undefined => {
  try {
    const raw = localStorage.getItem(KEY) || '';
    return raw ? (JSON.parse(raw) as PersistData) : undefined;
  } catch (_) {
    return undefined;
  }
};

export const clear = () => {
  try { localStorage.removeItem(KEY); } catch (_) {}
};

