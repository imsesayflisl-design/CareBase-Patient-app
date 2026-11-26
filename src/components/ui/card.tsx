import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  style?: object;
  padded?: boolean;
};

export function Card({ children, onPress, style, padded = true }: Props) {
  const { colors } = useTheme();

  const body = (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        style,
      ]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
        {body}
      </Pressable>
    );
  }

  return body;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  padded: {
    padding: Spacing.lg,
  },
});