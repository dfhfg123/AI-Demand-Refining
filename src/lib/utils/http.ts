export type HttpOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
};

const withJson = (opts: HttpOptions): RequestInit => ({
  method: opts.method || 'GET',
  headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
  body: opts.body ? JSON.stringify(opts.body) : undefined
});

export const httpJson = async <T>(url: string, opts: HttpOptions = {}): Promise<T> => {
  const res = await fetch(url, withJson(opts));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
};


