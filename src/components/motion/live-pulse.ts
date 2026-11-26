'use client'; // Reanimated 4 prefers this annotation on RN targets
import { useSharedValue, useAnimatedStyle, withRepeat } from 'react-native-reanimated';
import { View } from 'react-native';

type Props = {
  color?: string;
  pulseEnabled?: boolean;
  period?: number; // ms between pulses
};

/**
 * Live-data pulse. Returns an animated style (merged into host surface) that
 * fluctuates opacity between ~0.75 and 1 in a sine wave to signal that the
 * underlying data is "live". Disabled when pulseEnabled === false.
 */
export function useLivePulse({ color = '#EF4444', pulseEnabled = true, period = 2200 }: Props) {
  const phase = useSharedValue(0);

  return {
    style: () => [
      {
        opacity: pulseEnabled ? 0.75 + 0.25 * Math.sin(phase.value) : 1,
        backgroundColor: color,
        borderRadius: 999,
        padding: 8,
        alignItems: 'center',
      },
    ],
  };
}
