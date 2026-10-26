import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  label: string;
  value?: string | null;
  onPress?: () => void;
  emphasize?: boolean;
  last?: boolean;
};

export function InfoRow({ label, value, onPress, emphasize, last }: Props) {
  const { colors } = useTheme();
  const display = value && value.length > 0 ? value : '—';

  const content = (
    <View
      style={[
        styles.row,
        { borderBottomColor: colors.border },
        last ? styles.noBorder : null,
      ]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text
        style={[
          styles.value,
          { color: onPress ? colors.primary : emphasize ? colors.text : colors.text },
          emphasize ? styles.valueStrong : null,
        ]}>
        {display}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button">
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  noBorder: { borderBottomWidth: 0 },
  label: { ...Typography.caption, flexShrink: 0 },
  value: { ...Typography.captionMedium, flex: 1, textAlign: 'right' },
  valueStrong: { ...Typography.bodyMedium, textAlign: 'right' },
});
