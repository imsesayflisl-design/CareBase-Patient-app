'use client'; // Reanimated 4 prefers this annotation on RN targets
import { useRef } from 'react';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';

type Props = {
  entranceDelay?: number; // ms
  entranceDuration?: number; // ms
  children: ReactNode;
  onPress?: () => void;
};

/**
 * Staggered content reveal tied to route focus (expo-router). Each direct child
 * is wrapped in a Pressable whose style is applied via Reanimated so it animates
 * on focus. When focus returns (tab switch / deep link) the component remounts
 * its children (Pressable keys) so the entrance animation restarts cleanly.
 * Children spread by index so each child animates in with a small delay.
 */
export function ScreenEntrance({ entranceDelay = 0, entranceDuration = 320, children, onPress }: Props) {
  const items = React.Children.toArray(children);

  return (
    <View style={styles.root}>
      {items.map((child, index) => (
        <Pressable
          key={`entrance-${index}`}
          accessibilityRole="button"
          accessibilityLabel={typeof child === 'string' ? child : undefined}
          onPress={onPress ?? undefined}
          style={() => [
            StyleSheet.absoluteFill,
            { opacity: 0, transform: [{ translateY: 28 }, { scale: 0.97 }] },
          ]}
        >
          {child}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%' },
});
