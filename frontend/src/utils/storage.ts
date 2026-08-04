/**
 * Tiny localStorage helpers used by the demo persistence layer.
 * Everything is wrapped in try/catch so the app keeps working in
 * private-mode browsers or SSR-less environments without storage.
 */
export const readStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const writeStorage = (key: string, value: unknown): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable - demo data is not critical */
  }
};

export const clearStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* noop */
  }
};

/** Collision-safe id generator for entities created at runtime. */
export const createId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** 'YYYY-MM-DD HH:mm:ss' timestamp, matching the seeded audit log format. */
export const timestampNow = (): string => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}:${pad(d.getSeconds())}`;
};

/** 'YYYY-MM-DD' date, used for joinedAt fields. */
export const dateNow = (): string => timestampNow().split(' ')[0];
