'use client'; // Reanimated 4 prefers this annotation on RN targets
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { Typography } from '@/constants/theme';

type ColorToken = 'hrRed' | 'o2Blue' | 'activityGreen';

const COLORS: Record<ColorToken, string> = {
  hrRed: '#EF4444',
  o2Blue: '#3B82F6',
  activityGreen: '#22C55E',
};

type Props = {
  /** 0..1 */
  value: number;
  unit?: string;
  label?: string;
  colorToken?: ColorToken;
};

/**
 * Circular health-metric indicator. Static outer track ring + animated inner
 * fill circle scaled into the full radius. Value animates on mount over ~900ms.
 */
export function VitalsRing({ value, unit = '', label, colorToken = 'hrRed' }: Props) {
  const fillColor = COLORS[colorToken ?? 'hrRed'];
  const progress = useSharedValue(0);
  const targetProgress = Math.max(0, Math.min(1, value));

  // drive animation whenever the incoming value changes
  if (targetProgress !== progress.value) {
    progress.value = withTiming(targetProgress, { duration: 900 });
  }

  // Reanimated handles the transform internally; merge into the host view via a
  // cast so TS doesn't reject the AnimatedStyleHandle as a ViewStyle.
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundSize: `${2 * 44 * progress.value}px 88px`,
  }));

  return (
    <View style={styles.wrap}>
      <View style={styles.track} />
      <View style={[styles.fill, { backgroundColor: fillColor }, animatedStyle as unknown as React.ComponentProps<typeof View>['style']]} />
      {label && <Text style={styles.label}>{label}</Text>}
      <Text style={styles.value}>
        {Number(value).toFixed(value >= 10 ? 0 : 1)}
        {unit ? ` ${unit}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginVertical: 8 },
  track: { width: 88, height: 88, borderRadius: 44, borderWidth: 7, borderColor: '#E2E8F0' },
  fill: { width: 88, height: 88, borderRadius: 44 },
  label: { ...Typography.captionMedium, marginTop: 4 },
  value: { fontSize: 24, fontWeight: '600' },
});
