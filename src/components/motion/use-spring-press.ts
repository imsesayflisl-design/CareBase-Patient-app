'use client'; // Reanimated 4 prefers this annotation on RN targets
import { useSharedValue } from 'react-native-reanimated';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

/**
 * Weighted spring press response for health-surface cards / buttons.
 * Returns a `style` function that reads `pressed` live from the Pressable
 * press event and overrides opacity/transform in Reanimated so the feedback
 * feels responsive even when shared values are stuck at their initial state.
 */
export function useSpringPressStyle(): { style: (pressed: boolean) => ViewStyle } {
  const opacity = useSharedValue(1);
  const transformY = useSharedValue(0);

  return {
    style: (pressed: boolean) => ({
      opacity: pressed ? 0.88 : opacity.value,
      transform: [{ translateY: pressed ? 2 : transformY.value }, { scale: pressed ? 0.99 : 1 }],
    }),
  };
}
