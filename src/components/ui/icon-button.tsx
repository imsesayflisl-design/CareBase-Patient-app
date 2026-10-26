import type { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

type Props = {
  icon: IconName;
  label: string;
  onPress: () => void;
  tone?: 'soft' | 'plain' | 'danger';
  size?: number;
};

export function IconButton({ icon, label, onPress, tone = 'soft', size = 21 }: Props) {
  const { colors } = useTheme();

  const backgroundColor =
    tone === 'soft' ? colors.softBackground : tone === 'danger' ? colors.errorSoft : 'transparent';
  const color = tone === 'danger' ? colors.error : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, opacity: pressed ? 0.65 : 1 },
      ]}>
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
