import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const SLIDES = [
  {
    title: 'Find healthcare near you',
    body: 'Discover hospitals, doctors, and pharmacies around you — even on affordable Android phones.',
  },
  {
    title: 'Book appointments and medical services',
    body: 'Request appointments, scans, and hospital beds. Hospitals confirm through the shared CareBase system.',
  },
  {
    title: 'Keep your healthcare information organized',
    body: 'View prescriptions, reports, and health readings securely in one place.',
  },
];

export default function IntroScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <Screen>
      <View style={styles.topRow}>
        <Button title="Skip" variant="ghost" fullWidth={false} onPress={() => router.push('/(auth)/sign-up')} />
      </View>

      <View style={styles.hero}>
        <View style={[styles.orb, { backgroundColor: colors.softBackground }]}>
          <Text style={{ fontSize: 40, color: colors.primary }}>{index + 1}</Text>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{slide.title}</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>{slide.body}</Text>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === index ? colors.primary : colors.border,
                  width: i === index ? 22 : 8,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        {index > 0 ? (
          <Button title="Back" variant="outline" onPress={() => setIndex((v) => v - 1)} />
        ) : null}
        <Button
          title={isLast ? 'Continue' : 'Continue'}
          onPress={() => {
            if (isLast) router.push('/(auth)/sign-up');
            else setIndex((v) => v + 1);
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: { alignItems: 'flex-end', marginTop: Spacing.sm },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  orb: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: { ...Typography.title, textAlign: 'center' },
  body: { ...Typography.body, textAlign: 'center' },
  dots: { flexDirection: 'row', gap: 8, marginTop: Spacing.lg },
  dot: { height: 8, borderRadius: 4 },
  actions: { gap: Spacing.md, paddingBottom: Spacing['2xl'] },
});
