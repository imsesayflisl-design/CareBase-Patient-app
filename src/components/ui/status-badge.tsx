import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  label: string;
  tone?: 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'primary';
};

export function StatusBadge({ label, tone = 'neutral' }: Props) {
  const { colors } = useTheme();

  const map: Record<typeof tone, { bg: string; fg: string }> = {
    neutral: { bg: colors.softBackground, fg: colors.textSecondary },
    success: { bg: colors.successSoft, fg: colors.accent },
    warning: { bg: colors.warningSoft, fg: colors.warning },
    error: { bg: colors.errorSoft, fg: colors.error },
    info: { bg: colors.infoSoft, fg: colors.info },
    primary: { bg: colors.primarySoft, fg: colors.primaryDeep },
  };

  const toneColors = map[tone];

  return (
    <View style={[styles.badge, { backgroundColor: toneColors.bg }]}>
      <Text style={[styles.label, { color: toneColors.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  label: {
    ...Typography.small,
    fontWeight: '600' as const,
    textTransform: 'capitalize',
  },
});
