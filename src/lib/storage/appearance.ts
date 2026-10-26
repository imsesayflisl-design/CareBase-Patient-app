import { useSyncExternalStore } from 'react';

import { kvGet, kvSet } from '@/lib/storage/kv';

export type AppearancePreference = 'light' | 'dark' | 'system';

const KEY = 'carebase.appearance';

type Listener = () => void;

let preference: AppearancePreference = 'system';
let hydrated = false;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

async function hydrate() {
  if (hydrated) return;
  try {
    const stored = await kvGet(KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      preference = stored;
    }
  } catch {
    // Keep default.
  } finally {
    hydrated = true;
    emit();
  }
}

hydrate();

export const appearanceStore = {
  get: () => preference,
  set: async (next: AppearancePreference) => {
    preference = next;
    emit();
    try {
      await kvSet(KEY, next);
    } catch {
      // Ignore persistence failures.
    }
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useAppearanceStore<T>(selector: (s: { preference: AppearancePreference }) => T): T {
  return useSyncExternalStore(
    appearanceStore.subscribe,
    () => selector({ preference: appearanceStore.get() }),
    () => selector({ preference: 'system' }),
  );
}
