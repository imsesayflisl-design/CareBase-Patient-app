import { useMemo, useState, type ReactNode } from 'react';

import { useAuth, useUser } from '@clerk/expo';

import { AuthSessionContext } from '@/lib/auth/session';
import type { AuthSession } from '@/lib/auth/session';

export function ClerkAuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [profileComplete, setProfileComplete] = useState(false);

  const value = useMemo<AuthSession>(
    () => ({
      isLoaded,
      isSignedIn: Boolean(isSignedIn),
      profileComplete,
      userId: user?.id ?? null,
      email: user?.primaryEmailAddress?.emailAddress ?? null,
      firstName: user?.firstName ?? null,
      getToken: async () => {
        try {
          return (await getToken()) ?? null;
        } catch {
          return null;
        }
      },
      setProfileComplete,
      setDemoSignedIn: () => undefined,
    }),
    [isLoaded, isSignedIn, user, profileComplete, getToken],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}