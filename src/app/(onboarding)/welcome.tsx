import { Link, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { setOnboardingComplete } from '@/lib/storage/onboarding';

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Screen style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.mockupRow}>
          <View style={[styles.phone, styles.phoneGreen]}>
            <View style={styles.statusRow}>
              <Text style={styles.time}>9:41</Text>
              <View style={styles.statusIcons}>
                <View style={styles.signal} />
                <View style={styles.wifi} />
                <View style={styles.battery} />
              </View>
            </View>
            <View style={styles.brandCenter}>
              <View style={styles.logoBadge}>
                <Image source={require('../../../logo_shield.png')} style={styles.logoShield} resizeMode="contain" />
              </View>
              <Text style={styles.brandText}>CareBase</Text>
            </View>
            <View style={styles.bottomLine} />
          </View>

          <View style={[styles.phone, styles.phonePurple]}>
            <View style={styles.statusRow}>
              <Text style={styles.time}>9:41</Text>
              <View style={styles.statusIcons}>
                <View style={styles.signal} />
                <View style={styles.wifi} />
                <View style={styles.battery} />
              </View>
            </View>
            <View style={styles.brandCenter}>
              <View style={styles.logoBadge}>
                <Image source={require('../../../logo_shield.png')} style={styles.logoShield} resizeMode="contain" />
              </View>
              <Text style={styles.brandText}>CareBase</Text>
            </View>
            <View style={styles.bottomLine} />
          </View>

          <View style={[styles.phone, styles.phoneWhite]}>
            <View style={styles.statusRow}>
              <Text style={styles.timeWhite}>9:41</Text>
              <View style={styles.statusIconsWhite}>
                <View style={styles.signalWhite} />
                <View style={styles.wifiWhite} />
                <View style={styles.batteryWhite} />
              </View>
            </View>
            <Text style={styles.whiteTitle}>CareBase</Text>
            <View style={styles.cardIllustration}>
              <View style={styles.deviceCard} />
              <View style={styles.deviceBadge} />
            </View>
            <Text style={styles.whiteBody}>Instant care in your hands</Text>
            <View style={styles.ctaRow}>
              <View style={styles.primaryButton} />
            </View>
            <Text style={styles.legalText}>By continuing you agree to our Terms and Privacy Policy.</Text>
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

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#090909',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing['4xl'],
    paddingBottom: Spacing.xl,
  },
  mockupRow: {
    width: '100%',
    maxWidth: 920,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 20,
  },
  phone: {
    width: 220,
    height: 540,
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingTop: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
  phoneGreen: {
    backgroundColor: '#B9F157',
  },
  phonePurple: {
    backgroundColor: '#6052F7',
  },
  phoneWhite: {
    backgroundColor: '#F5F3F4',
    width: 240,
    height: 560,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
    marginBottom: 90,
  },
  time: {
    fontSize: 12,
    fontWeight: '700',
    color: '#091410',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signal: {
    width: 15,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#091410',
    opacity: 0.8,
  },
  wifi: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: '#091410',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRadius: 12,
    transform: [{ rotate: '45deg' }],
    opacity: 0.8,
  },
  battery: {
    width: 20,
    height: 10,
    borderWidth: 2,
    borderColor: '#091410',
    borderRadius: 3,
    opacity: 0.8,
  },
  brandCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#0E1119',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#091410',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  logoShield: {
    width: 62,
    height: 62,
  },
  brandText: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: '700',
    color: '#0B1417',
    letterSpacing: -0.5,
  },
  bottomLine: {
    position: 'absolute',
    bottom: 18,
    left: 42,
    right: 42,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(9, 20, 16, 0.18)',
  },
  timeWhite: {
    fontSize: 12,
    fontWeight: '700',
    color: '#101010',
  },
  statusIconsWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signalWhite: {
    width: 15,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#0F172A',
    opacity: 0.85,
  },
  wifiWhite: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: '#0F172A',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRadius: 12,
    transform: [{ rotate: '45deg' }],
    opacity: 0.85,
  },
  batteryWhite: {
    width: 20,
    height: 10,
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 3,
    opacity: 0.85,
  },
  whiteTitle: {
    marginTop: 52,
    fontSize: 30,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
  },
  cardIllustration: {
    marginTop: 28,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  deviceCard: {
    width: 120,
    height: 90,
    borderRadius: 18,
    backgroundColor: '#D9D7F7',
    borderWidth: 2,
    borderColor: '#D7D2FB',
    shadowColor: '#A4A0EA',
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  deviceBadge: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#10B981',
    bottom: 12,
    right: 38,
    shadowColor: '#20C997',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  whiteBody: {
    marginTop: 12,
    fontSize: 15,
    color: '#1D2430',
    textAlign: 'center',
  },
  ctaRow: {
    marginTop: 20,
    alignItems: 'center',
  },
  primaryButton: {
    width: 150,
    height: 42,
    borderRadius: 16,
    backgroundColor: '#5B68FF',
    shadowColor: '#5B68FF',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  legalText: {
    marginTop: 18,
    fontSize: 9,
    lineHeight: 12,
    color: '#5E6573',
    textAlign: 'center',
    paddingHorizontal: 18,
  },
  actions: { gap: Spacing.md, paddingBottom: Spacing['2xl'], paddingHorizontal: 20 },
  legal: { ...Typography.small, textAlign: 'center', marginTop: Spacing.sm },
});
