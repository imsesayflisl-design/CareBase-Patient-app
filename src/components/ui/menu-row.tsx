import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { HitSlop, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

type Props = {
  icon: IconName;
  label: string;
  description?: string;
  onPress?: () => void;
  last?: boolean;
  tone?: 'default' | 'danger';
  trailingText?: string;
};

export function MenuRow({
  icon,
  label,
  description,
  onPress,
  last = false,
  tone = 'default',
  trailingText,
}: Props) {
  const { colors } = useTheme();
  const isDanger = tone === 'danger';
  const foreground = isDanger ? colors.error : colors.text;

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={description ? `${label}. ${description}` : label}
      hitSlop={HitSlop}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.border },
        last && styles.last,
        { opacity: pressed ? 0.6 : 1 },
      ]}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={20} color={isDanger ? colors.error : colors.primary} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.label, { color: foreground }]}>{label}</Text>
        {description ? (
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {description}
          </Text>
        ) : null}
      </View>
      {trailingText ? (
        <Text style={[styles.trailing, { color: colors.textSecondary }]}>{trailingText}</Text>
      ) : null}
      {onPress ? (
        <Ionicons
          name="chevron-forward"
          size={17}
          color={isDanger ? colors.error : colors.textSecondary}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  last: { borderBottomWidth: 0 },
  icon: { width: 24, alignItems: 'center' },
  copy: { flex: 1, gap: 1 },
  label: { ...Typography.bodyMedium },
  description: { ...Typography.small },
  trailing: { ...Typography.caption },
});
