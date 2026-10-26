/**
 * Lightweight key-value storage. Uses AsyncStorage when installed,
 * otherwise falls back to in-memory so the app remains runnable.
 */

type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const memory = new Map<string, string>();

const memoryStorage: StorageLike = {
  getItem: async (key) => memory.get(key) ?? null,
  setItem: async (key, value) => {
    memory.set(key, value);
  },
  removeItem: async (key) => {
    memory.delete(key);
  },
};

let impl: StorageLike = memoryStorage;
let resolved = false;

async function resolveStorage(): Promise<StorageLike> {
  if (resolved) return impl;
  try {
    // Optional dependency — installed via expo install when network allows.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('@react-native-async-storage/async-storage');
    const AsyncStorage = mod.default ?? mod;
    if (AsyncStorage?.getItem) {
      impl = AsyncStorage;
    }
  } catch {
    impl = memoryStorage;
  }
  resolved = true;
  return impl;
}

export async function kvGet(key: string): Promise<string | null> {
  const s = await resolveStorage();
  return s.getItem(key);
}

export async function kvSet(key: string, value: string): Promise<void> {
  const s = await resolveStorage();
  await s.setItem(key, value);
}

export async function kvRemove(key: string): Promise<void> {
  const s = await resolveStorage();
  await s.removeItem(key);
}
