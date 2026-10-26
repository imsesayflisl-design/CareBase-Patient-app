import type { FeatureFlags, IntegrationStatus } from '@/types';

export const APP_NAME = 'CareBase';
export const APP_TAGLINE = 'Better Health. Closer to You.';

/** Backend API base URL — set EXPO_PUBLIC_API_URL when the CareBase API is deployed. */
export const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

export const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

export const MAPS_PROVIDER = process.env.EXPO_PUBLIC_MAPS_PROVIDER ?? 'none';

function status(ready: boolean, needsConfigFallback = true): IntegrationStatus {
  if (ready) return 'ready';
  return needsConfigFallback ? 'needs_config' : 'unavailable';
}

export function getFeatureFlags(): FeatureFlags {
  return {
    clerk: status(Boolean(CLERK_PUBLISHABLE_KEY)),
    backend: status(Boolean(API_URL)),
    maps: status(MAPS_PROVIDER !== 'none'),
    payments: 'needs_config',
    pushNotifications: 'needs_config',
    emergencyNumbers: 'needs_config',
  };
}

export const isClerkConfigured = () => Boolean(CLERK_PUBLISHABLE_KEY);
export const isBackendConfigured = () => Boolean(API_URL);
