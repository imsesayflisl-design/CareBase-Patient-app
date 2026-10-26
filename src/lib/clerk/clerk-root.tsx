import type { ReactNode } from 'react';

import { CLERK_PUBLISHABLE_KEY, isClerkConfigured } from '@/lib/config';

/**
 * Conditionally mounts ClerkProvider when a publishable key is present.
 * Avoids crashing Expo Go when keys are not yet configured.
 */
export function ClerkRoot({ children }: { children: ReactNode }) {
  if (!isClerkConfigured()) {
    return <>{children}</>;
  }

  try {
    // Lazy require so the app boots without @clerk/expo until installed + configured.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { ClerkProvider } = require('@clerk/expo');
    let tokenCache: unknown;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      tokenCache = require('@clerk/expo/token-cache').tokenCache;
    } catch {
      tokenCache = undefined;
    }

    return (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
        {children}
      </ClerkProvider>
    );
  } catch {
    return <>{children}</>;
  }
}
