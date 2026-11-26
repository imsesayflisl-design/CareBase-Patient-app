import { Pressable, StyleSheet, Text, type ColorValue, type ViewStyle } from 'react-native';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSpringPressStyle } from '@/components/motion/use-spring-press';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

// Disabled background colors — material chip style for disabled states
const DisabledBg: Record<Variant, ColorValue> = {
  primary: '#E2E8F0',
  secondary: '#E2E8F0',
  outline: 'transparent',
  ghost: 'transparent',
  danger: '',
  accent: '#DBEAFE',
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}: Props) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  const backgrounds: Record<Variant, string> = {
    primary: colors.accent,
    secondary: colors.softBackground,
    outline: 'transparent',
    ghost: 'transparent',
    danger: colors.errorSoft,
    accent: colors.accent,
  };

  const textColors: Record<Variant, string> = {
    primary: '#FFFFFF',
    secondary: colors.text,
    outline: colors.textSecondary,
    ghost: colors.textSecondary,
    danger: '#FFFFFF',
    accent: '#FFFFFF',
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: isDisabled ? DisabledBg[variant] : backgrounds[variant],
          borderColor: variant === 'outline' ? colors.border : undefined,
          borderWidth: variant === 'outline' ? 1 : 0,
          opacity: isDisabled ? 0.5 : pressed ? 0.92 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        // spring press visual feedback on health-surface buttons
        useSpringPressStyle().style(pressed),
        style,
      ]}
    >
      {loading ? (
        <Text style={[styles.label, { color: textColors[variant] === '#FFFFFF' ? colors.accent : textColors[variant] }]}>
          {String(title)}
        </Text>
      ) : (
        <Text style={[styles.label, { color: textColors[variant] }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  label: {
    ...Typography.formInput,
    fontWeight: '600',
  },
});
