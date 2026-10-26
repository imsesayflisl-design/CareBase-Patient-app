import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { CareBaseLogo } from '@/components/brand/carebase-logo';
import { Brand } from '@/constants/theme';
import { isClerkConfigured } from '@/lib/config';
import {
  getLocationPromptSeen,
  getNotificationPromptSeen,
  getOnboardingComplete,
} from '@/lib/storage/onboarding';
import { useAuthSession } from '@/lib/auth/session';

export default function SplashGate() {
  const { isLoaded, isSignedIn, profileComplete } = useAuthSession();
  const [ready, setReady] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [locationSeen, setLocationSeen] = useState(false);
  const [notificationSeen, setNotificationSeen] = useState(false);
  const [minTimeDone, setMinTimeDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeDone(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [ob, loc, notif] = await Promise.all([
        getOnboardingComplete(),
        getLocationPromptSeen(),
        getNotificationPromptSeen(),
      ]);
      if (!mounted) return;
      setOnboardingComplete(ob);
      setLocationSeen(loc);
      setNotificationSeen(notif);
      setReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!ready || !minTimeDone || !isLoaded) {
    return (
      <View style={styles.splash}>
        <CareBaseLogo size="lg" tagline />
        <ActivityIndicator color={Brand.primary} style={styles.spinner} />
      </View>
    );
  }

  if (!onboardingComplete) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  if (isClerkConfigured() && isSignedIn) {
    if (!profileComplete) {
      return <Redirect href="/(auth)/complete-profile" />;
    }
    if (!locationSeen) {
      return <Redirect href="/(onboarding)/location" />;
    }
    if (!notificationSeen) {
      return <Redirect href="/(onboarding)/notifications" />;
    }
    return <Redirect href="/(tabs)" />;
  }

  if (isClerkConfigured() && !isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // Clerk not configured yet — allow browsing the shell after onboarding.
  if (!locationSeen) {
    return <Redirect href="/(onboarding)/location" />;
  }
  if (!notificationSeen) {
    return <Redirect href="/(onboarding)/notifications" />;
  }
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.softBackground,
    gap: 24,
  },
  spinner: { marginTop: 12 },
});
