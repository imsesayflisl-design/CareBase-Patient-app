import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { LocalAuthProvider } from '@/lib/auth/session';
import { ClerkRoot } from '@/lib/clerk/clerk-root';
import { useTheme } from '@/hooks/use-theme';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function RootNavigator() {
  const { colors, isDark } = useTheme();

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="search/index" options={{ title: 'Search' }} />
        <Stack.Screen name="emergency/index" options={{ title: 'Emergency', headerTintColor: colors.emergency }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ClerkRoot>
      <LocalAuthProvider>
        <RootNavigator />
      </LocalAuthProvider>
    </ClerkRoot>
  );
}
