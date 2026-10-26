import { StyleSheet, Text, View } from 'react-native';

import { Brand, Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  tagline?: boolean;
};

export function CareBaseLogo({ size = 'md', showWordmark = true, tagline = false }: Props) {
  const { colors } = useTheme();
  const box = size === 'lg' ? 88 : size === 'sm' ? 40 : 64;
  const icon = size === 'lg' ? 36 : size === 'sm' ? 18 : 26;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.mark,
          {
            width: box,
            height: box,
            borderRadius: box * 0.28,
            backgroundColor: Brand.primary,
          },
        ]}>
        <Text style={[styles.cross, { fontSize: icon }]}>+</Text>
        <View style={[styles.heart, { borderColor: Brand.white }]} />
      </View>
      {showWordmark ? (
        <View style={styles.textCol}>
          <Text style={[styles.wordmark, { color: colors.text, fontSize: size === 'lg' ? 28 : 20 }]}>
            CareBase
          </Text>
          {tagline ? (
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>
              Better Health. Closer to You.
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: Spacing.md },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cross: {
    color: Brand.white,
    fontWeight: '700',
    lineHeight: 40,
  },
  heart: {
    position: 'absolute',
    bottom: 12,
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    borderWidth: 2,
    opacity: 0.9,
  },
  textCol: { alignItems: 'center', gap: 4 },
  wordmark: { ...Typography.title, fontWeight: '700' },
  tagline: { ...Typography.caption },
});
