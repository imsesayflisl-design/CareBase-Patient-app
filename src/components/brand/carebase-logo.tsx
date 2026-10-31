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
  const box = size === 'lg' ? 94 : size === 'sm' ? 42 : 68;
  const icon = size === 'lg' ? 32 : size === 'sm' ? 16 : 24;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.markShell,
          {
            width: box + 12,
            height: box + 12,
            borderRadius: box * 0.36,
            backgroundColor: 'rgba(13, 148, 136, 0.08)',
          },
        ]}>
        <View
          style={[
            styles.mark,
            {
              width: box,
              height: box,
              borderRadius: box * 0.28,
              backgroundColor: Brand.primary,
              shadowColor: Brand.primary,
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.24,
              shadowRadius: 20,
              elevation: 8,
            },
          ]}>
          <View style={[styles.cross, { width: icon * 0.66, height: icon * 1.2 }]} />
          <View style={[styles.crossBar, { width: icon * 1.2, height: icon * 0.22 }]} />
          <View style={styles.orbit} />
        </View>
      </View>

      {showWordmark ? (
        <View style={styles.textCol}>
          <Text style={[styles.wordmark, { color: colors.text, fontSize: size === 'lg' ? 30 : 20 }]}>CareBase</Text>
          {tagline ? (
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>Better Health. Closer to You.</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: Spacing.md },
  markShell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.12)',
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  cross: {
    position: 'absolute',
    borderRadius: Radius.sm,
    backgroundColor: '#FFFFFF',
    opacity: 0.98,
    transform: [{ rotate: '90deg' }],
  },
  crossBar: {
    position: 'absolute',
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    opacity: 0.98,
  },
  orbit: {
    position: 'absolute',
    right: 18,
    bottom: 16,
    width: 16,
    height: 16,
    borderRadius: Radius.full,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  textCol: { alignItems: 'center', gap: 4 },
  wordmark: { ...Typography.title, fontWeight: '700' },
  tagline: { ...Typography.caption, textAlign: 'center' },
});
