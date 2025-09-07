interface Entry<T> {
  value: T;
  expiry: number;
}

const store = new Map<string, Entry<unknown>>();

export function get<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (entry.expiry < Date.now()) {
    store.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function set<T>(key: string, value: T, ttl = 5_000) {
  store.set(key, { value, expiry: Date.now() + ttl });
}

export function clear() {
  store.clear();
}
