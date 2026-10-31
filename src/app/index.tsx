import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

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
        <View style={styles.ambientGlowOne} />
        <View style={styles.ambientGlowTwo} />

        <View style={styles.statusBar}>
          <Text style={styles.time}>9:41</Text>
          <View style={styles.statusIcons}>
            <View style={styles.signal}>
              <View style={styles.signalDot} />
              <View style={styles.signalDot} />
              <View style={styles.signalDot} />
            </View>
            <View style={styles.wifi}>
              <View style={styles.wifiArc} />
              <View style={styles.wifiArcShort} />
            </View>
            <View style={styles.battery}>
              <View style={styles.batteryBody} />
              <View style={styles.batteryCap} />
            </View>
          </View>
        </View>

        <View style={styles.logoWrap}>
          <View style={styles.logoHalo} />
          <Image source={require('../../logo_shield.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.homeIndicator} />

        <ActivityIndicator color={Brand.primary} size="small" style={styles.spinner} />
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
    backgroundColor: '#071C1A',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingTop: 16,
  },
  ambientGlowOne: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: 'rgba(20, 184, 166, 0.16)',
    top: -120,
    left: -80,
  },
  ambientGlowTwo: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: 'rgba(28, 100, 94, 0.18)',
    bottom: -120,
    right: -60,
  },
  statusBar: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height: 32,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 17,
    fontWeight: '700',
    color: '#EEF9F6',
    letterSpacing: -0.3,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signal: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 14,
  },
  signalDot: {
    width: 3,
    borderRadius: 2,
    backgroundColor: '#EEF9F6',
  },
  wifi: {
    width: 18,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wifiArc: {
    width: 12,
    height: 8,
    borderWidth: 2,
    borderTopColor: '#EEF9F6',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRadius: 10,
    transform: [{ rotate: '180deg' }],
  },
  wifiArcShort: {
    position: 'absolute',
    width: 5,
    height: 3,
    borderWidth: 2,
    borderTopColor: '#EEF9F6',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRadius: 10,
    transform: [{ rotate: '180deg' }],
  },
  battery: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  batteryBody: {
    width: 22,
    height: 12,
    borderWidth: 2,
    borderColor: '#EEF9F6',
    borderRadius: 3,
  },
  batteryCap: {
    width: 2,
    height: 6,
    backgroundColor: '#EEF9F6',
    borderRadius: 1,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 30,
  },
  logoHalo: {
    position: 'absolute',
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: 'rgba(17, 195, 156, 0.12)',
    shadowColor: '#69F0D2',
    shadowOpacity: 0.35,
    shadowRadius: 34,
    shadowOffset: { width: 0, height: 0 },
  },
  logo: {
    width: 210,
    height: 210,
    shadowColor: '#7DE9CD',
    shadowOpacity: 0.4,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 16,
    width: 134,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#EEF9F6',
    opacity: 0.9,
  },
  spinner: {
    position: 'absolute',
    bottom: 40,
    opacity: 0,
  },
});
