import { StyleSheet, View, ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  height?: number;
  width?: number | `${number}%`;
  style?: ViewStyle;
};

export function Skeleton({ height = 16, width = '100%', style }: Props) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.base,
        { height, width, backgroundColor: colors.skeleton },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <Skeleton height={18} width="55%" />
      <Skeleton height={14} width="80%" style={{ marginTop: Spacing.sm }} />
      <Skeleton height={14} width="40%" style={{ marginTop: Spacing.sm }} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.sm,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
  },
});
