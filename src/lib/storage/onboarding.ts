import { kvGet, kvSet } from '@/lib/storage/kv';

const KEYS = {
  onboardingComplete: 'carebase.onboardingComplete',
  locationPromptSeen: 'carebase.locationPromptSeen',
  notificationPromptSeen: 'carebase.notificationPromptSeen',
} as const;

async function getFlag(key: string): Promise<boolean> {
  try {
    return (await kvGet(key)) === 'true';
  } catch {
    return false;
  }
}

async function setFlag(key: string, value: boolean): Promise<void> {
  await kvSet(key, value ? 'true' : 'false');
}

export const getOnboardingComplete = () => getFlag(KEYS.onboardingComplete);
export const setOnboardingComplete = (value = true) => setFlag(KEYS.onboardingComplete, value);
export const getLocationPromptSeen = () => getFlag(KEYS.locationPromptSeen);
export const setLocationPromptSeen = (value = true) => setFlag(KEYS.locationPromptSeen, value);
export const getNotificationPromptSeen = () => getFlag(KEYS.notificationPromptSeen);
export const setNotificationPromptSeen = (value = true) =>
  setFlag(KEYS.notificationPromptSeen, value);
