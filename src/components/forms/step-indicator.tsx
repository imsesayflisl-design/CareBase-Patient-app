import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
};

export function StepHeader({ step, total, title, subtitle }: Props) {
  const { colors } = useTheme();
  const progress = Math.min(Math.max(step / total, 0), 1);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.progress, { color: colors.textSecondary }]}>
        Step {step} of {total}
      </Text>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 1, max: total, now: step }}
        style={[styles.track, { backgroundColor: colors.softBackground }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: colors.primary,
              width: `${progress * 100}%` as `${number}%`,
            },
          ]}
        />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: Spacing.lg, marginBottom: Spacing.xl, gap: Spacing.xs },
  progress: { ...Typography.small, fontWeight: '600' },
  track: {
    height: 4,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  fill: { height: '100%', borderRadius: Radius.full },
  title: { ...Typography.title },
  subtitle: { ...Typography.caption },
});
