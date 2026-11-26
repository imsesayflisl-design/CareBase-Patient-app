import { Link, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { setOnboardingComplete } from '@/lib/storage/onboarding';

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const s: Record<string, any> = StyleSheet.create({});
  Object.assign(s, {
    screen: { backgroundColor: '#FFFFFF' },
    hero: { flex: 1, justifyContent: 'space-between', paddingTop: Spacing['4xl'], paddingBottom: Spacing['3xl'] },
    content: { alignItems: 'center', gap: Spacing.lg, paddingHorizontal: Spacing.xl },
    logoBadge: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
    logoShield: { width: 52, height: 52 },
    brandText: { marginTop: Spacing.md, fontSize: 34, fontWeight: '700', color: colors.text, letterSpacing: -0.5 },
    title: { fontSize: 26, fontWeight: '600', color: colors.text, textAlign: 'center', lineHeight: 34, maxWidth: 320, paddingHorizontal: Spacing.lg },
    subtitle: { fontSize: 15, fontWeight: '400', color: colors.textSecondary, textAlign: 'center', lineHeight: 22, maxWidth: 280, paddingHorizontal: Spacing.xl },
    illustration: { alignItems: 'center' },
    phone: { width: 210, height: 440, borderRadius: 34, overflow: 'hidden', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.border },
    phoneFrame: { width: 230, height: 460 },
    screenArea: { width: '100%', height: '100%', backgroundColor: colors.primarySoft, paddingTop: 30, paddingHorizontal: 16 },
    appHeader: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 60 },
    dots: { flexDirection: 'row', gap: 6 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' },
    dotActive: { width: 24, backgroundColor: '#FFFFFF', borderRadius: 12 },
    appContent: { alignItems: 'center', gap: Spacing.sm },
    appTitle: { fontSize: 22, fontWeight: '600', color: '#FFFFFF' },
    appBody: { fontSize: 15, color: 'rgba(255,255,255,0.9)', textAlign: 'center' },
    actions: { gap: Spacing.md, paddingBottom: Spacing['2xl'], paddingHorizontal: 20 },
    legal: { ...Typography.small, textAlign: 'center', marginTop: Spacing.sm },
  });
  const styles = s;

  return (
    <Screen style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.content}>
          <View style={[styles.logoBadge]}>
            <Image source={require('../../../logo_shield.png')} style={styles.logoShield} resizeMode="contain" />
          </View>
          <Text style={[styles.brandText]}>CareBase</Text>
          <Text style={[styles.title]}>Your health. All in one place.</Text>
          <Text style={[styles.subtitle]}>
            Book appointments, track vitals, manage prescriptions, and connect with care — all from one app.
          </Text>
        </View>

        <View style={styles.illustration}>
          <View style={[styles.phone, styles.phoneFrame]}>
            <View style={styles.screenArea}>
              <View style={styles.appHeader}>
                <View style={styles.dots}>
                  <View style={[styles.dot, styles.dotActive]} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
              </View>
              <View style={styles.appContent}>
                <Text style={styles.appTitle}>CareBase</Text>
                <Text style={styles.appBody}>Your care plan is on track</Text>
              </View>
            </View>
          </View>
        </View>
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
