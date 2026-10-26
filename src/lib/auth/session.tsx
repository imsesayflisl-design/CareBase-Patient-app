import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { isClerkConfigured } from '@/lib/config';

type AuthSession = {
  isLoaded: boolean;
  isSignedIn: boolean;
  profileComplete: boolean;
  userId: string | null;
  email: string | null;
  firstName: string | null;
  getToken: () => Promise<string | null>;
  setProfileComplete: (value: boolean) => void;
  setDemoSignedIn: (value: boolean) => void;
};

const AuthSessionContext = createContext<AuthSession | null>(null);

/**
 * Auth session bridge.
 * When Clerk is configured, providers wrap with real Clerk hooks in root layout.
 * When not configured, a local demo session keeps navigation and forms workable.
 */
export function LocalAuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  const value = useMemo<AuthSession>(
    () => ({
      isLoaded: true,
      isSignedIn,
      profileComplete,
      userId: isSignedIn ? 'local-dev-user' : null,
      email: isSignedIn ? 'patient@example.com' : null,
      firstName: isSignedIn ? 'Patient' : null,
      getToken: async () => (isSignedIn ? 'local-dev-token' : null),
      setProfileComplete,
      setDemoSignedIn: setIsSignedIn,
    }),
    [isSignedIn, profileComplete],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession(): AuthSession {
  const ctx = useContext(AuthSessionContext);
  if (!ctx) {
    return {
      isLoaded: true,
      isSignedIn: false,
      profileComplete: false,
      userId: null,
      email: null,
      firstName: null,
      getToken: async () => null,
      setProfileComplete: () => undefined,
      setDemoSignedIn: () => undefined,
    };
  }
  return ctx;
}

export function AuthGateNote() {
  return isClerkConfigured()
    ? null
    : 'Clerk is not configured. Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to enable real authentication.';
}
