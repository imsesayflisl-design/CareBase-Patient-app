import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Tone = 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'primary';

type Props = {
  label: string;
  tone?: Tone;
};

export function StatusBadge({ label, tone = 'neutral' }: Props) {
  const { colors, isDark } = useTheme();

  const map: Record<Tone, { bg: string; fg: string }> = {
    neutral: { bg: colors.softBackground, fg: colors.textSecondary },
    success: { bg: colors.successSoft, fg: isDark ? colors.success : '#15803D' },
    warning: { bg: colors.warningSoft, fg: isDark ? colors.warning : '#B45309' },
    error: { bg: colors.errorSoft, fg: isDark ? colors.error : '#B91C1C' },
    info: { bg: colors.infoSoft, fg: isDark ? colors.info : '#1D4ED8' },
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
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
