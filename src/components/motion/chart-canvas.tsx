'use client'; // Reanimated 4 prefers this annotation on RN targets
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { StyleSheet, View, Text } from 'react-native';
import { Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type DotProps = { x: number; y: number };

function Dot({ x, y }: DotProps) {
  const dy = useSharedValue(24);
  if (dy.value !== y) {
    dy.value = withTiming(y, { duration: 700 });
  }
  return <View style={styles.dot} />;
}

const COLORS = { hrRed: '#EF4444', o2Blue: '#3B82F6', activityGreen: '#22C55E' };

/**
 * Health trend graph: a sequence of rising dots placed along the x axis,
 * each dot animating from below its target Y into place on mount. Horizontal
 * layout is 100% lane span split evenly across the data points.
 */
export function ChartCanvas({ data, label }: { data: number[]; label?: string }) {
  const length = Math.max(1, data.length);

  return (
    <View style={styles.wrap}>
      {label && <Text style={styles.caption}>{label}</Text>}
      <View style={styles.lane}>
        {data.map((value, i) => {
          const xPct = length > 1 ? (i / (length - 1)) * 100 : 0;
          const yPct = 95 - value * 80;
          return <Dot key={i} x={xPct} y={yPct} />;
        })}
      </View>
    </View>
  );
}

void COLORS;
void useTheme;

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginVertical: 6 },
  lane: { width: 320, height: 110, overflow: 'hidden', borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: StyleSheet.hairlineWidth, borderColor: '#E2E8F0' },
  dot: { width: 12, height: 12, borderRadius: 6, opacity: 1 },
  caption: { ...Typography.caption, textAlign: 'center', marginBottom: 4 },
});
