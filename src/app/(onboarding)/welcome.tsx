import { Link, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { CareBaseLogo } from '@/components/brand/carebase-logo';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { setOnboardingComplete } from '@/lib/storage/onboarding';

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.hero}>
        <CareBaseLogo size="lg" tagline />
        <Text style={[styles.headline, { color: colors.text }]}>Your Health, Our Priority.</Text>
        <Text style={[styles.support, { color: colors.textSecondary }]}>
          Access hospitals, doctors, pharmacies, scans, and your healthcare records in one
          convenient app.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Get Started"
          onPress={async () => {
            await setOnboardingComplete(true);
            router.push('/(onboarding)/intro');
          }}
        />
        <Button
          title="I Already Have an Account"
          variant="outline"
          onPress={async () => {
            await setOnboardingComplete(true);
            router.push('/(auth)/sign-in');
          }}
        />
        <Text style={[styles.legal, { color: colors.textSecondary }]}>
          By continuing you agree to our{' '}
          <Link href="/support" style={{ color: colors.primary }}>
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/support" style={{ color: colors.primary }}>
            Privacy Policy
          </Link>
          .
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingTop: Spacing['4xl'],
  },
  headline: { ...Typography.display, textAlign: 'center' },
  support: { ...Typography.body, textAlign: 'center' },
  actions: { gap: Spacing.md, paddingBottom: Spacing['2xl'] },
  legal: { ...Typography.small, textAlign: 'center', marginTop: Spacing.sm },
});
