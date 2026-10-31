import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';

import { CareBaseLogo } from '@/components/brand/carebase-logo';
import { Screen } from '@/components/ui/screen';
import { Brand, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function LoadingScreen() {
  const { colors } = useTheme();
  const pulse = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;
  const dotA = useRef(new Animated.Value(0)).current;
  const dotB = useRef(new Animated.Value(0)).current;
  const dotC = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    );

    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      })
    );

    const dotSequenceA = Animated.loop(
      Animated.sequence([
        Animated.timing(dotA, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(dotA, { toValue: 0, duration: 420, useNativeDriver: true }),
      ])
    );
    const dotSequenceB = Animated.loop(
      Animated.sequence([
        Animated.timing(dotB, { toValue: 1, duration: 420, delay: 140, useNativeDriver: true }),
        Animated.timing(dotB, { toValue: 0, duration: 420, useNativeDriver: true }),
      ])
    );
    const dotSequenceC = Animated.loop(
      Animated.sequence([
        Animated.timing(dotC, { toValue: 1, duration: 420, delay: 280, useNativeDriver: true }),
        Animated.timing(dotC, { toValue: 0, duration: 420, useNativeDriver: true }),
      ])
    );

    pulseAnimation.start();
    shimmerAnimation.start();
    dotSequenceA.start();
    dotSequenceB.start();
    dotSequenceC.start();

    return () => {
      pulseAnimation.stop();
      shimmerAnimation.stop();
      dotSequenceA.stop();
      dotSequenceB.stop();
      dotSequenceC.stop();
    };
  }, [dotA, dotB, dotC, pulse, shimmer]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });

  const shimmerX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 120],
  });

  return (
    <Screen scroll={false} style={{ backgroundColor: colors.background }}>
      <Stack.Screen options={{ title: 'Loading' }} />

      <View style={styles.shell}>
        <View style={[styles.glow, { backgroundColor: colors.primarySoft }]} />

        <Animated.View
          style={[
            styles.outerRing,
            {
              borderColor: `${Brand.primary}40`,
              transform: [{ scale: pulseScale }],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.innerRing,
            {
              borderColor: `${Brand.primary}24`,
              transform: [{ scale: pulseScale }],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.shimmer,
            {
              backgroundColor: 'rgba(255,255,255,0.96)',
              transform: [{ translateX: shimmerX }],
            },
          ]}
        />

        <View style={styles.logoWrap}>
          <CareBaseLogo size="lg" showWordmark={false} />
        </View>

        <View style={styles.dotCluster}>
          {[dotA, dotB, dotC].map((value, index) => (
            <Animated.View
              key={index}
              style={[
                styles.serviceDot,
                {
                  backgroundColor: index === 0 ? colors.primary : index === 1 ? colors.accent : colors.success,
                  opacity: value.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.4, 1],
                  }),
                  transform: [
                    { translateY: value.interpolate({ inputRange: [0, 1], outputRange: [6, -10] }) },
                    { scale: value.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.15] }) },
                  ],
                },
              ]}
            />
          ))}
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Preparing your care journey</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Syncing your health records, providers, and care plans.
        </Text>

        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                transform: [
                  { scaleX: shimmer.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.35, 0.8, 0.95] }) },
                ],
              },
            ]}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['5xl'],
    paddingBottom: Spacing['4xl'],
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.32,
    transform: [{ scale: 1.4 }],
  },
  outerRing: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 110,
    borderWidth: 2,
  },
  innerRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 90,
    borderWidth: 1.5,
  },
  shimmer: {
    position: 'absolute',
    width: 52,
    height: 180,
    borderRadius: 999,
    opacity: 0.42,
    transform: [{ rotate: '18deg' }],
    top: '34%',
    left: '42%',
  },
  logoWrap: {
    marginTop: Spacing.xl,
    marginBottom: Spacing['2xl'],
    zIndex: 2,
  },
  dotCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing['2xl'],
  },
  serviceDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    ...Typography.display,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    maxWidth: 310,
    marginBottom: Spacing['3xl'],
  },
  progressTrack: {
    width: '76%',
    maxWidth: 240,
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '100%',
    borderRadius: 999,
    opacity: 0.92,
  },
});
